/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';

export default function Rulebook() {
    const [activeChapter, setActiveChapter] = useState('core');

    const chapters = [
        { id: 'core', label: '1. The Resonance Engine (VTT)' },
        { id: 'flow', label: '2. Encounter Flow & Deployment' },
        { id: 'prog', label: '3. Progression (XP & Affinity)' },
        { id: 'grid', label: '4. Grid Movement & Terrain' },
        { id: 'combat', label: '5. Automated Combat & Defense' },
        { id: 'synthesis', label: '6. The Synthesis Matrix' },
        { id: 'states', label: '7. Dictionary & State Physics' }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[75vh] font-mono text-sm">
            <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-slate-700 flex flex-col gap-2 shrink-0 overflow-y-auto shadow-xl">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2 uppercase tracking-wide">Manual</h2>
                {chapters.map(chap => (
                    <button 
                        key={chap.id}
                        className={`p-3 text-left transition-colors border-l-4 ${activeChapter === chap.id ? 'bg-black border-[#ff6600] text-[#ff6600] font-bold shadow-inner' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setActiveChapter(chap.id)}
                    >
                        {chap.label}
                    </button>
                ))}
            </div>

            <div className="flex-1 bg-[#1a222c] p-6 md:p-10 border border-slate-700 overflow-y-auto text-gray-300 space-y-6 shadow-inner">
                
                {activeChapter === 'core' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">1. The Resonance Engine</h1>
                        
                        <div className="bg-gray-900 border border-[#00f0ff] p-4 mb-6">
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 uppercase tracking-widest">Fully Automated System</h3>
                            <p className="leading-relaxed">Players do not calculate damage, distances, line-of-sight, or flanking angles. The VTT handles all vector math automatically. When a player or GM clicks "TARGET" on a weapon or ability, and clicks an enemy token on the grid, the Engine automatically calculates the trajectory, applies synergy bonuses, deducts the specific defensive stats, shatters barriers, and updates the token's HP instantly.</p>
                        </div>
                    </div>
                )}

                {activeChapter === 'flow' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">2. Encounter Flow & Deployment</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">Round 0: Deployment Phase</h3>
                            <p className="leading-relaxed mb-4">Every encounter begins in Round 0. During this phase, the grid visually splits into two sectors:</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4 mb-4">
                                <li><strong>Northern Sector (Red):</strong> Hostile drop zone.</li>
                                <li><strong>Southern Sector (Blue):</strong> Agent drop zone.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeChapter === 'prog' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">3. Progression (XP & Affinity)</h1>
                        
                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">Discipline Points (DP)</h3>
                            <p className="leading-relaxed mb-4">All Agents begin with <strong>5 Base DP</strong>. As you accumulate Experience (XP) from the GM, you unlock more DP. Every <strong>10 XP</strong> grants <strong>+1 DP</strong>.</p>
                            <p className="leading-relaxed mb-4">Allocating DP into your Front, Support, or Back stats natively alters your Max HP and your active Class. The Engine calculates this strict progression tree:</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4 mb-4">
                                <li><strong>Tier 1 Base:</strong> Paladin (5F/5S), Skirmisher (5F/5B), Saboteur (5S/5B)</li>
                                <li><strong>Tier 2 Mastery:</strong> Vanguard (10F), Conduit (10S), Sniper (10B)</li>
                            </ul>
                            <p className="leading-relaxed mt-4 italic text-sm text-gray-500 mb-6">Note: Class evaluation is strictly ordered. If you reach Tier 2 Vanguard by allocating 10 points to Front, you are permanently locked as a Vanguard—even if you later allocate 10 points to Support—unless you intentionally reduce your Front stat back below 10.</p>
                            
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 pt-6 border-t border-gray-700">Innate Elemental Affinity</h3>
                            <p className="leading-relaxed mb-4">Players must also choose their <strong>Innate Element Affinity</strong> during character creation using the HUD. Once this element is locked in, it cannot be changed. It permanently provides a Synergy discount when synthesizing abilities of that element type.</p>
                        </div>
                    </div>
                )}

                {activeChapter === 'grid' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">4. Grid Movement & Terrain</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">Terrain Painted by Abilities</h3>
                            <p className="leading-relaxed mb-4">Players can dynamically alter the environment by adding a <strong>Terrain (t)</strong> generation effect to their synthesized spells. When executed, every hex within the spell's Area of Effect (AoE) radius is instantly painted with that terrain.</p>
                            <ul className="space-y-4 list-none">
                                <li className="bg-black border-l-4 border-yellow-500 p-3">
                                    <strong className="text-yellow-500">Minor Terrain (t=1)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Mud, Caltrops</span><br/>
                                    Doubles the movement cost to enter the hex.
                                </li>
                                <li className="bg-black border-l-4 border-gray-400 p-3">
                                    <strong className="text-gray-400">Clear Terrain (t=2)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Dispel, Wash, Burn Away</span><br/>
                                    Removes any existing terrain effects and reverts the hexes to neutral ground. Can also shatter Severe Terrain bedrock.
                                </li>
                                <li className="bg-black border-l-4 border-purple-500 p-3">
                                    <strong className="text-purple-500">Major Terrain (t=3)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Void Rifts, Magma</span><br/>
                                    Blocks shift/dash abilities. Deals <strong>5 Environmental Damage</strong> automatically if a token ends their round inside it.
                                </li>
                                <li className="bg-black border-l-4 border-blue-500 p-3">
                                    <strong className="text-blue-500">Severe Terrain (t=5)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Bedrock Pillars, Forcefields</span><br/>
                                    Completely impassable. Blocks line-of-sight for targeting.
                                </li>
                                <li className="bg-black border-l-4 border-slate-400 p-3">
                                    <strong className="text-slate-300">Steam (Elemental Reaction Override)</strong><br/>
                                    If an active Cryo hex is hit by a Thermal spell, it reacts. The Engine generates a Steam Explosion (+5 Damage to occupants) and converts the terrain into Steam. Steam blocks Line-of-Sight and deals 5 Kinetic damage at the end of the round.
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeChapter === 'combat' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">5. Automated Combat & Defense</h1>
                        
                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">Hostile Barriers & Staggering</h3>
                            <p className="leading-relaxed">Enemies do not use DP. They possess raw HP and layered Barriers. The Engine automatically routes incoming damage to shatter barriers first. Once an enemy's final barrier is reduced to 0, the Engine marks them as <strong>STAGGERED</strong> (highlighted in yellow), meaning subsequent attacks deal full damage directly to their HP pool.</p>

                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">Flanking Bonus</h3>
                            <p className="leading-relaxed">The Engine natively evaluates positional vectors. If a single-target attack strikes an entity from outside its <strong>180-degree forward facing arc (the back three hexes)</strong>, the incoming damage is automatically multiplied by <strong>1.5x</strong> before mitigation.</p>
                        </div>
                    </div>
                )}

                {activeChapter === 'synthesis' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">6. The Synthesis Matrix</h1>
                        
                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">Building Abilities</h3>
                            <p className="leading-relaxed mb-4">Players do not have pre-written spell lists. They use the HUD to build custom abilities on the fly using the mathematical Engine formula:</p>
                            
                            <div className="bg-black p-4 border border-[#ff6600] text-center text-xl font-bold tracking-widest text-white shadow-inner my-4">R_cost = ⌈ α × (d + u + t + m + a) ⌉</div>
                            
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4 mb-8">
                                <li><strong>d (Damage):</strong> Raw damage output.</li>
                                <li><strong>u (Utility):</strong> Status effects (1 = Minor, 3 = Major, 5 = Severe, 10 = Terminal).</li>
                                <li><strong>t (Terrain Gen):</strong> Adds a physical Grid effect (1 = Minor, 2 = Clear, 3 = Major, 5 = Severe).</li>
                                <li><strong>m (Mobility):</strong> Self Displacement or Target Movement (0-10 Hexes).</li>
                                <li><strong>a (AoE Shape):</strong> 3-Hex Lines and Clusters cost 1. Circular radii costs scale quadratically.</li>
                                <li><strong>α (Affinity):</strong> Evaluates Synergy or RPS matchups.</li>
                            </ul>

                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-8">Automated Elemental Affinity (α) & RPS</h3>
                            <p className="leading-relaxed mb-4">The Engine automatically calculates Affinity bonuses during Synthesis, and Rock-Paper-Scissors multipliers during combat detonation:</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                                <li><strong>RPS Advantage (1.5x Damage):</strong> Thermal beats Cryo. Cryo beats Toxic. Toxic beats Thermal. Radiant and Void destroy each other. Electro and Kinetic destroy each other.</li>
                                <li><strong>Synergy (0.75x Cost):</strong> The ability mechanically aligns with your <strong>Innate Element Affinity</strong>, your Class Playstyle, or your Weapon Element.</li>
                                <li><strong>Resistance (2.0x Cost):</strong> You are attempting to force a Severe or Terminal state effect that directly opposes your Class training, OR you are channeling an Element that opposes your Innate Affinity in the RPS matrix (e.g., a Thermal Agent trying to channel Toxic, or a Radiant Agent channeling Void).</li>
                            </ul>

                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-8 border-t border-gray-700 pt-6">Improvised Skills (Crafting on the fly)</h3>
                            <p className="leading-relaxed mb-4">Instead of archiving a built spell, you can immediately execute it from the Matrix for a flat cost of <strong>1 Resonance</strong>, regardless of its original R_cost. Doing so forces the Engine to roll a 1d6 upon detonation:</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                                <li><strong>Cascade (5-6):</strong> The spell fires flawlessly.</li>
                                <li><strong>Surge (3-4):</strong> The spell fires, but the casting Agent suffers feedback damage equal to the original calculated R_cost.</li>
                                <li><strong>Backlash (1-2):</strong> Catastrophic failure. The Engine overrides the targeting arrays and instantly detonates the spell on the caster's own hex!</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeChapter === 'states' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">7. Dictionary & State Physics</h1>
                        
                        <div>
                            <h3 className="text-[#a855f7] font-bold text-lg mb-2">Automated Mechanical Definitions</h3>
                            <p className="leading-relaxed mb-4">The Engine uses a semantic dictionary to map player imagination into core mechanical physics. If a player targets an entity with the concept "Petrify," the engine reads this as the core state `Stunned` and physically locks the target's controls.</p>
                            
                            <ul className="space-y-4 list-none text-gray-300">
                                <li className="bg-gray-900 border border-gray-700 p-3">
                                    <strong className="text-[#00f0ff] text-lg uppercase tracking-wider block mb-1">Defense Modifiers</strong>
                                    <strong>Shielded:</strong> Subtly absorbs 5 incoming damage and shatters.<br/>
                                    <strong>Vulnerable:</strong> Target receives 1.5x incoming damage.<br/>
                                    <strong>Evasive:</strong> The next attack mathematically forces an evasion roll regardless of attack vector.<br/>
                                    <strong>Invulnerable:</strong> The incoming attack is completely negated.
                                </li>
                                
                                <li className="bg-gray-900 border border-gray-700 p-3">
                                    <strong className="text-[#ff6600] text-lg uppercase tracking-wider block mb-1">Movement Modifiers</strong>
                                    <strong>Haste:</strong> Instantly adds +2 to token movement logic.<br/>
                                    <strong>Slowed:</strong> Instantly subtracts -2 from token movement logic.<br/>
                                    <strong>Knockdown:</strong> Halves base speed. Fades at the start of the next round.<br/>
                                    <strong>Immobilized:</strong> movement drops to 0. The token physically cannot be moved on the grid.
                                </li>

                                <li className="bg-gray-900 border border-gray-700 p-3">
                                    <strong className="text-yellow-500 text-lg uppercase tracking-wider block mb-1">Control Jamming</strong>
                                    <strong>Blind:</strong> The entity's targeting arrays are forced to adjacent hexes (Range = 1, AoE = 0).<br/>
                                    <strong>Shocked:</strong> The entity's Defensive Arrays (Parry, Intercept, Evade) are completely jammed.<br/>
                                    <strong>Stunned:</strong> The entity's HUD is fully locked. Cannot target, move, or defend.
                                </li>

                                <li className="bg-gray-900 border border-gray-700 p-3">
                                    <strong className="text-[#22c55e] text-lg uppercase tracking-wider block mb-1">Environmental Physics (DoTs Stack!)</strong>
                                    <strong>Bleed / Burn / Poisoned:</strong> Damage over Time states. When the GM advances to the next round, the Engine automatically applies 3 direct HP damage per active state. <em>(e.g., If a target is Bleeding AND Poisoned, they take 6 damage).</em><br/>
                                    <strong>Major Terrain:</strong> If an entity is standing in Major Terrain (e.g. Magma) when the round ends, they take 5 Environmental Damage.
                                </li>
                                
                                <li className="bg-gray-900 border border-gray-700 p-3">
                                    <strong className="text-blue-400 text-lg uppercase tracking-wider block mb-1">Mobility Vectors</strong>
                                    <strong>Blink (Self):</strong> Words like *Teleport, Jump, Dash, Tunnel*. The Engine transforms the ability into a dynamic relocation array, allowing the Agent to move instantly across the grid, bypassing movement limits and hazardous terrain. <br/>
                                    <strong>Push / Pull (Forced):</strong> Words like *Throw, Drag, Slam, Hook*. The Engine calculates a mathematical vector between the Attacker and the Target upon detonation, projecting the enemy across the grid. If the enemy slams into impassable bedrock before their momentum is spent, they suffer <strong>1 physical damage</strong> per remaining hex.
                                </li>
                            </ul>
                        </div>

                        <div className="bg-black border border-red-500 p-4 mt-6">
                            <h3 className="text-red-500 font-bold text-lg mb-2 uppercase tracking-widest">TERMINAL EFFECTS (u = 10)</h3>
                            <p className="leading-relaxed mb-4">These are reality-breaking states reserved for apex tier actions. They cost massive amounts of Resonance to synthesize—requiring either Tag-Team combos or Class Synergy to even afford.</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                <li><strong>[Execute]:</strong> Target is instantly erased from the grid. Bypasses all HP, shatters all remaining barriers, and ignores player defensive stats. HP is violently reduced to 0.</li>
                                
                                <li><strong>[Entombment]:</strong> If an entity occupies a Severe hex, and every single valid hex within a 2-hex radius is also Severe, the Engine will automatically crush them! Hostiles are executed immediately. Agents receive an Entombment Timer; if they do not escape by the end of the third round, they are Executed.</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}