import React, { useState } from 'react';

const STATE_DESCRIPTIONS = { 
    'Execute': 'Instantly reduces HP to 0. Bypasses Invulnerable/Shields.', 
    'Bleed': 'Takes 1 True Damage at End of Turn.', 
    'Burn': 'Takes 2 Thermal Damage at End of Turn. Water/Cryo cancels.', 
    'Poisoned': 'Healing received halved. Takes 1 Toxic Damage at End of Turn.', 
    'Immobilized': 'Movement reduced to 0. Cannot be pushed/pulled.', 
    'Stunned': 'Movement reduced to 0. Cannot act. Evasion drops to 0.', 
    'Shielded': 'Energy barrier mitigating incoming payloads.', 
    'Vulnerable': 'Takes 1.5x damage from all sources.', 
    'Knockdown': 'Movement points halved next turn. Melee attacks against unit gain Flanking (+50% Dmg).', 
    'Blind': 'Targeting range reduced to 1. AoE radius becomes 0.', 
    'Haste': '+2 Movement Points.', 
    'Slowed': '-2 Movement Points.', 
    'Shocked': 'Cannot use abilities costing >2 Res.', 
    'Evasive': 'Automatically mitigates next non-Flanking/non-AoE attack.', 
    'Invulnerable': 'Negates all incoming damage.',
    'Hijacked': 'Unit is controlled by opposing network.'
};

