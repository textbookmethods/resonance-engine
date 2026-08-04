/* eslint-disable */
import React, { useState } from 'react';

const ELEMENT_DICTIONARY = {
    'thermal': ['fire', 'heat', 'magma', 'lava', 'ash', 'plasma', 'steam', 'solar', 'sun', 'flame', 'pyro', 'scorch', 'burn', 'inferno', 'ignition'],
    'cryo': ['ice', 'cold', 'frost', 'snow', 'water', 'liquid', 'ocean', 'glacier', 'hydro', 'aqua', 'chill', 'blizzard', 'freeze', 'arctic'],
    'electro': ['lightning', 'electric', 'spark', 'thunder', 'magnetic', 'storm', 'volt', 'shock', 'galvanic', 'energy', 'emp'],
    'toxic': ['poison', 'acid', 'venom', 'decay', 'rot', 'radiation', 'bio', 'gas', 'smog', 'plague', 'blight', 'corrosive', 'noxious', 'viral', 'chemical'],
    'radiant': ['light', 'holy', 'divine', 'healing', 'spirit', 'luminous', 'glow', 'life', 'order', 'sacred', 'blessed', 'purify', 'stellar'],
    'void': ['dark', 'shadow', 'space', 'gravity', 'time', 'cosmic', 'null', 'psychic', 'mind', 'mental', 'chaos', 'entropy', 'abyss', 'astral', 'telekinetic', 'warp'],
    'kinetic': ['physical', 'force', 'bludgeoning', 'piercing', 'slashing', 'earth', 'stone', 'rock', 'wind', 'air', 'pressure', 'metal', 'steel', 'sand', 'dust', 'aero', 'geo', 'sound', 'sonic', 'acoustic', 'seismic', 'blood']
};

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

const MOBILITY_DICTIONARY = {
    'Blink': ['blink', 'teleport', 'jump', 'leap', 'bound', 'dash', 'phase', 'tunnel', 'burrow', 'step'],
    'Push': ['push', 'repel', 'throw', 'knockback', 'slam', 'blow', 'blast', 'drive'],
    'Pull': ['pull', 'attract', 'draw', 'drag', 'snare', 'hook', 'catch', 'leash']
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

const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

const safeArray = (arr) => {
    if (!arr) return [];
    if (Array.isArray(arr)) return arr.filter(item => item !== null && item !== undefined);
    if (typeof arr === 'object') return Object.values(arr).filter(item => item !== null && item !== undefined);
    return [];
};

const getCoreState = (input) => {
    if (!input) return '';
    const match = String(input).match(/\[(.*?)\]/);
    const clean = (match ? match[1] : String(input)).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) {
        if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core;
    }
    return String(input); 
};

const getCoreElement = (input) => {
    if (!input) return 'Kinetic';
    const clean = String(input).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(ELEMENT_DICTIONARY)) {
        if (core === clean || synonyms.includes(clean)) return core.charAt(0).toUpperCase() + core.slice(1);
    }
    return 'Kinetic'; 
};

const getCoreMobility = (input) => {
    if (!input) return '';
    const clean = String(input).toLowerCase().trim();
    for (const [core, synonyms] of Object.entries(MOBILITY_DICTIONARY)) {
        if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core;
    }
    return String(input);
};

