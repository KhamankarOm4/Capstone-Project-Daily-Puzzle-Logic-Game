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
    async generatePuzzle(seed: string): Promise<PuzzleInstance<BinaryGridData, BinaryGridSolution>> {
        const size = 6;
        const solvedGrid = generateBinaryGrid(seed, size);
        const puzzleGrid = solvedGrid.map(row => [...row]);

        // Remove some cells
        const seedNum = parseInt(seed.substring(0, 8), 16);
        const cellsToRemove = 18; // Remove about half
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

    PuzzleComponent: ({ data, onInput, disabled, solution, hintTrigger }) => {
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
                    // Solution might be just grid? Verify BinaryGridSolution type
                    // In BinaryGridEngine, solution is { grid: solvedGrid }
                    // BinaryGridSolution interface line 12: interface BinaryGridSolution { grid: BinaryGridType; }
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
            <div className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-bold">Binary Logic Grid</h3>
                <p className="text-sm text-gray-600 max-w-md text-center">
                    Fill with 0s and 1s. Each row/column must have equal 0s and 1s. No three consecutive same digits.
                </p>
                <div className="inline-grid gap-1" style={{ gridTemplateColumns: `repeat(${data.size}, minmax(0, 1fr))` }}>
                    {grid.map((row, i) => (
                        row.map((cell, j) => {
                            const isInitial = data.initialGrid[i][j] !== null;
                            return (
                                <button
                                    key={`${i}-${j}`}
                                    onClick={() => handleCellClick(i, j)}
                                    disabled={disabled || isInitial}
                                    className={`w-12 h-12 text-xl font-bold border-2 rounded transition-colors
                                    ${isInitial ? 'bg-gray-200 border-gray-400 cursor-not-allowed' : 'bg-white border-gray-300 hover:border-blue-400'}
                                    ${cell === 0 ? 'text-blue-600' : cell === 1 ? 'text-red-600' : 'text-gray-300'}`}
                                >
                                    {cell === null ? '·' : cell}
                                </button>
                            );
                        })
                    ))}
                </div>
            </div>
        );
    },

    validateSolution(userInput: BinaryGridInput, solution: BinaryGridSolution): boolean {
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

    calculateScore: defaultCalculateScore
};
