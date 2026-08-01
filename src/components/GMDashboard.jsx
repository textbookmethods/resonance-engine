import { bestiary } from '../data/bestiary';

export default function GMDashboard({ encounter = {}, pushUpdate }) {
    // Helper function to update encounter state and push to Firebase
    const updateEnc = (updates) => pushUpdate(s => ({ ...s, encounter: { ...s.encounter, ...updates } }));

    const addEnemy = (bestiaryId) => {
        const template = bestiary.find(b => b.id === bestiaryId);
        if (!template) return;
        
        const newEnemy = { 
            ...template, 
            uid: Date.now(), 
            currentHp: template.hp, 
            currentBarriers: [...template.barriers],
            siphonActive: false,
            staggered: false
        };
        const currentEnemies = encounter.enemies || [];
        updateEnc({ enemies: [...currentEnemies, newEnemy] });
    };

    const isOverload = encounter.round >= 4;
    const enemiesList = encounter.enemies || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-mono text-sm">
            {/* Round & Initiative Control */}
            <div className={`p-4 border ${isOverload ? 'bg-red-950 border-red-500' : 'bg-[#1a222c] border-slate-700'}`}>
                <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-700 pb-2">Encounter Flow</h2>
                <div className="text-center mb-6">
                    <div className="text-gray-400 mb-1">CURRENT ROUND</div>
                    <div className="text-6xl font-bold text-white mb-4">{encounter.round || 1}</div>
                    {isOverload && (
                        <div className="bg-black text-red-500 font-bold p-2 border border-red-500 mb-4 animate-pulse">
                            SYSTEM OVERLOAD ACTIVE
                        </div>
                    )}
                    <div className="flex gap-2">
                        <button 
                            className="flex-1 bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700 text-white" 
                            onClick={() => updateEnc({ round: Math.max(1, (encounter.round || 1) - 1) })}
                        >
                            - Prev
                        </button>
                        <button 
                            className="flex-1 bg-[#00f0ff] text-black font-bold p-2 hover:bg-white transition-colors" 
                            onClick={() => updateEnc({ round: (encounter.round || 1) + 1 })}
                        >
                            Next +
                        </button>
                    </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <div className="text-gray-400 mb-2">Enemy Pool Tracker</div>
                    <div className="flex items-center justify-between bg-black border border-gray-600 p-2">
                        <button 
                            className="px-3 text-lg font-bold text-gray-400 hover:text-[#ff6600]" 
                            onClick={() => updateEnc({ enemyPoolTotal: Math.max(0, (encounter.enemyPoolTotal || 0) - 1)})}
                        >
                            -
                        </button>
                        <span className="text-2xl text-[#ff6600] font-bold">{encounter.enemyPoolTotal || 0}</span>
                        <button 
                            className="px-3 text-lg font-bold text-gray-400 hover:text-[#ff6600]" 
                            onClick={() => updateEnc({ enemyPoolTotal: (encounter.enemyPoolTotal || 0) + 1})}
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* Active Enemy Tracker */}
            <div className="lg:col-span-3 bg-[#1a222c] p-4 border border-slate-700 flex flex-col h-[75vh]">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h2 className="text-[#ff6600] font-bold text-xl">Active Hostiles</h2>
                    <select 
                        className="bg-black text-white border border-gray-600 p-2 outline-none cursor-pointer" 
                        onChange={(e) => { if(e.target.value) addEnemy(parseInt(e.target.value)); e.target.value=""; }}
                    >
                        <option value="">+ Deploy Entity...</option>
                        {bestiary.map(b => <option key={b.id} value={b.id}>T{b.tier} - {b.name}</option>)}
                    </select>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {enemiesList.length === 0 && (
                        <div className="text-gray-500 text-center mt-10 border border-dashed border-gray-700 p-8">
                            No active entities on the grid.
                        </div>
                    )}
                    
                    {enemiesList.map((enemy, idx) => (
                        <div key={enemy.uid} className={`border p-3 flex justify-between items-center ${enemy.staggered ? 'border-yellow-500 bg-yellow-900 bg-opacity-20' : 'border-gray-700 bg-black'}`}>
                            <div className="flex-1">
                                <div className="font-bold text-white text-lg flex items-center gap-2">
                                    {enemy.name} 
                                    <span className="text-xs bg-gray-800 px-2 py-0.5 text-gray-400 border border-gray-600">T{enemy.tier}</span>
                                    {enemy.staggered && <span className="text-xs bg-yellow-500 text-black px-1 font-bold">STAGGERED</span>}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Actions: <span className="text-gray-300">{enemy.abilities.join(', ')}</span></div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <button 
                                    className={`text-xs p-1 px-2 border transition-colors ${enemy.siphonActive ? 'bg-purple-900 border-purple-500 text-white shadow-[0_0_8px_rgba(168,85,247,0.4)]' : 'border-gray-600 text-gray-500 hover:text-white hover:border-gray-400'}`}
                                    onClick={() => {
                                        const newEnemies = [...enemiesList];
                                        newEnemies[idx].siphonActive = !newEnemies[idx].siphonActive;
                                        updateEnc({ enemies: newEnemies });
                                    }}
                                >
                                    Siphon Aura
                                </button>
                                
                                {enemy.currentBarriers && enemy.currentBarriers.map((bar, bIdx) => (
                                    <div key={bIdx} className="text-center">
                                        <div className="text-[10px] text-[#00f0ff] font-bold">BARRIER {bIdx+1}</div>
                                        <input 
                                            type="number" 
                                            className="w-12 bg-gray-900 border border-[#00f0ff] text-center text-white outline-none focus:bg-gray-800 transition-colors" 
                                            value={bar} 
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                const newEnemies = [...enemiesList];
                                                newEnemies[idx].currentBarriers[bIdx] = val;
                                                if (val <= 0 && bar > 0) newEnemies[idx].staggered = true; // Auto-stagger on break
                                                updateEnc({ enemies: newEnemies });
                                            }} 
                                        />
                                    </div>
                                ))}
                                
                                <div className="text-center">
                                    <div className="text-[10px] text-[#ff6600] font-bold">BASE HP</div>
                                    <input 
                                        type="number" 
                                        className="w-16 bg-gray-900 border border-[#ff6600] text-center text-white font-bold text-lg outline-none focus:bg-gray-800 transition-colors" 
                                        value={enemy.currentHp} 
                                        onChange={(e) => {
                                            const newEnemies = [...enemiesList];
                                            newEnemies[idx].currentHp = parseInt(e.target.value) || 0;
                                            updateEnc({ enemies: newEnemies });
                                        }} 
                                    />
                                </div>
                                
                                <button 
                                    className="text-gray-600 hover:text-red-500 ml-2 text-xl font-bold transition-colors px-2" 
                                    title="Remove Entity"
                                    onClick={() => {
                                        updateEnc({ enemies: enemiesList.filter(e => e.uid !== enemy.uid) });
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}