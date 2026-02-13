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
            <div className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-bold">Deduction Grid</h3>
                <p className="text-sm text-gray-600">Match each person to their item using the clues</p>

                <div className="bg-blue-50 p-3 rounded-lg mb-2">
                    <p className="font-semibold text-sm mb-1">Clues:</p>
                    {data.clues.map((clue, i) => (
                        <p key={i} className="text-sm">• {clue}</p>
                    ))}
                </div>

                <div className="inline-block border-2 border-gray-800">
                    <div className="grid grid-cols-4 gap-0">
                        <div className="w-24 h-12"></div>
                        {data.categories.cols.map((col, i) => (
                            <div key={i} className="w-16 h-12 flex items-center justify-center text-xs font-bold bg-gray-200 border border-gray-400">
                                {col}
                            </div>
                        ))}

                        {grid.map((row, i) => (
                            <>
                                <div key={`row-${i}`} className="w-24 h-16 flex items-center justify-center text-xs font-bold bg-gray-200 border border-gray-400">
                                    {data.categories.rows[i]}
                                </div>
                                {row.map((cell, j) => (
                                    <button
                                        key={`${i}-${j}`}
                                        onClick={() => handleCellClick(i, j)}
                                        disabled={disabled}
                                        className="w-16 h-16 flex items-center justify-center text-2xl font-bold border border-gray-300 hover:bg-gray-50 transition-colors"
                                    >
                                        {cell === 'X' && <span className="text-green-600">✓</span>}
                                        {cell === 'O' && <span className="text-red-600">✗</span>}
                                    </button>
                                ))}
                            </>
                        ))}
                    </div>
                </div>
                <p className="text-xs text-gray-500">Click cells to mark: ✓ (match) or ✗ (no match)</p>
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
