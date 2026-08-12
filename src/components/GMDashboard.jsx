/* eslint-disable */
import React, { useState } from 'react';
import { bestiary } from '../data/bestiary';

const safeArray = (arr) => { if (!arr) return []; if (Array.isArray(arr)) return arr.filter(i => i !== null && i !== undefined); if (typeof arr === 'object') return Object.values(arr).filter(i => i !== null && i !== undefined); return []; };
const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const getSafeGrid = (g) => {
    const blankGrid = Array.from({ length: 150 }, () => ({ type: 'empty', terrain: null, terrainElement: null }));
    if (!g) return blankGrid;
    if (Array.isArray(g)) { g.forEach((cell, i) => { if (cell && i < 150) blankGrid[i] = { ...blankGrid[i], ...cell }; }); return blankGrid; }
    if (typeof g === 'object') { Object.keys(g).forEach(key => { const i = parseInt(key); if (!isNaN(i) && i >= 0 && i < 150 && g[key]) blankGrid[i] = { ...blankGrid[i], ...g[key] }; }); return blankGrid; }
    return blankGrid;
};

const getCoreState = (input) => {
    if (!input) return ''; const match = String(input).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(input)).toLowerCase().trim();
    const STATE_DICTIONARY = { 'Bleed': ['bleed'], 'Burn': ['burn'], 'Poisoned': ['poison'], 'Knockdown': ['knockdown'] };
    for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; }
    return String(input);
};

const processEOT = (state, tokenId) => {
    if (!tokenId) return state; const s = deepClone(state); const tIdx = safeArray(s.tokens).findIndex(t => t && t.id === tokenId);
    if (tIdx === -1) return s; const t = s.tokens[tIdx];
    let dmg = 0; let logStr = ''; const grid = getSafeGrid(s.grid);
    if (t.pos !== null && t.pos !== undefined) { const cell = grid[t.pos]; if (cell && cell.terrain === 'major') { dmg += 5; logStr += '[Major Terrain] 5 Dmg. '; } }
    let statuses = [];
    if (t.type === 'player' && s.players?.[t.refId]) statuses = safeArray(s.players[t.refId].statuses);
    else if (t.type === 'enemy') { const e = safeArray(s.encounter?.enemies).find(en => en && en.uid === t.refId); if (e) statuses = safeArray(e.statuses); }
    const coreStates = statuses.map(st => getCoreState(st));
    if (coreStates.includes('Bleed')) { dmg += 1; logStr += '[Bleed] 1 Dmg. '; }
    if (coreStates.includes('Burn')) { dmg += 2; logStr += '[Burn] 2 Dmg. '; }
    if (coreStates.includes('Poisoned')) { dmg += 1; logStr += '[Poisoned] 1 Dmg. '; }
    if (dmg > 0) {
        let isDead = false; let entName = 'Entity'; let expGained = 0;
        if (t.type === 'player' && s.players?.[t.refId]) {
            const p = s.players[t.refId]; const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0; const derivedMaxHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1);
            p.currentHp = Math.max(0, (p.currentHp !== undefined ? p.currentHp : derivedMaxHp) - dmg); entName = p.name || 'Agent'; if (p.currentHp <= 0) isDead = true;
        } else if (t.type === 'enemy') {
            const eIdx = safeArray(s.encounter?.enemies).findIndex(en => en && en.uid === t.refId);
            if (eIdx !== -1) { s.encounter.enemies[eIdx].currentHp = Math.max(0, safeInt(s.encounter.enemies[eIdx].currentHp) - dmg); entName = s.encounter.enemies[eIdx].name; if (s.encounter.enemies[eIdx].currentHp <= 0) { isDead = true; expGained = safeInt(s.encounter.enemies[eIdx].exp || (s.encounter.enemies[eIdx].tier * 10)); } }
        } else if (t.type === 'echo') {
            t.currentHp = Math.max(0, safeInt(t.currentHp) - dmg); entName = 'Tactical Echo'; if (t.currentHp <= 0) isDead = true;
        }
        let finalLog = `>> END OF TURN [${entName}]: ${logStr}HP reduced by ${dmg}.`;
        if (isDead) {
            finalLog += ` => FATAL. Entity erased.`;
            if (t.type === 'enemy') { s.encounter.enemies = s.encounter.enemies.filter(en => en.uid !== t.refId); s.tokens = s.tokens.filter(tok => tok.id !== t.id); s.encounter.pendingExp = safeInt(s.encounter.pendingExp) + expGained; } 
            else if (t.type === 'echo') { s.tokens = s.tokens.filter(tok => tok.id !== t.id); }
        }
        s.encounter.logFeed = [...safeArray(s.encounter?.logFeed), { id: Date.now().toString() + Math.random().toString(), text: finalLog }].slice(-50);
    }
    return s;
};

class GMDashboardErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("GM Dashboard Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) return ( <div className="bg-[#0f172a] border border-red-600 p-8 font-mono text-slate-200 flex flex-col items-center justify-center text-center space-y-4 m-10"> <h2 className="text-2xl font-bold text-red-500 uppercase tracking-widest">⚠ GM Terminal Error</h2> <p className="text-xs text-gray-400 max-w-md">The dashboard experienced a telemetry sync anomaly: {String(this.state.error?.message || 'Data stream interrupted')}</p> <button className="bg-red-600 text-black font-bold px-6 py-3 uppercase text-xs hover:bg-white transition-colors" onClick={() => this.setState({ hasError: false })}> Reboot Dashboard </button> </div> );
        return this.props.children;
    }
}

function GMDashboardInner({ encounter = {}, tokens = [], players = {}, pushUpdate, hardResetSession }) {
    const [selectedBestiaryId, setSelectedBestiaryId] = useState(bestiary[0]?.id || 'e01');
    const [spawnMode, setSpawnMode] = useState('immediate');
    const [spawnRound, setSpawnRound] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const safeEnc = encounter || {};
    const enemies = safeArray(safeEnc.enemies);

    const endEncounter = () => {
        if (!window.confirm("End combat and wipe the grid for the next encounter?\n\nThis will distribute pending EXP, clear all terrain/enemies, and reset Agent states.")) return;
        pushUpdate(rawS => {
            const s = processEOT(rawS, rawS.encounter?.activeTokenId);
            const pClone = deepClone(s.players || {});
            const finalExp = safeInt(s.encounter?.pendingExp);
            Object.values(pClone).forEach(p => { if (p) { p.usedBasicAttack = false; p.usedParry = false; p.usedEvade = false; p.statuses = []; if (finalExp > 0) p.xp = safeInt(p.xp) + finalExp; } });
            if (finalExp > 0) alert(`Encounter Secure. Distributed ${finalExp} EXP to all Agents.`);
            return { ...s, tokens: [], grid: Array.from({ length: 150 }, () => ({ type: 'empty', terrain: null, terrainElement: null })), activeAction: null, players: pClone, encounter: { ...s.encounter, round: 0, enemies: [], initiativeQueue: [], activeTokenId: null, enemyPoolTotal: 10, pendingExp: 0, logFeed: [] } };
        });
    };

    const deployEnemy = () => {
        const template = bestiary.find(e => String(e.id) === String(selectedBestiaryId));
        if (!template) return alert("Select a valid hostile template.");
        const newUid = `enemy-${Date.now()}-${Math.floor(Math.random()*1000)}`;
        const newHostile = { uid: newUid, name: template.name, tier: template.tier, exp: template.exp || (template.tier * 10), affinity: template.affinity, maxHp: template.hp, currentHp: template.hp, barriers: [...(template.barriers || [])], currentBarriers: [...(template.barriers || [])], abilities: template.abilities || [], statuses: [], spawnMode: spawnMode, spawnRound: spawnMode === 'round' ? safeInt(spawnRound) : 0, isActive: spawnMode === 'immediate', staggered: false };
        pushUpdate(s => ({ ...s, encounter: { ...(s.encounter || {}), enemies: [...safeArray(s.encounter?.enemies), newHostile] } }));
    };

    const removeEnemy = (uid) => {
        if (!window.confirm("Permanently purge this hostile from the encounter?")) return;
        pushUpdate(s => {
            const enc = s.encounter || {}; const currentEnemies = safeArray(enc.enemies).filter(e => e && String(e.uid) !== String(uid));
            const currentTokens = safeArray(s.tokens).filter(t => !(t && t.type === 'enemy' && String(t.refId) === String(uid)));
            const currentQueue = safeArray(enc.initiativeQueue).filter(id => id !== uid);
            return { ...s, tokens: currentTokens, encounter: { ...enc, enemies: currentEnemies, initiativeQueue: currentQueue } };
        });
    };

    const advanceRound = () => {
        pushUpdate(rawS => {
            const s = processEOT(rawS, rawS.encounter?.activeTokenId);
            const enc = s.encounter || {}; const nextRound = (enc.round || 0) + 1;
            let currentEnemies = safeArray(enc.enemies).map(e => { if (e && !e.isActive && e.spawnMode === 'round' && e.spawnRound === nextRound) return { ...e, isActive: true }; return e; });
            const activeTokens = safeArray(s.tokens);
            
            const playerTokens = activeTokens.filter(t => t && t.type === 'player');
            const enemyTokens = activeTokens.filter(t => t && t.type === 'enemy');
            
            for (let i = playerTokens.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [playerTokens[i], playerTokens[j]] = [playerTokens[j], playerTokens[i]]; }
            for (let i = enemyTokens.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [enemyTokens[i], enemyTokens[j]] = [enemyTokens[j], enemyTokens[i]]; }
            const queue = [...playerTokens.map(t => t.id), ...enemyTokens.map(t => t.id)].filter(Boolean);

            const activeEnemyList = currentEnemies.filter(e => e.isActive && e.currentHp > 0);
            const totalTiers = activeEnemyList.reduce((sum, e) => sum + safeInt(e.tier), 0);
            
            let newPool = safeInt(enc.enemyPoolTotal);
            if (nextRound === 1) { newPool = Math.min(10, totalTiers); } 
            else { let resGain = Math.max(1, Math.floor(totalTiers / 2)); if (nextRound >= 4) resGain *= 2; newPool = Math.min(100, newPool + resGain); }

            const pClone = deepClone(s.players || {});
            Object.values(pClone).forEach(p => { 
                if (p) { 
                    p.usedBasicAttack = false; p.usedParry = false; p.usedEvade = false; if (p.resPool > 10) p.resPool = 10; 
                    if (nextRound === 1) { const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0; p.currentHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1); }
                } 
            });

            const newTokens = deepClone(activeTokens);
            newTokens.forEach(t => {
                if (t) {
                    let baseSpeed = t.speed ?? 3; let statuses = [];
                    if (t.type === 'player' && pClone[t.refId]) statuses = safeArray(pClone[t.refId].statuses);
                    else if (t.type === 'enemy') { const e = currentEnemies.find(en => en.uid === t.refId); if (e) statuses = safeArray(e.statuses); }
                    let finalSpeed = baseSpeed;
                    const coreStates = statuses.map(st => { const match = String(st).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(st)).toLowerCase().trim(); if (clean.includes('knockdown')) return 'Knockdown'; if (clean.includes('slow')) return 'Slowed'; if (clean.includes('haste') || clean.includes('speed')) return 'Haste'; if (clean.includes('stun') || clean.includes('immobil')) return 'Stunned'; return ''; });
                    if (coreStates.includes('Knockdown')) finalSpeed = Math.floor(baseSpeed / 2); if (coreStates.includes('Slowed')) finalSpeed = Math.max(0, finalSpeed - 2); if (coreStates.includes('Haste')) finalSpeed += 2; if (coreStates.includes('Stunned')) finalSpeed = 0;
                    t.movementRemaining = finalSpeed;
                }
            });

            return { ...s, tokens: newTokens, players: pClone, encounter: { ...enc, round: nextRound, enemies: currentEnemies, enemyPoolTotal: newPool, initiativeQueue: queue, activeTokenId: queue[0] || null } };
        });
    };

    const nextTurn = () => {
        pushUpdate(rawS => {
            const s = processEOT(rawS, rawS.encounter?.activeTokenId);
            const enc = s.encounter || {}; const q = safeArray(enc.initiativeQueue); if (q.length === 0) return s;
            const pClone = deepClone(s.players || {});
            if (enc.activeTokenId) { const oldToken = safeArray(s.tokens).find(t => t && t.id === enc.activeTokenId); if (oldToken && oldToken.type === 'player' && pClone[oldToken.refId]) { if (pClone[oldToken.refId].resPool > 10) pClone[oldToken.refId].resPool = 10; } }
            let currentIdx = q.indexOf(enc.activeTokenId); let nextId = q[(currentIdx + 1) % q.length];
            return { ...s, players: pClone, encounter: { ...enc, activeTokenId: nextId } };
        });
    };

    const prevTurn = () => { pushUpdate(s => { const enc = s.encounter || {}; const q = safeArray(enc.initiativeQueue); if (q.length === 0) return s; let currentIdx = q.indexOf(enc.activeTokenId); let prevId = currentIdx > 0 ? q[currentIdx - 1] : q[q.length - 1]; return { ...s, encounter: { ...enc, activeTokenId: prevId } }; }); };
    const setActiveToken = (tokenId) => { pushUpdate(s => ({ ...s, encounter: { ...(s.encounter || {}), activeTokenId: tokenId } })); };
    const moveInQueue = (idx, dir) => { pushUpdate(s => { const enc = s.encounter || {}; let q = [...safeArray(enc.initiativeQueue)]; if (idx + dir >= 0 && idx + dir < q.length) { const temp = q[idx]; q[idx] = q[idx + dir]; q[idx + dir] = temp; } return { ...s, encounter: { ...enc, initiativeQueue: q } }; }); };

    const filteredBestiary = bestiary.filter(e => e.name.toLowerCase().includes(searchTerm.toLowerCase()) || String(e.tier).includes(searchTerm));

    return (
        <div className="bg-[#0f172a] border border-slate-700 p-6 md:p-10 font-mono text-gray-300 shadow-inner space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-gray-700 pb-4 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-[#a855f7] uppercase tracking-widest mb-1">GM Operations Command</h1>
                    <p className="text-gray-500 text-xs tracking-wider uppercase">Hostile Deployment, Encounter Flow & Global Resource Control</p>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="bg-[#1e293b] border border-gray-700 px-4 py-2 text-right hidden sm:block shadow-md">
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">Encounter Exp Pool</div>
                        <div className="text-xl font-bold text-[#22c55e]">{safeEnc.pendingExp ?? 0} EXP</div>
                    </div>
                    <div className="bg-[#1e293b] border border-gray-700 px-4 py-2 text-right hidden sm:block shadow-md">
                        <div className="text-[10px] text-gray-400 uppercase tracking-widest">Global Hostile Res</div>
                        <div className="text-xl font-bold text-[#a855f7]">{safeEnc.enemyPoolTotal ?? 10} RES</div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button className="bg-yellow-600 text-black font-bold px-4 py-1.5 uppercase text-xs hover:bg-white transition-colors" onClick={endEncounter}>⏹ End Encounter & Distribute EXP</button>
                        <button className="bg-red-950 border border-red-600 text-red-400 font-bold px-4 py-1.5 uppercase text-xs hover:bg-red-600 hover:text-white transition-colors" onClick={hardResetSession}>⚠ Hard Reset Campaign</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="space-y-6">
                    <div className="bg-[#1e293b] border border-gray-700 p-5 space-y-4 shadow-md">
                        <h2 className="text-[#d1d5db] font-bold text-lg uppercase tracking-widest border-b border-gray-700 pb-2">Initiative & Turn Flow</h2>
                        <div className="flex justify-between items-center bg-[#0f172a] p-3 border border-gray-700 shadow-inner">
                            <div><div className="text-xs text-gray-400 uppercase">Current Phase</div><div className="text-lg font-bold text-white">{safeEnc.round === 0 ? 'Deployment Phase' : `Round ${safeEnc.round}`}</div></div>
                            <div className="text-right">
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Active Pool</div>
                                <div className="flex gap-2 justify-end mt-1">
                                    <button className="bg-gray-800 text-white px-2 py-0.5 font-bold text-xs border border-gray-600 hover:bg-red-900 transition-colors" onClick={() => pushUpdate(s => ({ ...s, encounter: { ...(s.encounter || {}), enemyPoolTotal: Math.max(0, safeInt(s.encounter?.enemyPoolTotal ?? 10) - 1) } }))}>-1</button>
                                    <button className="bg-gray-800 text-white px-2 py-0.5 font-bold text-xs border border-gray-600 hover:bg-green-900 transition-colors" onClick={() => pushUpdate(s => ({ ...s, encounter: { ...(s.encounter || {}), enemyPoolTotal: safeInt(s.encounter?.enemyPoolTotal ?? 10) + 1 } }))}>+1</button>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="flex-1 bg-gray-800 text-white font-bold py-2 text-xs uppercase hover:bg-[#a855f7] hover:text-white transition-colors" onClick={prevTurn}>↶ Prev Turn</button>
                            <button className="flex-1 bg-[#d1d5db] text-black font-bold py-2 text-xs uppercase hover:bg-white transition-colors" onClick={nextTurn}>Next Turn ↷</button>
                        </div>

                        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                            {safeArray(safeEnc.initiativeQueue).length === 0 && <div className="text-xs text-gray-600 italic">Queue uninitialized.</div>}
                            {safeArray(safeEnc.initiativeQueue).map((tokenId, idx) => {
                                const t = safeArray(tokens).find(tk => tk && tk.id === tokenId); if (!t) return null;
                                const isAct = safeEnc.activeTokenId === tokenId; let name = 'Unknown'; let tColor = '#555';
                                if (t.type === 'player') { name = players[t.refId]?.name || 'Agent'; tColor = '#d1d5db'; } 
                                else if (t.type === 'echo') { name = 'Tactical Echo'; tColor = '#e9d5ff'; }
                                else { name = enemies.find(e => e.uid === t.refId)?.name || 'Hostile'; tColor = '#a855f7'; }
                                return (
                                    <div key={tokenId} className={`flex items-center justify-between p-2 border transition-colors ${isAct ? 'bg-gray-800 border-[#d1d5db] shadow-[0_0_10px_rgba(209,213,219,0.3)]' : 'bg-[#0f172a] border-gray-700'}`}>
                                        <div className="flex items-center gap-2 cursor-pointer flex-1" onClick={() => setActiveToken(tokenId)}>
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tColor }}></div>
                                            <span className={`text-xs font-bold ${isAct ? 'text-white' : 'text-gray-400'}`}>{idx + 1}. {name}</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <button className="text-gray-500 hover:text-white px-1 font-bold" onClick={() => moveInQueue(idx, -1)}>▲</button>
                                            <button className="text-gray-500 hover:text-white px-1 font-bold" onClick={() => moveInQueue(idx, 1)}>▼</button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <button className="w-full bg-[#a855f7] text-white font-bold px-4 py-3 uppercase text-xs tracking-wider hover:bg-white hover:text-black transition-colors mt-2" onClick={advanceRound}>{safeEnc.round === 0 ? '▶ Deploy & Start Encounter' : 'Shuffle & Advance Round [+]'}</button>
                    </div>

                    <div className="bg-[#1e293b] border border-gray-700 p-5 shadow-md">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-2 border-b border-gray-700 pb-1">Active Encounter Roster ({enemies.length})</div>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {enemies.length === 0 ? ( <div className="text-xs text-gray-600 italic">No hostiles staged.</div> ) : ( enemies.map(e => e && ( <div key={e.uid} className={`p-2.5 border flex justify-between items-center text-xs ${e.isActive ? 'bg-[#0f172a] border-[#a855f7]' : 'bg-[#0f172a]/50 border-gray-700 opacity-60'}`}> <div> <div className="font-bold text-white">{e.name} <span className="text-[10px] text-gray-500">[T{e.tier}]</span></div> <div className="text-[10px] text-gray-400">HP: {e.currentHp}/{e.maxHp} | {e.isActive ? 'Active' : `Delayed (${e.spawnMode})`}</div> </div> <button className="text-gray-500 hover:text-red-500 font-bold px-2" onClick={() => removeEnemy(e.uid)} title="Purge Hostile">✕</button> </div> )) )}
                        </div>
                    </div>
                </div>

                <div className="col-span-1 lg:col-span-2 bg-[#1e293b] border border-gray-700 p-5 space-y-4 shadow-md">
                    <div className="flex justify-between items-center border-b border-gray-700 pb-2">
                        <h2 className="text-[#a855f7] font-bold text-lg uppercase tracking-widest">Bestiary Staging ({bestiary.length} Units Available)</h2>
                        <input type="text" className="bg-[#0f172a] border border-gray-600 px-3 py-1 text-xs text-white outline-none w-48 focus:border-[#a855f7]" placeholder="Search units or tier..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-xs text-gray-400 uppercase font-bold block">Select Hostile Template</label>
                            <select className="w-full bg-[#0f172a] border border-gray-600 p-2.5 text-white text-xs outline-none cursor-pointer focus:border-[#a855f7]" value={selectedBestiaryId} onChange={e => setSelectedBestiaryId(e.target.value)}>
                                {filteredBestiary.map(e => ( <option key={e.id} value={e.id}>[Tier {e.tier}] {e.name} ({e.affinity} - {e.hp} HP)</option> ))}
                            </select>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Spawn Protocol</label>
                                    <select className="w-full bg-[#0f172a] border border-gray-600 p-2 text-white text-xs outline-none cursor-pointer focus:border-[#a855f7]" value={spawnMode} onChange={e => setSpawnMode(e.target.value)}>
                                        <option value="immediate">Immediate Drop</option><option value="clear">Deploy On Clear</option><option value="round">Deploy On Round X</option>
                                    </select>
                                </div>
                                {spawnMode === 'round' ? (
                                    <div>
                                        <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Target Round</label>
                                        <div className="flex items-center justify-center bg-[#0f172a] border border-gray-600 p-1">
                                            <button className="text-white px-3 py-1 font-bold hover:bg-gray-800 transition-colors" onClick={() => setSpawnRound(v => Math.max(1, v - 1))}>-</button>
                                            <span className="text-white font-bold w-6 text-center text-xs">{spawnRound}</span>
                                            <button className="text-white px-3 py-1 font-bold hover:bg-gray-800 transition-colors" onClick={() => setSpawnRound(v => v + 1)}>+</button>
                                        </div>
                                    </div>
                                ) : ( <div className="flex items-end"><div className="text-[10px] text-gray-500 italic pb-2">Hostile ready for encounter insertion.</div></div> )}
                            </div>
                            <button className="w-full bg-[#a855f7] text-white font-bold p-3 uppercase text-xs tracking-wider hover:bg-white hover:text-black transition-colors mt-2" onClick={deployEnemy}>+ Stage Hostile to Encounter</button>
                        </div>

                        <div className="bg-[#0f172a] border border-gray-700 p-4 flex flex-col justify-between text-xs shadow-inner">
                            {(() => {
                                const template = bestiary.find(e => String(e.id) === String(selectedBestiaryId));
                                if (!template) return <div className="text-gray-500 italic">Select a template to view details.</div>;
                                return (
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center border-b border-gray-700 pb-2"><span className="font-bold text-white text-sm">{template.name}</span><span className="bg-[#1e293b] px-2 py-0.5 border border-gray-600 text-[#a855f7] font-bold">Tier {template.tier}</span></div>
                                        <div className="grid grid-cols-2 gap-2 text-gray-400"><div>Affinity: <span className="text-white font-bold">{template.affinity}</span></div><div>Base HP: <span className="text-white font-bold">{template.hp}</span></div><div>Barriers: <span className="text-white font-bold">{template.barriers?.length ? template.barriers.join(', ') : 'None'}</span></div><div>Abilities: <span className="text-white font-bold">{template.abilities?.length || 0}</span></div></div>
                                        <div className="border-t border-gray-700 pt-2"><div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1 font-bold">Ability Registry:</div><div className="space-y-1 max-h-32 overflow-y-auto pr-2">{safeArray(template.abilities).map((ab, idx) => { const abName = typeof ab === 'object' ? ab.name : String(ab).split(':')[0]; const abCost = typeof ab === 'object' ? ab.cost : 1; return <div key={idx} className="text-gray-300 truncate border-b border-gray-800/50 pb-1 mb-1">• {abName} <span className="text-gray-500">({abCost} Res)</span></div>; })}</div></div>
                                    </div>
                                );
                            })()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GMDashboard(props) { return ( <GMDashboardErrorBoundary> <GMDashboardInner {...props} /> </GMDashboardErrorBoundary> ); }