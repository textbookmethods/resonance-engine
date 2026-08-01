import { useState } from 'react';

export default function Rulebook() {
    const [activeChapter, setActiveChapter] = useState('core');

    const chapters = [
        { id: 'core', label: '1. Core Philosophy' },
        { id: 'combat', label: '2. Combat & Defense' },
        { id: 'resonance', label: '3. Resonance & Synthesis' },
        { id: 'environment', label: '4. The Slate & Terrain' },
        { id: 'armory', label: '5. The Armory & Synergies' }
    ];

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[75vh] font-mono text-sm">
            {/* Table of Contents Sidebar */}
            <div className="w-full md:w-64 bg-[#1a222c] p-4 border border-slate-700 flex flex-col gap-2 shrink-0 overflow-y-auto">
                <h2 className="text-[#00f0ff] font-bold text-xl mb-4 border-b border-gray-700 pb-2 uppercase tracking-wide">Manual</h2>
                {chapters.map(chap => (
                    <button 
                        key={chap.id}
                        className={`p-3 text-left transition-colors border-l-4 ${activeChapter === chap.id ? 'bg-black border-[#ff6600] text-[#ff6600] font-bold' : 'bg-transparent border-transparent text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                        onClick={() => setActiveChapter(chap.id)}
                    >
                        {chap.label}
                    </button>
                ))}
            </div>

            {/* Rulebook Content Area */}
            <div className="flex-1 bg-[#1a222c] p-6 md:p-10 border border-slate-700 overflow-y-auto text-gray-300 space-y-6">
                
                {activeChapter === 'core' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">1. Core Philosophy</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">The Slate</h3>
                            <p className="leading-relaxed">
                                The foundational rule of the Resonance Engine is negotiation through creation. All combat must start on featureless terrain. The GM will not pre-build walls, obstacles, or cover. Instead, players and GMs must negotiate and build the battlefield dynamically using their abilities, affinities, and Resonance synthesis as the encounter unfolds.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">System Overload</h3>
                            <p className="leading-relaxed">
                                Combat is designed to be fast, lethal, and escalating. At the start of <strong>Round 4</strong>, atmospheric Resonance reaches critical mass. All Resonance generation doubles, and all damage sources (both player and enemy) are multiplied by 1.5x. Encounters are not meant to drag on; they are meant to detonate.
                            </p>
                        </div>
                    </div>
                )}

                {activeChapter === 'combat' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">2. Combat & Defense</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">Facing Arcs & Flanking</h3>
                            <p className="leading-relaxed">
                                Every entity commands a 3-hex front arc. Orientation matters. Attacks originating from the rear 3 hexes count as Flanking, which completely bypasses base mitigation stats. Position carefully and watch your token's facing indicator.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">Defensive Actions</h3>
                            <ul className="space-y-4 list-none">
                                <li className="bg-black p-4 border border-gray-700">
                                    <strong className="text-white text-base">Front Parry</strong><br/>
                                    <span className="text-xs text-gray-400">Formula: Front DP + Weapon Base</span><br/>
                                    Mitigates incoming damage that originates specifically within your 3-hex front arc. Represents actively striking away or absorbing blows.
                                </li>
                                <li className="bg-black p-4 border border-gray-700">
                                    <strong className="text-white text-base">Support Intercept</strong><br/>
                                    <span className="text-xs text-gray-400">Formula: Support DP + 3</span><br/>
                                    Allows you to project a shield or physically step in to mitigate damage targeted at an allied unit in an adjacent hex.
                                </li>
                                <li className="bg-black p-4 border border-gray-700">
                                    <strong className="text-white text-base">Backline Evasion</strong><br/>
                                    <span className="text-xs text-gray-400">Formula: Back DP + 3</span><br/>
                                    Used to dodge Flanking attacks (originating in your rear 3 hexes) or to mitigate Area of Effect (AoE) damage by diving out of the blast radius.
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeChapter === 'resonance' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">3. Resonance & Synthesis</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">Player Resonance</h3>
                            <p className="leading-relaxed mb-4">
                                Resonance is the fuel for custom abilities. It is capped at 10 points per player. Players earn Resonance through narrative and tactical actions:
                            </p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
                                <li><strong>Basic Attack:</strong> +1 Res</li>
                                <li><strong>Banter / Roleplay:</strong> +1 Res</li>
                                <li><strong>Tag-Team / Combo:</strong> +2 Res</li>
                                <li><strong>Exploiting a Weakness:</strong> +2 Res</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">The Global Enemy Pool</h3>
                            <p className="leading-relaxed mb-4">
                                Hostiles do not track individual pools. The GM controls a singular <strong>Global Enemy Pool</strong> to execute signature abilities. This limits enemy spam and allows players to strategically weather heavy attacks.
                            </p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
                                <li><strong>Start of Encounter:</strong> The GM begins with 10 Resonance.</li>
                                <li><strong>Per Round:</strong> The GM generates +1 Resonance for every hostile entity currently active on The Slate.</li>
                                <li><strong>Execution:</strong> Click the Execute [-X Res] button next to an enemy's ability to instantly spend from the Global Pool.</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">The Synthesis Matrix</h3>
                            <p className="leading-relaxed mb-4">
                                Players do not have pre-written spell lists. They use the HUD to build custom abilities on the fly using the Synthesis Matrix formula:
                            </p>
                            <div className="bg-black p-4 border border-[#ff6600] text-center text-xl font-bold tracking-widest text-white shadow-inner my-4">
                                R_cost = ⌈ α × (d + u + a²) ⌉
                            </div>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
                                <li><strong>d (Damage):</strong> Raw damage output.</li>
                                <li><strong>u (Utility):</strong> Status effects (1 = Minor, 3 = Major, 5 = Severe).</li>
                                <li><strong>a (AoE Radius):</strong> Hex blast radius.</li>
                                <li><strong>α (Affinity):</strong> Synergy (0.75), Neutral (1.0), or Resistance (2.0).</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-4"><em>*The system automatically rounds fractions up to the nearest whole number (⌈ ⌉).</em></p>
                        </div>
                    </div>
                )}

                {activeChapter === 'environment' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">4. The Slate & Terrain</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">Hex Movement</h3>
                            <p className="leading-relaxed">
                                Shifting to any adjacent standard hex costs 1 movement point. Tokens can freely rotate their facing arc at any point during their movement at no additional cost.
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2 mt-6">Terrain Painted by Abilities</h3>
                            <p className="leading-relaxed mb-4">
                                Because combat starts on a blank slate, the environment is painted by the abilities players and enemies use (determined by the Utility Weight "u").
                            </p>
                            <ul className="space-y-4 list-none">
                                <li className="bg-black border-l-4 border-yellow-500 p-3">
                                    <strong className="text-yellow-500">Minor Terrain (u=1)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Mud, Ice, Caltrops</span><br/>
                                    Doubles the movement cost to enter the hex.
                                </li>
                                <li className="bg-black border-l-4 border-purple-500 p-3">
                                    <strong className="text-purple-500">Major Terrain (u=3)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Deep Water, Void Rifts, Magma</span><br/>
                                    Blocks shift/dash abilities. Deals environmental damage or applies status effects if a token ends their turn inside it.
                                </li>
                                <li className="bg-black border-l-4 border-blue-500 p-3">
                                    <strong className="text-blue-500">Severe Terrain (u=5)</strong><br/>
                                    <span className="text-gray-400 text-xs">Examples: Bedrock Pillars, Forcefields</span><br/>
                                    Completely impassable. Breaks Line of Sight (LoS) for attacks.
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {activeChapter === 'armory' && (
                    <div className="space-y-6 animate-fade-in">
                        <h1 className="text-3xl text-white font-bold mb-6 border-b border-gray-700 pb-2">5. The Armory & Synergies</h1>
                        
                        <div>
                            <h3 className="text-[#00f0ff] font-bold text-lg mb-2">Loadout Flexibility</h3>
                            <p className="leading-relaxed">
                                Weapons are <strong>class-limited, but not class-restricted</strong>. This means any character can equip any weapon from the Armory. However, weapons are inherently designed to complement specific combat styles. 
                            </p>
                        </div>

                        <div>
                            <h3 className="text-[#ff6600] font-bold text-lg mb-2 mt-6">Class Synergy</h3>
                            <p className="leading-relaxed mb-4">
                                When a character equips a weapon that matches their current derived Class, they achieve <strong>Synergy</strong>. The Resonance Engine will automatically detect this link and instantly boost specific defensive actions or base damage thresholds.
                            </p>
                            <ul className="list-disc list-inside text-gray-400 space-y-1 ml-4">
                                <li><strong>Breach Shotgun:</strong> Synergy with <em>Vanguard</em>. High burst damage, close range, boosts frontline parries.</li>
                                <li><strong>Aegis Pistol & Shield:</strong> Synergy with <em>Paladin</em>. Defensive focus, boosts both parries and interceptions.</li>
                                <li><strong>Anti-Materiel Rifle:</strong> Synergy with <em>Sniper</em>. Maximum range, maximum raw damage output.</li>
                                <li><strong>Resonance Catalyst:</strong> Synergy with <em>Conduit</em>. Mid-range projection, heavily boosts support intercepts.</li>
                                <li><strong>Twin SMGs:</strong> Synergy with <em>Skirmisher</em>. Close-range mobility, boosts damage and backline evasion.</li>
                                <li><strong>Assault Carbine:</strong> The reliable fallback. Grants a flat damage boost for <em>Rookies</em> still finding their specialization.</li>
                            </ul>
                        </div>
                        
                        <div className="bg-gray-900 border border-gray-700 p-4 mt-4">
                            <span className="text-[#ff6600] font-bold block mb-1 uppercase tracking-wide">Tracking Range</span>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                A weapon's Range (e.g., 1-5 Hexes) strictly dictates the maximum distance a standard Base Attack can travel across The Slate. Custom abilities synthesized with Resonance are bound by the AoE radius ("a") you purchase during creation, not your weapon's default range.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}