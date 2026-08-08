/* eslint-disable */
import React, { useState } from 'react';

const ELEMENT_STATE_MAP = {
    'Kinetic': ['Bleed', 'Immobilized', 'Stunned', 'Shielded', 'Vulnerable', 'Knockdown', 'Evasive'],
    'Thermal': ['Burn', 'Blind', 'Vulnerable', 'Execute'],
    'Cryo': ['Slowed', 'Immobilized', 'Stunned', 'Shielded'],
    'Electro': ['Shocked', 'Stunned', 'Haste', 'Blind', 'Hijacked'],
    'Toxic': ['Poisoned', 'Blind', 'Vulnerable'],
    'Radiant': ['Blind', 'Haste', 'Shielded', 'Invulnerable'],
    'Void': ['Execute', 'Evasive', 'Blind', 'Slowed', 'Immobilized', 'Hijacked']
};

const CLASS_AFFINITIES = { 
    'Vanguard': { dp: '10+ Front', states: ['Knockdown', 'Bleed', 'Shielded', 'Burn', 'Execute'], desc: 'Frontline juggernaut. Masters of physical disruption and area control.' }, 
    'Sniper': { dp: '10+ Back', states: ['Vulnerable', 'Blind', 'Bleed', 'Execute', 'Evasive'], desc: 'Long-range executioner. Specializes in precision strikes and optical jamming.' }, 
    'Conduit': { dp: '10+ Supp', states: ['Stunned', 'Shocked', 'Shielded', 'Haste', 'Immobilized'], desc: 'Battlefield controller. Locks down hostiles and accelerates allies.' }, 
    'Paladin': { dp: '5+ Front, 5+ Supp', states: ['Shielded', 'Burn', 'Knockdown', 'Invulnerable'], desc: 'Hybrid defender. Weaves structural shielding with offensive pressure.' }, 
    'Saboteur': { dp: '5+ Supp, 5+ Back', states: ['Immobilized', 'Blind', 'Slowed', 'Shocked', 'Vulnerable', 'Poisoned'], desc: 'Hybrid disruptor. Cripples enemy matrices and inflicts terminal decay.' }, 
    'Skirmisher': { dp: '5+ Front, 5+ Back', states: ['Haste', 'Evasive', 'Bleed', 'Slowed'], desc: 'Hybrid striker. Unmatched mobility and hit-and-run tactics.' }, 
    'Rookie': { dp: 'Baseline', states: ['Haste', 'Bleed'], desc: 'Unspecialized operative. Limited access to advanced state synergies.' } 
};

