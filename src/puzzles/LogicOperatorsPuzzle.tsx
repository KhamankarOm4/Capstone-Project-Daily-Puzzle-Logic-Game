import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type LogicOperatorsData, type LogicOperatorsSolution, type LogicOperatorsInput } from './engines/LogicOperatorsEngine';

export const LogicOperatorsRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<LogicOperatorsData, LogicOperatorsSolution, LogicOperatorsInput>) => {
    const [grid, setGrid] = useState<LogicOperatorsInput>(
        Array(3).fill(null).map(() => Array(3).fill(null))
    );

    // Hint handling
    useEffect(() => {
        if (hintTrigger > 0) {
            // Fill a random incorrect or empty cell
            const targets: { r: number, c: number }[] = [];
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    if (grid[r][c] === null || grid[r][c] !== solution.grid[r][c]) {
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

    const toggleCell = (r: number, c: number) => {
        if (disabled) return;
        const newGrid = grid.map(row => [...row]);
        const val = newGrid[r][c];
        if (val === null) newGrid[r][c] = 0;
        else if (val === 0) newGrid[r][c] = 1;
        else newGrid[r][c] = null;
        setGrid(newGrid);
        onInput(newGrid);
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-8xl font-black text-white">&</span>
            </div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter">Logic <span className="text-accent-glow">Operators</span></h3>
                <p className="text-neutral-300 text-sm font-medium">Assign 0 or 1 to satisfy the gates.</p>
            </div>

            {/* Final Layout Attempt: Explicit Grid */}
            <div className="bg-black/20 p-8 rounded-2xl border border-white/5 backdrop-blur-sm relative z-10">
                <div className="flex flex-col gap-1">
                    {Array.from({ length: 3 }).map((_, r) => (
                        <div key={`row-group-${r}`} className="flex flex-col gap-1">
                            <div className="flex items-center gap-1">
                                {Array.from({ length: 3 }).map((_, c) => (
                                    <div key={`cell-group-${r}-${c}`} className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleCell(r, c)}
                                            disabled={disabled}
                                            className={`
                                                    w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg border transition-all duration-200
                                                    ${grid[r][c] === 0 ? 'bg-red-500/10 text-red-400 border-red-500/30' : ''}
                                                    ${grid[r][c] === 1 ? 'bg-green-500/10 text-green-400 border-green-500/30' : ''}
                                                    ${grid[r][c] === null ? 'bg-white/5 border-white/10 hover:bg-white/10' : ''}
                                                `}
                                        >
                                            {grid[r][c] ?? ''}
                                        </button>

                                        {/* Horizontal Op */}
                                        {c < 2 && (
                                            <div className="w-8 flex justify-center">
                                                <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-1 rounded">
                                                    {data.rowOperators[r][c]}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Row Target */}
                                <div className="w-8 flex justify-center text-neutral-500">=</div>
                                <div className={`w-8 h-8 flex items-center justify-center rounded font-mono font-bold ${data.rowTargets[r] === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {data.rowTargets[r]}
                                </div>
                            </div>

                            {/* Vertical Ops Row */}
                            {r < 2 && (
                                <div className="flex items-center gap-1 h-8">
                                    {Array.from({ length: 3 }).map((_, c) => (
                                        <div key={`v-op-${r}-${c}`} className="flex items-center gap-1">
                                            <div className="w-12 flex justify-center">
                                                <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-1 rounded">
                                                    {data.colOperators[c][r]}
                                                </span>
                                            </div>
                                            {c < 2 && <div className="w-8"></div>} {/* Spacer for H-Op column */}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Column Targets Row */}
                    <div className="flex items-center gap-1 mt-2 border-t border-white/10 pt-2">
                        {Array.from({ length: 3 }).map((_, c) => (
                            <div key={`col-target-${c}`} className="flex items-center gap-1">
                                <div className="w-12 flex flex-col items-center gap-1">
                                    <div className="text-neutral-500 text-xs">||</div>
                                    <div className={`w-8 h-8 flex items-center justify-center rounded font-mono font-bold ${data.colTargets[c] === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {data.colTargets[c]}
                                    </div>
                                </div>
                                {c < 2 && <div className="w-8"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
