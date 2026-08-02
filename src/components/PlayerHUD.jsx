/* eslint-disable */
import React, { useState } from 'react';
import { armory } from '../data/armory';

const safeArmory = (Array.isArray(armory) && armory.length > 0) ? armory : [{ id: 'w01', name: 'System Fallback', range: '1', baseDmg: 3 }];

export default function PlayerHUD({ players = {}, localId, encounter = {}, tokens = [], pushUpdate }) {
    const [builder, setBuilder] = useState({ name: '', d: 0, u: 0, a: 0, alpha: 1, effectName: '' });

    const player = players[localId] || {};

    const safePush = (updater) => { if (typeof pushUpdate === 'function') pushUpdate(updater); };
    const updatePlayer = (key, val) => safePush(s => ({ ...s, players: { ...(s.players || {}), [localId]: { ...(s.players?.[localId] || {}), [key]: val } } }));
    const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
    
    const front = safeInt(player.dpFront); const supp = safeInt(player.dpSupport); const back = safeInt(player.dpBack);

    let activeClass = "Rookie";
    if (front >= 10) activeClass = "Vanguard"; else if (front >= 5 && supp >= 5) activeClass = "Paladin";
    else if (back >= 10) activeClass = "Sniper"; else if (supp >= 10) activeClass = "Conduit";
    else if (front >= 5 && back >= 5) activeClass = "Skirmisher"; else if (supp >= 5 && back >= 5) activeClass = "Saboteur"; 

    const derivedMaxHp = 20 + (front * 3) + (supp * 2) + (back * 1);
    const activeWeapon = safeArmory.find(w => w.id === (player.weaponId || 'w01')) || safeArmory[0];
    const isSynergy = front >= (activeWeapon.reqF || 0) && supp >= (activeWeapon.reqS || 0) && back >= (activeWeapon.reqB || 0);

    let bonusDmg = 0; let bonusFront = 0; let bonusSupp = 0; let bonusBack = 0;
    if (isSynergy) { bonusDmg = activeWeapon.bonusDmg || 0; bonusFront = activeWeapon.bonusFront || 0; bonusSupp = activeWeapon.bonusSupp || 0; bonusBack = activeWeapon.bonusBack || 0; }

    const calcBaseDmg = front + (activeWeapon.baseDmg || 0) + bonusDmg;
    const calcFrontParry = front + (activeWeapon.baseDmg || 0) + bonusFront;
    const calcSuppIntercept = supp + 3 + bonusSupp;
    const calcBackEvasion = back + 3 + bonusBack;
    const calcCost = Math.ceil((builder.alpha || 1) * ((builder.d || 0) + (builder.u || 0) + Math.pow((builder.a || 0), 2)));

    const myToken = tokens.find(t => t.type === 'player' && t.refId === localId);

    const refreshTurn = () => {
        safePush(s => {
            const newP = { ...(s.players?.[localId] || {}), usedParry: false, usedIntercept: false, usedEvade: false };
            const newT = [...(s.tokens || [])];
            const tIdx = newT.findIndex(t => t.type === 'player' && t.refId === localId);
            if (tIdx !== -1) newT[tIdx].movementRemaining = newT[tIdx].speed ?? 3;
            return { ...s, players: { ...s.players, [localId]: newP }, tokens: newT };
        });
    };

    const saveToHUD = () => {
        const cards = player.customCards || [];
        if (cards.length >= 4) return alert("HUD is full (Max 4). Remove an active skill first to make room.");
        updatePlayer('customCards', [...cards, { ...builder, name: builder.name || 'Custom Action', cost: calcCost, id: Date.now() }]);
    };
    
    const saveToSpellbook = () => {
        const archived = player.savedSkills || [];
        updatePlayer('savedSkills', [...archived, { ...builder, name: builder.name || 'Custom Action', cost: calcCost, id: Date.now() }]);
        alert("Ability archived to Spellbook!");
    };
    
    const rollImprovised = () => {
        updatePlayer('resPool', Math.max(0, safeInt(player.resPool) - 1));
        const roll = Math.floor(Math.random() * 6) + 1;
        let outcome = "";
        if (roll <= 2) outcome = "Backlash (Failure & Consequence)";
        else if (roll <= 4) outcome = "Surge (Success at a Cost)";
        else outcome = "Cascade (Total Success)";
        alert(`Improvised Skill Roll: ${roll}\nOutcome: ${outcome}`);
    };

    const primeWeapon = () => { safePush(s => ({ ...s, activeAction: { source: player.name || 'Player', sourceId: localId, isEnemy: false, name: activeWeapon.name, d: calcBaseDmg, a: 0, range: activeWeapon.range } })); };
    const primeCard = (c) => { safePush(s => ({ ...s, activeAction: { source: player.name || 'Player', sourceId: localId, isEnemy: false, name: c.name || 'Custom Action', d: c.d, a: c.a, u: c.u, range: activeWeapon.range, effectName: c.effectName } })); };

    const reqString = (w) => {
        if (!w.reqF && !w.reqS && !w.reqB) return 'No Req';
        let r = [];
        if (w.reqF) r.push(`${w.reqF}F`); if (w.reqS) r.push(`${w.reqS}S`); if (w.reqB) r.push(`${w.reqB}B`);
        return `Req: ${r.join('/')}`;
    };

    const customCards = player.customCards || [];
    const statuses = player.statuses || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-sm">
            <div className="bg-[#1a222c] p-4 border border-slate-700">
                <div className="flex justify-between items-center border-b border-gray-700 pb-2 mb-4">
                    <h2 className="text-[#00f0ff] font-bold text-xl">Character Uplink</h2>
                    <div className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-900 px-2 py-1 border border-gray-700">
                        Movement: <span className="text-white">{myToken ? `${myToken.movementRemaining ?? myToken.speed ?? 3} / ${myToken.speed ?? 3}` : 'Off Grid'}</span>
                    </div>
                </div>

                <div className="space-y-4">
                    <input className="w-full bg-black border border-gray-600 p-2 text-white outline-none" placeholder="Callsign / Name" value={player.name || ''} onChange={e => updatePlayer('name', e.target.value)} />

                    <div className="flex gap-4">
                        <div className="flex-1 bg-black border border-red-500 p-2">
                            <label className="text-red-500 text-[10px] font-bold tracking-widest block mb-1 text-center">CURRENT HP</label>
                            <input type="number" className="w-full bg-transparent text-white text-3xl font-bold outline-none text-center" value={player.currentHp ?? derivedMaxHp} onChange={e => updatePlayer('currentHp', safeInt(e.target.value))} />
                        </div>
                        <div className="flex-1 bg-black border border-gray-600 p-2">
                            <label className="text-gray-400 text-[10px] font-bold tracking-widest block mb-1 text-center">MAX HP (DP SCALED)</label>
                            <div className="w-full bg-transparent text-gray-400 text-3xl font-bold text-center mt-1 cursor-not-allowed" title="Max HP automatically scales via Discipline Points.">{derivedMaxHp}</div>
                        </div>
                    </div>
                    
                    {/* Active Statuses Display */}
                    <div className="bg-gray-900 border border-gray-700 p-2 mt-2">
                        <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-2">Active States (Buffs/Debuffs)</div>
                        <div className="flex flex-wrap gap-1">
                            {statuses.length === 0 && <span className="text-xs text-gray-600 italic">Systems Nominal. No active states.</span>}
                            {statuses.map((st, i) => (
                                <span key={i} className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 flex items-center gap-1">
                                    {st} <button className="text-red-400 hover:text-white" onClick={() => {
                                        const newS = [...statuses]; newS.splice(i, 1);
                                        updatePlayer('statuses', newS);
                                    }}>✕</button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-[#ff6600] font-bold text-lg bg-black p-2 border border-gray-700">
                        <span>CLASS:</span><span>{activeClass}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Front DP</label>
                            <input type="number" className="w-full bg-black border border-gray-600 p-1 text-center text-white" value={front} onChange={e=>updatePlayer('dpFront', safeInt(e.target.value))} />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Support DP</label>
                            <input type="number" className="w-full bg-black border border-gray-600 p-1 text-center text-white" value={supp} onChange={e=>updatePlayer('dpSupport', safeInt(e.target.value))} />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Back DP</label>
                            <input type="number" className="w-full bg-black border border-gray-600 p-1 text-center text-white" value={back} onChange={e=>updatePlayer('dpBack', safeInt(e.target.value))} />
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
                                <button className="bg-[#00f0ff] text-black font-bold px-3 py-1 uppercase hover:bg-white transition-colors" onClick={primeWeapon}>Target</button>
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
                                <span className={player.usedParry ? "text-red-500 line-through mr-2" : "text-[#00f0ff] mr-2"}>Front Parry:</span>
                                <span className={player.usedParry ? "text-gray-600" : (bonusFront>0 ? "font-bold text-[#ff6600]" : "font-bold text-white")}>{calcFrontParry}</span>
                            </div>
                            <button className={`text-[10px] px-2 py-1 font-bold border ${player.usedParry ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedParry} onClick={() => updatePlayer('usedParry', true)}>
                                {player.usedParry ? 'EXHAUSTED' : 'AVAILABLE'}
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2">
                            <div>
                                <span className={player.usedIntercept ? "text-red-500 line-through mr-2" : "text-[#00f0ff] mr-2"}>Support Intercept:</span>
                                <span className={player.usedIntercept ? "text-gray-600" : (bonusSupp>0 ? "font-bold text-[#ff6600]" : "font-bold text-white")}>{calcSuppIntercept}</span>
                            </div>
                            <button className={`text-[10px] px-2 py-1 font-bold border ${player.usedIntercept ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedIntercept} onClick={() => updatePlayer('usedIntercept', true)}>
                                {player.usedIntercept ? 'EXHAUSTED' : 'AVAILABLE'}
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between border-l-2 border-gray-700 pl-2">
                            <div>
                                <span className={player.usedEvade ? "text-red-500 line-through mr-2" : "text-[#00f0ff] mr-2"}>Backline Evasion:</span>
                                <span className={player.usedEvade ? "text-gray-600" : (bonusBack>0 ? "font-bold text-[#ff6600]" : "font-bold text-white")}>{calcBackEvasion}</span>
                            </div>
                            <button className={`text-[10px] px-2 py-1 font-bold border ${player.usedEvade ? 'bg-red-900 border-red-500 text-red-200 cursor-not-allowed' : 'bg-transparent border-gray-600 text-gray-400 hover:text-white'}`} disabled={player.usedEvade} onClick={() => updatePlayer('usedEvade', true)}>
                                {player.usedEvade ? 'EXHAUSTED' : 'AVAILABLE'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-[#1a222c] p-4 border border-slate-700 flex flex-col items-center justify-center">
                <h2 className="text-[#ff6600] font-bold text-2xl tracking-widest mb-4">RESONANCE</h2>
                <div className="text-8xl text-white mb-6 drop-shadow-[0_0_15px_rgba(255,102,0,0.5)]">{player.resPool || 0}<span className="text-3xl text-gray-500">/10</span></div>
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, safeInt(player.resPool) + 1))}>+1 Basic Atk</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, safeInt(player.resPool) + 2))}>+2 Tag-Team</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, safeInt(player.resPool) + 2))}>+2 Exploit</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, safeInt(player.resPool) + 1))}>+1 Banter</button>
                </div>
                <button className="w-full bg-[#00f0ff] text-black font-bold p-3 uppercase hover:bg-white transition-colors" onClick={rollImprovised}>Improvised Skill (-1 Res)</button>
            </div>

            <div className="bg-[#1a222c] p-4 border border-slate-700">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2">Synthesis Matrix</h2>
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center mb-4"><span className="text-gray-300">Skill Name:</span><input type="text" className="w-40 bg-black border border-[#00f0ff] p-1 text-white outline-none font-bold" placeholder="Custom Action" value={builder.name} onChange={e=>setBuilder({...builder, name: e.target.value})} /></div>
                    <div className="flex justify-between items-center"><span>Damage (d):</span><input type="number" className="w-16 bg-black border border-gray-600 p-1 text-center text-white" value={builder.d} onChange={e=>setBuilder({...builder, d: safeInt(e.target.value)})} /></div>
                    <div className="flex justify-between items-center"><span>Utility (u):</span><select className="w-24 bg-black border border-gray-600 p-1 text-white" value={String(builder.u)} onChange={e=>setBuilder({...builder, u: safeInt(e.target.value)})}>
                        <option value="0">0</option><option value="1">1 (Minor)</option><option value="3">3 (Major)</option><option value="5">5 (Severe)</option>
                    </select></div>
                    
                    {/* NEW: State Effect Input reveals if u > 0 */}
                    {builder.u > 0 && (
                        <div className="flex justify-between items-center animate-fade-in">
                            <span className="text-purple-400">State Effect:</span>
                            <input type="text" className="w-32 bg-black border border-purple-500 p-1 text-white outline-none text-right" placeholder="e.g. Stunned" value={builder.effectName || ''} onChange={e=>setBuilder({...builder, effectName: e.target.value})} />
                        </div>
                    )}

                    <div className="flex justify-between items-center"><span>AoE Radius (a):</span><select className="w-24 bg-black border border-gray-600 p-1 text-white" value={String(builder.a)} onChange={e=>setBuilder({...builder, a: safeInt(e.target.value)})}>
                        <option value="0">0</option><option value="1">1 (Small)</option><option value="2">2 (Large)</option>
                    </select></div>
                    <div className="flex justify-between items-center"><span>Affinity (α):</span><select className="w-24 bg-black border border-gray-600 p-1 text-white" value={String(builder.alpha)} onChange={e=>setBuilder({...builder, alpha: parseFloat(e.target.value) || 1})}>
                        <option value="0.75">0.75 (Synergy)</option><option value="1">1.0 (Neutral)</option><option value="2">2.0 (Resist)</option>
                    </select></div>
                </div>
                <div className="bg-black p-3 border border-[#ff6600] flex justify-between items-center text-[#ff6600] font-bold text-xl mb-4"><span>COST:</span><span>{calcCost} RES</span></div>
                <div className="flex gap-2 mb-4">
                    <button className="flex-1 bg-[#00f0ff] text-black font-bold border border-[#00f0ff] p-2 hover:bg-white text-xs uppercase" onClick={saveToHUD}>Equip</button>
                    <button className="flex-1 bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700 text-white text-xs uppercase" onClick={saveToSpellbook}>Archive</button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {customCards.map(c => (
                        <div key={c.id} className="bg-black border border-[#00f0ff] p-2 text-xs relative group flex flex-col">
                            <div className="flex-1 pr-6 pb-2">
                                <div className="font-bold text-[#00f0ff] mb-1 truncate">{c.name || 'Custom Action'}</div>
                                <div className="text-white font-bold mb-1">Cost: -{c.cost} Res</div>
                            </div>
                            <button className="mt-auto w-full bg-[#00f0ff] text-black font-bold py-1 hover:bg-white uppercase" onClick={() => primeCard(c)}>Target</button>
                            <button className="absolute top-0 right-0 w-6 h-6 flex items-center justify-center bg-gray-900 border-l border-b border-gray-700 text-gray-400 hover:text-white hover:bg-red-800 transition-colors" onClick={(e) => { e.stopPropagation(); updatePlayer('customCards', customCards.filter(card => card.id !== c.id)); }}>✕</button>
                            {c.effectName && <div className="absolute -bottom-2 -right-2 bg-purple-900 text-white text-[8px] px-1 border border-purple-500">{c.effectName}</div>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}