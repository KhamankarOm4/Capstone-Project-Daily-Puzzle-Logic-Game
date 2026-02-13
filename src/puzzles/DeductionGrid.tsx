import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine';

type GridCell = 'X' | 'O' | null;
type DeductionGridType = GridCell[][];

interface DeductionData {
    grid: DeductionGridType;
    clues: string[];
    categories: { rows: string[]; cols: string[] };
}

interface DeductionSolution {
    grid: DeductionGridType;
}

type DeductionInput = DeductionGridType;

// Generate a simple 3x3 logic grid puzzle
const generateLogicGrid = (seed: string): { grid: DeductionGridType; clues: string[] } => {
    const seedNum = parseInt(seed.substring(0, 8), 16);

    // Create solution grid (3x3)
    const grid: DeductionGridType = Array(3).fill(null).map(() => Array(3).fill(null));

    // Set correct matches (one X per row and column)
    const matches = [
        (seedNum % 3),
        ((seedNum + 1) % 3),
        ((seedNum + 2) % 3)
    ];

    for (let i = 0; i < 3; i++) {
        grid[i][matches[i]] = 'X';
        for (let j = 0; j < 3; j++) {
            if (j !== matches[i]) {
                grid[i][j] = 'O';
            }
        }
    }

    // Generate clues
    const clues = [
        `Person ${matches[0] + 1} likes Item A`,
        `Person ${matches[1] + 1} likes Item B`,
        `Person ${matches[2] + 1} likes Item C`
    ];

    return { grid, clues };
};

export const DeductionGridEngine: PuzzleEngine<DeductionData, DeductionSolution, DeductionInput> = {
    async generatePuzzle(seed: string): Promise<PuzzleInstance<DeductionData, DeductionSolution>> {
        const { grid, clues } = generateLogicGrid(seed);
        const emptyGrid: DeductionGridType = Array(3).fill(null).map(() => Array(3).fill(null));

        return {
            id: `deduction-${seed}`,
            seed,
            data: {
                grid: emptyGrid,
                clues,
                categories: {
                    rows: ['Person 1', 'Person 2', 'Person 3'],
                    cols: ['Item A', 'Item B', 'Item C']
                }
            },
            solution: { grid }
        };
    },

    PuzzleComponent: ({ data, onInput, disabled, solution, hintTrigger }) => {
        const [grid, setGrid] = useState<DeductionGridType>(data.grid.map(row => [...row]));

        useEffect(() => {
            if (hintTrigger > 0) {
                // Find a cell that differs from solution?
                // Deduction solution: { grid: ... }
                // Find a null cell in current grid
                const emptyCells: { r: number, c: number }[] = [];
                grid.forEach((row, r) => {
                    row.forEach((cell, c) => {
                        if (cell === null) emptyCells.push({ r, c });
                    });
                });

                if (emptyCells.length > 0) {
                    const idx = Math.floor(Math.random() * emptyCells.length);
                    const { r, c } = emptyCells[idx];
                    const correctVal = solution.grid[r][c];

                    const newGrid = grid.map(row => [...row]);
                    newGrid[r][c] = correctVal;
                    setGrid(newGrid);
                    onInput(newGrid);
                }
            }
        }, [hintTrigger, grid, onInput, solution]);

        const handleCellClick = (row: number, col: number) => {
            if (disabled) return;

            const newGrid = grid.map(r => [...r]);
            // Cycle through: null -> X -> O -> null
            if (newGrid[row][col] === null) newGrid[row][col] = 'X';
            else if (newGrid[row][col] === 'X') newGrid[row][col] = 'O';
            else newGrid[row][col] = null;

            setGrid(newGrid);
            onInput(newGrid);
        };

        return (
            <div className="flex flex-col items-center gap-8 w-full max-w-2xl mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-8xl font-black text-white">L</span>
                </div>

                <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-3xl font-black text-white tracking-tighter">Logic <span className="text-accent-glow">Grid</span></h3>
                    <p className="text-neutral-300 text-sm font-medium">Use clues to find matches. Click to toggle.</p>
                </div>

                <div className="w-full bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm relative z-10">
                    <h4 className="font-bold text-accent-cyan mb-4 text-xs uppercase tracking-widest flex items-center gap-2">
                        <span className="w-1 h-4 bg-accent-cyan rounded-full"></span>
                        Intel / Clues
                    </h4>
                    <ul className="space-y-3 text-sm text-neutral-300">
                        {data.clues.map((clue, i) => (
                            <li key={i} className="flex items-start gap-3 bg-white/5 p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                                <span className="text-accent-cyan font-bold">•</span>
                                <span className="font-medium tracking-wide">{clue}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="overflow-x-auto max-w-full p-2 relative z-10">
                    <div className="inline-grid grid-cols-4 gap-1.5 p-3 bg-black/40 rounded-2xl border border-white/10 shadow-inner backdrop-blur-md">
                        {/* Empty Corner */}
                        <div className="w-20 h-10 md:w-24 md:h-12"></div>

                        {/* Column Headers */}
                        {data.categories.cols.map((col, i) => (
                            <div key={i} className="w-16 h-10 md:w-20 md:h-12 flex items-center justify-center text-[10px] md:text-xs font-bold text-neutral-300 bg-white/5 rounded-lg border border-white/5 uppercase tracking-wide">
                                {col}
                            </div>
                        ))}

                        {/* Rows */}
                        {grid.map((row, i) => (
                            <>
                                {/* Row Header */}
                                <div key={`row-${i}`} className="w-20 h-14 md:w-24 md:h-16 flex items-center justify-center text-[10px] md:text-xs font-bold text-neutral-300 bg-white/5 rounded-lg border border-white/5 px-2 text-center uppercase tracking-wide">
                                    {data.categories.rows[i]}
                                </div>

                                {/* Cells */}
                                {row.map((cell, j) => (
                                    <button
                                        key={`${i}-${j}`}
                                        onClick={() => handleCellClick(i, j)}
                                        disabled={disabled}
                                        className={`w-16 h-14 md:w-20 md:h-16 flex items-center justify-center text-2xl font-bold rounded-xl border transition-all duration-200
                                            ${cell === 'X'
                                                ? 'bg-red-500/10 border-red-500/30 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                                : cell === 'O'
                                                    ? 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'}
                                            ${!disabled && 'hover:scale-105 active:scale-95 focus:outline-none focus:ring-0'}
                                        `}
                                    >
                                        {cell === 'X' && '✗'}
                                        {cell === 'O' && '✓'}
                                    </button>
                                ))}
                            </>
                        ))}
                    </div>
                </div>

                <div className="flex gap-6 text-xs text-neutral-400 font-medium uppercase tracking-wider bg-black/20 px-6 py-2 rounded-full border border-white/5">
                    <span className="flex items-center gap-2"><span className="text-red-400 font-bold text-base">✗</span> False</span>
                    <span className="flex items-center gap-2"><span className="text-accent-cyan font-bold text-base">✓</span> True</span>
                </div>
            </div>
        );
    },

    validateSolution(userInput: DeductionInput, solution: DeductionSolution): boolean {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (userInput[i][j] !== solution.grid[i][j]) return false;
            }
        }
        return true;
    },

    calculateScore: defaultCalculateScore
};
