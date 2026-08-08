/* eslint-disable */
import React, { useState } from 'react';

const ELEMENT_DICTIONARY = { 'thermal': ['fire', 'heat', 'magma', 'lava', 'ash', 'plasma', 'steam', 'solar', 'sun', 'flame', 'pyro', 'scorch', 'burn', 'inferno', 'ignition'], 'cryo': ['ice', 'cold', 'frost', 'snow', 'water', 'liquid', 'ocean', 'glacier', 'hydro', 'aqua', 'chill', 'blizzard', 'freeze', 'arctic'], 'electro': ['lightning', 'electric', 'spark', 'thunder', 'magnetic', 'storm', 'volt', 'shock', 'galvanic', 'energy', 'emp'], 'toxic': ['poison', 'acid', 'venom', 'decay', 'rot', 'radiation', 'bio', 'gas', 'smog', 'plague', 'blight', 'corrosive', 'noxious', 'viral', 'chemical'], 'radiant': ['light', 'holy', 'divine', 'healing', 'spirit', 'luminous', 'glow', 'life', 'order', 'sacred', 'blessed', 'purify', 'stellar'], 'void': ['dark', 'shadow', 'space', 'gravity', 'time', 'cosmic', 'null', 'psychic', 'mind', 'mental', 'chaos', 'entropy', 'abyss', 'astral', 'telekinetic', 'warp'], 'kinetic': ['physical', 'force', 'bludgeoning', 'piercing', 'slashing', 'earth', 'stone', 'rock', 'wind', 'air', 'pressure', 'metal', 'steel', 'sand', 'dust', 'aero', 'geo', 'sound', 'sonic', 'acoustic', 'seismic', 'blood'] };
const STATE_DICTIONARY = { 'Hijacked': ['hijack', 'mind control', 'dominate', 'possess', 'control'], 'Execute': ['execute', 'erase', 'delete'], 'Bleed': ['bleed', 'hemorrhage', 'lacerate'], 'Burn': ['burn', 'ignite', 'scorch'], 'Poisoned': ['poison', 'venom', 'decay'], 'Immobilized': ['immobilize', 'root', 'snare'], 'Stunned': ['stun', 'paralyze', 'petrify'], 'Shielded': ['shield', 'protect', 'barrier'], 'Vulnerable': ['vulnerable', 'expose', 'sunder'], 'Knockdown': ['knockdown', 'trip', 'shove'], 'Blind': ['blind', 'obscure', 'smoke'], 'Haste': ['haste', 'speed', 'quick'], 'Slowed': ['slow', 'sluggish', 'chill'], 'Shocked': ['shock', 'glitch', 'jolt'], 'Evasive': ['evade', 'dodge', 'blur'], 'Invulnerable': ['invulnerable', 'stasis', 'immune'] };
const MOBILITY_DICTIONARY = { 'Blink': ['blink', 'teleport', 'jump'], 'Push': ['push', 'repel', 'throw'], 'Pull': ['pull', 'attract', 'draw'] };

const CLASS_AFFINITIES = { 'Vanguard': { states: ['Knockdown', 'Bleed', 'Shielded', 'Burn', 'Execute'] }, 'Sniper': { states: ['Vulnerable', 'Blind', 'Bleed', 'Execute', 'Evasive'] }, 'Conduit': { states: ['Stunned', 'Shocked', 'Shielded', 'Haste', 'Immobilized'] }, 'Paladin': { states: ['Shielded', 'Burn', 'Knockdown', 'Invulnerable'] }, 'Saboteur': { states: ['Immobilized', 'Blind', 'Slowed', 'Shocked', 'Vulnerable', 'Poisoned'] }, 'Skirmisher': { states: ['Haste', 'Evasive', 'Bleed', 'Slowed'] }, 'Rookie': { states: ['Haste', 'Bleed'] } };

const ELEMENT_DESCRIPTIONS = { 'Kinetic': 'Physical force, bludgeoning, slashing, earth, wind.', 'Thermal': 'Heat, fire, plasma, magma.', 'Cryo': 'Cold, ice, water, frost.', 'Electro': 'Lightning, electricity, magnetic.', 'Toxic': 'Poison, acid, radiation, decay.', 'Radiant': 'Light, holy, healing, order.', 'Void': 'Dark, gravity, space, psychic.' };
const STATE_DESCRIPTIONS = { 'Hijacked': 'Forces target to immediately cast an ability under your control.', 'Execute': 'Instantly reduces HP to 0.', 'Bleed': 'Takes 3 HP damage at round end.', 'Burn': 'Takes 3 Thermal damage at round end.', 'Poisoned': 'Takes 3 Toxic damage at round end.', 'Immobilized': 'Movement points reduced to 0.', 'Stunned': 'Movement 0. Cannot attack. Defenses jammed.', 'Shielded': 'Absorbs 5 damage.', 'Vulnerable': 'Takes 1.5x damage.', 'Knockdown': 'Movement halved.', 'Blind': 'Range 1, AoE 0.', 'Haste': '+2 Move.', 'Slowed': '-2 Move.', 'Shocked': 'Defenses jammed.', 'Evasive': 'Forces Evasion roll.', 'Invulnerable': 'Negates attack.' };

