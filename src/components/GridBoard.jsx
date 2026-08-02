/* eslint-disable */
import React, { useState } from 'react';
import { armory } from '../data/armory';

const safeArmory = (Array.isArray(armory) && armory.length > 0) ? armory : [{ id: 'w01', name: 'Fallback', range: '1', baseDmg: 3 }];

const CLASS_COLORS = {
    Vanguard: '#ef4444', Paladin: '#eab308', Sniper: '#22c55e', 
    Conduit: '#a855f7', Skirmisher: '#f97316', Saboteur: '#ec4899', Rookie: '#00f0ff'      
};

export default function GridBoard({ player = {}, grid = [], tokens = [], encounter = {}, activeAction = null, pushUpdate }) {
    const [paintBrush, setPaintBrush] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);
    const [hoveredHex, setHoveredHex] = useState(null);
    const [draftPlayer, setDraftPlayer] = useState({ name: 'Agent', pClass: 'Rookie' });
    
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

    const findActiveTokenIndex = (action, tokenList, enc) => {
        if (!action) return -1;
        if (action.isTokenId) {
            return tokenList.findIndex(t => t.id === action.sourceId);
        } else if (action.isEnemy) {
            const eTokens = tokenList.filter(t => t.type === 'enemy').sort((a,b) => a.id - b.id);
            const eIndex = (enc?.enemies || []).findIndex(e => e.uid === action.sourceId);
            if (eIndex !== -1 && eTokens[eIndex]) return tokenList.findIndex(t => t.id === eTokens[eIndex].id);
        } else {
            return tokenList.findIndex(t => t.type === 'player' && t.name === action.source);
        }
        return -1;
    };

    const executeMove = (index) => {
        const targetRow = Math.floor(index / COLS);
        
        pushUpdate(s => {
            const newTokens = [...(s.tokens || [])];
            const tIdx = findActiveTokenIndex(activeAction, newTokens, s.encounter);
            
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

                if (currentRemaining < cost) {
                    alert(`Insufficient movement points! Cost: ${cost}, Remaining: ${currentRemaining}`);
                    return s;
                }

                t.movementRemaining = currentRemaining - cost;
                t.pos = index;
                
                if (targetCell.terrain === 'major') {
                    alert("⚠️ HAZARD WARNING: Token entered Major Terrain. Stop movement and manually resolve environmental damage or status effects.");
                }

                if (t.movementRemaining <= 0) {
                    return { ...s, tokens: newTokens, activeAction: null };
                } else {
                    return { ...s, tokens: newTokens };
                }
            }
            return s;
        });
    };

    const resolveCombat = (targetHex) => {
        const radius = activeAction.a || 0;
        const rawDmg = parseInt(activeAction.d) || 0;
        let newPlayer = { ...player };
        let newEnemies = [...(encounter?.enemies || [])];
        let newTokens = JSON.parse(JSON.stringify(activeTokens));
        let log = `--- COMBAT LOG: ${activeAction.name} ---\nBase Damage: ${rawDmg}\n`;
        let hitCount = 0;
        let attackerPos = null;
        
        const attIdx = findActiveTokenIndex(activeAction, newTokens, encounter);
        if (attIdx !== -1) attackerPos = getHexCoords(newTokens[attIdx].pos);

        newTokens.forEach(t => {
            if (getHexDistance(t.pos, targetHex) <= radius) {
                hitCount++;
                const targetCoords = getHexCoords(t.pos);
                
                if (t.type === 'enemy') {
                    const enemyTokens = newTokens.filter(tok => tok.type === 'enemy').sort((a,b) => a.id - b.id);
                    const tokenIndex = enemyTokens.findIndex(tok => tok.id === t.id);
                    const enemy = newEnemies[tokenIndex];
                    
                    if (enemy) {
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

                        newEnemies[tokenIndex] = { ...enemy, currentBarriers: barriers, currentHp: newHp, staggered };
                        log += `\nHostile [${enemy.name}]: Took ${dmgRemaining} HP dmg (Mitigated ${rawDmg - dmgRemaining} via Barriers). HP is now ${newHp}.`;
                        if (staggered && !enemy.staggered) log += `\n>> TARGET STAGGERED!`;
                    }
                } 
                else if (t.type === 'player') {
                    let activeClass = t.pClass || "Rookie";
                    const fDP = parseInt(newPlayer.dpFront) || 0;
                    const sDP = parseInt(newPlayer.dpSupport) || 0;
                    const bDP = parseInt(newPlayer.dpBack) || 0;
                    
                    const wpn = safeArmory.find(w => w.id === (newPlayer.weaponId || 'w01')) || safeArmory[0];
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

                    const matchesHUD = (t.name === (newPlayer.name || ''));
                    if (isFlanking) {
                        if (matchesHUD && newPlayer.usedEvade) {
                            mitigation = 0; mitType = "Flanked [EVASION EXHAUSTED]";
                        } else {
                            mitigation = bDP + 3 + (isSynergy ? (wpn.bonusBack||0) : 0);
                            mitType = "Backline Evasion";
                            if (matchesHUD) newPlayer.usedEvade = true; 
                        }
                    } else {
                        if (matchesHUD && newPlayer.usedParry) {
                            mitigation = 0; mitType = "Direct Hit [PARRY EXHAUSTED]";
                        } else {
                            mitigation = fDP + (wpn.baseDmg||0) + wpnBonus;
                            mitType = "Front Parry";
                            if (matchesHUD) newPlayer.usedParry = true; 
                        }
                    }

                    const finalDmg = Math.max(0, rawDmg - mitigation);
                    const newHp = Math.max(0, (t.hp ?? 30) - finalDmg);
                    t.hp = newHp; 
                    if (matchesHUD) newPlayer.currentHp = newHp;
                    
                    log += `\nAgent [${t.name || 'P1'}]: ${mitType} blocked ${mitigation} dmg. Took ${finalDmg} HP dmg. HP is now ${newHp}.`;
                }
            }
        });

        if (hitCount === 0) log += `\nNo valid targets in radius.`;
        pushUpdate(s => ({ ...s, player: newPlayer, encounter: { ...(s.encounter || {}), enemies: newEnemies }, tokens: newTokens, activeAction: null }));
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
        let srcName = t.name || 'Unknown';
        if (t.type === 'enemy') {
            const eToks = activeTokens.filter(tok => tok.type === 'enemy').sort((a,b) => a.id - b.id);
            const eIdx = eToks.findIndex(tok => tok.id === t.id);
            const e = (encounter?.enemies || [])[eIdx];
            if (e) srcName = e.name;
        }
        
        const rem = t.movementRemaining ?? t.speed ?? 3;
        if (rem <= 0 && encounter?.round !== 0) {
            return alert("Movement points expended for this turn. Wait for GM to advance round or manually reset points in Inspector.");
        }

        pushUpdate(s => ({ ...s, activeAction: { type: 'move', source: srcName, sourceId: t.id, isEnemy: t.type === 'enemy', isTokenId: true } }));
    };

    const addToken = (type) => { 
        pushUpdate(s => {
            const startPos = type === 'enemy' ? 7 : 142; 
            const newToken = { id: Date.now(), type, pos: startPos, facing: type === 'enemy' ? 3 : 0, speed: 3, movementRemaining: 3 }; 
            if (type === 'player') {
                newToken.name = draftPlayer.name || 'Agent';
                newToken.pClass = draftPlayer.pClass || 'Rookie';
                const isMatching = (player?.name === newToken.name);
                const fDP = isMatching ? (parseInt(player?.dpFront) || 0) : 0;
                const sDP = isMatching ? (parseInt(player?.dpSupport) || 0) : 0;
                const bDP = isMatching ? (parseInt(player?.dpBack) || 0) : 0;
                newToken.hp = 20 + (fDP * 3) + (sDP * 2) + (bDP * 1);
            }
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
            const tIdx = findActiveTokenIndex(activeAction, activeTokens, encounter);
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

            if (t.type === 'enemy') {
                const enemyTokens = activeTokens.filter(tok => tok.type === 'enemy').sort((a,b) => a.id - b.id);
                const tokenIndex = enemyTokens.findIndex(tok => tok.id === t.id);
                const linkedEnemy = (encounter?.enemies || [])[tokenIndex];
                if (linkedEnemy) {
                    hpDisplay = (
                        <div className="absolute -bottom-8 bg-black text-[#ff6600] text-[11px] font-bold px-1.5 py-0.5 border border-[#ff6600] rounded whitespace-nowrap pointer-events-none z-50 shadow-md" style={{ transform: `rotate(-${t.facing * 60}deg)` }}>
                            {linkedEnemy.currentHp} HP
                        </div>
                    );
                }
            }
            
            if (t.type === 'player') {
                const pColor = CLASS_COLORS[t.pClass] || '#00f0ff';
                tBg = pColor;
                txtColor = ['Vanguard', 'Conduit', 'Sniper'].includes(t.pClass) ? '#ffffff' : '#000000';
                displayChar = t.name ? t.name.substring(0,2).toUpperCase() : 'P1';
                hpDisplay = (
                    <div className="absolute -bottom-10 bg-black text-[10px] font-bold px-1.5 py-1 border rounded flex flex-col items-center leading-none pointer-events-none z-50 shadow-md" style={{ borderColor: pColor, color: pColor, transform: `rotate(-${t.facing * 60}deg)` }}>
                        <span className="text-white mb-0.5">{t.name || 'Agent'}</span>
                        <span>{t.pClass} | {t.hp ?? 30} HP</span>
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
                const activeWeapon = safeArmory.find(w => w.id === (player?.weaponId || 'w01')) || safeArmory[0];
                const pColor = CLASS_COLORS[activeT.pClass] || '#00f0ff';
                
                const fDP = parseInt(player?.dpFront) || 0; const sDP = parseInt(player?.dpSupport) || 0; const bDP = parseInt(player?.dpBack) || 0;
                let isSynergy = fDP >= (activeWeapon.reqF||0) && sDP >= (activeWeapon.reqS||0) && bDP >= (activeWeapon.reqB||0);
                const calcBaseDmg = fDP + (activeWeapon.baseDmg || 0) + (isSynergy ? (activeWeapon.bonusDmg || 0) : 0);

                return (
                    <div className="w-full md:w-64 bg-[#1a222c] p-4 border font-mono flex flex-col gap-3 shrink-0 h-full overflow-y-auto" style={{ borderColor: pColor }}>
                        <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-2">
                            <span className="font-bold tracking-widest uppercase" style={{ color: pColor }}>Player Uplink</span>
                            <button className="text-gray-400 hover:text-white" onClick={() => setSelectedToken(null)}>✕</button>
                        </div>
                        <div className="text-white text-xl font-bold uppercase flex justify-between items-center">
                            {activeT.name}
                            <span className="text-[10px] px-2 py-0.5 bg-black border font-bold" style={{ borderColor: pColor, color: pColor }}>{activeT.pClass}</span>
                        </div>
                        
                        <div className="bg-black border border-gray-700 p-2 text-center font-bold flex items-center justify-center gap-2" style={{ color: pColor }}>
                            <div className="flex-1">
                                <div className="text-gray-500 text-[10px] uppercase">Hit Points</div>
                                <input type="number" className="w-full bg-transparent text-center outline-none text-2xl" style={{ color: pColor }} value={activeT.hp ?? 30} onChange={(e) => {
                                    const val = parseInt(e.target.value) || 0;
                                    pushUpdate(s => {
                                        const newT = [...(s.tokens || [])];
                                        const tIdx = newT.findIndex(tok => tok.id === activeT.id);
                                        if (tIdx !== -1) newT[tIdx].hp = val;
                                        let newP = { ...s.player };
                                        if (newP.name === activeT.name) newP.currentHp = val;
                                        return { ...s, tokens: newT, player: newP };
                                    });
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

                        <div className="flex gap-2 mt-2">
                            <button className="flex-1 bg-[#22c55e] text-black font-bold py-1 uppercase text-xs hover:bg-white transition-colors" onClick={() => primeTokenMove(activeT)}>Move</button>
                            <button className="flex-1 bg-black text-white font-bold py-1 uppercase text-xs hover:bg-white hover:text-black border transition-colors" style={{ borderColor: pColor }} onClick={() => pushUpdate(s => ({ ...s, activeAction: { source: activeT.name || 'Player', isEnemy: false, name: activeWeapon.name, d: calcBaseDmg, a: 0, range: activeWeapon.range } }))}>Target</button>
                        </div>
                        
                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Active Custom Cards</div>
                        {(player?.customCards || []).length === 0 ? <div className="text-gray-600 text-xs">No cards loaded in HUD.</div> : null}
                        {(player?.customCards || []).map(c => (
                            <div key={c.id} className="bg-gray-900 border border-gray-700 p-2 text-sm">
                                <div className="font-bold mb-1" style={{ color: pColor }}>{c.name}</div>
                                <div className="text-gray-400 text-xs mb-2">Cost: {c.cost} Res | d:{c.d} a:{c.a}</div>
                                <button className="w-full bg-gray-800 text-white font-bold py-1 uppercase text-xs border border-gray-600 hover:bg-white hover:text-black transition-colors" onClick={() => pushUpdate(s => ({ ...s, activeAction: { source: activeT.name || 'Player', isEnemy: false, name: c.name, d: c.d, a: c.a, range: activeWeapon.range } }))}>Target</button>
                            </div>
                        ))}
                    </div>
                );
            }

            if (activeT.type === 'enemy') {
                const enemyTokens = activeTokens.filter(tok => tok.type === 'enemy').sort((a,b) => a.id - b.id);
                const tokenIndex = enemyTokens.findIndex(tok => tok.id === activeT.id);
                const linkedEnemy = (encounter?.enemies || [])[tokenIndex];

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
                                    pushUpdate(s => {
                                        const newE = [...(s.encounter?.enemies || [])];
                                        if (newE[tokenIndex]) newE[tokenIndex].currentHp = parseInt(e.target.value) || 0;
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

                        <button className="w-full bg-[#22c55e] text-black font-bold py-2 mt-2 uppercase text-xs hover:bg-white transition-colors" onClick={() => primeTokenMove(activeT)}>Prime Movement</button>

                        <div className="mt-2 text-gray-400 text-xs uppercase font-bold tracking-wider">Abilities</div>
                        {(linkedEnemy.abilities || []).map((ability, aIdx) => {
                            const parts = (ability || '').split(':');
                            const rawName = parts[0];
                            const cleanName = rawName.replace(/\[\d+\s*Res\]/i, '').replace(/\(\d+\s*Res\)/i, '').trim();
                            const desc = parts.length > 1 ? parts.slice(1).join(':') : '';
                            const dmgMatch = desc.match(/deals\s+(\d+)\s+damage/i);
                            const aoeMatch = desc.match(/(\d+)-hex\s+radius/i) || desc.match(/radius\s+of\s+(\d+)/i);
                            let eRange = "1";
                            const rangeMatch = desc.match(/range\s+(\d+)(?:-(\d+))?/i);
                            if (rangeMatch) eRange = rangeMatch[2] ? `${rangeMatch[1]}-${rangeMatch[2]}` : rangeMatch[1];
                            
                            return (
                                <div key={aIdx} className="bg-gray-900 border border-gray-700 p-2 text-sm flex justify-between items-center">
                                    <span className="text-[#00f0ff] font-bold text-xs">{cleanName}</span>
                                    <button className="bg-gray-800 text-white font-bold px-2 py-1 uppercase text-[10px] border border-gray-600 hover:bg-[#ff6600] hover:text-black transition-colors" onClick={() => pushUpdate(s => ({ ...s, activeAction: { source: linkedEnemy.name, sourceId: linkedEnemy.uid, isEnemy: true, name: cleanName, d: (dmgMatch ? parseInt(dmgMatch[1]) : 0), a: (aoeMatch ? parseInt(aoeMatch[1]) : 0), range: eRange } }))}>Target</button>
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
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Configure Agent</div>
                    <input className="w-full bg-black border border-gray-600 p-1 text-white outline-none text-xs" placeholder="Agent Name" value={draftPlayer.name} onChange={e=>setDraftPlayer({...draftPlayer, name: e.target.value})} />
                    <select className="w-full bg-black border border-gray-600 p-1 text-white outline-none text-xs" value={draftPlayer.pClass} onChange={e=>setDraftPlayer({...draftPlayer, pClass: e.target.value})}>
                        <option value="Rookie">Rookie (Cyan)</option>
                        <option value="Vanguard">Vanguard (Red)</option>
                        <option value="Paladin">Paladin (Yellow)</option>
                        <option value="Sniper">Sniper (Green)</option>
                        <option value="Conduit">Conduit (Purple)</option>
                        <option value="Skirmisher">Skirmisher (Orange)</option>
                        <option value="Saboteur">Saboteur (Pink)</option>
                    </select>
                    <button className="w-full bg-[#00f0ff] text-black p-1.5 font-bold text-xs uppercase hover:bg-white transition-colors" onClick={()=>addToken('player')}>+ Deploy Player</button>
                </div>
                <button className="w-full bg-[#ff6600] text-black p-2 font-bold text-sm uppercase hover:bg-white transition-colors" onClick={()=>addToken('enemy')}>+ Deploy Enemy</button>
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