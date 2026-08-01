/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function PlayerHUD({ player = {}, encounter = {}, pushUpdate }) {
    const [builder, setBuilder] = useState({ d: 0, u: 0, a: 0, alpha: 1.0 });

    const updatePlayer = (key, val) => pushUpdate(s => ({ ...s, player: { ...s.player, [key]: val } }));
    
    const calcCost = Math.ceil(builder.alpha * (builder.d + builder.u + Math.pow(builder.a, 2)));

    const saveCard = () => {
        const cards = player.customCards || [];
        if (cards.length >= 4) return alert("Max 4 custom cards.");
        updatePlayer('customCards', [...cards, { ...builder, cost: calcCost, id: Date.now() }]);
    };

    const rollImprovised = () => {
        updatePlayer('resPool', Math.max(0, (player.resPool || 0) - 1));
        const roll = Math.floor(Math.random() * 6) + 1;
        let outcome = "";
        if (roll <= 2) outcome = "Backlash (Failure & Consequence)";
        else if (roll <= 4) outcome = "Surge (Success at a Cost)";
        else outcome = "Cascade (Total Success)";
        alert(`Improvised Skill Roll: ${roll}\nOutcome: ${outcome}`);
    };

    let activeClass = "Rookie";
    const front = player.dpFront || 0;
    const supp = player.dpSupport || 0;
    const back = player.dpBack || 0;
    const wpn = player.weaponBase || 3;

    if (front >= 10) activeClass = "Vanguard";
    else if (front >= 5 && supp >= 5) activeClass = "Paladin";
    else if (back >= 10) activeClass = "Sniper";
    else if (supp >= 10) activeClass = "Conduit";
    else if (front >= 5 && back >= 5) activeClass = "Skirmisher";

    const activeEnemies = encounter?.enemies || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-sm">
            {/* Stats Panel */}
            <div className="bg-[#1a222c] p-4 border border-slate-700">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2">Character Uplink</h2>
                <div className="space-y-4">
                    <input className="w-full bg-black border border-gray-600 p-2 text-white outline-none" placeholder="Callsign / Name" value={player.name || ''} onChange={e => updatePlayer('name', e.target.value)} />
                    
                    <div className="flex justify-between items-center text-[#ff6600] font-bold text-lg bg-black p-2 border border-gray-700">
                        <span>CLASS:</span>
                        <span>{activeClass}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Front DP</label>
                            <input type="number" className="w-full bg-black border border-gray-600 p-1 text-center text-white" value={front} onChange={e=>updatePlayer('dpFront', parseInt(e.target.value)||0)} />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Support DP</label>
                            <input type="number" className="w-full bg-black border border-gray-600 p-1 text-center text-white" value={supp} onChange={e=>updatePlayer('dpSupport', parseInt(e.target.value)||0)} />
                        </div>
                        <div>
                            <label className="text-gray-400 text-xs block mb-1">Back DP</label>
                            <input type="number" className="w-full bg-black border border-gray-600 p-1 text-center text-white" value={back} onChange={e=>updatePlayer('dpBack', parseInt(e.target.value)||0)} />
                        </div>
                    </div>

                    <div className="mt-4 border-t border-gray-700 pt-4 space-y-2">
                        <h3 className="text-gray-400 mb-2">Free Actions Mitigation</h3>
                        <div className="flex justify-between"><span>Base Dmg (Wpn + Front):</span> <span className="text-white">{wpn + front}</span></div>
                        <div className="flex justify-between"><span>Front Mitig (Front + Wpn):</span> <span className="text-white">{front + wpn}</span></div>
                        <div className="flex justify-between"><span>Support Mitig (Supp + 3):</span> <span className="text-white">{supp + 3}</span></div>
                        <div className="flex justify-between"><span>Backline Mitig (Back + 3):</span> <span className="text-white">{back + 3}</span></div>
                    </div>
                </div>
            </div>

            {/* Resonance Pool */}
            <div className="bg-[#1a222c] p-4 border border-slate-700 flex flex-col items-center justify-center">
                <h2 className="text-[#ff6600] font-bold text-2xl tracking-widest mb-4">RESONANCE</h2>
                <div className="text-8xl text-white mb-6 drop-shadow-[0_0_15px_rgba(255,102,0,0.5)]">
                    {player.resPool || 0}<span className="text-3xl text-gray-500">/10</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 w-full mb-4">
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, (player.resPool || 0) + 1))}>+1 Basic Atk</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, (player.resPool || 0) + 2))}>+2 Tag-Team</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, (player.resPool || 0) + 2))}>+2 Exploit</button>
                    <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 p-2" onClick={()=>updatePlayer('resPool', Math.min(10, (player.resPool || 0) + 1))}>+1 Banter</button>
                </div>
                
                <button className="w-full bg-[#00f0ff] text-black font-bold p-3 uppercase hover:bg-white transition-colors" onClick={rollImprovised}>
                    Improvised Skill (-1 Res)
                </button>
            </div>

            {/* Ability Builder */}
            <div className="bg-[#1a222c] p-4 border border-slate-700">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2">Synthesis Matrix</h2>
                <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                        <span>Damage (d):</span>
                        <input type="number" className="w-16 bg-black border border-gray-600 p-1 text-center text-white" value={builder.d} onChange={e=>setBuilder({...builder, d: parseInt(e.target.value)||0})} />
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Utility Weight (u):</span>
                        <select className="w-24 bg-black border border-gray-600 p-1 text-white" value={builder.u} onChange={e=>setBuilder({...builder, u: parseInt(e.target.value)})}>
                            <option value="0">0</option>
                            <option value="1">1 (Minor)</option>
                            <option value="3">3 (Major)</option>
                            <option value="5">5 (Severe)</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>AoE Radius (a):</span>
                        <select className="w-24 bg-black border border-gray-600 p-1 text-white" value={builder.a} onChange={e=>setBuilder({...builder, a: parseInt(e.target.value)})}>
                            <option value="0">0</option>
                            <option value="1">1 (Small)</option>
                            <option value="2">2 (Large)</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center">
                        <span>Affinity (α):</span>
                        <select className="w-24 bg-black border border-gray-600 p-1 text-white" value={builder.alpha} onChange={e=>setBuilder({...builder, alpha: parseFloat(e.target.value)})}>
                            <option value="0.75">0.75 (Synergy)</option>
                            <option value="1.0">1.0 (Neutral)</option>
                            <option value="2.0">2.0 (Resist)</option>
                        </select>
                    </div>
                </div>
                
                <div className="bg-black p-3 border border-[#ff6600] flex justify-between items-center text-[#ff6600] font-bold text-xl mb-4">
                    <span>COST:</span><span>{calcCost} RES</span>
                </div>
                
                <button className="w-full bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700 text-white mb-4" onClick={saveCard}>
                    Install to HUD
                </button>

                {/* Saved Custom Cards */}
                <div className="grid grid-cols-2 gap-2">
                    {(player.customCards || []).map(c => (
                        <div key={c.id} className="bg-black border border-[#00f0ff] p-2 text-xs cursor-pointer hover:bg-gray-900" onClick={() => updatePlayer('resPool', Math.max(0, (player.resPool || 0) - c.cost))}>
                            <div className="font-bold text-[#00f0ff] mb-1">Custom Action</div>
                            <div className="text-white">Cost: -{c.cost} Res</div>
                            <div className="text-gray-500">d:{c.d} u:{c.u} a:{c.a}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Active Targets Overlay (Read-Only for Players) */}
            <div className="lg:col-span-3 bg-[#1a222c] p-4 border border-slate-700 mt-2">
                <h2 className="text-[#ff6600] font-bold text-xl mb-4 border-b border-gray-700 pb-2">Active Targets</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {activeEnemies.length === 0 && (
                        <div className="text-gray-500 text-sm">No hostile entities currently detected.</div>
                    )}
                    {activeEnemies.map(enemy => (
                        <div key={enemy.uid} className={`bg-black border p-3 ${enemy.staggered ? 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 'border-gray-700'}`}>
                            <div className="font-bold text-white mb-2 flex justify-between items-start">
                                <span className="uppercase tracking-wide">{enemy.name || 'Unknown Entity'} <span className="text-[10px] text-gray-400 bg-gray-800 px-1 ml-1 border border-gray-600">T{enemy.tier || 1}</span></span>
                                {enemy.staggered && <span className="text-[10px] bg-yellow-500 text-black px-1 font-bold">STAGGERED</span>}
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs font-bold">
                                {(enemy.currentBarriers || []).map((bar, i) => (
                                    <div key={i} className="bg-gray-900 border border-[#00f0ff] px-2 py-1 text-[#00f0ff]">BARRIER {i+1}: {bar}</div>
                                ))}
                                <div className="bg-gray-900 border border-[#ff6600] px-2 py-1 text-[#ff6600]">HP: {enemy.currentHp || 0}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}