import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine';

type SudokuGrid = (number | null)[][];

interface MiniSudokuData {
    grid: SudokuGrid;
    initialGrid: SudokuGrid;
}

interface MiniSudokuSolution {
    grid: SudokuGrid;
}

type MiniSudokuInput = SudokuGrid;

// Helper to create empty 4x4 grid
const createEmptyGrid = (): SudokuGrid =>
    Array(4).fill(null).map(() => Array(4).fill(null));

// Validate if number can be placed at position
const isValid = (grid: SudokuGrid, row: number, col: number, num: number): boolean => {
    // Check row
    for (let x = 0; x < 4; x++) {
        if (grid[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 4; x++) {
        if (grid[x][col] === num) return false;
    }

    // Check 2x2 box
    const boxRow = Math.floor(row / 2) * 2;
    const boxCol = Math.floor(col / 2) * 2;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (grid[boxRow + i][boxCol + j] === num) return false;
        }
    }

    return true;
};

// Generate a valid solved sudoku
const generateSolvedGrid = (seed: string): SudokuGrid => {
    const grid = createEmptyGrid();
    const seedNum = parseInt(seed.substring(0, 8), 16);

    // Simple backtracking solver with seed-based randomization
    const solve = (row: number, col: number): boolean => {
        if (row === 4) return true;
        if (col === 4) return solve(row + 1, 0);

        const numbers = [1, 2, 3, 4];
        // Shuffle based on seed
        for (let i = numbers.length - 1; i > 0; i--) {
            const j = (seedNum + i + row * 4 + col) % (i + 1);
            [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
        }

        for (const num of numbers) {
            if (isValid(grid, row, col, num)) {
                grid[row][col] = num;
                if (solve(row, col + 1)) return true;
                grid[row][col] = null;
            }
        }
        return false;
    };

    solve(0, 0);
    return grid;
};

export const MiniSudokuEngine: PuzzleEngine<MiniSudokuData, MiniSudokuSolution, MiniSudokuInput> = {
    async generatePuzzle(seed: string): Promise<PuzzleInstance<MiniSudokuData, MiniSudokuSolution>> {
        const solvedGrid = generateSolvedGrid(seed);
        const puzzleGrid = solvedGrid.map(row => [...row]);

        // Remove cells based on seed (remove ~8 cells for medium difficulty)
        const seedNum = parseInt(seed.substring(0, 8), 16);
        const cellsToRemove = 8;
        let removed = 0;

        let attempts = 0;
        while (removed < cellsToRemove && attempts < 100) {
            attempts++;
            const row = (seedNum + attempts * 7) % 4;
            const col = (seedNum + attempts * 11) % 4;
            if (puzzleGrid[row][col] !== null) {
                puzzleGrid[row][col] = null;
                removed++;
            }
        }

        return {
            id: `mini-sudoku-${seed}`,
            seed,
            data: {
                grid: puzzleGrid,
                initialGrid: puzzleGrid.map(row => [...row])
            },
            solution: { grid: solvedGrid }
        };
    },

    PuzzleComponent: ({ data, onInput, disabled, solution, hintTrigger }) => {
        const [grid, setGrid] = useState<SudokuGrid>(data.grid.map(row => [...row]));

        // Handle hints
        useEffect(() => {
            if (hintTrigger > 0) {
                // Find all empty cells
                const emptyCells: { r: number, c: number }[] = [];
                grid.forEach((row, r) => {
                    row.forEach((cell, c) => {
                        if (cell === null) emptyCells.push({ r, c });
                    });
                });

                if (emptyCells.length > 0) {
                    // Pick random empty cell
                    const randomIdx = Math.floor(Math.random() * emptyCells.length);
                    const { r, c } = emptyCells[randomIdx];
                    const correctVal = solution.grid[r][c];

                    if (correctVal !== null) {
                        const newGrid = grid.map(row => [...row]);
                        newGrid[r][c] = correctVal;
                        setGrid(newGrid);
                        onInput(newGrid);
                    }
                }
            }
        }, [hintTrigger, grid, onInput, solution]);

        const handleChange = (row: number, col: number, value: string) => {
            if (data.initialGrid[row][col] !== null) return; // Can't change initial cells

            const newGrid = grid.map(r => [...r]);
            const num = value === '' ? null : parseInt(value);
            newGrid[row][col] = (num && num >= 1 && num <= 4) ? num : null;
            setGrid(newGrid);
            onInput(newGrid);
        };

        return (
            <div className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-bold text-white">Mini Sudoku (4×4)</h3>
                <p className="text-sm text-gray-400">Fill the grid so each row, column, and 2×2 box contains 1-4</p>
                <div className="inline-grid grid-cols-4 gap-0 border-2 border-slate-600 rounded-lg overflow-hidden shadow-2xl">
                    {grid.map((row, i) => (
                        row.map((cell, j) => {
                            const isInitial = data.initialGrid[i][j] !== null;
                            const isRightBorder = j === 1;
                            const isBottomBorder = i === 1;

                            return (
                                <input
                                    key={`${i}-${j}`}
                                    type="text"
                                    maxLength={1}
                                    value={cell || ''}
                                    onChange={(e) => handleChange(i, j, e.target.value)}
                                    disabled={disabled || isInitial}
                                    className={`w-14 h-14 md:w-16 md:h-16 text-center text-2xl font-bold transition-all duration-200
                                        ${isInitial
                                            ? 'bg-slate-700/50 text-blue-300'
                                            : 'bg-slate-800/80 text-white hover:bg-slate-700 focus:bg-slate-700'}
                                        ${isRightBorder ? 'border-r-2 border-r-slate-600' : 'border-r border-r-slate-700/50'}
                                        ${isBottomBorder ? 'border-b-2 border-b-slate-600' : 'border-b border-b-slate-700/50'}
                                        focus:outline-none focus:ring-0 focus:bg-slate-600`}
                                />
                            );
                        })
                    ))}
                </div>
            </div>
        );
    },

    validateSolution(userInput: MiniSudokuInput, solution: MiniSudokuSolution): boolean {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (userInput[i][j] !== solution.grid[i][j]) return false;
            }
        }
        return true;
    },

    calculateScore: defaultCalculateScore
};
