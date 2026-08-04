/* eslint-disable */
import React, { useState } from 'react';

export default function Reference() {
    const [activeTab, setActiveTab] = useState('combat');

    const tabs = [
        { id: 'combat', label: 'Combat & Elements' },
        { id: 'states', label: 'Status Matrix' },
        { id: 'terrain', label: 'Terrain & Movement' },
        { id: 'classes', label: 'Classes & Synergy' }
    ];

    const renderTabNav = () => (
        <div className="flex border-b border-gray-700 mb-6 overflow-x-auto">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-3 font-bold uppercase tracking-widest text-xs transition-colors whitespace-nowrap ${
                        activeTab === tab.id 
                            ? 'bg-black text-[#00f0ff] border-t-2 border-l border-r border-[#00f0ff]' 
                            : 'bg-[#1a222c] text-gray-500 border-t-2 border-transparent hover:text-white'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="flex-1 bg-[#05080a] border border-slate-700 p-6 md:p-10 font-mono text-sm h-[75vh] overflow-y-auto shadow-inner text-gray-300 relative">
            
            <div className="absolute top-4 right-4 bg-black border border-[#00f0ff] px-4 py-2 z-10 text-xs font-mono uppercase text-[#00f0ff] shadow-md">
                DATABASE: <span className="font-bold text-white">RESONANCE ENGINE RULES</span>
            </div>

            <h1 className="text-3xl font-bold text-white mb-6 uppercase tracking-wider border-b border-gray-700 pb-2">System Reference Index</h1>

            {renderTabNav()}

            {/* TAB: COMBAT & ELEMENTS */}
            {activeTab === 'combat' && (
                <div className="space-y-8 animate-fade-in">
                    
                    <section>
                        <h2 className="text-xl font-bold text-[#ff6600] mb-4 uppercase tracking-widest">The Action Economy</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black border border-gray-700 p-4">
                                <h3 className="text-[#00f0ff] font-bold mb-2 uppercase">Resonance Pool</h3>
                                <p className="mb-2">Agents begin encounters with <span className="text-white font-bold">3 Resonance (Res)</span>. Res is the fuel for custom skills, abilities, and synergy matrices.</p>
                                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                                    <li><span className="text-[#22c55e]">Basic Attacks:</span> Generate +1 Res.</li>
                                    <li><span className="text-red-400">Custom Skills:</span> Drain Res based on their calculated cost (α * power).</li>
                                    <li><span className="text-yellow-500">Improvised Skills:</span> Drain 1 Res and require a 1d6 hazard roll.</li>
                                    <li><span className="text-[#00f0ff]">Overload Cap:</span> The hard cap is 10 Res. Any excess dissipates at the end of the round.</li>
                                </ul>
                            </div>
                            <div className="bg-black border border-gray-700 p-4">
                                <h3 className="text-[#00f0ff] font-bold mb-2 uppercase">Defensive Matrices</h3>
                                <p className="mb-2">Agents possess three defensive cooldowns. Each can only be triggered <span className="text-white font-bold">once per round</span>.</p>
                                <ul className="list-disc pl-5 space-y-1 text-xs text-gray-400">
                                    <li><span className="text-white font-bold">Front Parry:</span> Defends frontal cone. Mitigates damage equal to Front DP + Weapon Base Damage.</li>
                                    <li><span className="text-white font-bold">Support Intercept:</span> Mitigates damage equal to Support DP + 3.</li>
                                    <li><span className="text-white font-bold">Backline Evade:</span> Mitigates damage equal to Back DP + 3. Automatically triggered if struck from behind (Flanked) or via Evasive state.</li>
                                    <li><span className="text-red-500">Jammed Arrays:</span> Stunned or Shocked states lock out all defensive matrices.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#ff6600] mb-4 uppercase tracking-widest">Elemental Physics & RPS</h2>
                        <p className="mb-4 text-gray-400 text-xs">If an attack element holds an advantage over a target's core affinity, damage is multiplied by 1.5x. If it is weak, damage is reduced by 0.5x.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-black border border-gray-700 p-4 flex flex-col items-center justify-center text-center">
                                <h3 className="text-red-500 font-bold mb-2 uppercase">The Primal Triangle</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    <span className="text-blue-400 font-bold">Cryo</span> douses <span className="text-green-500 font-bold">Toxic</span>.<br/>
                                    <span className="text-green-500 font-bold">Toxic</span> decays <span className="text-red-500 font-bold">Thermal</span>.<br/>
                                    <span className="text-red-500 font-bold">Thermal</span> melts <span className="text-blue-400 font-bold">Cryo</span>.
                                </p>
                            </div>
                            <div className="bg-black border border-gray-700 p-4 flex flex-col items-center justify-center text-center">
                                <h3 className="text-purple-500 font-bold mb-2 uppercase">The Cosmic Binary</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    <span className="text-yellow-300 font-bold">Radiant</span> shatters <span className="text-purple-500 font-bold">Void</span>.<br/>
                                    <span className="text-purple-500 font-bold">Void</span> eclipses <span className="text-yellow-300 font-bold">Radiant</span>.<br/>
                                    <em className="text-[10px] mt-1 block">(Mutually destructive: Both deal 1.5x to each other).</em>
                                </p>
                            </div>
                            <div className="bg-black border border-gray-700 p-4 flex flex-col items-center justify-center text-center">
                                <h3 className="text-gray-300 font-bold mb-2 uppercase">The Physical Binary</h3>
                                <p className="text-xs text-gray-400 leading-relaxed">
                                    <span className="text-blue-300 font-bold">Electro</span> shorts <span className="text-orange-300 font-bold">Kinetic</span>.<br/>
                                    <span className="text-orange-300 font-bold">Kinetic</span> grounds <span className="text-blue-300 font-bold">Electro</span>.<br/>
                                    <em className="text-[10px] mt-1 block">(Mutually destructive: Both deal 1.5x to each other).</em>
                                </p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-[#ff6600] mb-4 uppercase tracking-widest">Volatile Reactions</h2>
                        <p className="mb-4 text-gray-400 text-xs">Targeting a hex already painted with an Elemental Terrain causes an instantaneous, volatile chain reaction dealing <span className="text-white font-bold">+5 bonus damage</span> to all entities caught in the blast.</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-black border-l-4 border-l-red-500 p-3">
                                <div className="font-bold text-white mb-1 uppercase text-xs">Steam Explosion</div>
                                <div className="text-[10px] text-gray-400 mb-1">Thermal Attack → Cryo Terrain</div>
                                <div className="text-xs text-red-400 font-bold">+5 Kinetic Damage.</div>
                                <div className="text-[10px] text-gray-500 mt-1">Converts hex to LoS-blocking Steam.</div>
                            </div>
                            <div className="bg-black border-l-4 border-l-green-500 p-3">
                                <div className="font-bold text-white mb-1 uppercase text-xs">Combustion</div>
                                <div className="text-[10px] text-gray-400 mb-1">Thermal Attack → Toxic Terrain</div>
                                <div className="text-xs text-red-400 font-bold">+5 Thermal Damage.</div>
                                <div className="text-[10px] text-gray-500 mt-1">Incinerates the toxicity, clearing the hex.</div>
                            </div>
                            <div className="bg-black border-l-4 border-l-blue-400 p-3">
                                <div className="font-bold text-white mb-1 uppercase text-xs">Conduction</div>
                                <div className="text-[10px] text-gray-400 mb-1">Electro Attack → Cryo/Steam Terrain</div>
                                <div className="text-xs text-red-400 font-bold">+5 Electro Damage.</div>
                                <div className="text-[10px] text-gray-500 mt-1">Electrifies the moisture, converting to Minor Terrain.</div>
                            </div>
                            <div className="bg-black border-l-4 border-l-purple-500 p-3">
                                <div className="font-bold text-white mb-1 uppercase text-xs">Annihilation</div>
                                <div className="text-[10px] text-gray-400 mb-1">Radiant/Void → Opposite Terrain</div>
                                <div className="text-xs text-red-400 font-bold">+5 Void Damage.</div>
                                <div className="text-[10px] text-gray-500 mt-1">Matter collapses, instantly clearing the hex.</div>
                            </div>
                        </div>
                    </section>

                </div>
            )}

            {/* TAB: STATUS MATRIX */}
            {activeTab === 'states' && (
                <div className="space-y-6 animate-fade-in">
                    <p className="text-gray-400 text-xs mb-4">Statuses apply persistent buffs, debuffs, or mechanical overrides. They are visualized as colored badges on the grid. Some statuses are consumed upon triggering.</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-black border border-purple-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Execute</span>
                            <p className="text-xs text-gray-300">Instantly reduces target HP to 0. Bypasses all barriers, parries, evasions, and invulnerability. Terminal erasure.</p>
                        </div>
                        <div className="bg-black border border-red-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Bleed</span>
                            <p className="text-xs text-gray-300">Entity suffers 3 HP absolute physical damage at the end of the round. (Stacks with other DoTs).</p>
                        </div>
                        <div className="bg-black border border-orange-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Burn</span>
                            <p className="text-xs text-gray-300">Entity suffers 3 HP absolute thermal damage at the end of the round. (Stacks with other DoTs).</p>
                        </div>
                        <div className="bg-black border border-green-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Poisoned</span>
                            <p className="text-xs text-gray-300">Entity suffers 3 HP absolute toxic damage at the end of the round. Poison is uniquely volatile and can stack upon itself indefinitely.</p>
                        </div>
                        <div className="bg-black border border-gray-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Immobilized</span>
                            <p className="text-xs text-gray-300">Movement points instantly reduced to 0. Entity cannot be repositioned via Blink or Dash skills. Can still attack.</p>
                        </div>
                        <div className="bg-black border border-yellow-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Stunned</span>
                            <p className="text-xs text-gray-300">Catastrophic lockdown. Movement is 0. Entity cannot execute basic attacks or custom skills. All defensive matrices (Parry, Intercept, Evade) are jammed.</p>
                        </div>
                        <div className="bg-black border border-blue-400 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Shielded</span>
                            <p className="text-xs text-gray-300">Ablative armor logic. Absorbs exactly 5 incoming damage from the next attack, then automatically shatters and clears the state.</p>
                        </div>
                        <div className="bg-black border border-pink-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Vulnerable</span>
                            <p className="text-xs text-gray-300">Structural compromise. Entity takes 1.5x incoming damage from the very next attack instance, after which the state is consumed.</p>
                        </div>
                        <div className="bg-black border border-orange-800 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Knockdown</span>
                            <p className="text-xs text-gray-300">Kinetic disruption. Movement points are halved for the current turn. Entity automatically stands up and clears the state when the GM advances the round.</p>
                        </div>
                        <div className="bg-black border border-gray-700 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Blind</span>
                            <p className="text-xs text-gray-300">Optics malfunction. All targeting arrays are forcefully restricted to Range 1 (adjacent hexes only) and Area of Effect size is reduced to 0.</p>
                        </div>
                        <div className="bg-black border border-[#00f0ff] p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Haste</span>
                            <p className="text-xs text-gray-300">Neural acceleration. Movement points are permanently increased by +2 for as long as the state is active.</p>
                        </div>
                        <div className="bg-black border border-slate-600 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Slowed</span>
                            <p className="text-xs text-gray-300">Neural drag. Movement points are permanently reduced by -2 for as long as the state is active.</p>
                        </div>
                        <div className="bg-black border border-blue-600 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Shocked</span>
                            <p className="text-xs text-gray-300">Circuit malfunction. Entity can still move and attack, but all defensive arrays (Parry, Intercept, Evade) are jammed and set to 0.</p>
                        </div>
                        <div className="bg-black border border-teal-500 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Evasive</span>
                            <p className="text-xs text-gray-300">Quantum ghosting. Forces the next incoming attack to bypass Parry/Intercept and roll against the target's Backline Evasion stat. Consumed upon triggering.</p>
                        </div>
                        <div className="bg-black border border-yellow-300 p-3">
                            <span className="bg-purple-900 text-white text-[10px] px-1.5 py-0.5 border border-purple-500 font-bold uppercase mb-2 inline-block">Invulnerable</span>
                            <p className="text-xs text-gray-300">Stasis field. Completely negates 100% of the damage and effects of the next incoming attack, then immediately shatters.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: TERRAIN & MOVEMENT */}
            {activeTab === 'terrain' && (
                <div className="space-y-6 animate-fade-in">
                    <section>
                        <h2 className="text-xl font-bold text-[#ff6600] mb-4 uppercase tracking-widest">Terrain Classifications</h2>
                        <p className="mb-4 text-gray-400 text-xs">The grid relies on four base terrain classifications. Environmental hazards are resolved automatically when the GM advances the round.</p>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4 bg-black border border-gray-700 p-3">
                                <div className="w-8 h-8 shrink-0 bg-yellow-500/40 border border-yellow-500 clip-hex flex items-center justify-center text-yellow-500 font-bold text-xs">MIN</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-sm">Minor Terrain</div>
                                    <div className="text-xs text-gray-400 mt-1">Imposes physical drag. Movement through this hex costs 2 Movement Points instead of 1.</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-black border border-gray-700 p-3">
                                <div className="w-8 h-8 shrink-0 bg-purple-500/40 border border-purple-500 clip-hex flex items-center justify-center text-purple-500 font-bold text-xs">MAJ</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-sm">Major Terrain</div>
                                    <div className="text-xs text-gray-400 mt-1">Hazardous environment. Movement cost is normal, but entities ending their turn here suffer 5 absolute damage at round advance.</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 bg-black border border-gray-700 p-3">
                                <div className="w-8 h-8 shrink-0 bg-blue-500/40 border border-blue-500 clip-hex flex items-center justify-center text-blue-500 font-bold text-xs">SEV</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-sm">Severe Terrain</div>
                                    <div className="text-xs text-gray-400 mt-1">Impassable bedrock. Blocks movement and Line-of-Sight. Entities forcibly displaced into this hex via Pull/Push suffer lethal Entombment.</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-black border border-gray-700 p-3">
                                <div className="w-8 h-8 shrink-0 bg-slate-400/70 border border-slate-300 clip-hex flex items-center justify-center text-white font-bold text-[10px]">STM</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-sm">Volatile Steam</div>
                                    <div className="text-xs text-gray-400 mt-1">Result of Cryo/Thermal reaction. Blocks Line-of-Sight entirely. Entities ending their turn inside suffer 5 Kinetic Damage (Boiling).</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mt-8 pt-6 border-t border-gray-700">
                        <h2 className="text-xl font-bold text-[#ff6600] mb-4 uppercase tracking-widest">Mobility Vectors & Collisions</h2>
                        <div className="bg-black border border-gray-700 p-4">
                            <p className="text-xs text-gray-400 mb-3">Custom skills can utilize forced momentum algorithms. If an entity is pushed or pulled into <span className="text-[#00f0ff]">Severe Terrain</span> or the edge of the grid, collision physics apply.</p>
                            <ul className="list-disc pl-5 space-y-2 text-xs text-gray-300">
                                <li><span className="font-bold text-white">Blink (Self):</span> Instantaneous displacement. Cannot be used to teleport inside Severe Terrain.</li>
                                <li><span className="font-bold text-white">Push/Pull (Target):</span> Forcibly moves a target X hexes. If their trajectory is interrupted by an obstacle, they stop early and suffer <span className="text-red-400 font-bold">1 Physical Damage for every hex of momentum they failed to travel.</span></li>
                                <li><span className="font-bold text-white">Entombment / Crushed:</span> If the Grid Engine evaluates that an entity is completely surrounded by Severe Terrain (or trapped via a glitch), they are assigned the [Crushed] state. The entity has 3 rounds to be excavated by an ally clearing the terrain before suffering an automatic Execute.</li>
                            </ul>
                        </div>
                    </section>
                </div>
            )}

            {/* TAB: CLASSES & SYNERGY */}
            {activeTab === 'classes' && (
                <div className="space-y-6 animate-fade-in">
                    <p className="text-gray-400 text-xs mb-4">An Agent's Class Archetype is fluid and mathematically derived in real-time based on their assigned Discipline Points (DP). Meeting specific thresholds unlocks Archetypes, which in turn grant Resonance Cost Reductions when synthesizing specific Status Effects.</p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="bg-black border border-red-500 p-4 relative overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-6xl text-red-900/30 font-black italic">V</div>
                            <h3 className="text-red-500 font-bold text-lg mb-1 uppercase tracking-widest">Vanguard</h3>
                            <div className="text-xs text-gray-400 mb-3">Requirement: 10+ Front DP</div>
                            <div className="text-xs text-gray-300">
                                <span className="text-white font-bold block mb-1">Synergy Affinities (Cheaper Res Cost):</span>
                                Knockdown, Bleed, Shielded, Burn, Execute.
                            </div>
                        </div>

                        <div className="bg-black border border-purple-500 p-4 relative overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-6xl text-purple-900/30 font-black italic">C</div>
                            <h3 className="text-purple-500 font-bold text-lg mb-1 uppercase tracking-widest">Conduit</h3>
                            <div className="text-xs text-gray-400 mb-3">Requirement: 10+ Support DP</div>
                            <div className="text-xs text-gray-300">
                                <span className="text-white font-bold block mb-1">Synergy Affinities (Cheaper Res Cost):</span>
                                Stunned, Shocked, Shielded, Haste, Immobilized.
                            </div>
                        </div>

                        <div className="bg-black border border-[#22c55e] p-4 relative overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-6xl text-green-900/30 font-black italic">S</div>
                            <h3 className="text-[#22c55e] font-bold text-lg mb-1 uppercase tracking-widest">Sniper</h3>
                            <div className="text-xs text-gray-400 mb-3">Requirement: 10+ Back DP</div>
                            <div className="text-xs text-gray-300">
                                <span className="text-white font-bold block mb-1">Synergy Affinities (Cheaper Res Cost):</span>
                                Vulnerable, Blind, Bleed, Execute, Evasive.
                            </div>
                        </div>

                        <div className="bg-black border border-yellow-500 p-4 relative overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-6xl text-yellow-900/30 font-black italic">P</div>
                            <h3 className="text-yellow-500 font-bold text-lg mb-1 uppercase tracking-widest">Paladin</h3>
                            <div className="text-xs text-gray-400 mb-3">Requirement: 5+ Front DP & 5+ Support DP</div>
                            <div className="text-xs text-gray-300">
                                <span className="text-white font-bold block mb-1">Synergy Affinities (Cheaper Res Cost):</span>
                                Shielded, Burn, Knockdown, Invulnerable.
                            </div>
                        </div>

                        <div className="bg-black border border-orange-500 p-4 relative overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-6xl text-orange-900/30 font-black italic">SK</div>
                            <h3 className="text-orange-500 font-bold text-lg mb-1 uppercase tracking-widest">Skirmisher</h3>
                            <div className="text-xs text-gray-400 mb-3">Requirement: 5+ Front DP & 5+ Back DP</div>
                            <div className="text-xs text-gray-300">
                                <span className="text-white font-bold block mb-1">Synergy Affinities (Cheaper Res Cost):</span>
                                Haste, Evasive, Bleed, Slowed.
                            </div>
                        </div>

                        <div className="bg-black border border-pink-500 p-4 relative overflow-hidden">
                            <div className="absolute right-[-10px] top-[-10px] text-6xl text-pink-900/30 font-black italic">SA</div>
                            <h3 className="text-pink-500 font-bold text-lg mb-1 uppercase tracking-widest">Saboteur</h3>
                            <div className="text-xs text-gray-400 mb-3">Requirement: 5+ Support DP & 5+ Back DP</div>
                            <div className="text-xs text-gray-300">
                                <span className="text-white font-bold block mb-1">Synergy Affinities (Cheaper Res Cost):</span>
                                Immobilized, Blind, Slowed, Shocked, Vulnerable, Poisoned.
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 bg-gray-900 border border-gray-700 p-4 text-center">
                        <h3 className="text-[#00f0ff] font-bold uppercase mb-2 tracking-widest">The Synthesis Matrix (Cost Math)</h3>
                        <p className="text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
                            When building a custom skill in the HUD, the Engine calculates its final Resonance cost based on the formula:<br/>
                            <span className="inline-block mt-2 font-bold text-white bg-black px-3 py-1 border border-gray-600">Cost = α × (Damage + Utility + Terrain + Mobility + AoE)</span>
                            <br/><br/>
                            <span className="text-[#22c55e] font-bold">α (Alpha)</span> represents your Synthesis Multiplier. It is normally <span className="font-bold text-white">1.0x</span>.<br/>
                            If your Innate Element matches the skill, OR your Class Affinities match the chosen State, α drops to <span className="text-[#22c55e] font-bold">0.75x</span> (cheaper).<br/>
                            If you attempt to utilize an Element inherently opposed to your Innate Element (e.g. A Thermal Agent casting a Cryo spell), α spikes to <span className="text-red-500 font-bold">2.0x</span> (expensive).
                        </p>
                    </div>

                </div>
            )}
        </div>
    );
}