import { type PuzzleLogic, type PuzzleInstance } from '../PuzzleEngine';
import { defaultCalculateScore } from '../../utils/scoring';

export type SudokuGrid = (number | null)[][];

export interface MiniSudokuData {
    grid: SudokuGrid;
    initialGrid: SudokuGrid;
}

export interface MiniSudokuSolution {
    grid: SudokuGrid;
}

export type MiniSudokuInput = SudokuGrid;

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

export const MiniSudokuEngine: PuzzleLogic<MiniSudokuData, MiniSudokuSolution, MiniSudokuInput> = {
    async generate(seed: string): Promise<PuzzleInstance<MiniSudokuData, MiniSudokuSolution>> {
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

    validate: (userInput: MiniSudokuInput, solution: MiniSudokuSolution): boolean => {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (userInput[i][j] !== solution.grid[i][j]) return false;
            }
        }
        return true;
    },

    getHint: (solution: MiniSudokuSolution, currentInput: MiniSudokuInput): string | null => {
        // Find first empty or incorrect cell
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
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

    calculateDifficulty: (data: MiniSudokuData): number => {
        // Simple difficulty based on empty cells
        let emptyCount = 0;
        data.grid.forEach(row => row.forEach(cell => { if (cell === null) emptyCount++; }));
        return Math.floor(emptyCount / 2); // roughly 1-4
    },

    calculateScore: defaultCalculateScore
};
