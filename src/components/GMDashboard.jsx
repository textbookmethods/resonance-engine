/* eslint-disable */
import React from 'react';
import { bestiary } from '../data/bestiary';

const ELEMENT_DICTIONARY = {
    'thermal': ['fire', 'heat', 'magma', 'lava', 'ash', 'plasma', 'steam', 'solar', 'sun', 'flame', 'pyro', 'scorch', 'burn', 'inferno', 'ignition'],
    'cryo': ['ice', 'cold', 'frost', 'snow', 'water', 'liquid', 'ocean', 'glacier', 'hydro', 'aqua', 'chill', 'blizzard', 'freeze', 'arctic'],
    'electro': ['lightning', 'electric', 'spark', 'thunder', 'magnetic', 'storm', 'volt', 'shock', 'galvanic', 'energy', 'emp'],
    'toxic': ['poison', 'acid', 'venom', 'decay', 'rot', 'radiation', 'bio', 'gas', 'smog', 'plague', 'blight', 'corrosive', 'noxious', 'viral', 'chemical'],
    'radiant': ['light', 'holy', 'divine', 'healing', 'spirit', 'luminous', 'glow', 'life', 'order', 'sacred', 'blessed', 'purify', 'stellar'],
    'void': ['dark', 'shadow', 'space', 'gravity', 'time', 'cosmic', 'null', 'psychic', 'mind', 'mental', 'chaos', 'entropy', 'abyss', 'astral', 'telekinetic', 'warp'],
    'kinetic': ['physical', 'force', 'bludgeoning', 'piercing', 'slashing', 'earth', 'stone', 'rock', 'wind', 'air', 'pressure', 'metal', 'steel', 'sand', 'dust', 'aero', 'geo', 'sound', 'sonic', 'acoustic', 'seismic', 'blood']
};

const STATE_DICTIONARY = {
    'Execute': ['execute', 'erase', 'delete', 'kill', 'assassinate', 'obliterate', 'fatal', 'doom', 'annihilate', 'vanquish', 'smite', 'destroy', 'wipe'],
    'Bleed': ['bleed', 'hemorrhage', 'lacerate', 'rend', 'cut'],
    'Burn': ['burn', 'ignite', 'scorch', 'melt', 'char', 'fire'],
    'Poisoned': ['poison', 'venom', 'decay', 'rot', 'corrode', 'acid', 'plague', 'blight', 'infection', 'toxic'],
    'Immobilized': ['immobilize', 'root', 'snare', 'trap', 'bind', 'pin', 'tether'],
    'Stunned': ['stun', 'paralyze', 'petrify', 'frozen', 'daze'],
    'Shielded': ['shield', 'protect', 'barrier', 'ward', 'guard', 'armor', 'block'],
    'Vulnerable': ['vulnerable', 'expose', 'sunder', 'break', 'shatter', 'pierce', 'fracture'],
    'Knockdown': ['knockdown', 'trip', 'shove', 'push', 'throw', 'slam', 'prone'],
    'Blind': ['blind', 'blindside', 'obscure', 'smoke', 'flash', 'darkness'],
    'Haste': ['haste', 'speed', 'quick', 'fast', 'accelerate', 'dash', 'swift'],
    'Slowed': ['slow', 'sluggish', 'lethargic', 'hobble', 'cripple', 'chill'],
    'Shocked': ['shock', 'glitch', 'short', 'jolt', 'electrocute'],
    'Evasive': ['evade', 'dodge', 'blur', 'ghost', 'phase', 'agile'],
    'Invulnerable': ['invulnerable', 'stasis', 'immune', 'god', 'untouchable', 'aegis']
};

const STATE_DESCRIPTIONS = {
    'Execute': 'Instantly reduces HP to 0. Bypasses all defenses.',
    'Bleed': 'Takes 3 HP damage at the end of the round.',
    'Burn': 'Takes 3 HP damage at the end of the round.',
    'Poisoned': 'Takes 3 HP damage at the end of the round. DoTs stack.',
    'Immobilized': 'Movement points reduced to 0.',
    'Stunned': 'Movement 0. Cannot attack. Defensive arrays jammed.',
    'Shielded': 'Absorbs 5 incoming damage, then shatters.',
    'Vulnerable': 'Takes 1.5x incoming damage from the next attack, then shatters.',
    'Knockdown': 'Movement points halved. Automatically recovers next round.',
    'Blind': 'Targeting optics restricted to Range 1 and AoE 0.',
    'Haste': 'Movement points increased by +2.',
    'Slowed': 'Movement points reduced by -2.',
    'Shocked': 'Defensive arrays (Parry, Intercept, Evade) jammed.',
    'Evasive': 'Next incoming attack automatically forces an Evasion roll, then shatters.',
    'Invulnerable': 'Completely negates the next incoming attack, then shatters.'
};