const ELEMENT_STATE_MAP = {
    'Kinetic': ['Bleed', 'Immobilized', 'Stunned', 'Shielded', 'Vulnerable', 'Knockdown', 'Evasive'],
    'Thermal': ['Burn', 'Blind', 'Vulnerable', 'Execute'],
    'Cryo': ['Slowed', 'Immobilized', 'Stunned', 'Shielded'],
    'Electro': ['Shocked', 'Stunned', 'Haste', 'Blind', 'Hijacked'],
    'Toxic': ['Poisoned', 'Blind', 'Vulnerable'],
    'Radiant': ['Blind', 'Haste', 'Shielded', 'Invulnerable'],
    'Void': ['Execute', 'Evasive', 'Blind', 'Slowed', 'Immobilized', 'Hijacked']
};

const STATE_TIERS = {
    'Bleed': 1, 'Burn': 1, 'Poisoned': 1, 'Haste': 1, 'Slowed': 1,
    'Knockdown': 3, 'Blind': 3, 'Shielded': 3, 'Vulnerable': 3, 'Shocked': 3, 'Evasive': 3,
    'Immobilized': 5, 'Stunned': 5, 'Invulnerable': 5,
    'Execute': 10, 'Hijacked': 10
};

const safeInt = (val) => isNaN(parseInt(val)) ? 0 : parseInt(val);
const safeArray = (arr) => { if (!arr) return []; if (Array.isArray(arr)) return arr.filter(i => i !== null && i !== undefined); if (typeof arr === 'object') return Object.values(arr).filter(i => i !== null && i !== undefined); return []; };

const getCoreState = (input) => { if (!input) return ''; const match = String(input).match(/\[(.*?)\]/); const clean = (match ? match[1] : String(input)).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(STATE_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };
const getCoreElement = (input) => { if (!input) return 'Kinetic'; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(ELEMENT_DICTIONARY)) { if (core === clean || synonyms.includes(clean)) return core.charAt(0).toUpperCase() + core.slice(1); } return 'Kinetic'; };
const getCoreMobility = (input) => { if (!input) return ''; const clean = String(input).toLowerCase().trim(); for (const [core, synonyms] of Object.entries(MOBILITY_DICTIONARY)) { if (core.toLowerCase() === clean || synonyms.some(s => clean.includes(s))) return core; } return String(input); };

const getAutomatedAffinity = (playerAffinity, activeClass, spellElementCore, spellEffectCore, uValue) => {
    const cls = CLASS_AFFINITIES[activeClass] || CLASS_AFFINITIES['Rookie'];
    const isEleSyn = playerAffinity === spellElementCore; const isStateSyn = cls.states.includes(spellEffectCore);
    const pElem = playerAffinity ? String(playerAffinity).toLowerCase() : 'kinetic'; const sElem = spellElementCore ? String(spellElementCore).toLowerCase() : 'kinetic';
    const isOpposed = (sElem === 'toxic' && pElem === 'thermal') || (sElem === 'thermal' && pElem === 'cryo') || (sElem === 'cryo' && pElem === 'toxic') || (sElem === 'radiant' && pElem === 'void') || (sElem === 'void' && pElem === 'radiant') || (sElem === 'electro' && pElem === 'kinetic') || (sElem === 'kinetic' && pElem === 'electro');
    if (isOpposed) return { alpha: 2.0, label: 'Resistance' };
    if (uValue >= 5 && !isStateSyn) return { alpha: 2.0, label: 'Resistance' };
    if (isEleSyn || isStateSyn) return { alpha: 0.75, label: 'Synergy' };
    return { alpha: 1.0, label: 'Neutral' };
};
const getAoeCost = (a) => { if (a === 'line3' || a === 'cluster3') return 1; const n = parseInt(a) || 0; return n * n; };