export default function Reference() {
    const [activeTab, setActiveTab] = useState('elements');

    const tabs = [
        { id: 'elements', label: 'Elemental Matrix' },
        { id: 'states', label: 'Status Conditions' },
        { id: 'classes', label: 'Class Synergy' },
        { id: 'terrain', label: 'Grid Physics' },
        { id: 'payloads', label: 'Payloads & Teamwork' }
    ];

    return (
        <div className="flex flex-col md:flex-row h-[75vh] bg-[#05080a] border border-slate-700 font-mono text-sm shadow-inner overflow-hidden">
            
            {/* SIDEBAR NAVIGATION */}
            <div className="w-full md:w-64 bg-[#1a222c] border-r border-slate-700 flex flex-col shrink-0 overflow-y-auto">
                <div className="p-4 border-b border-gray-700 bg-black">
                    <h2 className="text-[#00f0ff] font-bold text-lg tracking-widest uppercase">Database</h2>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">System Reference Index</div>
                </div>
                <div className="flex flex-col py-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`text-left px-4 py-3 text-xs uppercase font-bold tracking-wider transition-colors ${
                                activeTab === tab.id 
                                    ? 'bg-[#00f0ff] text-black border-l-4 border-white' 
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white border-l-4 border-transparent'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto text-gray-300 relative">
                
                {activeTab === 'elements' && (
                    <div className="animate-fade-in space-y-8 max-w-5xl">
                        <h1 className="text-3xl font-bold text-[#ff6600] uppercase border-b border-gray-700 pb-2">Elemental Matrix</h1>
                        
                        <div className="bg-black border border-gray-700 p-6 shadow-md">
                            <h2 className="text-white font-bold text-xl uppercase tracking-widest mb-4">Affinity Multipliers (RPS)</h2>
                            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
                                Striking a target with an element they are weak to applies a <strong className="text-[#22c55e]">1.5x Damage Multiplier</strong> and triggers an automated <strong className="text-[#00f0ff]">Exploit (+2 Res)</strong> teamwork bonus. Striking a target with an element they resist applies a <strong className="text-red-500">0.5x Damage Multiplier</strong>.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div className="border border-red-500 bg-red-950/20 p-4">
                                    <div className="text-red-500 font-bold text-lg mb-2 uppercase">The Primal Triangle</div>
                                    <div className="text-xs space-y-2 text-gray-300">
                                        <div><span className="text-orange-500 font-bold">THERMAL</span> melts <span className="text-blue-300 font-bold">CRYO</span></div>
                                        <div><span className="text-blue-300 font-bold">CRYO</span> freezes <span className="text-green-500 font-bold">TOXIC</span></div>
                                        <div><span className="text-green-500 font-bold">TOXIC</span> chokes <span className="text-orange-500 font-bold">THERMAL</span></div>
                                    </div>
                                </div>
                                <div className="border border-purple-500 bg-purple-950/20 p-4">
                                    <div className="text-purple-400 font-bold text-lg mb-2 uppercase">The Cosmic Binary</div>
                                    <div className="text-xs space-y-2 text-gray-300">
                                        <div><span className="text-yellow-200 font-bold">RADIANT</span> purges <span className="text-purple-500 font-bold">VOID</span></div>
                                        <div><span className="text-purple-500 font-bold">VOID</span> consumes <span className="text-yellow-200 font-bold">RADIANT</span></div>
                                        <div className="text-gray-500 italic pt-2 border-t border-gray-700 mt-2">Mutually destructive.</div>
                                    </div>
                                </div>
                                <div className="border border-blue-500 bg-blue-950/20 p-4">
                                    <div className="text-blue-400 font-bold text-lg mb-2 uppercase">The Material Binary</div>
                                    <div className="text-xs space-y-2 text-gray-300">
                                        <div><span className="text-blue-400 font-bold">ELECTRO</span> shocks <span className="text-gray-300 font-bold">KINETIC</span></div>
                                        <div><span className="text-gray-300 font-bold">KINETIC</span> grounds <span className="text-blue-400 font-bold">ELECTRO</span></div>
                                        <div className="text-gray-500 italic pt-2 border-t border-gray-700 mt-2">Mutually destructive.</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-black border border-gray-700 p-6 shadow-md">
                            <h2 className="text-[#00f0ff] font-bold text-xl uppercase tracking-widest mb-4">Environmental Reactions</h2>
                            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                Striking a hex that is already painted with an Elemental Terrain using a specific opposing Element triggers a volatile chain reaction, instantly adding <strong className="text-[#ff6600]">+5 Absolute Damage</strong> to the payload.
                            </p>
                            <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-600 text-gray-400">
                                        <th className="py-2 px-3">Base Terrain</th>
                                        <th className="py-2 px-3">Incoming Element</th>
                                        <th className="py-2 px-3">Reaction Result</th>
                                    </tr>
                                </thead>
                                <tbody className="text-gray-300">
                                    <tr className="border-b border-gray-800">
                                        <td className="py-2 px-3 text-blue-300 font-bold">Cryo</td>
                                        <td className="py-2 px-3 text-orange-500 font-bold">Thermal</td>
                                        <td className="py-2 px-3"><span className="text-white font-bold">Steam Explosion:</span> Hex converts to Volatile Steam.</td>
                                    </tr>
                                    <tr className="border-b border-gray-800 bg-gray-900/30">
                                        <td className="py-2 px-3 text-green-500 font-bold">Toxic</td>
                                        <td className="py-2 px-3 text-orange-500 font-bold">Thermal</td>
                                        <td className="py-2 px-3"><span className="text-white font-bold">Combustion:</span> Vaporizes toxin, clears hex terrain entirely.</td>
                                    </tr>
                                    <tr className="border-b border-gray-800">
                                        <td className="py-2 px-3 text-blue-300 font-bold">Cryo / Steam</td>
                                        <td className="py-2 px-3 text-blue-400 font-bold">Electro</td>
                                        <td className="py-2 px-3"><span className="text-white font-bold">Conduction:</span> Magnetizes water, converts to Minor Electro terrain.</td>
                                    </tr>
                                    <tr>
                                        <td className="py-2 px-3 text-purple-500 font-bold">Void <span className="text-gray-500">(or Radiant)</span></td>
                                        <td className="py-2 px-3 text-yellow-200 font-bold">Radiant <span className="text-gray-500">(or Void)</span></td>
                                        <td className="py-2 px-3"><span className="text-white font-bold">Annihilation:</span> Mutual destruction, clears hex terrain entirely.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'states' && (
                    <div className="animate-fade-in space-y-8 max-w-5xl">
                        <h1 className="text-3xl font-bold text-purple-400 uppercase border-b border-gray-700 pb-2">Status Conditions</h1>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl">
                            States are hard-coded into the engine with specific Utility (u) costs. The GM and Agents must pay this Res cost to attach a state to a custom card. States must match the Element of the attack payload to avoid "Untrained Resistance" penalties.
                        </p>

                        {[
                            { tier: 1, title: 'Tier 1 [1u]', states: ['Bleed', 'Burn', 'Poisoned', 'Haste', 'Slowed'] },
                            { tier: 3, title: 'Tier 3 [3u]', states: ['Knockdown', 'Blind', 'Shielded', 'Vulnerable', 'Shocked', 'Evasive'] },
                            { tier: 5, title: 'Tier 5 [5u]', states: ['Immobilized', 'Stunned', 'Invulnerable'] },
                            { tier: 10, title: 'Tier 10 [10u]', states: ['Execute', 'Hijacked'] },
                        ].map(t => (
                            <div key={t.tier} className="bg-black border border-purple-900/50">
                                <div className="bg-purple-900/20 px-4 py-2 border-b border-purple-900/50">
                                    <h2 className="text-purple-400 font-bold uppercase tracking-widest">{t.title}</h2>
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {t.states.map(st => {
                                        const allowedElements = Object.keys(ELEMENT_STATE_MAP).filter(el => ELEMENT_STATE_MAP[el].includes(st));
                                        return (
                                            <div key={st} className="bg-gray-900 border border-gray-700 p-3 flex flex-col">
                                                <div className="font-bold text-white uppercase mb-1 flex justify-between">
                                                    <span>[{st}]</span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 mb-2 uppercase tracking-wider border-b border-gray-800 pb-1">
                                                    Valid Elem: {allowedElements.join(', ')}
                                                </div>
                                                {st === 'Bleed' && <p className="text-xs text-gray-400">Takes 3 Absolute HP damage at round end.</p>}
                                                {st === 'Burn' && <p className="text-xs text-gray-400">Takes 3 Thermal HP damage at round end.</p>}
                                                {st === 'Poisoned' && <p className="text-xs text-gray-400">Takes 3 Toxic HP damage at round end. Infinitely stacks.</p>}
                                                {st === 'Haste' && <p className="text-xs text-gray-400">Movement points increased by +2.</p>}
                                                {st === 'Slowed' && <p className="text-xs text-gray-400">Movement points reduced by -2.</p>}
                                                
                                                {st === 'Knockdown' && <p className="text-xs text-gray-400">Movement points halved for the current turn.</p>}
                                                {st === 'Blind' && <p className="text-xs text-gray-400">Targeting restricted to adjacent hexes (Range 1). AoE zeroed.</p>}
                                                {st === 'Shielded' && <p className="text-xs text-gray-400">Absorbs 5 damage from the next attack, then shatters.</p>}
                                                {st === 'Vulnerable' && <p className="text-xs text-gray-400">Takes 1.5x Multiplier to damage from the next attack.</p>}
                                                {st === 'Shocked' && <p className="text-xs text-gray-400">All defensive arrays jammed to 0 mitigation.</p>}
                                                {st === 'Evasive' && <p className="text-xs text-gray-400">Forces next incoming attack to bypass Front Parry entirely.</p>}
                                                
                                                {st === 'Immobilized' && <p className="text-xs text-gray-400">Movement points hard-locked to 0. Cannot use Blink/Dash.</p>}
                                                {st === 'Stunned' && <p className="text-xs text-gray-400">Total lockdown. Movement 0, Attacks locked, Defenses jammed.</p>}
                                                {st === 'Invulnerable' && <p className="text-xs text-gray-400">Completely negates 100% of the next incoming attack's damage and effects.</p>}

                                                {st === 'Execute' && <p className="text-xs text-gray-400">Terminal erasure. Instantly drops HP to 0, bypassing all defenses.</p>}
                                                {st === 'Hijacked' && <p className="text-xs text-gray-400">Neural Override. Attacker gains one-time control of Target's ability matrix.</p>}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'classes' && (
                    <div className="animate-fade-in space-y-8 max-w-5xl">
                        <h1 className="text-3xl font-bold text-[#22c55e] uppercase border-b border-gray-700 pb-2">Class Synergy Matrix</h1>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mb-6">
                            Agent classification is derived dynamically based on Discipline Point (DP) allocation. Achieving a specific classification grants the Agent "Innate Synergy" with specific Status Conditions, preventing the Alpha Multiplier penalty when attaching those states to custom cards, regardless of the Element chosen.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {Object.entries(CLASS_AFFINITIES).filter(([name]) => name !== 'Rookie').map(([name, data]) => (
                                <div key={name} className="bg-black border border-[#22c55e]/30 p-4 flex flex-col">
                                    <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                                        <h2 className="text-[#22c55e] font-bold text-xl uppercase tracking-widest">{name}</h2>
                                        <span className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 border border-gray-600 uppercase tracking-widest">{data.dp}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mb-3 italic">"{data.desc}"</p>
                                    <div className="mt-auto">
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-1">State Synergies (No Penalty)</div>
                                        <div className="flex flex-wrap gap-1">
                                            {data.states.map(st => (
                                                <span key={st} className="bg-[#166534]/30 text-[#4ade80] text-[10px] px-1.5 py-0.5 border border-[#166534] font-bold uppercase">{st}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'terrain' && (
                    <div className="animate-fade-in space-y-8 max-w-5xl">
                        <h1 className="text-3xl font-bold text-blue-400 uppercase border-b border-gray-700 pb-2">Grid Physics & Mobility</h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-black border border-gray-700 p-5 shadow-md">
                                <h2 className="text-white font-bold text-lg mb-4 uppercase border-b border-gray-800 pb-2">Terrain Synthesis (t)</h2>
                                <div className="space-y-4 text-xs">
                                    <div>
                                        <span className="text-yellow-500 font-bold uppercase block mb-1">Minor Terrain [1u]</span>
                                        <p className="text-gray-400">Imposes physical drag. Movement through this hex costs exactly 2 Movement Points instead of 1.</p>
                                    </div>
                                    <div>
                                        <span className="text-red-500 font-bold uppercase block mb-1">Clear Terrain [2u]</span>
                                        <p className="text-gray-400">Strips existing modifications from a hex, reverting it to a blank slate.</p>
                                    </div>
                                    <div>
                                        <span className="text-purple-500 font-bold uppercase block mb-1">Major Terrain [3u]</span>
                                        <p className="text-gray-400">Hazardous. Entities ending their turn inside this hex suffer 5 Absolute Damage at Round Advance.</p>
                                    </div>
                                    <div>
                                        <span className="text-blue-500 font-bold uppercase block mb-1">Severe Terrain [5u]</span>
                                        <p className="text-gray-400">Impassable bedrock. Blocks standard Movement and Line-of-Sight entirely. Creates crushing hazards.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black border border-gray-700 p-5 shadow-md">
                                <h2 className="text-white font-bold text-lg mb-4 uppercase border-b border-gray-800 pb-2">Mobility Vectors (m)</h2>
                                <p className="text-gray-400 text-xs mb-4">Adding a mobility tag to an ability linearly increases its Resonance cost based on the distance (hexes) specified.</p>
                                <div className="space-y-4 text-xs">
                                    <div>
                                        <span className="text-[#00f0ff] font-bold uppercase block mb-1">Blink</span>
                                        <p className="text-gray-400">Self-targeting only. Instantly teleports the Agent to any valid hex within the 'm' range limit, completely ignoring Line of Sight and pathing blockages.</p>
                                    </div>
                                    <div>
                                        <span className="text-orange-400 font-bold uppercase block mb-1">Push</span>
                                        <p className="text-gray-400">Forces the target directly away from the caster for 'm' hexes. If the target strikes impassable terrain or the grid edge, they suffer 1 physical damage for every uncompleted hex of travel.</p>
                                    </div>
                                    <div>
                                        <span className="text-orange-400 font-bold uppercase block mb-1">Pull</span>
                                        <p className="text-gray-400">Forces the target directly toward the caster for 'm' hexes. Subject to the exact same collision damage rules as Push.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'payloads' && (
                    <div className="animate-fade-in space-y-8 max-w-5xl">
                        <h1 className="text-3xl font-bold text-yellow-300 uppercase border-b border-gray-700 pb-2">Payloads & Teamwork</h1>
                        <p className="text-sm text-gray-400 leading-relaxed max-w-3xl mb-6">
                            When building a Custom Skill, Agents select a Payload Type. The engine automatically processes the mathematical resolution based on this type, enabling dedicated Support and Healing builds.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-black border border-red-500 p-5">
                                <h3 className="text-red-500 font-bold uppercase tracking-widest mb-2 text-lg">Offensive</h3>
                                <p className="text-xs text-gray-400 mb-2">Payload value (v) operates as incoming Damage.</p>
                                <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                                    <li>Modified by Affinity (1.5x / 0.5x).</li>
                                    <li>Modified by Flanking (1.5x).</li>
                                    <li>Intercepted by Defensive Matrices (Parry/Evade).</li>
                                    <li>Intercepted by Hostile Barriers.</li>
                                </ul>
                            </div>
                            <div className="bg-black border border-[#22c55e] p-5">
                                <h3 className="text-[#22c55e] font-bold uppercase tracking-widest mb-2 text-lg">Restorative</h3>
                                <p className="text-xs text-gray-400 mb-2">Payload value (v) operates as direct HP recovery.</p>
                                <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                                    <li>Modified by Affinity (Healing a Void target with Radiant magic halves the recovery).</li>
                                    <li>Bypasses all defensive matrices entirely.</li>
                                    <li>Automatically triggers Teamwork: <strong>Assist</strong>.</li>
                                </ul>
                            </div>
                            <div className="bg-black border border-[#00f0ff] p-5">
                                <h3 className="text-[#00f0ff] font-bold uppercase tracking-widest mb-2 text-lg">Energize</h3>
                                <p className="text-xs text-gray-400 mb-2">Payload value (v) operates as a direct Resonance injection.</p>
                                <ul className="text-[10px] text-gray-500 list-disc pl-4 space-y-1">
                                    <li>Completely ignores Affinity calculations.</li>
                                    <li>Completely bypasses all defenses.</li>
                                    <li>Immediately adds to the target's Res pool (up to cap).</li>
                                    <li>Automatically triggers Teamwork: <strong>Assist</strong>.</li>
                                </ul>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-700 p-6 shadow-md">
                            <h2 className="text-white font-bold text-xl uppercase tracking-widest mb-4">Automated Teamwork Synergies</h2>
                            <p className="text-gray-400 text-xs mb-4 leading-relaxed">
                                The Resonance Engine continuously monitors battlefield geometry and payload math. When an Agent executes a tactical maneuver that inherently benefits the squad, the Engine automatically awards bonus Resonance upon action resolution.
                            </p>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-[#00f0ff] font-bold uppercase tracking-wider">Exploit (+2 Res)</span>
                                    <span className="text-gray-400 text-xs text-right max-w-sm">Awarded for striking a Hostile's Elemental Weakness (1.5x) or hitting a target actively suffering from the [Vulnerable] state.</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-800 pb-2">
                                    <span className="text-[#00f0ff] font-bold uppercase tracking-wider">Tag-Team (+2 Res)</span>
                                    <span className="text-gray-400 text-xs text-right max-w-sm">Awarded for successfully executing an attack vector that originates outside the target's 180-degree front facing arc (Flanking).</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[#00f0ff] font-bold uppercase tracking-wider">Assist (+1 Res)</span>
                                    <span className="text-gray-400 text-xs text-right max-w-sm">Awarded for successfully applying a Restorative/Energize payload to an ally, OR applying a positive state ([Shielded], [Haste], etc.) to an ally.</span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}