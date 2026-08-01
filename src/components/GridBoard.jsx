/* eslint-disable react/prop-types */
import { useState } from 'react';

export default function GridBoard({ grid = [], tokens = [], encounter = {}, pushUpdate }) {
    const [paintBrush, setPaintBrush] = useState(null);
    const [selectedToken, setSelectedToken] = useState(null);
    
    // Grid Dimensions
    const COLS = 15;
    const ROWS = 10;
    
    const activeGrid = grid.length === 150 ? grid : Array(150).fill({ type: 'empty', terrain: null });
    const activeTokens = tokens || [];

    // --- NEW FLAT-TOP HEX MATH ---
    const R = 36; // Hex radius
    const hexWidth = R * 2; // 72px
    const hexHeight = R * Math.sqrt(3); // ~62.35px
    const stepX = hexWidth * 0.75; // 54px horizontal step between columns
    const stepY = hexHeight; // 62.35px vertical step between rows
    
    const boardWidth = (COLS - 1) * stepX + hexWidth;
    const boardHeight = (ROWS - 1) * stepY + hexHeight + (stepY / 2);

    const getHexCoords = (idx) => {
        const col = idx % COLS;
        const row = Math.floor(idx / COLS);
        const x = col * stepX;
        // Odd columns shift down by half a hex height to interlock
        const y = row * stepY + (col % 2 === 1 ? stepY / 2 : 0);
        return { x, y };
    };

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

    const renderHexBackgrounds = () => {
        return activeGrid.map((cell, idx) => {
            const { x, y } = getHexCoords(idx);
            
            let bgColor = '#1e293b'; 
            if (cell.terrain === 'minor') bgColor = 'rgba(234, 179, 8, 0.4)'; 
            if (cell.terrain === 'major') bgColor = 'rgba(168, 85, 247, 0.4)'; 
            if (cell.terrain === 'severe') bgColor = 'rgba(59, 130, 246, 0.4)'; 

            return (
                <div 
                    key={`bg-${idx}`} 
                    onClick={() => handleHexClick(idx)}
                    className="absolute cursor-pointer hover:bg-slate-500 transition-colors"
                    style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        width: `${hexWidth}px`,
                        height: `${hexHeight}px`,
                        backgroundColor: bgColor,
                        // NEW: Flat-Top Polygon Shape
                        clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
                        transform: 'scale(0.95)' // Creates the visual grid lines between hexes
                    }}
                ></div>
            );
        });
    };

    const renderTokens = () => {
        return activeTokens.map((t) => {
            const { x, y } = getHexCoords(t.pos);
            
            // Handle visual offsets if multiple tokens share the same hex
            const tokensInHex = activeTokens.filter(tok => tok.pos === t.pos);
            const orderInHex = tokensInHex.findIndex(tok => tok.id === t.id);
            const offsetX = orderInHex > 0 ? orderInHex * 10 : 0;
            const offsetY = orderInHex > 0 ? orderInHex * 10 : 0;

            let enemyHpDisplay = null;
            if (t.type === 'enemy') {
                const enemyTokens = activeTokens.filter(tok => tok.type === 'enemy').sort((a,b) => a.id - b.id);
                const tokenIndex = enemyTokens.findIndex(tok => tok.id === t.id);
                const linkedEnemy = (encounter?.enemies || [])[tokenIndex];
                
                if (linkedEnemy) {
                    enemyHpDisplay = (
                        <div 
                            // pointer-events-none ensures you can still click the hex directly underneath the HP label
                            className="absolute -bottom-8 bg-black text-[#ff6600] text-[11px] font-bold px-1.5 py-0.5 border border-[#ff6600] rounded whitespace-nowrap shadow-md pointer-events-none z-50"
                            style={{ transform: `rotate(-${t.facing * 60}deg)` }} 
                        >
                            {linkedEnemy.currentHp} HP
                        </div>
                    );
                }
            }

            return (
                <div 
                    key={`tok-${t.id}`} 
                    className={`absolute w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold text-black transition-transform ${t.type === 'player' ? 'bg-[#00f0ff]' : 'bg-[#ff6600]'} ${selectedToken === t.id ? 'ring-4 ring-white scale-110 shadow-lg shadow-white/50 z-40' : 'shadow-md shadow-black/80 z-30'}`}
                    onClick={(e) => { e.stopPropagation(); setSelectedToken(selectedToken === t.id ? null : t.id); }}
                    style={{
                        // Center the 40x40 token perfectly within the 72x62.35 hex
                        left: `${x + (hexWidth / 2 - 20) + offsetX}px`,
                        top: `${y + (hexHeight / 2 - 20) + offsetY}px`,
                        transform: `rotate(${t.facing * 60}deg)`
                    }}
                >
                    <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-black absolute top-1 cursor-pointer" onClick={(e) => rotateToken(e, t.id)}></div>
                    
                    <span className="mt-1">{t.type === 'player' ? 'P' : 'E'}</span>
                    {enemyHpDisplay}

                    {selectedToken === t.id && (
                        <button 
                            className="absolute -top-4 -right-4 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold border-2 border-black hover:bg-red-500 z-50"
                            onClick={(e) => deleteToken(e, t.id)}
                        >
                            ✕
                        </button>
                    )}
                </div>
            );
        });
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

            <div className="flex-1 bg-[#05080a] border border-slate-700 overflow-auto p-4 md:p-10 touch-none shadow-inner">
                {/* NEW: Decoupled Render Container */}
                <div className="relative mx-auto" style={{ width: boardWidth, height: boardHeight }}>
                    {renderHexBackgrounds()}
                    {renderTokens()}
                </div>
            </div>
        </div>
    );
}