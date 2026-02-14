import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type WeightedSudokuData, type WeightedSudokuSolution, type WeightedSudokuInput } from './engines/WeightedSudokuEngine';

export const WeightedSudokuRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<WeightedSudokuData, WeightedSudokuSolution, WeightedSudokuInput>) => {
    const [grid, setGrid] = useState<WeightedSudokuInput>(data.initialGrid);

    useEffect(() => {
        if (hintTrigger > 0) {
            // Fill a random cell
            const targets: { r: number, c: number }[] = [];
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    if (grid[r][c] !== solution.grid[r][c]) {
                        targets.push({ r, c });
                    }
                }
            }
            if (targets.length > 0) {
                const idx = Math.floor(Math.random() * targets.length);
                const { r, c } = targets[idx];
                const newGrid = grid.map(row => [...row]);
                newGrid[r][c] = solution.grid[r][c];
                setGrid(newGrid);
                onInput(newGrid);
            }
        }
    }, [hintTrigger, onInput, solution, grid]);

    const handleCellClick = (r: number, c: number) => {
        if (disabled) return;
        if (data.initialGrid[r][c] !== 0) return; // Locked

        const newGrid = grid.map(row => [...row]);
        let val = newGrid[r][c];
        // Cycle 0 -> 1 -> 2 -> 3 -> 4 -> 0
        val = (val % 4) + 1;

        newGrid[r][c] = val;
        setGrid(newGrid);
        onInput(newGrid);
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-8xl font-black text-white">#</span>
            </div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter">Weighted <span className="text-accent-glow">Sudoku</span></h3>
                <p className="text-neutral-300 text-sm font-medium">Standard Sudoku rules + Row/Col Weighted Sums.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 w-full relative z-10">
                {/* Weights Legend */}
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 h-fit">
                    <h4 className="text-neutral-400 text-xs font-bold uppercase tracking-wider mb-3">Weights</h4>
                    <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                        {[1, 2, 3, 4].map(n => (
                            <div key={n} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg">
                                <div className="w-8 h-8 flex items-center justify-center font-bold text-lg bg-accent/20 text-accent-glow rounded">
                                    {n}
                                </div>
                                <span className="text-neutral-500 text-sm">=</span>
                                <span className="text-white font-mono font-bold">{data.weights[n]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Area */}
                <div className="flex-1 flex flex-col items-center">
                    <div className="grid gap-1 bg-black/40 p-2 rounded-xl border border-white/10"
                        style={{ gridTemplateColumns: 'repeat(5, min-content)' }}>
                        {/* Top Header (Col Targets) */}
                        <div className="w-12 h-12"></div> {/* Corner */}
                        {data.colTargets.map((t, i) => (
                            <div key={`col-t-${i}`} className="w-14 h-10 flex items-end justify-center pb-2 text-xs font-mono font-bold text-accent-cyan">
                                {t}
                            </div>
                        ))}

                        {/* Rows */}
                        {grid.map((row, r) => (
                            <>
                                {/* Row Target */}
                                <div key={`row-t-${r}`} className="w-12 h-14 flex items-center justify-end pr-2 text-xs font-mono font-bold text-accent-cyan">
                                    {data.rowTargets[r]}
                                </div>

                                {/* Cells */}
                                {row.map((val, c) => {
                                    const isInitial = data.initialGrid[r][c] !== 0;
                                    // 2x2 Box styling
                                    const isRightBorder = c === 1;
                                    const isBottomBorder = r === 1;

                                    return (
                                        <button
                                            key={`${r}-${c}`}
                                            onClick={() => handleCellClick(r, c)}
                                            disabled={disabled || isInitial}
                                            className={`
                                                    w-14 h-14 flex items-center justify-center text-2xl font-bold transition-all duration-200
                                                    ${isInitial ? 'text-white/50 cursor-not-allowed' : 'text-white hover:bg-white/10'}
                                                    ${val !== 0 ? 'bg-white/5' : 'bg-transparent'}
                                                    ${isRightBorder ? 'border-r-2 border-white/20' : 'border-r border-white/5'}
                                                    ${isBottomBorder ? 'border-b-2 border-white/20' : 'border-b border-white/5'}
                                                    ${c === 0 ? 'border-l border-white/5' : ''}
                                                    ${r === 0 ? 'border-t border-white/5' : ''}
                                                `}
                                        >
                                            {val !== 0 ? val : ''}
                                        </button>
                                    );
                                })}
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
