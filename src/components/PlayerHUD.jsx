/* eslint-disable */
import React, { useState } from 'react';
import { armory } from '../data/armory';

const safeArmory = (Array.isArray(armory) && armory.length > 0) ? armory : [{ id: 'w01', name: 'System Fallback', range: '1', baseDmg: 3 }];

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

const CLASS_AFFINITIES = {
    'Vanguard': { states: ['Knockdown', 'Bleed', 'Shielded', 'Burn', 'Execute'] },
    'Sniper': { states: ['Vulnerable', 'Blind', 'Bleed', 'Execute', 'Evasive'] },
    'Conduit': { states: ['Stunned', 'Shocked', 'Shielded', 'Haste', 'Immobilized'] },
    'Paladin': { states: ['Shielded', 'Burn', 'Knockdown', 'Invulnerable'] },
    'Saboteur': { states: ['Immobilized', 'Blind', 'Slowed', 'Shocked', 'Vulnerable', 'Poisoned'] },
    'Skirmisher': { states: ['Haste', 'Evasive', 'Bleed', 'Slowed'] },
    'Rookie': { states: ['Haste', 'Bleed'] }
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

const getAutomatedAffinity = (playerAffinity, activeClass, wpnElement, spellElementCore, spellEffectCore, uValue) => {
    const cls = CLASS_AFFINITIES[activeClass] || CLASS_AFFINITIES['Rookie'];
    const isWpnSyn = wpnElement === spellElementCore;
    const isEleSyn = playerAffinity === spellElementCore;
    const isStateSyn = cls.states.includes(spellEffectCore);

    if (uValue >= 5 && !isStateSyn) {
        return { alpha: 2.0, label: 'Resistance (Untrained High-Tier State)' };
    }
    if (isEleSyn || isStateSyn || isWpnSyn) {
        let reason = isEleSyn ? 'Innate Affinity' : (isStateSyn ? 'Class State Synergy' : 'Weapon Synergy');
        return { alpha: 0.75, label: `Synergy (${reason})` };
    }
    return { alpha: 1.0, label: 'Neutral (No Direct Alignment)' };
};

export default function PlayerHUD({ players = {}, localId, encounter = {}, tokens = [], pushUpdate }) {
    // NEW: Terrain string added to default builder payload
    const [builder, setBuilder] = useState({ name: '', elementRaw: '', d: 0, u: 0, a: 0, effectName: '', desc: '', terrain: '' });

    const player = players[localId] || {};

    const safePush = (updater) => { if (typeof pushUpdate === 'function') pushUpdate(updater); };
    const updatePlayer = (key, val) => safePush(s => ({ ...s, players: { ...(s.players || {}), [localId]: { ...(s.players?.[localId] || {}), [key]: val } } }));
    const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
    
    const currentRes = player.resPool !== undefined ? safeInt(player.resPool) : 3;

    const isMyTurn = encounter?.activeTurn === 'player' || encounter?.round === 0;

    const front = safeInt(player.dpFront); const supp = safeInt(player.dpSupport); const back = safeInt(player.dpBack);

    const xp = safeInt(player.xp);
    const earnedDp = 5 + Math.floor(xp / 10);
    const spentDp = front + supp + back;
    const availDp = earnedDp - spentDp;

    let activeClass = "Rookie";
    if (front >= 10) activeClass = "Vanguard"; 
    else if (supp >= 10) activeClass = "Conduit";
    else if (back >= 10) activeClass = "Sniper"; 
    else if (front >= 5 && supp >= 5) activeClass = "Paladin";
    else if (front >= 5 && back >= 5) activeClass = "Skirmisher"; 
    else if (supp >= 5 && back >= 5) activeClass = "Saboteur"; 

    const derivedMaxHp = 20 + (front * 3) + (supp * 2) + (back * 1);
    const activeWeapon = safeArmory.find(w => w.id === (player.weaponId || 'w01')) || safeArmory[0];
    const isSynergy = front >= (activeWeapon.reqF || 0) && supp >= (activeWeapon.reqS || 0) && back >= (activeWeapon.reqB || 0);

    let bonusDmg = 0; let bonusFront = 0; let bonusSupp = 0; let bonusBack = 0;
    if (isSynergy) { bonusDmg = activeWeapon.bonusDmg || 0; bonusFront = activeWeapon.bonusFront || 0; bonusSupp = activeWeapon.bonusSupp || 0; bonusBack = activeWeapon.bonusBack || 0; }

    const calcBaseDmg = front + (activeWeapon.baseDmg || 0) + bonusDmg;
    const calcFrontParry = front + (activeWeapon.baseDmg || 0) + bonusFront;
    const calcSuppIntercept = supp + 3 + bonusSupp;
    const calcBackEvasion = back + 3 + bonusBack;

    const builderCoreElement = getCoreElement(builder.elementRaw);
    const builderCoreState = getCoreState(builder.effectName);
    const weaponCoreElement = getCoreElement(activeWeapon.element);
    
    const activeAffinity = player.affinityLocked ? (player.affinity || 'Kinetic') : getCoreElement(player.affinityRaw || 'Kinetic');
    const affinityData = getAutomatedAffinity(activeAffinity, activeClass, weaponCoreElement, builderCoreElement, builderCoreState, safeInt(builder.u));
    
    // NEW: Terrain cost parsing 
    const tCost = builder.terrain === 'minor' ? 1 : builder.terrain === 'clear' ? 2 : builder.terrain === 'major' ? 3 : builder.terrain === 'severe' ? 5 : 0;
    const calcCost = Math.ceil(affinityData.alpha * ((builder.d || 0) + (builder.u || 0) + tCost + Math.pow((builder.a || 0), 2)));

    const myToken = tokens.find(t => t.type === 'player' && t.refId === localId);
    
    const statuses = player.statuses || [];
    const activeCoreStates = statuses.map(st => getCoreState(st));
    const isStunned = activeCoreStates.includes('Stunned');
    const isShocked = activeCoreStates.includes('Shocked');
    const isImmobilized = activeCoreStates.includes('Immobilized');
    const isBlind = activeCoreStates.includes('Blind');

    const disableDefenses = isStunned || isShocked;
    const disableMovement = isStunned || isImmobilized;
    const disableAttacks = isStunned;

    const refreshTurn = () => {
        safePush(s => {
            const newP = { ...(s.players?.[localId] || {}), usedParry: false, usedIntercept: false, usedEvade: false, usedBasicAttack: false };
            const newT = [...(s.tokens || [])];
            const tIdx = newT.findIndex(t => t.type === 'player' && t.refId === localId);
            if (tIdx !== -1) newT[tIdx].movementRemaining = newT[tIdx].speed ?? 3;
            return { ...s, players: { ...s.players, [localId]: newP }, tokens: newT };
        });
    };

    const saveToHUD = () => {
        const cards = player.customCards || [];
        const actionName = builder.name || 'Custom Action';
        if (cards.length >= 4) return alert("HUD is full (Max 4). Remove an active skill first to make room.");
        if (cards.some(c => String(c.name).toLowerCase() === actionName.toLowerCase())) return alert(`"${actionName}" is already equipped in your HUD. Please give this ability a unique name.`);
        updatePlayer('customCards', [...cards, { ...builder, name: actionName, elementRaw: builder.elementRaw || 'Kinetic', elementCore: builderCoreElement, effectCore: builderCoreState, alpha: affinityData.alpha, cost: calcCost, id: Date.now() }]);
    };
    
    const saveToSpellbook = () => {
        const archived = player.savedSkills || [];
        const actionName = builder.name || 'Custom Action';
        if (archived.some(s => String(s.name).toLowerCase() === actionName.toLowerCase())) return alert(`"${actionName}" is already in your Spellbook. Please give this ability a unique name.`);
        updatePlayer('savedSkills', [...archived, { ...builder, name: actionName, elementRaw: builder.elementRaw || 'Kinetic', elementCore: builderCoreElement, effectCore: builderCoreState, alpha: affinityData.alpha, cost: calcCost, id: Date.now() }]);
        alert("Ability archived to Spellbook!");
    };

    const archiveEquippedCard = (card) => {
        const archived = player.savedSkills || [];
        if (archived.some(s => String(s.name).toLowerCase() === String(card.name).toLowerCase())) return alert(`"${card.name}" is already archived in your Spellbook.`);
        updatePlayer('savedSkills', [...archived, card]);
        alert(`"${card.name}" archived to Spellbook!`);
    };
    
    const rollImprovised = () => {
        if (disableAttacks) return alert("System Locked: Agent is STUNNED.");
        updatePlayer('resPool', Math.max(0, currentRes - 1));
        const roll = Math.floor(Math.random() * 6) + 1;
        let outcome = "";
        if (roll <= 2) outcome = "Backlash (Failure & Consequence)";
        else if (roll <= 4) outcome = "Surge (Success at a Cost)";
        else outcome = "Cascade (Total Success)";
        alert(`Improvised Skill Roll: ${roll}\nOutcome: ${outcome}`);
    };

    const primeMove = () => { 
        if (!isMyTurn) return alert("System Locked: Hostile turn in progress. Cannot initiate movement array.");
        if (disableMovement) return alert("System Locked: Agent is STUNNED or IMMOBILIZED.");
        safePush(s => ({ ...s, activeAction: { type: 'move', source: player.name || 'Player', sourceId: localId, isEnemy: false } })); 
    };
    
    const primeWeapon = () => { 
        if (!isMyTurn) return alert("System Locked: Hostile turn in progress. Cannot initiate targeting array.");
        if (player.usedBasicAttack) return alert("System Locked: Basic attack already executed this turn.");
        if (disableAttacks) return alert("System Locked: Agent is STUNNED.");
        
        let finalRange = isBlind ? '1' : activeWeapon.range;
        if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes.");

        const rawWpn = activeWeapon.element || 'Kinetic';
        const coreWpn = getCoreElement(rawWpn);
        safePush(s => ({ ...s, activeAction: { source: player.name || 'Player', sourceId: localId, isEnemy: false, isBasic: true, cost: 0, name: activeWeapon.name, d: calcBaseDmg, a: 0, range: finalRange, elementRaw: rawWpn, elementCore: coreWpn } })); 
    };
    
    const primeCard = (c) => { 
        if (!isMyTurn) return alert("System Locked: Hostile turn in progress. Cannot initiate targeting array.");
        if (currentRes < c.cost) return alert(`System Locked: Insufficient Resonance. Required: ${c.cost}.`);
        if (disableAttacks) return alert("System Locked: Agent is STUNNED.");
        
        let finalRange = isBlind ? '1' : (activeWeapon.range || '1');
        let finalAoe = isBlind ? 0 : (c.a || 0);
        if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes and AoE is zeroed.");

        // NEW: Injects c.terrain seamlessly into the Grid targeting payload
        safePush(s => ({ ...s, activeAction: { source: player.name || 'Player', sourceId: localId, isEnemy: false, isBasic: false, cost: c.cost, name: c.name || 'Custom Action', d: c.d, a: finalAoe, u: c.u, range: finalRange, effectName: c.effectName, effectCore: c.effectCore, elementRaw: c.elementRaw || 'Kinetic', elementCore: c.elementCore || 'Kinetic', terrain: c.terrain, desc: c.desc } })); 
    };

    const reqString = (w) => {
        if (!w.reqF && !w.reqS && !w.reqB) return 'No Req';
        let r = [];
        if (w.reqF) r.push(`${w.reqF}F`); if (w.reqS) r.push(`${w.reqS}S`); if (w.reqB) r.push(`${w.reqB}B`);
        return `Req: ${r.join('/')}`;
    };

    const customCards = player.customCards || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-sm">
            
            {!isMyTurn && (
                <div className="col-span-1 lg:col-span-3 bg-red-950 border border-red-500 text-red-400 p-3 text-center font-bold tracking-widest uppercase animate-pulse shadow-md">
                    ⚠ STANDBY: HOSTILE TURN IN PROGRESS. OFFENSIVE ARRAYS LOCKED.
                </div>
            )}

            <div className="bg-[#1a222c] p-4 border border-slate-700">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
                    <h2 className="text-[#00f0ff] font-bold text-xl">Character Uplink</h2>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-900 px-2 py-1 border border-gray-700">
                        Movement: <span className="text-white">{myToken ? `${myToken.movementRemaining ?? myToken.speed ?? 3} / ${myToken.speed ?? 3}` : 'Off Grid'}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    
                    <div className="flex gap-2">
                        <input className="flex-1 bg-black border border-gray-600 p-2 text-white outline-none font-bold" placeholder="Callsign / Name" value={player.name || ''} onChange={e => updatePlayer('name', e.target.value)} />
                        {player.affinityLocked ? (
                            <div className="w-1/3 bg-black border border-[#00f0ff] text-[#00f0ff] p-1 flex flex-col items-center justify-center font-bold tracking-wider shadow-[0_0_10px_rgba(0,240,255,0.2)]" title="Innate Affinity (Locked)">
                                <span className="text-[10px] uppercase truncate w-full text-center leading-none mb-0.5">{player.affinityRaw || player.affinity}</span>
                                <span className="text-[7px] text-gray-400 leading-none">CORE: {player.affinity}</span>
                            </div>
                        ) : (
                            <div className="w-1/3 flex border border-[#ff6600]" title="Type any concept (e.g. Magma, Void)">
                                <input type="text" className="flex-1 bg-black text-[#ff6600] text-[10px] font-bold px-1.5 outline-none uppercase placeholder-[#ff6600]/40 w-full" placeholder="ELEMENT..." value={player.affinityRaw || ''} onChange={e => updatePlayer('affinityRaw', e.target.value)} />
                                <button className="bg-[#ff6600] text-black px-2 font-bold text-[10px] hover:bg-white transition-colors" onClick={() => {
                                    const rawVal = player.affinityRaw || 'Kinetic';
                                    const coreVal = getCoreElement(rawVal);
                                    if(window.confirm(`Lock in ${rawVal.toUpperCase()} [Core: ${coreVal}] as your permanent Innate Affinity?`)) {
                                        safePush(s => ({
                                            ...s,
                                            players: {
                                                ...(s.players || {}),
                                                [localId]: {
                                                    ...(s.players?.[localId] || {}),
                                                    affinityRaw: rawVal,
                                                    affinity: coreVal,
                                                    affinityLocked: true
                                                }
                                            }
                                        }));
                                    }
                                }}>LOCK</button>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-4">
                        <div className="flex-1 bg-black border border-red-500 p-2 flex flex-col justify-center">
                            <label className="text-red-500 text-[10px] font-bold tracking-widest block mb-1 text-center">CURRENT HP</label>
                            <input type="number" className="w-full bg-transparent text-white text-3xl font-bold outline-none text-center" value={player.currentHp ?? derivedMaxHp} onChange={e => updatePlayer('currentHp', safeInt(e.target.value))} />
                        </div>
                        <div className="flex-1 bg-black border border-gray-600 p-2 flex flex-col justify-center">
                            <label className="text-gray-400 text-[10px] font-bold tracking-widest block mb-1 text-center">MAX HP</label>
                            <div className="w-full bg-transparent text-gray-400 text-3xl font-bold text-center mt-1 cursor-not-allowed" title="Max HP automatically scales via Discipline Points.">{derivedMaxHp}</div>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[#ff6600] font-bold text-lg bg-black p-2 border border-gray-700 mt-2">
                        <span>CLASS:</span><span>{activeClass}</span>
                    </div>

                    <div className="bg-black border border-[#00f0ff] p-3 text-center">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-left">
                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">TOTAL XP</span>
                                <div className="text-[#00f0ff] font-bold text-lg">{xp}</div>
                            </div>
                            <div className="text-right">
                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">AVAILABLE DP</span>
                                <div className={`font-bold text-lg ${availDp > 0 ? 'text-[#22c55e]' : 'text-gray-500'}`}>{Math.max(0, availDp)} / {earnedDp}</div>
                            </div>
                        </div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest text-left">Base DP: 5 | +1 DP per 10 XP</div>
                    </div>

                    <div className="flex gap-2 text-center text-xs mt-2">
                        <div className="flex-1 bg-black border border-gray-600 p-1.5 flex flex-col">
                            <label className="text-gray-400 block mb-1 font-bold">Front DP</label>
                            <div className="flex items-center justify-between bg-gray-900 border border-gray-700 mt-auto">
                                <button className="px-2 py-1 hover:text-white" onClick={() => updatePlayer('dpFront', Math.max(0, front - 1))}>-</button>
                                <span className="font-bold text-white text-lg">{front}</span>
                                <button className="px-2 py-1 hover:text-[#22c55e] disabled:text-gray-600" disabled={availDp <= 0} onClick={() => { if(availDp>0) updatePlayer('dpFront', front + 1) }}>+</button>
                            </div>
                        </div>
                        <div className="flex-1 bg-black border border-gray-600 p-1.5 flex flex-col">
                            <label className="text-gray-400 block mb-1 font-bold">Supp DP</label>
                            <div className="flex items-center justify-between bg-gray-900 border border-gray-700 mt-auto">
                                <button className="px-2 py-1 hover:text-white" onClick={() => updatePlayer('dpSupport', Math.max(0, supp - 1))}>-</button>
                                <span className="font-bold text-white text-lg">{supp}</span>
                                <button className="px-2 py-1 hover:text-[#22c55e] disabled:text-gray-600" disabled={availDp <= 0} onClick={() => { if(availDp>0) updatePlayer('dpSupport', supp + 1) }}>+</button>
                            </div>
                        </div>
                        <div className="flex-1 bg-black border border-gray-600 p-1.5 flex flex-col">
                            <label className="text-gray-400 block mb-1 font-bold">Back DP</label>
                            <div className="flex items-center justify-between bg-gray-900 border border-gray-700 mt-auto">
                                <button className="px-2 py-1 hover:text-white" onClick={() => updatePlayer('dpBack', Math.max(0, back - 1))}>-</button>
                                <span className="font-bold text-white text-lg">{back}</span>
                                <button className="px-2 py-1 hover:text-[#22c55e] disabled:text-gray-600" disabled={availDp <= 0} onClick={() => { if(availDp>0) updatePlayer('dpBack', back + 1) }}>+</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-700 pt-4">
                        <h3 className="text-gray-400 mb-2 font-bold uppercase tracking-widest text-xs">Loadout</h3>
                        <select className="w-full bg-black border border-gray-600 p-2 text-white outline-none mb-2 text-xs" value={player.weaponId || 'w01'} onChange={e => updatePlayer('weaponId', e.target.value)}>
                            {safeArmory.map(w => ( <option key={w.id} value={w.id}>{w.name} [{reqString(w)}]</option> ))}
                        </select>
                        <div className={`p-2 text-xs border relative ${isSynergy ? 'bg-orange-950/30 border-[#ff6600] text-orange-200' : 'bg-gray-900 border-gray-700 text-gray-500'}`}>
                            <div className="font-bold mb-1 uppercase tracking-wider">{isSynergy ? '✓ DP Req Met (Synergy Active)' : '⚠ DP Req Not Met'}</div>
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="font-bold text-white mb-1">Base Dmg: {calcBaseDmg}</div>
                                    <div>Range: {activeWeapon.range} Hexes</div>
                                    {isSynergy && <div className="text-[#ff6600] font-bold mt-1">Bonus: {activeWeapon.bonusDesc}</div>}
                                </div>
                                <button className={`font-bold px-3 py-1 uppercase transition-colors ${(isMyTurn && !player.usedBasicAttack && !disableAttacks) ? 'bg-[#00f0ff] text-black hover:bg-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`} disabled={!isMyTurn || player.usedBasicAttack || disableAttacks} onClick={primeWeapon}>
                                    {disableAttacks ? 'LOCKED' : (player.usedBasicAttack ? 'EXHAUSTED' : 'BASIC ATTACK')}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-700 pt-4 space-y-3">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Defensive Actions</h3>
                            <button className="text-[10px] bg-gray-800 border border-gray-600 px-2 py-0.5 text-white hover:bg-[#00f0ff] hover:text-black transition-colors" onClick={refreshTurn}>
                                ↻ Refresh Turn
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2">
                            <div>
                                <span className={(player.usedParry || disableDefenses) ? "text-red-500 line-through mr-2" : "text-[#00f0ff] mr-2"}>Front Parry:</span>
                                <span className={(player.usedParry || disableDefenses) ? "text-gray-600" : (bonusFront>0 ? "font-bold text-[#ff6600]" : "font-bold text-white")}>{calcFrontParry}</span>
                            </div>
                            <button className={`text-[10px] px-2 py-1 font-bold border ${(player.usedParry || disableDefenses) ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedParry || disableDefenses} onClick={() => updatePlayer('usedParry', true)}>
                                {disableDefenses ? 'JAMMED' : (player.usedParry ? 'EXHAUSTED' : 'AVAILABLE')}
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2">
                            <div>
                                <span className={(player.usedIntercept || disableDefenses) ? "text-red-500 line-through mr-2" : "text-[#00f0ff] mr-2"}>Support Intercept:</span>
                                <span className={(player.usedIntercept || disableDefenses) ? "text-gray-600" : (bonusSupp>0 ? "font-bold text-[#ff6600]" : "font-bold text-white")}>{calcSuppIntercept}</span>
                            </div>
                            <button className={`text-[10px] px-2 py-1 font-bold border ${(player.usedIntercept || disableDefenses) ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedIntercept || disableDefenses} onClick={() => updatePlayer('usedIntercept', true)}>
                                {disableDefenses ? 'JAMMED' : (player.usedIntercept ? 'EXHAUSTED' : 'AVAILABLE')}
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2">
                            <div>
                                <span className={(player.usedEvade || disableDefenses) ? "text-red-500 line-through mr-2" : "text-[#00f0ff] mr-2"}>Backline Evasion:</span>
                                <span className={(player.usedEvade || disableDefenses) ? "text-gray-600" : (bonusBack>0 ? "font-bold text-[#ff6600]" : "font-bold text-white")}>{calcBackEvasion}</span>
                            </div>
                            <button className={`text-[10px] px-2 py-1 font-bold border ${(player.usedEvade || disableDefenses) ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedEvade || disableDefenses} onClick={() => updatePlayer('usedEvade', true)}>
                                {disableDefenses ? 'JAMMED' : (player.usedEvade ? 'EXHAUSTED' : 'AVAILABLE')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#1a222c] p-4 border border-slate-700 flex flex-col items-center justify-center">
                <h2 className="text-[#ff6600] font-bold text-2xl tracking-widest mb-4">RESONANCE</h2>
                <div className="text-8xl text-white mb-6 drop-shadow-[0_0_15px_rgba(255,102,0,0.5)]">{currentRes}<span className="text-3xl text-gray-500">/10</span></div>
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, currentRes + 1))}>+1 Assist</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, currentRes + 2))}>+2 Tag-Team</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, currentRes + 2))}>+2 Exploit</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, currentRes + 1))}>+1 Banter</button>
                </div>
                <button className={`w-full font-bold p-3 uppercase transition-colors ${disableAttacks ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#00f0ff] text-black hover:bg-white'}`} disabled={disableAttacks} onClick={rollImprovised}>
                    {disableAttacks ? 'SYSTEM LOCKED' : 'Improvised Skill (-1 Res)'}
                </button>
            </div>

            <div className="bg-[#1a222c] p-4 border border-slate-700 flex flex-col h-full">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2">Synthesis Matrix</h2>
                <div className="space-y-3 mb-4 flex-1">
                    <div className="flex justify-between items-center"><span className="text-gray-300">Skill Name:</span><input type="text" className="w-40 bg-black border border-[#00f0ff] p-1 text-white outline-none font-bold" placeholder="Custom Action" value={builder.name} onChange={e=>setBuilder({...builder, name: e.target.value})} /></div>
                    
                    <div className="flex justify-between items-center">
                        <span className="text-gray-300" title="Type any word (e.g. Magma, Void, Sound)">Concept (Element):</span>
                        <input type="text" className="w-32 bg-black border border-gray-600 p-1 text-white text-xs text-right outline-none focus:border-[#ff6600]" placeholder="e.g. Magma, Sonic" value={builder.elementRaw} onChange={e=>setBuilder({...builder, elementRaw: e.target.value})} />
                    </div>

                    <div className="flex justify-between items-center"><span>Damage (d):</span><input type="number" className="w-16 bg-black border border-gray-600 p-1 text-center text-white" value={builder.d} onChange={e=>setBuilder({...builder, d: safeInt(e.target.value)})} /></div>
                    
                    <div className="flex justify-between items-center"><span>Utility (u):</span><select className="w-32 bg-black border border-gray-600 p-1 text-white" value={String(builder.u)} onChange={e=>setBuilder({...builder, u: safeInt(e.target.value)})}>
                        <option value="0">0</option>
                        <option value="1">1 (Minor)</option>
                        <option value="3">3 (Major)</option>
                        <option value="5">5 (Severe)</option>
                        <option value="10">10 (Terminal)</option>
                    </select></div>
                    
                    {builder.u > 0 && (
                        <div className="flex justify-between items-center animate-fade-in">
                            <span className="text-purple-400">State Concept:</span>
                            <input type="text" className="w-32 bg-black border border-purple-500 p-1 text-white outline-none text-right" placeholder="e.g. Erase, Snare, Venom" value={builder.effectName || ''} onChange={e=>setBuilder({...builder, effectName: e.target.value})} />
                        </div>
                    )}

                    <div className="flex justify-between items-center"><span>AoE Radius (a):</span><select className="w-24 bg-black border border-gray-600 p-1 text-white" value={String(builder.a)} onChange={e=>setBuilder({...builder, a: safeInt(e.target.value)})}>
                        <option value="0">0</option><option value="1">1 (Small)</option><option value="2">2 (Large)</option>
                    </select></div>

                    {/* NEW: Terrain Generation Interface */}
                    <div className="flex justify-between items-center"><span>Terrain Gen (t):</span><select className="w-32 bg-black border border-gray-600 p-1 text-white" value={builder.terrain || ''} onChange={e=>setBuilder({...builder, terrain: e.target.value})}>
                        <option value="">None</option>
                        <option value="minor">Minor (+1)</option>
                        <option value="clear">Clear (+2)</option>
                        <option value="major">Major (+3)</option>
                        <option value="severe">Severe (+5)</option>
                    </select></div>
                    
                    <div className="bg-gray-900 border border-gray-700 p-2 mt-2">
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Affinity Calculation (α)</span>
                        <div className={`text-xs font-bold ${affinityData.alpha === 0.75 ? 'text-[#22c55e]' : affinityData.alpha === 2.0 ? 'text-red-500' : 'text-[#00f0ff]'}`}>
                            {affinityData.alpha}x | {affinityData.label}
                        </div>
                    </div>

                    <div className="mt-4">
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Description / Flavor Text:</span>
                        <textarea className="w-full bg-black border border-gray-600 text-gray-300 p-2 text-xs outline-none resize-none" rows="2" placeholder="E.g., A searing lance of pure heat..." value={builder.desc || ''} onChange={e=>setBuilder({...builder, desc: e.target.value})}></textarea>
                    </div>
                </div>

                <div className="bg-black p-3 border border-[#ff6600] flex justify-between items-center text-[#ff6600] font-bold text-xl mb-4 mt-auto"><span>COST:</span><span>{calcCost} RES</span></div>
                <div className="flex gap-2 mb-4">
                    <button className="flex-1 bg-[#00f0ff] text-black font-bold border border-[#00f0ff] p-2 hover:bg-white text-xs uppercase" onClick={saveToHUD}>Equip</button>
                    <button className="flex-1 bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700 text-white text-xs uppercase" onClick={saveToSpellbook}>Archive</button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                    {customCards.map(c => {
                        const dispRaw = c.elementRaw || c.element || 'Kinetic';
                        const dispCore = c.elementCore || c.element || 'Kinetic';
                        const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;
                        
                        const isNoFuel = currentRes < c.cost;

                        return (
                            <div key={c.id} className="bg-black border border-[#00f0ff] p-2 text-xs relative group flex flex-col">
                                <div className="flex-1 pr-6 pb-2">
                                    <div className="font-bold text-[#00f0ff] truncate">{c.name || 'Custom Action'}</div>
                                    <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-800 pb-1 truncate" title={showType}>Type: {showType}</div>
                                    <div className="text-white font-bold mb-1 mt-1 text-[10px]">Cost: -{c.cost} Res</div>
                                    {c.effectName && <div className="absolute top-2 right-2 text-purple-400 text-[10px] font-bold">[{c.effectName}]</div>}
                                    
                                    {/* NEW: Card visualizes Active Terrain Shift */}
                                    {c.terrain && <div className="text-yellow-500 text-[10px] font-bold mt-1">Terrain: [{c.terrain.toUpperCase()}]</div>}
                                    
                                    <button className={`mt-auto w-full font-bold py-1 uppercase transition-colors ${(isNoFuel || disableAttacks || !isMyTurn) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-white hover:text-black'}`} disabled={isNoFuel || disableAttacks || !isMyTurn} onClick={() => primeCard(c)}>
                                        {disableAttacks ? 'LOCKED' : (isNoFuel ? 'NO FUEL' : 'TARGET SKILL')}
                                    </button>
                                </div>
                                <button className="absolute top-0 right-6 w-6 h-6 flex items-center justify-center bg-gray-900 border-l border-b border-gray-700 text-gray-400 hover:text-black hover:bg-[#00f0ff] transition-colors" onClick={(e) => { e.stopPropagation(); archiveEquippedCard(c); }} title="Archive to Spellbook">⤓</button>
                                <button className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-gray-900 border-l border-b border-gray-700 text-gray-400 hover:text-white hover:bg-red-800 transition-colors" onClick={(e) => { e.stopPropagation(); updatePlayer('customCards', customCards.filter(card => card.id !== c.id)); }}>✕</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}