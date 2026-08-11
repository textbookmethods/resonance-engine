/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { armory } from '../data/armory';

const safeArmory = (Array.isArray(armory) && armory.length > 0) ? armory : [{ id: 'w01', name: 'Fallback', range: '1', baseDmg: 3 }];
const CLASS_COLORS = { Vanguard: '#ef4444', Paladin: '#eab308', Sniper: '#22c55e', Conduit: '#a855f7', Skirmisher: '#f97316', Saboteur: '#ec4899', Rookie: '#00f0ff' };
const ELEMENT_COLORS = { 'Thermal': '#ef4444', 'Cryo': '#3b82f6', 'Electro': '#eab308', 'Toxic': '#22c55e', 'Radiant': '#fcd34d', 'Void': '#a855f7', 'Kinetic': '#94a3b8', 'Steam': '#cbd5e1' };

const ELEMENT_DICTIONARY = { 'thermal': ['fire', 'heat', 'magma', 'lava', 'ash', 'plasma', 'steam', 'solar', 'sun', 'flame', 'pyro', 'scorch', 'burn', 'inferno', 'ignition'], 'cryo': ['ice', 'cold', 'frost', 'snow', 'water', 'liquid', 'ocean', 'glacier', 'hydro', 'aqua', 'chill', 'blizzard', 'freeze', 'arctic'], 'electro': ['lightning', 'electric', 'spark', 'thunder', 'magnetic', 'storm', 'volt', 'shock', 'galvanic', 'energy', 'emp'], 'toxic': ['poison', 'acid', 'venom', 'decay', 'rot', 'radiation', 'bio', 'gas', 'smog', 'plague', 'blight', 'corrosive', 'noxious', 'viral', 'chemical'], 'radiant': ['light', 'holy', 'divine', 'healing', 'spirit', 'luminous', 'glow', 'life', 'order', 'sacred', 'blessed', 'purify', 'stellar'], 'void': ['dark', 'shadow', 'space', 'gravity', 'time', 'cosmic', 'null', 'psychic', 'mind', 'mental', 'chaos', 'entropy', 'abyss', 'astral', 'telekinetic', 'warp'], 'kinetic': ['physical', 'force', 'bludgeoning', 'piercing', 'slashing', 'earth', 'stone', 'rock', 'wind', 'air', 'pressure', 'metal', 'steel', 'sand', 'dust', 'aero', 'geo', 'sound', 'sonic', 'acoustic', 'seismic', 'blood'] };
const STATE_DICTIONARY = { 'Hijacked': ['hijack', 'mind control', 'dominate', 'possess', 'control'], 'Execute': ['execute', 'erase', 'delete'], 'Bleed': ['bleed', 'hemorrhage', 'lacerate'], 'Burn': ['burn', 'ignite', 'scorch'], 'Poisoned': ['poison', 'venom', 'decay'], 'Immobilized': ['immobilize', 'root', 'snare'], 'Stunned': ['stun', 'paralyze', 'petrify'], 'Shielded': ['shield', 'protect', 'barrier'], 'Vulnerable': ['vulnerable', 'expose', 'sunder'], 'Knockdown': ['knockdown', 'trip', 'shove'], 'Blind': ['blind', 'obscure', 'smoke'], 'Haste': ['haste', 'speed', 'quick'], 'Slowed': ['slow', 'sluggish', 'chill'], 'Shocked': ['shock', 'glitch', 'jolt'], 'Evasive': ['evade', 'dodge', 'blur'], 'Invulnerable': ['invulnerable', 'stasis', 'immune'] };
const MOBILITY_DICTIONARY = { 'Blink': ['blink', 'teleport', 'jump'], 'Push': ['push', 'repel', 'throw'], 'Pull': ['pull', 'attract', 'draw'] };
const STATE_DESCRIPTIONS = { 'Hijacked': 'Unit is controlled by opposing network.', 'Execute': 'Instantly reduces HP to 0. Bypasses Invulnerable/Shields.', 'Bleed': 'Takes 1 True Damage at start of turn.', 'Burn': 'Takes 2 Thermal Damage at start of turn. Water/Cryo cancels.', 'Poisoned': 'Healing received halved. Takes 1 Toxic Damage at start of turn.', 'Immobilized': 'Movement reduced to 0. Cannot be pushed/pulled.', 'Stunned': 'Movement reduced to 0. Cannot act. Evasion drops to 0.', 'Shielded': 'Energy barrier mitigating incoming payloads.', 'Vulnerable': 'Takes 1.5x damage from all sources.', 'Knockdown': 'Movement points halved next turn. Melee attacks against unit gain Flanking.', 'Blind': 'Targeting range reduced to 1. AoE radius becomes 0.', 'Haste': '+2 Movement Points.', 'Slowed': '-2 Movement Points.', 'Shocked': 'Cannot use abilities costing >2 Res.', 'Evasive': 'Automatically mitigates next non-Flanking/non-AoE attack.', 'Invulnerable': 'Negates all incoming damage.' };

const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
const safeArray = (arr) => { if (!arr) return []; if (Array.isArray(arr)) return arr.filter(i => i !== null && i !== undefined); if (typeof arr === 'object') return Object.values(arr).filter(i => i !== null && i !== undefined); return []; };

const getSafeGrid = (g) => {
    const blankGrid = Array.from({ length: 150 }, () => ({ type: 'empty', terrain: null, terrainElement: null }));
    if (!g) return blankGrid;
    if (Array.isArray(g)) { g.forEach((cell, i) => { if (cell && i < 150) blankGrid[i] = { ...blankGrid[i], ...cell }; }); return blankGrid; }
    if (typeof g === 'object') { Object.keys(g).forEach(key => { const i = parseInt(key); if (!isNaN(i) && i >= 0 && i < 150 && g[key]) blankGrid[i] = { ...blankGrid[i], ...g[key] }; }); return blankGrid; }
    return blankGrid;
};

const normalizeAbility = (ability) => {
    if (!ability) return { name: 'Ability', cost: 1, value: 0, element: 'Kinetic', range: '1', aoe: 0, effect: '', terrain: null };
    if (typeof ability === 'object') return { name: String(ability.name || 'Ability'), cost: safeInt(ability.cost ?? 1), value: safeInt(ability.value ?? ability.dmg ?? ability.damage ?? 0), element: String(ability.element || 'Kinetic'), range: String(ability.range || '1'), aoe: ability.aoe !== undefined ? ability.aoe : 0, effect: String(ability.effect || ''), terrain: ability.terrain ? String(ability.terrain) : null };
    const str = String(ability); const parts = str.split(':'); const rawName = parts[0] || 'Ability'; const cleanName = rawName.replace(/\[\d+\s*Res\]/i, '').replace(/\(\d+\s*Res\)/i, '').trim();
    const desc = parts.length > 1 ? parts.slice(1).join(':') : str; const dmgMatch = desc.match(/deals\s+(\d+)\s+(?:([a-zA-Z]+)\s+)?damage/i); const parsedDmg = dmgMatch ? parseInt(dmgMatch[1]) : 0; const parsedElement = (dmgMatch && dmgMatch[2]) ? dmgMatch[2] : 'Kinetic';
    const aoeMatch = desc.match(/(\d+)-hex\s+radius/i) || desc.match(/radius\s+of\s+(\d+)/i); const shapeMatch = desc.match(/(line|cluster)/i); let parsedAoe = aoeMatch ? parseInt(aoeMatch[1]) : 0;
    if (shapeMatch) { if (shapeMatch[1].toLowerCase() === 'line') parsedAoe = 'line3'; if (shapeMatch[1].toLowerCase() === 'cluster') parsedAoe = 'cluster3'; }
    const costMatch = str.match(/\((\d+)\s*Res\)/i) || str.match(/\[(\d+)\s*Res\]/i); const eCost = costMatch ? parseInt(costMatch[1]) : 1;
    const effMatch = desc.match(/applies\s+\[(.*?)\]/i); const pEff = effMatch ? effMatch[1] : null; const terrMatch = desc.match(/terrain:\s*(minor|major|severe|clear)/i); const pTerrain = terrMatch ? terrMatch[1].toLowerCase() : null;
    let eRange = "1"; const rangeMatch = desc.match(/range\s+(\d+)(?:-(\d+))?/i);
    if (rangeMatch) eRange = rangeMatch[2] ? `${rangeMatch[1]}-${rangeMatch[2]}` : rangeMatch[1]; else if (parsedAoe === 'line3' || parsedAoe === 'cluster3' || parsedAoe > 0) eRange = "0-10";
    return { name: cleanName, cost: eCost, value: parsedDmg, element: parsedElement, range: eRange, aoe: parsedAoe, effect: pEff, terrain: pTerrain };
};

const getCoreState = (input) => { if (!input) return ''; const match = String(input).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(input)).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };
const getCoreElement = (input) => { if (!input) return 'Kinetic'; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(ELEMENT_DICTIONARY)) { if (core === clean || synonyms.includes(clean)) return core.charAt(0).toUpperCase() + core.slice(1); } return 'Kinetic'; };
const getCoreMobility = (input) => { if (!input) return ''; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(MOBILITY_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };

const getAffinityMultiplier = (atkElem, defElem) => {
    if (!defElem || !atkElem) return 1.0; const a = String(atkElem).toLowerCase(); const d = String(defElem).toLowerCase();
    if (a === 'thermal' && d === 'cryo') return 1.5; if (a === 'cryo' && d === 'toxic') return 1.5; if (a === 'toxic' && d === 'thermal') return 1.5;
    if (a === 'radiant' && d === 'void') return 1.5; if (a === 'void' && d === 'radiant') return 1.5; if (a === 'electro' && d === 'kinetic') return 1.5; if (a === 'kinetic' && d === 'electro') return 1.5;
    if (a === 'cryo' && d === 'thermal') return 0.5; if (a === 'toxic' && d === 'cryo') return 0.5; if (a === 'thermal' && d === 'toxic') return 0.5; return 1.0;
};

const COLS = 15; const ROWS = 10;
const getCubeCoords = (idx) => { const col = idx % COLS; const row = Math.floor(idx / COLS); return { q: col, r: row - Math.floor(col / 2), s: -col - (row - Math.floor(col / 2)) }; };
const getIndexFromCube = (q, r) => { const col = q; const row = r + Math.floor(col / 2); if (col >= 0 && col < COLS && row >= 0 && row < ROWS) return row * COLS + col; return null; };
const getHexDistance = (idxA, idxB) => { const a = getCubeCoords(idxA); const b = getCubeCoords(idxB); return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s)); };
const lerp = (a, b, t) => a + (b - a) * t; const cubeLerp = (a, b, t) => ({ q: lerp(a.q, b.q, t), r: lerp(a.r, b.r, t), s: lerp(a.s, b.s, t) });
const cubeRound = (cube) => { let rx = Math.round(cube.q); let ry = Math.round(cube.r); let rz = Math.round(cube.s); const dq = Math.abs(rx - cube.q); const dr = Math.abs(ry - cube.r); const ds = Math.abs(rz - cube.s); if (dq > dr && dq > ds) rx = -ry - rz; else if (dr > ds) ry = -rx - rz; else rz = -rx - ry; return { q: rx, r: ry, s: rz }; };

const checkLineOfSight = (startIdx, endIdx, grid) => {
    if (startIdx === endIdx) return true; let a = getCubeCoords(startIdx); let b = getCubeCoords(endIdx); a = { q: a.q + 1e-6, r: a.r + 1e-6, s: a.s - 2e-6 }; b = { q: b.q + 1e-6, r: b.r + 1e-6, s: b.s - 2e-6 }; const dist = Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
    for (let i = 1; i < dist; i++) { const c = cubeRound(cubeLerp(a, b, (1.0 / dist) * i)); const idx = getIndexFromCube(c.q, c.r); if (idx !== null && grid[idx] && (grid[idx].terrain === 'severe' || grid[idx].terrain === 'steam')) return false; } return true;
};
const getAdjacentHexes = (idx) => { const c = getCubeCoords(idx); const dirs = [{q:1,r:0}, {q:0,r:1}, {q:-1,r:1}, {q:-1,r:0}, {q:0,r:-1}, {q:1,r:-1}]; const hexes = []; dirs.forEach(d => { const nIdx = getIndexFromCube(c.q + d.q, c.r + d.r); if (nIdx !== null) hexes.push(nIdx); }); return hexes; };

const calculateReachableHexes = (startIdx, maxCost, grid, tokens, isEnemy, enemiesList) => {
    const costs = new Map(); costs.set(startIdx, 0); const queue = [startIdx]; const tokenMap = new Map();
    safeArray(tokens).forEach(t => { if (t && t.type === 'enemy') { const e = safeArray(enemiesList).find(en => en && String(en.uid) === String(t.refId)); if (e && !e.isActive) return; } if (t && t.pos !== undefined && t.pos !== null) tokenMap.set(t.pos, t.type); });
    while(queue.length > 0) {
        const curr = queue.shift(); const currCost = costs.get(curr);
        getAdjacentHexes(curr).forEach(n => {
            if (!grid[n] || grid[n].terrain === 'severe') return; const occ = tokenMap.get(n); if (occ && ((isEnemy && occ === 'player') || (!isEnemy && occ === 'enemy'))) return; 
            const stepCost = grid[n].terrain === 'minor' ? 2 : 1; const nextCost = currCost + stepCost; if (nextCost <= maxCost && (!costs.has(n) || nextCost < costs.get(n))) { costs.set(n, nextCost); queue.push(n); }
        });
    }
    const reachable = new Map(); for (let [idx, cost] of costs.entries()) { if (idx === startIdx || !tokenMap.has(idx)) reachable.set(idx, cost); } return reachable;
};

class GridBoardErrorBoundary extends React.Component {
    constructor(props) { super(props); this.state = { hasError: false, error: null }; }
    static getDerivedStateFromError(error) { return { hasError: true, error }; }
    componentDidCatch(error, errorInfo) { console.error("Grid Error:", error, errorInfo); }
    render() {
        if (this.state.hasError) return ( <div className="bg-[#0b0f14] border border-red-600 p-8 font-mono text-slate-200 flex flex-col items-center justify-center text-center space-y-4 m-10"> <h2 className="text-2xl font-bold text-red-500 uppercase tracking-widest">⚠ Tactical Terminal Recovered</h2> <p className="text-xs text-gray-400 max-w-md">The Slate grid experienced a telemetry sync anomaly: {String(this.state.error?.message || 'Data stream interrupted')}</p> <button className="bg-red-600 text-black font-bold px-6 py-3 uppercase text-xs hover:bg-white transition-colors" onClick={() => this.setState({ hasError: false })}> Re-initialize Grid View </button> </div> );
        return this.props.children;
    }
}

