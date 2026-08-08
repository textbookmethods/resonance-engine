/* eslint-disable */
import React from 'react';

const ELEMENT_DICTIONARY = { 'thermal': ['fire', 'heat', 'magma', 'lava', 'ash', 'plasma', 'steam', 'solar', 'sun', 'flame', 'pyro', 'scorch', 'burn', 'inferno', 'ignition'], 'cryo': ['ice', 'cold', 'frost', 'snow', 'water', 'liquid', 'ocean', 'glacier', 'hydro', 'aqua', 'chill', 'blizzard', 'freeze', 'arctic'], 'electro': ['lightning', 'electric', 'spark', 'thunder', 'magnetic', 'storm', 'volt', 'shock', 'galvanic', 'energy', 'emp'], 'toxic': ['poison', 'acid', 'venom', 'decay', 'rot', 'radiation', 'bio', 'gas', 'smog', 'plague', 'blight', 'corrosive', 'noxious', 'viral', 'chemical'], 'radiant': ['light', 'holy', 'divine', 'healing', 'spirit', 'luminous', 'glow', 'life', 'order', 'sacred', 'blessed', 'purify', 'stellar'], 'void': ['dark', 'shadow', 'space', 'gravity', 'time', 'cosmic', 'null', 'psychic', 'mind', 'mental', 'chaos', 'entropy', 'abyss', 'astral', 'telekinetic', 'warp'], 'kinetic': ['physical', 'force', 'bludgeoning', 'piercing', 'slashing', 'earth', 'stone', 'rock', 'wind', 'air', 'pressure', 'metal', 'steel', 'sand', 'dust', 'aero', 'geo', 'sound', 'sonic', 'acoustic', 'seismic', 'blood'] };
const STATE_DICTIONARY = { 'Hijacked': ['hijack', 'mind control', 'dominate', 'possess', 'control'], 'Execute': ['execute', 'erase', 'delete'], 'Bleed': ['bleed', 'hemorrhage', 'lacerate'], 'Burn': ['burn', 'ignite', 'scorch'], 'Poisoned': ['poison', 'venom', 'decay'], 'Immobilized': ['immobilize', 'root', 'snare'], 'Stunned': ['stun', 'paralyze', 'petrify'], 'Shielded': ['shield', 'protect', 'barrier'], 'Vulnerable': ['vulnerable', 'expose', 'sunder'], 'Knockdown': ['knockdown', 'trip', 'shove'], 'Blind': ['blind', 'obscure', 'smoke'], 'Haste': ['haste', 'speed', 'quick'], 'Slowed': ['slow', 'sluggish', 'chill'], 'Shocked': ['shock', 'glitch', 'jolt'], 'Evasive': ['evade', 'dodge', 'blur'], 'Invulnerable': ['invulnerable', 'stasis', 'immune'] };
const MOBILITY_DICTIONARY = { 'Blink': ['blink', 'teleport', 'jump'], 'Push': ['push', 'repel', 'throw'], 'Pull': ['pull', 'attract', 'draw'] };

const STATE_DESCRIPTIONS = { 'Hijacked': 'Forces target to immediately cast an ability under your control.', 'Execute': 'Instantly reduces HP to 0.', 'Bleed': 'Takes 3 HP damage at round end.', 'Burn': 'Takes 3 Thermal damage at round end.', 'Poisoned': 'Takes 3 Toxic damage at round end.', 'Immobilized': 'Movement points reduced to 0.', 'Stunned': 'Movement 0. Cannot attack. Defenses jammed.', 'Shielded': 'Absorbs 5 damage.', 'Vulnerable': 'Takes 1.5x damage.', 'Knockdown': 'Movement halved.', 'Blind': 'Range 1, AoE 0.', 'Haste': '+2 Move.', 'Slowed': '-2 Move.', 'Shocked': 'Defenses jammed.', 'Evasive': 'Forces Evasion roll.', 'Invulnerable': 'Negates attack.' };

const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const safeArray = (arr) => { if (!arr) return []; if (Array.isArray(arr)) return arr.filter(i => i !== null && i !== undefined); if (typeof arr === 'object') return Object.values(arr).filter(i => i !== null && i !== undefined); return []; };

