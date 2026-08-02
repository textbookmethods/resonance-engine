/* eslint-disable */
import React, { useState } from 'react';
import { armory } from '../data/armory';

const safeArmory = (Array.isArray(armory) && armory.length > 0) ? armory : [{ id: 'w01', name: 'Fallback', range: '1', baseDmg: 3 }];

const CLASS_COLORS = {
    Vanguard: '#ef4444', Paladin: '#eab308', Sniper: '#22c55e', 
    Conduit: '#a855f7', Skirmisher: '#f97316', Saboteur: '#ec4899', Rookie: '#00f0ff'      
};

export default function GridBoard({ players = {}, grid = [], tokens = [], encounter = {}, activeAction = null, pushUpdate }) {
    const [paintBrush, setPaintBrush] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);
    const [hoveredHex, setHoveredHex] = useState(null);
    const [draftPlayerId, setDraftPlayerId] = useState('');
    const [draftEnemyId, setDraftEnemyId] = useState('');
    
    const COLS = 15; const ROWS = 10;
    const activeGrid = grid.length === 150 ? grid : Array(150).fill({ type: 'empty', terrain: null });
    const activeTokens = tokens || [];

    const R = 36; const hexWidth = R * 2; const hexHeight = R * Math.sqrt(3); 
    const stepX = hexWidth * 0.75; const stepY = hexHeight; 
    const boardWidth = (COLS - 1) * stepX + hexWidth;
    const boardHeight = (ROWS - 1) * stepY + hexHeight + (stepY / 2);

    const getCubeCoords = (idx) => {
        const col = idx % COLS; const row = Math.floor(idx / COLS);
        const q = col; const r = row - Math.floor(col / 2); const s = -q - r;
        return { q, r, s };
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

    const findActiveTokenIndex = (action, tokenList) => {
        if (!action) return -1;
        if (action.isTokenId) return tokenList.findIndex(t => t.id === action.sourceId);
        return tokenList.findIndex(t => t.type === (action.isEnemy ? 'enemy' : 'player') && t.refId === action.sourceId);
    };

    const executeMove = (index) => {
        const targetRow = Math.floor(index / COLS);
        
        pushUpdate(s => {
            const newTokens = [...(s.tokens || [])];
            const tIdx = findActiveTokenIndex(activeAction, newTokens);
            
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

                if (t.movementRemaining <= 0) return { ...s, tokens: newTokens, activeAction: null };
                return { ...s, tokens: newTokens };
            }
            return s;
        });
    };

    const resolveCombat = (targetHex) => {
        const radius = activeAction.a || 0;
        const rawDmg = parseInt(activeAction.d) || 0;
        let newPlayers = { ...players };
        let newEnemies = [...(encounter?.enemies || [])];
        let newTokens = JSON.parse(JSON.stringify(activeTokens));
        let log = `--- COMBAT LOG: ${activeAction.name} ---\nBase Damage: ${rawDmg}\n`;
        let hitCount = 0;
        let attackerPos = null;
        
        const attIdx = findActiveTokenIndex(activeAction, newTokens);
        if (attIdx !== -1) attackerPos = getHexCoords(newTokens[attIdx].pos);

        newTokens.forEach(t => {
            if (getHexDistance(t.pos, targetHex) <= radius) {
                hitCount++;
                const targetCoords = getHexCoords(t.pos);
                
                if (t.type === 'enemy') {
                    const eIndex = newEnemies.findIndex(e => e.uid === t.refId);
                    if (eIndex !== -1) {
                        const enemy = newEnemies[eIndex];
                        let dmgRemaining = rawDmg;
                        let barriers = [...(enemy.currentBarriers || [])];
                        for (let i = 0; i < barriers.length; i++) {
                            if (barriers[i] > 0 && dmgRemaining > 0) {
                                if (barriers[i] >= dmgRemaining) { barriers[i] -= dmgRemaining; dmgRemaining = 0; } 
                                else { dmgRemaining -= barriers[i]; barriers[i] = 0; }
                            }
                        }
                        const newHp = Math.max(0, (enemy.currentHp || 0) - dmgRemaining);
                        let staggered = enemy.staggered;
                        if (enemy.currentBarriers && enemy.currentBarriers.some(b => b > 0) && barriers.every(b => b === 0)) staggered = true; 

                        // AUTOMATED STATUS EFFECT INJECTION (Enemy)
                        let updatedStatuses = [...(enemy.statuses || [])];
                        if (activeAction.effectName) {
                            updatedStatuses.push(activeAction.effectName);
                            log += `\n>> State [${activeAction.effectName}] applied to ${enemy.name}!`;
                        }

                        newEnemies[eIndex] = { ...enemy, currentBarriers: barriers, currentHp: newHp, staggered, statuses: updatedStatuses };
                        log += `\nHostile [${enemy.name}]: Took ${dmgRemaining} HP dmg (Mitigated ${rawDmg - dmgRemaining} via Barriers). HP is now ${newHp}.`;
                        if (staggered && !enemy.staggered) log += `\n>> TARGET STAGGERED!`;
                    }
                } 
                else if (t.type === 'player') {
                    const p = newPlayers[t.refId];
                    if (p) {
                        const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                        const wpn = safeArmory.find(w => w.id === (p.weaponId || 'w01')) || safeArmory[0];
                        let isSynergy = fDP >= (wpn.reqF||0) && sDP >= (wpn.reqS||0) && bDP >= (wpn.reqB||0);
                        let wpnBonus = isSynergy ? (wpn.bonusFront || 0) : 0;

                        let mitigation = 0; let mitType = "None"; let isFlanking = false;
                        
                        if (radius > 0) {
                            isFlanking = true; mitType = "AoE Target";
                        } else if (attackerPos) {
                            const dx = attackerPos.x - targetCoords.x; const dy = attackerPos.y - targetCoords.y;
                            let angle = Math.atan2(dy, dx) * (180 / Math.PI); 
                            if (angle < 0) angle += 360; 
                            const facingAngle = t.facing * 60; 
                            let diff = Math.abs(angle - facingAngle);
                            if (diff > 180) diff = 360 - diff;
                            if (diff > 60) isFlanking = true; 
                        }

                        if (isFlanking) {
                            if (p.usedEvade) { mitigation = 0; mitType = "Flanked [EVASION EXHAUSTED]"; } 
                            else { mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0); mitType = "Backline Evasion"; p.usedEvade = true; }
                        } else {
                            if (p.usedParry) { mitigation = 0; mitType = "Direct Hit [PARRY EXHAUSTED]"; } 
                            else { mitigation = fDP + (wpn.baseDmg||0) + wpnBonus; mitType = "Front Parry"; p.usedParry = true; }
                        }

                        const finalDmg = Math.max(0, rawDmg - mitigation);
                        const derivedMaxHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1);
                        p.currentHp = Math.max(0, (p.currentHp ?? derivedMaxHp) - finalDmg);
                        
                        // AUTOMATED STATUS EFFECT INJECTION (Player)
                        if (activeAction.effectName) {
                            p.statuses = [...(p.statuses || []), activeAction.effectName];
                            log += `\n>> State [${activeAction.effectName}] applied to ${p.name}!`;
                        }
                        
                        log += `\nAgent [${p.name || 'P1'}]: ${mitType} blocked ${mitigation} dmg. Took ${finalDmg} HP dmg. HP is now ${p.currentHp}.`;
                    }
                }
            }
        });

        if (hitCount === 0) log += `\nNo valid targets in radius.`;
        pushUpdate(s => ({ ...s, players: newPlayers, encounter: { ...(s.encounter || {}), enemies: newEnemies }, tokens: newTokens, activeAction: null }));
        alert(log);
    };

    const handleHexClick = (index) => {
        if (activeAction) {
            if (activeAction.type === 'move') executeMove(index);
            else resolveCombat(index);
        } else if (paintBrush) {
            pushUpdate(s => {
                const newGrid = [...(s.grid?.length === 150 ? s.grid : Array(150).fill({ type: 'empty', terrain: null }))];
                newGrid[index] = { ...newGrid[index], terrain: paintBrush === 'clear' ? null : paintBrush };
                return { ...s, grid: newGrid };
            });
        }
    };

    const primeTokenMove = (t) => {
        let srcName = 'Unknown';
        if (t.type === 'enemy') {
            const e = (encounter?.enemies || []).find(en => en.uid === t.refId);
            if (e) srcName = e.name;
        } else if (t.type === 'player') {
            const p = players[t.refId];
            if (p) srcName = p.name;
        }
        const rem = t.movementRemaining ?? t.speed ?? 3;
        if (rem <= 0 && encounter?.round !== 0) return alert("Movement points expended for this turn. Wait for GM to advance round or manually reset points in Inspector.");
        pushUpdate(s => ({ ...s, activeAction: { type: 'move', source: srcName, sourceId: t.id, isEnemy: t.type === 'enemy', isTokenId: true } }));
    };

    const addToken = (type, refId) => { 
        if (!refId) return alert("Select an entity to deploy first.");
        pushUpdate(s => {
            const startPos = type === 'enemy' ? 7 : 142; 
            const newToken = { id: Date.now(), type, pos: startPos, facing: type === 'enemy' ? 3 : 0, speed: 3, movementRemaining: 3, refId }; 
            return { ...s, tokens: [...(s.tokens || []), newToken] };
        }); 
    };

    const rotateToken = (e, id) => {
        e.stopPropagation();
        pushUpdate(s => {
            const newTokens = [...(s.tokens || [])];
            const idx = newTokens.findIndex(t => t.id === id);
            if (idx !== -1) newTokens[idx].facing = (newTokens[idx].facing + 1) % 6; 
            return { ...s, tokens: newTokens };
        });
    };
    
    const deleteToken = (e, id) => {
        e.stopPropagation();
        pushUpdate(s => ({ ...s, tokens: (s.tokens || []).filter(t => t.id !== id) }));
        if (selectedToken === id) setSelectedToken(null);
    };
    
    const clearActiveAction = () => pushUpdate(s => ({ ...s, activeAction: null }));

    const renderHexBackgrounds = () => {
        let originToken = null; let minR = 1; let maxR = 1;

        if (activeAction) {
            const tIdx = findActiveTokenIndex(activeAction, activeTokens);
            if (tIdx !== -1) originToken = activeTokens[tIdx];

            if (activeAction.type === 'move') {
                minR = 1; maxR = 1; 
            } else if (activeAction.range) {
                const parts = String(activeAction.range).split('-');
                if (parts.length === 2) { minR = parseInt(parts[0]); maxR = parseInt(parts[1]); }
                else { minR = 1; maxR = parseInt(parts[0]); }
            }
        }

        return activeGrid.map((cell, idx) => {
            const { x, y } = getHexCoords(idx);
            let bgColor = '#1e293b'; let hexBorder = 'none'; let hexZ = 1;

            if (cell.terrain === 'minor') bgColor = 'rgba(234, 179, 8, 0.4)'; 
            if (cell.terrain === 'major') bgColor = 'rgba(168, 85, 247, 0.4)'; 
            if (cell.terrain === 'severe') bgColor = 'rgba(59, 130, 246, 0.4)'; 

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
                } else {
                    if (dist >= minR && dist <= maxR && cell.terrain !== 'severe') isTargetable = true;
                    if (hoveredHex !== null && getHexDistance(idx, hoveredHex) <= (activeAction.a || 0)) isAoETarget = true;
                }
            }

            if (isAoETarget) { bgColor = 'rgba(255, 0, 0, 0.6)'; hexBorder = '2px solid #ff0000'; hexZ = 10; } 
            else if (isTargetable) { bgColor = 'rgba(255, 102, 0, 0.2)'; hexBorder = '2px dashed rgba(255, 102, 0, 0.8)'; hexZ = 5; } 
            else if (isMovable) { bgColor = 'rgba(34, 197, 94, 0.3)'; hexBorder = '2px dashed rgba(34, 197, 94, 0.8)'; hexZ = 5; }

            return (
                <div key={`bg-${idx}`} onClick={() => handleHexClick(idx)} onMouseEnter={() => setHoveredHex(idx)} onMouseLeave={() => setHoveredHex(null)}
                    className="absolute transition-all" style={{ left: `${x}px`, top: `${y}px`, width: `${hexWidth}px`, height: `${hexHeight}px`, backgroundColor: bgColor, border: hexBorder, clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)', transform: 'scale(0.95)', zIndex: hexZ, cursor: activeAction ? 'crosshair' : 'pointer' }}></div>
            );
        });
    };

    const renderTokens = () => {
        return activeTokens.map((t) => {
            const { x, y } = getHexCoords(t.pos);
            const tokensInHex = activeTokens.filter(tok => tok.pos === t.pos);
            const orderInHex = tokensInHex.findIndex(tok => tok.id === t.id);
            const offsetX = orderInHex > 0 ? orderInHex * 10 : 0;
            const offsetY = orderInHex > 0 ? orderInHex * 10 : 0;

            let hpDisplay = null; let displayChar = 'E'; let tBg = '#ff6600'; let txtColor = '#000000';
            let activeStatusList = [];

            if (t.type === 'enemy') {
                const linkedEnemy = (encounter?.enemies || []).find(e => e.uid === t.refId);
                if (linkedEnemy) {
                    activeStatusList = linkedEnemy.statuses || [];
                    hpDisplay = (
                        <div className="absolute -bottom-8 bg-black text-[#ff6600] text-[11px] font-bold px-1.5 py-0.5 border border-[#ff6600] rounded whitespace-nowrap pointer-events-none z-50 shadow-md" style={{ transform: `rotate(-${t.facing * 60}deg)` }}>
                            {linkedEnemy.currentHp} HP
                        </div>
                    );
                }
            }
            
            if (t.type === 'player') {
                const p = players[t.refId] || {};
                activeStatusList = p.statuses || [];
                const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                let pClass = "Rookie";
                if (fDP >= 10) pClass = "Vanguard"; else if (fDP >= 5 && sDP >= 5) pClass = "Paladin"; else if (bDP >= 10) pClass = "Sniper"; else if (sDP >= 10) pClass = "Conduit"; else if (fDP >= 5 && bDP >= 5) pClass = "Skirmisher"; else if (sDP >= 5 && bDP >= 5) pClass = "Saboteur"; 

                const derivedMaxHp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1);
                
                tBg = CLASS_COLORS[pClass] || '#00f0ff';
                txtColor = ['Vanguard', 'Conduit', 'Sniper'].includes(pClass) ? '#ffffff' : '#000000';
                displayChar = p.name ? p.name.substring(0,2).toUpperCase() : 'P1';
                hpDisplay = (
                    <div className="absolute -bottom-10 bg-black text-[10px] font-bold px-1.5 py-1 border rounded flex flex-col items-center leading-none pointer-events-none z-50 shadow-md" style={{ borderColor: tBg, color: tBg, transform: `rotate(-${t.facing * 60}deg)` }}>
                        <span className="text-white mb-0.5">{p.name || 'Agent'}</span>
                        <span>{pClass} | {p.currentHp ?? derivedMaxHp} HP</span>
                    </div>
                );
            }

            return (
                <div 
                    key={`tok-${t.id}`} className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold transition-transform cursor-pointer ${selectedToken === t.id ? 'ring-4 ring-white scale-110 shadow-lg shadow-white/50 z-40' : 'shadow-md shadow-black/80 z-30'}`}
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        if (activeAction) {
                            if (activeAction.type === 'move') return executeMove(t.pos);
                            return resolveCombat(t.pos);
                        }
                        setSelectedToken(selectedToken === t.id ? null : t.id); 
                    }}
                    style={{ backgroundColor: tBg, color: txtColor, left: `${x + (hexWidth / 2 - 20) + offsetX}px`, top: `${y + (hexHeight / 2 - 20) + offsetY}px`, transform: `rotate(${t.facing * 60}deg)`, cursor: activeAction ? 'crosshair' : 'pointer' }}
                >
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-black absolute top-1 hover:border-b-white transition-colors" onClick={(e) => rotateToken(e, t.id)} title="Rotate Facing Arc"></div>
                    <span className="mt-1">{displayChar}</span>
                    {hpDisplay}
                    
                    {/* NEW: Floating Status Effects Flag */}
                    {activeStatusList.length > 0 && (
                        <div className="absolute -top-6 bg-purple-900 border border-purple-400 text-white text-[8px] font-bold px-1 py-0.5 rounded flex gap-1 whitespace-nowrap z-50 pointer-events-none" style={{ transform: `rotate(-${t.facing * 60}deg)` }}>
                            {activeStatusList.join(', ')}
                        </div>
                    )}

                    {selectedToken === t.id && ( 
                        <div className="absolute -top-10 flex gap-2 z-50" style={{ transform: `rotate(-${t.facing * 60}deg)` }}>
                            <button className="bg-[#22c55e] text-black rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold border-2 border-black hover:bg-white hover:border-[#22c55e] transition-colors shadow-lg" onClick={(e) => { e.stopPropagation(); primeTokenMove(t); }} title="Move Token">M</button>
                            <button className="bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold border-2 border-black hover:bg-white hover:text-red-600 hover:border-red-600 transition-colors shadow-lg" onClick={(e) => deleteToken(e, t.id)} title="Delete Token">✕</button>
                        </div>
                    )}
                </div>
            );
        });
    };

    const renderSidebar = () => {
        if (selectedToken !== null) {
            const activeT = activeTokens.find(t => t.id === selectedToken);
            if (!activeT) return null;

            if (activeT.type === 'player') {
                const p = players[activeT.refId] || {};
                const activeWeapon = safeArmory.find(w => w.id === (p.weaponId || 'w01')) || safeArmory[0];
                
                const fDP = parseInt(p.dpFront) || 0; const sDP = parseInt(p.dpSupport) || 0; const bDP = parseInt(p.dpBack) || 0;
                let pClass = "Rookie";
                if (fDP >= 10) pClass = "Vanguard"; else if (fDP >= 5 && sDP >= 5) pClass = "Paladin"; else if (bDP >= 10) pClass = "Sniper"; else if (sDP >= 10) pClass = "Conduit"; else if (fDP >= 5 && bDP >= 5) pClass = "Skirmisher"; else if (sDP >= 5 && bDP >= 5) pClass = "Saboteur"; 

                const pColor = CLASS_COLORS[pClass] || '#00f0ff';
                let isSynergy = fDP >= (activeWeapon.reqF||0) && sDP >= (activeWeapon.reqS||0) && bDP >= (activeWeapon.reqB||0);
                const calcBaseDmg = fDP + (activeWeapon.baseDmg || 0) + (isSynergy ? (activeWeapon.bonusDmg || 0) : 0);

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
                                <input type="number" className="w-full bg-transparent text-center outline-none text-2xl" style={{ color: pColor }} value={p.currentHp ?? 30} onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    pushUpdate(s => ({ ...s, players: { ...s.players, [activeT.refId]: { ...p, currentHp: val } } }));
                                }}/> 
                            </div>
                            <div className="w-px h-8 bg-gray-700"></div>
                            <div className="flex-1">
                                <div className="text-gray-500 text-[10px] uppercase" title="Remaining / Speed">Move Pts</div>
                                <div className="flex justify-center items-center gap-1">
                                    <input type="number" className="w-6 bg-transparent text-right outline-none text-2xl" style={{ color: pColor }} value={activeT.movementRemaining ?? activeT.speed ?? 3} onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        pushUpdate(s => {
                                            const newT = [...(s.tokens || [])];
                                            const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                            if (tIdx !== -1) newT[tIdx].movementRemaining = val;
                                            return { ...s, tokens: newT };
                                        });
                                    }}/> 
                                    <span className="text-gray-600 text-lg">/</span>
                                    <input type="number" className="w-6 bg-transparent text-left outline-none text-lg text-gray-500" value={activeT.speed ?? 3} onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        pushUpdate(s => {
                                            const newT = [...(s.tokens || [])];
                                            const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                            if (tIdx !== -1) newT[tIdx].speed = val;
                                            return { ...s, tokens: newT };
                                        });
                                    }}/>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Manual Status Injector */}
                        <div className="bg-gray-900 border border-gray-700 p-2 mt-1">
                            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Active States</div>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {(p.statuses || []).length === 0 && <span className="text-xs text-gray-600">None.</span>}
                                {(p.statuses || []).map((st, i) => (
                                    <span key={i} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1">
                                        {st} <button className="text-red-400 hover:text-white" onClick={() => {
                                            const newS = [...p.statuses]; newS.splice(i, 1);
                                            pushUpdate(state => ({ ...state, players: { ...state.players, [activeT.refId]: { ...p, statuses: newS } } }));
                                        }}>✕</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                <input type="text" id="pState" className="flex-1 bg-black border border-gray-600 text-white text-xs p-1 outline-none" placeholder="Add Status..." />
                                <button className="bg-purple-600 text-white px-2 font-bold text-xs hover:bg-purple-500" onClick={() => {
                                    const val = document.getElementById('pState').value;
                                    if (val) {
                                        pushUpdate(state => ({ ...state, players: { ...state.players, [activeT.refId]: { ...p, statuses: [...(p.statuses||[]), val] } } }));
                                        document.getElementById('pState').value = '';
                                    }
                                }}>+</button>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-2">
                            <button className="flex-1 bg-[#22c55e] text-black font-bold py-1 uppercase text-xs hover:bg-white transition-colors" onClick={() => primeTokenMove(activeT)}>Move</button>
                            <button className="flex-1 bg-black text-white font-bold py-1 uppercase text-xs hover:bg-white hover:text-black border transition-colors" style={{ borderColor: pColor }} onClick={() => pushUpdate(s => ({ ...s, activeAction: { source: p.name || 'Player', sourceId: activeT.refId, isEnemy: false, name: activeWeapon.name, d: calcBaseDmg, a: 0, range: activeWeapon.range } }))}>Target</button>
                        </div>
                        
                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Active Custom Cards</div>
                        {(p.customCards || []).length === 0 ? <div className="text-gray-600 text-xs">No cards loaded in HUD.</div> : null}
                        {(p.customCards || []).map(c => (
                            <div key={c.id} className="bg-gray-900 border border-gray-700 p-2 text-sm relative">
                                <div className="font-bold mb-1" style={{ color: pColor }}>{c.name}</div>
                                <div className="text-gray-400 text-xs mb-2">Cost: {c.cost} Res | d:{c.d} a:{c.a}</div>
                                {c.effectName && <div className="absolute top-2 right-2 text-purple-400 text-[10px] font-bold">[{c.effectName}]</div>}
                                <button className="w-full bg-gray-800 text-white font-bold py-1 uppercase text-xs border border-gray-600 hover:bg-white hover:text-black transition-colors" onClick={() => pushUpdate(s => ({ ...s, activeAction: { source: p.name || 'Player', sourceId: activeT.refId, isEnemy: false, name: c.name, d: c.d, a: c.a, range: activeWeapon.range, effectName: c.effectName } }))}>Target</button>
                            </div>
                        ))}
                    </div>
                );
            }

            if (activeT.type === 'enemy') {
                const linkedEnemy = (encounter?.enemies || []).find(e => e.uid === activeT.refId);
                if (!linkedEnemy) return <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-red-500 font-mono text-red-500">Unlinked Enemy Token</div>;

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
                                <input type="number" className="w-full bg-transparent text-center outline-none text-2xl" value={linkedEnemy.currentHp} onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    pushUpdate(s => {
                                        const newE = [...(s.encounter?.enemies || [])];
                                        const eIdx = newE.findIndex(en => en.uid === activeT.refId);
                                        if (eIdx !== -1) newE[eIdx].currentHp = val;
                                        return { ...s, encounter: { ...s.encounter, enemies: newE }};
                                    });
                                }}/> 
                            </div>
                            <div className="w-px h-8 bg-gray-700"></div>
                            <div className="flex-1">
                                <div className="text-gray-500 text-[10px] uppercase" title="Remaining / Speed">Move Pts</div>
                                <div className="flex justify-center items-center gap-1">
                                    <input type="number" className="w-6 bg-transparent text-right outline-none text-2xl text-[#ff6600]" value={activeT.movementRemaining ?? activeT.speed ?? 3} onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        pushUpdate(s => {
                                            const newT = [...(s.tokens || [])];
                                            const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                            if (tIdx !== -1) newT[tIdx].movementRemaining = val;
                                            return { ...s, tokens: newT };
                                        });
                                    }}/> 
                                    <span className="text-gray-600 text-lg">/</span>
                                    <input type="number" className="w-6 bg-transparent text-left outline-none text-lg text-gray-500" value={activeT.speed ?? 3} onChange={(e) => {
                                        const val = parseInt(e.target.value) || 0;
                                        pushUpdate(s => {
                                            const newT = [...(s.tokens || [])];
                                            const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                            if (tIdx !== -1) newT[tIdx].speed = val;
                                            return { ...s, tokens: newT };
                                        });
                                    }}/>
                                </div>
                            </div>
                        </div>

                        {/* NEW: Manual Status Injector for Enemies */}
                        <div className="bg-gray-900 border border-gray-700 p-2 mt-1">
                            <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">Active States</div>
                            <div className="flex flex-wrap gap-1 mb-2">
                                {(linkedEnemy.statuses || []).length === 0 && <span className="text-xs text-gray-600">None.</span>}
                                {(linkedEnemy.statuses || []).map((st, i) => (
                                    <span key={i} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1">
                                        {st} <button className="text-red-400 hover:text-white" onClick={() => {
                                            pushUpdate(s => {
                                                const newE = [...(s.encounter?.enemies || [])];
                                                const eIdx = newE.findIndex(en => en.uid === linkedEnemy.uid);
                                                if (eIdx !== -1) newE[eIdx].statuses.splice(i, 1);
                                                return { ...s, encounter: { ...s.encounter, enemies: newE } };
                                            });
                                        }}>✕</button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-1">
                                <input type="text" id="eState" className="flex-1 bg-black border border-gray-600 text-white text-xs p-1 outline-none" placeholder="Add Status..." />
                                <button className="bg-purple-600 text-white px-2 font-bold text-xs hover:bg-purple-500" onClick={() => {
                                    const val = document.getElementById('eState').value;
                                    if (val) {
                                        pushUpdate(s => {
                                            const newE = [...(s.encounter?.enemies || [])];
                                            const eIdx = newE.findIndex(en => en.uid === linkedEnemy.uid);
                                            if (eIdx !== -1) newE[eIdx].statuses.push(val);
                                            return { ...s, encounter: { ...s.encounter, enemies: newE } };
                                        });
                                        document.getElementById('eState').value = '';
                                    }
                                }}>+</button>
                            </div>
                        </div>

                        <button className="w-full bg-[#22c55e] text-black font-bold py-2 mt-2 uppercase text-xs hover:bg-white transition-colors" onClick={() => primeTokenMove(activeT)}>Prime Movement</button>

                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Abilities</div>
                        {(linkedEnemy.abilities || []).map((ability, aIdx) => {
                            const parts = (ability || '').split(':');
                            const rawName = parts[0];
                            const cleanName = rawName.replace(/\[\d+\s*Res\]/i, '').replace(/\(\d+\s*Res\)/i, '').trim();
                            const desc = parts.length > 1 ? parts.slice(1).join(':') : '';
                            const dmgMatch = desc.match(/deals\s+(\d+)\s+damage/i);
                            const aoeMatch = desc.match(/(\d+)-hex\s+radius/i) || desc.match(/radius\s+of\s+(\d+)/i);
                            
                            // Regex grabs any bracketed effect text e.g. "applies [Poison]"
                            const effMatch = desc.match(/applies\s+\[(.*?)\]/i);
                            const pEff = effMatch ? effMatch[1] : null;

                            let eRange = "1";
                            const rangeMatch = desc.match(/range\s+(\d+)(?:-(\d+))?/i);
                            if (rangeMatch) eRange = rangeMatch[2] ? `${rangeMatch[1]}-${rangeMatch[2]}` : rangeMatch[1];
                            
                            return (
                                <div key={aIdx} className="bg-gray-900 border border-gray-700 p-2 text-sm flex justify-between items-center relative">
                                    <div>
                                        <span className="text-[#00f0ff] font-bold text-xs">{cleanName}</span>
                                        {pEff && <span className="block text-purple-400 text-[10px] mt-0.5">[{pEff}]</span>}
                                    </div>
                                    <button className="bg-gray-800 text-white font-bold px-2 py-1 uppercase text-[10px] border border-gray-600 hover:bg-[#ff6600] hover:text-black transition-colors" onClick={() => pushUpdate(s => ({ ...s, activeAction: { source: linkedEnemy.name, sourceId: linkedEnemy.uid, isEnemy: true, name: cleanName, d: (dmgMatch ? parseInt(dmgMatch[1]) : 0), a: (aoeMatch ? parseInt(aoeMatch[1]) : 0), range: eRange, effectName: pEff } }))}>Target</button>
                                </div>
                            );
                        })}
                    </div>
                );
            }
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
                        {(encounter?.enemies || []).map(e => <option key={e.uid} value={e.uid}>{e.name}</option>)}
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
                    <div>Active Turn: <span className={`font-bold ${encounter?.activeTurn === 'player' ? 'text-[#00f0ff]' : 'text-[#ff6600]'}`}>{encounter?.activeTurn === 'player' ? 'Agents' : 'Hostiles'}</span></div>
                </div>

                {activeAction && (
                    <div className={`absolute top-4 left-1/2 -translate-x-1/2 border-2 px-6 py-3 z-50 flex items-center gap-6 shadow-lg animate-pulse ${activeAction.type === 'move' ? 'bg-[#064e3b] border-[#22c55e] text-[#bbf7d0] shadow-[0_0_20px_rgba(34,197,94,0.3)]' : 'bg-red-950 border-red-500 text-red-200 shadow-[0_0_20px_rgba(255,0,0,0.3)]'}`}>
                        <div className="font-mono">
                            <span className={`text-xs uppercase tracking-widest block mb-1 ${activeAction.type === 'move' ? 'text-[#4ade80]' : 'text-red-400'}`}>
                                {activeAction.type === 'move' ? 'Movement Array Active' : 'Targeting Array Active'} // Source: {activeAction.source}
                            </span>
                            <span className="font-bold text-xl uppercase tracking-wider">
                                {activeAction.type === 'move' ? 'Repositioning' : activeAction.name}
                            </span>
                            {activeAction.type !== 'move' && (
                                <div className="text-xs mt-1">
                                    {activeAction.d !== undefined && <span className="mr-3">DMG: {activeAction.d}</span>}
                                    {activeAction.a !== undefined && <span className="mr-3">AoE Rad: {activeAction.a}</span>}
                                    {activeAction.effectName && <span className="text-purple-400 ml-3">State: [{activeAction.effectName}]</span>}
                                </div>
                            )}
                        </div>
                        <button className={`font-bold px-4 py-2 uppercase tracking-wider text-sm border transition-colors ${activeAction.type === 'move' ? 'bg-[#166534] text-white border-[#22c55e] hover:bg-white hover:text-[#166534]' : 'bg-red-600 text-white border-red-500 hover:bg-white hover:text-red-600'}`} onClick={clearActiveAction}>Clear</button>
                    </div>
                )}

                <div className="relative mx-auto mt-16 md:mt-0" style={{ width: boardWidth, height: boardHeight }}>
                    {renderHexBackgrounds()}
                    {renderTokens()}
                </div>
            </div>
        </div>
    );
}