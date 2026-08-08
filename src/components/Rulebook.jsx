/* eslint-disable */
import React, { useState } from 'react';

export default function Rulebook() {
    const [activeChapter, setActiveChapter] = useState('core');

    const chapters = [
        { id: 'core', title: '01. Core Resolution' },
        { id: 'agents', title: '02. Agent Initialization' },
        { id: 'combat', title: '03. Tactical Combat' },
        { id: 'physics', title: '04. Grid Physics & Flanking' },
        { id: 'gm', title: '05. Game Master Directives' },
        { id: 'states', title: '06. Status Conditions' },
        { id: 'terrain', title: '07. Terrain Synthesis' }
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
                                <li><strong className="text-white">Synergy Bonus:</strong> Striking Vulnerabilities, Flanking enemies, or Buffing allies dynamically triggers Teamwork execution (Assist, Exploit, Tag-Team) to auto-generate additional Resonance upon successful combat resolution.</li>
                                <li><strong className="text-white">Expenditure:</strong> Executing Custom Skills, Spells, and Abilities drains Res from the pool equal to their calculated Synthesis Cost.</li>
                                <li><strong className="text-white">The Cap:</strong> Agents have a hard cap of <span className="text-[#00f0ff]">10 Resonance</span>. Any excess beyond 10 instantly dissipates.</li>
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

                        <div className="bg-black border border-gray-700 p-5 mb-6">
                            <h2 className="text-purple-400 font-bold text-lg mb-2 uppercase">Phased Deployments</h2>
                            <p className="mb-4 text-sm text-gray-400">
                                The GM can stage multi-wave encounters by altering a Hostile's <strong>Spawn Mode</strong> prior to deployment on the Grid.
                            </p>
                            <div className="space-y-2 text-xs text-gray-300">
                                <div className="p-2 border-l-2 border-l-[#00f0ff] bg-gray-900">
                                    <strong className="text-white uppercase">[Immediate]</strong>: The token drops onto the grid fully powered and active.
                                </div>
                                <div className="p-2 border-l-2 border-l-[#ff6600] bg-gray-900">
                                    <strong className="text-white uppercase">[On Clear]</strong>: The token deploys in a dormant, untargetable "ghost" state. The instant all active Hostiles are purged from the grid, a Phase Shift occurs and these tokens instantly activate.
                                </div>
                                <div className="p-2 border-l-2 border-l-purple-500 bg-gray-900">
                                    <strong className="text-white uppercase">[On Round X]</strong>: The token deploys dormant. The instant the GM advances the encounter to the designated round, the token activates.
                                </div>
                            </div>
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

                {activeChapter === 'states' && (
                    <div className="animate-fade-in space-y-6 max-w-4xl">
                        <h1 className="text-3xl font-bold text-purple-400 uppercase border-b border-purple-900 pb-2 mb-6">06. Status Conditions</h1>
                        <p className="text-gray-400 text-sm mb-6">
                            Status conditions represent persistent mechanical overrides, buffs, and DoT (Damage over Time) effects applied during combat. Active conditions appear as colored tags next to entities on the Grid.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-black border border-purple-500 p-4">
                                <span className="bg-purple-900 text-white text-xs px-2 py-1 border border-purple-500 font-bold uppercase tracking-wider mb-2 inline-block">Execute</span>
                                <p className="text-xs text-gray-300">Terminal erasure. Instantly reduces target HP to 0. Bypasses all barriers, parries, evasions, and invulnerability entirely.</p>
                            </div>
                            <div className="bg-black border border-purple-400 p-4">
                                <span className="bg-purple-900 text-white text-xs px-2 py-1 border border-purple-500 font-bold uppercase tracking-wider mb-2 inline-block">Hijacked</span>
                                <p className="text-xs text-gray-300">Neural override. The controlling Agent immediately selects and executes one of the target's native abilities using the target's physical token as the origin point. The state is instantly consumed after the action resolves.</p>
                            </div>
                            <div className="bg-black border border-red-500 p-4">
                                <span className="bg-red-900 text-white text-xs px-2 py-1 border border-red-500 font-bold uppercase tracking-wider mb-2 inline-block">Bleed</span>
                                <p className="text-xs text-gray-300">Target suffers exactly 3 HP Absolute Physical damage at the end of the round. (Stacks with other distinct DoTs).</p>
                            </div>
                            <div className="bg-black border border-orange-500 p-4">
                                <span className="bg-orange-900 text-white text-xs px-2 py-1 border border-orange-500 font-bold uppercase tracking-wider mb-2 inline-block">Burn</span>
                                <p className="text-xs text-gray-300">Target suffers exactly 3 HP Absolute Thermal damage at the end of the round. (Stacks with other distinct DoTs).</p>
                            </div>
                            <div className="bg-black border border-green-500 p-4">
                                <span className="bg-green-900 text-white text-xs px-2 py-1 border border-green-500 font-bold uppercase tracking-wider mb-2 inline-block">Poisoned</span>
                                <p className="text-xs text-gray-300">Target suffers exactly 3 HP Absolute Toxic damage at the end of the round. Uniquely volatile: Poison can infinitely stack upon itself.</p>
                            </div>
                            <div className="bg-black border border-gray-500 p-4">
                                <span className="bg-gray-800 text-white text-xs px-2 py-1 border border-gray-500 font-bold uppercase tracking-wider mb-2 inline-block">Immobilized</span>
                                <p className="text-xs text-gray-300">Movement points instantly reduced to 0. Entity cannot move manually or be repositioned via Blink/Dash skills. Can still attack normally.</p>
                            </div>
                            <div className="bg-black border border-yellow-500 p-4">
                                <span className="bg-yellow-700 text-white text-xs px-2 py-1 border border-yellow-500 font-bold uppercase tracking-wider mb-2 inline-block">Stunned</span>
                                <p className="text-xs text-gray-300">Catastrophic lockdown. Movement is 0. Entity cannot execute Basic Attacks or Custom Skills. All Defensive Matrices are jammed (set to 0).</p>
                            </div>
                            <div className="bg-black border border-blue-400 p-4">
                                <span className="bg-blue-900 text-white text-xs px-2 py-1 border border-blue-400 font-bold uppercase tracking-wider mb-2 inline-block">Shielded</span>
                                <p className="text-xs text-gray-300">Ablative armor. Absorbs exactly 5 incoming damage from the very next attack targeting the entity, then automatically shatters and clears.</p>
                            </div>
                            <div className="bg-black border border-pink-500 p-4">
                                <span className="bg-pink-900 text-white text-xs px-2 py-1 border border-pink-500 font-bold uppercase tracking-wider mb-2 inline-block">Vulnerable</span>
                                <p className="text-xs text-gray-300">Structural compromise. Entity takes a massive 1.5x Multiplier to incoming damage from the very next attack instance, after which the state is consumed.</p>
                            </div>
                            <div className="bg-black border border-orange-800 p-4">
                                <span className="bg-orange-950 text-white text-xs px-2 py-1 border border-orange-800 font-bold uppercase tracking-wider mb-2 inline-block">Knockdown</span>
                                <p className="text-xs text-gray-300">Kinetic disruption. Movement points are halved for the current turn. Entity automatically recovers and clears the state at Round Advance.</p>
                            </div>
                            <div className="bg-black border border-gray-700 p-4">
                                <span className="bg-gray-900 text-gray-300 text-xs px-2 py-1 border border-gray-600 font-bold uppercase tracking-wider mb-2 inline-block">Blind</span>
                                <p className="text-xs text-gray-300">Optics malfunction. All targeting arrays are forcefully restricted to Range 1 (adjacent hexes only) and Area of Effect radius is zeroed out.</p>
                            </div>
                            <div className="bg-black border border-[#00f0ff] p-4">
                                <span className="bg-[#004444] text-[#00f0ff] text-xs px-2 py-1 border border-[#00f0ff] font-bold uppercase tracking-wider mb-2 inline-block">Haste</span>
                                <p className="text-xs text-gray-300">Neural acceleration. Movement points are temporarily increased by +2 for as long as the state remains active on the entity.</p>
                            </div>
                            <div className="bg-black border border-slate-600 p-4">
                                <span className="bg-slate-800 text-gray-300 text-xs px-2 py-1 border border-slate-500 font-bold uppercase tracking-wider mb-2 inline-block">Slowed</span>
                                <p className="text-xs text-gray-300">Neural drag. Movement points are temporarily reduced by -2 for as long as the state remains active on the entity.</p>
                            </div>
                            <div className="bg-black border border-blue-600 p-4">
                                <span className="bg-blue-900 text-blue-200 text-xs px-2 py-1 border border-blue-600 font-bold uppercase tracking-wider mb-2 inline-block">Shocked</span>
                                <p className="text-xs text-gray-300">Circuit malfunction. Entity can still move and attack normally, but all defensive arrays (Parry, Intercept, Evade) are jammed and locked at 0 mitigation.</p>
                            </div>
                            <div className="bg-black border border-teal-500 p-4">
                                <span className="bg-teal-900 text-teal-200 text-xs px-2 py-1 border border-teal-500 font-bold uppercase tracking-wider mb-2 inline-block">Evasive</span>
                                <p className="text-xs text-gray-300">Quantum ghosting. Forces the next incoming attack to bypass Front Parry/Intercept entirely and roll strictly against Backline Evasion. Consumed upon triggering.</p>
                            </div>
                            <div className="bg-black border border-yellow-300 p-4">
                                <span className="bg-yellow-900 text-yellow-200 text-xs px-2 py-1 border border-yellow-300 font-bold uppercase tracking-wider mb-2 inline-block">Invulnerable</span>
                                <p className="text-xs text-gray-300">Stasis field. Completely negates 100% of the damage and mechanical effects of the next incoming attack, then immediately shatters.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeChapter === 'terrain' && (
                    <div className="animate-fade-in space-y-6 max-w-4xl">
                        <h1 className="text-3xl font-bold text-yellow-500 uppercase border-b border-yellow-900 pb-2 mb-6">07. Terrain Synthesis</h1>
                        <p className="text-gray-400 text-sm mb-6">
                            The Grid Board supports dynamic terrain generation through custom skills or direct GM overrides. Once placed, terrain persists until cleared or overwritten by an Elemental Reaction.
                        </p>

                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-black border border-gray-700 p-4">
                                <div className="w-12 h-12 shrink-0 bg-[rgba(234,179,8,0.4)] border-2 border-yellow-500 clip-hex flex items-center justify-center text-yellow-500 font-bold text-xs">MIN</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-base mb-1">Minor Terrain (Cost: u=1)</div>
                                    <p className="text-xs text-gray-400 leading-relaxed">Imposes physical drag on traversing entities. Movement through this hex costs exactly <strong>2 Movement Points</strong> instead of the standard 1 point. Often generated by Ice, Vines, or Magnetic fields.</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-black border border-gray-700 p-4">
                                <div className="w-12 h-12 shrink-0 bg-[rgba(168,85,247,0.4)] border-2 border-purple-500 clip-hex flex items-center justify-center text-purple-500 font-bold text-xs">MAJ</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-base mb-1">Major Terrain (Cost: u=3)</div>
                                    <p className="text-xs text-gray-400 leading-relaxed">Hazardous environment. Movement cost is normal (1 point), but entities ending their turn inside this hex suffer <strong>5 Absolute Damage</strong> automatically at Round Advance. Often generated by Lava, Acid, or Plasma pools.</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-black border border-gray-700 p-4">
                                <div className="w-12 h-12 shrink-0 bg-[rgba(59,130,246,0.4)] border-2 border-blue-500 clip-hex flex items-center justify-center text-blue-500 font-bold text-xs">SEV</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-base mb-1">Severe Terrain (Cost: u=5)</div>
                                    <p className="text-xs text-gray-400 leading-relaxed">Impassable bedrock. Completely blocks standard Movement and Line-of-Sight. Entities forcibly displaced into this hex via Pull/Push abilities suffer lethal Entombment [Crushed state]. Often generated by Glacier Walls or Earth Pillars.</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-black border border-gray-700 p-4">
                                <div className="w-12 h-12 shrink-0 bg-[rgba(148,163,184,0.7)] border-2 border-slate-300 clip-hex flex items-center justify-center text-white font-bold text-[10px]">STM</div>
                                <div>
                                    <div className="font-bold text-white uppercase text-base mb-1">Volatile Steam (Reaction Only)</div>
                                    <p className="text-xs text-gray-400 leading-relaxed">Generated instantly when a <span className="text-red-400 font-bold">Thermal</span> attack hits a hex already coated in <span className="text-blue-400 font-bold">Cryo</span> terrain. Blocks Line-of-Sight entirely. Entities ending their turn inside suffer <strong>5 Kinetic Damage</strong> (Boiling) at Round Advance.</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row md:items-center gap-4 bg-black border border-gray-700 p-4">
                                <div className="w-12 h-12 shrink-0 bg-transparent border-2 border-red-500 clip-hex flex items-center justify-center text-red-500 font-bold text-2xl">✕</div>
                                <div>
                                    <div className="font-bold text-red-500 uppercase text-base mb-1">Clear Terrain (Cost: u=2)</div>
                                    <p className="text-xs text-gray-400 leading-relaxed">A specialized terrain synthesis tag used to strip existing modifications from a hex. Utilizing this tag instantly overwrites Minor, Major, Severe, or Steam terrain, reverting the hex back to a blank slate. (Can also be achieved via certain Elemental Reactions like Combustion or Annihilation).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}