/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';

export default function Rulebook() {
    const [activeChapter, setActiveChapter] = useState('core');

    const chapters = [
        { id: 'core', label: '1. The Resonance Engine (VTT)' },
        { id: 'flow', label: '2. Encounter Flow & Deployment' },
        { id: 'grid', label: '3. Grid Movement & Terrain' },
        { id: 'combat', label: '4. Automated Combat & Defense' },
        { id: 'armory', label: '5. Classes, HP & Synergy' },
        { id: 'synthesis', label: '6. The Synthesis Matrix' }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[75vh] font-mono text-sm">
            {/* Sidebar */}
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

            {/* Content Area */}
            <div className="flex-1 bg-[#1a222c] p-6 md:p-10 border border-slate-700 overflow-y-auto text-gray-300 space-y-6 shadow-inner">
                
                {activeChapter === 'core' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">1. The Resonance Engine</h1>
                        
                        <div className="bg-gray-900 border border-[#00f0ff] p-4 mb-6">
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 uppercase tracking-widest">Fully Automated System</h3>
                            <p className="leading-relaxed">Players do not calculate damage, distances, line-of-sight, or flanking angles. The VTT handles all vector math automatically. When a player or GM clicks "TARGET" on a weapon or ability, and clicks an enemy token on the grid, the Engine automatically calculates the trajectory, applies synergy bonuses, deducts the specific defensive stats, shatters barriers, and updates the token's HP instantly.</p>
                        </div>

                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2">The Blank Slate</h3>
                            <p className="leading-relaxed">The foundational rule of the system is negotiation through creation. Combat starts on a completely featureless grid. The GM does not pre-build walls, obstacles, or cover. Instead, players and GMs dynamically paint the battlefield using the Utility ("u") values of the abilities they synthesize.</p>
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
                            <p className="leading-relaxed">The GM utilizes the Active Turn Tracker on their dashboard to pass priority back and forth. Players click their token, click the floating "Move" button, and place themselves anywhere within their designated zone. Once all units are deployed, the GM advances the tracker to Round 1.</p>
                        </div>

                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">System Overload</h3>
                            <p className="leading-relaxed">Combat is designed to detonate, not drag. At the start of <strong>Round 4</strong>, the Engine initiates System Overload. All Resonance generation doubles, and all damage sources across the board are multiplied by 1.5x.</p>
                        </div>
                    </div>
                )}

                {activeChapter === 'grid' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">3. Grid Movement & Terrain</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">Speed (SPD) & Facing</h3>
                            <p className="leading-relaxed mb-4">Tokens have an intrinsic Speed stat (default 3), editable via the Token Inspector. Priming a move visually highlights all accessible hexes. Moving costs 1 point per hex. Tokens can freely rotate their front facing arc at the end of their movement by clicking the arrow indicator on their token.</p>
                        </div>

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
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">4. Automated Combat & Defense</h1>
                        
                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2">The "Once Per Turn" Limitation</h3>
                            <p className="leading-relaxed mb-4">Defensive actions (Parry, Intercept, Evade) can only be utilized <strong>ONCE per turn</strong>. The Resonance Engine automates this: if you are attacked from the front, the engine calculates your Parry, mitigates the damage, and <em>automatically sets your Parry to "USED" on your HUD</em>. If you are attacked from the front again before clicking "Refresh Turn", you will take raw, unmitigated damage.</p>
                        </div>

                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">Automated Vector Resolutions</h3>
                            <ul className="space-y-4 list-none">
                                <li className="bg-black p-4 border border-gray-700">
                                    <strong className="text-white text-base">Front Parry (Front DP + Wpn Base)</strong><br/>
                                    <span className="text-xs text-gray-400">Trigger: Attack originates inside your 3-hex front arc.</span><br/>
                                    The Engine calculates the angle. If the attacker is in front of you, Parry is automatically applied.
                                </li>
                                <li className="bg-black p-4 border border-gray-700">
                                    <strong className="text-white text-base">Backline Evasion (Back DP + 3)</strong><br/>
                                    <span className="text-xs text-gray-400">Trigger: Attack originates in your rear 3 hexes, OR is an AoE blast.</span><br/>
                                    If the Engine detects a flanking angle or a radius blast, it bypasses your weapon and uses Evasion to mitigate.
                                </li>
                                <li className="bg-black p-4 border border-gray-700">
                                    <strong className="text-white text-base">Support Intercept (Supp DP + 3)</strong><br/>
                                    <span className="text-xs text-gray-400">Trigger: Proactive</span><br/>
                                    Unlike Parry/Evade, Interception is manual. A player can spend their Intercept to jump in and mitigate damage targeting an adjacent ally.
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">Hostile Barriers & Staggering</h3>
                            <p className="leading-relaxed">Enemies do not use DP. They possess raw HP and layered Barriers. The Engine automatically routes incoming damage to shatter barriers first. Once an enemy's final barrier is reduced to 0, the Engine marks them as <strong>STAGGERED</strong> (highlighted in yellow), meaning subsequent attacks deal full damage directly to their HP pool.</p>
                        </div>
                    </div>
                )}

                {activeChapter === 'armory' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">5. Classes, HP & Synergy</h1>
                        
                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2">Automated HP Scaling</h3>
                            <p className="leading-relaxed mb-4">Max HP is dynamically calculated based on your Discipline Point (DP) build. Every Agent starts with 20 Base HP, automatically increased by the following ratios:</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4 mb-4 font-bold text-white">
                                <li>+3 Max HP per point of Frontline DP.</li>
                                <li>+2 Max HP per point of Support DP.</li>
                                <li>+1 Max HP per point of Backline DP.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">DP Weapon Requirements</h3>
                            <p className="leading-relaxed mb-4">Any character can equip any weapon, but to unlock its <strong>Synergy Bonus</strong>, you must meet the exact DP thresholds listed on the HUD dropdown.</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-2 ml-4">
                                <li><strong>Vanguard Synergy [Req 10F/0S/0B]:</strong> Heavy Melee. Massive damage, boosts frontline parries.</li>
                                <li><strong>Paladin Synergy [Req 5F/5S/0B]:</strong> Shields & Maces. Heavily boosts both parries and interceptions.</li>
                                <li><strong>Sniper Synergy [Req 0F/0S/10B]:</strong> Longbows & Muskets. Max range, massive raw damage.</li>
                                <li><strong>Conduit Synergy [Req 0F/10S/0B]:</strong> Catalysts. Mid-range magic, heavily boosts support intercepts.</li>
                                <li><strong>Skirmisher Synergy [Req 5F/0S/5B]:</strong> Agile Arms. Mobility, boosts damage and backline evasion.</li>
                                <li><strong>Saboteur Synergy [Req 0F/5S/5B]:</strong> Traps & Alchemy. Control tools, boosts intercepts and evasion.</li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeChapter === 'synthesis' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">6. The Synthesis Matrix</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">Player Resonance</h3>
                            <p className="leading-relaxed mb-4">Resonance is fuel. It is capped at 10 points per player. Earn Resonance through tactical actions:</p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
                                <li><strong>Basic Attack:</strong> +1 Res</li>
                                <li><strong>Banter / Roleplay:</strong> +1 Res</li>
                                <li><strong>Tag-Team / Combo:</strong> +2 Res</li>
                                <li><strong>Exploiting a Weakness:</strong> +2 Res</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">Building Abilities</h3>
                            <p className="leading-relaxed mb-4">Players do not have pre-written spell lists. They use the HUD to build custom abilities on the fly using the mathematical Engine formula:</p>
                            <div className="bg-black p-4 border border-[#ff6600] text-center text-xl font-bold tracking-widest text-white shadow-inner my-4">R_cost = ⌈ α × (d + u + a²) ⌉</div>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
                                <li><strong>d (Damage):</strong> Raw damage output.</li>
                                <li><strong>u (Utility):</strong> Status effects (1 = Minor, 3 = Major, 5 = Severe).</li>
                                <li><strong>a (AoE Radius):</strong> Hex blast radius.</li>
                                <li><strong>α (Affinity):</strong> Synergy (0.75), Neutral (1.0), or Resistance (2.0).</li>
                            </ul>
                            <p className="mt-4 leading-relaxed">Once built, abilities can be Equipped to the active HUD (max 4), or Archived permanently in your Grimoire / Spellbook tab for later use.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}