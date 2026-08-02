/* eslint-disable */
import React from 'react';

const STATE_DICTIONARY = {
    'Execute': ['execute', 'erase', 'delete', 'kill', 'assassinate', 'obliterate', 'fatal', 'doom', 'annihilate', 'vanquish', 'smite', 'destroy', 'wipe'],
    'Bleed': ['bleed', 'hemorrhage', 'lacerate', 'rend', 'cut'],
    'Burn': ['burn', 'ignite', 'scorch', 'melt', 'char', 'fire'],
    'Poisoned': ['poison', 'venom', 'decay', 'rot', 'corrode', 'acid', 'plague', 'blight', 'infection', 'toxic'],
    'Immobilized': ['immobilize', 'root', 'snare', 'trap', 'bind', 'pin', 'tether'],
    'Stunned': ['stun', 'paralyze', 'petrify', 'frozen', 'daze'],
    'Shielded': ['shield', 'protect', 'barrier', 'ward', 'guard', 'armor', 'block'],
    'Vulnerable': ['vulnerable', 'expose', 'sunder', 'break', 'shatter', 'pierce', 'fracture'],
    'Knockdown': ['knockdown', 'trip', 'shove', 'push', 'throw', 'slam', 'prone'],
    'Blind': ['blind', 'blindside', 'obscure', 'smoke', 'flash', 'darkness'],
    'Haste': ['haste', 'speed', 'quick', 'fast', 'accelerate', 'dash', 'swift'],
    'Slowed': ['slow', 'sluggish', 'lethargic', 'hobble', 'cripple', 'chill'],
    'Shocked': ['shock', 'glitch', 'short', 'jolt', 'electrocute'],
    'Evasive': ['evade', 'dodge', 'blur', 'ghost', 'phase', 'agile'],
    'Invulnerable': ['invulnerable', 'stasis', 'immune', 'god', 'untouchable', 'aegis']
};

const STATE_DESCRIPTIONS = {
    'Execute': 'Instantly reduces HP to 0. Bypasses all defenses.',
    'Bleed': 'Takes 3 HP damage at the end of the round.',
    'Burn': 'Takes 3 HP damage at the end of the round.',
    'Poisoned': 'Takes 3 HP damage at the end of the round. DoTs stack.',
    'Immobilized': 'Movement points reduced to 0.',
    'Stunned': 'Movement 0. Cannot attack. Defensive arrays jammed.',
    'Shielded': 'Absorbs 5 incoming damage, then shatters.',
    'Vulnerable': 'Takes 1.5x incoming damage from the next attack, then shatters.',
    'Knockdown': 'Movement points halved. Automatically recovers next round.',
    'Blind': 'Targeting optics restricted to Range 1 and AoE 0.',
    'Haste': 'Movement points increased by +2.',
    'Slowed': 'Movement points reduced by -2.',
    'Shocked': 'Defensive arrays (Parry, Intercept, Evade) jammed.',
    'Evasive': 'Next incoming attack automatically forces an Evasion roll, then shatters.',
    'Invulnerable': 'Completely negates the next incoming attack, then shatters.'
};

const getCoreState = (input) => {
    if (!input) return '';
    const match = String(input).match(/\[(.*?)\]/);
    const clean = (match ? match[1] : String(input)).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) {
        if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core;
    }
    return input; 
};

const formatAoe = (a) => {
    if (a === 'line3') return '3-Hex Line';
    if (a === 'cluster3') return '3-Hex Cluster';
    return `${a || 0} Hex Radius`;
};

