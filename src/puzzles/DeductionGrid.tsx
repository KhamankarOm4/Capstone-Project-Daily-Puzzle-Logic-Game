import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type DeductionData, type DeductionSolution, type DeductionInput } from './engines/DeductionGridEngine';

export const DeductionGridRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<DeductionData, DeductionSolution, DeductionInput>) => {
    // Initialize grid
    const [grid, setGrid] = useState<DeductionInput>(
        Array(3).fill(null).map(() => Array(3).fill(null))
    );

    useEffect(() => {
        if (hintTrigger > 0) {
            // Hint logic: Validate one cell or fill one cell
            // Simple implementation: Fill a random correct 'true' cell
            const trueCells: { r: number, c: number }[] = [];
            solution.grid.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell === true && grid[r][c] !== true) {
                        trueCells.push({ r, c });
                    }
                });
            });

            if (trueCells.length > 0) {
                const idx = Math.floor(Math.random() * trueCells.length);
                const { r, c } = trueCells[idx];
                const newGrid = grid.map(row => [...row]);
                newGrid[r][c] = true;
                setGrid(newGrid);
                onInput(newGrid);
            }
        }
    }, [hintTrigger, onInput, solution, grid]);


    const toggleCell = (r: number, c: number) => {
        if (disabled) return;
        const newGrid = grid.map(row => [...row]);
        const current = newGrid[r][c];
        if (current === null) newGrid[r][c] = false; // X
        else if (current === false) newGrid[r][c] = true; // O
        else newGrid[r][c] = null; // Clear
        setGrid(newGrid);
        onInput(newGrid);
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto p-10 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-8xl font-black text-white">✓</span>
            </div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter">Logic <span className="text-accent-glow">Grid</span></h3>
                <p className="text-neutral-300 text-sm font-medium">Deduce the connections.</p>
            </div>

            <div className="w-full flex flex-col md:flex-row gap-8 relative z-10">
                {/* Clues */}
                <div className="flex-1 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                    <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs border-b border-white/10 pb-2">Clues</h4>
                    <ul className="space-y-3">
                        {data.clues.map((clue, i) => (
                            <li key={i} className="text-neutral-300 text-sm flex gap-3">
                                <span className="text-accent-glow font-bold">{i + 1}.</span>
                                {clue}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Grid */}
                <div className="flex-1 flex justify-center">
                    <div className="bg-surface-100 p-4 rounded-xl border border-white/10 shadow-lg">
                        <div className="grid grid-cols-4 gap-1">
                            <div /> {/* Empty corner */}
                            {data.categories[1].map((cat, i) => (
                                <div key={i} className="text-xs text-neutral-400 font-medium rotate-45 origin-bottom-left translate-x-4 mb-2">
                                    {cat}
                                </div>
                            ))}

                            {data.categories[0].map((cat, r) => (
                                <>
                                    <div key={r} className="text-xs text-neutral-300 font-medium flex items-center justify-end pr-2">
                                        {cat}
                                    </div>
                                    {Array(3).fill(null).map((_, c) => (
                                        <button
                                            key={`${r}-${c}`}
                                            onClick={() => toggleCell(r, c)}
                                            disabled={disabled}
                                            className={`
                                                w-10 h-10 border border-white/10 flex items-center justify-center transition-all duration-200
                                                ${grid[r][c] === true ? 'bg-accent/20 text-accent-glow font-bold text-lg' : ''}
                                                ${grid[r][c] === false ? 'bg-black/20 text-neutral-600' : ''}
                                                ${!disabled ? 'hover:bg-white/5' : ''}
                                            `}
                                        >
                                            {grid[r][c] === true ? 'O' : grid[r][c] === false ? 'X' : ''}
                                        </button>
                                    ))}
                                </>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


