/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function GridBoard({ grid = [], tokens = [], encounter = {}, pushUpdate }) {
    const [paintBrush, setPaintBrush] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);
    
    // 15x10 Hex Grid (150 total hexes)
    const COLS = 15;
    const ROWS = 10;
    
    const activeGrid = grid.length === 150 ? grid : Array(150).fill({ type: 'empty', terrain: null });
    const activeTokens = tokens || [];

    const handleHexClick = (index) => {
        if (paintBrush) {
            pushUpdate(s => {
                const newGrid = [...(s.grid?.length === 150 ? s.grid : Array(150).fill({ type: 'empty', terrain: null }))];
                newGrid[index] = { ...newGrid[index], terrain: paintBrush === 'clear' ? null : paintBrush };
                return { ...s, grid: newGrid };
            });
        } else if (selectedToken !== null) {
            pushUpdate(s => {
                const newTokens = [...(s.tokens || [])];
                const tokenIdx = newTokens.findIndex(t => t.id === selectedToken);
                if (tokenIdx !== -1) newTokens[tokenIdx].pos = index;
                return { ...s, tokens: newTokens };
            });
            setSelectedToken(null);
        }
    };

    const addToken = (type) => {
        pushUpdate(s => ({ 
            ...s, 
            tokens: [...(s.tokens || []), { id: Date.now(), type, pos: 0, facing: 0 }] 
        }));
    };

    const rotateToken = (e, id) => {
        e.stopPropagation();
        pushUpdate(s => {
            const newTokens = [...(s.tokens || [])];
            const idx = newTokens.findIndex(t => t.id === id);
            if (idx !== -1) newTokens[idx].facing = (newTokens[idx].facing + 1) % 6; 
            return { ...s, tokens: newTokens };
        });
    };

    const deleteToken = (e, id) => {
        e.stopPropagation();
        pushUpdate(s => ({
            ...s,
            tokens: (s.tokens || []).filter(t => t.id !== id)
        }));
        if (selectedToken === id) setSelectedToken(null);
    };

    const hexWidth = 60;
    const hexHeight = 69.28; 
    const rowHeightOffset = -17.32; 
    const colWidthOffset = 30; 

    const renderHexes = () => {
        let hexElements = [];
        for (let row = 0; row < ROWS; row++) {
            let rowHexes = [];
            for (let col = 0; col < COLS; col++) {
                const idx = row * COLS + col;
                const cell = activeGrid[idx];
                const tokensHere = activeTokens.filter(t => t.pos === idx);
                
                let bgColor = '#1e293b'; 
                if (cell.terrain === 'minor') bgColor = 'rgba(234, 179, 8, 0.4)'; 
                if (cell.terrain === 'major') bgColor = 'rgba(168, 85, 247, 0.4)'; 
                if (cell.terrain === 'severe') bgColor = 'rgba(59, 130, 246, 0.4)'; 

                rowHexes.push(
                    <div 
                        key={idx} 
                        onClick={() => handleHexClick(idx)}
                        className="relative flex items-center justify-center cursor-pointer hover:bg-slate-500 transition-colors"
                        style={{
                            width: `${hexWidth}px`,
                            height: `${hexHeight}px`,
                            backgroundColor: bgColor,
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                            margin: '1px' 
                        }}
                    >
                        {/* Render Tokens in this Hex */}
                        {tokensHere.map((t, i) => {
                            let enemyHpDisplay = null;
                            if (t.type === 'enemy') {
                                // Match token creation order with GM dashboard roster order
                                const enemyTokens = activeTokens.filter(tok => tok.type === 'enemy').sort((a,b) => a.id - b.id);
                                const tokenIndex = enemyTokens.findIndex(tok => tok.id === t.id);
                                const linkedEnemy = (encounter?.enemies || [])[tokenIndex];
                                
                                if (linkedEnemy) {
                                    enemyHpDisplay = (
                                        <div 
                                            className="absolute -bottom-6 bg-black text-[#ff6600] text-[11px] font-bold px-1.5 py-0.5 border border-[#ff6600] rounded whitespace-nowrap shadow-md z-20"
                                            style={{ transform: `rotate(-${t.facing * 60}deg)` }} // Counter-rotate so text stays upright
                                        >
                                            {linkedEnemy.currentHp} HP
                                        </div>
                                    );
                                }
                            }

                            return (
                                <div 
                                    key={t.id} 
                                    className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold text-black z-10 transition-transform ${t.type === 'player' ? 'bg-[#00f0ff]' : 'bg-[#ff6600]'} ${selectedToken === t.id ? 'ring-4 ring-white scale-110 shadow-lg shadow-white/50' : 'shadow-md shadow-black/80'}`}
                                    onClick={(e) => { e.stopPropagation(); setSelectedToken(selectedToken === t.id ? null : t.id); }}
                                    style={{
                                        transform: `rotate(${t.facing * 60}deg)`,
                                        marginTop: i > 0 ? `${i * 10}px` : '0',
                                        marginLeft: i > 0 ? `${i * 10}px` : '0'
                                    }}
                                >
                                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-black absolute top-1" onClick={(e) => rotateToken(e, t.id)}></div>
                                    
                                    <span className="mt-1">{t.type === 'player' ? 'P' : 'E'}</span>
                                    {enemyHpDisplay}

                                    {selectedToken === t.id && (
                                        <button 
                                            className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-black hover:bg-red-500"
                                            onClick={(e) => deleteToken(e, t.id)}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            }
            
            hexElements.push(
                <div key={row} className="flex" style={{ 
                    marginLeft: row % 2 !== 0 ? `${colWidthOffset}px` : '0px', 
                    marginTop: row !== 0 ? `${rowHeightOffset}px` : '0px'
                }}>
                    {rowHexes}
                </div>
            );
        }
        return hexElements;
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 h-[75vh]">
            <div className="w-full md:w-56 bg-[#1a222c] p-4 border border-slate-700 font-mono flex flex-col gap-3 shrink-0">
                <div className="text-[#00f0ff] font-bold mb-2 tracking-widest uppercase">Terrain Brush</div>
                <button 
                    className={`p-2 border text-sm text-left transition-colors ${paintBrush==='minor' ? 'border-[#ff6600] bg-black text-white font-bold' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`} 
                    onClick={()=>setPaintBrush(paintBrush==='minor'?null:'minor')}
                >
                    🟨 Minor (u=1)
                </button>
                <button 
                    className={`p-2 border text-sm text-left transition-colors ${paintBrush==='major' ? 'border-[#ff6600] bg-black text-white font-bold' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`} 
                    onClick={()=>setPaintBrush(paintBrush==='major'?null:'major')}
                >
                    🟪 Major (u=3)
                </button>
                <button 
                    className={`p-2 border text-sm text-left transition-colors ${paintBrush==='severe' ? 'border-[#ff6600] bg-black text-white font-bold' : 'border-gray-700 text-gray-300 hover:bg-gray-800'}`} 
                    onClick={()=>setPaintBrush(paintBrush==='severe'?null:'severe')}
                >
                    🟦 Severe (u=5)
                </button>
                <button 
                    className={`p-2 border text-sm text-left mt-2 transition-colors ${paintBrush==='clear' ? 'border-red-500 text-red-500' : 'border-gray-700 text-gray-400 hover:bg-gray-800'}`} 
                    onClick={()=>setPaintBrush(paintBrush==='clear'?null:'clear')}
                >
                    Clear Hex Tile
                </button>
                
                <div className="text-[#ff6600] font-bold mt-6 mb-2 tracking-widest uppercase">Deploy Tokens</div>
                <button className="bg-[#00f0ff] text-black p-2 font-bold text-sm hover:bg-white transition-colors" onClick={()=>addToken('player')}>
                    + Add Player
                </button>
                <button className="bg-[#ff6600] text-black p-2 font-bold text-sm hover:bg-white transition-colors" onClick={()=>addToken('enemy')}>
                    + Add Enemy
                </button>

                <div className="mt-auto border-t border-gray-700 pt-4 text-xs text-gray-500 leading-tight">
                    <strong className="text-gray-400">Controls:</strong><br/>
                    • Click brush, then click hex.<br/>
                    • Click token, then click hex to move.<br/>
                    • Click top edge of token to rotate facing.
                </div>
            </div>

            <div className="flex-1 bg-[#05080a] border border-slate-700 overflow-auto p-10 flex items-start justify-center relative touch-none shadow-inner">
                <div className="pt-4 pr-10">
                    {renderHexes()}
                </div>
            </div>
        </div>
    );
}