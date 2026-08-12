/* eslint-disable */
import React from 'react';

const safeArray = (arr) => { 
    if (!arr) return []; 
    if (Array.isArray(arr)) return arr.filter(i => i !== null && i !== undefined); 
    if (typeof arr === 'object') return Object.values(arr).filter(i => i !== null && i !== undefined); 
    return []; 
};

const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);

export default function Spellbook({ players = {}, localId, pushUpdate }) {
    const player = players[localId] || {};
    const savedSkills = safeArray(player.savedSkills);
    const activeCards = safeArray(player.customCards);

    const equipToHUD = (skill) => {
        if (activeCards.length >= 4) return alert("System Locked: HUD is at maximum capacity (4). Please remove an active skill from your Uplink before equipping a new one.");
        if (activeCards.some(c => String(c.name).toLowerCase() === String(skill.name).toLowerCase())) return alert(`System Locked: "${skill.name}" is already active in your HUD.`);
        
        if (typeof pushUpdate === 'function') {
            pushUpdate(s => {
                const pClone = JSON.parse(JSON.stringify(s.players || {}));
                if (pClone[localId]) {
                    pClone[localId].customCards = [...safeArray(pClone[localId].customCards), { ...skill, id: `card-${Date.now()}` }];
                }
                return { ...s, players: pClone };
            });
        }
    };

    const deleteFromArchive = (skillId) => {
        if (!window.confirm("WARNING: Permanently purge this tactical ability from your Spellbook archive?")) return;
        if (typeof pushUpdate === 'function') {
            pushUpdate(s => {
                const pClone = JSON.parse(JSON.stringify(s.players || {}));
                if (pClone[localId]) {
                    pClone[localId].savedSkills = safeArray(pClone[localId].savedSkills).filter(sk => String(sk.id) !== String(skillId));
                }
                return { ...s, players: pClone };
            });
        }
    };

    return (
        <div className="bg-[#05080a] min-h-[75vh] border border-slate-700 p-6 md:p-10 font-mono text-gray-300 shadow-inner flex flex-col">
            
            <div className="border-b border-gray-700 pb-4 mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-[#a855f7] uppercase tracking-widest">Spellbook Archive</h1>
                    <p className="text-gray-500 text-xs tracking-wider uppercase mt-1">Saved Tactical Maneuvers & Skill Matrix</p>
                </div>
                <div className="bg-[#0f172a] border border-gray-700 px-4 py-2 text-right shadow-md">
                    <div className="text-[10px] text-gray-400 uppercase tracking-widest">Archived Skills</div>
                    <div className="text-xl font-bold text-[#d1d5db]">{savedSkills.length}</div>
                </div>
            </div>

            {savedSkills.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 p-10 bg-[#0f172a]/50">
                    <span className="text-4xl mb-4 text-gray-600">✧</span>
                    <h2 className="text-gray-400 font-bold uppercase tracking-widest">Archive Empty</h2>
                    <p className="text-gray-600 text-xs mt-2 text-center max-w-md">
                        Your spellbook is currently empty. Use the Synthesis Matrix in your Player HUD to build and archive custom abilities here for future deployment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 content-start">
                    {savedSkills.map(skill => {
                        const dispRaw = skill.elementRaw || skill.element || 'Kinetic'; 
                        const dispCore = skill.elementCore || 'Kinetic'; 
                        const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;
                        const isBlink = safeInt(skill.m) > 0 && String(skill.mobilityName || '').toLowerCase().includes('blink');

                        return (
                            <div key={skill.id} className="bg-[#0f172a] border border-gray-700 p-4 relative group flex flex-col shadow-lg hover:border-[#a855f7] transition-colors duration-300">
                                
                                <div className="flex-1 pb-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-[#d1d5db] text-lg uppercase tracking-wider truncate pr-2" title={skill.name}>{skill.name || 'Custom Action'}</h3>
                                        <div className="bg-[#1e293b] border border-gray-600 text-[#a855f7] font-bold text-[10px] px-2 py-1 shrink-0">
                                            {safeInt(skill.cost)} RES
                                        </div>
                                    </div>
                                    
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2 truncate" title={showType}>
                                        Type: {showType}
                                    </div>
                                    
                                    <div className="space-y-1.5">
                                        {skill.payload === 'heal' && <div className="text-[#22c55e] text-xs font-bold bg-[#22c55e]/10 px-2 py-1 border border-[#22c55e]/30">RESTORATIVE (+{safeInt(skill.d)} HP)</div>}
                                        {skill.payload === 'battery' && <div className="text-[#d1d5db] text-xs font-bold bg-[#d1d5db]/10 px-2 py-1 border border-[#d1d5db]/30">ENERGIZE (+{safeInt(skill.d)} RES)</div>}
                                        {skill.payload === 'damage' && <div className="text-red-400 text-xs font-bold bg-red-900/20 px-2 py-1 border border-red-900/50">OFFENSIVE ({safeInt(skill.d)} DMG)</div>}
                                        
                                        {skill.isEcho && <div className="text-[#a855f7] text-[10px] font-bold uppercase tracking-wider">✧ Tactical Echo Deployable</div>}
                                        
                                        {skill.effectName && <div className="text-purple-400 text-[10px] font-bold uppercase tracking-wider">STATE: [{skill.effectName}]</div>}
                                        {skill.terrain && <div className="text-yellow-500 text-[10px] font-bold uppercase tracking-wider">TERRAIN: [{String(skill.terrain).toUpperCase()}]</div>}
                                        {safeInt(skill.m) > 0 && <div className="text-blue-400 text-[10px] font-bold uppercase tracking-wider">MOBILITY: {safeInt(skill.m)} [{String(skill.mobilityName || skill.mobility || '').toUpperCase()}]</div>}
                                        
                                        {skill.a !== undefined && skill.a !== 0 && skill.a !== '0' && (
                                            <div className="text-gray-500 text-[10px] uppercase font-bold tracking-wider pt-1">
                                                AoE: {skill.a === 'line3' ? '3-HEX LINE' : skill.a === 'cluster3' ? '3-HEX CLUSTER' : `${skill.a} RADIUS`}
                                            </div>
                                        )}
                                    </div>

                                    {skill.desc && (
                                        <div className="mt-4 pt-3 border-t border-gray-800 text-gray-500 text-[10px] italic line-clamp-3 leading-relaxed">
                                            "{skill.desc}"
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-auto border-t border-gray-800 pt-4">
                                    <button 
                                        className="flex-1 bg-[#1e293b] text-[#d1d5db] font-bold py-2 text-xs uppercase tracking-wider border border-gray-600 hover:bg-[#a855f7] hover:text-black hover:border-[#a855f7] transition-all"
                                        onClick={() => equipToHUD(skill)}
                                    >
                                        Equip to HUD
                                    </button>
                                    <button 
                                        className="w-10 bg-black text-gray-500 font-bold text-lg border border-gray-700 hover:bg-red-900 hover:text-white hover:border-red-500 transition-all flex items-center justify-center"
                                        onClick={() => deleteFromArchive(skill.id)}
                                        title="Purge from Archive"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}