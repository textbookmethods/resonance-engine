/* eslint-disable */
import React, { useState } from 'react';
import { armory } from '../data/armory';

const safeArmory = (Array.isArray(armory) && armory.length > 0) ? armory : [{ id: 'w01', name: 'Fallback', range: '1', baseDmg: 3 }];

const CLASS_COLORS = {
    Vanguard: '#ef4444', Paladin: '#eab308', Sniper: '#22c55e', 
    Conduit: '#a855f7', Skirmisher: '#f97316', Saboteur: '#ec4899', Rookie: '#00f0ff'      
};

// FIXED: Injected the missing Element Dictionary to prevent the fatal ReferenceError
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

const MOBILITY_DICTIONARY = {
    'Blink': ['blink', 'teleport', 'jump', 'leap', 'bound', 'dash', 'phase', 'tunnel', 'burrow', 'step'],
    'Push': ['push', 'repel', 'throw', 'knockback', 'slam', 'blow', 'blast', 'drive'],
    'Pull': ['pull', 'attract', 'draw', 'drag', 'snare', 'hook', 'catch', 'leash']
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

const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const safeArray = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr.filter(item => item !== null && item !== undefined);
    if (typeof arr === 'object') return Object.values(arr).filter(item => item !== null && item !== undefined);
    return [];
};

const getCoreState = (input) => {
    if (!input) return '';
    const match = String(input).match(/\[(.*?)\]/);
    const clean = (match ? match[1] : String(input)).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) {
        if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core;
    }
    return String(input); 
};

const getCoreElement = (input) => {
    if (!input) return 'Kinetic';
    const clean = String(input).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(ELEMENT_DICTIONARY)) {
        if (core === clean || synonyms.includes(clean)) return core.charAt(0).toUpperCase() + core.slice(1);
    }
    return 'Kinetic'; 
};

const getCoreMobility = (input) => {
    if (!input) return '';
    const clean = String(input).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(MOBILITY_DICTIONARY)) {
        if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core;
    }
    return String(input);
};

const getAffinityMultiplier = (atkElem, defElem) => {
    if (!defElem || !atkElem) return 1.0;
    const a = String(atkElem).toLowerCase();
    const d = String(defElem).toLowerCase();
    
    if (a === 'thermal' && d === 'cryo') return 1.5;
    if (a === 'cryo' && d === 'toxic') return 1.5;
    if (a === 'toxic' && d === 'thermal') return 1.5;
    if (a === 'radiant' && d === 'void') return 1.5;
    if (a === 'void' && d === 'radiant') return 1.5;
    if (a === 'electro' && d === 'kinetic') return 1.5;
    if (a === 'kinetic' && d === 'electro') return 1.5;

    if (a === 'cryo' && d === 'thermal') return 0.5;
    if (a === 'toxic' && d === 'cryo') return 0.5;
    if (a === 'thermal' && d === 'toxic') return 0.5;
    
    return 1.0;
};

