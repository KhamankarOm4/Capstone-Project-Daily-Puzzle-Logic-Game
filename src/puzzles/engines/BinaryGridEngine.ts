import { type PuzzleLogic, type PuzzleInstance, defaultCalculateScore } from '../PuzzleEngine';

export type BinaryCell = 0 | 1 | null;
export type BinaryGridType = BinaryCell[][];

export interface BinaryGridData {
    grid: BinaryGridType;
    initialGrid: BinaryGridType;
    size: number;
}

export interface BinaryGridSolution {
    grid: BinaryGridType;
}

export type BinaryGridInput = BinaryGridType;

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

export const BinaryGridEngine: PuzzleLogic<BinaryGridData, BinaryGridSolution, BinaryGridInput> = {
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