function GridBoardInner({ players = {}, grid = [], tokens = [], encounter = {}, activeAction = null, pushUpdate, role, localId }) {
    const [paintBrush, setPaintBrush] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);
    const [hoveredHex, setHoveredHex] = useState(null);
    const [draftPlayerId, setDraftPlayerId] = useState('');
    const [draftEnemyId, setDraftEnemyId] = useState('');
    const [aoeRotation, setAoeRotation] = useState(0);
    const [floatingTexts, setFloatingTexts] = useState([]);
    
    const isGM = role === 'gm';
    const safePlayers = players || {};
    const safeEnc = encounter || {};
    const activeGrid = getSafeGrid(grid);
    const activeTokens = safeArray(tokens);
    const activeEnemies = safeArray(safeEnc.enemies);

    const R = 36; const hexWidth = R * 2; const hexHeight = R * Math.sqrt(3); 
    const stepX = hexWidth * 0.75; const stepY = hexHeight; 
    const boardWidth = (COLS - 1) * stepX + hexWidth; const boardHeight = (ROWS - 1) * stepY + hexHeight + (stepY / 2);

    const findActiveTokenIndex = (action, tokenList) => {
        if (!action) return -1;
        if (action.casterTokenId) return safeArray(tokenList).findIndex(t => t && String(t.id) === String(action.casterTokenId));
        if (action.isTokenId) return safeArray(tokenList).findIndex(t => t && String(t.id) === String(action.sourceId));
        return safeArray(tokenList).findIndex(t => t && t.type === (action.isEnemy ? 'enemy' : 'player') && String(t.refId) === String(action.sourceId));
    };

    const reachableCache = (() => {
        const cache = new Map();
        if (activeAction?.type !== 'move') return cache;
        const tIdx = findActiveTokenIndex(activeAction, activeTokens);
        if (tIdx === -1) return cache;
        const t = activeTokens[tIdx]; const rem = t.movementRemaining ?? t.speed ?? 3;
        if (safeEnc?.round === 0) { activeGrid.forEach((_, idx) => { const targetRow = Math.floor(idx / COLS); if (t.type === 'player' && targetRow >= 5) cache.set(idx, 1); if (t.type === 'enemy' && targetRow < 5) cache.set(idx, 1); }); return cache; }
        return calculateReachableHexes(t.pos, rem, activeGrid, activeTokens, t.type === 'enemy', activeEnemies);
    })();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!e || !e.target) return; if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
            if (activeAction && (activeAction.a === 'line3' || activeAction.a === 'cluster3')) { if (e.key.toLowerCase() === 'r') setAoeRotation(r => (r + 1) % 6); if (e.key.toLowerCase() === 'q') setAoeRotation(r => (r - 1 + 6) % 6); }
        };
        window.addEventListener('keydown', handleKeyDown); return () => window.removeEventListener('keydown', handleKeyDown);
    }, [activeAction]);

    const getHexCoords = (idx) => { const col = idx % COLS; const row = Math.floor(idx / COLS); return { x: col * stepX, y: row * stepY + (col % 2 === 1 ? stepY / 2 : 0) }; };

    const isCrushed = (pos, currentGrid) => {
        if (pos === null || pos === undefined || pos < 0 || pos >= 150) return false; let crushed = true;
        for (let dq = -2; dq <= 2; dq++) { for (let dr = -2; dr <= 2; dr++) { let ds = -dq - dr; if (Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds)) <= 2) { const centerCube = getCubeCoords(pos); const nq = centerCube.q + dq; const nr = centerCube.r + dr; const nIdx = getIndexFromCube(nq, nr); if (nIdx !== null && currentGrid[nIdx]?.terrain !== 'severe') { crushed = false; break; } } } if (!crushed) break; } return crushed;
    };

    const evaluateCrush = (tokensList, currentGrid, playersObj, enemiesList, deadEnemyUids, logStr) => {
        let evLog = logStr; let pObj = { ...(playersObj || {}) }; let eList = safeArray(enemiesList);
        safeArray(tokensList).forEach(t => {
            if (!t || t.type === 'echo') return; const crushed = isCrushed(t.pos, currentGrid);
            if (t.type === 'enemy' && crushed) { const eIndex = eList.findIndex(e => e && String(e.uid) === String(t.refId)); if (eIndex !== -1 && eList[eIndex].currentHp > 0) { eList[eIndex].currentHp = 0; deadEnemyUids.add(String(t.refId)); evLog += `\n>> HOSTILE CRUSHED! [Entombed in Severe Terrain]`; } } 
            else if (t.type === 'player') { const p = pObj[t.refId]; if (p) { p.statuses = safeArray(p.statuses); if (crushed) { if (!p.statuses.some(st => String(st).startsWith('Crushed'))) { p.statuses.push('Crushed [1/3]'); evLog += `\n>> AGENT TRAPPED: ${p.name || 'Agent'} is Entombed [1/3]. Evacuate immediately!`; } } else { if (p.statuses.some(st => String(st).startsWith('Crushed'))) { p.statuses = p.statuses.filter(st => !String(st).startsWith('Crushed [')); evLog += `\n>> AGENT ESCAPED: ${p.name || 'Agent'} successfully broke free from Entombment.`; } } } }
        });
        const activeEnemiesLeft = eList.filter(e => e && e.isActive && e.currentHp > 0 && !deadEnemyUids.has(String(e.uid))).length;
        if (activeEnemiesLeft === 0) { let newlyActivated = 0; eList = eList.map(e => { if (e && !e.isActive && e.spawnMode === 'clear' && e.currentHp > 0 && !deadEnemyUids.has(String(e.uid))) { newlyActivated++; return { ...e, isActive: true }; } return e; }); if (newlyActivated > 0) { evLog += `\n>> PHASE SHIFT: ${newlyActivated} delayed Hostile(s) entered the battlefield!`; } }
        return { pObj, eList, logStr: evLog };
    };

    const advanceTurn = () => {
        pushUpdate(s => {
            const enc = s.encounter || {}; const q = safeArray(enc.initiativeQueue); if (q.length === 0) return s;
            const pClone = deepClone(s.players || {});
            
            if (enc.activeTokenId) {
                const oldToken = safeArray(s.tokens).find(t => t && t.id === enc.activeTokenId);
                if (oldToken && oldToken.type === 'player' && pClone[oldToken.refId]) {
                    if (pClone[oldToken.refId].resPool > 10) pClone[oldToken.refId].resPool = 10;
                }
            }

            let currentIdx = q.indexOf(enc.activeTokenId); let nextId = q[(currentIdx + 1) % q.length];
            const newTokens = deepClone(safeArray(s.tokens)); const currentEnemies = safeArray(enc.enemies);
            const nTIdx = newTokens.findIndex(t => t && t.id === nextId);
            if (nTIdx !== -1) {
                const nextToken = newTokens[nTIdx]; let baseSpeed = nextToken.speed ?? 3; let statuses = [];
                if (nextToken.type === 'player' && pClone[nextToken.refId]) { statuses = safeArray(pClone[nextToken.refId].statuses); pClone[nextToken.refId].usedBasicAttack = false; pClone[nextToken.refId].usedParry = false; pClone[nextToken.refId].usedEvade = false; } 
                else if (nextToken.type === 'enemy') { const e = currentEnemies.find(en => en.uid === nextToken.refId); if (e) statuses = safeArray(e.statuses); }
                let finalSpeed = baseSpeed;
                const coreStates = statuses.map(st => { const match = String(st).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(st)).toLowerCase().trim(); if (clean.includes('knockdown')) return 'Knockdown'; if (clean.includes('slow')) return 'Slowed'; if (clean.includes('haste') || clean.includes('speed')) return 'Haste'; if (clean.includes('stun') || clean.includes('immobil')) return 'Stunned'; return ''; });
                if (coreStates.includes('Knockdown')) finalSpeed = Math.floor(baseSpeed / 2); if (coreStates.includes('Slowed')) finalSpeed = Math.max(0, finalSpeed - 2); if (coreStates.includes('Haste')) finalSpeed += 2; if (coreStates.includes('Stunned')) finalSpeed = 0;
                newTokens[nTIdx].movementRemaining = finalSpeed;
            }
            return { ...s, tokens: newTokens, players: pClone, activeAction: null, encounter: { ...enc, activeTokenId: nextId } };
        });
    };

    const getAoEHexes = (targetIdx, originPosIdx, aType, rotOffset = 0, gridData) => {
        if (targetIdx === null || targetIdx === undefined || targetIdx === -1) return []; let hexes = [targetIdx]; if (!aType || aType === 0 || aType === '0') return hexes;
        if (aType === 1 || aType === '1') { for (let i = 0; i < 150; i++) if (getHexDistance(targetIdx, i) === 1) hexes.push(i); return hexes; } if (aType === 2 || aType === '2') { for (let i = 0; i < 150; i++) if (getHexDistance(targetIdx, i) <= 2 && i !== targetIdx) hexes.push(i); return hexes; }
        const tCube = getCubeCoords(targetIdx); let dirIdx = 0;
        if (originPosIdx !== null && originPosIdx !== undefined && originPosIdx !== targetIdx) { const tCoords = getHexCoords(targetIdx); const aCoords = getHexCoords(originPosIdx); let angle = Math.atan2(tCoords.y - aCoords.y, tCoords.x - aCoords.x) * (180 / Math.PI); if (isNaN(angle)) angle = 0; if (angle < 0) angle += 360; dirIdx = (Math.round(angle / 60) % 6 + 6) % 6; } 
        else { const targetToken = activeTokens.find(t => t && t.pos === targetIdx); if (targetToken && targetToken.facing !== undefined) dirIdx = targetToken.facing; }
        dirIdx = (dirIdx + rotOffset) % 6; if (dirIdx < 0) dirIdx += 6; const hexDirs = [{q:1,r:0,s:-1}, {q:0,r:1,s:-1}, {q:-1,r:1,s:0}, {q:-1,r:0,s:1}, {q:0,r:-1,s:1}, {q:1,r:-1,s:0}]; const d = hexDirs[dirIdx] || hexDirs[0];
        if (aType === 'line3') { for (let step = 1; step <= 2; step++) { const nIdx = getIndexFromCube(tCube.q + d.q*step, tCube.r + d.r*step); if (nIdx !== null) { hexes.push(nIdx); if (gridData && gridData[nIdx] && (gridData[nIdx].terrain === 'severe' || gridData[nIdx].terrain === 'steam')) break; } } } 
        else if (aType === 'cluster3') { const d1 = hexDirs[dirIdx] || hexDirs[0]; const d2 = hexDirs[(dirIdx + 1) % 6] || hexDirs[1]; const idx1 = getIndexFromCube(tCube.q + d1.q, tCube.r + d1.r); const idx2 = getIndexFromCube(tCube.q + d2.q, tCube.r + d2.r); if (idx1 !== null) hexes.push(idx1); if (idx2 !== null) hexes.push(idx2); }
        return hexes;
    };

    const authorizeActionExecution = () => {
        if (!activeAction) return true; if (activeAction.isHijacked && String(activeAction.hijackControllerId) === String(localId)) return true; if (isGM) return true; 
        const tIdx = findActiveTokenIndex(activeAction, activeTokens);
        if (tIdx !== -1) { const actionOwnerToken = activeTokens[tIdx]; if (actionOwnerToken.type === 'enemy') { alert("Access Denied: Only the GM can execute or cancel Hostile actions."); return false; } if (actionOwnerToken.type === 'player' && String(actionOwnerToken.refId) !== String(localId)) { alert("Access Denied: You cannot resolve or cancel an action primed by another Agent."); return false; } }
        return true;
    };

    const clearActiveAction = () => { if (typeof pushUpdate === 'function') pushUpdate(s => ({ ...s, activeAction: null })); };

    const rotateToken = (e, id, dir) => { e.stopPropagation(); pushUpdate(s => { const newTokens = deepClone(safeArray(s.tokens)); const idx = newTokens.findIndex(tok => tok && String(tok.id) === String(id)); if (idx !== -1) newTokens[idx].facing = ((newTokens[idx].facing || 0) + dir + 6) % 6; return { ...s, tokens: newTokens }; }); };

    const deleteToken = (e, id) => { e.stopPropagation(); if (!isGM) return alert("Access Denied."); pushUpdate(s => { const tList = safeArray(s.tokens).filter(tok => tok && String(tok.id) !== String(id)); const q = safeArray(s.encounter?.initiativeQueue).filter(tid => tList.some(tk => tk && tk.id === tid)); return { ...s, tokens: tList, encounter: { ...s.encounter, initiativeQueue: q } }; }); if (selectedToken === id) setSelectedToken(null); };

    const primeTokenMove = (t) => {
        if (!t) return; if (!isGM && t.type === 'enemy') return alert("Access Denied: Cannot move Hostile entities."); if (!isGM && t.type === 'player' && String(t.refId) !== String(localId)) return alert("Access Denied: Cannot reposition other Agents.");
        if (t.type === 'echo') return alert("Access Denied: Tactical Echoes are static constructs and cannot move.");
        let srcName = 'Unknown'; let coreStates = [];
        if (t.type === 'enemy') { const e = safeArray(safeEnc?.enemies).find(en => en && String(en.uid) === String(t.refId)); if (e) { srcName = e.name; coreStates = safeArray(e.statuses).map(st => getCoreState(st)); } } 
        else if (t.type === 'player') { const p = safePlayers[t.refId]; if (p) { srcName = p.name; coreStates = safeArray(p.statuses).map(st => getCoreState(st)); } }
        if (coreStates.includes('Stunned') || coreStates.includes('Immobilized')) return alert("System Locked: Entity is STUNNED or IMMOBILIZED.");
        const rem = t.movementRemaining ?? t.speed ?? 3; if (rem <= 0 && safeEnc?.round !== 0) return alert("Movement points expended for this turn.");
        pushUpdate(s => ({ ...s, activeAction: { type: 'move', source: String(srcName), sourceId: String(t.id), isEnemy: t.type === 'enemy', isTokenId: true } }));
    };

    const primeCard = (c, isImprovised = false, originalCost = 0, targetTokenOverride = null) => {
        const activeT = targetTokenOverride || activeTokens.find(t => t && t.id === selectedToken); if (!activeT) return;
        const p = safePlayers[activeT.refId] || {}; const currentRes = p.resPool ?? 3; const requiredRes = isImprovised ? 1 : safeInt(c.cost); 
        if (!isGM && currentRes < requiredRes) return alert(`System Locked: Insufficient Resonance. Required: ${requiredRes}.`);
        const activeCoreStates = safeArray(p.statuses).map(st => getCoreState(st)); const isBlind = activeCoreStates.includes('Blind'); const disableAttacks = activeCoreStates.includes('Stunned'); if (!isGM && disableAttacks) return alert("System Locked: Agent is STUNNED.");
        const wpn = safeArmory.find(w => String(w.id) === String(p.weaponId || 'w01')) || safeArmory[0];
        let finalRange = isBlind ? '1' : (wpn.range || '1-3'); let finalAoe = isBlind ? 0 : (c.a !== undefined ? c.a : 0); if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes and AoE is zeroed.");
        const mobilityRaw = c.mobilityName || c.mobility || ''; const coreMobility = getCoreMobility(mobilityRaw); const isBlink = safeInt(c.m) > 0 && coreMobility === 'Blink';
        pushUpdate(s => ({ ...s, activeAction: { type: isBlink ? 'blink' : 'target', source: activeT.type === 'echo' ? `Echo of ${p.name || 'Player'}` : String(p.name || 'Player'), sourceId: String(activeT.refId), casterTokenId: activeT.type === 'echo' ? String(activeT.id) : null, isEnemy: false, isBasic: false, isImprovised: isImprovised || false, originalCost: safeInt(originalCost), cost: safeInt(requiredRes), name: String(c.name || 'Custom Action'), payload: String(c.payload || 'damage'), d: safeInt(c.d), a: finalAoe, u: safeInt(c.u), m: safeInt(c.m), coreMobility: String(coreMobility || ''), range: String(finalRange), effectName: String(c.effectName || ''), effectCore: String(c.effectCore || getCoreState(c.effectName) || ''), elementRaw: String(c.elementRaw || 'Kinetic'), elementCore: String(c.elementCore || getCoreElement(c.elementRaw || 'Kinetic')), terrain: String(c.terrain || ''), desc: String(c.desc || ''), cardId: c.id ? String(c.id) : null, isEcho: c.isEcho || false } })); 
    };

    const executeMove = (index) => {
        const targetRow = Math.floor(index / COLS);
        pushUpdate(s => {
            const action = s.activeAction || activeAction; const newTokens = deepClone(safeArray(s.tokens)); const tIdx = findActiveTokenIndex(action, newTokens);
            if (tIdx !== -1) {
                const t = newTokens[tIdx];
                if (s.encounter?.round === 0) { if (t.type === 'player' && targetRow < 5) { alert("Agents must be deployed in the southern sector (Rows 6-10)."); return s; } if (t.type === 'enemy' && targetRow >= 5) { alert("Hostiles must be deployed in the northern sector (Rows 1-5)."); return s; } t.pos = index; return { ...s, tokens: newTokens, activeAction: null }; }
                if (!reachableCache.has(index)) { alert("System Locked: Destination hex is out of range or blocked."); return s; }
                const moveCost = reachableCache.get(index); t.movementRemaining = Math.max(0, (t.movementRemaining ?? t.speed ?? 3) - moveCost); t.pos = index;
                const targetCell = getSafeGrid(s.grid)[index] || {}; if (targetCell.terrain === 'major') alert("⚠️ HAZARD WARNING: Token entered Major Terrain.");
                let finalPlayers = deepClone(s.players || {}); const entName = t.type === 'player' ? String(finalPlayers[t.refId]?.name || 'Agent') : String(activeEnemies.find(e=>e.uid === t.refId)?.name || 'Hostile'); const logEntry = { id: Date.now().toString() + Math.random().toString(), text: `>> MOVEMENT: ${entName} repositioned to Hex ${index}.` }; let newLogFeed = [...safeArray(s.encounter?.logFeed), logEntry].slice(-50);
                if (t.type === 'player') { const res = evaluateCrush(newTokens, getSafeGrid(s.grid), finalPlayers, s.encounter?.enemies || [], new Set(), ""); if (res.logStr) { finalPlayers = res.pObj; newLogFeed.push({ id: Date.now().toString() + Math.random().toString(), text: String(res.logStr) }); } }
                return { ...s, tokens: newTokens, players: finalPlayers, activeAction: null, encounter: { ...(s.encounter || {}), logFeed: newLogFeed } };
            }
            return s;
        });
    };

    const executeBlink = (index) => {
        pushUpdate(s => {
            const action = s.activeAction || activeAction; const newTokens = deepClone(safeArray(s.tokens)); const tIdx = findActiveTokenIndex(action, newTokens);
            if (tIdx !== -1) {
                const t = newTokens[tIdx]; const gridData = getSafeGrid(s.grid); const targetCell = gridData[index] || { terrain: null };
                if (targetCell.terrain === 'severe') { alert("Destination hex contains Severe Terrain. Blink aborted."); return s; }
                t.pos = index; let log = `>> AGENT RELOCATED: Executed [${action.coreMobility || 'Blink'}] displacement vector for ${action.m || 1} hexes.`;
                let newEnemyPoolTotal = safeInt(s.encounter?.enemyPoolTotal ?? 10); let newPlayers = deepClone(s.players || {});
                if (action.isEnemy && !action.isHijacked) { newEnemyPoolTotal = Math.max(0, newEnemyPoolTotal - (action.cost || 0)); log += `\n>> [-${action.cost || 0} Res] Hostile Action executed.`; } 
                else if (action.sourceId && !action.isHijacked) { const p = newPlayers[action.sourceId]; if (p) { const pRes = p.resPool ?? 3; if (action.isImprovised) { p.resPool = Math.max(0, pRes - 1); log += `\n>> [-1 Res] Improvised Skill Matrix engaged.`; } else { const costDeduction = parseInt(action.cost) || 0; p.resPool = Math.max(0, pRes - costDeduction); if (costDeduction > 0) log += `\n>> [-${costDeduction} Res] Skill executed.`; } } }
                if (action.isHijacked) { const eIdx = safeArray(s.encounter?.enemies).findIndex(e => e && String(e.uid) === String(action.sourceId)); if (eIdx !== -1) { const newE = deepClone(safeArray(s.encounter?.enemies)); newE[eIdx].statuses = safeArray(newE[eIdx].statuses).filter(st => getCoreState(st) !== 'Hijacked'); log += `\n>> HIJACK TERMINATED: Target released from Neural Link.`; const res = evaluateCrush(newTokens, gridData, newPlayers, newE, new Set(), log); return { ...s, tokens: newTokens, players: res.pObj, encounter: { ...(s.encounter||{}), enemies: res.eList, logFeed: [...safeArray(s.encounter?.logFeed), { id: Date.now().toString(), text: String(res.logStr) }].slice(-50) }, activeAction: null }; } }
                const res = evaluateCrush(newTokens, gridData, newPlayers, s.encounter?.enemies || [], new Set(), log);
                return { ...s, tokens: newTokens, players: res.pObj, encounter: { ...(s.encounter||{}), enemyPoolTotal: newEnemyPoolTotal, logFeed: [...safeArray(s.encounter?.logFeed), { id: Date.now().toString(), text: String(res.logStr) }].slice(-50) }, activeAction: null };
            }
            return s;
        });
    };

    const resolveCombat = (targetHex) => {
        pushUpdate(s => {
            const action = s.activeAction || activeAction; if (!action) return s;
            let newGrid = deepClone(getSafeGrid(s.grid)); let newTokens = deepClone(safeArray(s.tokens)); let fctQueue = [];
            const attIdx = findActiveTokenIndex(action, newTokens); const originPosIdx = attIdx !== -1 ? newTokens[attIdx].pos : null;
            if (originPosIdx !== null && !checkLineOfSight(originPosIdx, targetHex, newGrid)) { alert("Target hex is obstructed by Line of Sight."); return s; }
            const payloadType = action.payload || 'damage'; const rawDmg = safeInt(action.d); const dispCore = action.elementCore || action.element || 'Kinetic'; const showType = (action.elementRaw && String(action.elementRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${action.elementRaw} [Core: ${dispCore}]` : dispCore;
            let newPlayers = deepClone(s.players || {}); let newEnemies = deepClone(safeArray(s.encounter?.enemies)); let newEnemyPoolTotal = safeInt(s.encounter?.enemyPoolTotal ?? 10);
            let hitCount = 0; let actualTargetHex = targetHex; let log = `--- COMBAT LOG: ${action.name || 'Action'} [${showType}] ---\n`;
            if (action.isImprovised) { const roll = Math.floor(Math.random() * 6) + 1; log += `>> IMPROVISED ROLL: [${roll}]\n`; if (roll >= 5) log += `>> CASCADE: Reality bent to Agent's will.\n`; else if (roll >= 3) { const fbDmg = safeInt(action.originalCost); log += `>> SURGE: Action succeeds, but Agent suffers ${fbDmg} feedback damage.\n`; if (!action.isEnemy && action.sourceId) { const p = newPlayers[action.sourceId]; if (p) { p.currentHp = Math.max(0, safeInt(p.currentHp) - fbDmg); fctQueue.push({ pos: originPosIdx, text: `-${fbDmg}`, color: '#ef4444', id: Math.random() }); } } } else { log += `>> BACKLASH: Catastrophic failure! Trajectory inverted!\n`; if (attIdx !== -1) actualTargetHex = originPosIdx; } }
            
            if (action.isEcho && !action.isEchoSpellCast) {
                if (newTokens.some(t => t.pos === actualTargetHex)) { alert("Target hex occupied. Manifestation failed."); return s; }
                if (action.sourceId && !action.isHijacked) { const p = newPlayers[action.sourceId]; if (p) { let pRes = p.resPool ?? 3; if (action.isImprovised) { pRes = Math.max(0, pRes - 1); log += `>> [-1 Res] Improvised Echo Manifested.\n`; } else { const costDeduction = safeInt(action.cost); pRes = Math.max(0, pRes - costDeduction); log += `>> [-${costDeduction} Res] Echo Manifested.\n`; } p.resPool = pRes; } }
                newTokens.push({ id: `echo-${Date.now()}-${Math.floor(Math.random()*1000)}`, type: 'echo', pos: actualTargetHex, facing: originPosIdx !== null && newTokens[attIdx] ? newTokens[attIdx].facing : 0, speed: 0, movementRemaining: 0, refId: action.sourceId, currentHp: 10, maxHp: 10, statuses: [], spell: { ...action, isEcho: false, isEchoSpellCast: true } });
                log += `>> ECHO MANIFESTED: Deployable anchored at Hex ${actualTargetHex}.\n`; const logEntry = { id: Date.now().toString() + Math.random().toString(), text: log.trim() }; return { ...s, players: newPlayers, tokens: newTokens, encounter: { ...(s.encounter || {}), logFeed: [...safeArray(s.encounter?.logFeed), logEntry].slice(-50) }, activeAction: null };
            }

            log += `Payload Value: ${rawDmg}\n`;
            const effectiveAoe = (action.isEcho && !action.isEchoSpellCast) ? 0 : action.a;
            const aoeHexes = getAoEHexes(actualTargetHex, originPosIdx, effectiveAoe, aoeRotation, newGrid); const isExecute = getCoreState(action.effectName) === 'Execute'; let deadEnemyUids = new Set(); let deadEchoIds = new Set(); const consumeStates = ['Invulnerable', 'Shielded', 'Vulnerable', 'Evasive']; let hijackedEnemyId = null; let triggeredExploit = false; let triggeredTagTeam = false; let triggeredAssist = false;

            newTokens.forEach(t => {
                if (!t) return;
                if (aoeHexes.includes(t.pos)) {
                    hitCount++; const targetCoords = getHexCoords(t.pos); let isFlanking = false;
                    if ((!effectiveAoe || effectiveAoe === '0' || effectiveAoe === 0) && originPosIdx !== null && originPosIdx !== t.pos) { const aCoords = getHexCoords(originPosIdx); const dx = aCoords.x - targetCoords.x; const dy = aCoords.y - targetCoords.y; let angle = Math.atan2(dy, dx) * (180 / Math.PI); if (isNaN(angle)) angle = 0; if (angle < 0) angle += 360; const facingAngle = (t.facing || 0) * 60; let diff = Math.abs(angle - facingAngle); if (isNaN(diff)) diff = 0; if (diff > 180) diff = 360 - diff; if (diff > 90) isFlanking = true; }
                    let baseCellElem = newGrid[t.pos]?.terrainElement; let isOnSteamReact = baseCellElem === 'Cryo' && dispCore === 'Thermal'; let isOnCombustReact = baseCellElem === 'Toxic' && dispCore === 'Thermal'; let isOnConductReact = (baseCellElem === 'Cryo' || baseCellElem === 'Steam') && dispCore === 'Electro'; let isOnAnnihilateReact = (baseCellElem === 'Void' && dispCore === 'Radiant') || (baseCellElem === 'Radiant' && dispCore === 'Void');
                    
                    if (t.type === 'echo') {
                        let incomingDmg = rawDmg;
                        if (payloadType === 'damage') {
                            if (isFlanking) incomingDmg = Math.ceil(incomingDmg * 1.5);
                            if (isOnSteamReact || isOnCombustReact || isOnConductReact || isOnAnnihilateReact) incomingDmg += 5;
                            if (isExecute) { incomingDmg = t.currentHp; }
                            const finalDmg = Math.max(0, incomingDmg); t.currentHp = Math.max(0, t.currentHp - finalDmg); log += `Echo Construct: Took ${finalDmg} HP dmg. HP is now ${t.currentHp}.\n`; fctQueue.push({ pos: t.pos, text: `-${finalDmg}`, color: '#a855f7', id: Math.random() });
                            if (t.currentHp <= 0) { log += `>> ECHO DESTROYED! Construct collapsed.\n`; deadEchoIds.add(t.id); }
                        } else if (payloadType === 'heal') { t.currentHp = Math.min(10, t.currentHp + rawDmg); log += `Echo Construct: Repaired ${rawDmg} HP.\n`; fctQueue.push({ pos: t.pos, text: `+${rawDmg}`, color: '#22c55e', id: Math.random() }); }
                    } else if (t.type === 'enemy') {
                        const eIndex = newEnemies.findIndex(e => e && String(e.uid) === String(t.refId));
                        if (eIndex !== -1 && newEnemies[eIndex].isActive) {
                            const enemy = newEnemies[eIndex]; let newHp = safeInt(enemy.currentHp); let staggered = enemy.staggered;
                            let barriers = [...safeArray(enemy.currentBarriers)]; let coreStates = safeArray(enemy.statuses).map(st => getCoreState(st)); let incomingDmg = rawDmg;
                            const rpsMult = getAffinityMultiplier(dispCore, enemy.affinity);

                            if (payloadType === 'heal') { let incomingHeal = Math.ceil(rawDmg * rpsMult); if (rpsMult === 1.5) log += `>> AFFINITY ADVANTAGE: 1.5x Healing\n`; if (rpsMult === 0.5) log += `>> AFFINITY DISADVANTAGE: 0.5x Healing\n`; newHp += incomingHeal; log += `Hostile [${enemy.name}]: Restored ${incomingHeal} HP. HP is now ${newHp}.\n`; fctQueue.push({ pos: t.pos, text: `+${incomingHeal}`, color: '#22c55e', id: Math.random() }); } 
                            else if (payloadType === 'battery') { newEnemyPoolTotal = Math.min(100, newEnemyPoolTotal + rawDmg); log += `Hostile [${enemy.name}]: Transferred ${rawDmg} Resonance to the Global Hostile Pool.\n`; fctQueue.push({ pos: t.pos, text: `+${rawDmg} RES`, color: '#ff6600', id: Math.random() }); } 
                            else {
                                if (rpsMult === 1.5) { incomingDmg = Math.ceil(incomingDmg * 1.5); log += `>> AFFINITY ADVANTAGE: 1.5x Dmg\n`; } if (rpsMult === 0.5) { incomingDmg = Math.ceil(incomingDmg * 0.5); log += `>> AFFINITY DISADVANTAGE: 0.5x Dmg\n`; } if (isFlanking) { incomingDmg = Math.ceil(incomingDmg * 1.5); log += `>> FLANKING BONUS: 1.5x Dmg\n`; }
                                if (rpsMult === 1.5 || coreStates.includes('Vulnerable')) triggeredExploit = true; if (isFlanking) triggeredTagTeam = true;
                                if (isOnSteamReact) { incomingDmg += 5; log += `>> STEAM BLAST: (+5 Dmg)\n`; } if (isOnCombustReact) { incomingDmg += 5; log += `>> COMBUSTION: (+5 Dmg)\n`; } if (isOnConductReact) { incomingDmg += 5; log += `>> CONDUCTION: (+5 Dmg)\n`; } if (isOnAnnihilateReact) { incomingDmg += 5; log += `>> ANNIHILATION: (+5 Dmg)\n`; }
                                if (coreStates.includes('Vulnerable')) incomingDmg = Math.ceil(incomingDmg * 1.5); if (coreStates.includes('Shielded')) { incomingDmg = Math.max(0, incomingDmg - 5); log += `>> [Shielded] mitigated 5 damage.\n`; } if (coreStates.includes('Invulnerable')) { incomingDmg = 0; log += `>> [Invulnerable] completely negated the attack.\n`; }

                                if (isExecute) { p.currentHp = 0; log += `>> AGENT EXECUTED! [Critical System Failure]\n`; fctQueue.push({ pos: t.pos, text: 'FATAL', color: '#ef4444', id: Math.random() }); } 
                                else {
                                    let mitigation = 0; let mitName = "None"; let trueFlank = isFlanking || (effectiveAoe !== undefined && effectiveAoe !== 0 && effectiveAoe !== '0');
                                    if (forcedEvasion) { trueFlank = true; mitName = "Forced Evasion [State]"; if (p.usedEvade) { mitigation = 0; mitName += " [EXHAUSTED]"; } else { mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0); p.usedEvade = true; } } 
                                    else if (trueFlank) { if (p.usedEvade) { mitigation = 0; mitName = "Flanked [EXHAUSTED]"; } else { mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0); mitName = "Backline Evasion"; p.usedEvade = true; } } 
                                    else { if (p.usedParry) { mitigation = 0; mitName = "Direct Hit [PARRY EXHAUSTED]"; } else { mitigation = fDP + (wpn.baseDmg||0) + wpnBonus; mitName = "Front Parry"; p.usedParry = true; } }
                                    const finalDmg = Math.max(0, incomingDmg - mitigation); p.currentHp = Math.max(0, safeInt(p.currentHp ?? derivedMaxHp) - finalDmg);
                                    log += `Agent [${p.name || 'P1'}]: ${mitName} blocked ${mitigation} dmg. Took ${finalDmg} HP dmg. HP is now ${p.currentHp}.\n`; fctQueue.push({ pos: t.pos, text: `-${finalDmg}`, color: '#ef4444', id: Math.random() });
                                }
                            }
                            if (action.sourceId && String(t.refId) !== String(action.sourceId) && action.effectName) { let core = action.effectCore || getCoreState(action.effectName); if (['Shielded', 'Haste', 'Evasive', 'Invulnerable'].includes(core)) triggeredAssist = true; }
                            p.statuses = safeArray(p.statuses).filter(st => !consumeStates.includes(getCoreState(st)));
                            if (action.effectName && (!isExecute || payloadType !== 'damage')) { let newlyAppliedCore = action.effectCore || getCoreState(action.effectName); p.statuses.push(action.effectName); log += `>> State [${action.effectName}] applied to ${p.name}!\n`; if (newlyAppliedCore === 'Haste') t.movementRemaining = (t.movementRemaining || 0) + 2; else if (newlyAppliedCore === 'Slowed') t.movementRemaining = Math.max(0, (t.movementRemaining || 0) - 2); else if (newlyAppliedCore === 'Immobilized' || newlyAppliedCore === 'Stunned') t.movementRemaining = 0; else if (newlyAppliedCore === 'Knockdown') t.movementRemaining = Math.floor((t.movementRemaining || 0) / 2); }
                        }
                    }

                    if (safeInt(action.m) > 0 && originPosIdx !== null && originPosIdx !== t.pos) {
                        if (action.coreMobility === 'Push' || action.coreMobility === 'Pull') {
                            let pushPos = t.pos; let collisionDmg = 0; const mobDist = safeInt(action.m);
                            for (let step = 0; step < mobDist; step++) {
                                const adjHexes = getAdjacentHexes(pushPos); const validHexes = adjHexes.filter(h => newGrid && newGrid[h] && newGrid[h].terrain !== 'severe');
                                if (validHexes.length === 0) { collisionDmg += (mobDist - step); break; }
                                validHexes.sort((a,b) => { const distA = getHexDistance(a, originPosIdx); const distB = getHexDistance(b, originPosIdx); return action.coreMobility === 'Push' ? distB - distA : distA - distB; });
                                const bestHex = validHexes[0]; const currentDist = getHexDistance(pushPos, originPosIdx); const bestDist = getHexDistance(bestHex, originPosIdx);
                                if (action.coreMobility === 'Push' && bestDist <= currentDist) { collisionDmg += (mobDist - step); break; } if (action.coreMobility === 'Pull' && bestDist >= currentDist) { collisionDmg += (mobDist - step); break; } pushPos = bestHex;
                            }
                            t.pos = pushPos; log += `>> FORCED MOVEMENT: Entity thrown via [${action.coreMobility}] momentum.\n`;
                            if (collisionDmg > 0) {
                                if (t.type === 'enemy') { const eIndex = newEnemies.findIndex(e => e && String(e.uid) === String(t.refId)); if (eIndex !== -1 && newEnemies[eIndex].isActive) { newEnemies[eIndex].currentHp = Math.max(0, newEnemies[eIndex].currentHp - collisionDmg); if (newEnemies[eIndex].currentHp <= 0) deadEnemyUids.add(String(t.refId)); } } else if (t.type === 'player') { const p = newPlayers[t.refId]; if (p) p.currentHp = Math.max(0, safeInt(p.currentHp) - collisionDmg); } else if (t.type === 'echo') { t.currentHp -= collisionDmg; if(t.currentHp <= 0) deadEchoIds.add(t.id); }
                                log += `>> SLAM COLLISION: Entity struck impassable terrain for ${collisionDmg} physical damage.\n`;
                            }
                        }
                    }
                }
            });

            if (hitCount === 0) log += `No valid targets in payload array.\n`;
            
            if (action.isEnemy && !action.isHijacked) { newEnemyPoolTotal = Math.max(0, newEnemyPoolTotal - safeInt(action.cost)); log += `>> [-${safeInt(action.cost)} Res] Hostile Action executed.\n`; } 
            else if (action.sourceId && !action.isHijacked && !action.isEchoSpellCast) {
                const p = newPlayers[action.sourceId];
                if (p) {
                    let pRes = p.resPool ?? 3;
                    if (action.isBasic) { p.usedBasicAttack = true; pRes += 2; log += `>> [+2 Res] Basic Attack executed.\n`; } 
                    else if (action.isImprovised) { pRes = Math.max(0, pRes - 1); log += `>> [-1 Res] Improvised Skill Matrix engaged.\n`; } 
                    else { const costDeduction = safeInt(action.cost); pRes = Math.max(0, pRes - costDeduction); if (costDeduction > 0) log += `>> [-${costDeduction} Res] Skill executed.\n`; }
                    let syncLogs = []; if (triggeredExploit) { pRes += 4; syncLogs.push('EXPLOIT (+4 Res)'); } if (triggeredTagTeam) { pRes += 4; syncLogs.push('TAG-TEAM (+4 Res)'); } if (triggeredAssist) { pRes += 2; syncLogs.push('ASSIST (+2 Res)'); } if (syncLogs.length > 0) log += `>> AUTOMATED SYNERGY: ${syncLogs.join(', ')}\n`; p.resPool = pRes;
                }
            }

            if (action.isHijacked) { const eIdx = newEnemies.findIndex(e => e && String(e.uid) === String(action.sourceId)); if (eIdx !== -1) { newEnemies[eIdx].statuses = safeArray(newEnemies[eIdx].statuses).filter(st => getCoreState(st) !== 'Hijacked'); log += `>> HIJACK TERMINATED: Target released from Neural Link.\n`; } }

            let steamCount = 0; let combustCount = 0; let conductCount = 0; let annihilateCount = 0; let changedCount = 0;
            newGrid = newGrid.map((cell, idx) => {
                if (aoeHexes.includes(idx)) {
                    let cellChanged = false; let newTerrain = cell.terrain; let newElem = cell.terrainElement;
                    if (action.terrain && action.terrain.trim() !== '') { const tCast = action.terrain.trim().toLowerCase(); if (cell.terrain !== 'severe' || tCast === 'clear') { newTerrain = tCast === 'clear' ? null : tCast; newElem = tCast === 'clear' ? null : dispCore; cellChanged = true; changedCount++; } }
                    let baseCellElem = cell.terrainElement || newElem;
                    if (baseCellElem === 'Cryo' && dispCore === 'Thermal') { newTerrain = 'steam'; newElem = 'Steam'; steamCount++; cellChanged = true; } else if (baseCellElem === 'Toxic' && dispCore === 'Thermal') { newTerrain = null; newElem = null; combustCount++; cellChanged = true; } else if ((baseCellElem === 'Cryo' || baseCellElem === 'Steam') && dispCore === 'Electro') { newTerrain = 'minor'; newElem = 'Electro'; conductCount++; cellChanged = true; } else if ((baseCellElem === 'Void' && dispCore === 'Radiant') || (baseCellElem === 'Radiant' && dispCore === 'Void')) { newTerrain = null; newElem = null; annihilateCount++; cellChanged = true; }
                    if (cellChanged) return { ...cell, terrain: newTerrain, terrainElement: newElem };
                }
                return cell;
            });

            if (changedCount > 0) log += `>> TERRAIN SHIFT: ${changedCount} hex(es) painted.\n`; if (steamCount > 0) log += `>> ELEMENTAL REACTION: ${steamCount} hex(es) triggered a Steam Explosion!\n`; if (combustCount > 0) log += `>> ELEMENTAL REACTION: ${combustCount} hex(es) ignited in a Toxic Combustion!\n`; if (conductCount > 0) log += `>> ELEMENTAL REACTION: ${conductCount} hex(es) conducted Chain Lightning!\n`; if (annihilateCount > 0) log += `>> ELEMENTAL REACTION: ${annihilateCount} hex(es) underwent Matter Annihilation!\n`;

            if (deadEnemyUids.size > 0) { 
                let expGain = 0;
                newEnemies.forEach(e => { if (e && deadEnemyUids.has(String(e.uid))) { expGain += safeInt(e.exp || (e.tier * 10)); } });
                newEnemies = newEnemies.filter(e => e && !deadEnemyUids.has(String(e.uid))); 
                newTokens = newTokens.filter(t => t && !(t.type === 'enemy' && deadEnemyUids.has(String(t.refId))));
                if (expGain > 0) {
                    Object.values(newPlayers).forEach(p => { if (p) p.exp = (p.exp || 0) + expGain; });
                    log += `>> TEAM REWARD: +${expGain} EXP distributed to all deployed Agents.\n`;
                }
            }
            if (deadEchoIds.size > 0) { newTokens = newTokens.filter(t => !deadEchoIds.has(String(t.id))); }
            
            setFloatingTexts(prev => [...prev, ...fctQueue]); setTimeout(() => { setFloatingTexts(prev => prev.filter(f => !fctQueue.find(x => x.id === f.id))); }, 2500);

            const logEntry = { id: Date.now().toString() + Math.random().toString(), text: log.trim() };

            if (hijackedEnemyId && !deadEnemyUids.has(hijackedEnemyId)) {
                const hEnemy = newEnemies.find(e => e && String(e.uid) === hijackedEnemyId);
                if (hEnemy && safeArray(hEnemy.abilities).length > 0) {
                    const extraLog = `>> NEURAL HIJACK SUCCESSFUL! Agent has seized control of Hostile [${hEnemy.name}].\n`; logEntry.text += '\n' + extraLog;
                    const res = evaluateCrush(newTokens, newGrid, newPlayers, newEnemies, deadEnemyUids, extraLog); let newQueue = safeArray(s.encounter?.initiativeQueue).filter(id => res.eList.some(en => en && en.uid === id));
                    return { ...s, players: res.pObj, encounter: { ...(s.encounter || {}), enemies: res.eList, enemyPoolTotal: newEnemyPoolTotal, initiativeQueue: newQueue, logFeed: [...safeArray(s.encounter?.logFeed), logEntry].slice(-50) }, tokens: newTokens, grid: newGrid, activeAction: { type: 'hijack_select', enemy: hEnemy, hijackControllerId: action.sourceId } };
                }
            }

            const res = evaluateCrush(newTokens, newGrid, newPlayers, newEnemies, deadEnemyUids, ""); if (res.logStr) logEntry.text += '\n' + res.logStr;
            if (deadEnemyUids.size > 0) { res.eList = res.eList.filter(e => e && !deadEnemyUids.has(String(e.uid))); newTokens = newTokens.filter(t => t && !(t.type === 'enemy' && deadEnemyUids.has(String(t.refId)))); }
            let newQueue = safeArray(s.encounter?.initiativeQueue).filter(id => newTokens.some(t => t && t.id === id));
            return { ...s, players: res.pObj, encounter: { ...(s.encounter || {}), enemies: res.eList, enemyPoolTotal: newEnemyPoolTotal, initiativeQueue: newQueue, logFeed: [...safeArray(s.encounter?.logFeed), logEntry].slice(-50) }, tokens: newTokens, grid: newGrid, activeAction: null };
        });
        setAoeRotation(0);
    };

    const handleHexClick = (index) => {
        if (activeAction) { if (!authorizeActionExecution()) return; if (activeAction.type === 'move') executeMove(index); else if (activeAction.type === 'blink') executeBlink(index); else if (activeAction.type === 'target') resolveCombat(index); } 
        else if (isGM && safeEnc?.round === 0) { const targetRow = Math.floor(index / COLS); if (targetRow < 5 && draftEnemyId) { handleDeployClick(index, 'enemy', draftEnemyId); } else if (targetRow >= 5 && draftPlayerId) { handleDeployClick(index, 'player', draftPlayerId); } else { setSelectedToken(null); } } 
        else if (paintBrush) {
            if (!isGM) return alert("Access Denied: Only the GM can overwrite grid terrain.");
            pushUpdate(s => { const newGrid = deepClone(getSafeGrid(s.grid)); newGrid[index] = { ...newGrid[index], terrain: paintBrush === 'clear' ? null : paintBrush, terrainElement: null }; const res = evaluateCrush(safeArray(s.tokens), newGrid, s.players || {}, s.encounter?.enemies || [], new Set(), ""); return { ...s, grid: newGrid, encounter: { ...s.encounter, enemies: res.eList }, players: res.pObj, tokens: safeArray(s.tokens), globalLog: res.logStr ? { message: String(res.logStr), timestamp: Date.now() } : s.globalLog }; });
        } else { setSelectedToken(null); }
    };

    const handleDeployClick = (idx, type, refId) => {
        if (!refId) return alert("Please select a valid unit from the dropdown menu first."); const targetRow = Math.floor(idx / COLS);
        if (!isGM && safeEnc?.round > 0) return alert("Deployment phase has ended."); if (type === 'player' && targetRow < 5) return alert("Agents must be deployed in the southern sector (Rows 6-10)."); if (type === 'enemy' && targetRow >= 5) return alert("Hostiles must be deployed in the northern sector (Rows 1-5).");
        pushUpdate(s => {
            const currentTokens = safeArray(s.tokens); if (currentTokens.some(t => t && String(t.refId) === String(refId))) { alert("System Locked: This entity instance is already deployed on the grid."); return s; }
            const newToken = { id: `token-${Date.now()}-${Math.floor(Math.random()*1000)}`, type: type, pos: idx, facing: type === 'enemy' ? 3 : 0, speed: 3, movementRemaining: 3, refId: refId }; return { ...s, tokens: [...currentTokens, newToken] };
        });
    };

    const handleHexDrop = (e, idx) => {
        if (!e) return; e.preventDefault(); setHoveredHex(null);
        try {
            const dataStr = e.dataTransfer.getData('text/plain'); if (!dataStr) return; const data = JSON.parse(dataStr); const targetRow = Math.floor(idx / COLS);
            if (data.action === 'deploy') { if (!data.refId) return alert("Please select a unit from the dropdown menu first."); handleDeployClick(idx, data.type, data.refId); } 
            else if (data.action === 'moveToken' && safeEnc?.round === 0) { pushUpdate(s => { const newTokens = deepClone(safeArray(s.tokens)); const tIdx = newTokens.findIndex(t => t && t.id === data.tokenId); if (tIdx !== -1) { if (!isGM && newTokens[tIdx].type === 'player' && targetRow < 5) { alert("Agents must stay in southern sector."); return s; } if (!isGM && newTokens[tIdx].type === 'enemy' && targetRow >= 5) { alert("Hostiles must stay in northern sector."); return s; } newTokens[tIdx].pos = idx; return { ...s, tokens: newTokens }; } return s; }); }
        } catch (err) {}
    };

    const renderInitiativeTracker = () => {
        if (safeEnc?.round === 0 || safeArray(safeEnc?.initiativeQueue).length === 0) return null;
        return (
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 bg-black/80 border border-gray-700 p-2 shadow-lg max-w-[90vw] overflow-x-auto scrollbar-hide">
                {safeArray(safeEnc.initiativeQueue).map((tid) => {
                    const isAct = tid === safeEnc.activeTokenId; const qT = activeTokens.find(t => t && t.id === tid); if (!qT) return null;
                    let name = 'Unknown'; let tColor = '#555';
                    if (qT.type === 'player') { name = safePlayers[qT.refId]?.name || 'Agent'; tColor = '#00f0ff'; } 
                    else { name = activeEnemies.find(e => e.uid === qT.refId)?.name || 'Hostile'; tColor = '#ff6600'; }
                    return (
                        <div key={tid} onClick={() => setSelectedToken(tid)} className={`flex items-center gap-2 px-3 py-1.5 cursor-pointer transition-all border ${isAct ? 'border-white bg-white/20 scale-110 mx-2 shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'border-gray-800 bg-black hover:border-gray-500'}`}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tColor }}></div>
                            <span className={`text-[10px] font-bold uppercase whitespace-nowrap ${isAct ? 'text-white' : 'text-gray-400'}`}>{String(name).substring(0, 10)}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderTargetPreviews = () => {
        if (!activeAction || activeAction.type !== 'target' || hoveredHex === null) return null;
        const originTokenIdx = findActiveTokenIndex(activeAction, activeTokens); const originPosIdx = originTokenIdx !== -1 ? activeTokens[originTokenIdx].pos : null;
        if (originPosIdx !== null && activeAction.a === 0 && !checkLineOfSight(originPosIdx, hoveredHex, activeGrid)) return null;
        const effectiveAoe = (activeAction.isEcho && !activeAction.isEchoSpellCast) ? 0 : activeAction.a;
        const aoeHexes = getAoEHexes(hoveredHex, originPosIdx, effectiveAoe, aoeRotation, activeGrid);
        const payloadType = activeAction.payload || 'damage'; const rawDmg = safeInt(activeAction.d); const dispCore = activeAction.elementCore || activeAction.elementRaw || 'Kinetic'; const isExecute = getCoreState(activeAction.effectName) === 'Execute';
        return activeTokens.map(t => {
            if (!t || t.pos === null || t.pos === undefined || t.pos < 0 || t.pos >= 150 || !aoeHexes.includes(t.pos)) return null;
            let isInactive = false; if (t.type === 'enemy') { const linkedEnemy = safeArray(safeEnc?.enemies).find(e => e && String(e.uid) === String(t.refId)); if (linkedEnemy && !linkedEnemy.isActive) isInactive = true; } if (isInactive) return null;

            let isFlanking = false;
            if ((!effectiveAoe || effectiveAoe === '0' || effectiveAoe === 0) && originPosIdx !== null && originPosIdx !== t.pos) { const tCoords = getHexCoords(t.pos); const aCoords = getHexCoords(originPosIdx); const dx = aCoords.x - tCoords.x; const dy = aCoords.y - tCoords.y; let angle = Math.atan2(dy, dx) * (180 / Math.PI); if (isNaN(angle)) angle = 0; if (angle < 0) angle += 360; const facingAngle = (t.facing || 0) * 60; let diff = Math.abs(angle - facingAngle); if (isNaN(diff)) diff = 0; if (diff > 180) diff = 360 - diff; if (diff > 90) isFlanking = true; }

            let baseCellElem = activeGrid[t.pos]?.terrainElement; let isOnSteamReact = baseCellElem === 'Cryo' && dispCore === 'Thermal'; let isOnCombustReact = baseCellElem === 'Toxic' && dispCore === 'Thermal'; let isOnConductReact = (baseCellElem === 'Cryo' || baseCellElem === 'Steam') && dispCore === 'Electro'; let isOnAnnihilateReact = (baseCellElem === 'Void' && dispCore === 'Radiant') || (baseCellElem === 'Radiant' && dispCore === 'Void');

            let entAffinity = 'Kinetic'; let entStates = []; let isEnemy = t.type === 'enemy'; let pObj = null;
            if (isEnemy) { const e = safeArray(safeEnc?.enemies).find(en => en && String(en.uid) === String(t.refId)); if (e) { entAffinity = e.affinity; entStates = safeArray(e.statuses).map(st => getCoreState(st)); } } else if (t.type === 'player') { pObj = safePlayers[t.refId]; if (pObj) { entAffinity = pObj.affinity; entStates = safeArray(pObj.statuses).map(st => getCoreState(st)); } }

            let incomingDmg = rawDmg; const rpsMult = getAffinityMultiplier(dispCore, entAffinity); let mitigation = 0; let mitName = ""; let finalDmg = rawDmg; let reactionBonus = 0;
            if (payloadType === 'damage') {
                if (rpsMult === 1.5) incomingDmg = Math.ceil(incomingDmg * 1.5); if (rpsMult === 0.5) incomingDmg = Math.ceil(incomingDmg * 0.5); if (isFlanking) incomingDmg = Math.ceil(incomingDmg * 1.5);
                if (isOnSteamReact || isOnCombustReact || isOnConductReact || isOnAnnihilateReact) { incomingDmg += 5; reactionBonus = 5; }
                if (entStates.includes('Vulnerable')) incomingDmg = Math.ceil(incomingDmg * 1.5); if (entStates.includes('Shielded')) incomingDmg = Math.max(0, incomingDmg - 5); if (entStates.includes('Invulnerable')) incomingDmg = 0;
                if (isExecute) { finalDmg = 'FATAL'; } 
                else if (!isEnemy && pObj) {
                    const fDP = parseInt(pObj.dpFront) || 0; const sDP = parseInt(pObj.dpSupport) || 0; const bDP = parseInt(pObj.dpBack) || 0; const wpn = safeArmory.find(w => String(w.id) === String(pObj.weaponId || 'w01')) || safeArmory[0]; let isSynergy = fDP >= (wpn.reqF||0) && sDP >= (wpn.reqS||0) && bDP >= (wpn.reqB||0); let trueFlank = isFlanking || (effectiveAoe !== undefined && effectiveAoe !== 0 && effectiveAoe !== '0');
                    if (entStates.includes('Evasive')) { if (pObj.usedEvade) { mitigation = 0; mitName = "Evade [EXHAUSTED]"; } else { mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0); mitName = "Forced Evasion"; } } else if (trueFlank) { if (pObj.usedEvade) { mitigation = 0; mitName = "Flanked [EXHAUSTED]"; } else { mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0); mitName = "Backline Evasion"; } } else { if (pObj.usedParry) { mitigation = 0; mitName = "Parry [EXHAUSTED]"; } else { mitigation = fDP + (wpn.baseDmg||0) + (isSynergy ? (wpn.bonusFront||0) : 0); mitName = "Front Parry"; } }
                    finalDmg = Math.max(0, incomingDmg - mitigation);
                } else if (isEnemy) { const e = safeArray(safeEnc?.enemies).find(en => en && String(en.uid) === String(t.refId)); if (e) { let barriers = safeArray(e.currentBarriers).reduce((a,b) => a+b, 0); if (barriers > 0) { mitigation = barriers; mitName = "Barriers"; } finalDmg = Math.max(0, incomingDmg - barriers); } } else if (t.type === 'echo') { finalDmg = Math.max(0, incomingDmg); }
            } else if (payloadType === 'heal') { finalDmg = Math.ceil(rawDmg * rpsMult); } else if (payloadType === 'battery') { finalDmg = rawDmg; }

            const { x, y } = getHexCoords(t.pos); const isImprovised = activeAction.isImprovised;
            return (
                <div key={`preview-${t.id}`} className="absolute z-[120] bg-black/95 border border-[#00f0ff] p-2 flex flex-col text-[10px] w-48 shadow-[0_0_15px_rgba(0,240,255,0.4)] pointer-events-none transition-all duration-200" style={{ left: `${x + hexWidth + 5}px`, top: `${y - 10}px` }}>
                    <div className="text-[#00f0ff] font-bold border-b border-gray-700 pb-1 mb-1 uppercase flex justify-between"><span>Target Math</span><span>{t.type === 'player' ? String(pObj?.name || 'Agent') : (t.type === 'echo' ? 'Construct' : 'Hostile')}</span></div>
                    {isImprovised ? ( <div className="text-orange-400 font-bold text-center py-2 animate-pulse">⚠ IMPROVISED (1d6) ⚠<br/>Math Unknown</div> ) : (
                        <>
                            <div className="flex justify-between"><span>Base {payloadType === 'heal' ? 'Heal' : payloadType === 'battery' ? 'Energize' : 'Dmg'}:</span><span>{rawDmg}</span></div>
                            {payloadType === 'damage' && (
                                <>
                                    {rpsMult !== 1.0 && <div className="flex justify-between text-yellow-400"><span>Affinity:</span><span>x{rpsMult}</span></div>}
                                    {isFlanking && <div className="flex justify-between text-red-400"><span>Flanking:</span><span>x1.5</span></div>}
                                    {reactionBonus > 0 && <div className="flex justify-between text-orange-400"><span>Reaction:</span><span>+{reactionBonus}</span></div>}
                                    {entStates.includes('Vulnerable') && <div className="flex justify-between text-pink-400"><span>Vulnerable:</span><span>x1.5</span></div>}
                                    {entStates.includes('Shielded') && <div className="flex justify-between text-blue-400"><span>Shielded:</span><span>-5</span></div>}
                                    {entStates.includes('Invulnerable') && <div className="flex justify-between text-yellow-300"><span>Invulnerable:</span><span>BLOCKED</span></div>}
                                    {mitName && <div className="flex justify-between text-gray-400"><span>{mitName}:</span><span>-{mitigation}</span></div>}
                                </>
                            )}
                            {payloadType === 'heal' && rpsMult !== 1.0 && <div className="flex justify-between text-yellow-400"><span>Affinity:</span><span>x{rpsMult}</span></div>}
                            <div className="border-t border-gray-700 mt-1 pt-1 flex justify-between font-bold text-white text-xs"><span>{payloadType === 'damage' ? 'EXPECTED:' : payloadType === 'heal' ? 'RECOVERY:' : 'TRANSFER:'}</span><span className={payloadType === 'damage' ? (finalDmg === 'FATAL' || finalDmg > 0 ? 'text-red-500' : 'text-gray-500') : payloadType === 'heal' ? 'text-[#22c55e]' : 'text-[#00f0ff]'}>{finalDmg} {payloadType === 'damage' ? 'DMG' : payloadType === 'heal' ? 'HP' : 'RES'}</span></div>
                            {activeAction.effectName && <div className="text-purple-400 mt-1">Applies: [{String(activeAction.effectName)}]</div>}
                            {activeAction.m > 0 && <div className="text-blue-400 mt-0.5">Mobility: {String(activeAction.coreMobility)} {activeAction.m}</div>}
                        </>
                    )}
                </div>
            );
        });
    };

    const renderHexBackgrounds = () => {
        let originToken = null; let minR = 1; let maxR = 1;
        if (activeAction) {
            const tIdx = findActiveTokenIndex(activeAction, activeTokens); if (tIdx !== -1) originToken = activeTokens[tIdx];
            if (activeAction.type === 'move' || activeAction.type === 'blink') { minR = 1; maxR = 1; } 
            else if (activeAction.range) { const parts = String(activeAction.range).split('-'); if (parts.length === 2) { minR = parseInt(parts[0]); maxR = parseInt(parts[1]); } else { minR = 0; maxR = parseInt(parts[0]); } }
        }
        
        const effectiveAoe = (activeAction && activeAction.isEcho && !activeAction.isEchoSpellCast) ? 0 : (activeAction ? activeAction.a : 0);
        const aoeHexes = activeAction ? getAoEHexes(hoveredHex !== null ? hoveredHex : -1, originToken ? originToken.pos : null, effectiveAoe, aoeRotation, activeGrid) : [];
        let validTargetsMap = new Set(); let validMoveMap = new Set(); let showTargetMask = false;
        
        if (activeAction && originToken) {
            if (activeAction.type === 'target') {
                showTargetMask = true;
                activeGrid.forEach((c, idx) => { const dist = getHexDistance(originToken.pos, idx); if (dist >= minR && dist <= maxR && c.terrain !== 'severe' && c.terrain !== 'steam' && checkLineOfSight(originToken.pos, idx, activeGrid)) validTargetsMap.add(idx); });
            } else if (activeAction.type === 'move' || activeAction.type === 'blink') {
                showTargetMask = true;
                activeGrid.forEach((c, idx) => {
                    const dist = getHexDistance(originToken.pos, idx);
                    if (activeAction.type === 'move') { if (safeEnc?.round === 0) { const targetRow = Math.floor(idx / COLS); if (originToken.type === 'player' && targetRow >= 5) validMoveMap.add(idx); if (originToken.type === 'enemy' && targetRow < 5) validMoveMap.add(idx); } else if (reachableCache.has(idx)) validMoveMap.add(idx); } 
                    else if (activeAction.type === 'blink') { if (dist > 0 && dist <= safeInt(activeAction.m || 1) && c.terrain !== 'severe') validMoveMap.add(idx); }
                });
            }
        }

        return activeGrid.map((cell, idx) => {
            if (!cell) return null; const { x, y } = getHexCoords(idx); const row = Math.floor(idx / COLS);
            let bgColor = '#1e293b'; let hexBorder = '1px solid rgba(255,255,255,0.05)'; let hexZ = 1;
            
            if (safeEnc?.round === 0) { if (row < 5) { bgColor = 'rgba(255, 102, 0, 0.08)'; hexBorder = '1px dashed rgba(255, 102, 0, 0.2)'; } else { bgColor = 'rgba(0, 240, 255, 0.08)'; hexBorder = '1px dashed rgba(0, 240, 255, 0.2)'; } }
            if (cell.terrain === 'minor') bgColor = 'rgba(234, 179, 8, 0.4)'; if (cell.terrain === 'major') bgColor = 'rgba(168, 85, 247, 0.4)'; if (cell.terrain === 'severe') bgColor = 'rgba(59, 130, 246, 0.4)'; 

            let isTargetable = false; let isMovable = false; let isAoETarget = false; let isBlockedByLoS = false; let isDimmedByMask = false;

            if (activeAction) {
                if (activeAction.type === 'move' || activeAction.type === 'blink') { if (validMoveMap.has(idx)) isMovable = true; else isDimmedByMask = true; } 
                else if (activeAction.type === 'target') { if (validTargetsMap.has(idx)) isTargetable = true; else isDimmedByMask = true; if (hoveredHex !== null && aoeHexes.includes(idx)) { isAoETarget = true; isDimmedByMask = false; } if (!isTargetable && !isAoETarget) isBlockedByLoS = true; }
            }

            if (isAoETarget) { bgColor = 'rgba(255, 0, 0, 0.6)'; hexBorder = '2px solid #ff0000'; hexZ = 10; } else if (isTargetable) { bgColor = 'rgba(255, 102, 0, 0.3)'; hexBorder = '2px dashed rgba(255, 102, 0, 0.8)'; hexZ = 5; } else if (isMovable) { bgColor = 'rgba(34, 197, 94, 0.35)'; hexBorder = '2px dashed rgba(34, 197, 94, 0.8)'; hexZ = 5; } else if (showTargetMask && isDimmedByMask) { bgColor = 'rgba(0,0,0,0.85)'; hexBorder = '1px solid rgba(255,255,255,0.05)'; }

            return (
                <div key={`bg-${idx}`} onClick={() => handleHexClick(idx)} onMouseEnter={() => setHoveredHex(idx)} onMouseLeave={() => setHoveredHex(null)} onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleHexDrop(e, idx)} className="absolute transition-all duration-150" style={{ zIndex: hexZ, left: `${x}px`, top: `${y}px`, width: `${hexWidth}px`, height: `${hexHeight}px`, backgroundColor: bgColor, border: hexBorder, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', transform: 'scale(0.95)', cursor: activeAction && activeAction.type !== 'hijack_select' ? 'crosshair' : 'pointer' }}>
                    {isBlockedByLoS && !isAoETarget && showTargetMask && <div className="absolute inset-0 flex items-center justify-center text-red-500 opacity-20 text-[10px]">✕</div>}
                    {cell.terrainElement && !isBlockedByLoS && (
                        <div className="absolute bottom-2 w-full text-center pointer-events-none opacity-80">
                            <span className="text-[7px] font-bold uppercase tracking-widest px-1 bg-black/80 rounded" style={{ color: ELEMENT_COLORS[cell.terrainElement] || '#ffffff', border: `1px solid ${ELEMENT_COLORS[cell.terrainElement] || '#ffffff'}` }}>
                                {cell.terrainElement}
                            </span>
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderTokens = () => {
        const hexGroups = {}; activeTokens.forEach(t => { if (t && t.pos !== undefined && t.pos !== null) { if (!hexGroups[t.pos]) hexGroups[t.pos] = []; hexGroups[t.pos].push(t); } });
        return activeTokens.map(t => {
            if (!t || t.pos === undefined || t.pos === null || t.pos < 0 || t.pos >= 150) return null;
            const { x, y } = getHexCoords(t.pos); const orderInHex = hexGroups[t.pos] ? hexGroups[t.pos].findIndex(tok => tok && String(tok.id) === String(t.id)) : 0; const offsetX = orderInHex > 0 ? orderInHex * 10 : 0; const offsetY = orderInHex > 0 ? orderInHex * 10 : 0;
            let displayChar = t.type === 'enemy' ? 'E' : (t.type === 'echo' ? '✧' : 'P'); let tBg = t.type === 'enemy' ? '#ff6600' : (t.type === 'echo' ? '#a855f7' : '#00f0ff'); let txtColor = t.type === 'echo' ? '#ffffff' : '#000000';
            if (t.type === 'player') { const p = safePlayers[t.refId] || {}; if (p.name) displayChar = String(p.name).substring(0, 2).toUpperCase(); } else if (t.type === 'enemy') { const e = activeEnemies.find(en => en && String(en.uid) === String(t.refId)); if (e && e.name) displayChar = String(e.name).substring(0, 2).toUpperCase(); }
            const showHoverControls = selectedToken === t.id && (isGM || (t.type === 'player' && String(t.refId) === String(localId))); const isAct = safeEnc?.activeTokenId === String(t.id); const tokZ = isAct ? 50 : (selectedToken === t.id ? 40 : 30);
            return (
                <div key={`tok-${t.id}`} draggable={safeEnc?.round === 0 && t.type !== 'echo'} onDragStart={(e) => { if(e) { e.stopPropagation(); e.dataTransfer.setData('text/plain', JSON.stringify({ action: 'moveToken', tokenId: t.id })); } }} className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold shadow-lg cursor-pointer transition-transform hover:scale-110 ${isAct ? 'ring-4 ring-white' : ''}`} onClick={(e) => { e.stopPropagation(); if (activeAction) { if (!authorizeActionExecution()) return; if (activeAction.type === 'move') return executeMove(t.pos); if (activeAction.type === 'blink') return executeBlink(t.pos); if (activeAction.type === 'target') return resolveCombat(t.pos); } setSelectedToken(selectedToken === t.id ? null : t.id); }} style={{ zIndex: tokZ, backgroundColor: tBg, color: txtColor, left: `${x + (hexWidth / 2 - 20) + offsetX}px`, top: `${y + (hexHeight / 2 - 20) + offsetY}px`, border: t.type === 'echo' ? '2px solid white' : 'none' }}>
                    <div className="absolute inset-0 pointer-events-none transition-transform duration-300" style={{ transform: `rotate(${(t.facing || 0) * 60}deg)` }}><div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-black absolute top-1 left-1/2 -translate-x-1/2"></div></div>
                    <span className="text-[11px] z-10 relative">{displayChar}</span>
                    {showHoverControls && ( <div className="absolute -bottom-14 flex gap-1 bg-black/90 p-1 border border-gray-600 rounded shadow-lg pointer-events-auto" style={{ zIndex: 50 }}> <button className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white hover:text-blue-600" onClick={(e) => rotateToken(e, t.id, -1)} title="Rotate Left">↶</button> <button className="bg-[#22c55e] text-black w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white" onClick={(e) => { e.stopPropagation(); primeTokenMove(t); }} title="Move Token">M</button> <button className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white hover:text-blue-600" onClick={(e) => rotateToken(e, t.id, 1)} title="Rotate Right">↷</button> {isGM && <button className="bg-red-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white hover:text-red-600 ml-1" onClick={(e) => deleteToken(e, t.id)} title="Delete Token">✕</button>} </div> )}
                </div>
            );
        });
    };

    const renderTokenLabels = () => {
        const hexGroups = {}; activeTokens.forEach(t => { if (t && t.pos !== undefined && t.pos !== null) { if (!hexGroups[t.pos]) hexGroups[t.pos] = []; hexGroups[t.pos].push(t); } });
        return activeTokens.map((t) => {
            if (!t || t.pos === undefined || t.pos === null || t.pos < 0 || t.pos >= 150) return null;
            const { x, y } = getHexCoords(t.pos); const orderInHex = hexGroups[t.pos] ? hexGroups[t.pos].findIndex(tok => tok && String(tok.id) === String(t.id)) : 0; const baseOffsetX = orderInHex > 0 ? orderInHex * 10 : 0; const baseOffsetY = orderInHex > 0 ? orderInHex * 10 : 0; const labelFanOffsetY = orderInHex > 0 ? (orderInHex * -42) : 0;
            let hpDisplay = null; let tBg = '#ff6600'; let activeStatusList = []; let isInactive = false;
            const isHovered = hoveredHex === t.pos;

            if (t.type === 'enemy') {
                const linkedEnemy = safeArray(safeEnc?.enemies).find(e => e && String(e.uid) === String(t.refId));
                if (linkedEnemy) { activeStatusList = safeArray(linkedEnemy.statuses); let maxRange = 1; if (!linkedEnemy.isActive) isInactive = true; safeArray(linkedEnemy.abilities).forEach(ability => { const ab = normalizeAbility(ability); if (ab.range) { const parts = String(ab.range).split('-'); const r = parts.length === 2 ? parseInt(parts[1]) : parseInt(parts[0]); if (!isNaN(r) && r > maxRange) maxRange = r; } }); tBg = '#ff6600'; hpDisplay = ( <div className={`bg-black/95 text-[10px] font-bold px-2 py-1 border rounded flex flex-col items-center leading-none shadow-lg whitespace-nowrap ${isInactive ? 'opacity-40 grayscale' : ''}`} style={{ borderColor: '#ff6600', color: '#ff6600' }}> <span className="text-white mb-0.5">{String(linkedEnemy.name || 'Hostile')}</span> <span>T{linkedEnemy.tier || 1} | {String(linkedEnemy.affinity || 'Kinetic')} | RNG {maxRange} | {linkedEnemy.currentHp}/{linkedEnemy.maxHp || linkedEnemy.currentHp} HP</span> </div> ); }
            } else if (t.type === 'player') {
                const p = safePlayers[t.refId] || {}; activeStatusList = safeArray(p.statuses); const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0; let pClass = "Rookie"; if (fDP >= 10) pClass = "Vanguard"; else if (sDP >= 10) pClass = "Conduit"; else if (bDP >= 10) pClass = "Sniper"; else if (fDP >= 5 && sDP >= 5) pClass = "Paladin"; else if (fDP >= 5 && bDP >= 5) pClass = "Skirmisher"; else if (sDP >= 5 && bDP >= 5) pClass = "Saboteur"; const derivedMaxHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1); tBg = CLASS_COLORS[pClass] || '#00f0ff'; const wpn = safeArmory.find(w => String(w.id) === String(p.weaponId || 'w01')) || safeArmory[0]; const wpnRange = wpn?.range || '1-3'; hpDisplay = ( <div className="bg-black/95 text-[10px] font-bold px-2 py-1 border rounded flex flex-col items-center leading-none shadow-lg whitespace-nowrap" style={{ borderColor: tBg, color: tBg }}> <span className="text-white mb-0.5">{String(p.name || 'Agent')}</span> <span>{pClass} | {String(p.affinity || 'Kinetic')} | RNG {wpnRange} | {p.currentHp ?? derivedMaxHp}/{derivedMaxHp} HP | {p.resPool ?? 3} RES</span> </div> );
            } else if (t.type === 'echo') {
                tBg = '#a855f7';
                hpDisplay = ( <div className="bg-black/95 text-[10px] font-bold px-2 py-1 border rounded flex flex-col items-center leading-none shadow-lg whitespace-nowrap" style={{ borderColor: tBg, color: tBg }}> <span className="text-white mb-0.5">Tactical Echo</span> <span>{t.currentHp}/10 HP | Spell: {t.spell?.name || 'Action'}</span> </div> );
            }
            
            if (!hpDisplay) return null;
            return ( <div key={`label-${t.id}`} className={`absolute pointer-events-none flex flex-col items-center transition-opacity duration-300 ${isHovered ? 'opacity-20' : 'opacity-100'}`} style={{ zIndex: 100, left: `${x + (hexWidth / 2) + baseOffsetX}px`, top: `${y + (hexHeight / 2) - 30 + baseOffsetY + labelFanOffsetY}px`, transform: 'translate(-50%, -100%)' }}> {hpDisplay} {activeStatusList.length > 0 && !isInactive && ( <div className="mt-1 flex gap-1 flex-wrap justify-center"> {activeStatusList.map((st, i) => ( <span key={i} className="bg-purple-900 text-white text-[8px] font-bold px-1 py-0.5 border border-purple-500 shadow-md whitespace-nowrap">{String(st)}</span> ))} </div> )} </div> );
        });
    };

    const renderSidebar = () => {
        const isMyTurn = safeEnc?.activeTurn === 'player' || safeEnc?.round === 0;

        if (selectedToken !== null) {
            const activeT = activeTokens.find(t => t && t.id === selectedToken);
            if (!activeT) return null;
            const isThisActiveToken = safeEnc.activeTokenId === String(activeT.id);
            const amIOwner = String(activeT.refId) === String(localId);

            if (activeT.type === 'echo') {
                const pObj = safePlayers[activeT.refId] || {};
                return (
                    <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-[#a855f7] font-mono flex flex-col gap-3 shrink-0 h-full overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2"> <span className="text-[#a855f7] font-bold tracking-widest uppercase">Tactical Echo</span> <button className="text-gray-400 hover:text-white" onClick={() => setSelectedToken(null)}>✕</button> </div>
                        <div className="text-white text-lg font-bold uppercase">Echo of {pObj.name || 'Agent'}</div>
                        <div className="bg-black border border-gray-700 p-2 text-center font-bold text-[#a855f7]"> <div className="text-gray-500 text-[10px] uppercase">Hit Points</div> <div className="flex items-center justify-center gap-2"> {isGM && <button className="text-gray-400 hover:text-white px-2 text-xl" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newT = deepClone(safeArray(s.tokens)); const tIdx = newT.findIndex(tok => tok && tok.id === activeT.id); if (tIdx !== -1) newT[tIdx].currentHp = Math.max(0, newT[tIdx].currentHp - 1); return { ...s, tokens: newT }; }) }}>-</button>} <div className="text-2xl text-white">{activeT.currentHp}</div> {isGM && <button className="text-gray-400 hover:text-white px-2 text-xl" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newT = deepClone(safeArray(s.tokens)); const tIdx = newT.findIndex(tok => tok && tok.id === activeT.id); if (tIdx !== -1) newT[tIdx].currentHp += 1; return { ...s, tokens: newT }; }) }}>+</button>} </div> </div>
                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Loaded Spell</div>
                        <div className="bg-black border border-[#a855f7] p-2 text-xs relative flex flex-col">
                            <div className="font-bold text-[#a855f7] truncate">{activeT.spell?.name || 'Action'}</div>
                            <div className="text-white font-bold mb-1 mt-1 text-[10px]">Cost: -{activeT.spell?.cost || 0} Res (From Owner)</div>
                            <button className={`mt-2 w-full font-bold py-2 uppercase transition-colors ${!isMyTurn && !isGM ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-[#a855f7] text-black hover:bg-white'}`} disabled={!isMyTurn && !isGM} onClick={() => primeCard({...activeT.spell, name: `[Echo] ${activeT.spell.name}`}, false, activeT.spell.cost, activeT)}> COMMAND ECHO: CAST </button>
                        </div>
                        {(isGM || amIOwner) && ( <button className="w-full font-bold py-2 mt-4 uppercase text-xs border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors" onClick={(e) => deleteToken(e, activeT.id)}> Deconstruct Echo </button> )}
                    </div>
                );
            }

            if (activeT.type === 'player') {
                const p = safePlayers[activeT.refId] || {}; const activeWeapon = safeArmory.find(w => String(w.id) === String(p.weaponId || 'w01')) || safeArmory[0];
                const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                let pClass = "Rookie"; if (fDP >= 10) pClass = "Vanguard"; else if (sDP >= 10) pClass = "Conduit"; else if (bDP >= 10) pClass = "Sniper"; else if (fDP >= 5 && sDP >= 5) pClass = "Paladin"; else if (fDP >= 5 && bDP >= 5) pClass = "Skirmisher"; else if (sDP >= 5 && bDP >= 5) pClass = "Saboteur"; 
                const pColor = CLASS_COLORS[pClass] || '#00f0ff'; let isSynergy = fDP >= (activeWeapon.reqF||0) && sDP >= (activeWeapon.reqS||0) && bDP >= (activeWeapon.reqB||0);
                const calcBaseDmg = fDP + (activeWeapon.baseDmg || 0) + (isSynergy ? (activeWeapon.bonusDmg || 0) : 0); const derivedMaxHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1);
                const activeCoreStates = safeArray(p.statuses).map(st => getCoreState(st));
                const isStunned = activeCoreStates.includes('Stunned'); const isShocked = activeCoreStates.includes('Shocked'); const isImmobilized = activeCoreStates.includes('Immobilized'); const isBlind = activeCoreStates.includes('Blind');
                const disableMovement = isStunned || isImmobilized || (!isGM && !isThisActiveToken); const disableAttacks = isStunned || (!isGM && !isThisActiveToken);
                
                return (
                    <div className="w-full md:w-64 bg-[#1a222c] p-4 border font-mono flex flex-col gap-3 shrink-0 h-full overflow-y-auto" style={{ borderColor: pColor }}>
                        {isThisActiveToken && (isGM || amIOwner) && safeEnc.round > 0 && ( <button className="w-full bg-[#22c55e] text-black font-bold py-3 text-sm uppercase tracking-widest hover:bg-white transition-colors border-2 border-[#22c55e] animate-pulse mb-2" onClick={(e) => { e.stopPropagation(); advanceTurn(); }}> End Turn </button> )}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2"><span className="font-bold tracking-widest uppercase" style={{ color: pColor }}>Player Uplink</span><button className="text-gray-400 hover:text-white" onClick={() => setSelectedToken(null)}>✕</button></div>
                        <div className="text-white text-xl font-bold uppercase flex justify-between items-center">{String(p.name || 'Agent')}<span className="text-[10px] px-2 py-0.5 bg-black border font-bold" style={{ borderColor: pColor, color: pColor }}>{pClass}</span></div>
                        
                        <div className="bg-black border border-gray-700 p-2 text-center font-bold flex flex-col gap-2" style={{ color: pColor }}>
                            <div className="flex items-center justify-between"> <div className="text-gray-500 text-[10px] uppercase">Hit Points</div> <div className="flex items-center gap-1"> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const pClone = deepClone(s.players || {}); if (pClone[activeT.refId]) pClone[activeT.refId].currentHp = Math.max(0, (pClone[activeT.refId].currentHp ?? derivedMaxHp) - 1); return { ...s, players: pClone }; }) }}>-</button>} <div className="text-xl" style={{ color: pColor }}>{p.currentHp ?? derivedMaxHp} <span className="text-gray-600 text-sm">/</span> <span className="text-sm text-gray-500">{derivedMaxHp}</span></div> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const pClone = deepClone(s.players || {}); if (pClone[activeT.refId]) pClone[activeT.refId].currentHp = (pClone[activeT.refId].currentHp ?? derivedMaxHp) + 1; return { ...s, players: pClone }; }) }}>+</button>} </div> </div>
                            <div className="w-full h-px bg-gray-700"></div>
                            <div className="flex items-center justify-between"> <div className="text-gray-500 text-[10px] uppercase" title="Remaining / Speed">Move Pts</div> <div className="flex items-center gap-1"> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newT = deepClone(safeArray(s.tokens)); const tIdx = newT.findIndex(tok => tok && tok.id === activeT.id); if (tIdx !== -1) newT[tIdx].movementRemaining = Math.max(0, (newT[tIdx].movementRemaining ?? 3) - 1); return { ...s, tokens: newT }; }) }}>-</button>} <div className="text-xl" style={{ color: pColor }}>{activeT.movementRemaining ?? activeT.speed ?? 3} <span className="text-gray-600 text-sm">/</span> <span className="text-sm text-gray-500">{activeT.speed ?? 3}</span></div> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newT = deepClone(safeArray(s.tokens)); const tIdx = newT.findIndex(tok => tok && tok.id === activeT.id); if (tIdx !== -1) newT[tIdx].movementRemaining = (newT[tIdx].movementRemaining ?? 3) + 1; return { ...s, tokens: newT }; }) }}>+</button>} </div> </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 p-2 mt-1">
                            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Active States</div>
                            <div className="flex flex-wrap gap-1 mb-2"> {safeArray(p.statuses).length === 0 && <span className="text-xs text-gray-600">None.</span>} {safeArray(p.statuses).map((st, i) => ( <span key={i} title={STATE_DESCRIPTIONS[getCoreState(st)] || 'Active Status Check'} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1 cursor-help">{String(st)} {(isGM) && ( <button className="text-red-400 hover:text-white" onClick={() => pushUpdate(state => { const pClone = deepClone(state.players || {}); if (pClone[activeT.refId] && pClone[activeT.refId].statuses) pClone[activeT.refId].statuses.splice(i, 1); return { ...state, players: pClone }; })}>✕</button> )}</span> ))} </div>
                            {(isGM) && ( <div className="flex gap-1"> <select id="pState" className="flex-1 bg-black border border-gray-600 text-white text-xs p-1 outline-none"> <option value="">-- Add State --</option> {Object.keys(STATE_DESCRIPTIONS).map(st => <option key={st} value={st}>{st}</option>)} </select> <button className="bg-purple-600 text-white px-2 font-bold text-xs hover:bg-purple-500" onClick={() => { const el = document.getElementById('pState'); const val = el ? el.value : ''; if (val) { pushUpdate(state => { const pClone = deepClone(state.players || {}); if (pClone[activeT.refId]) { pClone[activeT.refId].statuses = [...safeArray(pClone[activeT.refId].statuses), val]; } return { ...state, players: pClone }; }); if (el) el.value = ''; } }}>+</button> </div> )}
                        </div>

                        {(isGM || amIOwner) && (
                            <div className="flex gap-2 mt-2">
                                <button className={`flex-1 font-bold py-1 uppercase text-xs transition-colors ${(disableMovement || !isMyTurn) && !isGM ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#22c55e] text-black hover:bg-white'}`} disabled={(disableMovement || !isMyTurn) && !isGM} onClick={() => primeTokenMove(activeT)}>Move</button>
                                <button className={`flex-1 font-bold py-1 uppercase text-[10px] border transition-colors ${(p.usedBasicAttack || disableAttacks || !isSynergy) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-white hover:text-black'}`} style={{ borderColor: (p.usedBasicAttack || disableAttacks || !isSynergy) ? 'gray' : pColor }} disabled={(p.usedBasicAttack || disableAttacks || !isSynergy)} onClick={() => {
                                    if (!isGM && !isThisActiveToken) return alert("System Locked: It is not your turn."); if (!isGM && disableAttacks) return alert("System Locked: Agent is STUNNED."); if (!isGM && p.usedBasicAttack) return alert("System Locked: Basic attack already executed this turn."); if (!isGM && !isSynergy) return alert("System Locked: DP Requirements not met for equipped weapon.");
                                    let finalRange = isBlind ? '1' : (activeWeapon.range || '1'); if (isBlind && !isGM) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes.");
                                    pushUpdate(s => ({ ...s, activeAction: { type: 'target', isBasic: true, isImprovised: false, originalCost: 0, m: 0, coreMobility: '', effectName: '', terrain: '', desc: '', a: 0, u: 0, source: String(p.name || 'Player'), sourceId: String(activeT.refId), isEnemy: false, name: String(activeWeapon.name || 'Weapon Attack'), payload: 'damage', d: safeInt(calcBaseDmg), range: String(finalRange), elementRaw: String(activeWeapon.element || 'Kinetic'), elementCore: String(getCoreElement(activeWeapon.element || 'Kinetic')), effectCore: '', cost: 0, isEcho: false } }))
                                }}>{(!isSynergy && !isGM) ? 'DP REQ FAILED' : (disableAttacks) ? 'LOCKED' : (p.usedBasicAttack ? 'EXHAUSTED' : 'BASIC ATTACK')}</button>
                            </div>
                        )}
                        
                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Active Custom Cards</div>
                        {safeArray(p.customCards).length === 0 ? <div className="text-gray-600 text-xs">No cards loaded in HUD.</div> : null}
                        {safeArray(p.customCards).map(c => {
                            if (!c) return null; const dispRaw = c.elementRaw || c.element || 'Kinetic'; const dispCore = c.elementCore || getCoreElement(c.elementRaw || 'Kinetic'); const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore; const cardCost = parseInt(c.cost) || 0; const isNoFuel = (p.resPool ?? 3) < cardCost; const coreMob = getCoreMobility(c.mobilityName || c.mobility || ''); const isBlink = safeInt(c.m) > 0 && coreMob === 'Blink';
                            return (
                                <div key={c.id || Math.random()} className="bg-black border border-[#00f0ff] p-2 text-xs relative group flex flex-col">
                                    <div className="flex-1 pr-6 pb-2">
                                        <div className="font-bold text-[#00f0ff] truncate">{String(c.name || 'Custom Action')}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-800 pb-1 truncate" title={showType}>Type: {showType}</div>
                                        <div className="text-white font-bold mb-1 mt-1 text-[10px]">Cost: -{cardCost} Res</div>
                                        {c.payload === 'heal' && <div className="text-[#22c55e] text-[10px] font-bold mt-1">Restorative</div>} {c.payload === 'battery' && <div className="text-[#00f0ff] text-[10px] font-bold mt-1">Energize</div>} {c.isEcho && <div className="text-[#a855f7] text-[10px] font-bold mt-1">Tactical Echo</div>} {c.effectName && <div title={STATE_DESCRIPTIONS[getCoreState(c.effectName)] || 'Active Status Check'} className="absolute top-2 right-2 text-purple-400 text-[10px] font-bold cursor-help">[{String(c.effectName)}]</div>} {c.terrain && <div className="text-yellow-500 text-[10px] font-bold mt-1">Terrain: [{String(c.terrain).toUpperCase()}]</div>} {safeInt(c.m) > 0 && <div className="text-blue-400 text-[10px] font-bold mt-1">Mobility: {safeInt(c.m)} [{coreMob.toUpperCase()}]</div>}
                                        <button className={`mt-auto w-full font-bold py-1 uppercase transition-colors ${(isNoFuel || disableAttacks) ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-white hover:text-black'}`} disabled={isNoFuel || disableAttacks} onClick={() => primeCard(c, false, 0, activeT)}>{disableAttacks ? 'LOCKED' : (isNoFuel ? 'NO FUEL' : (isBlink ? 'BLINK / DASH' : 'TARGET SKILL'))}</button>
                                    </div>
                                    <button className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-gray-900 border-l border-b border-gray-700 text-gray-400 hover:text-white hover:bg-red-800 transition-colors" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const pClone = deepClone(s.players || {}); if (pClone[activeT.refId]) pClone[activeT.refId].customCards = safeArray(pClone[activeT.refId].customCards).filter(item => item && String(item.id) !== String(c.id)); return { ...s, players: pClone }; }); }}>✕</button>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            if (activeT.type === 'enemy') {
                const linkedEnemy = safeArray(safeEnc?.enemies).find(e => e && String(e.uid) === String(activeT.refId));
                if (!linkedEnemy) return <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-red-500 font-mono text-red-500">Unlinked Enemy Token</div>;

                const eCoreStates = safeArray(linkedEnemy.statuses).map(st => getCoreState(st));
                const isThisActiveToken = safeEnc.activeTokenId === String(activeT.id);
                const disableMovement = eCoreStates.includes('Stunned') || eCoreStates.includes('Immobilized') || (!isGM && !isThisActiveToken);
                const disableAttacks = eCoreStates.includes('Stunned') || (!isGM && !isThisActiveToken);
                const isBlind = eCoreStates.includes('Blind');

                return (
                    <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-[#ff6600] font-mono flex flex-col gap-3 shrink-0 h-full overflow-y-auto">
                        {isThisActiveToken && isGM && safeEnc.round > 0 && ( <button className="w-full bg-[#ff6600] text-black font-bold py-3 text-sm uppercase tracking-widest hover:bg-white transition-colors border-2 border-[#ff6600] animate-pulse mb-2" onClick={(e) => { e.stopPropagation(); advanceTurn(); }}> End Turn </button> )}
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2"><span className="text-[#ff6600] font-bold tracking-widest uppercase">Hostile Bio-Scan</span><button className="text-gray-400 hover:text-white" onClick={() => setSelectedToken(null)}>✕</button></div>
                        <div className="text-white text-lg font-bold uppercase">{String(linkedEnemy.name || 'Enemy')}</div>
                        
                        <div className="bg-black border border-gray-700 p-2 text-center font-bold flex flex-col gap-2 text-[#ff6600]">
                            <div className="flex items-center justify-between"> <div className="text-gray-500 text-[10px] uppercase">Hit Points</div> <div className="flex items-center gap-1"> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); const eIdx = newE.findIndex(en => en && String(en.uid) === String(activeT.refId)); if (eIdx !== -1) newE[eIdx].currentHp = Math.max(0, newE[eIdx].currentHp - 1); return { ...s, encounter: { ...s.encounter, enemies: newE }}; }) }}>-</button>} <div className="text-xl text-white">{linkedEnemy.currentHp}</div> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); const eIdx = newE.findIndex(en => en && String(en.uid) === String(activeT.refId)); if (eIdx !== -1) newE[eIdx].currentHp += 1; return { ...s, encounter: { ...s.encounter, enemies: newE }}; }) }}>+</button>} </div> </div>
                            <div className="w-full h-px bg-gray-700"></div>
                            <div className="flex items-center justify-between"> <div className="text-gray-500 text-[10px] uppercase" title="Remaining / Speed">Move Pts</div> <div className="flex items-center gap-1"> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newT = deepClone(safeArray(s.tokens)); const tIdx = newT.findIndex(tok => tok && tok.id === activeT.id); if (tIdx !== -1) newT[tIdx].movementRemaining = Math.max(0, (newT[tIdx].movementRemaining ?? 3) - 1); return { ...s, tokens: newT }; }) }}>-</button>} <div className="text-xl text-[#ff6600]">{activeT.movementRemaining ?? activeT.speed ?? 3} <span className="text-gray-600 text-sm">/</span> <span className="text-sm text-gray-500">{activeT.speed ?? 3}</span></div> {isGM && <button className="text-gray-400 hover:text-white px-2" onClick={(e) => { e.stopPropagation(); pushUpdate(s => { const newT = deepClone(safeArray(s.tokens)); const tIdx = newT.findIndex(tok => tok && tok.id === activeT.id); if (tIdx !== -1) newT[tIdx].movementRemaining = (newT[tIdx].movementRemaining ?? 3) + 1; return { ...s, tokens: newT }; }) }}>+</button>} </div> </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 p-2 mt-1">
                            <div className="flex justify-between items-center mb-1"><span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Active States</span>{linkedEnemy.affinity && <span className="text-[#ff6600] text-[10px] font-bold uppercase border border-[#ff6600] px-1">Type: {String(linkedEnemy.affinity)}</span>}</div>
                            <div className="flex flex-wrap gap-1 mb-2"> {safeArray(linkedEnemy.statuses).length === 0 && <span className="text-xs text-gray-600">None.</span>} {safeArray(linkedEnemy.statuses).map((st, i) => ( <span key={i} title={STATE_DESCRIPTIONS[getCoreState(st)] || 'Active Status Check'} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1 cursor-help">{String(st)} {isGM && ( <button className="text-red-400 hover:text-white" onClick={() => pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); const eIdx = newE.findIndex(en => en && String(en.uid) === String(linkedEnemy.uid)); if (eIdx !== -1) { newE[eIdx].statuses = safeArray(newE[eIdx].statuses); newE[eIdx].statuses.splice(i, 1); } return { ...s, encounter: { ...s.encounter, enemies: newE } }; })}>✕</button> )}</span> ))} </div>
                            {isGM && ( <div className="flex gap-1"> <select id="eState" className="flex-1 bg-black border border-gray-600 text-white text-[10px] p-1 outline-none"> <option value="">-- Add State --</option> {Object.keys(STATE_DESCRIPTIONS).map(st => <option key={st} value={st}>{st}</option>)} </select> <button className="bg-gray-800 text-white px-2 text-[10px] font-bold border border-gray-600 hover:bg-[#00f0ff] hover:text-black transition-colors" onClick={() => { const el = document.getElementById('eState'); const val = el ? el.value : ''; if (val) { pushUpdate(s => { const newE = deepClone(safeArray(s.encounter?.enemies)); const eIdx = newE.findIndex(en => en && String(en.uid) === String(linkedEnemy.uid)); if (eIdx !== -1) { newE[eIdx].statuses = safeArray(newE[eIdx].statuses); newE[eIdx].statuses.push(val); } return { ...s, encounter: { ...s.encounter, enemies: newE } }; }); if (el) el.value = ''; } }}>+</button> </div> )}
                        </div>

                        {isGM && ( <button className={`w-full font-bold py-2 mt-2 uppercase text-xs transition-colors ${disableMovement ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#22c55e] text-black hover:bg-white'}`} disabled={disableMovement} onClick={() => primeTokenMove(activeT)}>{disableMovement ? 'LOCKED' : 'Prime Movement'}</button> )}

                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Abilities</div>
                        {safeArray(linkedEnemy.abilities).map((ability, aIdx) => {
                            if (!ability) return null; const ab = normalizeAbility(ability);
                            return (
                                <div key={aIdx} className="bg-gray-900 border border-gray-700 p-2 text-sm flex justify-between items-center relative">
                                    <div> <span className="text-[#00f0ff] font-bold text-xs">{String(ab.name)}</span> {ab.effect && <span title={STATE_DESCRIPTIONS[getCoreState(ab.effect)] || 'State'} className="block text-purple-400 text-[10px] mt-0.5 cursor-help">[{String(ab.effect)}]</span>} {ab.terrain && <span className="block text-yellow-500 text-[10px] mt-0.5">Terrain: [{String(ab.terrain).toUpperCase()}]</span>} </div>
                                    {isGM && ( <button className={`font-bold px-2 py-1 uppercase text-[10px] border transition-colors ${disableAttacks ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-[#ff6600] hover:text-black border-gray-600'}`} disabled={disableAttacks} onClick={() => { if (disableAttacks) return alert("System Locked: Entity is STUNNED."); const currentHostileRes = safeEnc?.enemyPoolTotal ?? 10; if (currentHostileRes < ab.cost) return alert(`System Locked: Insufficient Hostile Resonance.\nRequired: ${ab.cost} RES\nCurrent Pool: ${currentHostileRes} RES`); let finalRange = isBlind ? '1' : ab.range; let finalAoe = isBlind ? 0 : ab.aoe; if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes and AoE is zeroed."); pushUpdate(s => ({ ...s, activeAction: { type: 'target', source: String(linkedEnemy.name), sourceId: String(linkedEnemy.uid), isEnemy: true, name: String(ab.name), payload: 'damage', cost: safeInt(ab.cost), d: safeInt(ab.value), a: finalAoe || 0, range: String(finalRange), effectName: String(ab.effect || ''), effectCore: String(getCoreState(ab.effect) || ''), elementRaw: String(ab.element || 'Kinetic'), elementCore: String(getCoreElement(ab.element) || 'Kinetic'), terrain: String(ab.terrain || ''), isBasic: false, isImprovised: false, originalCost: safeInt(ab.cost), m: 0, coreMobility: '', u: 0, desc: '' } })); }}>{disableAttacks ? 'LOCKED' : `TARGET (${ab.cost} RES)`}</button> )}
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }

        if (!isGM) { return ( <div className="w-full md:w-56 bg-[#1a222c] p-4 border border-slate-700 font-mono flex flex-col gap-3 shrink-0 h-full"> <div className="text-gray-500 text-xs text-center mt-10 p-4 border border-dashed border-gray-700">Select a token on the grid to view its bio-scan.</div> </div> ); }

        return (
            <div className="w-full md:w-56 bg-[#1a222c] p-4 border border-slate-700 font-mono flex flex-col gap-3 shrink-0 h-full overflow-y-auto">
                <div className="text-[#00f0ff] font-bold mb-2 tracking-widest uppercase">Terrain Brush</div>
                <button className={`p-2 border text-sm text-left transition-colors ${paintBrush==='minor' ? 'border-[#ff6600] bg-black text-white font-bold' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`} onClick={()=>setPaintBrush(paintBrush==='minor'?null:'minor')}>🟨 Minor (u=1)</button>
                <button className={`p-2 border text-sm text-left transition-colors ${paintBrush==='major' ? 'border-[#ff6600] bg-black text-white font-bold' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`} onClick={()=>setPaintBrush(paintBrush==='major'?null:'major')}>🟪 Major (u=3)</button>
                <button className={`p-2 border text-sm text-left transition-colors ${paintBrush==='severe' ? 'border-[#ff6600] bg-black text-white font-bold' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`} onClick={()=>setPaintBrush(paintBrush==='severe'?null:'severe')}>🟦 Severe (u=5)</button>
                <button className={`p-2 border text-sm text-left mt-2 transition-colors ${paintBrush==='clear' ? 'border-red-500 text-red-500' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`} onClick={()=>setPaintBrush(paintBrush==='clear'?null:'clear')}>Clear Hex Tile</button>
                
                <div className="text-[#ff6600] font-bold mt-6 mb-2 tracking-widest uppercase">Deploy Tokens</div>
                
                <div className="bg-gray-900 border border-gray-700 p-2 flex flex-col gap-2">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deploy Linked Agent</div>
                    <select className="w-full bg-black border border-gray-600 p-1 text-white outline-none text-xs" value={draftPlayerId} onChange={e=>setDraftPlayerId(e.target.value)}> <option value="">-- Select Player --</option> {Object.entries(safePlayers).map(([id, p]) => <option key={id} value={id}>{String(p?.name || 'Unnamed Agent')}</option>)} </select>
                    <div draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ action: 'deploy', type: 'player', refId: draftPlayerId }))} className="w-full bg-[#00f0ff] text-black p-2 font-bold text-xs uppercase text-center cursor-grab active:cursor-grabbing hover:bg-white transition-colors">≡ Drag to Grid ≡</div>
                </div>

                <div className="bg-gray-900 border border-gray-700 p-2 flex flex-col gap-2 mt-2">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deploy Hostile</div>
                    <select className="w-full bg-black border border-gray-600 p-1 text-white outline-none text-xs" value={draftEnemyId} onChange={e=>setDraftEnemyId(e.target.value)}> <option value="">-- Select Hostile --</option> {activeEnemies.map(e => e && <option key={e.uid} value={e.uid}>{String(e.name)} (T{e.tier})</option>)} </select>
                    <div draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', JSON.stringify({ action: 'deploy', type: 'enemy', refId: draftEnemyId }))} className="w-full bg-[#ff6600] text-black p-2 font-bold text-xs uppercase text-center cursor-grab active:cursor-grabbing hover:bg-white transition-colors">≡ Drag to Grid ≡</div>
                </div>
            </div>
        );
    };

    const renderFCT = () => {
        return floatingTexts.map(fct => {
            if (!fct || fct.pos === undefined || fct.pos === null) return null;
            const { x, y } = getHexCoords(fct.pos);
            return ( <div key={fct.id} className="absolute z-[300] font-bold text-2xl pointer-events-none fct-anim whitespace-nowrap drop-shadow-xl" style={{ left: `${x + hexWidth/2}px`, top: `${y}px`, color: fct.color, textShadow: '0px 0px 8px rgba(0,0,0,1), 0px 0px 4px rgba(0,0,0,1)' }}> {fct.text} </div> );
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[75vh] relative">
            <style>{` @keyframes fctFloat { 0% { opacity: 0; transform: translate(-50%, -20%) scale(0.8); } 15% { opacity: 1; transform: translate(-50%, -80%) scale(1.2); } 80% { opacity: 1; transform: translate(-50%, -100%) scale(1); } 100% { opacity: 0; transform: translate(-50%, -120%) scale(0.9); } } .fct-anim { animation: fctFloat 2.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; } `}</style>

            {renderSidebar()}
            
            <div className="flex-1 bg-[#05080a] border border-slate-700 overflow-hidden relative shadow-inner flex flex-col">
                
                <div className="absolute bottom-4 left-4 w-72 md:max-w-[280px] flex flex-col z-50 pointer-events-none max-h-48">
                    <div className="bg-black/80 border border-gray-700 pointer-events-auto flex flex-col h-full shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                        <div className="bg-gray-800/80 text-gray-300 text-[10px] font-bold uppercase px-3 py-1.5 tracking-widest border-b border-gray-700 shrink-0">Combat Telemetry Log</div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-2 space-y-reverse text-[10px] text-gray-300 font-mono flex flex-col-reverse scrollbar-hide">
                            {safeArray(safeEnc.logFeed).slice().reverse().map(l => ( <div key={l.id} className="whitespace-pre-wrap border-b border-gray-800/50 pb-2">{l.text}</div> ))}
                            {safeArray(safeEnc.logFeed).length === 0 && <div className="text-gray-600 italic">Awaiting tactical events...</div>}
                        </div>
                    </div>
                </div>

                {renderInitiativeTracker()}

                <div className="absolute top-4 right-4 bg-black border border-gray-700 px-4 py-2 z-50 text-xs font-mono uppercase text-gray-400 shadow-md">
                    <div className="mb-1">Phase: <span className="font-bold text-white">{safeEnc?.round === 0 ? 'Deployment Phase' : `Round ${safeEnc?.round}`}</span></div>
                    <div className="border-t border-gray-700 pt-1 mt-1 mb-1">Hostile Res: <span className="font-bold text-[#ff6600]">{safeEnc?.enemyPoolTotal ?? 10}</span></div>
                </div>

                {activeAction && activeAction.type === 'hijack_select' && activeAction.enemy && (
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 border-2 px-6 py-3 z-50 flex items-center gap-6 shadow-lg animate-pulse bg-purple-950 border-purple-500 text-purple-200">
                        <div className="font-mono">
                            <span className="text-xs uppercase tracking-widest mb-1 text-purple-400 flex items-center gap-2">NEURAL LINK ESTABLISHED // Target: {String(activeAction.enemy.name)}</span>
                            <span className="font-bold text-xl uppercase tracking-wider block mb-1">Select Hostile Payload</span>
                            <div className="flex gap-2 mt-2">
                                {safeArray(activeAction.enemy.abilities).map((ability, aIdx) => {
                                    if (!ability) return null; const ab = normalizeAbility(ability);
                                    return ( <button key={aIdx} className="bg-black text-white px-3 py-2 text-[10px] font-bold border border-purple-500 hover:bg-purple-500 hover:text-white transition-colors uppercase" onClick={() => { pushUpdate(s => ({ ...s, activeAction: { type: 'target', source: `Hijacked ${activeAction.enemy.name}`, sourceId: String(activeAction.enemy.uid), isEnemy: true, isHijacked: true, hijackControllerId: activeAction.hijackControllerId, name: ab.name, cost: 0, payload: 'damage', d: safeInt(ab.value), a: ab.aoe || 0, range: String(ab.range), effectName: String(ab.effect || ''), effectCore: String(getCoreState(ab.effect) || ''), elementRaw: String(ab.element || 'Kinetic'), elementCore: String(getCoreElement(ab.element) || 'Kinetic'), terrain: String(ab.terrain || ''), isBasic: false, isImprovised: false, originalCost: 0, m: 0, coreMobility: '', u: 0, desc: '', isEcho: false } })); }}>{String(ab.name)}</button> );
                                })}
                            </div>
                        </div>
                        <button className="font-bold px-4 py-2 uppercase tracking-wider text-sm border bg-red-600 text-white border-red-500 hover:bg-white hover:text-red-600 transition-colors" onClick={clearActiveAction}>Abort</button>
                    </div>
                )}

                {activeAction && activeAction.type !== 'hijack_select' && (
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 border-2 px-6 py-3 z-50 flex items-center gap-6 shadow-lg animate-pulse ${activeAction.isHijacked ? 'bg-purple-950 border-purple-500 text-purple-200 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : activeAction.type === 'move' || activeAction.type === 'blink' ? 'bg-[#064e3b] border-[#22c55e] text-[#bbf7d0] shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-950 border-red-500 text-red-200 shadow-[0_0_20px_rgba(255,0,0,0.3)]'}`}>
                        <div className="font-mono">
                            <span className={`text-xs uppercase tracking-widest mb-1 ${activeAction.isHijacked ? 'text-purple-400' : activeAction.type === 'move' || activeAction.type === 'blink' ? 'text-[#4ade80]' : 'text-red-400'} flex items-center gap-2`}>{activeAction.isHijacked ? 'Neural Hijack Active' : activeAction.type === 'move' ? 'Movement Array Active' : activeAction.type === 'blink' ? 'Displacement Array Active' : 'Targeting Array Active'} // Source: {String(activeAction.source || 'Player')}</span>
                            <span className="font-bold text-xl uppercase tracking-wider block mb-1">{activeAction.type === 'move' ? 'Repositioning' : activeAction.type === 'blink' ? `Blinking [${safeInt(activeAction.m) || 1} Hexes]` : String(activeAction.name || 'Action')}</span>
                            {activeAction.type !== 'move' && activeAction.type !== 'blink' && (
                                <div className="text-[10px] mt-1 flex gap-3 flex-wrap font-bold text-gray-400 items-center">
                                    {activeAction.isImprovised && <span className="text-[#ff6600] animate-pulse uppercase">⚠ IMPROVISED (1d6) ⚠</span>}
                                    {activeAction.payload === 'heal' && <span className="text-[#22c55e]">PAYLOAD: RESTORATIVE</span>}
                                    {activeAction.payload === 'battery' && <span className="text-[#00f0ff]">PAYLOAD: ENERGIZE</span>}
                                    {activeAction.isEcho && <span className="text-[#a855f7]">TACTICAL ECHO DEPLOYMENT</span>}
                                    {activeAction.d !== undefined && <span>VAL: {safeInt(activeAction.d)}</span>}
                                    {activeAction.elementCore && <span className="text-[#ff6600]">TYPE: {(activeAction.elementRaw && String(activeAction.elementRaw).toLowerCase() !== String(activeAction.elementCore).toLowerCase()) ? `${activeAction.elementRaw} [Core: ${activeAction.elementCore}]` : String(activeAction.elementCore)}</span>}
                                    {activeAction.a !== undefined && <span>AoE: {activeAction.a === 'line3' ? '3-HEX LINE' : activeAction.a === 'cluster3' ? '3-HEX CLUSTER' : `${activeAction.a} RADIUS`}</span>}
                                    {activeAction.effectName && <span className="text-purple-400">STATE: [{(String(activeAction.effectName).toLowerCase() !== String(activeAction.effectCore || '').toLowerCase() && activeAction.effectCore) ? `${activeAction.effectName} : ${activeAction.effectCore}` : String(activeAction.effectName)}]</span>}
                                    {activeAction.terrain && <span className="text-yellow-400">TERRAIN: [{String(activeAction.terrain).toUpperCase()}]</span>}
                                    {safeInt(activeAction.m) > 0 && <span className="text-blue-400">MOBILITY: {safeInt(activeAction.m)} [{String(activeAction.coreMobility || '').toUpperCase()}]</span>}
                                    {(activeAction.a === 'line3' || activeAction.a === 'cluster3') && (
                                        <div className="flex gap-2 ml-4"> <button className="bg-gray-800 text-white px-2 py-1 text-[10px] font-bold border border-gray-600 hover:bg-white hover:text-black uppercase cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); setAoeRotation(r => (r - 1 + 6) % 6); }}>↶ Rotate (Q)</button> <button className="bg-gray-800 text-white px-2 py-1 text-[10px] font-bold border border-gray-600 hover:bg-white hover:text-black uppercase cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); setAoeRotation(r => (r + 1) % 6); }}>↷ Rotate (R)</button> </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className={`font-bold px-4 py-2 uppercase tracking-wider text-sm border transition-colors cursor-pointer pointer-events-auto ${activeAction.type === 'move' || activeAction.type === 'blink' ? 'bg-[#166534] text-white border-[#22c55e] hover:bg-white hover:text-[#166534]' : 'bg-red-600 text-white border-red-500 hover:bg-white hover:text-red-600'}`} onClick={clearActiveAction}>Clear</button>
                    </div>
                )}
                
                <div className="flex-1 overflow-auto p-4 md:p-10 relative">
                    <div className="relative mx-auto mt-8" style={{ width: boardWidth, height: boardHeight }}>
                        {renderHexBackgrounds()}
                        {renderTargetPreviews()}
                        {renderTokens()}
                        {renderTokenLabels()}
                        {renderFCT()}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function GridBoard(props) { return ( <GridBoardErrorBoundary> <GridBoardInner {...props} /> </GridBoardErrorBoundary> ); }