/* eslint-disable */
import React from 'react';

export default function Spellbook({ player = {}, pushUpdate }) {
    // BULLETPROOFING: Safely merge objects so we never overwrite other player data
    const updatePlayer = (key, val) => pushUpdate(s => ({ ...s, player: { ...(s.player || {}), [key]: val } }));

    // Safe array fallbacks
    const savedSkills = player?.savedSkills || [];

    const equipSkill = (skill) => {
        const currentHud = player?.customCards || [];
        if (currentHud.length >= 4) return alert("HUD limit reached (Max 4). Please click the 'X' to remove an active skill from your Combat HUD before equipping a new one.");
        
        // Give it a fresh ID so equipping duplicates doesn't break React key rendering
        updatePlayer('customCards', [...currentHud, { ...skill, id: Date.now() }]);
    };

    const deleteSkill = (id) => {
        updatePlayer('savedSkills', savedSkills.filter(s => s.id !== id));
    };

    return (
        <div className="bg-[#1a222c] p-4 md:p-6 border border-slate-700 h-[75vh] flex flex-col font-mono text-sm">
            <h2 className="text-[#00f0ff] font-bold text-2xl mb-2 border-b border-gray-700 pb-2 uppercase tracking-widest">Grimoire / Spellbook</h2>
            <p className="text-gray-400 mb-6 text-xs">Permanently archived abilities. Equip them to your Combat HUD to use them in active encounters.</p>

            {savedSkills.length === 0 ? (
                <div className="flex-1 flex items-center justify-center border border-dashed border-gray-700 text-gray-500 p-8 text-center">
                    No skills archived. Build and save custom abilities from the Synthesis Matrix on your Combat HUD.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-y-auto pr-2 pb-4">
                    {savedSkills.map(skill => (
                        <div key={skill.id} className="bg-black border border-[#00f0ff] p-4 flex flex-col h-full hover:shadow-[0_0_10px_rgba(0,240,255,0.2)] transition-shadow">
                            <div className="font-bold text-[#00f0ff] text-lg mb-2 uppercase tracking-wide border-b border-gray-800 pb-2">{skill.name || 'Unnamed Skill'}</div>
                            <div className="text-[#ff6600] font-bold mb-3 text-base">Cost: {skill.cost} Res</div>
                            
                            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-4 bg-gray-900 p-2 border border-gray-800">
                                <div>Damage (d): <span className="text-white">{skill.d}</span></div>
                                <div>Utility (u): <span className="text-white">{skill.u}</span></div>
                                <div>AoE (a): <span className="text-white">{skill.a}</span></div>
                                <div>Affinity: <span className="text-white">{skill.alpha}</span></div>
                            </div>
                            
                            <div className="mt-auto flex gap-2">
                                <button 
                                    className="flex-1 bg-[#00f0ff] text-black font-bold p-2 hover:bg-white transition-colors text-xs uppercase"
                                    onClick={() => equipSkill(skill)}
                                >
                                    Equip to HUD
                                </button>
                                <button 
                                    className="px-3 bg-gray-800 text-gray-400 border border-gray-600 hover:bg-red-900 hover:text-white hover:border-red-500 transition-colors text-xs"
                                    onClick={() => deleteSkill(skill.id)}
                                    title="Delete Skill"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}