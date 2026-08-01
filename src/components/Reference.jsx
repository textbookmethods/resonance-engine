import { useState } from 'react';
import { bestiary } from '../data/bestiary';

export default function Reference() {
    const [filter, setFilter] = useState('');
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-sm">
            {/* Bestiary Search Database */}
            <div className="bg-[#1a222c] p-4 border border-slate-700 lg:col-span-2 h-[75vh] flex flex-col">
                <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-700 pb-2">Database: Bestiary</h2>
                
                {/* Filters */}
                <div className="flex gap-2 mb-4">
                    {['', 'Minion', 'Striker', 'Elite', 'Boss'].map(f => (
                        <button 
                            key={f} 
                            className={`px-3 py-1 border transition-colors ${filter === f ? 'bg-[#00f0ff] text-black border-[#00f0ff] font-bold' : 'border-gray-600 text-gray-400 hover:bg-gray-800 hover:text-white'}`} 
                            onClick={() => setFilter(f)}
                        >
                            {f || 'ALL ENTITIES'}
                        </button>
                    ))}
                </div>
                
                {/* Entity Roster */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 pb-4">
                    {bestiary.filter(b => filter ? b.type === filter : true).map(b => (
                        <div key={b.id} className="bg-black border border-gray-700 p-4 hover:border-gray-500 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div className="font-bold text-[#ff6600] text-lg uppercase tracking-wide">{b.name}</div>
                                <div className="text-xs text-gray-400 bg-gray-900 px-2 py-1 border border-gray-700 font-bold">
                                    T{b.tier} {b.type}
                                </div>
                            </div>
                            
                            <div className="flex justify-between text-gray-300 mb-1 border-b border-gray-800 pb-1">
                                <span>Base HP:</span> 
                                <span className="text-white font-bold">{b.hp}</span>
                            </div>
                            
                            <div className="flex justify-between text-[#00f0ff] mb-3">
                                <span>Barriers:</span> 
                                <span>{b.barriers.length > 0 ? b.barriers.join(' / ') : 'None'}</span>
                            </div>
                            
                            <div className="pt-2">
                                <div className="text-[10px] text-gray-500 mb-1 tracking-widest uppercase font-bold">Signature Abilities:</div>
                                <ul className="text-gray-400 list-disc list-inside space-y-1 text-xs">
                                    {b.abilities.map((a, i) => (
                                        <li key={i} className="leading-snug">{a}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Rules Directory */}
            <div className="bg-[#1a222c] p-4 border border-slate-700 h-[75vh] overflow-y-auto space-y-6">
                <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-700 pb-2">Quick Directory</h2>
                
                <div>
                    <span className="text-[#00f0ff] font-bold block mb-2 uppercase tracking-wide">Ability Cost Math</span>
                    <div className="bg-black p-3 border border-gray-700 text-gray-300 text-center text-lg shadow-inner">
                        R_cost = ⌈ α × (d + u + a²) ⌉
                    </div>
                </div>

                <div>
                    <span className="text-[#00f0ff] font-bold block mb-1 uppercase tracking-wide">Tabula Rasa (Grid Rules)</span>
                    <p className="text-gray-400 leading-relaxed text-xs">All combat should start on featureless terrain to encourage player interaction. Players and GMs must negotiate and build the battlefield dynamically using their abilities.</p>
                </div>
                
                <div>
                    <span className="text-[#00f0ff] font-bold block mb-1 uppercase tracking-wide">Hex Movement</span>
                    <p className="text-gray-400 leading-relaxed text-xs">All adjacent hexes cost 1 movement point. Minor terrain doubles movement cost. Major terrain blocks shift abilities. Severe terrain is impassable and breaks line of sight.</p>
                </div>
                
                <div>
                    <span className="text-[#00f0ff] font-bold block mb-1 uppercase tracking-wide">Facing Arcs</span>
                    <p className="text-gray-400 leading-relaxed text-xs">Tokens command a 3-hex front arc. Frontline parries only mitigate damage originating within this arc. Attacks from the rear 3 hexes count as Flanking and bypass base mitigation entirely.</p>
                </div>
                
                <div>
                    <span className="text-[#00f0ff] font-bold block mb-1 uppercase tracking-wide">Round 4 Overload</span>
                    <p className="text-gray-400 leading-relaxed text-xs">At Round 4, atmospheric Resonance reaches critical mass. All Resonance generation doubles, and all damage sources are multiplied by 1.5x.</p>
                </div>
            </div>
        </div>
    );
}