const getCoreState = (input) => { if (!input) return ''; const match = String(input).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(input)).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };
const getCoreElement = (input) => { if (!input) return 'Kinetic'; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(ELEMENT_DICTIONARY)) { if (core === clean || synonyms.includes(clean)) return core.charAt(0).toUpperCase() + core.slice(1); } return 'Kinetic'; };
const getCoreMobility = (input) => { if (!input) return ''; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(MOBILITY_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };

export default function Spellbook({ players = {}, localId, pushUpdate }) {
    const rawPlayer = players[localId];
    const player = rawPlayer || { savedSkills: [], customCards: [], name: 'Agent' };
    
    const spellbook = safeArray(player.savedSkills);
    const activeHud = safeArray(player.customCards);

    const equipSkill = (skill) => {
        if (activeHud.length >= 4) {
            return alert("System Locked: Active HUD is at maximum capacity (4/4). Remove an equipped ability via the Combat HUD first.");
        }
        if (activeHud.some(c => String(c.name).toLowerCase() === String(skill.name).toLowerCase())) {
            return alert(`System Locked: "${skill.name}" is already loaded in your Active HUD.`);
        }
        
        pushUpdate(s => {
            const pClone = JSON.parse(JSON.stringify(s.players || {}));
            if (pClone[localId]) {
                const currentCards = safeArray(pClone[localId].customCards);
                const currentSpells = safeArray(pClone[localId].savedSkills);
                pClone[localId].customCards = [...currentCards, skill];
                pClone[localId].savedSkills = currentSpells.filter(s => String(s.id) !== String(skill.id));
            }
            return { ...s, players: pClone };
        });
    };

    const deleteSkill = (skillId, skillName) => {
        if (window.confirm(`WARNING: Are you sure you want to permanently delete "${skillName}" from your archives?`)) {
            pushUpdate(s => {
                const pClone = JSON.parse(JSON.stringify(s.players || {}));
                if (pClone[localId]) {
                    pClone[localId].savedSkills = safeArray(pClone[localId].savedSkills).filter(s => String(s.id) !== String(skillId));
                }
                return { ...s, players: pClone };
            });
        }
    };

    return (
        <div className="bg-[#05080a] border border-slate-700 min-h-[75vh] p-6 md:p-10 font-mono text-gray-300 shadow-inner">
            
            <div className="flex justify-between items-end border-b border-gray-700 pb-4 mb-8">
                <div>
                    <h1 className="text-[#a855f7] font-bold text-3xl tracking-widest uppercase mb-1">Archival Spellbook</h1>
                    <p className="text-gray-500 text-xs tracking-wider uppercase">Storage and retrieval of synthesized tactical protocols</p>
                </div>
                <div className="text-right">
                    <div className="text-xs text-gray-400 uppercase tracking-widest">Active HUD Capacity</div>
                    <div className={`text-xl font-bold ${activeHud.length >= 4 ? 'text-red-500' : 'text-[#00f0ff]'}`}>{activeHud.length} / 4</div>
                </div>
            </div>

            {spellbook.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-800 bg-black/50 text-gray-600">
                    <span className="text-4xl mb-4 opacity-50">🗄️</span>
                    <span className="uppercase tracking-widest font-bold">Archives Empty</span>
                    <span className="text-xs mt-2">Synthesize and archive abilities from your Combat HUD.</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {spellbook.map(c => {
                        const dispRaw = c.elementRaw || c.element || 'Kinetic';
                        const dispCore = c.elementCore || getCoreElement(c.elementRaw || 'Kinetic');
                        const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;
                        
                        const cardCost = safeInt(c.cost);
                        const coreMob = getCoreMobility(c.mobilityName || c.mobility || '');

                        return (
                            <div key={c.id || Math.random()} className="bg-black border border-gray-700 shadow-lg relative group flex flex-col hover:border-[#a855f7] transition-colors">
                                <div className="p-4 flex-1">
                                    <div className="flex justify-between items-start mb-2 border-b border-gray-800 pb-2">
                                        <div className="font-bold text-xl text-[#a855f7] truncate w-3/4" title={c.name}>{c.name || 'Custom Action'}</div>
                                        <div className="text-white font-bold text-lg bg-gray-900 px-2 py-0.5 border border-gray-700 shadow-inner">
                                            -{cardCost} <span className="text-[10px] text-[#00f0ff]">RES</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mb-3 text-xs">
                                        <div className="text-gray-400">Element:</div>
                                        <div className="text-right text-[#ff6600] font-bold truncate" title={showType}>{showType}</div>
                                        
                                        <div className="text-gray-400">Damage:</div>
                                        <div className="text-right text-white font-bold">{safeInt(c.d)}</div>
                                        
                                        <div className="text-gray-400">Area (a):</div>
                                        <div className="text-right text-white font-bold uppercase">{c.a === 'line3' ? '3-Hex Line' : c.a === 'cluster3' ? '3-Hex Cluster' : c.a === 0 || c.a === '0' ? 'Single' : `Radius ${c.a}`}</div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {c.effectName && (
                                            <span title={STATE_DESCRIPTIONS[getCoreState(c.effectName)] || 'State Application'} className="bg-purple-900 text-white text-[10px] px-2 py-1 border border-purple-500 font-bold uppercase cursor-help shadow-sm">
                                                [{c.effectName}]
                                            </span>
                                        )}
                                        {c.terrain && (
                                            <span className="bg-yellow-900/50 text-yellow-500 text-[10px] px-2 py-1 border border-yellow-700 font-bold uppercase shadow-sm">
                                                Gen: {String(c.terrain)}
                                            </span>
                                        )}
                                        {safeInt(c.m) > 0 && (
                                            <span className="bg-blue-900/50 text-blue-400 text-[10px] px-2 py-1 border border-blue-700 font-bold uppercase shadow-sm">
                                                {coreMob}: {safeInt(c.m)}
                                            </span>
                                        )}
                                    </div>

                                    {c.desc && (
                                        <div className="text-gray-500 text-[10px] italic border-t border-gray-800 pt-2 leading-relaxed">
                                            "{c.desc}"
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex mt-auto border-t border-gray-700">
                                    <button 
                                        className={`flex-1 font-bold p-3 uppercase tracking-wider text-xs transition-colors ${activeHud.length >= 4 ? 'bg-gray-900 text-gray-600 cursor-not-allowed' : 'bg-[#1a222c] text-[#00f0ff] hover:bg-[#00f0ff] hover:text-black'}`} 
                                        disabled={activeHud.length >= 4} 
                                        onClick={() => equipSkill(c)}
                                    >
                                        {activeHud.length >= 4 ? 'HUD FULL' : '⇪ EQUIP TO HUD'}
                                    </button>
                                    <button 
                                        className="bg-black text-gray-500 hover:bg-red-900 hover:text-white px-4 border-l border-gray-700 transition-colors" 
                                        onClick={() => deleteSkill(c.id, c.name)}
                                        title="Delete from Archives"
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