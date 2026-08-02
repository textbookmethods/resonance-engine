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
        { id: 'states', label: '7. Utility & State Effects' }
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
                            <p className="leading-relaxed mb-4">The environment is painted dynamically based on the Utility Weight (u) of synthesized abilities:</p>
                            <ul className="space-y-4 list-none">
                                <li className="bg-black border-l-4 border-yellow-500 p-3">
                                    <strong className="text-yellow-500">Minor Terrain (u=1)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Mud, Caltrops</span><br/>
                                    Doubles the movement cost to enter the hex.
                                </li>
                                <li className="bg-black border-l-4 border-purple-500 p-3">
                                    <strong className="text-purple-500">Major Terrain (u=3)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Void Rifts, Magma</span><br/>
                                    Blocks shift/dash abilities. Deals environmental damage if a token ends their turn inside it.
                                </li>
                                <li className="bg-black border-l-4 border-blue-500 p-3">
                                    <strong className="text-blue-500">Severe Terrain (u=5)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Bedrock Pillars, Forcefields</span><br/>
                                    Completely impassable. Blocks line-of-sight for targeting.
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
                        </div>
                    </div>
                )}

                {activeChapter === 'synthesis' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">6. The Synthesis Matrix</h1>
                        
                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">Building Abilities</h3>
                            <p className="leading-relaxed mb-4">Players do not have pre-written spell lists. They use the HUD to build custom abilities on the fly using the mathematical Engine formula:</p>
                            <div className="bg-black p-4 border border-[#ff6600] text-center text-xl font-bold tracking-widest text-white shadow-inner my-4">R_cost = ⌈ α × (d + u + a²) ⌉</div>
                            
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-8">Automated Affinity (α)</h3>
                            <p className="leading-relaxed mb-4">Players cannot manually declare Affinity. The Engine calculates it automatically based on your Class Specialization, Equipped Weapon, and the concepts you type into the Matrix.</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                                <li><strong>Synergy (0.75x Cost):</strong> The ability mechanically aligns with your <strong>Innate Element Affinity</strong>, your Class Playstyle, or your Weapon Element.</li>
                                <li><strong>Neutral (1.0x Cost):</strong> No direct alignment. Standard execution.</li>
                                <li><strong>Resistance (2.0x Cost):</strong> You are attempting to force a Severe or Terminal state effect that directly opposes your Class training (e.g., A Conduit attempting to Execute with brute force).</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeChapter === 'states' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">7. Utility & State Effects</h1>
                        
                        <div>
                            <h3 className="text-[#a855f7] font-bold text-lg mb-2">Applying Buffs & Debuffs</h3>
                            <p className="leading-relaxed mb-4">The Engine fully supports player-created buffs, shields, and debuffs. This is governed by the <strong>Utility (u)</strong> variable. If you select a Utility value greater than 0, a purple <strong>State Concept</strong> box will appear in the matrix. Type any word that comes to mind (e.g., "Snare", "Burn", "Execute"). The Engine's dictionary will intercept your imagination and map it to a mechanical Core State.</p>
                            
                            <ul className="space-y-2 list-none text-gray-400">
                                <li><strong className="text-white">u = 0 :</strong> Pure Damage. No extra effects.</li>
                                <li><strong className="text-white">u = 1 :</strong> Minor Buff/Debuff (e.g., +1 Movement, -1 DP)</li>
                                <li><strong className="text-white">u = 3 :</strong> Major Buff/Debuff (e.g., Shielded, Immobilized, Bleed)</li>
                                <li><strong className="text-white">u = 5 :</strong> Severe Buff/Debuff (e.g., Invulnerable, Stunned)</li>
                            </ul>
                        </div>

                        <div className="bg-black border border-red-500 p-4 mt-6">
                            <h3 className="text-red-500 font-bold text-lg mb-2 uppercase tracking-widest">TERMINAL EFFECTS (u = 10)</h3>
                            <p className="leading-relaxed mb-4">These are reality-breaking states reserved for apex tier actions. They cost massive amounts of Resonance to synthesize—requiring either Tag-Team combos or Class Synergy to even afford.</p>
                            <ul className="list-disc list-inside text-gray-300 space-y-1 ml-4">
                                <li><strong>[Execute]:</strong> Target is instantly erased from the grid. Bypasses all HP, shatters all remaining barriers, and ignores player defensive stats. HP is violently reduced to 0. <em>(Note: The Engine dictionary natively recognizes words like Erase, Delete, Obliterate, Assassinate, and Kill as an Execute command).</em></li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}