export default function Rulebook() {
    const [activeTab, setActiveTab] = useState('deployment');

    const tabs = [
        { id: 'deployment', label: 'I. Deployment & Grid' },
        { id: 'initiative', label: 'II. Initiative Flow' },
        { id: 'resonance', label: 'III. Resonance Economy' },
        { id: 'synthesis', label: 'IV. Synthesis & Echoes' },
        { id: 'states', label: 'V. Clinical States' },
        { id: 'progression', label: 'VI. Attrition & EXP' }
    ];

    return (
        <div className="bg-[#0f172a] min-h-[75vh] border border-slate-700 p-6 md:p-10 font-mono text-gray-300 shadow-inner flex flex-col md:flex-row gap-8">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <div className="border-b border-gray-700 pb-4 mb-2">
                    <h1 className="text-2xl font-bold text-[#a855f7] uppercase tracking-widest">Resonance</h1>
                    <p className="text-gray-500 text-[10px] tracking-widest uppercase mt-1">Tactical Operations Manual</p>
                </div>
                {tabs.map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`text-left px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-l-2 ${activeTab === tab.id ? 'bg-[#1e293b] border-[#a855f7] text-white' : 'bg-[#0f172a] border-gray-700 text-gray-500 hover:bg-[#1e293b] hover:text-gray-300'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="flex-1 bg-[#1e293b] border border-gray-700 p-6 md:p-8 overflow-y-auto shadow-md">
                
                {activeTab === 'deployment' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-[#d1d5db] font-bold text-xl uppercase tracking-widest border-b border-gray-700 pb-2">I. Encounter Initialization & Deployment</h2>
                        
                        <div className="space-y-4 text-sm leading-relaxed">
                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">Zero-State Battlefields</h3>
                                <p>All combat initializes on entirely featureless terrain to encourage active player interaction. Pre-built cover or environmental hazards dilute the tactical necessity of terrain-generation skills. The environment must be shaped organically through Agent actions and elemental reactions during the encounter.</p>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">Deployment Protocol</h3>
                                <ul className="list-disc pl-5 space-y-2 text-gray-400 marker:text-[#d1d5db]">
                                    <li><strong className="text-white">Agents:</strong> Must deploy exclusively within the southern sector of the grid (Rows 6-10).</li>
                                    <li><strong className="text-white">Hostiles:</strong> Must deploy within the northern sector of the grid (Rows 1-5).</li>
                                </ul>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">Pre-Combat Respec</h3>
                                <p>During the Deployment Phase, Agents hold unrestricted access to a system <strong>Respec</strong>. This action allows them to instantly reset Discipline Points (DP) to 0, clear all active custom cards from their HUD, and restore their HP to its base value before the encounter locks.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'initiative' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-[#d1d5db] font-bold text-xl uppercase tracking-widest border-b border-gray-700 pb-2">II. Initiative Flow</h2>
                        
                        <div className="space-y-4 text-sm leading-relaxed">
                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">Asymmetric Turn Blocks</h3>
                                <p>Initiative is segregated strictly by faction to ensure tactical coherence. All active Agents execute their turns in a randomized internal order. Once the final Agent completes their turn, initiative completely passes to the Hostile roster, which also acts in a randomized internal sequence.</p>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">End of Turn (EOT) Processing</h3>
                                <p>When an entity's turn concludes (and initiative passes), the grid automatically resolves <strong>End of Turn Damage</strong>. This includes terrain hazards (e.g., Major Terrain applying 5 physical damage) and Status Conditions (e.g., Bleed, Burn, and Poisoned) directly to the entity before the next turn begins.</p>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">Automated Refresh Cycle</h3>
                                <p>The manual tracking of cooldowns is obsolete. When an entity receives the active turn token, the system instantly and automatically restores:</p>
                                <ul className="list-disc pl-5 space-y-2 mt-2 text-gray-400 marker:text-[#22c55e]">
                                    <li>Movement Points (restored to Base Speed, modified by states).</li>
                                    <li>Defensive Actions (Front Parry, Support Intercept, Backline Evasion).</li>
                                    <li>Basic Attack availability.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'resonance' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-[#d1d5db] font-bold text-xl uppercase tracking-widest border-b border-gray-700 pb-2">III. The Resonance Economy</h2>
                        
                        <div className="space-y-4 text-sm leading-relaxed">
                            <div className="bg-[#0f172a] p-4 border border-[#a855f7]/50 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                <h3 className="text-[#e9d5ff] font-bold uppercase mb-2">Resonance Surge (Round 4+)</h3>
                                <p className="text-gray-300">Beginning on Round 4, the battlefield reaches critical mass. The <strong>Resonance Surge</strong> activates, permanently doubling all Resonance generation across the board. Every Basic Attack, Tag-Team, Assist, Exploit, and Hostile generation trigger yields exactly 2x standard values, exponentially accelerating combat lethality.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                    <h3 className="text-[#a855f7] font-bold uppercase mb-2">Agent Generation</h3>
                                    <ul className="space-y-2 text-gray-400">
                                        <li><span className="text-[#22c55e] font-bold mr-2">+2 RES</span> Basic Attack Execution</li>
                                        <li><span className="text-[#22c55e] font-bold mr-2">+2 RES</span> Assist Generation</li>
                                        <li><span className="text-[#22c55e] font-bold mr-2">+4 RES</span> Tag-Team (Flanking)</li>
                                        <li><span className="text-[#22c55e] font-bold mr-2">+4 RES</span> Exploit (Affinity/Vulnerable)</li>
                                    </ul>
                                </div>
                                <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                    <h3 className="text-[#d1d5db] font-bold uppercase mb-2">Hostile Generation</h3>
                                    <ul className="space-y-2 text-gray-400">
                                        <li><span className="text-white font-bold mr-2">Round 1:</span> +1 RES per active Hostile Tier (Max 10).</li>
                                        <li><span className="text-white font-bold mr-2">Round 2-3:</span> +1 RES per 2 active Hostile Tiers.</li>
                                        <li><span className="text-white font-bold mr-2">Round 4+:</span> +2 RES per 2 active Hostile Tiers (Surge).</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-white font-bold uppercase mb-2">Rift Walking (Overclocking)</h3>
                                <p className="mb-2 text-gray-300">Agents may intentionally damage their physical systems to fuel the Synthesis Matrix in emergencies. An Agent may sacrifice <strong>up to 10 HP</strong> to instantly generate an equivalent amount of Resonance.</p>
                                <p className="text-xs text-gray-400"><em>Failsafe: This action cannot be lethal. The system will abort the overclock if the requested sacrifice equals or exceeds the Agent's current HP.</em></p>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-red-400 font-bold uppercase mb-2">The Soft Cap</h3>
                                <p>Resonance pools are soft-capped at <strong>10</strong>. Agents may exceed this limit mid-turn via massive reaction cascades or assists, but the system will ruthlessly purge excess energy, resetting the pool back to 10 when the round advances.</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'synthesis' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-[#d1d5db] font-bold text-xl uppercase tracking-widest border-b border-gray-700 pb-2">IV. Synthesis Matrix & Tactical Echoes</h2>
                        
                        <div className="space-y-4 text-sm leading-relaxed">
                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">Weapon-Linked Optics</h3>
                                <p>Custom Action ranges are no longer dictated independently by the spell card. The targeting radius for all synthesized abilities is hard-locked to the Agent's currently equipped weapon range. Blindness restricts all optics to a range of 1 Hex.</p>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-[#a855f7]/30 border-l-4 border-l-[#a855f7] shadow-inner">
                                <h3 className="text-[#e9d5ff] font-bold uppercase mb-2">Tactical Echoes (Deployable Constructs)</h3>
                                <p className="mb-3">Agents may elect to manifest a loaded spell as a physical "Echo." This allows abilities to be cast from proxy locations rather than the Agent's own grid coordinates.</p>
                                <ul className="list-disc pl-5 space-y-2 text-gray-400 marker:text-[#a855f7]">
                                    <li><strong>Summoning:</strong> Targeting the Echo deployment requires an empty, single hex. The system safely zeroes out the spell's normal Area of Effect during the anchor phase.</li>
                                    <li><strong>Stats:</strong> The Echo is a static construct. It has 10 HP and 0 Movement Points. It can take damage and be destroyed by AoE or direct attacks.</li>
                                    <li><strong>Execution:</strong> By selecting the Echo token, the owning Agent can command it to cast its stored spell. The spell will project its original AoE and Payload using the Echo's hex as the origin point.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'states' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-[#d1d5db] font-bold text-xl uppercase tracking-widest border-b border-gray-700 pb-2">V. Clinical States & EOT Hazards</h2>
                        <p className="text-gray-400 text-sm mb-4">State definitions describe strict mechanical enforcement rather than flavor text. Applications of these states bypass standard defense unless stated otherwise.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.entries(STATE_DESCRIPTIONS).map(([state, desc]) => (
                                <div key={state} className="bg-[#0f172a] border border-gray-700 p-3 shadow-sm">
                                    <span className="text-[#a855f7] font-bold uppercase tracking-wider block mb-1">[{state}]</span>
                                    <span className="text-gray-300 text-xs">{desc}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'progression' && (
                    <div className="space-y-6 animate-fade-in">
                        <h2 className="text-[#d1d5db] font-bold text-xl uppercase tracking-widest border-b border-gray-700 pb-2">VI. Attrition & Progression</h2>
                        
                        <div className="space-y-4 text-sm leading-relaxed">
                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner flex items-start gap-4">
                                <div className="text-[#22c55e] text-4xl">⇪</div>
                                <div>
                                    <h3 className="text-[#22c55e] font-bold uppercase mb-1">Encounter EXP Pooling</h3>
                                    <p className="text-gray-400">Erased Hostiles grant exact experience values derived from their threat rating <strong>[Tier × 10 EXP]</strong>. When a Hostile's HP reaches 0 and they are purged from the tactical grid, this EXP value is stored safely in the Global Encounter Pool. Once the GM formally terminates the encounter, all accrued EXP is batch-distributed to the surviving Agents.</p>
                                </div>
                            </div>

                            <div className="bg-[#0f172a] p-4 border border-gray-700 shadow-inner">
                                <h3 className="text-[#a855f7] font-bold uppercase mb-2">Discipline Point (DP) Accrual</h3>
                                <p className="text-gray-400">Agents begin their careers with a base pool of 5 Discipline Points. For every 10 EXP earned through the elimination of Hostiles, the Agent earns an additional 1 DP. These points can be allocated during the Deployment Phase to modify Front, Support, or Backline tactical roles, subsequently altering Maximum HP and Weapon Requirements.</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}