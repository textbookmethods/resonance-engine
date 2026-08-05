/* eslint-disable */
import React, { useState } from 'react';
import { bestiary } from '../data/bestiary';

const STATE_DICTIONARY = { 'Execute': ['execute', 'erase', 'delete'], 'Bleed': ['bleed', 'hemorrhage', 'lacerate'], 'Burn': ['burn', 'ignite', 'scorch'], 'Poisoned': ['poison', 'venom', 'decay'], 'Immobilized': ['immobilize', 'root', 'snare'], 'Stunned': ['stun', 'paralyze', 'petrify'], 'Shielded': ['shield', 'protect', 'barrier'], 'Vulnerable': ['vulnerable', 'expose', 'sunder'], 'Knockdown': ['knockdown', 'trip', 'shove'], 'Blind': ['blind', 'obscure', 'smoke'], 'Haste': ['haste', 'speed', 'quick'], 'Slowed': ['slow', 'sluggish', 'chill'], 'Shocked': ['shock', 'glitch', 'jolt'], 'Evasive': ['evade', 'dodge', 'blur'], 'Invulnerable': ['invulnerable', 'stasis', 'immune'] };
const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const safeArray = (arr) => { if (!arr) return []; if (Array.isArray(arr)) return arr.filter(i => i !== null); if (typeof arr === 'object') return Object.values(arr).filter(i => i !== null); return []; };
const getCoreState = (input) => { if (!input) return ''; const match = String(input).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(input)).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };

export default function GMDashboard({ encounter = {}, tokens = [], players = {}, pushUpdate, hardResetSession }) {
    const [draftEnemyId, setDraftEnemyId] = useState('');
    const [grantXpAmount, setGrantXpAmount] = useState(10);

    const activeEnemies = safeArray(encounter.enemies);
    const activeTokens = safeArray(tokens);
    const currentPool = safeInt(encounter.enemyPoolTotal);

    const advanceRound = () => {
        pushUpdate(s => {
            let pObj = deepClone(s.players || {});
            let eList = deepClone(safeArray(s.encounter?.enemies));
            let tList = deepClone(safeArray(s.tokens));
            let grid = s.grid || [];
            let nextRound = safeInt(s.encounter?.round) + 1;
            let log = `=== ROUND ${nextRound} INITIATED ===`;
            
            let generatedRes = 0; let deadEnemyUids = new Set(); let deadPlayers = new Set();

            tList.forEach(t => {
                if (t.type === 'enemy') {
                    const en = eList.find(e => String(e.uid) === String(t.refId));
                    if (en) generatedRes += safeInt(en.tier || 1);
                }
            });
            
            let nextPool = currentPool + generatedRes;
            log += `\n>> HOSTILE GENERATION: +${generatedRes} Res (New Pool: ${nextPool})`;

            tList.forEach(t => {
                const cell = grid[t.pos] || {};
                let isPlayer = t.type === 'player';
                let ent = isPlayer ? pObj[t.refId] : eList.find(e => String(e.uid) === String(t.refId));
                if (!ent) return;
                
                let hp = safeInt(ent.currentHp);
                let statuses = safeArray(ent.statuses);
                let coreStates = statuses.map(st => getCoreState(st));
                
                let dotDmg = (coreStates.filter(st => st === 'Bleed').length * 3) + (coreStates.filter(st => st === 'Burn').length * 3) + (coreStates.filter(st => st === 'Poisoned').length * 3);
                if (dotDmg > 0) { hp -= dotDmg; log += `\n>> DOT TICK: ${ent.name || 'Entity'} took ${dotDmg} damage.`; }

                if (cell.terrain === 'major') { hp -= 5; log += `\n>> HAZARD: ${ent.name || 'Entity'} took 5 damage from Major Terrain.`; } 
                else if (cell.terrain === 'steam') { hp -= 5; log += `\n>> HAZARD: ${ent.name || 'Entity'} took 5 Kinetic damage from Steam Boiling.`; }
                
                let isExecuted = false; let newStatuses = [];
                for (let i = 0; i < statuses.length; i++) {
                    let st = statuses[i]; let core = getCoreState(st);
                    if (String(st).startsWith('Crushed')) {
                        if (st.includes('[1/3]')) newStatuses.push('Crushed [2/3]');
                        else if (st.includes('[2/3]')) newStatuses.push('Crushed [3/3]');
                        else if (st.includes('[3/3]')) { isExecuted = true; log += `\n>> LETHAL ENTOMBMENT: ${ent.name || 'Entity'} was Executed by Severe Terrain!`; }
                    } else if (core !== 'Knockdown') newStatuses.push(st); 
                }
                
                if (isExecuted) hp = 0;
                ent.statuses = newStatuses;
                ent.currentHp = Math.max(0, hp);
                
                if (ent.currentHp <= 0) {
                    if (isPlayer) deadPlayers.add(String(t.refId));
                    else deadEnemyUids.add(String(t.refId));
                }

                let baseSpeed = t.speed || 3; let speedMod = 0;
                let newCores = newStatuses.map(st => getCoreState(st));
                if (newCores.includes('Haste')) speedMod += 2;
                if (newCores.includes('Slowed')) speedMod -= 2;
                t.movementRemaining = Math.max(0, baseSpeed + speedMod);

                if (isPlayer) { ent.usedParry = false; ent.usedIntercept = false; ent.usedEvade = false; ent.usedBasicAttack = false; }
            });

            if (deadEnemyUids.size > 0) {
                eList = eList.filter(e => !deadEnemyUids.has(String(e.uid)));
                tList = tList.filter(t => !(t.type === 'enemy' && deadEnemyUids.has(String(t.refId))));
                log += `\n>> CASUALTIES: ${deadEnemyUids.size} Hostile(s) purged from the grid.`;
            }

            return {
                ...s, players: pObj, tokens: tList, activeAction: null,
                encounter: { ...s.encounter, round: nextRound, enemies: eList, enemyPoolTotal: nextPool, initiativeQueue: [], activeTokenId: null },
                globalLog: { message: log, timestamp: Date.now() }
            };
        });
    };

    const rollInitiative = () => {
        pushUpdate(s => {
            const tList = safeArray(s.tokens);
            if(tList.length === 0) return s;
            const sorted = [...tList].sort((a, b) => {
                const speedA = a.speed || 3; const speedB = b.speed || 3;
                if (speedA === speedB) return Math.random() - 0.5;
                return speedB - speedA;
            });
            const queue = sorted.map(t => String(t.id));
            return {
                ...s,
                encounter: { ...s.encounter, initiativeQueue: queue, activeTokenId: queue[0] || null },
                globalLog: { message: `>> INITIATIVE ROLLED: Speed-based turn order established.`, timestamp: Date.now() }
            };
        });
    };

    const nextTurn = () => {
        pushUpdate(s => {
            const q = safeArray(s.encounter?.initiativeQueue);
            if (q.length === 0) return s;
            const currIdx = q.indexOf(s.encounter.activeTokenId);
            const nextIdx = (currIdx + 1) % q.length;
            const nextTokenId = q[nextIdx];
            
            const nT = safeArray(s.tokens).find(t => t.id === nextTokenId);
            let tName = 'Unknown Entity';
            if (nT) {
                if (nT.type === 'player') tName = s.players[nT.refId]?.name || 'Agent';
                else {
                    const e = safeArray(s.encounter?.enemies).find(en => en.uid === nT.refId);
                    if (e) tName = e.name;
                }
            }

            return {
                ...s,
                encounter: { ...s.encounter, activeTokenId: nextTokenId },
                globalLog: { message: `>> TURN ADVANCED: It is now [${tName}]'s turn.`, timestamp: Date.now() }
            };
        });
    };

    const addEnemyFromBestiary = () => {
        if (!draftEnemyId) return alert("Select an entity from the Bestiary first.");
        const template = bestiary.find(e => e.id === draftEnemyId);
        if (!template) return;
        pushUpdate(s => {
            const newEnemy = { ...deepClone(template), uid: `e-${Date.now()}-${Math.floor(Math.random() * 1000)}`, currentHp: template.hp, currentBarriers: [...(template.barriers || [])], statuses: [] };
            return { ...s, encounter: { ...s.encounter, enemies: [...safeArray(s.encounter?.enemies), newEnemy] }, globalLog: { message: `>> GM deployed [${template.name}] to the staging area.`, timestamp: Date.now() } };
        });
    };

    const grantXP = () => {
        const amt = safeInt(grantXpAmount);
        if (amt <= 0) return;
        pushUpdate(s => {
            const pClone = deepClone(s.players || {});
            Object.keys(pClone).forEach(id => { pClone[id].xp = (safeInt(pClone[id].xp) || 0) + amt; });
            return { ...s, players: pClone, globalLog: { message: `>> EXPERIENCE GRANTED: All Agents received +${amt} XP.`, timestamp: Date.now() } };
        });
    };

    const initQ = safeArray(encounter.initiativeQueue);
    let activeTokenName = "None";
    if (encounter.activeTokenId) {
        const at = activeTokens.find(t => t.id === encounter.activeTokenId);
        if (at) {
            if (at.type === 'player') activeTokenName = players[at.refId]?.name || 'Agent';
            else {
                const e = activeEnemies.find(en => en.uid === at.refId);
                activeTokenName = e ? e.name : 'Hostile';
            }
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[75vh] font-mono text-sm overflow-hidden">
            
            <div className="lg:col-span-3 bg-[#1a222c] border border-slate-700 p-4 flex flex-col overflow-y-auto shadow-inner">
                <h2 className="text-[#ff6600] font-bold text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Encounter Control</h2>
                
                <div className="bg-black border border-gray-600 p-4 mb-4 text-center shadow-md">
                    <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Global Hostile Resonance</div>
                    <div className="text-5xl font-bold text-[#ff6600] mb-3 drop-shadow-[0_0_10px_rgba(255,102,0,0.5)]">{currentPool}</div>
                    <div className="flex justify-center gap-2">
                        <button className="bg-gray-800 text-white w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-[#ff6600] transition-colors" onClick={() => pushUpdate(s => ({ ...s, encounter: { ...s.encounter, enemyPoolTotal: Math.max(0, currentPool - 1) }}))}>-</button>
                        <button className="bg-gray-800 text-white w-10 h-10 flex items-center justify-center font-bold text-xl hover:bg-[#ff6600] transition-colors" onClick={() => pushUpdate(s => ({ ...s, encounter: { ...s.encounter, enemyPoolTotal: currentPool + 1 }}))}>+</button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-2">
                    <div className="bg-gray-900 border border-gray-700 p-3 flex flex-col items-center justify-center">
                        <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Phase</div>
                        <div className="text-white font-bold text-lg">{encounter.round === 0 ? 'Deploy' : `Round ${encounter.round}`}</div>
                    </div>
                    <div className="bg-gray-900 border border-gray-700 p-3 flex flex-col items-center justify-center text-center overflow-hidden">
                        <div className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Active Turn</div>
                        <div className={`font-bold text-xs truncate w-full ${encounter.activeTokenId ? 'text-[#00f0ff]' : 'text-gray-500'}`}>{activeTokenName}</div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 mb-6">
                    <button className="bg-[#ff6600] text-black font-bold p-3 uppercase tracking-widest hover:bg-white transition-colors" onClick={advanceRound}>Next Round (+)</button>
                    <div className="grid grid-cols-2 gap-2">
                        <button className="bg-purple-900 text-white border border-purple-500 font-bold p-2 uppercase tracking-widest hover:bg-white hover:text-black transition-colors text-[10px]" onClick={rollInitiative}>Roll Init</button>
                        <button className="bg-blue-900 text-white border border-blue-500 font-bold p-2 uppercase tracking-widest hover:bg-white hover:text-black transition-colors text-[10px]" disabled={initQ.length === 0} onClick={nextTurn}>Next Turn</button>
                    </div>
                </div>

                <div className="mt-auto border-t border-gray-700 pt-4 space-y-4">
                    <div className="bg-black border border-gray-700 p-3 flex gap-2 items-center">
                        <input type="number" className="w-16 bg-gray-900 border border-gray-600 text-white p-2 text-center outline-none" value={grantXpAmount} onChange={e => setGrantXpAmount(e.target.value)} />
                        <button className="flex-1 bg-[#00f0ff] text-black font-bold uppercase text-xs p-2 hover:bg-white transition-colors" onClick={grantXP}>Grant XP</button>
                    </div>
                    <button className="w-full text-red-500 border border-red-900 bg-red-950/30 p-2 text-xs font-bold uppercase hover:bg-red-500 hover:text-white transition-colors" onClick={hardResetSession}>Emergency Purge</button>
                </div>
            </div>

            <div className="lg:col-span-6 bg-[#0a0f14] border border-slate-700 p-4 flex flex-col overflow-y-auto shadow-inner">
                <div className="flex flex-col md:flex-row gap-2 mb-4 pb-4 border-b border-gray-700">
                    <select className="flex-1 bg-black border border-gray-600 text-white p-2 outline-none font-bold text-xs" value={draftEnemyId} onChange={e => setDraftEnemyId(e.target.value)}>
                        <option value="">-- Access Bestiary Archives --</option>
                        {bestiary.map(e => <option key={e.id} value={e.id}>[Tier {e.tier}] {e.name} - {e.affinity}</option>)}
                    </select>
                    <button className="bg-white text-black font-bold px-4 py-2 uppercase tracking-widest hover:bg-[#ff6600] hover:text-white transition-colors text-xs" onClick={addEnemyFromBestiary}>Deploy to Staging</button>
                </div>

                <div className="space-y-3">
                    {activeEnemies.length === 0 ? <div className="text-gray-500 text-center py-10 uppercase tracking-widest border border-dashed border-gray-800">No active hostiles in array.</div> : null}
                    {activeEnemies.map((e, idx) => (
                        <div key={e.uid} className="bg-black border border-gray-700 p-3 relative flex flex-col">
                            <div className="flex justify-between items-start mb-2 pr-6">
                                <div>
                                    <div className="text-[#ff6600] font-bold text-lg">{e.name}</div>
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <span>Tier: <span className="text-white font-bold">{e.tier || 1}</span></span>
                                        <span>Type: <span className="text-white font-bold">{e.affinity || 'Kinetic'}</span></span>
                                    </div>
                                </div>
                                <button className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg transition-colors" onClick={() => pushUpdate(s => ({ ...s, encounter: { ...s.encounter, enemies: safeArray(s.encounter?.enemies).filter(en => en.uid !== e.uid) }}))}>✕</button>
                            </div>

                            <div className="flex gap-4 mb-3 items-center">
                                <div className="flex items-center gap-2">
                                    <label className="text-gray-500 text-[10px] uppercase font-bold">HP:</label>
                                    <input type="number" className="w-16 bg-gray-900 border border-gray-600 text-white p-1 text-center outline-none font-bold" value={e.currentHp} onChange={(ev) => {
                                        const val = parseInt(ev.target.value) || 0;
                                        pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); newE[idx].currentHp = val; return { ...s, encounter: { ...s.encounter, enemies: newE } }; });
                                    }}/>
                                </div>
                                <div className="flex gap-1 items-center">
                                    <label className="text-gray-500 text-[10px] uppercase font-bold mr-1">Barriers:</label>
                                    {safeArray(e.currentBarriers).length === 0 && <span className="text-gray-600 text-xs">None</span>}
                                    {safeArray(e.currentBarriers).map((b, bIdx) => (
                                        <input key={bIdx} type="number" className="w-10 bg-blue-900/30 border border-blue-500 text-blue-300 p-1 text-center outline-none text-xs font-bold" value={b} onChange={(ev) => {
                                            const val = parseInt(ev.target.value) || 0;
                                            pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); newE[idx].currentBarriers[bIdx] = val; return { ...s, encounter: { ...s.encounter, enemies: newE } }; });
                                        }}/>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-gray-900 p-2 flex flex-wrap gap-1 items-center min-h-[40px] border border-gray-800">
                                {safeArray(e.statuses).map((st, sIdx) => (
                                    <span key={sIdx} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1">
                                        {st} 
                                        <button className="text-red-400 hover:text-white" onClick={() => pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); newE[idx].statuses.splice(sIdx, 1); return { ...s, encounter: { ...s.encounter, enemies: newE } }; })}>✕</button>
                                    </span>
                                ))}
                                <div className="flex gap-1 ml-auto">
                                    <input type="text" id={`eState-${e.uid}`} className="w-24 bg-black border border-gray-600 text-white text-[10px] p-1 outline-none" placeholder="Add state..." />
                                    <button className="bg-gray-800 text-white px-2 text-[10px] font-bold border border-gray-600 hover:bg-[#00f0ff] hover:text-black transition-colors" onClick={() => {
                                        const val = document.getElementById(`eState-${e.uid}`).value;
                                        if (val) { pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); newE[idx].statuses.push(val); return { ...s, encounter: { ...s.encounter, enemies: newE } }; }); document.getElementById(`eState-${e.uid}`).value = ''; }
                                    }}>+</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="lg:col-span-3 bg-[#1a222c] border border-slate-700 p-4 flex flex-col overflow-y-auto shadow-inner">
                <h2 className="text-[#00f0ff] font-bold text-xl uppercase tracking-widest mb-4 border-b border-gray-700 pb-2">Active Agents</h2>
                
                <div className="space-y-4">
                    {Object.keys(players).length === 0 ? <div className="text-gray-500 text-center py-6 uppercase tracking-widest border border-dashed border-gray-800 text-xs">No Agents Uplinked.</div> : null}
                    {Object.entries(players).map(([id, p]) => (
                        <div key={id} className="bg-black border border-[#00f0ff] p-3 shadow-md relative">
                            <div className="flex justify-between items-center mb-2">
                                <div className="font-bold text-[#00f0ff] text-base">{p.name || 'Agent'}</div>
                                <div className="text-[10px] bg-gray-900 border border-gray-600 px-2 py-0.5 text-white font-bold">{p.xp || 0} XP</div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 mb-2 border-b border-gray-800 pb-2">
                                <div className="text-center">
                                    <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Health</div>
                                    <div className="font-bold text-white">{p.currentHp}</div>
                                </div>
                                <div className="text-center border-l border-gray-800">
                                    <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Resonance</div>
                                    <div className="font-bold text-[#00f0ff]">{p.resPool !== undefined ? p.resPool : 3}/10</div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                                {safeArray(p.statuses).length === 0 && <span className="text-[10px] text-gray-600">No states.</span>}
                                {safeArray(p.statuses).map((st, i) => (
                                    <span key={i} className="bg-purple-900 text-white text-[9px] px-1 py-0.5 border border-purple-500 font-bold uppercase truncate max-w-full">
                                        {st}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}