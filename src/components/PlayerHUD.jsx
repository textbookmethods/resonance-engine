/* eslint-disable */
import React, { useState } from 'react';
import { armory } from '../data/armory';

// MINIFIED DICTIONARIES & CONSTANTS
const safeArmory = (Array.isArray(armory) && armory.length > 0) ? armory : [{ id: 'w01', name: 'System Fallback', range: '1', baseDmg: 3 }];
const ELEMENT_DICTIONARY = { 'thermal': ['fire', 'heat', 'magma', 'lava', 'ash', 'plasma', 'steam', 'solar', 'sun', 'flame', 'pyro', 'scorch', 'burn', 'inferno', 'ignition'], 'cryo': ['ice', 'cold', 'frost', 'snow', 'water', 'liquid', 'ocean', 'glacier', 'hydro', 'aqua', 'chill', 'blizzard', 'freeze', 'arctic'], 'electro': ['lightning', 'electric', 'spark', 'thunder', 'magnetic', 'storm', 'volt', 'shock', 'galvanic', 'energy', 'emp'], 'toxic': ['poison', 'acid', 'venom', 'decay', 'rot', 'radiation', 'bio', 'gas', 'smog', 'plague', 'blight', 'corrosive', 'noxious', 'viral', 'chemical'], 'radiant': ['light', 'holy', 'divine', 'healing', 'spirit', 'luminous', 'glow', 'life', 'order', 'sacred', 'blessed', 'purify', 'stellar'], 'void': ['dark', 'shadow', 'space', 'gravity', 'time', 'cosmic', 'null', 'psychic', 'mind', 'mental', 'chaos', 'entropy', 'abyss', 'astral', 'telekinetic', 'warp'], 'kinetic': ['physical', 'force', 'bludgeoning', 'piercing', 'slashing', 'earth', 'stone', 'rock', 'wind', 'air', 'pressure', 'metal', 'steel', 'sand', 'dust', 'aero', 'geo', 'sound', 'sonic', 'acoustic', 'seismic', 'blood'] };
const STATE_DICTIONARY = { 'Hijacked': ['hijack', 'mind control', 'dominate', 'possess', 'control'], 'Execute': ['execute', 'erase', 'delete'], 'Bleed': ['bleed', 'hemorrhage', 'lacerate'], 'Burn': ['burn', 'ignite', 'scorch'], 'Poisoned': ['poison', 'venom', 'decay'], 'Immobilized': ['immobilize', 'root', 'snare'], 'Stunned': ['stun', 'paralyze', 'petrify'], 'Shielded': ['shield', 'protect', 'barrier'], 'Vulnerable': ['vulnerable', 'expose', 'sunder'], 'Knockdown': ['knockdown', 'trip', 'shove'], 'Blind': ['blind', 'obscure', 'smoke'], 'Haste': ['haste', 'speed', 'quick'], 'Slowed': ['slow', 'sluggish', 'chill'], 'Shocked': ['shock', 'glitch', 'jolt'], 'Evasive': ['evade', 'dodge', 'blur'], 'Invulnerable': ['invulnerable', 'stasis', 'immune'] };
const MOBILITY_DICTIONARY = { 'Blink': ['blink', 'teleport', 'jump'], 'Push': ['push', 'repel', 'throw'], 'Pull': ['pull', 'attract', 'draw'] };
const CLASS_AFFINITIES = { 'Vanguard': { states: ['Knockdown', 'Bleed', 'Shielded', 'Burn', 'Execute'] }, 'Sniper': { states: ['Vulnerable', 'Blind', 'Bleed', 'Execute', 'Evasive'] }, 'Conduit': { states: ['Stunned', 'Shocked', 'Shielded', 'Haste', 'Immobilized'] }, 'Paladin': { states: ['Shielded', 'Burn', 'Knockdown', 'Invulnerable'] }, 'Saboteur': { states: ['Immobilized', 'Blind', 'Slowed', 'Shocked', 'Vulnerable', 'Poisoned'] }, 'Skirmisher': { states: ['Haste', 'Evasive', 'Bleed', 'Slowed'] }, 'Rookie': { states: ['Haste', 'Bleed'] } };
const ELEMENT_DESCRIPTIONS = { 'Kinetic': 'Physical force, bludgeoning, slashing, earth, wind.', 'Thermal': 'Heat, fire, plasma, magma.', 'Cryo': 'Cold, ice, water, frost.', 'Electro': 'Lightning, electricity, magnetic.', 'Toxic': 'Poison, acid, radiation, decay.', 'Radiant': 'Light, holy, healing, order.', 'Void': 'Dark, gravity, space, psychic.' };
const STATE_DESCRIPTIONS = { 'Hijacked': 'Unit is controlled by opposing network.', 'Execute': 'Instantly reduces HP to 0. Bypasses Invulnerable/Shields.', 'Bleed': 'Takes 1 True Damage at start of turn.', 'Burn': 'Takes 2 Thermal Damage at start of turn. Water/Cryo cancels.', 'Poisoned': 'Healing received halved. Takes 1 Toxic Damage at start of turn.', 'Immobilized': 'Movement reduced to 0. Cannot be pushed/pulled.', 'Stunned': 'Movement reduced to 0. Cannot act. Evasion drops to 0.', 'Shielded': 'Energy barrier mitigating incoming payloads.', 'Vulnerable': 'Takes 1.5x damage from all sources.', 'Knockdown': 'Movement points halved next turn. Melee attacks against unit gain Flanking.', 'Blind': 'Targeting range reduced to 1. AoE radius becomes 0.', 'Haste': '+2 Movement Points.', 'Slowed': '-2 Movement Points.', 'Shocked': 'Cannot use abilities costing >2 Res.', 'Evasive': 'Automatically mitigates next non-Flanking/non-AoE attack.', 'Invulnerable': 'Negates all incoming damage.' };
const ELEMENT_STATE_MAP = { 'Kinetic': ['Bleed', 'Immobilized', 'Stunned', 'Shielded', 'Vulnerable', 'Knockdown', 'Evasive'], 'Thermal': ['Burn', 'Blind', 'Vulnerable', 'Execute'], 'Cryo': ['Slowed', 'Immobilized', 'Stunned', 'Shielded'], 'Electro': ['Shocked', 'Stunned', 'Haste', 'Blind', 'Hijacked'], 'Toxic': ['Poisoned', 'Blind', 'Vulnerable'], 'Radiant': ['Blind', 'Haste', 'Shielded', 'Invulnerable'], 'Void': ['Execute', 'Evasive', 'Blind', 'Slowed', 'Immobilized', 'Hijacked'] };
const STATE_TIERS = { 'Bleed': 1, 'Burn': 1, 'Poisoned': 1, 'Haste': 1, 'Slowed': 1, 'Knockdown': 3, 'Blind': 3, 'Shielded': 3, 'Vulnerable': 3, 'Shocked': 3, 'Evasive': 3, 'Immobilized': 5, 'Stunned': 5, 'Invulnerable': 5, 'Execute': 10, 'Hijacked': 10 };

