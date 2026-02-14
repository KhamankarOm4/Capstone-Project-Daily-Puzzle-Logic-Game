import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type BinaryGridData, type BinaryGridSolution, type BinaryGridInput, type BinaryGridType } from './engines/BinaryGridEngine';

export const BinaryGridRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<BinaryGridData, BinaryGridSolution, BinaryGridInput>) => {
    const [grid, setGrid] = useState<BinaryGridType>(data.grid.map(row => [...row]));

    // Handle hints
    useEffect(() => {
        if (hintTrigger > 0) {
            const emptyCells: { r: number, c: number }[] = [];
            grid.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell === null) emptyCells.push({ r, c });
                });
            });

            if (emptyCells.length > 0) {
                const randomIdx = Math.floor(Math.random() * emptyCells.length);
                const { r, c } = emptyCells[randomIdx];
                const correctVal = solution.grid[r][c];

                const newGrid = grid.map(row => [...row]);
                newGrid[r][c] = correctVal;
                setGrid(newGrid);
                onInput(newGrid);
            }
        }
    }, [hintTrigger, grid, onInput, solution]);


    const handleCellClick = (row: number, col: number) => {
        if (disabled || data.initialGrid[row][col] !== null) return;

        const newGrid = grid.map(r => [...r]);
        // Cycle: null -> 0 -> 1 -> null
        if (newGrid[row][col] === null) newGrid[row][col] = 0;
        else if (newGrid[row][col] === 0) newGrid[row][col] = 1;
        else newGrid[row][col] = null;

        setGrid(newGrid);
        onInput(newGrid);
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-8xl font-black text-white">01</span>
            </div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter">Binary <span className="text-accent-cyan">Logic</span></h3>
                <p className="text-neutral-300 text-sm font-medium">0s & 1s. Equal count. No triples.</p>
            </div>

            <div className="inline-grid gap-2.5 p-3 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm relative z-10"
                style={{ gridTemplateColumns: `repeat(${data.size}, minmax(0, 1fr))` }}>
                {grid.map((row, i) => (
                    row.map((cell, j) => {
                        const isInitial = data.initialGrid[i][j] !== null;
                        return (
                            <button
                                key={`${i}-${j}`}
                                onClick={() => handleCellClick(i, j)}
                                disabled={disabled || isInitial}
                                className={`w-12 h-12 sm:w-14 sm:h-14 text-2xl font-bold rounded-xl transition-all duration-300 border
                                ${isInitial
                                        ? 'bg-white/5 border-white/5 text-neutral-500 cursor-not-allowed'
                                        : 'bg-surface-200 border-white/10 hover:bg-white/10 hover:border-accent/30 shadow-[0_4px_10px_rgba(0,0,0,0.1)]'}
                                ${cell === 0 ? 'text-accent-glow font-mono' : cell === 1 ? 'text-accent-cyan font-mono' : 'text-transparent'}
                                ${!isInitial && 'active:scale-95 focus:outline-none focus:ring-0 hover:scale-105'}`}
                            >
                                {cell === null ? '.' : cell}
                            </button>
                        );
                    })
                ))}
            </div>
        </div>
    );
};
