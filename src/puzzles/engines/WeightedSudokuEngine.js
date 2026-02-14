"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeightedSudokuEngine = void 0;
const PuzzleEngine_1 = require("../PuzzleEngine");
// Helper: Check if valid 4x4 Sudoku placement
const isValidPlacement = (grid, r, c, num) => {
    // Row & Col
    for (let i = 0; i < 4; i++) {
        if (grid[r][i] === num)
            return false;
        if (grid[i][c] === num)
            return false;
    }
    // 2x2 Box
    const startR = Math.floor(r / 2) * 2;
    const startC = Math.floor(c / 2) * 2;
    for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
            if (grid[startR + i][startC + j] === num)
                return false;
        }
    }
    return true;
};
// Helper: Solve/Generate Sudoku (Backtracking)
const solveSudoku = (grid) => {
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 4; c++) {
            if (grid[r][c] === 0) {
                // Try 1-4
                // Randomize order for variety
                const nums = [1, 2, 3, 4].sort(() => Math.random() - 0.5);
                for (const n of nums) {
                    if (isValidPlacement(grid, r, c, n)) {
                        grid[r][c] = n;
                        if (solveSudoku(grid))
                            return true;
                        grid[r][c] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
};
// Generator
const generateWeightedSudoku = (seed) => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    // 1. Generate Valid Grid
    // Seed the RNG (pseudorandom for determinism in real app, simplified here)
    // We'll trust the seed to generate distinct puzzles. 
    // Better: Just use a pre-solved grid and shuffle rows/cols within bands
    const baseGrid = [
        [1, 2, 3, 4],
        [3, 4, 1, 2],
        [2, 1, 4, 3],
        [4, 3, 2, 1]
    ];
    // Create mapping based on seed
    const map = [1, 2, 3, 4];
    // Shuffle map deterministically
    for (let i = 0; i < 4; i++) {
        const j = (seedNum + i * 7) % 4;
        [map[i], map[j]] = [map[j], map[i]];
    }
    const solutionGrid = baseGrid.map(row => row.map(n => map[n - 1]));
    // 2. Generate Weights
    const weights = {};
    for (let n = 1; n <= 4; n++) {
        weights[n] = (seedNum * n * 13 % 10) + 1; // 1 to 10
    }
    // 3. Calculate Targets
    const rowTargets = solutionGrid.map(row => row.reduce((sum, n) => sum + weights[n], 0));
    const colTargets = [];
    for (let c = 0; c < 4; c++) {
        let sum = 0;
        for (let r = 0; r < 4; r++)
            sum += weights[solutionGrid[r][c]];
        colTargets.push(sum);
    }
    // 4. Create Puzzle (remove numbers)
    // For 4x4, we can leave ~4-6 numbers?
    const puzzleGrid = solutionGrid.map(row => [...row]);
    let removed = 0;
    while (removed < 10) { // Leave 6
        const r = (seedNum * removed * 7) % 4;
        const c = (seedNum * removed * 11) % 4;
        if (puzzleGrid[r][c] !== 0) {
            puzzleGrid[r][c] = 0;
            removed++;
        }
        else {
            // simplified loop break logic for demo
            removed++;
        }
    }
    // Clean up randomness
    for (let r = 0; r < 4; r++)
        for (let c = 0; c < 4; c++) {
            if ((r + c + seedNum) % 3 === 0)
                puzzleGrid[r][c] = 0;
        }
    return {
        data: {
            initialGrid: puzzleGrid,
            weights,
            rowTargets,
            colTargets
        },
        solution: { grid: solutionGrid }
    };
};
exports.WeightedSudokuEngine = {
    async generate(seed) {
        const { data, solution } = generateWeightedSudoku(seed);
        return {
            id: `weighted-sudoku-${seed}`,
            seed,
            data,
            solution
        };
    },
    validate: (userInput, solution) => {
        // Strict match
        for (let r = 0; r < 4; r++)
            for (let c = 0; c < 4; c++) {
                if (userInput[r][c] !== solution.grid[r][c])
                    return false;
            }
        return true;
    },
    getHint: (_solution, _currentInput) => {
        return "Check your math and Sudoku rules!";
    },
    calculateDifficulty: (_data) => {
        return 5;
    },
    calculateScore: PuzzleEngine_1.defaultCalculateScore
};