// UTILS
const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const safeArray = (arr) => { if (!arr) return []; if (Array.isArray(arr)) return arr.filter(i => i !== null && i !== undefined); if (typeof arr === 'object') return Object.values(arr).filter(i => i !== null && i !== undefined); return []; };
const getCoreState = (input) => { if (!input) return ''; const match = String(input).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(input)).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };
const getCoreElement = (input) => { if (!input) return 'Kinetic'; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(ELEMENT_DICTIONARY)) { if (core === clean || synonyms.includes(clean)) return core.charAt(0).toUpperCase() + core.slice(1); } return 'Kinetic'; };
const getCoreMobility = (input) => { if (!input) return ''; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(MOBILITY_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };

const getAutomatedAffinity = (playerAffinity, activeClass, wpnElement, spellElementCore, spellEffectCore, uValue) => {
    const cls = CLASS_AFFINITIES[activeClass] || CLASS_AFFINITIES['Rookie']; const isWpnSyn = wpnElement === spellElementCore; const isEleSyn = playerAffinity === spellElementCore; const isStateSyn = cls.states.includes(spellEffectCore);
    const pElem = playerAffinity ? String(playerAffinity).toLowerCase() : 'kinetic'; const sElem = spellElementCore ? String(spellElementCore).toLowerCase() : 'kinetic';
    const isOpposed = (sElem === 'toxic' && pElem === 'thermal') || (sElem === 'thermal' && pElem === 'cryo') || (sElem === 'cryo' && pElem === 'toxic') || (sElem === 'radiant' && pElem === 'void') || (sElem === 'void' && pElem === 'radiant') || (sElem === 'electro' && pElem === 'kinetic') || (sElem === 'kinetic' && pElem === 'electro');
    if (isOpposed) return { alpha: 2.0, label: 'Resistance (Opposed RPS Element)' }; if (uValue >= 5 && !isStateSyn) return { alpha: 2.0, label: 'Resistance (Untrained High-Tier State)' };
    if (isEleSyn || isStateSyn || isWpnSyn) return { alpha: 0.75, label: `Synergy (${isEleSyn ? 'Innate Affinity' : (isStateSyn ? 'Class State Synergy' : 'Weapon Synergy')})` }; return { alpha: 1.0, label: 'Neutral (No Direct Alignment)' };
};
const getAoeCost = (a) => { if (a === 'line3' || a === 'cluster3') return 1; const n = parseInt(a) || 0; return n * n; };

export default function PlayerHUD({ players = {}, localId, encounter = {}, tokens = [], pushUpdate }) {
    const [builder, setBuilder] = useState({ name: '', elementRaw: 'Kinetic', payload: 'damage', d: 0, u: 0, a: 0, effectName: '', desc: '', terrain: '', m: 0, mobilityName: '', isEcho: false });
    const [riftValue, setRiftValue] = useState(1);

    const rawPlayer = players[localId];
    const player = rawPlayer || { name: 'Agent', weaponId: 'w01', xp: 0, currentHp: 20, dpFront: 0, dpSupport: 0, dpBack: 0, resPool: 3, customCards: [], savedSkills: [], statuses: [], affinityRaw: 'Kinetic', affinity: 'Kinetic', affinityLocked: false };

    const safePush = (updater) => { if (typeof pushUpdate === 'function') pushUpdate(updater); };
    const updatePlayer = (key, val) => safePush(s => ({ ...s, players: { ...(s.players || {}), [localId]: { ...(s.players?.[localId] || {}), [key]: val } } }));
    
    const currentRes = player.resPool !== undefined ? safeInt(player.resPool) : 3;
    const myToken = safeArray(tokens).find(t => t.type === 'player' && String(t.refId) === String(localId));

    let isMyTurn = false; const initQueueActive = safeArray(encounter?.initiativeQueue).length > 0;
    if (initQueueActive) { if (myToken && encounter?.activeTokenId === String(myToken.id)) isMyTurn = true; } else { isMyTurn = encounter?.activeTurn === 'player' || encounter?.round === 0; }

    const front = safeInt(player.dpFront); const supp = safeInt(player.dpSupport); const back = safeInt(player.dpBack);
    const xp = safeInt(player.xp); const earnedDp = 5 + Math.floor(xp / 10); const spentDp = front + supp + back; const availDp = earnedDp - spentDp;

    let activeClass = "Rookie";
    if (front >= 10) activeClass = "Vanguard"; else if (supp >= 10) activeClass = "Conduit"; else if (back >= 10) activeClass = "Sniper"; else if (front >= 5 && supp >= 5) activeClass = "Paladin"; else if (front >= 5 && back >= 5) activeClass = "Skirmisher"; else if (supp >= 5 && back >= 5) activeClass = "Saboteur"; 

    const derivedMaxHp = 20 + (front * 3) + (supp * 2) + (back * 1);
    const activeWeapon = safeArmory.find(w => String(w.id) === String(player.weaponId || 'w01')) || safeArmory[0];
    const isSynergy = front >= (activeWeapon.reqF || 0) && supp >= (activeWeapon.reqS || 0) && back >= (activeWeapon.reqB || 0);

    let bonusDmg = 0; let bonusFront = 0; let bonusSupp = 0; let bonusBack = 0;
    if (isSynergy) { bonusDmg = activeWeapon.bonusDmg || 0; bonusFront = activeWeapon.bonusFront || 0; bonusSupp = activeWeapon.bonusSupp || 0; bonusBack = activeWeapon.bonusBack || 0; }

    const calcBaseDmg = front + (activeWeapon.baseDmg || 0) + bonusDmg; const calcFrontParry = front + (activeWeapon.baseDmg || 0) + bonusFront; const calcSuppIntercept = supp + 3 + bonusSupp; const calcBackEvasion = back + 3 + bonusBack;

    const builderCoreElement = getCoreElement(builder.elementRaw); const builderCoreState = getCoreState(builder.effectName); const weaponCoreElement = getCoreElement(activeWeapon.element || 'Kinetic');
    const activeAffinity = player.affinityLocked ? (player.affinity || 'Kinetic') : getCoreElement(player.affinityRaw || 'Kinetic');
    const affinityData = getAutomatedAffinity(activeAffinity, activeClass, weaponCoreElement, builderCoreElement, builderCoreState, safeInt(builder.u));
    const tCost = builder.terrain === 'minor' ? 1 : builder.terrain === 'clear' ? 2 : builder.terrain === 'major' ? 3 : builder.terrain === 'severe' ? 5 : 0;
    const calcCost = Math.ceil(affinityData.alpha * ((safeInt(builder.d) || 0) + (safeInt(builder.u) || 0) + tCost + safeInt(builder.m) + getAoeCost(builder.a)));
    
    const statuses = safeArray(player.statuses); const activeCoreStates = statuses.map(st => getCoreState(st));
    const isStunned = activeCoreStates.includes('Stunned'); const isShocked = activeCoreStates.includes('Shocked'); const isImmobilized = activeCoreStates.includes('Immobilized'); const isBlind = activeCoreStates.includes('Blind');
    const disableDefenses = isStunned || isShocked; const disableMovement = isStunned || isImmobilized; const disableAttacks = isStunned;

    const isDeploymentPhase = encounter?.round === 0;
    const lockImprovise = disableAttacks || isDeploymentPhase || !isMyTurn;

    const maxRift = Math.min(10, Math.max(1, (player.currentHp ?? derivedMaxHp) - 1));

    const refreshTurn = () => {
        safePush(s => {
            const newP = { ...(s.players?.[localId] || {}), usedParry: false, usedIntercept: false, usedEvade: false, usedBasicAttack: false };
            const newT = deepClone(safeArray(s.tokens)); const tIdx = newT.findIndex(t => t.type === 'player' && String(t.refId) === String(localId)); if (tIdx !== -1) newT[tIdx].movementRemaining = newT[tIdx].speed ?? 3;
            return { ...s, players: { ...s.players, [localId]: newP }, tokens: newT };
        });
    };

    const respecAgent = () => {
        if (window.confirm('Reset this Agent to Base Spec? (Clears all DP to 0, heals to 20, and purges active HUD cards)')) {
            safePush(s => ({ ...s, players: { ...(s.players || {}), [localId]: { ...(s.players?.[localId] || {}), dpFront: 0, dpSupport: 0, dpBack: 0, currentHp: 20, resPool: 3, customCards: [] } } }));
        }
    };

    const executeRiftWalk = () => {
        if (!isMyTurn) return alert("System Locked: Not your active turn.");
        if (riftValue < 1 || riftValue > 10) return alert("Invalid Rift Walk value.");
        if ((player.currentHp ?? derivedMaxHp) <= riftValue) return alert("Warning: Overclock sacrifice would be fatal. Rift Walk aborted.");
        safePush(s => {
            const pClone = JSON.parse(JSON.stringify(s.players || {}));
            if (pClone[localId]) { pClone[localId].currentHp = (pClone[localId].currentHp ?? derivedMaxHp) - riftValue; pClone[localId].resPool = Math.min(10, (pClone[localId].resPool ?? 3) + riftValue); }
            const logEntry = { id: Date.now().toString() + Math.random().toString(), text: `>> RIFT WALK: ${pClone[localId].name || 'Agent'} sacrificed ${riftValue} HP to generate ${riftValue} Resonance!` };
            return { ...s, players: pClone, encounter: { ...(s.encounter||{}), logFeed: [...safeArray(s.encounter?.logFeed), logEntry].slice(-50) } };
        });
    };

    const saveToHUD = () => {
        const cards = safeArray(player.customCards); const actionName = builder.name || 'Custom Action';
        if (cards.length >= 4) return alert("HUD is full (Max 4). Remove an active skill first to make room.");
        if (cards.some(c => String(c.name).toLowerCase() === actionName.toLowerCase())) return alert(`"${actionName}" is already equipped in your HUD. Please give this ability a unique name.`);
        updatePlayer('customCards', [...cards, { ...builder, name: actionName, payload: builder.payload || 'damage', elementRaw: builder.elementRaw || 'Kinetic', elementCore: builderCoreElement, effectCore: builderCoreState, alpha: affinityData.alpha, cost: calcCost, isEcho: builder.isEcho || false, id: `card-${Date.now()}` }]);
    };
    
    const saveToSpellbook = () => {
        const archived = safeArray(player.savedSkills); const actionName = builder.name || 'Custom Action';
        if (archived.some(s => String(s.name).toLowerCase() === actionName.toLowerCase())) return alert(`"${actionName}" is already in your Spellbook. Please give this ability a unique name.`);
        updatePlayer('savedSkills', [...archived, { ...builder, name: actionName, payload: builder.payload || 'damage', elementRaw: builder.elementRaw || 'Kinetic', elementCore: builderCoreElement, effectCore: builderCoreState, alpha: affinityData.alpha, cost: calcCost, isEcho: builder.isEcho || false, id: `spell-${Date.now()}` }]);
        alert("Ability archived to Spellbook!");
    };

    const editCardFromHUD = (card) => {
        setBuilder({ name: card.name || '', elementRaw: card.elementRaw || 'Kinetic', payload: card.payload || 'damage', d: safeInt(card.d), u: safeInt(card.u), a: card.a || 0, effectName: card.effectName || '', desc: card.desc || '', terrain: card.terrain || '', m: safeInt(card.m), mobilityName: card.mobilityName || '', isEcho: card.isEcho || false });
        updatePlayer('customCards', safeArray(player.customCards).filter(c => String(c.id) !== String(card.id))); window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleElementChange = (e) => { const newElem = e.target.value; const coreElem = getCoreElement(newElem); const validStates = ELEMENT_STATE_MAP[coreElem] || []; setBuilder(prev => { const newState = { ...prev, elementRaw: newElem }; if (prev.effectName && !validStates.includes(getCoreState(prev.effectName))) { newState.effectName = ''; newState.u = 0; } return newState; }); };

    const primeWeapon = () => { 
        if (!isMyTurn) return alert("System Locked: Not your active turn."); if (player.usedBasicAttack) return alert("System Locked: Basic attack already executed this turn."); if (disableAttacks) return alert("System Locked: Agent is STUNNED."); if (!isSynergy) return alert("System Locked: DP Requirements not met for equipped weapon.");
        let finalRange = isBlind ? '1' : (activeWeapon.range || '1'); if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes.");
        const rawWpn = activeWeapon.element || 'Kinetic'; const coreWpn = getCoreElement(rawWpn);
        safePush(s => ({ ...s, activeAction: { type: 'target', source: String(player.name || 'Player'), sourceId: String(localId), isEnemy: false, isBasic: true, isImprovised: false, originalCost: 0, cost: 0, name: String(activeWeapon.name || 'Weapon Attack'), payload: 'damage', d: safeInt(calcBaseDmg), a: 0, u: 0, m: 0, coreMobility: '', range: String(finalRange), effectName: '', effectCore: '', elementRaw: String(rawWpn), elementCore: String(coreWpn), terrain: '', desc: '', isEcho: false } })); 
    };
    
    const primeCard = (c, isImprovised = false, originalCost = 0) => { 
        if (!isMyTurn) return alert("System Locked: Not your active turn.");
        const requiredRes = isImprovised ? 1 : safeInt(c.cost); if (currentRes < requiredRes) return alert(`System Locked: Insufficient Resonance. Required: ${requiredRes}.`);
        if (disableAttacks) return alert("System Locked: Agent is STUNNED.");
        
        let finalRange = isBlind ? '1' : (activeWeapon.range || '1-3'); 
        let finalAoe = isBlind ? 0 : (c.isEcho ? 0 : (c.a !== undefined ? c.a : 0)); 
        if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes and AoE is zeroed.");
        
        const mobilityRaw = c.mobilityName || c.mobility || ''; const coreMobility = getCoreMobility(mobilityRaw); const isBlink = safeInt(c.m) > 0 && coreMobility === 'Blink';
        
        safePush(s => ({ ...s, activeAction: { 
            type: isBlink ? 'blink' : 'target', 
            source: String(player.name || 'Player'), 
            sourceId: String(localId), 
            casterTokenId: null,
            isEnemy: false, 
            isBasic: false, 
            isImprovised: isImprovised || false, 
            originalCost: safeInt(originalCost), 
            cost: safeInt(requiredRes), 
            name: String(c.name || (isImprovised ? 'Improvised Action' : 'Custom Action')), 
            payload: String(c.payload || 'damage'), 
            d: safeInt(c.d), 
            a: finalAoe, 
            u: safeInt(c.u), 
            m: safeInt(c.m), 
            coreMobility: String(coreMobility || ''), 
            range: String(finalRange), 
            effectName: String(c.effectName || ''), 
            effectCore: String(c.effectCore || getCoreState(c.effectName) || ''), 
            elementRaw: String(c.elementRaw || 'Kinetic'), 
            elementCore: String(c.elementCore || getCoreElement(c.elementRaw || 'Kinetic')), 
            terrain: String(c.terrain || ''), 
            desc: String(c.desc || ''), 
            cardId: c.id ? String(c.id) : null,
            isEcho: c.isEcho || false 
        } })); 
    };

    const primeImprovised = () => { primeCard(builder, true, calcCost); };
    const reqString = (w) => { if (!w.reqF && !w.reqS && !w.reqB) return 'No Req'; let r = []; if (w.reqF) r.push(`${w.reqF}F`); if (w.reqS) r.push(`${w.reqS}S`); if (w.reqB) r.push(`${w.reqB}B`); return `Req: ${r.join('/')}`; };

    const customCards = safeArray(player.customCards);
    const isOverload = currentRes >= 10;
    
    const usableWeapons = safeArmory.filter(w => front >= (w.reqF || 0) && supp >= (w.reqS || 0) && back >= (w.reqB || 0));
    const unusableWeapons = safeArmory.filter(w => !(front >= (w.reqF || 0) && supp >= (w.reqS || 0) && back >= (w.reqB || 0)));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-sm">
            
            {!isMyTurn ? (
                <div className="col-span-1 lg:col-span-3 bg-red-950 border border-red-500 text-red-400 p-3 flex justify-between items-center font-bold tracking-widest uppercase animate-pulse shadow-md">
                    <span>⚠ STANDBY: {initQueueActive ? 'NOT YOUR TURN IN INITIATIVE QUEUE' : 'HOSTILE TURN IN PROGRESS'}</span>
                    <span>HOSTILE RES: {encounter?.enemyPoolTotal || 0}</span>
                </div>
            ) : (
                <div className="col-span-1 lg:col-span-3 bg-[#0f172a] border border-[#d1d5db] text-[#d1d5db] p-3 flex justify-between items-center font-bold tracking-widest uppercase shadow-md">
                    <span>▶ AGENT PHASE ACTIVE</span>
                    <span className="text-gray-500">HOSTILE RES: <span className="text-[#a855f7]">{encounter?.enemyPoolTotal || 0}</span></span>
                </div>
            )}

            <div className="bg-[#1e293b] p-4 border border-slate-700">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
                    <h2 className="text-[#d1d5db] font-bold text-xl uppercase">Character Uplink</h2>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-[#0f172a] px-2 py-1 border border-gray-700">Movement: <span className="text-white">{myToken ? `${myToken.movementRemaining ?? myToken.speed ?? 3} / ${myToken.speed ?? 3}` : 'Off Grid'}</span></div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input className="flex-1 bg-[#0f172a] border border-gray-600 p-2 text-white outline-none font-bold" placeholder="Callsign / Name" value={player.name || ''} onChange={e => updatePlayer('name', e.target.value)} />
                        {player.affinityLocked ? (
                            <div className="w-1/3 bg-[#0f172a] border border-[#d1d5db] text-[#d1d5db] p-1 flex flex-col items-center justify-center font-bold tracking-wider shadow-[0_0_10px_rgba(209,213,219,0.2)]" title={ELEMENT_DESCRIPTIONS[player.affinity]}>
                                <span className="text-[10px] uppercase truncate w-full text-center leading-none mb-0.5">{player.affinity}</span><span className="text-[7px] text-gray-400 leading-none">AFFINITY</span>
                            </div>
                        ) : (
                            <div className="w-1/3 flex border border-[#a855f7]">
                                <select className="flex-1 bg-[#0f172a] text-[#a855f7] text-[10px] font-bold px-1.5 outline-none uppercase w-full cursor-pointer" value={player.affinityRaw || 'Kinetic'} onChange={e => updatePlayer('affinityRaw', e.target.value)} title={ELEMENT_DESCRIPTIONS[player.affinityRaw || 'Kinetic']}>
                                    {Object.keys(ELEMENT_DESCRIPTIONS).map(el => <option key={el} value={el}>{el}</option>)}
                                </select>
                                <button className="bg-[#a855f7] text-black px-2 font-bold text-[10px] hover:bg-white transition-colors" onClick={() => { const rawVal = player.affinityRaw || 'Kinetic'; const coreVal = getCoreElement(rawVal); if(window.confirm(`Lock in ${rawVal.toUpperCase()} as your permanent Innate Affinity?`)) { safePush(s => ({ ...s, players: { ...(s.players || {}), [localId]: { ...(s.players?.[localId] || {}), affinityRaw: rawVal, affinity: coreVal, affinityLocked: true } } })); } }}>LOCK</button>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#0f172a] border border-red-500 p-3 text-center w-full">
                        <div className="text-[10px] text-red-500 uppercase tracking-widest mb-1 font-bold">Hit Points</div>
                        <div className="text-3xl font-bold text-white">
                            {player.currentHp ?? derivedMaxHp} <span className="text-gray-600 text-2xl">/</span> <span className="text-gray-400 text-2xl">{derivedMaxHp}</span>
                        </div>
                    </div>

                    <div className="bg-[#0f172a]/50 border border-[#a855f7] p-3 text-center w-full mt-2">
                        <div className="text-[10px] text-[#a855f7] uppercase tracking-widest mb-2 font-bold">Rift Walk (Overclock)</div>
                        <div className="flex gap-2 items-center justify-center">
                            <div className="flex items-center justify-center gap-1 bg-[#1e293b] border border-[#a855f7]">
                                <button className="text-white px-3 py-1 font-bold hover:bg-[#a855f7] hover:text-black transition-colors" onClick={() => setRiftValue(v => Math.max(1, v - 1))}>-</button>
                                <span className="text-white font-bold w-6 text-center text-sm">{riftValue}</span>
                                <button className="text-white px-3 py-1 font-bold hover:bg-[#a855f7] hover:text-black transition-colors" onClick={() => setRiftValue(v => Math.min(maxRift, v + 1))}>+</button>
                            </div>
                            <button className="flex-1 bg-[#a855f7] text-black font-bold uppercase text-[10px] py-2 hover:bg-white transition-colors" onClick={executeRiftWalk}>
                                Sacrifice HP for Resonance
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center text-[#d1d5db] font-bold text-lg bg-[#0f172a] p-2 border border-gray-700 mt-2"><span>CLASS:</span><span>{activeClass}</span></div>

                    <div className="bg-[#0f172a] border border-[#d1d5db] p-3 text-center">
                        <div className="flex justify-between items-center mb-2">
                            <div className="text-left"><span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">TOTAL XP</span><div className="text-[#d1d5db] font-bold text-lg">{xp}</div></div>
                            <div className="text-right"><span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">AVAILABLE DP</span><div className={`font-bold text-lg ${availDp > 0 ? 'text-[#22c55e]' : 'text-gray-500'}`}>{Math.max(0, availDp)} / {earnedDp}</div></div>
                        </div>
                        <div className="text-[9px] text-gray-500 uppercase tracking-widest text-left">Base DP: 5 | +1 DP per 10 XP</div>
                    </div>

                    {isDeploymentPhase && (
                        <button className="w-full bg-red-950 border border-red-600 text-white font-bold py-2 text-[10px] mt-2 hover:bg-red-600 transition-colors uppercase" onClick={respecAgent}>
                            ⚠ Respec Agent
                        </button>
                    )}

                    <div className="flex gap-2 text-center text-xs mt-2">
                        <div className="flex-1 bg-[#0f172a] border border-gray-600 p-1.5 flex flex-col"><label className="text-gray-400 block mb-1 font-bold">Front DP</label><div className="flex items-center justify-between bg-[#1e293b] border border-gray-700 mt-auto"><button className="px-2 py-1 hover:text-white" onClick={() => updatePlayer('dpFront', Math.max(0, front - 1))}>-</button><span className="font-bold text-white text-lg">{front}</span><button className="px-2 py-1 hover:text-[#22c55e] disabled:text-gray-600" disabled={availDp <= 0} onClick={() => { if(availDp>0) updatePlayer('dpFront', front + 1) }}>+</button></div></div>
                        <div className="flex-1 bg-[#0f172a] border border-gray-600 p-1.5 flex flex-col"><label className="text-gray-400 block mb-1 font-bold">Supp DP</label><div className="flex items-center justify-between bg-[#1e293b] border border-gray-700 mt-auto"><button className="px-2 py-1 hover:text-white" onClick={() => updatePlayer('dpSupport', Math.max(0, supp - 1))}>-</button><span className="font-bold text-white text-lg">{supp}</span><button className="px-2 py-1 hover:text-[#22c55e] disabled:text-gray-600" disabled={availDp <= 0} onClick={() => { if(availDp>0) updatePlayer('dpSupport', supp + 1) }}>+</button></div></div>
                        <div className="flex-1 bg-[#0f172a] border border-gray-600 p-1.5 flex flex-col"><label className="text-gray-400 block mb-1 font-bold">Back DP</label><div className="flex items-center justify-between bg-[#1e293b] border border-gray-700 mt-auto"><button className="px-2 py-1 hover:text-white" onClick={() => updatePlayer('dpBack', Math.max(0, back - 1))}>-</button><span className="font-bold text-white text-lg">{back}</span><button className="px-2 py-1 hover:text-[#22c55e] disabled:text-gray-600" disabled={availDp <= 0} onClick={() => { if(availDp>0) updatePlayer('dpBack', back + 1) }}>+</button></div></div>
                    </div>

                    <div className="mt-4 border-t border-gray-700 pt-4">
                        <h3 className="text-gray-400 mb-2 font-bold uppercase tracking-widest text-xs">Loadout</h3>
                        <select className="w-full bg-[#0f172a] border border-gray-600 p-2 text-white outline-none mb-2 text-xs" value={player.weaponId || 'w01'} onChange={e => updatePlayer('weaponId', e.target.value)}>
                            {usableWeapons.length > 0 && (
                                <optgroup label="✓ SYNERGY ACTIVE (Reqs Met)" className="bg-[#1e293b] text-[#22c55e] font-bold">
                                    {usableWeapons.map(w => ( <option key={w.id} value={w.id} className="text-white font-normal">{w.name} [{reqString(w)}]</option> ))}
                                </optgroup>
                            )}
                            {unusableWeapons.length > 0 && (
                                <optgroup label="⚠ INSUFFICIENT DP" className="bg-[#1e293b] text-red-500 font-bold">
                                    {unusableWeapons.map(w => ( <option key={w.id} value={w.id} className="text-gray-400 font-normal">{w.name} [{reqString(w)}]</option> ))}
                                </optgroup>
                            )}
                        </select>
                        <div className={`p-2 text-xs border relative ${isSynergy ? 'bg-[#a855f7]/10 border-[#a855f7] text-[#e9d5ff]' : 'bg-red-950/30 border-red-500 text-red-200'}`}>
                            <div className="font-bold mb-1 uppercase tracking-wider">{isSynergy ? '✓ DP Req Met (Synergy Active)' : '⚠ DP Req Not Met'}</div>
                            <div className="flex justify-between items-center">
                                <div><div className="font-bold text-white mb-1">Base Dmg: {calcBaseDmg}</div><div>Range: {activeWeapon.range} Hexes</div>{isSynergy && <div className="text-[#a855f7] font-bold mt-1">Bonus: {activeWeapon.bonusDesc}</div>}</div>
                                <button className={`font-bold px-3 py-1 uppercase transition-colors ${(isMyTurn && !player.usedBasicAttack && !disableAttacks && isSynergy) ? 'bg-[#d1d5db] text-black hover:bg-white' : 'bg-[#0f172a] text-gray-500 cursor-not-allowed'}`} disabled={!isMyTurn || player.usedBasicAttack || disableAttacks || !isSynergy} onClick={primeWeapon}>
                                    {!isSynergy ? 'DP REQ FAILED' : (disableAttacks ? 'LOCKED' : (player.usedBasicAttack ? 'EXHAUSTED' : 'BASIC ATTACK'))}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-700 pt-4 space-y-3">
                        <div className="flex justify-between items-center mb-2"><h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs">Defensive Actions</h3><button className="text-[10px] bg-[#0f172a] border border-gray-600 px-2 py-0.5 text-white hover:bg-[#d1d5db] hover:text-black transition-colors" onClick={refreshTurn}>↻ Refresh Turn</button></div>
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2"><div><span className={(player.usedParry || disableDefenses) ? "text-red-500 line-through mr-2" : "text-[#d1d5db] mr-2"}>Front Parry:</span><span className={(player.usedParry || disableDefenses) ? "text-gray-600" : (bonusFront>0 ? "font-bold text-[#a855f7]" : "font-bold text-white")}>{calcFrontParry}</span></div><button className={`text-[10px] px-2 py-1 font-bold border ${(player.usedParry || disableDefenses) ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedParry || disableDefenses} onClick={() => updatePlayer('usedParry', true)}>{disableDefenses ? 'JAMMED' : (player.usedParry ? 'EXHAUSTED' : 'AVAILABLE')}</button></div>
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2"><div><span className={(player.usedIntercept || disableDefenses) ? "text-red-500 line-through mr-2" : "text-[#d1d5db] mr-2"}>Support Intercept:</span><span className={(player.usedIntercept || disableDefenses) ? "text-gray-600" : (bonusSupp>0 ? "font-bold text-[#a855f7]" : "font-bold text-white")}>{calcSuppIntercept}</span></div><button className={`text-[10px] px-2 py-1 font-bold border ${(player.usedIntercept || disableDefenses) ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedIntercept || disableDefenses} onClick={() => updatePlayer('usedIntercept', true)}>{disableDefenses ? 'JAMMED' : (player.usedIntercept ? 'EXHAUSTED' : 'AVAILABLE')}</button></div>
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2"><div><span className={(player.usedEvade || disableDefenses) ? "text-red-500 line-through mr-2" : "text-[#d1d5db] mr-2"}>Backline Evasion:</span><span className={(player.usedEvade || disableDefenses) ? "text-gray-600" : (bonusBack>0 ? "font-bold text-[#a855f7]" : "font-bold text-white")}>{calcBackEvasion}</span></div><button className={`text-[10px] px-2 py-1 font-bold border ${(player.usedEvade || disableDefenses) ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedEvade || disableDefenses} onClick={() => updatePlayer('usedEvade', true)}>{disableDefenses ? 'JAMMED' : (player.usedEvade ? 'EXHAUSTED' : 'AVAILABLE')}</button></div>
                    </div>
                </div>
            </div>

            <div className={`bg-[#1e293b] p-4 border flex flex-col items-center justify-center relative overflow-hidden transition-colors ${isOverload ? 'border-red-500 shadow-[0_0_30px_rgba(255,0,0,0.2)]' : 'border-slate-700'}`}>
                {isOverload && <div className="absolute inset-0 bg-red-900/20 animate-pulse pointer-events-none"></div>}
                <h2 className={`font-bold text-2xl tracking-widest mb-4 z-10 ${isOverload ? 'text-red-500' : 'text-[#d1d5db]'}`}>{isOverload ? 'MAX CAPACITY' : 'RESONANCE'}</h2>
                <div className={`text-8xl mb-6 z-10 transition-colors ${isOverload ? 'text-red-400 drop-shadow-[0_0_25px_rgba(255,0,0,0.8)] animate-pulse' : 'text-white drop-shadow-[0_0_15px_rgba(209,213,219,0.5)]'}`}>{currentRes}<span className="text-3xl text-gray-500">/10</span></div>
                
                <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-widest text-center z-10">System Status:</div>
                <div className="bg-[#0f172a] border border-gray-700 p-2 text-xs text-center text-[#22c55e] font-bold w-full shadow-inner shadow-[#22c55e]/10">
                    AUTOMATED SYNERGY TRACKING ACTIVE
                </div>
            </div>

            <div className="bg-[#1e293b] p-4 border border-slate-700 flex flex-col h-full">
                <h2 className="text-[#d1d5db] font-bold text-xl mb-4 border-b border-gray-700 pb-2 uppercase">Synthesis Matrix</h2>
                <div className="space-y-3 mb-4 flex-1 overflow-y-auto pr-1">
                    
                    <div className="flex flex-col gap-1">
                        <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">Skill Name:</span>
                        <input type="text" className="w-full bg-[#0f172a] border border-[#d1d5db] p-2 text-white outline-none font-bold text-xs" placeholder="Custom Action" value={builder.name} onChange={e=>setBuilder({...builder, name: e.target.value})} />
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">Payload Type:</span>
                        <select className="w-full bg-[#0f172a] border border-[#a855f7] p-2 text-[#e9d5ff] text-[10px] font-bold outline-none cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]" value={builder.payload || 'damage'} onChange={e=>setBuilder({...builder, payload: e.target.value})}>
                            <option value="damage">[OFFENSIVE] - Inflict Damage</option>
                            <option value="heal">[RESTORATIVE] - Heal Hit Points</option>
                            <option value="battery">[ENERGIZE] - Transfer Resonance</option>
                        </select>
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">Element Affinity:</span>
                        <select className="w-full bg-[#0f172a] border border-gray-600 p-2 text-white text-[10px] outline-none focus:border-[#d1d5db] cursor-pointer" value={builder.elementRaw || 'Kinetic'} onChange={handleElementChange}>
                            {Object.keys(ELEMENT_DESCRIPTIONS).map(el => <option key={el} value={el}>{el.toUpperCase()} - {ELEMENT_DESCRIPTIONS[el]}</option>)}
                        </select>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">Payload Value (v):</span>
                        <div className="flex items-center justify-center gap-1 bg-[#0f172a] border border-gray-600 p-1">
                            <button className="text-white px-2 hover:bg-gray-800 transition-colors" onClick={() => setBuilder({...builder, d: Math.max(0, builder.d - 1)})}>-</button>
                            <span className="text-white font-bold w-6 text-center text-xs">{builder.d}</span>
                            <button className="text-white px-2 hover:bg-gray-800 transition-colors" onClick={() => setBuilder({...builder, d: builder.d + 1})}>+</button>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-gray-300 text-[10px] uppercase font-bold tracking-wider">Target Area (a):</span>
                        <select className="w-40 bg-[#0f172a] border border-gray-600 p-1 text-white text-[10px] cursor-pointer" value={String(builder.a)} onChange={e=>setBuilder({...builder, a: e.target.value})}>
                            <option value="0">Single Target (u=0)</option>
                            <option value="1">Small Radius: 1-Hex (u=1)</option>
                            <option value="line3">Line: 3-Hex Beam (u=1)</option>
                            <option value="cluster3">Cluster: 3-Hex Triangle (u=1)</option>
                            <option value="2">Large Radius: 2-Hex (u=4)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-purple-400 text-[10px] uppercase font-bold tracking-wider">State Utility (u):</span>
                            <div className={`flex items-center justify-center gap-1 bg-[#0f172a] border border-purple-500 p-1 ${builder.effectName ? 'opacity-50' : ''}`}>
                                <button className="text-white px-2 hover:bg-purple-900 transition-colors" disabled={!!builder.effectName} onClick={() => setBuilder({...builder, u: Math.max(0, builder.u - 1)})}>-</button>
                                <span className="text-white font-bold w-6 text-center text-xs">{builder.u}</span>
                                <button className="text-white px-2 hover:bg-purple-900 transition-colors" disabled={!!builder.effectName} onClick={() => setBuilder({...builder, u: builder.u + 1})}>+</button>
                            </div>
                        </div>
                        <select 
                            className="w-full bg-[#0f172a] border border-purple-500 p-2 text-white outline-none text-[10px] cursor-pointer mt-1" 
                            value={builder.effectName || ''} 
                            onChange={e => {
                                const st = e.target.value;
                                setBuilder({...builder, effectName: st, u: st ? STATE_TIERS[st] : builder.u});
                            }}
                        >
                            <option value="">-- NO STATUS EFFECT --</option>
                            {(ELEMENT_STATE_MAP[builderCoreElement] || []).map(st => (
                                <option key={st} value={st}>[{st.toUpperCase()}] (+{STATE_TIERS[st]}u) - {STATE_DESCRIPTIONS[st]}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="flex flex-col gap-1 mt-2">
                        <span className="text-yellow-500 text-[10px] uppercase font-bold tracking-wider">Terrain Gen (t):</span>
                        <select className="w-full bg-[#0f172a] border border-yellow-600 p-2 text-white text-[10px] cursor-pointer" value={builder.terrain || ''} onChange={e=>setBuilder({...builder, terrain: e.target.value})}>
                            <option value="">-- NO TERRAIN MODIFICATION --</option>
                            <option value="minor">[MINOR] - Movement costs 2 pts (Cost: +1u)</option>
                            <option value="clear">[CLEAR] - Removes existing terrain (Cost: +2u)</option>
                            <option value="major">[MAJOR] - Deals 5 dmg at round end (Cost: +3u)</option>
                            <option value="severe">[SEVERE] - Impassable & blocks LoS (Cost: +5u)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1 mt-2">
                        <div className="flex justify-between items-center">
                            <span className="text-blue-400 text-[10px] uppercase font-bold tracking-wider">Mobility Dist (m):</span>
                            <div className="flex items-center justify-center gap-1 bg-[#0f172a] border border-blue-500 p-1">
                                <button className="text-white px-2 hover:bg-blue-900 transition-colors" onClick={() => setBuilder({...builder, m: Math.max(0, builder.m - 1)})}>-</button>
                                <span className="text-white font-bold w-6 text-center text-xs">{builder.m}</span>
                                <button className="text-white px-2 hover:bg-blue-900 transition-colors" onClick={() => setBuilder({...builder, m: builder.m + 1})}>+</button>
                            </div>
                        </div>
                        {builder.m > 0 && (
                            <select className="w-full bg-[#0f172a] border border-blue-500 p-2 text-white outline-none text-[10px] cursor-pointer animate-fade-in mt-1" value={builder.mobilityName || ''} onChange={e=>setBuilder({...builder, mobilityName: e.target.value})}>
                                <option value="">-- SELECT MOBILITY --</option>
                                <option value="Blink">[BLINK] - Teleport Self (Ignores pathing)</option>
                                <option value="Push">[PUSH] - Force target away</option>
                                <option value="Pull">[PULL] - Force target closer</option>
                            </select>
                        )}
                    </div>

                    <div className="flex items-center gap-2 mt-3 bg-[#0f172a] border border-gray-700 p-2">
                        <input type="checkbox" id="echoToggle" className="cursor-pointer" checked={builder.isEcho || false} onChange={e => setBuilder({...builder, isEcho: e.target.checked})} />
                        <label htmlFor="echoToggle" className="text-gray-300 text-[10px] uppercase font-bold tracking-wider cursor-pointer select-none">
                            Manifest as Echo (Deploys static construct to cast)
                        </label>
                    </div>

                    <div className="bg-[#0f172a] border border-gray-700 p-2 mt-4">
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Affinity Calculation (α)</span>
                        <div className={`text-xs font-bold ${affinityData.alpha === 0.75 ? 'text-[#22c55e]' : affinityData.alpha === 2.0 ? 'text-red-500' : 'text-[#d1d5db]'}`}>{affinityData.alpha}x | {affinityData.label}</div>
                    </div>

                    <div className="mt-2">
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1 block">Flavor Text:</span>
                        <textarea className="w-full bg-[#0f172a] border border-gray-600 text-gray-300 p-2 text-[10px] outline-none resize-none" rows="2" placeholder="E.g., A searing lance..." value={builder.desc || ''} onChange={e=>setBuilder({...builder, desc: e.target.value})}></textarea>
                    </div>
                </div>

                <div className="bg-[#0f172a] p-3 border border-[#a855f7] flex justify-between items-center text-[#a855f7] font-bold text-xl mb-4 mt-auto"><span>COST:</span><span>{calcCost} RES</span></div>
                <div className="flex gap-2 mb-2"><button className="flex-1 bg-[#d1d5db] text-black font-bold border border-[#d1d5db] p-2 hover:bg-white text-xs uppercase transition-colors" onClick={saveToHUD}>Equip</button><button className="flex-1 bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700 text-white text-xs uppercase transition-colors" onClick={saveToSpellbook}>Archive</button></div>
                <button 
                    className={`w-full font-bold p-3 uppercase transition-colors mb-4 ${lockImprovise ? 'bg-[#0f172a] text-gray-600 cursor-not-allowed border border-gray-700' : 'bg-[#a855f7] text-black hover:bg-white'}`} 
                    disabled={lockImprovise} 
                    onClick={primeImprovised}
                >
                    {isDeploymentPhase ? 'DEPLOYMENT PHASE: COMBAT OFFLINE' : (!isMyTurn ? 'STANDBY: NOT YOUR TURN' : (disableAttacks ? 'SYSTEM LOCKED' : 'Improvise Directly to Grid (1 Res)'))}
                </button>
                
                <div className="grid grid-cols-2 gap-2 border-t border-gray-700 pt-4">
                    {customCards.map(c => {
                        const dispRaw = c.elementRaw || c.element || 'Kinetic'; const dispCore = c.elementCore || getCoreElement(c.elementRaw || 'Kinetic'); const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;
                        const cardCost = parseInt(c.cost) || 0; const isNoFuel = currentRes < cardCost; const coreMob = getCoreMobility(c.mobilityName || c.mobility || ''); const isBlink = safeInt(c.m) > 0 && coreMob === 'Blink';
                        return (
                            <div key={c.id || Math.random()} className="bg-[#0f172a] border border-[#d1d5db] p-2 text-xs relative group flex flex-col">
                                <div className="flex-1 pr-12 pb-2">
                                    <div className="font-bold text-[#d1d5db] truncate">{c.name || 'Custom Action'}</div>
                                    <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-800 pb-1 truncate" title={showType}>Type: {showType}</div>
                                    <div className="text-white font-bold mb-1 mt-1 text-[10px]">Cost: -{cardCost} Res</div>
                                    {c.payload === 'heal' && <div className="text-[#22c55e] text-[10px] font-bold mt-1">Restorative</div>}
                                    {c.payload === 'battery' && <div className="text-[#d1d5db] text-[10px] font-bold mt-1">Energize</div>}
                                    {c.isEcho && <div className="text-[#a855f7] text-[10px] font-bold mt-1">Tactical Echo</div>}
                                    {c.effectName && <div title={STATE_DESCRIPTIONS[getCoreState(c.effectName)] || 'Active Status Check'} className="absolute top-2 right-12 text-purple-400 text-[10px] font-bold cursor-help">[{c.effectName}]</div>}
                                    {c.terrain && <div className="text-yellow-500 text-[10px] font-bold mt-1">Terrain: [{String(c.terrain).toUpperCase()}]</div>}
                                    {safeInt(c.m) > 0 && <div className="text-blue-400 text-[10px] font-bold mt-1">Mobility: {safeInt(c.m)} [{coreMob.toUpperCase()}]</div>}
                                    
                                    <button className={`mt-auto w-full font-bold py-1 uppercase transition-colors ${(isNoFuel || disableAttacks || !isMyTurn) ? 'bg-[#1e293b] text-gray-500 cursor-not-allowed border border-gray-700' : 'bg-[#d1d5db] text-black hover:bg-white'}`} disabled={isNoFuel || disableAttacks || !isMyTurn} onClick={() => primeCard(c)}>
                                        {disableAttacks ? 'LOCKED' : (isNoFuel ? 'NO FUEL' : (isBlink ? 'BLINK / DASH' : 'TARGET SKILL'))}
                                    </button>
                                </div>
                                <button className="absolute top-0 right-6 w-6 h-6 flex items-center justify-center bg-[#1e293b] border-l border-b border-gray-700 text-[#d1d5db] hover:text-black hover:bg-[#d1d5db] transition-colors" onClick={(e) => { e.stopPropagation(); editCardFromHUD(c); }} title="Edit Skill in Matrix">✎</button>
                                <button className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-[#1e293b] border-l border-b border-gray-700 text-gray-400 hover:text-white hover:bg-red-800 transition-colors" onClick={(e) => { e.stopPropagation(); updatePlayer('customCards', customCards.filter(card => String(card.id) !== String(c.id))); }} title="Delete Card">✕</button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}