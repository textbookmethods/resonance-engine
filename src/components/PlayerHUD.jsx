import { useState } from 'react';

export default function PlayerHUD({ player, pushUpdate }) {
    const [builder, setBuilder] = useState({ d: 0, u: 0, a: 0, alpha: 1.0 });

    const updatePlayer = (key, val) => pushUpdate(s => ({ ...s, player: { ...s.player, [key]: val } }));
    const calcCost = Math.ceil(builder.alpha * (builder.d + builder.u + Math.pow(builder.a, 2)));

    const saveCard = () => {
        const cards = player.customCards || [];
        if (cards.length >= 4) return alert("Max 4 custom cards.");
        updatePlayer('customCards', [...cards, { ...builder, cost: calcCost, id: Date.now() }]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-sm">
            {/* Stats Panel */}
            <div className="bg-[#1a222c] p-4 border border-slate-700">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2">Character Uplink</h2>
                <div className="space-y-4">
                    <input className="w-full bg-black border border-gray-600 p-2 text-white" placeholder="Name" value={player.name} onChange={e=>updatePlayer('name', e.target.value)} />
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div><label className="text-gray-400 text-xs">Front DP</label><input type="number" className="w-full bg-black border border-gray-600 p-1 text-center" value={player.dpFront} onChange={e=>updatePlayer('dpFront', parseInt(e.target.value)||0)} /></div>
                        <div><label className="text-gray-400 text-xs">Support DP</label><input type="number" className="w-full bg-black border border-gray-600 p-1 text-center" value={player.dpSupport} onChange={e=>updatePlayer('dpSupport', parseInt(e.target.value)||0)} /></div>
                        <div><label className="text-gray-400 text-xs">Back DP</label><input type="number" className="w-full bg-black border border-gray-600 p-1 text-center" value={player.dpBack} onChange={e=>updatePlayer('dpBack', parseInt(e.target.value)||0)} /></div>
                    </div>
                </div>
            </div>

            {/* Resonance Pool */}
            <div className="bg-[#1a222c] p-4 border border-slate-700 flex flex-col items-center justify-center">
                <h2 className="text-[#ff6600] font-bold text-2xl tracking-widest mb-4">RESONANCE</h2>
                <div className="text-8xl text-white mb-6 drop-shadow-[0_0_15px_rgba(255,102,0,0.5)]">
                    {player.resPool}<span className="text-3xl text-gray-500">/10</span>
                </div>
                <div className="flex gap-2">
                    <button className="bg-gray-800 p-2 border border-gray-600" onClick={()=>updatePlayer('resPool', Math.max(0, player.resPool - 1))}>-1 (Cost)</button>
                    <button className="bg-[#00f0ff] text-black font-bold p-2" onClick={()=>updatePlayer('resPool', Math.min(10, player.resPool + 1))}>+1 (Gain)</button>
                </div>
            </div>

            {/* Ability Builder */}
            <div className="bg-[#1a222c] p-4 border border-slate-700">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2">Synthesis Matrix</h2>
                <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                        <span>Damage (d):</span>
                        <input type="number" className="w-16 bg-black border border-gray-600 text-center" value={builder.d} onChange={e=>setBuilder({...builder, d: parseInt(e.target.value)||0})} />
                    </div>
                    <div className="flex justify-between">
                        <span>Utility (u):</span>
                        <select className="w-24 bg-black border border-gray-600" value={builder.u} onChange={e=>setBuilder({...builder, u: parseInt(e.target.value)})}>
                            <option value="0">0</option><option value="1">1 (Minor)</option><option value="3">3 (Major)</option><option value="5">5 (Severe)</option>
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <span>AoE (a):</span>
                        <select className="w-24 bg-black border border-gray-600" value={builder.a} onChange={e=>setBuilder({...builder, a: parseInt(e.target.value)})}>
                            <option value="0">0</option><option value="1">1 (Small)</option><option value="2">2 (Large)</option>
                        </select>
                    </div>
                </div>
                <div className="bg-black p-3 border border-[#ff6600] flex justify-between items-center text-[#ff6600] font-bold text-xl mb-2">
                    <span>COST:</span><span>{calcCost} RES</span>
                </div>
                <button className="w-full bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700" onClick={saveCard}>Install to HUD</button>
            </div>
        </div>
    );
}