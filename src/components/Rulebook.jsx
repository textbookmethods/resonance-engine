/* eslint-disable */
import React, { useState } from 'react';

export default function Rulebook() {
    const [activeChapter, setActiveChapter] = useState('core');

    const chapters = [
        { id: 'core', title: '01. Core Resolution' },
        { id: 'agents', title: '02. Agent Initialization' },
        { id: 'combat', title: '03. Tactical Combat' },
        { id: 'physics', title: '04. Grid Physics & Flanking' },
        { id: 'gm', title: '05. Game Master Directives' }
    ];

    return (
        <div className="flex flex-col md:flex-row h-[75vh] bg-[#05080a] border border-slate-700 font-mono text-sm shadow-inner overflow-hidden">
            
            {/* SIDEBAR NAVIGATION */}
            <div className="w-full md:w-64 bg-[#1a222c] border-r border-slate-700 flex flex-col shrink-0 overflow-y-auto">
                <div className="p-4 border-b border-gray-700 bg-black">
                    <h2 className="text-[#00f0ff] font-bold text-lg tracking-widest uppercase">System Manual</h2>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Resonance Engine v2.0</div>
                </div>
                <div className="flex flex-col py-2">
                    {chapters.map(chap => (
                        <button
                            key={chap.id}
                            onClick={() => setActiveChapter(chap.id)}
                            className={`text-left px-4 py-3 text-xs uppercase font-bold tracking-wider transition-colors ${
                                activeChapter === chap.id 
                                    ? 'bg-[#00f0ff] text-black border-l-4 border-white' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
                            }`}
                        >
                            {chap.title}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto text-gray-300 relative">
                
                {activeChapter === 'core' && (
                    <div className="animate-fade-in space-y-6 max-w-4xl">
                        <h1 className="text-3xl font-bold text-white uppercase border-b border-gray-700 pb-2 mb-6">01. Core Resolution</h1>
                        
                        <div className="bg-black border border-gray-700 p-5">
                            <h2 className="text-[#ff6600] font-bold text-lg mb-2 uppercase">The Resonance Economy</h2>
                            <p className="mb-3 text-sm leading-relaxed">
                                The Resonance Engine does not rely on traditional action points. Instead, combat is fueled by a shared, fluctuating energy pool called <span className="text-[#00f0ff] font-bold">Resonance (Res)</span>. 
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-gray-400 text-xs">
                                <li><strong className="text-white">Generation:</strong> Executing a Basic Attack generates <span className="text-[#22c55e]">+1 Res</span> for the Agent.</li>
                                <li><strong className="text-white">Expenditure:</strong> Executing Custom Skills, Spells, and Abilities drains Res from the pool equal to their calculated Synthesis Cost.</li>
                                <li><strong className="text-white">The Cap:</strong> Agents have a hard cap of <span className="text-[#00f0ff]">10 Resonance</span>. Resonance can be extended temporarily via Teamwork actions (+1 Assist, +2 Tag-Team), but any excess beyond 10 instantly dissipates at the end of the round.</li>
                            </ul>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 p-5 mt-6">
                            <h2 className="text-yellow-500 font-bold text-lg mb-2 uppercase">The Improvised Matrix (1d6)</h2>
                            <p className="mb-3 text-sm leading-relaxed">
                                If an Agent does not have a pre-saved Custom Card equipped in their HUD, they may attempt to brute-force the Engine by improvising an attack directly onto the grid. This costs exactly <span className="font-bold text-white">1 Res</span>, regardless of the ability's theoretical math cost, but forces a volatile 1d6 resolution roll:
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mt-4">
                                <div className="bg-black border border-red-500 p-3">
                                    <div className="text-red-500 font-bold text-lg mb-1">[ 1 - 2 ]</div>
                                    <div className="text-white font-bold uppercase mb-1">Backlash</div>
                                    <p className="text-gray-400">Catastrophic failure. The trajectory is inverted. The attack executes, but targets the Agent's own hex.</p>
                                </div>
                                <div className="bg-black border border-yellow-500 p-3">
                                    <div className="text-yellow-500 font-bold text-lg mb-1">[ 3 - 4 ]</div>
                                    <div className="text-white font-bold uppercase mb-1">Surge</div>
                                    <p className="text-gray-400">The action succeeds normally against the target, but the Agent suffers Feedback Damage equal to the ability's actual calculated α cost.</p>
                                </div>
                                <div className="bg-black border border-[#22c55e] p-3">
                                    <div className="text-[#22c55e] font-bold text-lg mb-1">[ 5 - 6 ]</div>
                                    <div className="text-white font-bold uppercase mb-1">Cascade</div>
                                    <p className="text-gray-400">Perfect synchronization. Reality bends to the Agent's will. The action succeeds flawlessly with no feedback.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeChapter === 'agents' && (
                    <div className="animate-fade-in space-y-6 max-w-4xl">
                        <h1 className="text-3xl font-bold text-white uppercase border-b border-gray-700 pb-2 mb-6">02. Agent Initialization</h1>
                        
                        <p className="text-sm leading-relaxed mb-6">
                            Agents do not have traditional attributes (Strength, Dexterity, etc.). Their physical and structural parameters are derived entirely from their allocation of <span className="text-[#00f0ff] font-bold">Discipline Points (DP)</span>.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-black border-t-2 border-red-500 p-4">
                                <h3 className="text-red-500 font-bold uppercase tracking-wider mb-2">Front DP</h3>
                                <p className="text-xs text-gray-400 mb-2">Dictates direct confrontation and structural mass.</p>
                                <ul className="text-[10px] text-gray-500 space-y-1">
                                    <li>+3 Max HP per point.</li>
                                    <li>Increases Base Damage.</li>
                                    <li>Scales the Front Parry defensive matrix.</li>
                                </ul>
                            </div>
                            <div className="bg-black border-t-2 border-purple-500 p-4">
                                <h3 className="text-purple-500 font-bold uppercase tracking-wider mb-2">Support DP</h3>
                                <p className="text-xs text-gray-400 mb-2">Dictates tactical control and structural integrity.</p>
                                <ul className="text-[10px] text-gray-500 space-y-1">
                                    <li>+2 Max HP per point.</li>
                                    <li>Scales the Support Intercept defensive matrix.</li>
                                </ul>
                            </div>
                            <div className="bg-black border-t-2 border-[#22c55e] p-4">
                                <h3 className="text-[#22c55e] font-bold uppercase tracking-wider mb-2">Back DP</h3>
                                <p className="text-xs text-gray-400 mb-2">Dictates mobility, evasion, and critical targeting.</p>
                                <ul className="text-[10px] text-gray-500 space-y-1">
                                    <li>+1 Max HP per point.</li>
                                    <li>Scales the Backline Evasion defensive matrix.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 p-5">
                            <h2 className="text-white font-bold text-lg mb-2 uppercase">Derived HP Calculation</h2>
                            <code className="block bg-black p-3 text-[#ff6600] border border-gray-700 mb-3 text-center text-lg">
                                Base HP = 20 + (Front × 3) + (Support × 2) + (Back × 1)
                            </code>
                            <p className="text-xs text-gray-400">
                                As Agents earn Experience Points (XP) from the GM, they automatically earn +1 DP for every 10 XP gained. Allocating a new DP instantly recalculates maximum HP and defensive arrays in real-time.
                            </p>
                        </div>
                    </div>
                )}

                {activeChapter === 'combat' && (
                    <div className="animate-fade-in space-y-6 max-w-4xl">
                        <h1 className="text-3xl font-bold text-white uppercase border-b border-gray-700 pb-2 mb-6">03. Tactical Combat</h1>
                        
                        <div className="bg-black border border-gray-700 p-5 mb-6">
                            <h2 className="text-[#00f0ff] font-bold text-lg mb-2 uppercase">The Defensive Matrices</h2>
                            <p className="mb-4 text-sm text-gray-300">
                                When targeted by an attack, the Grid Engine automatically calculates mitigation based on the trajectory of the strike and the Agent's available reactions. Each reaction can only be used <span className="font-bold text-white">once per round</span>.
                            </p>
                            
                            <div className="space-y-3 text-xs">
                                <div className="p-3 border-l-4 border-l-red-500 bg-gray-900">
                                    <strong className="text-white uppercase block mb-1">1. Front Parry [Front DP + Weapon Base Damage]</strong>
                                    <p className="text-gray-400">The default defensive reaction. Triggered automatically against any attack originating from within the Agent's 180-degree front facing arc. Blocks immense damage but leaves the Agent exposed if attacked again.</p>
                                </div>
                                <div className="p-3 border-l-4 border-l-purple-500 bg-gray-900">
                                    <strong className="text-white uppercase block mb-1">2. Support Intercept [Support DP + 3]</strong>
                                    <p className="text-gray-400">The fallback matrix. If Parry is exhausted, the Engine attempts to intercept the attack using energy fields or structural hardening.</p>
                                </div>
                                <div className="p-3 border-l-4 border-l-[#22c55e] bg-gray-900">
                                    <strong className="text-white uppercase block mb-1">3. Backline Evasion [Back DP + 3]</strong>
                                    <p className="text-gray-400">The emergency dodge. This matrix is <strong>forcefully triggered</strong> if the Agent is attacked from behind (Flanked) or if the Agent currently has the [Evasive] status effect active.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-950 border border-red-500 p-5 text-red-200">
                            <h2 className="text-red-400 font-bold text-lg mb-2 uppercase flex items-center gap-2">
                                ⚠ System Exhaustion
                            </h2>
                            <p className="text-sm">
                                If an Agent is attacked and the corresponding matrix is marked as EXHAUSTED, mitigation drops to <strong>0</strong>. The Agent takes full, unmitigated damage. Furthermore, if an Agent is afflicted with the <strong>[Stunned]</strong> or <strong>[Shocked]</strong> status condition, all defensive matrices are instantly jammed and locked at 0.
                            </p>
                        </div>
                    </div>
                )}

                {activeChapter === 'physics' && (
                    <div className="animate-fade-in space-y-6 max-w-4xl">
                        <h1 className="text-3xl font-bold text-white uppercase border-b border-gray-700 pb-2 mb-6">04. Grid Physics & Flanking</h1>
                        
                        <div className="bg-black border border-gray-700 p-5 mb-6">
                            <h2 className="text-[#ff6600] font-bold text-lg mb-2 uppercase">Directional Facing & Flanking</h2>
                            <p className="mb-4 text-sm text-gray-300">
                                The Resonance Engine strictly enforces facing mechanics via a 360-degree vector array. Every token on the grid possesses a forward-facing indicator arrow.
                            </p>
                            <div className="bg-gray-900 p-4 border border-gray-600 text-xs text-gray-400 leading-relaxed">
                                <strong className="text-white">The Flanking Calculation:</strong><br />
                                When an attack is initiated, the Engine calculates the arctangent angle between the attacker's hex and the target's hex. If the absolute difference between this strike angle and the target's current facing angle is <strong>greater than 90 degrees</strong>, the Engine declares a <span className="text-[#22c55e] font-bold">FLANK</span>.
                                <br /><br />
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Flanking multiplies incoming damage by <span className="text-[#ff6600] font-bold">1.5x</span>.</li>
                                    <li>Flanking completely bypasses the target's Front Parry matrix, forcing them to burn their Backline Evasion instead.</li>
                                    <li>Area of Effect (AoE) abilities (Lines, Clusters, Radiuses) inherently count as Flanking damage against all caught targets, regardless of facing.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black border border-blue-500 p-4">
                                <h3 className="text-blue-400 font-bold mb-2 uppercase tracking-widest">Momentum & Collisions</h3>
                                <p className="text-xs text-gray-400">
                                    Abilities utilizing the <span className="text-white font-bold">Push</span> or <span className="text-white font-bold">Pull</span> mobility tags physically displace tokens across the grid. If a displaced entity collides with a Grid Boundary or <span className="text-blue-500 font-bold">Severe Terrain</span> before completing their momentum vector, they suffer <strong>1 Absolute Physical Damage</strong> for every hex of travel they failed to complete.
                                </p>
                            </div>
                            <div className="bg-black border border-purple-500 p-4">
                                <h3 className="text-purple-400 font-bold mb-2 uppercase tracking-widest">Severe Entombment</h3>
                                <p className="text-xs text-gray-400">
                                    If the Engine's proximity sweep detects an entity completely trapped or surrounded by <span className="text-blue-500 font-bold">Severe Terrain</span>, it applies the <span className="text-white font-bold">[Crushed]</span> state. Hostiles are instantly executed. Agents have 3 rounds of failing structural integrity to be excavated by an ally before suffering terminal execution.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeChapter === 'gm' && (
                    <div className="animate-fade-in space-y-6 max-w-4xl">
                        <h1 className="text-3xl font-bold text-red-500 uppercase border-b border-red-900 pb-2 mb-6">05. Game Master Directives</h1>
                        
                        <div className="bg-red-950/20 border border-red-500 p-5 mb-6">
                            <h2 className="text-red-500 font-bold text-lg mb-2 uppercase">Hostile Resonance Pool</h2>
                            <p className="mb-3 text-sm text-red-200">
                                Unlike Agents who manage individual pools, the GM operates out of a single, unified <strong>Global Hostile Resonance Pool</strong>. 
                            </p>
                            <ul className="list-disc pl-5 space-y-2 text-red-300 text-xs">
                                <li>Every ability a Hostile executes drains Res from the Global Pool.</li>
                                <li>If the Global Pool is empty, Hostiles cannot utilize their abilities and must rely on standard Grid positioning to block Agent maneuvers.</li>
                                <li>The GM may manually inject Resonance into the pool via the Dashboard (+ / -) to simulate escalating threat levels, reinforcements, or phase transitions in boss encounters.</li>
                            </ul>
                        </div>

                        <div className="bg-black border border-gray-700 p-5">
                            <h2 className="text-white font-bold text-lg mb-2 uppercase">Encounter Flow & Round Advance</h2>
                            <p className="mb-4 text-sm text-gray-400">
                                The VTT operates strictly in discrete Rounds. The GM is solely responsible for clicking the <strong>[Next +]</strong> button on the Dashboard. Pressing this button triggers the Engine's global sweep protocols:
                            </p>
                            
                            <div className="space-y-2 text-xs font-mono text-gray-300">
                                <div className="flex gap-2"><span className="text-[#00f0ff] font-bold">1.</span> <span>All active DoTs (Bleed, Burn, Poison) instantly tick and deduct HP.</span></div>
                                <div className="flex gap-2"><span className="text-[#00f0ff] font-bold">2.</span> <span>Environmental damage (Major Terrain, Steam) is calculated and applied to occupying tokens.</span></div>
                                <div className="flex gap-2"><span className="text-[#00f0ff] font-bold">3.</span> <span>Entombment timers (Crushed [1/3] → [2/3]) advance.</span></div>
                                <div className="flex gap-2"><span className="text-[#00f0ff] font-bold">4.</span> <span>Temporary states (Knockdown) are purged.</span></div>
                                <div className="flex gap-2"><span className="text-[#00f0ff] font-bold">5.</span> <span>Agent defensive matrices (Parry, Intercept, Evade) are reset to Available.</span></div>
                                <div className="flex gap-2"><span className="text-[#00f0ff] font-bold">6.</span> <span>Movement Points for all entities are refilled based on their Speed stat +/- Haste/Slowed modifiers.</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">7.</span> <span>Entities that drop to 0 HP during the sweep are permanently purged from the grid.</span></div>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}