export default function Spellbook({ players = {}, localId, pushUpdate }) {
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});

    const rawPlayer = players[localId];
    const player = rawPlayer || { savedSkills: [], customCards: [], name: 'Agent', affinity: 'Kinetic' };
    
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
                pClone[localId].customCards = [...safeArray(pClone[localId].customCards), skill];
                pClone[localId].savedSkills = safeArray(pClone[localId].savedSkills).filter(item => String(item.id) !== String(skill.id));
            }
            return { ...s, players: pClone };
        });
    };

    const deleteSkill = (skillId, skillName) => {
        if (window.confirm(`WARNING: Are you sure you want to permanently delete "${skillName}" from your archives?`)) {
            pushUpdate(s => {
                const pClone = JSON.parse(JSON.stringify(s.players || {}));
                if (pClone[localId]) {
                    pClone[localId].savedSkills = safeArray(pClone[localId].savedSkills).filter(item => String(item.id) !== String(skillId));
                }
                return { ...s, players: pClone };
            });
        }
    };

    const startEditing = (skill) => {
        setEditingId(skill.id);
        setEditForm({
            name: skill.name || '',
            payload: skill.payload || 'damage',
            elementRaw: skill.elementRaw || 'Kinetic',
            d: safeInt(skill.d),
            u: safeInt(skill.u),
            a: skill.a || 0,
            effectName: skill.effectName || '',
            terrain: skill.terrain || '',
            m: safeInt(skill.m),
            mobilityName: skill.mobilityName || '',
            desc: skill.desc || ''
        });
    };

    const saveEdit = (skillId) => {
        const cElem = getCoreElement(editForm.elementRaw);
        const cState = getCoreState(editForm.effectName);
        let activeClass = "Rookie";
        const front = safeInt(player.dpFront); const supp = safeInt(player.dpSupport); const back = safeInt(player.dpBack);
        if (front >= 10) activeClass = "Vanguard"; else if (supp >= 10) activeClass = "Conduit"; else if (back >= 10) activeClass = "Sniper"; else if (front >= 5 && supp >= 5) activeClass = "Paladin"; else if (front >= 5 && back >= 5) activeClass = "Skirmisher"; else if (supp >= 5 && back >= 5) activeClass = "Saboteur";

        const aff = getAutomatedAffinity(player.affinity || 'Kinetic', activeClass, cElem, cState, safeInt(editForm.u));
        const tCost = editForm.terrain === 'minor' ? 1 : editForm.terrain === 'clear' ? 2 : editForm.terrain === 'major' ? 3 : editForm.terrain === 'severe' ? 5 : 0;
        const newCost = Math.ceil(aff.alpha * (safeInt(editForm.d) + safeInt(editForm.u) + tCost + safeInt(editForm.m) + getAoeCost(editForm.a)));

        pushUpdate(s => {
            const pClone = JSON.parse(JSON.stringify(s.players || {}));
            if (pClone[localId]) {
                const list = safeArray(pClone[localId].savedSkills);
                const idx = list.findIndex(item => String(item.id) === String(skillId));
                if (idx !== -1) {
                    list[idx] = {
                        ...list[idx],
                        ...editForm,
                        elementCore: cElem,
                        effectCore: cState,
                        alpha: aff.alpha,
                        cost: newCost
                    };
                }
                pClone[localId].savedSkills = list;
            }
            return { ...s, players: pClone };
        });
        setEditingId(null);
    };

    return (
        <div className="bg-[#05080a] border border-slate-700 min-h-[75vh] p-6 md:p-10 font-mono text-gray-300 shadow-inner">
            
            <div className="flex justify-between items-end border-b border-gray-700 pb-4 mb-8">
                <div>
                    <h1 className="text-[#a855f7] font-bold text-3xl tracking-widest uppercase mb-1">Archival Spellbook</h1>
                    <p className="text-gray-500 text-xs tracking-wider uppercase">Storage, editing, and retrieval of synthesized tactical protocols</p>
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
                        const isEditing = editingId === c.id;
                        const dispRaw = c.elementRaw || c.element || 'Kinetic';
                        const dispCore = c.elementCore || getCoreElement(c.elementRaw || 'Kinetic');
                        const showType = (String(dispRaw).toLowerCase() !== String(dispCore).toLowerCase()) ? `${dispRaw} [Core: ${dispCore}]` : dispCore;
                        
                        const cardCost = safeInt(c.cost);
                        const coreMob = getCoreMobility(c.mobilityName || c.mobility || '');
                        
                        const isHeal = c.payload === 'heal';
                        const isBattery = c.payload === 'battery';

                        if (isEditing) {
                            return (
                                <div key={c.id} className="bg-black border-2 border-[#a855f7] p-4 flex flex-col gap-3 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                                    <div className="text-[#a855f7] font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-1">Editing Archived Protocol</div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Name:</span>
                                        <input type="text" className="bg-gray-900 border border-gray-600 p-1.5 text-white text-xs outline-none font-bold" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Payload:</span>
                                        <select className="bg-gray-900 border border-gray-600 p-1.5 text-white text-xs outline-none" value={editForm.payload} onChange={e => setEditForm({...editForm, payload: e.target.value})}>
                                            <option value="damage">Damage</option>
                                            <option value="heal">Restorative (Heal)</option>
                                            <option value="battery">Energize (Res Transfer)</option>
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Element:</span>
                                            <select className="bg-gray-900 border border-gray-600 p-1 text-white text-[10px] outline-none" value={editForm.elementRaw} onChange={e => {
                                                const newEl = e.target.value; const cEl = getCoreElement(newEl);
                                                const validSt = ELEMENT_STATE_MAP[cEl] || [];
                                                setEditForm(prev => ({ ...prev, elementRaw: newEl, effectName: validSt.includes(getCoreState(prev.effectName)) ? prev.effectName : '', u: validSt.includes(getCoreState(prev.effectName)) ? prev.u : 0 }));
                                            }}>
                                                {Object.keys(ELEMENT_DESCRIPTIONS).map(el => <option key={el} value={el}>{el}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-[10px] text-gray-400 uppercase font-bold">Value (v):</span>
                                            <input type="number" className="bg-gray-900 border border-gray-600 p-1 text-white text-xs outline-none text-center font-bold" value={editForm.d} onChange={e => setEditForm({...editForm, d: safeInt(e.target.value)})} />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] text-purple-400 uppercase font-bold">Status State:</span>
                                        <select className="bg-gray-900 border border-purple-600 p-1 text-white text-[10px] outline-none" value={editForm.effectName} onChange={e => {
                                            const st = e.target.value;
                                            setEditForm({...editForm, effectName: st, u: st ? STATE_TIERS[st] : 0});
                                        }}>
                                            <option value="">-- None --</option>
                                            {(ELEMENT_STATE_MAP[getCoreElement(editForm.elementRaw)] || []).map(st => <option key={st} value={st}>[{st}] (+{STATE_TIERS[st]}u)</option>)}
                                        </select>
                                    </div>

                                    <div className="flex gap-2 mt-2">
                                        <button className="flex-1 bg-[#22c55e] text-black font-bold py-2 uppercase text-xs hover:bg-white transition-colors" onClick={() => saveEdit(c.id)}>Save</button>
                                        <button className="flex-1 bg-gray-800 text-gray-400 font-bold py-2 uppercase text-xs hover:text-white transition-colors" onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            );
                        }

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
                                        
                                        <div className="text-gray-400">
                                            {isHeal ? 'Heal:' : isBattery ? 'Energize:' : 'Damage:'}
                                        </div>
                                        <div className={`text-right font-bold ${isHeal ? 'text-[#22c55e]' : isBattery ? 'text-[#00f0ff]' : 'text-white'}`}>
                                            {safeInt(c.d)}
                                        </div>
                                        
                                        <div className="text-gray-400">Area (a):</div>
                                        <div className="text-right text-white font-bold uppercase">{c.a === 'line3' ? '3-Hex Line' : c.a === 'cluster3' ? '3-Hex Cluster' : c.a === 0 || c.a === '0' ? 'Single' : `Radius ${c.a}`}</div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {isHeal && (
                                            <span className="bg-[#166534]/50 text-[#4ade80] text-[10px] px-2 py-1 border border-[#166534] font-bold uppercase shadow-sm">
                                                Restorative
                                            </span>
                                        )}
                                        {isBattery && (
                                            <span className="bg-[#164e63]/50 text-[#22d3ee] text-[10px] px-2 py-1 border border-[#164e63] font-bold uppercase shadow-sm">
                                                Energize
                                            </span>
                                        )}
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
                                        {activeHud.length >= 4 ? 'HUD FULL' : '⇪ EQUIP'}
                                    </button>
                                    <button 
                                        className="bg-black text-[#a855f7] hover:bg-[#a855f7] hover:text-black px-3 border-l border-gray-700 transition-colors font-bold" 
                                        onClick={() => startEditing(c)}
                                        title="Edit Protocol"
                                    >
                                        ✎
                                    </button>
                                    <button 
                                        className="bg-black text-gray-500 hover:bg-red-900 hover:text-white px-3 border-l border-gray-700 transition-colors font-bold" 
                                        onClick={() => deleteSkill(c.id, c.name)}
                                        title="Delete Protocol"
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