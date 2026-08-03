/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { bestiary } from '../data/bestiary';
import { armory } from '../data/armory';

const safeArray = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr.filter(Boolean);
    if (typeof arr === 'object') return Object.values(arr).filter(Boolean);
    return [];
};

export default function Reference() {
    const [activeTab, setActiveTab] = useState('bestiary');
    const [affinityFilter, setAffinityFilter] = useState('All');
    const [tierFilter, setTierFilter] = useState('All');

    const validBestiary = safeArray(bestiary);
    const validArmory = safeArray(armory);

    const affinities = ['All', 'Thermal', 'Cryo', 'Toxic', 'Void', 'Radiant', 'Electro', 'Kinetic'];
    const tiers = ['All', 1, 2, 3, 4, 5];

    const filteredBestiary = validBestiary.filter(b => {
        const passAffinity = affinityFilter === 'All' || String(b.affinity).toLowerCase() === String(affinityFilter).toLowerCase();
        const passTier = tierFilter === 'All' || parseInt(b.tier) === parseInt(tierFilter);
        return passAffinity && passTier;
    });

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[75vh] font-mono text-sm">
            <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-slate-700 flex flex-col gap-2 shrink-0 overflow-y-auto shadow-xl">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2 uppercase tracking-wide">Database</h2>
                
                <button 
                    className={`p-3 text-left transition-colors border-l-4 ${activeTab === 'bestiary' ? 'bg-black border-[#ff6600] text-[#ff6600] font-bold shadow-inner' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    onClick={() => setActiveTab('bestiary')}
                >
                    Hostile Bestiary
                </button>
                <button 
                    className={`p-3 text-left transition-colors border-l-4 ${activeTab === 'armory' ? 'bg-black border-[#00f0ff] text-[#00f0ff] font-bold shadow-inner' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                    onClick={() => setActiveTab('armory')}
                >
                    Armory / Weapons
                </button>
            </div>

            <div className="flex-1 bg-[#1a222c] p-6 md:p-10 border border-slate-700 overflow-y-auto text-gray-300 shadow-inner">
                {activeTab === 'bestiary' && (
                    <div className="animate-fade-in flex flex-col h-full">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-6 border-b border-gray-700 pb-4 gap-4">
                            <div>
                                <h1 className="text-3xl text-white font-bold text-[#ff6600]">HOSTILE ARCHIVE</h1>
                                <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">Classified Threat Database</p>
                            </div>
                            
                            <div className="flex gap-4">
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Filter by Affinity</label>
                                    <select className="bg-black border border-gray-600 p-2 text-white outline-none text-xs w-32" value={affinityFilter} onChange={e => setAffinityFilter(e.target.value)}>
                                        {affinities.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] text-gray-400 uppercase tracking-widest mb-1">Filter by Tier</label>
                                    <select className="bg-black border border-gray-600 p-2 text-white outline-none text-xs w-24" value={tierFilter} onChange={e => setTierFilter(e.target.value)}>
                                        {tiers.map(t => <option key={t} value={t}>{t === 'All' ? 'All' : `Tier ${t}`}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                            {filteredBestiary.length === 0 ? (
                                <div className="col-span-2 text-center text-gray-600 py-10 border border-dashed border-gray-700">No records found matching these parameters.</div>
                            ) : (
                                filteredBestiary.map(enemy => (
                                    <div key={enemy.id} className="bg-black border border-gray-700 p-4 relative group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-bold text-white text-lg uppercase tracking-wider">{enemy.name}</h3>
                                                <div className="flex gap-2 mt-1">
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-900 px-2 py-0.5 border border-gray-600">TIER {enemy.tier}</span>
                                                    <span className="text-[10px] font-bold text-[#ff6600] border border-[#ff6600] px-2 py-0.5 uppercase">{enemy.affinity || 'Kinetic'}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-[#ff6600] leading-none">{enemy.hp} HP</div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 mb-4 border-b border-gray-800 pb-3 mt-3">
                                            <span className="text-[10px] text-gray-500 uppercase tracking-widest mr-2">Barriers:</span>
                                            {safeArray(enemy.barriers).length === 0 ? (
                                                <span className="text-xs text-gray-600">None</span>
                                            ) : (
                                                safeArray(enemy.barriers).map((b, i) => (
                                                    <span key={i} className="text-xs font-bold text-[#00f0ff] bg-blue-900/30 px-2 py-0.5 border border-[#00f0ff]">{b}</span>
                                                ))
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Known Abilities:</div>
                                            {safeArray(enemy.abilities).map((ab, i) => {
                                                const parts = ab.split(':');
                                                const namePart = parts[0];
                                                const descPart = parts.slice(1).join(':');
                                                return (
                                                    <div key={i} className="bg-gray-900 border border-gray-800 p-2 text-xs">
                                                        <span className="text-[#00f0ff] font-bold block mb-1">{namePart}</span>
                                                        <span className="text-gray-400 leading-relaxed">{descPart}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'armory' && (
                    <div className="animate-fade-in flex flex-col h-full">
                        <div className="mb-6 border-b border-gray-700 pb-4">
                            <h1 className="text-3xl text-white font-bold text-[#00f0ff]">ARMORY DATABASE</h1>
                            <p className="text-gray-500 text-xs tracking-widest uppercase mt-1">Agent Standard Issue & Masterwork Equipment</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            {validArmory.map(wpn => {
                                const rList = [];
                                if (wpn.reqF) rList.push(`${wpn.reqF}F`);
                                if (wpn.reqS) rList.push(`${wpn.reqS}S`);
                                if (wpn.reqB) rList.push(`${wpn.reqB}B`);
                                const reqStr = rList.length > 0 ? `Req: ${rList.join('/')}` : 'No Requirements';

                                return (
                                    <div key={wpn.id} className="bg-black border border-gray-700 p-4 flex flex-col justify-between h-full">
                                        <div>
                                            <h3 className="font-bold text-[#00f0ff] text-md uppercase tracking-wider mb-1 truncate" title={wpn.name}>{wpn.name}</h3>
                                            <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2">
                                                Type: <span className="text-white">{wpn.element || 'Kinetic'}</span>
                                            </div>

                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-xs text-gray-500">Base Dmg:</span>
                                                <span className="text-sm text-white font-bold">{wpn.baseDmg}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-xs text-gray-500">Range:</span>
                                                <span className="text-sm text-white font-bold">{wpn.range} Hexes</span>
                                            </div>
                                        </div>

                                        <div>
                                            <div className="bg-gray-900 border border-gray-800 p-2 mb-2">
                                                <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">Discipline Lock</div>
                                                <div className="text-xs font-bold text-yellow-500">{reqStr}</div>
                                            </div>

                                            {wpn.bonusDesc && (
                                                <div className="bg-gray-900 border border-gray-800 p-2">
                                                    <div className="text-[10px] text-[#ff6600] font-bold uppercase tracking-wider mb-1">Synergy Bonus</div>
                                                    <div className="text-xs text-gray-300">{wpn.bonusDesc}</div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}