const getCoreElement = (input) => {
    if (!input) return 'Kinetic';
    const clean = input.toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(ELEMENT_DICTIONARY)) {
        if (core === clean || synonyms.includes(clean)) return core.charAt(0).toUpperCase() + core.slice(1);
    }
    return 'Kinetic'; 
};

const getCoreState = (input) => {
    if (!input) return '';
    const match = input.match(/\[(.*?)\]/);
    const clean = (match ? match[1] : input).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) {
        if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core;
    }
    return input; 
};

export default function GMDashboard({ encounter = {}, tokens = [], players = {}, pushUpdate, hardResetSession }) {
    const updateEnc = (updates) => pushUpdate(s => ({ ...s, encounter: { ...s.encounter, ...updates } }));

    const addEnemy = (bestiaryId) => {
        const template = bestiary.find(b => b.id === bestiaryId);
        if (!template) return;
        const newEnemy = { ...template, uid: Date.now(), currentHp: template.hp || 0, currentBarriers: template.barriers ? [...template.barriers] : [], siphonActive: false, staggered: false, statuses: [] };
        updateEnc({ enemies: [...(encounter?.enemies || []), newEnemy] });
    };

    const primeEnemyAbility = (enemy, cleanName, desc) => {
        const eStates = (enemy.statuses || []).map(s => getCoreState(s));
        if (eStates.includes('Stunned')) return alert("System Locked: Entity is STUNNED.");

        const isBlind = eStates.includes('Blind');

        const dmgMatch = desc.match(/deals\s+(\d+)\s+(?:([a-zA-Z]+)\s+)?damage/i);
        const parsedDmg = dmgMatch ? parseInt(dmgMatch[1]) : 0;
        const rawMatch = (dmgMatch && dmgMatch[2]) ? dmgMatch[2] : 'Kinetic';
        const coreMatch = getCoreElement(rawMatch);

        const aoeMatch = desc.match(/(\d+)-hex\s+radius/i) || desc.match(/radius\s+of\s+(\d+)/i);
        const shapeMatch = desc.match(/(line|cluster)/i);
        let parsedAoe = isBlind ? 0 : (aoeMatch ? parseInt(aoeMatch[1]) : 0);
        if (!isBlind && shapeMatch) {
            if (shapeMatch[1].toLowerCase() === 'line') parsedAoe = 'line3';
            if (shapeMatch[1].toLowerCase() === 'cluster') parsedAoe = 'cluster3';
        }

        const effMatch = desc.match(/applies\s+\[(.*?)\]/i);
        const parsedEff = effMatch ? effMatch[1] : null;
        const coreEff = getCoreState(parsedEff);
        
        const terrMatch = desc.match(/terrain:\s*(minor|major|severe|clear)/i);
        const pTerrain = terrMatch ? terrMatch[1].toLowerCase() : null;

        let eRange = "1";
        const rangeMatch = desc.match(/range\s+(\d+)(?:-(\d+))?/i);
        if (rangeMatch) eRange = rangeMatch[2] ? `${rangeMatch[1]}-${rangeMatch[2]}` : rangeMatch[1];
        
        if (isBlind) {
            eRange = '1';
            alert("Warning: Entity is BLIND. Targeting optics restricted to adjacent hexes.");
        }

        pushUpdate(s => ({ ...s, activeAction: { source: enemy.name, sourceId: enemy.uid, isEnemy: true, name: cleanName, d: parsedDmg, a: parsedAoe, range: eRange, effectName: parsedEff, effectCore: coreEff, elementRaw: rawMatch, elementCore: coreMatch, terrain: pTerrain } }));
    };

    const handleNextRound = () => {
        pushUpdate(s => {
            const newRound = (s.encounter?.round || 0) + 1;
            let log = [];
            let deadEnemyUids = new Set();
            let newEnemies = [...(s.encounter?.enemies || [])];
            let newPlayers = { ...(s.players || {}) };
            let newTokens = [...(s.tokens || [])];

            newEnemies.forEach(e => {
                let coreStates = (e.statuses || []).map(st => getCoreState(st));
                let dotDmg = 0;
                let activeDoTs = coreStates.filter(st => ['Bleed', 'Burn', 'Poisoned'].includes(st));
                
                if (activeDoTs.length > 0) dotDmg += activeDoTs.length * 3;

                const t = newTokens.find(tok => tok.type === 'enemy' && tok.refId == e.uid);
                if (t && s.grid && s.grid[t.pos]?.terrain === 'major') {
                    dotDmg += 5;
                    activeDoTs.push('Major Terrain');
                }

                if (dotDmg > 0) {
                    e.currentHp = Math.max(0, e.currentHp - dotDmg);
                    log.push(`Hostile [${e.name}] took ${dotDmg} damage from environmental effects (${activeDoTs.join(', ')}).`);
                    if (e.currentHp <= 0) deadEnemyUids.add(e.uid);
                }
                
                e.statuses = (e.statuses || []).filter(st => getCoreState(st) !== 'Knockdown');
            });

            Object.keys(newPlayers).forEach(pid => {
                let p = newPlayers[pid];
                let coreStates = (p.statuses || []).map(st => getCoreState(st));
                let dotDmg = 0;
                let activeDoTs = coreStates.filter(st => ['Bleed', 'Burn', 'Poisoned'].includes(st));
                
                if (activeDoTs.length > 0) dotDmg += activeDoTs.length * 3;

                const t = newTokens.find(tok => tok.type === 'player' && tok.refId === pid);
                if (t && s.grid && s.grid[t.pos]?.terrain === 'major') {
                    dotDmg += 5;
                    activeDoTs.push('Major Terrain');
                }

                if (p.statuses && p.statuses.includes('Crushed [2/3]')) {
                    p.currentHp = 0;
                    log.push(`AGENT CRUSHED! [${p.name}]'s Entombment timer expired.`);
                } else if (p.statuses && p.statuses.includes('Crushed [1/3]')) {
                    p.statuses = p.statuses.filter(st => st !== 'Crushed [1/3]');
                    p.statuses.push('Crushed [2/3]');
                    log.push(`AGENT ENTOMBED! [${p.name}]'s structural integrity failing. [2/3]`);
                }

                if (dotDmg > 0 && p.currentHp > 0) {
                    p.currentHp = Math.max(0, p.currentHp - dotDmg);
                    log.push(`Agent [${p.name}] took ${dotDmg} damage from environmental effects (${activeDoTs.join(', ')}).`);
                }

                p.statuses = (p.statuses || []).filter(st => getCoreState(st) !== 'Knockdown');
                p.usedParry = false; p.usedIntercept = false; p.usedEvade = false; p.usedBasicAttack = false;
            });

            newTokens.forEach(t => {
                let coreStates = [];
                let baseSpeed = t.speed ?? 3;
                if (t.type === 'enemy') {
                    const e = newEnemies.find(en => en.uid == t.refId);
                    if (e) coreStates = (e.statuses || []).map(st => getCoreState(st));
                } else {
                    const p = newPlayers[t.refId];
                    if (p) coreStates = (p.statuses || []).map(st => getCoreState(st));
                }

                let dynSpeed = baseSpeed;
                if (coreStates.includes('Haste')) dynSpeed += 2;
                if (coreStates.includes('Slowed')) dynSpeed = Math.max(0, dynSpeed - 2);
                if (coreStates.includes('Immobilized') || coreStates.includes('Stunned') || coreStates.includes('Crushed')) dynSpeed = 0;
                
                t.movementRemaining = dynSpeed;
            });

            if (deadEnemyUids.size > 0) {
                newEnemies = newEnemies.filter(e => !deadEnemyUids.has(e.uid));
                newTokens = newTokens.filter(t => !(t.type === 'enemy' && deadEnemyUids.has(Number(t.refId))));
                log.push(`>> ${deadEnemyUids.size} entities purged due to terminal damage.`);
            }

            if (log.length > 0) {
                return { ...s, encounter: { ...s.encounter, round: newRound, enemies: newEnemies }, tokens: newTokens, players: newPlayers, globalLog: { message: "ROUND ADVANCE PROTOCOLS:\n\n" + log.join('\n'), timestamp: Date.now() } };
            }

            return { ...s, encounter: { ...s.encounter, round: newRound, enemies: newEnemies }, tokens: newTokens, players: newPlayers };
        });
    };

    const handleNewEncounter = () => {
        if (window.confirm("Initialize new encounter? This resets rounds to 0, clears the board, and restores all Agent Resonance to 3.")) {
            pushUpdate(s => {
                const newPlayers = { ...(s.players || {}) };
                Object.keys(newPlayers).forEach(pid => {
                    newPlayers[pid] = { 
                        ...newPlayers[pid], 
                        resPool: 3, 
                        usedParry: false, 
                        usedIntercept: false, 
                        usedEvade: false,
                        usedBasicAttack: false 
                    };
                });
                return {
                    ...s,
                    encounter: { round: 0, enemies: [], playerPoolTotal: 10, enemyPoolTotal: 10, activeTurn: 'player' },
                    tokens: [],
                    grid: Array(150).fill({ type: 'empty', terrain: null }),
                    players: newPlayers,
                    activeAction: null
                };
            });
        }
    };

    const grantGlobalXP = (amount) => {
        pushUpdate(s => {
            const newP = { ...(s.players || {}) };
            Object.keys(newP).forEach(pid => {
                newP[pid].xp = (parseInt(newP[pid].xp) || 0) + amount;
            });
            return { ...s, players: newP };
        });
        alert(`Global Event: +${amount} XP distributed to all Agents.`);
    };

    const isOverload = (encounter?.round || 0) >= 4;
    // FIX: Apply filter(Boolean) sweep to active maps
    const enemiesList = (encounter?.enemies || []).filter(Boolean);
    const enemyTokens = (tokens || []).filter(tok => tok && tok.type === 'enemy').sort((a,b) => a.id - b.id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-mono text-sm">
            <div className={`p-4 border flex flex-col ${isOverload ? 'bg-red-950 border-red-500' : 'bg-[#1a222c] border-slate-700'}`}>
                <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-700 pb-2">Encounter Flow</h2>
                
                <div className="text-center mb-6">
                    <div className="text-gray-400 mb-1 text-xs tracking-widest uppercase">ENCOUNTER PHASE</div>
                    <div className={`text-4xl font-bold mb-4 ${encounter?.round === 0 ? 'text-[#00f0ff]' : 'text-white'}`}>
                        {encounter?.round === 0 ? 'DEPLOYMENT' : `ROUND ${encounter?.round}`}
                    </div>
                    {isOverload && (
                        <div className="bg-black text-red-500 font-bold p-2 border border-red-500 mb-4 animate-pulse">
                            SYSTEM OVERLOAD ACTIVE
                        </div>
                    )}
                    <div className="flex gap-2 mb-6">
                        <button className="flex-1 bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700 text-white" onClick={() => updateEnc({ round: Math.max(0, (encounter?.round || 0) - 1) })}>- Prev</button>
                        <button className="flex-1 bg-white text-black font-bold p-2 hover:bg-gray-300 transition-colors" onClick={handleNextRound}>Next +</button>
                    </div>

                    <div className="text-gray-400 mb-1 text-xs tracking-widest uppercase">Active Turn</div>
                    <div className="flex gap-2">
                        <button className={`flex-1 p-2 font-bold border transition-colors ${encounter?.activeTurn === 'player' ? 'bg-[#00f0ff] text-black border-[#00f0ff]' : 'bg-black text-gray-500 border-gray-700 hover:text-white'}`} onClick={() => updateEnc({ activeTurn: 'player' })}>AGENTS</button>
                        <button className={`flex-1 p-2 font-bold border transition-colors ${encounter?.activeTurn === 'enemy' ? 'bg-[#ff6600] text-black border-[#ff6600]' : 'bg-black text-gray-500 border-gray-700 hover:text-white'}`} onClick={() => updateEnc({ activeTurn: 'enemy' })}>HOSTILES</button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 leading-tight">Clicking [Next +] automatically executes environmental DoTs and refills movement physics.</div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="text-gray-400 mb-2 text-xs tracking-widest uppercase">Experience Uplink</div>
                    <div className="flex gap-2 mb-4">
                        <button className="flex-1 bg-black border border-[#00f0ff] text-[#00f0ff] font-bold p-2 hover:bg-[#00f0ff] hover:text-black transition-colors" onClick={() => grantGlobalXP(5)}>+5 XP ALL</button>
                        <button className="flex-1 bg-black border border-[#00f0ff] text-[#00f0ff] font-bold p-2 hover:bg-[#00f0ff] hover:text-black transition-colors" onClick={() => grantGlobalXP(10)}>+10 XP ALL</button>
                    </div>

                    <button className="w-full bg-red-950 border border-red-500 text-red-500 font-bold p-2 hover:bg-red-500 hover:text-white transition-colors" onClick={handleNewEncounter}>
                        ⚠ INITIALIZE NEW ENCOUNTER
                    </button>
                    <button className="w-full bg-black border border-red-900 text-red-900 font-bold p-2 mt-2 text-xs tracking-widest hover:bg-red-900 hover:text-white transition-colors" onClick={hardResetSession}>
                        PURGE SESSION DATA
                    </button>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-auto">
                    <div className="text-gray-400 mb-2">Global Enemy Pool</div>
                    <div className="flex items-center justify-between bg-black border border-gray-600 p-2">
                        <button className="px-3 text-lg font-bold text-gray-400 hover:text-[#ff6600]" onClick={() => updateEnc({ enemyPoolTotal: Math.max(0, (encounter?.enemyPoolTotal || 0) - 1)})}>-</button>
                        <span className="text-2xl text-[#ff6600] font-bold">{encounter?.enemyPoolTotal || 0}</span>
                        <button className="px-3 text-lg font-bold text-gray-400 hover:text-[#ff6600]" onClick={() => updateEnc({ enemyPoolTotal: (encounter?.enemyPoolTotal || 0) + 1})}>+</button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3 bg-[#1a222c] p-4 border border-slate-700 flex flex-col h-[75vh]">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h2 className="text-[#ff6600] font-bold text-xl">Active Hostiles</h2>
                    <select className="bg-black text-white border border-gray-600 p-2 outline-none cursor-pointer" onChange={(e) => { if(e.target.value) addEnemy(parseInt(e.target.value)); e.target.value=""; }}>
                        <option value="">+ Deploy Entity...</option>
                        {bestiary.map(b => <option key={b.id} value={b.id}>T{b.tier} - {b.name}</option>)}
                    </select>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {enemiesList.length === 0 && <div className="text-gray-500 text-center mt-10 border border-dashed border-gray-700 p-8">No active entities on the grid.</div>}
                    
                    {enemiesList.map((enemy, idx) => {
                        const myToken = enemyTokens.find(t => t.refId == enemy.uid);

                        return (
                            <div key={enemy.uid} className={`border p-3 flex flex-col xl:flex-row gap-4 ${enemy.staggered ? 'border-yellow-500 bg-yellow-900 bg-opacity-20' : 'border-gray-700 bg-black'}`}>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-bold text-white text-lg flex items-center gap-2">
                                            {enemy.name} <span className="text-xs bg-gray-800 px-2 py-0.5 text-gray-400">T{enemy.tier}</span>
                                        </div>
                                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-900 px-2 py-1 border border-gray-700">
                                            Move Pts: <span className="text-[#ff6600]">{myToken ? `${myToken.movementRemaining ?? myToken.speed ?? 3} / ${myToken.speed ?? 3}` : 'Off Grid'}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {(enemy.statuses || []).length === 0 && <span className="text-xs text-gray-600">No active states.</span>}
                                        {(enemy.statuses || []).map((st, sIdx) => (
                                            <span key={sIdx} title={STATE_DESCRIPTIONS[getCoreState(st)]} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1 cursor-help">
                                                {st} <button className="text-red-400 hover:text-white" onClick={() => {
                                                    pushUpdate(s => {
                                                        const newE = [...(s.encounter?.enemies || [])];
                                                        if (newE[idx]) newE[idx].statuses.splice(sIdx, 1);
                                                        return { ...s, encounter: { ...s.encounter, enemies: newE } };
                                                    });
                                                }}>✕</button>
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        {(enemy.abilities || []).map((ability, aIdx) => {
                                            const parts = (ability || '').split(':');
                                            const rawName = parts[0];
                                            const cleanName = rawName.replace(/\[\d+\s*Res\]/i, '').replace(/\(\d+\s*Res\)/i, '').trim();
                                            const desc = parts.length > 1 ? parts.slice(1).join(':') : '';
                                            
                                            const dmgMatch = desc.match(/deals\s+(\d+)\s+(?:([a-zA-Z]+)\s+)?damage/i);
                                            const parsedDmg = dmgMatch ? parseInt(dmgMatch[1]) : 0;
                                            const parsedElement = (dmgMatch && dmgMatch[2]) ? dmgMatch[2] : 'Kinetic';

                                            const aoeMatch = desc.match(/(\d+)-hex\s+radius/i) || desc.match(/radius\s+of\s+(\d+)/i);
                                            const shapeMatch = desc.match(/(line|cluster)/i);
                                            let parsedAoe = isBlind ? 0 : (aoeMatch ? parseInt(aoeMatch[1]) : 0);
                                            if (!isBlind && shapeMatch) {
                                                if (shapeMatch[1].toLowerCase() === 'line') parsedAoe = 'line3';
                                                if (shapeMatch[1].toLowerCase() === 'cluster') parsedAoe = 'cluster3';
                                            }

                                            const effMatch = desc.match(/applies\s+\[(.*?)\]/i);
                                            const pEff = effMatch ? effMatch[1] : null;

                                            const terrMatch = desc.match(/terrain:\s*(minor|major|severe|clear)/i);
                                            const pTerrain = terrMatch ? terrMatch[1].toLowerCase() : null;

                                            let eRange = "1";
                                            const rangeMatch = String(ability).match(/range\s+(\d+)(?:-(\d+))?/i);
                                            if (rangeMatch) eRange = rangeMatch[2] ? `${rangeMatch[1]}-${rangeMatch[2]}` : rangeMatch[1];
                                            
                                            return (
                                                <div key={aIdx} className="bg-gray-900 border border-gray-700 p-2 text-sm flex justify-between items-center relative">
                                                    <div>
                                                        <span className="text-[#00f0ff] font-bold text-xs">{cleanName}</span>
                                                        {pEff && <span title={STATE_DESCRIPTIONS[getCoreState(pEff)]} className="block text-purple-400 text-[10px] mt-0.5 cursor-help">[{pEff}]</span>}
                                                        {pTerrain && <span className="block text-yellow-500 text-[10px] mt-0.5">Terrain: [{pTerrain.toUpperCase()}]</span>}
                                                    </div>
                                                    
                                                    <button className={`font-bold px-2 py-1 uppercase text-[10px] border transition-colors ${disableAttacks ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-[#ff6600] hover:text-black border-gray-600'}`} disabled={disableAttacks} onClick={() => {
                                                        if (disableAttacks) return alert("System Locked: Entity is STUNNED.");
                                                        
                                                        let finalRange = isBlind ? '1' : eRange;
                                                        let finalAoe = isBlind ? 0 : parsedAoe;
                                                        if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes and AoE is zeroed.");

                                                        pushUpdate(s => ({ ...s, activeAction: { source: linkedEnemy.name, sourceId: linkedEnemy.uid, isEnemy: true, name: cleanName, d: parsedDmg, a: finalAoe, range: finalRange, effectName: pEff, elementRaw: parsedElement, elementCore: parsedElement, terrain: pTerrain } }))
                                                    }}>
                                                        {disableAttacks ? 'LOCKED' : 'TARGET SKILL'}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 shrink-0">
                                    {(enemy.currentBarriers || []).map((bar, bIdx) => (
                                        <div key={bIdx} className="text-center shrink-0">
                                            <div className="text-[10px] text-[#00f0ff] font-bold">BAR {bIdx+1}</div>
                                            <input type="number" className="w-12 bg-gray-900 border border-[#00f0ff] text-center text-white outline-none" value={bar} onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                pushUpdate(s => {
                                                    const newE = [...(s.encounter?.enemies || [])];
                                                    if (newE[idx]) {
                                                        newE[idx].currentBarriers[bIdx] = val;
                                                        if (val <= 0 && bar > 0) newE[idx].staggered = true;
                                                    }
                                                    return { ...s, encounter: { ...s.encounter, enemies: newE }};
                                                });
                                            }} />
                                        </div>
                                    ))}
                                    <div className="text-center shrink-0">
                                        <div className="text-[10px] text-[#ff6600] font-bold">BASE HP</div>
                                        <input type="number" className="w-16 bg-gray-900 border border-[#ff6600] text-center text-white font-bold text-lg outline-none" value={enemy.currentHp || 0} onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            pushUpdate(s => {
                                                const newE = [...(s.encounter?.enemies || [])];
                                                if (newE[idx]) newE[idx].currentHp = val;
                                                return { ...s, encounter: { ...s.encounter, enemies: newE }};
                                            });
                                        }} />
                                    </div>
                                    <button className="text-gray-600 hover:text-red-500 ml-2 text-xl font-bold transition-colors px-2 shrink-0" onClick={() => updateEnc({ enemies: enemiesList.filter(e => e.uid !== enemy.uid) })}>✕</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}