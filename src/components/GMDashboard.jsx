/* eslint-disable */
import React from 'react';
import { bestiary } from '../data/bestiary';

export default function GMDashboard({ encounter = {}, tokens = [], pushUpdate }) {
    const updateEnc = (updates) => pushUpdate(s => ({ ...s, encounter: { ...s.encounter, ...updates } }));

    const addEnemy = (bestiaryId) => {
        const template = bestiary.find(b => b.id === bestiaryId);
        if (!template) return;
        const newEnemy = { ...template, uid: Date.now(), currentHp: template.hp || 0, currentBarriers: template.barriers ? [...template.barriers] : [], siphonActive: false, staggered: false };
        updateEnc({ enemies: [...(encounter?.enemies || []), newEnemy] });
    };

    const primeEnemyAbility = (enemy, cleanName, desc) => {
        const dmgMatch = desc.match(/deals\s+(\d+)\s+damage/i);
        const aoeMatch = desc.match(/(\d+)-hex\s+radius/i) || desc.match(/radius\s+of\s+(\d+)/i);
        const parsedDmg = dmgMatch ? parseInt(dmgMatch[1]) : 0;
        const parsedAoe = aoeMatch ? parseInt(aoeMatch[1]) : 0;
        
        let eRange = "1";
        const rangeMatch = desc.match(/range\s+(\d+)(?:-(\d+))?/i);
        if (rangeMatch) eRange = rangeMatch[2] ? `${rangeMatch[1]}-${rangeMatch[2]}` : rangeMatch[1];
        
        pushUpdate(s => ({ ...s, activeAction: { source: enemy.name, sourceId: enemy.uid, isEnemy: true, name: cleanName, d: parsedDmg, a: parsedAoe, range: eRange } }));
    };

    // --- GLOBAL TURN REFRESHER ---
    const handleNextRound = () => {
        pushUpdate(s => {
            const newRound = (s.encounter?.round || 0) + 1;
            // Refill EVERY token's movement point pool
            const newTokens = (s.tokens || []).map(t => ({ ...t, movementRemaining: t.speed ?? 3 }));
            // Unlock all Player defensive toggles
            const newPlayer = { ...s.player, usedParry: false, usedIntercept: false, usedEvade: false };
            
            return { 
                ...s, 
                encounter: { ...s.encounter, round: newRound }, 
                tokens: newTokens, 
                player: newPlayer 
            };
        });
    };

    const isOverload = (encounter?.round || 0) >= 4;
    const enemiesList = encounter?.enemies || [];
    const enemyTokens = tokens.filter(tok => tok.type === 'enemy').sort((a,b) => a.id - b.id);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 font-mono text-sm">
            <div className={`p-4 border flex flex-col ${isOverload ? 'bg-red-950 border-red-500' : 'bg-[#1a222c] border-slate-700'}`}>
                <h2 className="text-white font-bold text-xl mb-4 border-b border-gray-700 pb-2">Encounter Flow</h2>
                
                <div className="text-center mb-6">
                    <div className="text-gray-400 mb-1 text-xs tracking-widest uppercase">ENCOUNTER PHASE</div>
                    <div className={`text-4xl font-bold mb-4 ${encounter?.round === 0 ? 'text-[#00f0ff]' : 'text-white'}`}>
                        {encounter?.round === 0 ? 'DEPLOYMENT' : `ROUND ${encounter?.round}`}
                    </div>
                    {isOverload && (
                        <div className="bg-black text-red-500 font-bold p-2 border border-red-500 mb-4 animate-pulse">
                            SYSTEM OVERLOAD ACTIVE
                        </div>
                    )}
                    <div className="flex gap-2 mb-6">
                        <button className="flex-1 bg-gray-800 border border-gray-600 p-2 hover:bg-gray-700 text-white" onClick={() => updateEnc({ round: Math.max(0, (encounter?.round || 0) - 1) })}>- Prev</button>
                        <button className="flex-1 bg-white text-black font-bold p-2 hover:bg-gray-300 transition-colors" onClick={handleNextRound}>Next +</button>
                    </div>

                    <div className="text-gray-400 mb-1 text-xs tracking-widest uppercase">Active Turn</div>
                    <div className="flex gap-2">
                        <button className={`flex-1 p-2 font-bold border transition-colors ${encounter?.activeTurn === 'player' ? 'bg-[#00f0ff] text-black border-[#00f0ff]' : 'bg-black text-gray-500 border-gray-700 hover:text-white'}`} onClick={() => updateEnc({ activeTurn: 'player' })}>AGENTS</button>
                        <button className={`flex-1 p-2 font-bold border transition-colors ${encounter?.activeTurn === 'enemy' ? 'bg-[#ff6600] text-black border-[#ff6600]' : 'bg-black text-gray-500 border-gray-700 hover:text-white'}`} onClick={() => updateEnc({ activeTurn: 'enemy' })}>HOSTILES</button>
                    </div>
                    <div className="text-xs text-gray-500 mt-2 leading-tight">Clicking [Next +] automatically refills all token movement ranges and resets Player Guard toggles.</div>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-auto">
                    <div className="text-gray-400 mb-2">Global Enemy Pool</div>
                    <div className="flex items-center justify-between bg-black border border-gray-600 p-2">
                        <button className="px-3 text-lg font-bold text-gray-400 hover:text-[#ff6600]" onClick={() => updateEnc({ enemyPoolTotal: Math.max(0, (encounter?.enemyPoolTotal || 0) - 1)})}>-</button>
                        <span className="text-2xl text-[#ff6600] font-bold">{encounter?.enemyPoolTotal || 0}</span>
                        <button className="px-3 text-lg font-bold text-gray-400 hover:text-[#ff6600]" onClick={() => updateEnc({ enemyPoolTotal: (encounter?.enemyPoolTotal || 0) + 1})}>+</button>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3 bg-[#1a222c] p-4 border border-slate-700 flex flex-col h-[75vh]">
                <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
                    <h2 className="text-[#ff6600] font-bold text-xl">Active Hostiles</h2>
                    <select className="bg-black text-white border border-gray-600 p-2 outline-none cursor-pointer" onChange={(e) => { if(e.target.value) addEnemy(parseInt(e.target.value)); e.target.value=""; }}>
                        <option value="">+ Deploy Entity...</option>
                        {bestiary.map(b => <option key={b.id} value={b.id}>T{b.tier} - {b.name}</option>)}
                    </select>
                </div>
                
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {enemiesList.length === 0 && <div className="text-gray-500 text-center mt-10 border border-dashed border-gray-700 p-8">No active entities on the grid.</div>}
                    
                    {enemiesList.map((enemy, idx) => {
                        const myToken = enemyTokens[idx];

                        return (
                            <div key={enemy.uid} className={`border p-3 flex flex-col xl:flex-row gap-4 ${enemy.staggered ? 'border-yellow-500 bg-yellow-900 bg-opacity-20' : 'border-gray-700 bg-black'}`}>
                                <div className="flex-1 w-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <div className="font-bold text-white text-lg flex items-center gap-2">
                                            {enemy.name} <span className="text-xs bg-gray-800 px-2 py-0.5 text-gray-400">T{enemy.tier}</span>
                                        </div>
                                        <div className="text-gray-400 text-xs font-bold uppercase tracking-widest bg-gray-900 px-2 py-1 border border-gray-700">
                                            Move Pts: <span className="text-[#ff6600]">{myToken ? `${myToken.movementRemaining ?? myToken.speed ?? 3} / ${myToken.speed ?? 3}` : 'Off Grid'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-2 space-y-2">
                                        {(enemy.abilities || []).map((ability, aIdx) => {
                                            const parts = (ability || '').split(':');
                                            const rawName = parts[0];
                                            const cleanName = rawName.replace(/\[\d+\s*Res\]/i, '').replace(/\(\d+\s*Res\)/i, '').trim();
                                            const desc = parts.length > 1 ? parts.slice(1).join(':') : '';
                                            const costMatch = rawName.match(/\[(\d+)\s*Res\]/i) || rawName.match(/\((\d+)\s*Res\)/i);
                                            const cost = costMatch ? parseInt(costMatch[1]) : 0;

                                            return (
                                                <div key={aIdx} className="bg-gray-900 p-2 border border-gray-700 text-xs flex justify-between items-start gap-2">
                                                    <div>
                                                        <span className="font-bold text-[#00f0ff]">{cleanName}</span>
                                                        {desc && <span className="text-gray-400 block mt-1">{desc.trim()}</span>}
                                                    </div>
                                                    <div className="flex gap-2 shrink-0">
                                                        {cost > 0 && (
                                                            <button className="bg-black border border-[#ff6600] text-[#ff6600] px-2 py-1 text-[10px] font-bold uppercase hover:bg-[#ff6600] hover:text-black transition-colors" onClick={() => updateEnc({ enemyPoolTotal: Math.max(0, (encounter?.enemyPoolTotal || 0) - cost) })}>
                                                                -{cost} Res
                                                            </button>
                                                        )}
                                                        <button className="bg-[#00f0ff] text-black px-2 py-1 text-[10px] font-bold uppercase hover:bg-white transition-colors" onClick={() => primeEnemyAbility(enemy, cleanName, desc)}>Target</button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-4 w-full xl:w-auto overflow-x-auto pb-2 xl:pb-0 shrink-0">
                                    {(enemy.currentBarriers || []).map((bar, bIdx) => (
                                        <div key={bIdx} className="text-center shrink-0">
                                            <div className="text-[10px] text-[#00f0ff] font-bold">BAR {bIdx+1}</div>
                                            <input type="number" className="w-12 bg-gray-900 border border-[#00f0ff] text-center text-white outline-none" value={bar} onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                pushUpdate(s => {
                                                    const newE = [...(s.encounter?.enemies || [])];
                                                    if (newE[idx]) {
                                                        newE[idx].currentBarriers[bIdx] = val;
                                                        if (val <= 0 && bar > 0) newE[idx].staggered = true;
                                                    }
                                                    return { ...s, encounter: { ...s.encounter, enemies: newE }};
                                                });
                                            }} />
                                        </div>
                                    ))}
                                    <div className="text-center shrink-0">
                                        <div className="text-[10px] text-[#ff6600] font-bold">BASE HP</div>
                                        <input type="number" className="w-16 bg-gray-900 border border-[#ff6600] text-center text-white font-bold text-lg outline-none" value={enemy.currentHp || 0} onChange={(e) => {
                                            const val = parseInt(e.target.value) || 0;
                                            pushUpdate(s => {
                                                const newE = [...(s.encounter?.enemies || [])];
                                                if (newE[idx]) newE[idx].currentHp = val;
                                                return { ...s, encounter: { ...s.encounter, enemies: newE }};
                                            });
                                        }} />
                                    </div>
                                    <button className="text-gray-600 hover:text-red-500 ml-2 text-xl font-bold transition-colors px-2 shrink-0" onClick={() => updateEnc({ enemies: enemiesList.filter(e => e.uid !== enemy.uid) })}>✕</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}