export default function Spellbook({ players = {}, localId, pushUpdate }) {
    const player = players[localId] || {};
    const savedSkills = player.savedSkills || [];

    const safePush = (updater) => { if (typeof pushUpdate === 'function') pushUpdate(updater); };
    const updatePlayer = (key, val) => safePush(s => ({ ...s, players: { ...(s.players || {}), [localId]: { ...(s.players?.[localId] || {}), [key]: val } } }));

    const deleteSkill = (id) => {
        updatePlayer('savedSkills', savedSkills.filter(s => s.id !== id));
    };

    const equipToHUD = (skill) => {
        const currentHUD = player.customCards || [];
        if (currentHUD.length >= 4) {
            return alert("HUD is full. Remove an active skill on the Combat HUD first.");
        }
        if (currentHUD.some(c => String(c.name).toLowerCase() === String(skill.name).toLowerCase())) {
            return alert(`"${skill.name}" is already equipped in your Combat HUD.`);
        }

        updatePlayer('customCards', [...currentHUD, { ...skill, id: Date.now() }]);
        alert(`"${skill.name}" equipped to Combat HUD!`);
    };

    return (
        <div className="bg-[#1a222c] p-6 md:p-10 border border-slate-700 min-h-[75vh] font-mono">
            <div className="flex justify-between items-center border-b border-[#00f0ff] pb-4 mb-6">
                <div>
                    <h2 className="text-[#00f0ff] font-bold text-3xl uppercase tracking-widest">Grimoire Archive</h2>
                    <p className="text-gray-400 text-sm">Permanent Storage for Synthesized Actions</p>
                </div>
                <div className="text-right">
                    <div className="text-[#ff6600] font-bold text-xl">{savedSkills.length}</div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-widest">Archived</div>
                </div>
            </div>

            {savedSkills.length === 0 ? (
                <div className="text-gray-500 text-center mt-20 border border-dashed border-gray-700 p-10">
                    No synthesized actions archived. Use the Synthesis Matrix in your Combat HUD to save abilities here.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {savedSkills.map(skill => {
                        const dispRaw = skill.elementRaw || skill.element || 'Kinetic';
                        const dispCore = skill.elementCore || skill.element || 'Kinetic';
                        const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;

                        return (
                            <div key={skill.id} className="bg-black border border-gray-700 p-4 relative group flex flex-col transition-colors hover:border-[#00f0ff]">
                                <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 font-bold" onClick={() => deleteSkill(skill.id)}>✕</button>
                                
                                <div className="flex-1 mb-4 pr-4">
                                    <h3 className="font-bold text-white text-lg mb-1 text-[#00f0ff] uppercase tracking-wider truncate">{skill.name}</h3>
                                    
                                    <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-800 pb-1" title={showType}>
                                        TYPE: [{showType}]
                                    </div>
                                    
                                    <div className="text-[#ff6600] font-bold text-xs mb-3">COST: -{skill.cost} RES</div>
                                    
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-400 mb-3">
                                        <div><span className="text-gray-500">Damage:</span> {skill.d}</div>
                                        <div><span className="text-gray-500">AoE:</span> {formatAoe(skill.a)}</div>
                                        <div><span className="text-gray-500">Utility:</span> {skill.u}</div>
                                        <div><span className="text-gray-500">Affinity:</span> {skill.alpha || 1}</div>
                                    </div>
                                    
                                    {skill.effectName && (
                                        <div title={STATE_DESCRIPTIONS[getCoreState(skill.effectName)]} className="mb-3 bg-purple-900 border border-purple-500 text-white text-[10px] px-2 py-1 font-bold inline-block cursor-help">
                                            Effect: [{(String(skill.effectName).toLowerCase() !== String(skill.effectCore || '').toLowerCase() && skill.effectCore) ? `${skill.effectName} : ${skill.effectCore}` : skill.effectName}]
                                        </div>
                                    )}

                                    {skill.terrain && (
                                        <div className="mb-3 ml-2 bg-black border border-yellow-500 text-yellow-500 text-[10px] px-2 py-1 font-bold inline-block">
                                            Terrain: [{String(skill.terrain).toUpperCase()}]
                                        </div>
                                    )}

                                    {/* NEW: Displays Mobility parameters inside the Grimoire */}
                                    {skill.m > 0 && (
                                        <div className="mb-3 bg-black border border-blue-500 text-blue-400 text-[10px] px-2 py-1 font-bold inline-block w-fit">
                                            Mobility: {skill.m} [{String(skill.coreMobility).toUpperCase()}]
                                        </div>
                                    )}

                                    {skill.desc && (
                                        <div className="bg-gray-900 border-l-2 border-gray-600 p-2 text-gray-400 text-xs italic line-clamp-3">
                                            "{skill.desc}"
                                        </div>
                                    )}
                                </div>

                                <button className="w-full bg-gray-800 text-white font-bold py-2 uppercase text-xs hover:bg-[#00f0ff] hover:text-black transition-colors" onClick={() => equipToHUD(skill)}>
                                    Equip to HUD
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}