export default function Spellbook({ players = {}, localId, pushUpdate }) {
    const player = players[localId] || {};
    const savedSkills = safeArray(player.savedSkills);
    const customCards = safeArray(player.customCards);

    const [searchTerm, setSearchTerm] = useState('');

    const equipSkill = (skill) => {
        if (customCards.length >= 4) {
            return alert("System Alert: HUD array is full (Max 4). Please unequip an active skill from the Player HUD to make room.");
        }
        if (customCards.some(c => String(c.name).toLowerCase() === String(skill.name).toLowerCase())) {
            return alert(`"${skill.name}" is already loaded into your active HUD.`);
        }
        
        // STRICT MUTATION PROTOCOL
        pushUpdate(s => {
            const pClone = deepClone(s.players || {});
            if (pClone[localId]) {
                pClone[localId].customCards = [...safeArray(pClone[localId].customCards), skill];
            }
            return { ...s, players: pClone };
        });
        alert(`Uplink Successful: "${skill.name}" equipped to HUD.`);
    };

    const deleteSkill = (skillId) => {
        if (window.confirm("WARNING: Are you sure you want to permanently erase this synthesis from your Spellbook archive?")) {
            pushUpdate(s => {
                const pClone = deepClone(s.players || {});
                if (pClone[localId]) {
                    pClone[localId].savedSkills = safeArray(pClone[localId].savedSkills).filter(sk => String(sk.id) !== String(skillId));
                }
                return { ...s, players: pClone };
            });
        }
    };

    const filteredSkills = savedSkills.filter(skill => 
        String(skill.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
        String(skill.elementCore || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 bg-[#05080a] border border-slate-700 p-6 md:p-10 font-mono text-sm h-[75vh] overflow-y-auto shadow-inner text-gray-300 relative">
            
            <div className="absolute top-4 right-4 bg-black border border-purple-500 px-4 py-2 z-10 text-xs font-mono uppercase text-purple-400 shadow-md">
                DATABASE: <span className="font-bold text-white">SPELLBOOK ARCHIVE</span>
            </div>

            <div className="border-b border-gray-700 pb-4 mb-6">
                <h1 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">Synthesis Archive</h1>
                <p className="text-xs text-gray-400">View, manage, and retrieve previously constructed custom actions for deployment.</p>
                <div className="mt-4 flex gap-4 items-center">
                    <div className="bg-black text-[#00f0ff] px-3 py-1 font-bold border border-[#00f0ff] uppercase tracking-widest text-xs">
                        ARCHIVED: {savedSkills.length}
                    </div>
                    <div className="bg-black text-[#22c55e] px-3 py-1 font-bold border border-[#22c55e] uppercase tracking-widest text-xs">
                        EQUIPPED: {customCards.length} / 4
                    </div>
                </div>
            </div>

            <div className="mb-6 flex gap-4">
                <input 
                    type="text" 
                    placeholder="Search archives by name or element..." 
                    className="w-full md:w-1/2 bg-black border border-gray-600 text-white p-2 outline-none focus:border-[#00f0ff] transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {savedSkills.length === 0 ? (
                <div className="border border-dashed border-gray-700 p-12 text-center text-gray-500 uppercase tracking-widest">
                    No custom actions found in the archive.
                    <br/><span className="text-[10px] block mt-2">Construct and archive skills via the Player HUD Synthesis Matrix.</span>
                </div>
            ) : filteredSkills.length === 0 ? (
                <div className="border border-dashed border-gray-700 p-12 text-center text-gray-500 uppercase tracking-widest">
                    No matching records found for query "{searchTerm}".
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredSkills.map(c => {
                        const dispRaw = c.elementRaw || c.element || 'Kinetic';
                        const dispCore = c.elementCore || getCoreElement(c.elementRaw || 'Kinetic');
                        const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;
                        const cardCost = parseInt(c.cost) || 0;
                        const isEquipped = customCards.some(equipped => String(equipped.id) === String(c.id) || String(equipped.name).toLowerCase() === String(c.name).toLowerCase());
                        
                        const coreMob = getCoreMobility(c.mobilityName || c.mobility || '');
                        const isBlink = safeInt(c.m) > 0 && coreMob === 'Blink';

                        return (
                            <div key={c.id || Math.random()} className={`bg-black border p-4 relative group flex flex-col transition-all duration-200 hover:shadow-lg ${isEquipped ? 'border-gray-600 opacity-60' : 'border-[#00f0ff] hover:border-white'}`}>
                                
                                {isEquipped && (
                                    <div className="absolute top-2 right-2 bg-gray-800 text-gray-400 text-[9px] uppercase font-bold px-2 py-0.5 border border-gray-600">
                                        Active in HUD
                                    </div>
                                )}

                                <div className="font-bold text-lg mb-1 truncate pr-16" style={{ color: isEquipped ? '#6b7280' : '#00f0ff' }}>
                                    {c.name || 'Custom Action'}
                                </div>
                                <div className="text-[10px] text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-800 pb-2" title={showType}>
                                    Type: {showType}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 text-xs mb-3 flex-1">
                                    <div className="bg-gray-900 border border-gray-800 p-1.5 text-center">
                                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Cost</div>
                                        <div className="font-bold text-[#ff6600]">{cardCost} Res</div>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-800 p-1.5 text-center">
                                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Damage</div>
                                        <div className="font-bold text-white">{safeInt(c.d)}</div>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-800 p-1.5 text-center">
                                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">Range</div>
                                        <div className="font-bold text-white">{c.range || '1'}</div>
                                    </div>
                                    <div className="bg-gray-900 border border-gray-800 p-1.5 text-center">
                                        <div className="text-[9px] text-gray-500 uppercase font-bold tracking-wider">AoE</div>
                                        <div className="font-bold text-white">
                                            {c.a === 'line3' ? 'Line-3' : c.a === 'cluster3' ? 'Cluster-3' : safeInt(c.a) > 0 ? `Rad-${c.a}` : 'Single'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 mb-4 flex-1">
                                    {c.effectName && (
                                        <div className="text-xs bg-purple-900/30 border border-purple-900 px-2 py-1 flex justify-between items-center" title={STATE_DESCRIPTIONS[getCoreState(c.effectName)] || 'Active Status Check'}>
                                            <span className="text-purple-400 font-bold text-[10px] uppercase">State</span>
                                            <span className="text-purple-300 truncate max-w-[100px] cursor-help">[{c.effectName}]</span>
                                        </div>
                                    )}
                                    {c.terrain && (
                                        <div className="text-xs bg-yellow-900/30 border border-yellow-900 px-2 py-1 flex justify-between items-center">
                                            <span className="text-yellow-500 font-bold text-[10px] uppercase">Terrain</span>
                                            <span className="text-yellow-400 uppercase truncate">[{String(c.terrain)}]</span>
                                        </div>
                                    )}
                                    {safeInt(c.m) > 0 && (
                                        <div className="text-xs bg-blue-900/30 border border-blue-900 px-2 py-1 flex justify-between items-center">
                                            <span className="text-blue-400 font-bold text-[10px] uppercase">Mobility</span>
                                            <span className="text-blue-300 uppercase truncate">[{coreMob}] {safeInt(c.m)}</span>
                                        </div>
                                    )}
                                    {c.desc && (
                                        <div className="text-[10px] text-gray-400 italic mt-2 border-t border-gray-800 pt-2 line-clamp-3 overflow-hidden">
                                            "{c.desc}"
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-auto border-t border-gray-800 pt-3">
                                    <button 
                                        className={`flex-1 font-bold py-1.5 uppercase transition-colors text-xs ${isEquipped ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-[#00f0ff] text-black hover:bg-white border border-[#00f0ff]'}`} 
                                        disabled={isEquipped} 
                                        onClick={() => equipSkill(c)}
                                    >
                                        {isEquipped ? 'Equipped' : 'Equip'}
                                    </button>
                                    <button 
                                        className="w-10 bg-gray-900 text-gray-500 font-bold border border-gray-700 hover:bg-red-900 hover:text-white hover:border-red-500 transition-colors flex items-center justify-center"
                                        onClick={() => deleteSkill(c.id)}
                                        title="Delete from Archive"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}