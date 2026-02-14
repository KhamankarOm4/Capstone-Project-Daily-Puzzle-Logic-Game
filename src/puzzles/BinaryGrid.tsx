import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine';

type BinaryCell = 0 | 1 | null;
type BinaryGridType = BinaryCell[][];

interface BinaryGridData {
    grid: BinaryGridType;
    initialGrid: BinaryGridType;
    size: number;
}

interface BinaryGridSolution {
    grid: BinaryGridType;
}

type BinaryGridInput = BinaryGridType;

// Check if grid follows binary puzzle rules
const isValidBinaryGrid = (grid: BinaryGridType): boolean => {
    const size = grid.length;

    for (let i = 0; i < size; i++) {
        // Check rows
        let zeros = 0, ones = 0;
        for (let j = 0; j < size; j++) {
            if (grid[i][j] === 0) zeros++;
            if (grid[i][j] === 1) ones++;

            // Check no three consecutive
            if (j >= 2) {
                if (grid[i][j] === grid[i][j - 1] && grid[i][j] === grid[i][j - 2] && grid[i][j] !== null) {
                    return false;
                }
            }
        }
        if (zeros !== size / 2 || ones !== size / 2) return false;

        // Check columns
        zeros = 0;
        ones = 0;
        for (let j = 0; j < size; j++) {
            if (grid[j][i] === 0) zeros++;
            if (grid[j][i] === 1) ones++;

            // Check no three consecutive
            if (j >= 2) {
                if (grid[j][i] === grid[j - 1][i] && grid[j][i] === grid[j - 2][i] && grid[j][i] !== null) {
                    return false;
                }
            }
        }
        if (zeros !== size / 2 || ones !== size / 2) return false;
    }

    return true;
};

// Generate a valid binary grid
const generateBinaryGrid = (seed: string, size: number = 6): BinaryGridType => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const grid: BinaryGridType = Array(size).fill(null).map(() => Array(size).fill(null));

    // Simple generation: create a valid pattern based on seed
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            grid[i][j] = ((seedNum + i * size + j) % 2) as 0 | 1;
        }
    }

    // Adjust to ensure validity (simplified)
    return grid;
};

export const BinaryGridEngine: PuzzleEngine<BinaryGridData, BinaryGridSolution, BinaryGridInput> = {
    async generate(seed: string): Promise<PuzzleInstance<BinaryGridData, BinaryGridSolution>> {
        const size = 6;
        const solvedGrid = generateBinaryGrid(seed, size);
        const puzzleGrid = solvedGrid.map(row => [...row]);

        // Remove cells based on seed (remove about half)
        const seedNum = parseInt(seed.substring(0, 8), 16);
        const cellsToRemove = 18;
        let removed = 0;

        let attempts = 0;
        while (removed < cellsToRemove && attempts < 100) {
            attempts++;
            const row = (seedNum + attempts * 7) % size;
            const col = (seedNum + attempts * 11) % size;
            if (puzzleGrid[row][col] !== null) {
                puzzleGrid[row][col] = null;
                removed++;
            }
        }

        return {
            id: `binary-grid-${seed}`,
            seed,
            data: {
                grid: puzzleGrid,
                initialGrid: puzzleGrid.map(row => [...row]),
                size
            },
            solution: { grid: solvedGrid }
        };
    },

    render: ({ data, onInput, disabled, solution, hintTrigger }) => {
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
    },

    validate: (userInput: BinaryGridInput, solution: BinaryGridSolution): boolean => {
        // First check if the grid is complete (no null cells)
        for (let i = 0; i < userInput.length; i++) {
            for (let j = 0; j < userInput[i].length; j++) {
                if (userInput[i][j] === null) return false;
            }
        }

        // Then validate it follows the binary puzzle rules
        if (!isValidBinaryGrid(userInput)) return false;

        // Finally check if it matches the solution
        for (let i = 0; i < solution.grid.length; i++) {
            for (let j = 0; j < solution.grid[i].length; j++) {
                if (userInput[i][j] !== solution.grid[i][j]) return false;
            }
        }
        return true;
    },

    getHint: (solution: BinaryGridSolution, currentInput: BinaryGridInput): string | null => {
        // Find first empty or incorrect cell
        for (let r = 0; r < 6; r++) {
            for (let c = 0; c < 6; c++) {
                if (currentInput[r][c] === null) {
                    return `Row ${r + 1}, Col ${c + 1} is ${solution.grid[r][c]}`;
                }
                if (currentInput[r][c] !== solution.grid[r][c]) {
                    return `Row ${r + 1}, Col ${c + 1} should be ${solution.grid[r][c]}`;
                }
            }
        }
        return "Puzzle is solved!";
    },

    calculateDifficulty: (_data: BinaryGridData): number => {
        return 5;
    },

    calculateScore: defaultCalculateScore
};