export default function GridBoard({ players = {}, grid = [], tokens = [], encounter = {}, activeAction = null, pushUpdate, role, localId }) {
    const [paintBrush, setPaintBrush] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);
    const [hoveredHex, setHoveredHex] = useState(null);
    const [draftPlayerId, setDraftPlayerId] = useState('');
    const [draftEnemyId, setDraftEnemyId] = useState('');
    
    const isGM = role === 'gm';
    const COLS = 15; const ROWS = 10;
    
    const activeGrid = grid.length === 150 ? grid : Array(150).fill({ type: 'empty', terrain: null, terrainElement: null });
    const activeTokens = safeArray(tokens);

    const R = 36; const hexWidth = R * 2; const hexHeight = R * Math.sqrt(3); 
    const stepX = hexWidth * 0.75; const stepY = hexHeight; 
    const boardWidth = (COLS - 1) * stepX + hexWidth;
    const boardHeight = (ROWS - 1) * stepY + hexHeight + (stepY / 2);

    const getCubeCoords = (idx) => {
        const col = idx % COLS; const row = Math.floor(idx / COLS);
        const q = col; const r = row - Math.floor(col / 2); const s = -q - r;
        return { q, r, s };
    };

    const getIndexFromCube = (q, r) => {
        const col = q;
        const row = r + Math.floor(col / 2);
        if (col >= 0 && col < COLS && row >= 0 && row < ROWS) return row * COLS + col;
        return null;
    };

    const getHexDistance = (idxA, idxB) => {
        const a = getCubeCoords(idxA); const b = getCubeCoords(idxB);
        return Math.max(Math.abs(a.q - b.q), Math.abs(a.r - b.r), Math.abs(a.s - b.s));
    };

    const getHexCoords = (idx) => {
        const col = idx % COLS; const row = Math.floor(idx / COLS);
        const x = col * stepX; const y = row * stepY + (col % 2 === 1 ? stepY / 2 : 0);
        return { x, y };
    };
    
    const getAdjacentHexes = (idx) => {
        const c = getCubeCoords(idx);
        const dirs = [{q:1,r:0}, {q:0,r:1}, {q:-1,r:1}, {q:-1,r:0}, {q:0,r:-1}, {q:1,r:-1}];
        const hexes = [];
        dirs.forEach(d => {
            const nIdx = getIndexFromCube(c.q + d.q, c.r + d.r);
            if (nIdx !== null) hexes.push(nIdx);
        });
        return hexes;
    };

    const isCrushed = (pos, currentGrid) => {
        let crushed = true;
        for (let dq = -2; dq <= 2; dq++) {
            for (let dr = -2; dr <= 2; dr++) {
                let ds = -dq - dr;
                if (Math.max(Math.abs(dq), Math.abs(dr), Math.abs(ds)) <= 2) {
                    const centerCube = getCubeCoords(pos);
                    const nq = centerCube.q + dq;
                    const nr = centerCube.r + dr;
                    const nIdx = getIndexFromCube(nq, nr);
                    if (nIdx !== null) {
                        if (currentGrid[nIdx]?.terrain !== 'severe') {
                            crushed = false;
                            break;
                        }
                    }
                }
            }
            if (!crushed) break;
        }
        return crushed;
    };

    const evaluateCrush = (tokensList, currentGrid, playersObj, enemiesList, deadEnemyUids, logStr) => {
        let evLog = logStr;
        let pObj = { ...playersObj };
        let eList = [...enemiesList];
        
        tokensList.forEach(t => {
            const crushed = isCrushed(t.pos, currentGrid);
            if (t.type === 'enemy') {
                if (crushed) {
                    const eIndex = eList.findIndex(e => String(e.uid) === String(t.refId));
                    if (eIndex !== -1 && eList[eIndex].currentHp > 0) {
                        eList[eIndex].currentHp = 0;
                        deadEnemyUids.add(String(t.refId));
                        evLog += `\n>> HOSTILE CRUSHED! [Entombed in Severe Terrain]`;
                    }
                }
            } else if (t.type === 'player') {
                const p = pObj[t.refId];
                if (p) {
                    p.statuses = safeArray(p.statuses);
                    if (crushed) {
                        if (!p.statuses.includes('Crushed [1/3]') && !p.statuses.includes('Crushed [2/3]') && !p.statuses.includes('Crushed [3/3]')) {
                            p.statuses.push('Crushed [1/3]');
                            evLog += `\n>> AGENT TRAPPED: ${p.name || 'Agent'} is Entombed [1/3]. Evacuate immediately!`;
                        }
                    } else {
                        if (p.statuses.includes('Crushed [1/3]') || p.statuses.includes('Crushed [2/3]')) {
                            p.statuses = p.statuses.filter(st => !String(st).startsWith('Crushed ['));
                            evLog += `\n>> AGENT ESCAPED: ${p.name || 'Agent'} successfully broke free from Entombment.`;
                        }
                    }
                }
            }
        });
        
        return { pObj, eList, logStr: evLog };
    };

    const getAoEHexes = (targetIdx, originPosIdx, aType) => {
        if (targetIdx === null || targetIdx === undefined || targetIdx === -1) return [];
        let hexes = [targetIdx];
        if (!aType || aType === 0 || aType === '0') return hexes;
        if (aType === 1 || aType === '1') {
            for (let i = 0; i < 150; i++) if (getHexDistance(targetIdx, i) === 1) hexes.push(i);
            return hexes;
        }
        if (aType === 2 || aType === '2') {
            for (let i = 0; i < 150; i++) if (getHexDistance(targetIdx, i) <= 2 && i !== targetIdx) hexes.push(i);
            return hexes;
        }

        const tCube = getCubeCoords(targetIdx);
        let dirIdx = 0;
        
        if (originPosIdx !== null && originPosIdx !== undefined && originPosIdx !== targetIdx) {
            const tCoords = getHexCoords(targetIdx);
            const aCoords = getHexCoords(originPosIdx);
            let angle = Math.atan2(tCoords.y - aCoords.y, tCoords.x - aCoords.x) * (180 / Math.PI);
            if (isNaN(angle)) angle = 0;
            if (angle < 0) angle += 360;
            dirIdx = (Math.round(angle / 60) % 6 + 6) % 6; 
        } else {
            const targetToken = activeTokens.find(t => t.pos === targetIdx);
            if (targetToken && targetToken.facing !== undefined) {
                dirIdx = targetToken.facing;
            }
        }

        const hexDirs = [
            {q: 1, r: 0, s: -1},  
            {q: 0, r: 1, s: -1},  
            {q: -1, r: 1, s: 0},  
            {q: -1, r: 0, s: 1},  
            {q: 0, r: -1, s: 1},  
            {q: 1, r: -1, s: 0}   
        ];

        const d = hexDirs[dirIdx] || hexDirs[0];

        if (aType === 'line3') {
            for (let step = 1; step <= 2; step++) {
                const nIdx = getIndexFromCube(tCube.q + d.q*step, tCube.r + d.r*step);
                if (nIdx !== null) hexes.push(nIdx);
            }
        } else if (aType === 'cluster3') {
            const d1 = hexDirs[dirIdx] || hexDirs[0];
            const d2 = hexDirs[(dirIdx + 1) % 6] || hexDirs[1];
            const idx1 = getIndexFromCube(tCube.q + d1.q, tCube.r + d1.r);
            const idx2 = getIndexFromCube(tCube.q + d2.q, tCube.r + d2.r);
            if (idx1 !== null) hexes.push(idx1);
            if (idx2 !== null) hexes.push(idx2);
        }

        return hexes;
    };

    const findActiveTokenIndex = (action, tokenList) => {
        if (!action) return -1;
        if (action.isTokenId) return tokenList.findIndex(t => String(t.id) === String(action.sourceId));
        return tokenList.findIndex(t => t.type === (action.isEnemy ? 'enemy' : 'player') && String(t.refId) === String(action.sourceId));
    };

    const executeMove = (index) => {
        const targetRow = Math.floor(index / COLS);
        
        pushUpdate(s => {
            const action = s.activeAction || activeAction;
            const newTokens = deepClone(safeArray(s.tokens));
            const tIdx = findActiveTokenIndex(action, newTokens);
            
            if (tIdx !== -1) {
                const t = newTokens[tIdx];
                if (s.encounter?.round === 0) {
                    if (t.type === 'player' && targetRow < 5) { alert("Agents must be deployed in the southern sector (Rows 6-10)."); return s; }
                    if (t.type === 'enemy' && targetRow >= 5) { alert("Hostiles must be deployed in the northern sector (Rows 1-5)."); return s; }
                    t.pos = index;
                    return { ...s, tokens: newTokens, activeAction: null };
                }

                const dist = getHexDistance(t.pos, index);
                if (dist !== 1) { alert("Movement must be executed one adjacent hex at a time."); return s; }

                const targetCell = s.grid && s.grid.length === 150 ? s.grid[index] : { terrain: null };
                if (targetCell.terrain === 'severe') { alert("Severe Terrain is impassable. Blocked."); return s; }

                const cost = targetCell.terrain === 'minor' ? 2 : 1;
                const currentRemaining = t.movementRemaining ?? t.speed ?? 3;

                if (currentRemaining < cost) { alert(`Insufficient movement points! Cost: ${cost}, Remaining: ${currentRemaining}`); return s; }

                t.movementRemaining = currentRemaining - cost;
                t.pos = index;
                if (targetCell.terrain === 'major') alert("⚠️ HAZARD WARNING: Token entered Major Terrain. Stop movement and manually resolve environmental damage or status effects.");

                let finalPlayers = deepClone(s.players || {});
                let finalLog = s.globalLog;
                if (t.type === 'player') {
                    const res = evaluateCrush(newTokens, s.grid, finalPlayers, s.encounter?.enemies || [], new Set(), "");
                    if (res.logStr) {
                        finalPlayers = res.pObj;
                        finalLog = { message: res.logStr, timestamp: Date.now() };
                    }
                }

                if (t.movementRemaining <= 0) return { ...s, tokens: newTokens, activeAction: null, players: finalPlayers, globalLog: finalLog };
                return { ...s, tokens: newTokens, players: finalPlayers, globalLog: finalLog };
            }
            return s;
        });
    };

    const executeBlink = (index) => {
        pushUpdate(s => {
            const action = s.activeAction || activeAction;
            const newTokens = deepClone(safeArray(s.tokens));
            const tIdx = findActiveTokenIndex(action, newTokens);
            
            if (tIdx !== -1) {
                const t = newTokens[tIdx];
                const targetCell = s.grid && s.grid.length === 150 ? s.grid[index] : { terrain: null };
                if (targetCell.terrain === 'severe') { alert("Destination hex contains Severe Terrain. Blink aborted."); return s; }

                t.pos = index;
                
                let log = `\n>> AGENT RELOCATED: Executed [${action.coreMobility || 'Blink'}] displacement vector for ${action.m || 1} hexes.`;
                let newEnemyPoolTotal = s.encounter?.enemyPoolTotal || 0;
                let newPlayers = deepClone(s.players || {});

                if (action.isEnemy) {
                    newEnemyPoolTotal = Math.max(0, newEnemyPoolTotal - (action.cost || 0));
                    log += `\n>> [-${action.cost || 0} Res] Hostile Action executed.`;
                } else if (action.sourceId) {
                    const p = newPlayers[action.sourceId];
                    if (p) {
                        const pRes = !isNaN(parseInt(p.resPool)) ? parseInt(p.resPool) : 3;
                        if (action.isImprovised) {
                            p.resPool = Math.max(0, pRes - 1);
                            log += `\n>> [-1 Res] Improvised Skill Matrix engaged.`;
                        } else {
                            const costDeduction = parseInt(action.cost) || 0;
                            p.resPool = Math.max(0, pRes - costDeduction);
                            if (costDeduction > 0) log += `\n>> [-${costDeduction} Res] Skill executed.`;
                        }
                    }
                }

                const res = evaluateCrush(newTokens, s.grid, newPlayers, s.encounter?.enemies || [], new Set(), log);

                return { ...s, tokens: newTokens, players: res.pObj, encounter: { ...(s.encounter||{}), enemyPoolTotal: newEnemyPoolTotal }, activeAction: null, globalLog: { message: res.logStr, timestamp: Date.now() } };
            }
            return s;
        });
    };

    const resolveCombat = (targetHex) => {
        pushUpdate(s => {
            const action = s.activeAction || activeAction;
            if (!action) return s;

            const rawDmg = safeInt(action.d);
            const dispRaw = action.elementRaw || action.element || 'Kinetic';
            const dispCore = action.elementCore || action.element || 'Kinetic';
            const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;

            let newPlayers = deepClone(s.players || {});
            let newEnemies = deepClone(safeArray(s.encounter?.enemies));
            let newTokens = deepClone(safeArray(s.tokens));
            let newGrid = deepClone(s.grid?.length === 150 ? s.grid : Array(150).fill({ type: 'empty', terrain: null, terrainElement: null }));
            
            let hitCount = 0;
            let attackerPosIdx = null;
            
            const attIdx = findActiveTokenIndex(action, newTokens);
            if (attIdx !== -1) attackerPosIdx = newTokens[attIdx].pos;
            
            let actualTargetHex = targetHex;
            let log = `--- COMBAT LOG: ${action.name || 'Action'} [${showType}] ---\n`;

            if (action.isImprovised) {
                const roll = Math.floor(Math.random() * 6) + 1;
                log += `\n>> IMPROVISED ROLL: [${roll}]`;
                if (roll >= 5) {
                    log += `\n>> CASCADE: Reality bent to Agent's will.\n`;
                } else if (roll >= 3) {
                    const fbDmg = safeInt(action.originalCost);
                    log += `\n>> SURGE: Action succeeds, but Agent suffers ${fbDmg} feedback damage.\n`;
                    if (!action.isEnemy && action.sourceId) {
                        const p = newPlayers[action.sourceId];
                        if (p) p.currentHp = Math.max(0, safeInt(p.currentHp) - fbDmg);
                    }
                } else {
                    log += `\n>> BACKLASH: Catastrophic failure! Trajectory inverted!\n`;
                    if (attIdx !== -1) actualTargetHex = newTokens[attIdx].pos;
                }
            }
            
            log += `Base Damage: ${rawDmg}\n`;

            const originPosIdx = attIdx !== -1 ? newTokens[attIdx].pos : null;
            const aoeHexes = getAoEHexes(actualTargetHex, originPosIdx, action.a);

            const isExecute = action.effectCore === 'Execute';
            let deadEnemyUids = new Set();
            const consumeStates = ['Invulnerable', 'Shielded', 'Vulnerable', 'Evasive'];

            newTokens.forEach(t => {
                if (aoeHexes.includes(t.pos)) {
                    hitCount++;
                    const targetCoords = getHexCoords(t.pos);
                    
                    let isFlanking = false;
                    if ((!action.a || action.a === '0' || action.a === 0) && attackerPosIdx !== null && attackerPosIdx !== t.pos) {
                        const aCoords = getHexCoords(attackerPosIdx);
                        const dx = aCoords.x - targetCoords.x; 
                        const dy = aCoords.y - targetCoords.y;
                        let angle = Math.atan2(dy, dx) * (180 / Math.PI); 
                        if (isNaN(angle)) angle = 0;
                        if (angle < 0) angle += 360; 
                        const facingAngle = (t.facing || 0) * 60; 
                        let diff = Math.abs(angle - facingAngle);
                        if (isNaN(diff)) diff = 0;
                        if (diff > 180) diff = 360 - diff;
                        if (diff > 90) isFlanking = true; 
                    }

                    let baseCellElem = newGrid[t.pos]?.terrainElement;
                    let isOnSteamReact = baseCellElem === 'Cryo' && dispCore === 'Thermal';
                    let isOnCombustReact = baseCellElem === 'Toxic' && dispCore === 'Thermal';
                    let isOnConductReact = (baseCellElem === 'Cryo' || baseCellElem === 'Steam') && dispCore === 'Electro';
                    let isOnAnnihilateReact = (baseCellElem === 'Void' && dispCore === 'Radiant') || (baseCellElem === 'Radiant' && dispCore === 'Void');

                    let targetWasHit = false;
                    
                    if (t.type === 'enemy') {
                        const eIndex = newEnemies.findIndex(e => String(e.uid) === String(t.refId));
                        if (eIndex !== -1) {
                            targetWasHit = true;
                            const enemy = newEnemies[eIndex];
                            let newHp = safeInt(enemy.currentHp);
                            let staggered = enemy.staggered;

                            let barriers = [...safeArray(enemy.currentBarriers)];
                            let coreStates = safeArray(enemy.statuses).map(st => getCoreState(st));
                            let incomingDmg = rawDmg;

                            const rpsMult = getAffinityMultiplier(dispCore, enemy.affinity);
                            if (rpsMult === 1.5) { incomingDmg = Math.ceil(incomingDmg * 1.5); log += `\n>> AFFINITY ADVANTAGE: 1.5x Dmg (${dispCore} > ${enemy.affinity || 'Kinetic'})`; }
                            if (rpsMult === 0.5) { incomingDmg = Math.ceil(incomingDmg * 0.5); log += `\n>> AFFINITY DISADVANTAGE: 0.5x Dmg (${dispCore} < ${enemy.affinity || 'Kinetic'})`; }

                            if (isFlanking) { incomingDmg = Math.ceil(incomingDmg * 1.5); log += `\n>> FLANKING BONUS: Target struck outside facing arc! 1.5x Dmg`; }

                            if (isOnSteamReact) { incomingDmg += 5; log += `\n>> STEAM BLAST: (+5 Dmg)`; }
                            if (isOnCombustReact) { incomingDmg += 5; log += `\n>> COMBUSTION: (+5 Dmg)`; }
                            if (isOnConductReact) { incomingDmg += 5; log += `\n>> CONDUCTION: (+5 Dmg)`; }
                            if (isOnAnnihilateReact) { incomingDmg += 5; log += `\n>> ANNIHILATION: (+5 Dmg)`; }
                            
                            if (coreStates.includes('Vulnerable')) incomingDmg = Math.ceil(incomingDmg * 1.5);
                            if (coreStates.includes('Shielded')) { incomingDmg = Math.max(0, incomingDmg - 5); log += `\n>> [Shielded] mitigated 5 damage.`; }
                            if (coreStates.includes('Invulnerable')) { incomingDmg = 0; log += `\n>> [Invulnerable] completely negated the attack.`; }
                            if (coreStates.includes('Evasive') && !isExecute) log += `\n>> [Evasive] triggered.`;

                            if (isExecute) {
                                barriers.fill(0);
                                newHp = 0;
                                staggered = true;
                                log += `\n>> HOSTILE EXECUTED! [Instant Erasure]`;
                            } else {
                                let dmgRemaining = incomingDmg;
                                for (let i = 0; i < barriers.length; i++) {
                                    if (barriers[i] > 0 && dmgRemaining > 0) {
                                        if (barriers[i] >= dmgRemaining) { barriers[i] -= dmgRemaining; dmgRemaining = 0; } 
                                        else { dmgRemaining -= barriers[i]; barriers[i] = 0; }
                                    }
                                }
                                newHp = Math.max(0, newHp - dmgRemaining);
                                
                                const hadBarriers = safeArray(enemy.currentBarriers).some(b => b > 0);
                                const allShattered = barriers.every(b => b === 0);
                                if (hadBarriers && allShattered) staggered = true; 

                                log += `\nHostile [${enemy.name}]: Took ${dmgRemaining} HP dmg. HP is now ${newHp}.`;
                                if (staggered && !enemy.staggered) log += `\n>> TARGET STAGGERED!`;
                            }

                            let updatedStatuses = safeArray(enemy.statuses).filter(st => !consumeStates.includes(getCoreState(st)));
                            
                            if (action.effectName && !isExecute) {
                                let newlyAppliedCore = action.effectCore || getCoreState(action.effectName);
                                updatedStatuses.push(action.effectName);
                                log += `\n>> State [${action.effectName}] applied to ${enemy.name}!`;

                                if (newlyAppliedCore === 'Haste') t.movementRemaining = (t.movementRemaining || 0) + 2;
                                else if (newlyAppliedCore === 'Slowed') t.movementRemaining = Math.max(0, (t.movementRemaining || 0) - 2);
                                else if (newlyAppliedCore === 'Immobilized' || newlyAppliedCore === 'Stunned') t.movementRemaining = 0;
                                else if (newlyAppliedCore === 'Knockdown') t.movementRemaining = Math.floor((t.movementRemaining || 0) / 2);
                            }

                            if (newHp <= 0) {
                                log += `\n>> TARGET DESTROYED! Entity purged from grid.`;
                                deadEnemyUids.add(String(enemy.uid));
                            } else {
                                newEnemies[eIndex] = { ...enemy, currentBarriers: safeArray(barriers), currentHp: newHp, staggered, statuses: safeArray(updatedStatuses) };
                            }
                        }
                    } 
                    else if (t.type === 'player') {
                        const p = newPlayers[t.refId];
                        if (p) {
                            targetWasHit = true;
                            const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                            const wpn = safeArmory.find(w => String(w.id) === String(p.weaponId || 'w01')) || safeArmory[0];
                            let isSynergy = fDP >= (wpn.reqF||0) && sDP >= (wpn.reqS||0) && bDP >= (wpn.reqB||0);
                            let wpnBonus = isSynergy ? (wpn.bonusFront || 0) : 0;

                            let coreStates = safeArray(p.statuses).map(st => getCoreState(st));
                            let forcedEvasion = coreStates.includes('Evasive');

                            let incomingDmg = rawDmg;
                            const rpsMult = getAffinityMultiplier(dispCore, p.affinity || 'Kinetic');
                            if (rpsMult === 1.5) { incomingDmg = Math.ceil(incomingDmg * 1.5); log += `\n>> AFFINITY ADVANTAGE: 1.5x Dmg (${dispCore} > ${p.affinity || 'Kinetic'})`; }
                            if (rpsMult === 0.5) { incomingDmg = Math.ceil(incomingDmg * 0.5); log += `\n>> AFFINITY DISADVANTAGE: 0.5x Dmg (${dispCore} < ${p.affinity || 'Kinetic'})`; }

                            if (isFlanking) { incomingDmg = Math.ceil(incomingDmg * 1.5); log += `\n>> FLANKING BONUS: Target struck outside facing arc! 1.5x Dmg`; }
                            
                            if (isOnSteamReact) { incomingDmg += 5; log += `\n>> STEAM BLAST: (+5 Dmg)`; }
                            if (isOnCombustReact) { incomingDmg += 5; log += `\n>> COMBUSTION: (+5 Dmg)`; }
                            if (isOnConductReact) { incomingDmg += 5; log += `\n>> CONDUCTION: (+5 Dmg)`; }
                            if (isOnAnnihilateReact) { incomingDmg += 5; log += `\n>> ANNIHILATION: (+5 Dmg)`; }

                            if (coreStates.includes('Vulnerable')) incomingDmg = Math.ceil(incomingDmg * 1.5);
                            if (coreStates.includes('Shielded')) { incomingDmg = Math.max(0, incomingDmg - 5); log += `\n>> [Shielded] mitigated 5 damage.`; }
                            if (coreStates.includes('Invulnerable')) { incomingDmg = 0; log += `\n>> [Invulnerable] completely negated the attack.`; }

                            if (isExecute) {
                                p.currentHp = 0;
                                log += `\n>> AGENT EXECUTED! [Critical System Failure]`;
                            } else {
                                let mitigation = 0; let mitType = "None"; let trueFlank = isFlanking || (action.a !== undefined && action.a !== 0 && action.a !== '0');
                                
                                if (forcedEvasion) {
                                    trueFlank = true; mitType = "Forced Evasion [State]";
                                    if (p.usedEvade) { mitigation = 0; mitType += " [EXHAUSTED]"; }
                                    else { mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0); p.usedEvade = true; }
                                } else if (trueFlank) {
                                    if (p.usedEvade) { mitigation = 0; mitType = "Flanked [EVASION EXHAUSTED]"; } 
                                    else { mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0); mitType = "Backline Evasion"; p.usedEvade = true; }
                                } else {
                                    if (p.usedParry) { mitigation = 0; mitType = "Direct Hit [PARRY EXHAUSTED]"; } 
                                    else { mitigation = fDP + (wpn.baseDmg||0) + wpnBonus; mitType = "Front Parry"; p.usedParry = true; }
                                }

                                const finalDmg = Math.max(0, incomingDmg - mitigation);
                                const derivedMaxHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1);
                                p.currentHp = Math.max(0, safeInt(p.currentHp ?? derivedMaxHp) - finalDmg);
                                log += `\nAgent [${p.name || 'P1'}]: ${mitType} blocked ${mitigation} dmg. Took ${finalDmg} HP dmg. HP is now ${p.currentHp}.`;
                            }

                            p.statuses = safeArray(p.statuses).filter(st => !consumeStates.includes(getCoreState(st)));

                            if (action.effectName && !isExecute) {
                                let newlyAppliedCore = action.effectCore || getCoreState(action.effectName);
                                p.statuses.push(action.effectName);
                                log += `\n>> State [${action.effectName}] applied to ${p.name}!`;

                                if (newlyAppliedCore === 'Haste') t.movementRemaining = (t.movementRemaining || 0) + 2;
                                else if (newlyAppliedCore === 'Slowed') t.movementRemaining = Math.max(0, (t.movementRemaining || 0) - 2);
                                else if (newlyAppliedCore === 'Immobilized' || newlyAppliedCore === 'Stunned') t.movementRemaining = 0;
                                else if (newlyAppliedCore === 'Knockdown') t.movementRemaining = Math.floor((t.movementRemaining || 0) / 2);
                            }
                        }
                    }

                    if (targetWasHit && safeInt(action.m) > 0 && attackerPosIdx !== null && attackerPosIdx !== t.pos) {
                        if (action.coreMobility === 'Push' || action.coreMobility === 'Pull') {
                            let pushPos = t.pos;
                            let collisionDmg = 0;
                            const mobDist = safeInt(action.m);
                            
                            for (let step = 0; step < mobDist; step++) {
                                const adjHexes = getAdjacentHexes(pushPos);
                                const validHexes = adjHexes.filter(h => newGrid && newGrid[h] && newGrid[h].terrain !== 'severe');
                                
                                if (validHexes.length === 0) { collisionDmg += (mobDist - step); break; }
                                
                                validHexes.sort((a,b) => {
                                    const distA = getHexDistance(a, attackerPosIdx);
                                    const distB = getHexDistance(b, attackerPosIdx);
                                    return action.coreMobility === 'Push' ? distB - distA : distA - distB; 
                                });
                                
                                const bestHex = validHexes[0];
                                const currentDist = getHexDistance(pushPos, attackerPosIdx);
                                const bestDist = getHexDistance(bestHex, attackerPosIdx);
                                
                                if (action.coreMobility === 'Push' && bestDist <= currentDist) { collisionDmg += (mobDist - step); break; }
                                if (action.coreMobility === 'Pull' && bestDist >= currentDist) { collisionDmg += (mobDist - step); break; }
                                
                                pushPos = bestHex;
                            }
                            
                            t.pos = pushPos;
                            log += `\n>> FORCED MOVEMENT: Entity thrown via [${action.coreMobility}] momentum.`;

                            if (collisionDmg > 0) {
                                if (t.type === 'enemy') {
                                    const eIndex = newEnemies.findIndex(e => String(e.uid) === String(t.refId));
                                    if (eIndex !== -1) {
                                        newEnemies[eIndex].currentHp = Math.max(0, newEnemies[eIndex].currentHp - collisionDmg);
                                        if (newEnemies[eIndex].currentHp <= 0) deadEnemyUids.add(String(t.refId));
                                    }
                                } else if (t.type === 'player') {
                                    const p = newPlayers[t.refId];
                                    if (p) p.currentHp = Math.max(0, safeInt(p.currentHp) - collisionDmg);
                                }
                                log += `\n>> SLAM COLLISION: Entity struck impassable terrain for ${collisionDmg} physical damage.`;
                            }
                        }
                    }
                }
            });

            if (hitCount === 0) log += `\nNo valid targets in payload array.`;

            let newEnemyPoolTotal = s.encounter?.enemyPoolTotal || 0;
            
            if (action.isEnemy) {
                newEnemyPoolTotal = Math.max(0, newEnemyPoolTotal - safeInt(action.cost));
                log += `\n>> [-${safeInt(action.cost)} Res] Hostile Action executed.`;
            } else if (action.sourceId) {
                const p = newPlayers[action.sourceId];
                if (p) {
                    const pRes = !isNaN(parseInt(p.resPool)) ? parseInt(p.resPool) : 3;

                    if (action.isBasic) {
                        p.usedBasicAttack = true;
                        p.resPool = pRes >= 10 ? pRes : pRes + 1; 
                        log += `\n>> [+1 Res] Basic Attack executed.`;
                    } else if (action.isImprovised) {
                        p.resPool = Math.max(0, pRes - 1);
                        log += `\n>> [-1 Res] Improvised Skill Matrix engaged.`;
                    } else {
                        const costDeduction = safeInt(action.cost);
                        p.resPool = Math.max(0, pRes - costDeduction);
                        if (costDeduction > 0) log += `\n>> [-${costDeduction} Res] Skill executed.`;
                    }
                }
            }

            let steamCount = 0; let combustCount = 0; let conductCount = 0; let annihilateCount = 0; let changedCount = 0;
            
            newGrid = newGrid.map((cell, idx) => {
                if (aoeHexes.includes(idx)) {
                    let cellChanged = false;
                    let newTerrain = cell.terrain;
                    let newElem = cell.terrainElement;

                    if (action.terrain && action.terrain.trim() !== '') {
                        const tCast = action.terrain.trim().toLowerCase();
                        if (cell.terrain === 'severe' && tCast !== 'clear') {
                            // Blocked by Bedrock
                        } else {
                            newTerrain = tCast === 'clear' ? null : tCast;
                            newElem = tCast === 'clear' ? null : dispCore;
                            cellChanged = true;
                            changedCount++;
                        }
                    }

                    let baseCellElem = cell.terrainElement || newElem;
                    
                    if (baseCellElem === 'Cryo' && dispCore === 'Thermal') {
                        newTerrain = 'steam'; newElem = 'Steam'; steamCount++; cellChanged = true;
                    } else if (baseCellElem === 'Toxic' && dispCore === 'Thermal') {
                        newTerrain = null; newElem = null; combustCount++; cellChanged = true;
                    } else if ((baseCellElem === 'Cryo' || baseCellElem === 'Steam') && dispCore === 'Electro') {
                        newTerrain = 'minor'; newElem = 'Electro'; conductCount++; cellChanged = true;
                    } else if ((baseCellElem === 'Void' && dispCore === 'Radiant') || (baseCellElem === 'Radiant' && dispCore === 'Void')) {
                        newTerrain = null; newElem = null; annihilateCount++; cellChanged = true;
                    }

                    if (cellChanged) return { ...cell, terrain: newTerrain, terrainElement: newElem };
                }
                return cell;
            });

            if (changedCount > 0) log += `\n>> TERRAIN SHIFT: ${changedCount} hex(es) painted.`;
            if (steamCount > 0) log += `\n>> ELEMENTAL REACTION: ${steamCount} hex(es) triggered a Steam Explosion!`;
            if (combustCount > 0) log += `\n>> ELEMENTAL REACTION: ${combustCount} hex(es) ignited in a Toxic Combustion!`;
            if (conductCount > 0) log += `\n>> ELEMENTAL REACTION: ${conductCount} hex(es) conducted Chain Lightning!`;
            if (annihilateCount > 0) log += `\n>> ELEMENTAL REACTION: ${annihilateCount} hex(es) underwent Matter Annihilation!`;

            if (deadEnemyUids.size > 0) {
                newEnemies = newEnemies.filter(e => !deadEnemyUids.has(String(e.uid)));
                newTokens = newTokens.filter(t => !(t.type === 'enemy' && deadEnemyUids.has(String(t.refId))));
            }
            
            const res = evaluateCrush(newTokens, newGrid, newPlayers, newEnemies, deadEnemyUids, log);

            if (deadEnemyUids.size > 0) {
                res.eList = res.eList.filter(e => !deadEnemyUids.has(String(e.uid)));
                newTokens = newTokens.filter(t => !(t.type === 'enemy' && deadEnemyUids.has(String(t.refId))));
            }

            return {
                ...s,
                players: res.pObj,
                encounter: { ...(s.encounter || {}), enemies: res.eList, enemyPoolTotal: newEnemyPoolTotal },
                tokens: newTokens,
                grid: newGrid,
                activeAction: null,
                globalLog: { message: res.logStr, timestamp: Date.now() }
            };
        });
    };

    const handleHexClick = (index) => {
        if (activeAction) {
            if (activeAction.type === 'move') executeMove(index);
            else if (activeAction.type === 'blink') executeBlink(index);
            else resolveCombat(index);
        } else if (paintBrush) {
            pushUpdate(s => {
                const newGrid = deepClone(s.grid?.length === 150 ? s.grid : Array(150).fill({ type: 'empty', terrain: null, terrainElement: null }));
                newGrid[index] = { ...newGrid[index], terrain: paintBrush === 'clear' ? null : paintBrush, terrainElement: null };
                
                const res = evaluateCrush(safeArray(s.tokens), newGrid, s.players || {}, s.encounter?.enemies || [], new Set(), "");
                
                let finalTokens = safeArray(s.tokens);
                let finalLog = s.globalLog;
                if (res.logStr) finalLog = { message: "TERRAIN OVERRIDE LOG:" + res.logStr, timestamp: Date.now() };

                return { ...s, grid: newGrid, encounter: { ...s.encounter, enemies: res.eList }, players: res.pObj, tokens: finalTokens, globalLog: finalLog };
            });
        }
    };

    const primeTokenMove = (t) => {
        if (!isGM && t.type === 'enemy') return alert("Access Denied: Cannot move Hostile entities.");
        if (!isGM && t.type === 'player' && String(t.refId) !== String(localId)) return alert("Access Denied: Cannot reposition other Agents.");

        let srcName = 'Unknown';
        let coreStates = [];

        if (t.type === 'enemy') {
            const e = safeArray(encounter?.enemies).find(en => String(en.uid) === String(t.refId));
            if (e) { srcName = e.name; coreStates = safeArray(e.statuses).map(st => getCoreState(st)); }
        } else if (t.type === 'player') {
            const p = players[t.refId];
            if (p) { srcName = p.name; coreStates = safeArray(p.statuses).map(st => getCoreState(st)); }
        }

        if (coreStates.includes('Stunned') || coreStates.includes('Immobilized')) return alert("System Locked: Entity is STUNNED or IMMOBILIZED and cannot reposition.");

        const rem = t.movementRemaining ?? t.speed ?? 3;
        if (rem <= 0 && encounter?.round !== 0) return alert("Movement points expended for this turn. Wait for GM to advance round or manually reset points in Inspector.");
        pushUpdate(s => ({ ...s, activeAction: { type: 'move', source: srcName, sourceId: String(t.id), isEnemy: t.type === 'enemy', isTokenId: true } }));
    };

    const addToken = (type, refId) => { 
        if (!refId) return alert("Select an entity to deploy first.");
        const finalRef = String(refId);

        pushUpdate(s => {
            const startPos = type === 'enemy' ? 7 : 142; 
            const newToken = { id: `token-${Date.now()}-${Math.floor(Math.random()*1000)}`, type, pos: startPos, facing: type === 'enemy' ? 3 : 0, speed: 3, movementRemaining: 3, refId: finalRef }; 
            return { ...s, tokens: [...safeArray(s.tokens), newToken] };
        }); 
    };

    const rotateToken = (e, id, dir) => {
        e.stopPropagation();
        pushUpdate(s => {
            const newTokens = deepClone(safeArray(s.tokens));
            const idx = newTokens.findIndex(t => String(t.id) === String(id));
            if (idx !== -1) newTokens[idx].facing = ((newTokens[idx].facing || 0) + dir + 6) % 6; 
            return { ...s, tokens: newTokens };
        });
    };
    
    const deleteToken = (e, id) => {
        e.stopPropagation();
        if (!isGM) return alert("Access Denied: Only the GM can remove tokens from the grid.");
        pushUpdate(s => ({ ...s, tokens: safeArray(s.tokens).filter(t => String(t.id) !== String(id)) }));
        if (selectedToken === id) setSelectedToken(null);
    };
    
    const clearActiveAction = () => pushUpdate(s => ({ ...s, activeAction: null }));

    const renderHexBackgrounds = () => {
        let originToken = null; let minR = 1; let maxR = 1;

        if (activeAction) {
            const tIdx = findActiveTokenIndex(activeAction, activeTokens);
            if (tIdx !== -1) originToken = activeTokens[tIdx];

            if (activeAction.type === 'move' || activeAction.type === 'blink') {
                minR = 1; maxR = 1; 
            } else if (activeAction.range) {
                const parts = String(activeAction.range).split('-');
                if (parts.length === 2) { minR = parseInt(parts[0]); maxR = parseInt(parts[1]); }
                else { minR = 0; maxR = parseInt(parts[0]); }
            }
        }
        
        const aoeHexes = activeAction ? getAoEHexes(hoveredHex !== null ? hoveredHex : -1, originToken ? originToken.pos : null, activeAction.a) : [];

        return activeGrid.map((cell, idx) => {
            const { x, y } = getHexCoords(idx);
            let bgColor = '#1e293b'; let hexBorder = 'none'; let hexZ = 1;

            let titleStr = `Hex ${idx}`;
            if (cell.terrainElement) titleStr += ` | ${cell.terrainElement}`;
            if (cell.terrain) {
                let tDesc = cell.terrain === 'minor' ? 'Movement cost doubled.' :
                            cell.terrain === 'major' ? 'Deals 5 damage at round end.' :
                            cell.terrain === 'severe' ? 'Impassable & Blocks Line-of-Sight.' :
                            cell.terrain === 'steam' ? 'Blocks Line-of-Sight. Deals 5 Kinetic damage at round end.' : '';
                titleStr += ` | [${String(cell.terrain).toUpperCase()}]: ${tDesc}`;
            }

            if (cell.terrain === 'minor') bgColor = 'rgba(234, 179, 8, 0.4)'; 
            if (cell.terrain === 'major') bgColor = 'rgba(168, 85, 247, 0.4)'; 
            if (cell.terrain === 'severe') bgColor = 'rgba(59, 130, 246, 0.4)'; 
            if (cell.terrain === 'steam') bgColor = 'rgba(148, 163, 184, 0.7)'; 

            if (encounter?.round === 0 && !activeAction && !selectedToken && !paintBrush) {
                const row = Math.floor(idx / COLS);
                if (row < 5) { bgColor = 'rgba(255, 102, 0, 0.05)'; hexBorder = '1px solid rgba(255, 102, 0, 0.1)'; } 
                else { bgColor = 'rgba(0, 240, 255, 0.05)'; hexBorder = '1px solid rgba(0, 240, 255, 0.1)'; }
            }

            const dist = originToken ? getHexDistance(originToken.pos, idx) : -1;
            let isTargetable = false; let isMovable = false; let isAoETarget = false;

            if (activeAction) {
                if (activeAction.type === 'move') {
                    if (encounter?.round === 0) {
                        const targetRow = Math.floor(idx / COLS);
                        if (originToken?.type === 'player' && targetRow >= 5) isMovable = true;
                        if (originToken?.type === 'enemy' && targetRow < 5) isMovable = true;
                    } else {
                        if (dist === 1 && cell.terrain !== 'severe') {
                            const cost = cell.terrain === 'minor' ? 2 : 1;
                            const rem = originToken?.movementRemaining ?? originToken?.speed ?? 3;
                            if (cost <= rem) isMovable = true;
                        }
                    }
                } else if (activeAction.type === 'blink') {
                    if (dist > 0 && dist <= safeInt(activeAction.m || 1) && cell.terrain !== 'severe') isMovable = true;
                } else {
                    if (dist >= minR && dist <= maxR && cell.terrain !== 'severe' && cell.terrain !== 'steam') isTargetable = true;
                    if (hoveredHex !== null && aoeHexes.includes(idx)) isAoETarget = true;
                }
            }

            if (isAoETarget) { bgColor = 'rgba(255, 0, 0, 0.6)'; hexBorder = '2px solid #ff0000'; hexZ = 10; } 
            else if (activeAction && activeAction.type === 'blink' && isMovable) { bgColor = 'rgba(59, 130, 246, 0.3)'; hexBorder = '2px dashed rgba(59, 130, 246, 0.8)'; hexZ = 5; }
            else if (isTargetable) { bgColor = 'rgba(255, 102, 0, 0.2)'; hexBorder = '2px dashed rgba(255, 102, 0, 0.8)'; hexZ = 5; } 
            else if (isMovable) { bgColor = 'rgba(34, 197, 94, 0.3)'; hexBorder = '2px dashed rgba(34, 197, 94, 0.8)'; hexZ = 5; }

            return (
                <div key={`bg-${idx}`} title={titleStr} onClick={() => handleHexClick(idx)} onMouseEnter={() => setHoveredHex(idx)} onMouseLeave={() => setHoveredHex(null)}
                    className="absolute transition-all" style={{ left: `${x}px`, top: `${y}px`, width: `${hexWidth}px`, height: `${hexHeight}px`, backgroundColor: bgColor, border: hexBorder, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', transform: 'scale(0.95)', zIndex: hexZ, cursor: activeAction ? 'crosshair' : 'pointer' }}></div>
            );
        });
    };

    const renderTokens = () => {
        const hexGroups = {};
        activeTokens.forEach(t => {
            if (!hexGroups[t.pos]) hexGroups[t.pos] = [];
            hexGroups[t.pos].push(t);
        });

        return activeTokens.map((t) => {
            const { x, y } = getHexCoords(t.pos);
            const orderInHex = hexGroups[t.pos].findIndex(tok => String(tok.id) === String(t.id));
            const offsetX = orderInHex > 0 ? orderInHex * 10 : 0;
            const offsetY = orderInHex > 0 ? orderInHex * 10 : 0;

            let displayChar = 'E'; let tBg = '#ff6600'; let txtColor = '#000000';

            if (t.type === 'enemy') {
                const linkedEnemy = safeArray(encounter?.enemies).find(e => String(e.uid) === String(t.refId));
                if (linkedEnemy) displayChar = linkedEnemy.name ? linkedEnemy.name.substring(0,2).toUpperCase() : 'E';
            }
            
            if (t.type === 'player') {
                const p = players[t.refId] || {};
                const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                
                let pClass = "Rookie";
                if (fDP >= 10) pClass = "Vanguard"; 
                else if (sDP >= 10) pClass = "Conduit"; 
                else if (bDP >= 10) pClass = "Sniper"; 
                else if (fDP >= 5 && sDP >= 5) pClass = "Paladin"; 
                else if (fDP >= 5 && bDP >= 5) pClass = "Skirmisher"; 
                else if (sDP >= 5 && bDP >= 5) pClass = "Saboteur"; 
                
                tBg = CLASS_COLORS[pClass] || '#00f0ff';
                txtColor = ['Vanguard', 'Conduit', 'Sniper'].includes(pClass) ? '#ffffff' : '#000000';
                displayChar = p.name ? p.name.substring(0,2).toUpperCase() : 'P1';
            }

            const showHoverControls = selectedToken === t.id && (isGM || (t.type === 'player' && String(t.refId) === String(localId)));

            return (
                <div 
                    key={`tok-${t.id}`} 
                    className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold transition-all cursor-pointer ${selectedToken === t.id ? 'ring-4 ring-white scale-110 shadow-lg shadow-white/50 z-40' : 'shadow-md shadow-black/80 z-30'}`}
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (activeAction) {
                            if (activeAction.type === 'move') return executeMove(t.pos);
                            if (activeAction.type === 'blink') return executeBlink(t.pos);
                            return resolveCombat(t.pos);
                        }
                        setSelectedToken(selectedToken === t.id ? null : t.id); 
                    }}
                    style={{ backgroundColor: tBg, color: txtColor, left: `${x + (hexWidth / 2 - 20) + offsetX}px`, top: `${y + (hexHeight / 2 - 20) + offsetY}px`, cursor: activeAction ? 'crosshair' : 'pointer' }}
                >
                    <div className="absolute inset-0 pointer-events-none transition-transform duration-300" style={{ transform: `rotate(${(t.facing || 0) * 60}deg)` }}>
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-black absolute top-1 left-1/2 -translate-x-1/2 transition-colors"></div>
                    </div>
                    
                    <span className="mt-1 z-10 relative pointer-events-none">{displayChar}</span>

                    {showHoverControls && ( 
                        <div className="absolute -bottom-14 flex gap-1 z-50 bg-black/80 p-1 border border-gray-600 rounded shadow-lg pointer-events-auto">
                            <button className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white hover:text-blue-600 transition-colors" onClick={(e) => rotateToken(e, t.id, -1)} title="Rotate Left">↶</button>
                            <button className="bg-[#22c55e] text-black w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white hover:border-[#22c55e] transition-colors" onClick={(e) => { e.stopPropagation(); primeTokenMove(t); }} title="Move Token">M</button>
                            <button className="bg-blue-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white hover:text-blue-600 transition-colors" onClick={(e) => rotateToken(e, t.id, 1)} title="Rotate Right">↷</button>
                            {isGM && (
                                <button className="bg-red-600 text-white w-6 h-6 flex items-center justify-center text-xs font-bold border border-black hover:bg-white hover:text-red-600 transition-colors ml-1" onClick={(e) => deleteToken(e, t.id)} title="Delete Token">✕</button>
                            )}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderTokenLabels = () => {
        const hexGroups = {};
        activeTokens.forEach(t => {
            if (!hexGroups[t.pos]) hexGroups[t.pos] = [];
            hexGroups[t.pos].push(t);
        });

        return activeTokens.map((t) => {
            const { x, y } = getHexCoords(t.pos);
            const orderInHex = hexGroups[t.pos].findIndex(tok => String(tok.id) === String(t.id));
            
            const baseOffsetX = orderInHex > 0 ? orderInHex * 10 : 0;
            const baseOffsetY = orderInHex > 0 ? orderInHex * 10 : 0;
            
            const labelFanOffsetY = orderInHex > 0 ? (orderInHex * -40) : 0;

            let hpDisplay = null; let tBg = '#ff6600'; 
            let activeStatusList = [];

            if (t.type === 'enemy') {
                const linkedEnemy = safeArray(encounter?.enemies).find(e => String(e.uid) === String(t.refId));
                if (linkedEnemy) {
                    activeStatusList = safeArray(linkedEnemy.statuses);
                    let maxRange = 1;
                    safeArray(linkedEnemy.abilities).forEach(ability => {
                        const rangeMatch = String(ability).match(/range\s+(\d+)(?:-(\d+))?/i);
                        if (rangeMatch) {
                            const r = rangeMatch[2] ? parseInt(rangeMatch[2]) : parseInt(rangeMatch[1]);
                            if (r > maxRange) maxRange = r;
                        }
                    });

                    hpDisplay = (
                        <div className="bg-black/95 text-[10px] font-bold px-2 py-1 border rounded flex flex-col items-center leading-none shadow-lg whitespace-nowrap" style={{ borderColor: '#ff6600', color: '#ff6600' }}>
                            <span className="text-white mb-0.5">{linkedEnemy.name || 'Hostile'}</span>
                            <span>T{linkedEnemy.tier || 1} | RNG {maxRange} | {linkedEnemy.currentHp} HP</span>
                        </div>
                    );
                }
            }
            
            if (t.type === 'player') {
                const p = players[t.refId] || {};
                activeStatusList = safeArray(p.statuses);
                const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                
                let pClass = "Rookie";
                if (fDP >= 10) pClass = "Vanguard"; 
                else if (sDP >= 10) pClass = "Conduit"; 
                else if (bDP >= 10) pClass = "Sniper"; 
                else if (fDP >= 5 && sDP >= 5) pClass = "Paladin"; 
                else if (fDP >= 5 && bDP >= 5) pClass = "Skirmisher"; 
                else if (sDP >= 5 && bDP >= 5) pClass = "Saboteur"; 

                const derivedMaxHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1);
                tBg = CLASS_COLORS[pClass] || '#00f0ff';
                
                hpDisplay = (
                    <div className="bg-black/95 text-[10px] font-bold px-2 py-1 border rounded flex flex-col items-center leading-none shadow-lg whitespace-nowrap" style={{ borderColor: tBg, color: tBg }}>
                        <span className="text-white mb-0.5">{p.name || 'Agent'}</span>
                        <span>{pClass} | {p.currentHp ?? derivedMaxHp} HP</span>
                    </div>
                );
            }

            if (!hpDisplay) return null;

            return (
                <div key={`label-${t.id}`} className="absolute pointer-events-none z-[100] flex flex-col items-center transition-all duration-300" style={{ left: `${x + (hexWidth / 2) + baseOffsetX}px`, top: `${y + (hexHeight / 2) - 30 + baseOffsetY + labelFanOffsetY}px`, transform: 'translate(-50%, -100%)' }}>
                    {hpDisplay}
                    {activeStatusList.length > 0 && (
                        <div className="mt-1 flex gap-1 flex-wrap justify-center">
                            {activeStatusList.map((st, i) => (
                                <span key={i} className="bg-purple-900 text-white text-[8px] font-bold px-1 py-0.5 border border-purple-500 shadow-md whitespace-nowrap">
                                    {st}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderSidebar = () => {
        const isMyTurn = encounter?.activeTurn === 'player' || encounter?.round === 0;

        if (selectedToken !== null) {
            const activeT = activeTokens.find(t => t.id === selectedToken);
            if (!activeT) return null;

            if (activeT.type === 'player') {
                const p = players[activeT.refId] || {};
                const activeWeapon = safeArmory.find(w => String(w.id) === String(p.weaponId || 'w01')) || safeArmory[0];
                
                const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                let pClass = "Rookie";
                if (fDP >= 10) pClass = "Vanguard"; 
                else if (sDP >= 10) pClass = "Conduit"; 
                else if (bDP >= 10) pClass = "Sniper"; 
                else if (fDP >= 5 && sDP >= 5) pClass = "Paladin"; 
                else if (fDP >= 5 && bDP >= 5) pClass = "Skirmisher"; 
                else if (sDP >= 5 && bDP >= 5) pClass = "Saboteur"; 

                const pColor = CLASS_COLORS[pClass] || '#00f0ff';
                let isSynergy = fDP >= (activeWeapon.reqF||0) && sDP >= (activeWeapon.reqS||0) && bDP >= (activeWeapon.reqB||0);
                const calcBaseDmg = fDP + (activeWeapon.baseDmg || 0) + (isSynergy ? (activeWeapon.bonusDmg || 0) : 0);

                const activeCoreStates = safeArray(p.statuses).map(st => getCoreState(st));
                const isStunned = activeCoreStates.includes('Stunned');
                const isShocked = activeCoreStates.includes('Shocked');
                const isImmobilized = activeCoreStates.includes('Immobilized');
                const isBlind = activeCoreStates.includes('Blind');

                const disableDefenses = isStunned || isShocked;
                const disableMovement = isStunned || isImmobilized;
                const disableAttacks = isStunned;

                const currentRes = p.resPool !== undefined ? safeInt(p.resPool) : 3;

                return (
                    <div className="w-full md:w-64 bg-[#1a222c] p-4 border font-mono flex flex-col gap-3 shrink-0 h-full overflow-y-auto" style={{ borderColor: pColor }}>
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                            <span className="font-bold tracking-widest uppercase" style={{ color: pColor }}>Player Uplink</span>
                            <button className="text-gray-400 hover:text-white" onClick={() => setSelectedToken(null)}>✕</button>
                        </div>
                        <div className="text-white text-xl font-bold uppercase flex justify-between items-center">
                            {p.name || 'Agent'}
                            <span className="text-[10px] px-2 py-0.5 bg-black border font-bold" style={{ borderColor: pColor, color: pColor }}>{pClass}</span>
                        </div>
                        
                        <div className="bg-black border border-gray-700 p-2 text-center font-bold flex items-center justify-center gap-2" style={{ color: pColor }}>
                            <div className="flex-1">
                                <div className="text-gray-500 text-[10px] uppercase">Hit Points</div>
                                {isGM || (String(activeT.refId) === String(localId)) ? (
                                    <input type="number" className="w-full bg-transparent text-center outline-none text-2xl" style={{ color: pColor }} value={p.currentHp ?? 30} onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        pushUpdate(s => {
                                            const pClone = deepClone(s.players || {});
                                            if (pClone[activeT.refId]) pClone[activeT.refId].currentHp = val;
                                            return { ...s, players: pClone };
                                        });
                                    }}/> 
                                ) : (
                                    <div className="text-2xl" style={{ color: pColor }}>{p.currentHp ?? 30}</div>
                                )}
                            </div>
                            <div className="w-px h-8 bg-gray-700"></div>
                            <div className="flex-1">
                                <div className="text-gray-500 text-[10px] uppercase" title="Remaining / Speed">Move Pts</div>
                                <div className="flex justify-center items-center gap-1">
                                    {isGM || (String(activeT.refId) === String(localId)) ? (
                                        <input type="number" className="w-6 bg-transparent text-right outline-none text-2xl" style={{ color: pColor }} value={activeT.movementRemaining ?? activeT.speed ?? 3} onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            pushUpdate(s => {
                                                const newT = deepClone(safeArray(s.tokens));
                                                const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                                if (tIdx !== -1) newT[tIdx].movementRemaining = val;
                                                return { ...s, tokens: newT };
                                            });
                                        }}/> 
                                    ) : (
                                        <div className="text-2xl" style={{ color: pColor }}>{activeT.movementRemaining ?? activeT.speed ?? 3}</div>
                                    )}
                                    <span className="text-gray-600 text-lg">/</span>
                                    {isGM || (String(activeT.refId) === String(localId)) ? (
                                        <input type="number" className="w-6 bg-transparent text-left outline-none text-lg text-gray-500" value={activeT.speed ?? 3} onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            pushUpdate(s => {
                                                const newT = deepClone(safeArray(s.tokens));
                                                const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                                if (tIdx !== -1) newT[tIdx].speed = val;
                                                return { ...s, tokens: newT };
                                            });
                                        }}/>
                                    ) : (
                                        <div className="text-lg text-gray-500">{activeT.speed ?? 3}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 p-2 mt-1">
                            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Active States</div>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {safeArray(p.statuses).length === 0 && <span className="text-xs text-gray-600">None.</span>}
                                {safeArray(p.statuses).map((st, i) => (
                                    <span key={i} title={STATE_DESCRIPTIONS[getCoreState(st)] || 'Active Status Check'} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1 cursor-help">
                                        {st} 
                                        {(isGM || String(activeT.refId) === String(localId)) && (
                                            <button className="text-red-400 hover:text-white" onClick={() => {
                                                pushUpdate(state => {
                                                    const pClone = deepClone(state.players || {});
                                                    if (pClone[activeT.refId] && pClone[activeT.refId].statuses) {
                                                        pClone[activeT.refId].statuses.splice(i, 1);
                                                    }
                                                    return { ...state, players: pClone };
                                                });
                                            }}>✕</button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            {(isGM || String(activeT.refId) === String(localId)) && (
                                <div className="flex gap-1">
                                    <input type="text" id="pState" className="flex-1 bg-black border border-gray-600 text-white text-xs p-1 outline-none" placeholder="Add Status..." />
                                    <button className="bg-purple-600 text-white px-2 font-bold text-xs hover:bg-purple-500" onClick={() => {
                                        const val = document.getElementById('pState').value;
                                        if (val) {
                                            pushUpdate(state => {
                                                const pClone = deepClone(state.players || {});
                                                if (pClone[activeT.refId]) {
                                                    pClone[activeT.refId].statuses = [...safeArray(pClone[activeT.refId].statuses), val];
                                                }
                                                return { ...state, players: pClone };
                                            });
                                            document.getElementById('pState').value = '';
                                        }
                                    }}>+</button>
                                </div>
                            )}
                        </div>

                        {(isGM || String(activeT.refId) === String(localId)) && (
                            <div className="flex gap-2 mt-2">
                                <button className={`flex-1 font-bold py-1 uppercase text-xs transition-colors ${(disableMovement || !isMyTurn) && !isGM ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#22c55e] text-black hover:bg-white'}`} disabled={(disableMovement || !isMyTurn) && !isGM} onClick={() => primeTokenMove(activeT)}>Move</button>
                                <button className={`flex-1 font-bold py-1 uppercase text-[10px] border transition-colors ${(p.usedBasicAttack || disableAttacks || !isMyTurn) && !isGM ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-black text-white hover:bg-white hover:text-black'}`} style={{ borderColor: (p.usedBasicAttack || disableAttacks || !isMyTurn) && !isGM ? 'gray' : pColor }} disabled={(p.usedBasicAttack || disableAttacks || !isMyTurn) && !isGM} onClick={() => {
                                    if (!isGM && !isMyTurn) return alert("System Locked: Hostile turn in progress.");
                                    if (!isGM && disableAttacks) return alert("System Locked: Agent is STUNNED.");
                                    if (!isGM && p.usedBasicAttack) return alert("System Locked: Basic attack already executed this turn.");
                                    
                                    let finalRange = isBlind ? '1' : (activeWeapon.range || '1');
                                    if (isBlind && !isGM) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes.");

                                    pushUpdate(s => ({ ...s, activeAction: { type: 'target', isBasic: true, isImprovised: false, originalCost: 0, m: 0, coreMobility: '', effectName: '', terrain: '', desc: '', a: 0, u: 0, source: String(p.name || 'Player'), sourceId: String(activeT.refId), isEnemy: false, name: String(activeWeapon.name || 'Weapon Attack'), d: safeInt(calcBaseDmg), range: String(finalRange), elementRaw: String(activeWeapon.element || 'Kinetic'), elementCore: String(getCoreElement(activeWeapon.element || 'Kinetic')), effectCore: '', cost: 0 } }))
                                }}>{(disableAttacks && !isGM) ? 'LOCKED' : (p.usedBasicAttack && !isGM ? 'EXHAUSTED' : 'BASIC ATTACK')}</button>
                            </div>
                        )}
                        
                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Active Custom Cards</div>
                        {safeArray(p.customCards).length === 0 ? <div className="text-gray-600 text-xs">No cards loaded in HUD.</div> : null}
                        {safeArray(p.customCards).map(c => {
                            const dispRaw = c.elementRaw || c.element || 'Kinetic';
                            const dispCore = c.elementCore || getCoreElement(c.elementRaw || 'Kinetic');
                            const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;
                            
                            const cardCost = parseInt(c.cost) || 0;
                            const isNoFuel = currentRes < cardCost;

                            const coreMob = getCoreMobility(c.mobilityName || c.mobility || '');
                            const isBlink = safeInt(c.m) > 0 && coreMob === 'Blink';

                            return (
                                <div key={c.id || Math.random()} className="bg-black border border-[#00f0ff] p-2 text-xs relative group flex flex-col">
                                    <div className="flex-1 pr-6 pb-2">
                                        <div className="font-bold text-[#00f0ff] truncate">{c.name || 'Custom Action'}</div>
                                        <div className="text-[9px] text-gray-400 uppercase tracking-widest mb-1 border-b border-gray-800 pb-1 truncate" title={showType}>Type: {showType}</div>
                                        <div className="text-white font-bold mb-1 mt-1 text-[10px]">Cost: -{cardCost} Res</div>
                                        {c.effectName && <div title={STATE_DESCRIPTIONS[getCoreState(c.effectName)] || 'Active Status Check'} className="absolute top-2 right-2 text-purple-400 text-[10px] font-bold cursor-help">[{c.effectName}]</div>}
                                        
                                        {c.terrain && <div className="text-yellow-500 text-[10px] font-bold mt-1">Terrain: [{String(c.terrain).toUpperCase()}]</div>}
                                        {safeInt(c.m) > 0 && <div className="text-blue-400 text-[10px] font-bold mt-1">Mobility: {safeInt(c.m)} [{coreMob.toUpperCase()}]</div>}
                                        
                                        {(isGM || String(activeT.refId) === String(localId)) && (
                                            <>
                                                <button className={`mt-auto w-full font-bold py-1 uppercase transition-colors ${(isNoFuel || disableAttacks || !isMyTurn) && !isGM ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-white hover:text-black'}`} disabled={(isNoFuel || disableAttacks || !isMyTurn) && !isGM} onClick={() => {
                                                    if (!isGM && !isMyTurn) return alert("System Locked: Hostile turn in progress.");
                                                    if (!isGM && disableAttacks) return alert("System Locked: Agent is STUNNED.");
                                                    if (!isGM && isNoFuel) return alert(`System Locked: Insufficient Resonance. Required: ${cardCost}.`);
                                                    
                                                    let finalRange = isBlind ? '1' : (c.range || '1');
                                                    let finalAoe = isBlind ? 0 : (c.a || 0);
                                                    if (isBlind && !isGM) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes and AoE is zeroed.");

                                                    pushUpdate(s => ({ ...s, activeAction: { 
                                                        type: isBlink ? 'blink' : 'target',
                                                        source: String(p.name || 'Player'), sourceId: String(activeT.refId), isEnemy: false, 
                                                        name: String(c.name || 'Custom Action'), d: safeInt(c.d), a: finalAoe || 0, u: safeInt(c.u), m: safeInt(c.m), coreMobility: String(coreMob || ''),
                                                        range: String(finalRange), effectName: String(c.effectName || ''), effectCore: String(c.effectCore || getCoreState(c.effectName) || ''), 
                                                        elementRaw: String(c.elementRaw || 'Kinetic'), elementCore: String(dispCore), terrain: String(c.terrain || ''), 
                                                        desc: String(c.desc || ''), isBasic: false, isImprovised: false, originalCost: 0, cost: safeInt(cardCost) 
                                                    } }))
                                                }}>{(disableAttacks && !isGM) ? 'LOCKED' : (isNoFuel && !isGM ? 'NO FUEL' : (isBlink ? 'BLINK / DASH' : 'TARGET SKILL'))}</button>
                                            </>
                                        )}
                                    </div>
                                    <button className="absolute top-0 right-6 w-6 h-6 flex items-center justify-center bg-gray-900 border-l border-b border-gray-700 text-gray-400 hover:text-black hover:bg-[#00f0ff] transition-colors" onClick={(e) => { e.stopPropagation(); archiveEquippedCard(c); }} title="Archive to Spellbook">⤓</button>
                                    <button className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-gray-900 border-l border-b border-gray-700 text-gray-400 hover:text-white hover:bg-red-800 transition-colors" onClick={(e) => { e.stopPropagation(); updatePlayer('customCards', customCards.filter(card => String(card.id) !== String(c.id))); }}>✕</button>
                                </div>
                            );
                        })}
                    </div>
                );
            }

            if (activeT.type === 'enemy') {
                const linkedEnemy = safeArray(encounter?.enemies).find(e => String(e.uid) === String(activeT.refId));
                if (!linkedEnemy) return <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-red-500 font-mono text-red-500">Unlinked Enemy Token</div>;

                const eCoreStates = safeArray(linkedEnemy.statuses).map(st => getCoreState(st));
                const disableMovement = eCoreStates.includes('Stunned') || eCoreStates.includes('Immobilized');
                const disableAttacks = eCoreStates.includes('Stunned');
                const isBlind = eCoreStates.includes('Blind');

                return (
                    <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-[#ff6600] font-mono flex flex-col gap-3 shrink-0 h-full overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                            <span className="text-[#ff6600] font-bold tracking-widest uppercase">Hostile Bio-Scan</span>
                            <button className="text-gray-400 hover:text-white" onClick={() => setSelectedToken(null)}>✕</button>
                        </div>
                        <div className="text-white text-lg font-bold uppercase">{linkedEnemy.name}</div>
                        
                        <div className="bg-black border border-gray-700 p-2 text-center font-bold flex items-center justify-center gap-2 text-[#ff6600]">
                            <div className="flex-1">
                                <div className="text-gray-500 text-[10px] uppercase">Hit Points</div>
                                {isGM ? (
                                    <input type="number" className="w-full bg-transparent text-center outline-none text-2xl" value={linkedEnemy.currentHp} onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        pushUpdate(s => {
                                            const newE = deepClone(safeArray(s.encounter?.enemies));
                                            const eIdx = newE.findIndex(en => String(en.uid) === String(activeT.refId));
                                            if (eIdx !== -1) newE[eIdx].currentHp = val;
                                            return { ...s, encounter: { ...s.encounter, enemies: newE }};
                                        });
                                    }}/> 
                                ) : (
                                    <div className="text-2xl text-white">{linkedEnemy.currentHp}</div>
                                )}
                            </div>
                            <div className="w-px h-8 bg-gray-700"></div>
                            <div className="flex-1">
                                <div className="text-gray-500 text-[10px] uppercase" title="Remaining / Speed">Move Pts</div>
                                <div className="flex justify-center items-center gap-1">
                                    {isGM ? (
                                        <input type="number" className="w-6 bg-transparent text-right outline-none text-2xl text-[#ff6600]" value={activeT.movementRemaining ?? activeT.speed ?? 3} onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            pushUpdate(s => {
                                                const newT = deepClone(safeArray(s.tokens));
                                                const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                                if (tIdx !== -1) newT[tIdx].movementRemaining = val;
                                                return { ...s, tokens: newT };
                                            });
                                        }}/> 
                                    ) : (
                                        <div className="text-2xl text-[#ff6600]">{activeT.movementRemaining ?? activeT.speed ?? 3}</div>
                                    )}
                                    <span className="text-gray-600 text-lg">/</span>
                                    {isGM ? (
                                        <input type="number" className="w-6 bg-transparent text-left outline-none text-lg text-gray-500" value={activeT.speed ?? 3} onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            pushUpdate(s => {
                                                const newT = deepClone(safeArray(s.tokens));
                                                const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                                if (tIdx !== -1) newT[tIdx].speed = val;
                                                return { ...s, tokens: newT };
                                            });
                                        }}/>
                                    ) : (
                                        <div className="text-lg text-gray-500">{activeT.speed ?? 3}</div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 p-2 mt-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-gray-400 text-[10px] uppercase font-bold tracking-wider">Active States</span>
                                {linkedEnemy.affinity && <span className="text-[#ff6600] text-[10px] font-bold uppercase border border-[#ff6600] px-1">Type: {linkedEnemy.affinity}</span>}
                            </div>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {safeArray(linkedEnemy.statuses).length === 0 && <span className="text-xs text-gray-600">None.</span>}
                                {safeArray(linkedEnemy.statuses).map((st, i) => (
                                    <span key={i} title={STATE_DESCRIPTIONS[getCoreState(st)] || 'Active Status Check'} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1 cursor-help">
                                        {st} 
                                        {isGM && (
                                            <button className="text-red-400 hover:text-white" onClick={() => {
                                                pushUpdate(s => {
                                                    const newE = deepClone(safeArray(s.encounter?.enemies));
                                                    const eIdx = newE.findIndex(en => String(en.uid) === String(linkedEnemy.uid));
                                                    if (eIdx !== -1) {
                                                        newE[eIdx].statuses = safeArray(newE[eIdx].statuses);
                                                        newE[eIdx].statuses.splice(i, 1);
                                                    }
                                                    return { ...s, encounter: { ...s.encounter, enemies: newE } };
                                                });
                                            }}>✕</button>
                                        )}
                                    </span>
                                ))}
                            </div>
                            
                            {isGM && (
                                <div className="flex gap-1">
                                    <input type="text" id="eState" className="flex-1 bg-black border border-gray-600 text-white text-xs p-1 outline-none" placeholder="Add Status..." />
                                    <button className="bg-purple-600 text-white px-2 font-bold text-xs hover:bg-purple-500" onClick={() => {
                                        const val = document.getElementById('eState').value;
                                        if (val) {
                                            pushUpdate(s => {
                                                const newE = deepClone(safeArray(s.encounter?.enemies));
                                                const eIdx = newE.findIndex(en => String(en.uid) === String(linkedEnemy.uid));
                                                if (eIdx !== -1) {
                                                    newE[eIdx].statuses = safeArray(newE[eIdx].statuses);
                                                    newE[eIdx].statuses.push(val);
                                                }
                                                return { ...s, encounter: { ...s.encounter, enemies: newE } };
                                            });
                                            document.getElementById('eState').value = '';
                                        }
                                    }}>+</button>
                                </div>
                            )}
                        </div>

                        {isGM && (
                            <button className={`w-full font-bold py-2 mt-2 uppercase text-xs transition-colors ${disableMovement ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#22c55e] text-black hover:bg-white'}`} disabled={disableMovement} onClick={() => primeTokenMove(activeT)}>
                                {disableMovement ? 'LOCKED' : 'Prime Movement'}
                            </button>
                        )}

                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Abilities</div>
                        {safeArray(linkedEnemy.abilities).map((ability, aIdx) => {
                            const parts = String(ability).split(':');
                            const rawName = parts[0];
                            const cleanName = rawName.replace(/\[\d+\s*Res\]/i, '').replace(/\(\d+\s*Res\)/i, '').trim();
                            const desc = parts.length > 1 ? parts.slice(1).join(':') : '';
                            
                            const dmgMatch = String(desc).match(/deals\s+(\d+)\s+(?:([a-zA-Z]+)\s+)?damage/i);
                            const parsedDmg = dmgMatch ? parseInt(dmgMatch[1]) : 0;
                            const parsedElement = (dmgMatch && dmgMatch[2]) ? dmgMatch[2] : 'Kinetic';

                            const aoeMatch = String(desc).match(/(\d+)-hex\s+radius/i) || String(desc).match(/radius\s+of\s+(\d+)/i);
                            const shapeMatch = String(desc).match(/(line|cluster)/i);
                            let parsedAoe = isBlind ? 0 : (aoeMatch ? parseInt(aoeMatch[1]) : 0);
                            if (!isBlind && shapeMatch) {
                                if (shapeMatch[1].toLowerCase() === 'line') parsedAoe = 'line3';
                                if (shapeMatch[1].toLowerCase() === 'cluster') parsedAoe = 'cluster3';
                            }

                            const costMatch = String(ability).match(/\((\d+)\s*Res\)/i) || String(ability).match(/\[(\d+)\s*Res\]/i);
                            const eCost = costMatch ? parseInt(costMatch[1]) : 0;

                            const effMatch = String(desc).match(/applies\s+\[(.*?)\]/i);
                            const pEff = effMatch ? effMatch[1] : null;

                            const terrMatch = String(desc).match(/terrain:\s*(minor|major|severe|clear)/i);
                            const pTerrain = terrMatch ? terrMatch[1].toLowerCase() : null;

                            let eRange = "1";
                            const rangeMatch = String(desc).match(/range\s+(\d+)(?:-(\d+))?/i);
                            if (rangeMatch) {
                                eRange = rangeMatch[2] ? `${rangeMatch[1]}-${rangeMatch[2]}` : rangeMatch[1];
                            } else if (parsedAoe === 'line3' || parsedAoe === 'cluster3' || parsedAoe > 0) {
                                eRange = "0-10"; 
                            }
                            
                            return (
                                <div key={aIdx} className="bg-gray-900 border border-gray-700 p-2 text-sm flex justify-between items-center relative">
                                    <div>
                                        <span className="text-[#00f0ff] font-bold text-xs">{cleanName}</span>
                                        {pEff && <span title={STATE_DESCRIPTIONS[getCoreState(pEff)] || 'State'} className="block text-purple-400 text-[10px] mt-0.5 cursor-help">[{pEff}]</span>}
                                        {pTerrain && <span className="block text-yellow-500 text-[10px] mt-0.5">Terrain: [{pTerrain.toUpperCase()}]</span>}
                                    </div>
                                    
                                    {isGM && (
                                        <button 
                                            className={`font-bold px-2 py-1 uppercase text-[10px] border transition-colors ${disableAttacks ? 'bg-gray-800 text-gray-500 border-gray-600 cursor-not-allowed' : 'bg-gray-800 text-white hover:bg-[#ff6600] hover:text-black border-gray-600'}`} 
                                            disabled={disableAttacks} 
                                            onClick={() => {
                                                if (disableAttacks) return alert("System Locked: Entity is STUNNED.");
                                                
                                                const currentHostileRes = encounter?.enemyPoolTotal || 0;
                                                if (currentHostileRes < eCost) {
                                                    return alert(`System Locked: Insufficient Hostile Resonance.\nRequired: ${eCost} RES\nCurrent Pool: ${currentHostileRes} RES`);
                                                }

                                                let finalRange = isBlind ? '1' : eRange;
                                                let finalAoe = isBlind ? 0 : parsedAoe;
                                                if (isBlind) alert("Warning: BLIND state active. Targeting optics restricted to adjacent hexes and AoE is zeroed.");

                                                pushUpdate(s => ({ 
                                                    ...s, 
                                                    activeAction: { 
                                                        type: 'target', 
                                                        source: String(linkedEnemy.name), 
                                                        sourceId: String(linkedEnemy.uid), 
                                                        isEnemy: true, 
                                                        name: String(cleanName), 
                                                        cost: safeInt(eCost), 
                                                        d: safeInt(parsedDmg), 
                                                        a: finalAoe || 0, 
                                                        range: String(finalRange), 
                                                        effectName: String(pEff || ''), 
                                                        effectCore: String(getCoreState(pEff) || ''), 
                                                        elementRaw: String(parsedElement || 'Kinetic'), 
                                                        elementCore: String(getCoreElement(parsedElement) || 'Kinetic'), 
                                                        terrain: String(pTerrain || ''), 
                                                        isBasic: false, 
                                                        isImprovised: false, 
                                                        originalCost: safeInt(eCost), 
                                                        m: 0, 
                                                        coreMobility: '', 
                                                        u: 0, 
                                                        desc: '' 
                                                    } 
                                                }));
                                            }}
                                        >
                                            {disableAttacks ? 'LOCKED' : `TARGET (${eCost} RES)`}
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            }
        }

        if (!isGM) {
            return (
                <div className="w-full md:w-56 bg-[#1a222c] p-4 border border-slate-700 font-mono flex flex-col gap-3 shrink-0 h-full">
                    <div className="text-gray-500 text-xs text-center mt-10 p-4 border border-dashed border-gray-700">Select a token on the grid to view its bio-scan.</div>
                </div>
            );
        }

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
                    <select className="w-full bg-black border border-gray-600 p-1 text-white outline-none text-xs" value={draftPlayerId} onChange={e=>setDraftPlayerId(e.target.value)}>
                        <option value="">-- Select Player --</option>
                        {Object.entries(players).map(([id, p]) => <option key={id} value={id}>{p.name || 'Unnamed Agent'}</option>)}
                    </select>
                    <button className="w-full bg-[#00f0ff] text-black p-1.5 font-bold text-xs uppercase hover:bg-white transition-colors" onClick={()=>addToken('player', draftPlayerId)}>+ Deploy Player</button>
                </div>

                <div className="bg-gray-900 border border-gray-700 p-2 flex flex-col gap-2 mt-2">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Deploy Hostile</div>
                    <select className="w-full bg-black border border-gray-600 p-1 text-white outline-none text-xs" value={draftEnemyId} onChange={e=>setDraftEnemyId(e.target.value)}>
                        <option value="">-- Select Hostile --</option>
                        {safeArray(encounter?.enemies).map(e => <option key={e.uid} value={e.uid}>{e.name}</option>)}
                    </select>
                    <button className="w-full bg-[#ff6600] text-black p-1.5 font-bold text-xs uppercase hover:bg-white transition-colors" onClick={()=>addToken('enemy', draftEnemyId)}>+ Deploy Enemy</button>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[75vh] relative">
            {renderSidebar()}
            <div className="flex-1 bg-[#05080a] border border-slate-700 overflow-auto p-4 md:p-10 touch-none shadow-inner relative">
                
                <div className="absolute top-4 right-4 bg-black border border-gray-700 px-4 py-2 z-50 text-xs font-mono uppercase text-gray-400 shadow-md">
                    <div className="mb-1">Phase: <span className="font-bold text-white">{encounter?.round === 0 ? 'Deployment' : `Round ${encounter?.round}`}</span></div>
                    <div className="mb-1">Active Turn: <span className={`font-bold ${encounter?.activeTurn === 'player' ? 'text-[#00f0ff]' : 'text-[#ff6600]'}`}>{encounter?.activeTurn === 'player' ? 'Agents' : 'Hostiles'}</span></div>
                    <div className="border-t border-gray-700 pt-1 mt-1">Hostile Res: <span className="font-bold text-[#ff6600]">{encounter?.enemyPoolTotal || 0}</span></div>
                </div>

                {activeAction && (
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 border-2 px-6 py-3 z-50 flex items-center gap-6 shadow-lg animate-pulse ${activeAction.type === 'move' || activeAction.type === 'blink' ? 'bg-[#064e3b] border-[#22c55e] text-[#bbf7d0] shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-950 border-red-500 text-red-200 shadow-[0_0_20px_rgba(255,0,0,0.3)]'}`}>
                        <div className="font-mono">
                            <span className={`text-xs uppercase tracking-widest mb-1 ${activeAction.type === 'move' || activeAction.type === 'blink' ? 'text-[#4ade80]' : 'text-red-400'} flex items-center gap-2`}>
                                {activeAction.type === 'move' ? 'Movement Array Active' : activeAction.type === 'blink' ? 'Displacement Array Active' : 'Targeting Array Active'} // Source: {activeAction.source || 'Player'}
                            </span>
                            <span className="font-bold text-xl uppercase tracking-wider block mb-1">
                                {activeAction.type === 'move' ? 'Repositioning' : activeAction.type === 'blink' ? `Blinking [${safeInt(activeAction.m) || 1} Hexes]` : (activeAction.name || 'Action')}
                            </span>
                            {activeAction.type !== 'move' && activeAction.type !== 'blink' && (
                                <div className="text-[10px] mt-1 flex gap-3 flex-wrap font-bold text-gray-400">
                                    
                                    {activeAction.isImprovised && <span className="text-[#ff6600] animate-pulse uppercase">⚠ IMPROVISED (1d6) ⚠</span>}

                                    {activeAction.d !== undefined && <span>DMG: {activeAction.d}</span>}
                                    
                                    {activeAction.elementCore && (
                                        <span className="text-[#ff6600]">
                                            TYPE: {(activeAction.elementRaw && String(activeAction.elementRaw).toLowerCase() !== String(activeAction.elementCore).toLowerCase()) 
                                                ? `${activeAction.elementRaw} [Core: ${activeAction.elementCore}]` 
                                                : activeAction.elementCore}
                                        </span>
                                    )}

                                    {activeAction.a !== undefined && <span>AoE: {activeAction.a === 'line3' ? '3-HEX LINE' : activeAction.a === 'cluster3' ? '3-HEX CLUSTER' : `${activeAction.a} RADIUS`}</span>}
                                    
                                    {activeAction.effectName && (
                                        <span className="text-purple-400">
                                            STATE: [{(String(activeAction.effectName).toLowerCase() !== String(activeAction.effectCore || '').toLowerCase() && activeAction.effectCore) ? `${activeAction.effectName} : ${activeAction.effectCore}` : activeAction.effectName}]
                                        </span>
                                    )}
                                    
                                    {activeAction.terrain && (
                                        <span className="text-yellow-400">
                                            TERRAIN: [{String(activeAction.terrain).toUpperCase()}]
                                        </span>
                                    )}

                                    {safeInt(activeAction.m) > 0 && (
                                        <span className="text-blue-400">
                                            MOBILITY: {safeInt(activeAction.m)} [{String(activeAction.coreMobility || '').toUpperCase()}]
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                        <button className={`font-bold px-4 py-2 uppercase tracking-wider text-sm border transition-colors ${activeAction.type === 'move' || activeAction.type === 'blink' ? 'bg-[#166534] text-white border-[#22c55e] hover:bg-white hover:text-[#166534]' : 'bg-red-600 text-white border-red-500 hover:bg-white hover:text-red-600'}`} onClick={clearActiveAction}>Clear</button>
                    </div>
                )}

                <div className="relative mx-auto mt-16 md:mt-0" style={{ width: boardWidth, height: boardHeight }}>
                    {renderHexBackgrounds()}
                    {renderTokens()}
                    {renderTokenLabels()}
                </div>
            </div>
        </div>
    );
}