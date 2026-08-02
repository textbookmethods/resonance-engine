/* eslint-disable */
import React from 'react';

export default function Spellbook({ players = {}, localId, pushUpdate }) {
    const player = players[localId] || {};
    const savedSkills = player.savedSkills || [];

    const safePush = (updater) => { if (typeof pushUpdate === 'function') pushUpdate(updater); };
    const updatePlayer = (key, val) => safePush(s => ({ ...s, players: { ...(s.players || {}), [localId]: { ...(s.players?.[localId] || {}), [key]: val } } }));

    const deleteSkill = (id) => {
        updatePlayer('savedSkills', savedSkills.filter(s => s.id !== id));
    };

    const equipToHUD = (skill) => {
        const currentHUD = player.customCards || [];
        if (currentHUD.length >= 4) {
            return alert("HUD is full. Remove an active skill on the Combat HUD first.");
        }
        updatePlayer('customCards', [...currentHUD, { ...skill, id: Date.now() }]);
        alert("Equipped to Combat HUD!");
    };

    return (
        <div className="bg-[#1a222c] p-6 md:p-10 border border-slate-700 min-h-[75vh] font-mono">
            <div className="flex justify-between items-center border-b border-[#00f0ff] pb-4 mb-6">
                <div>
                    <h2 className="text-[#00f0ff] font-bold text-3xl uppercase tracking-widest">Grimoire Archive</h2>
                    <p className="text-gray-400 text-sm">Permanent Storage for Synthesized Actions</p>
                </div>
                <div className="text-right">
                    <div className="text-[#ff6600] font-bold text-xl">{savedSkills.length}</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest">Archived</div>
                </div>
            </div>

            {savedSkills.length === 0 ? (
                <div className="text-gray-500 text-center mt-20 border border-dashed border-gray-700 p-10">
                    No synthesized actions archived. Use the Synthesis Matrix in your Combat HUD to save abilities here.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {savedSkills.map(skill => (
                        <div key={skill.id} className="bg-black border border-gray-700 p-4 relative group flex flex-col transition-colors hover:border-[#00f0ff]">
                            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold" onClick={() => deleteSkill(skill.id)}>✕</button>
                            
                            <div className="flex-1 mb-4 pr-6">
                                <h3 className="font-bold text-white text-lg mb-1 text-[#00f0ff] uppercase tracking-wider truncate">{skill.name}</h3>
                                <div className="text-[#ff6600] font-bold text-xs mb-3 border-b border-gray-800 pb-2">COST: -{skill.cost} RES</div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                                    <div><span className="text-gray-500">Damage:</span> {skill.d}</div>
                                    <div><span className="text-gray-500">AoE:</span> {skill.a} Hex</div>
                                    <div><span className="text-gray-500">Utility:</span> {skill.u}</div>
                                    <div><span className="text-gray-500">Affinity:</span> {skill.alpha}</div>
                                </div>
                                {skill.effectName && (
                                    <div className="mt-3 bg-purple-900 border border-purple-500 text-white text-[10px] px-2 py-1 font-bold inline-block">
                                        Effect: [{skill.effectName}]
                                    </div>
                                )}
                            </div>

                            <button className="w-full bg-gray-800 text-white font-bold py-2 uppercase text-xs hover:bg-[#00f0ff] hover:text-black transition-colors" onClick={() => equipToHUD(skill)}>
                                Equip to HUD
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}