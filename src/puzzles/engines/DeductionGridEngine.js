"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeductionGridEngine = void 0;
const PuzzleEngine_1 = require("../PuzzleEngine");
// Helper to generate a logic puzzle
const generateDeductionPuzzle = (_seed) => {
    // Simplified generation logic
    const categories = [
        ['Alice', 'Bob', 'Charlie'],
        ['Red', 'Blue', 'Green'],
        ['Dog', 'Cat', 'Fish']
    ];
    // In a real implementation, we would generate a consistent scenario based on seed
    // For now, hardcode a simple scenario
    const clues = [
        "Alice doesn't have a Dog.",
        "The person with the Red shirt has a Cat.",
        "Bob is wearing Blue."
    ];
    // 0: Unchecked, 1: True, -1: False (mapped to boolean | null)
    // Let's us 3x3 grid for pairwise relationships?
    // Deduction grids are complex to represent. 
    // Let's assume a simple 3x3 grid mapping Category 1 to Category 2.
    const solutionGrid = [
        [null, true, null],
        [true, null, null],
        [null, null, true]
    ];
    return {
        data: {
            categories,
            clues,
            solution: []
        },
        solution: {
            grid: solutionGrid
        }
    };
};
exports.DeductionGridEngine = {
    async generate(seed) {
        const { data, solution } = generateDeductionPuzzle(seed);
        return {
            id: `deduction - ${seed} `,
            seed,
            data,
            solution
        };
    },
    validate: (userInput, solution) => {
        // Validate against solution grid
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                // If solution is TRUE, input must be TRUE.
                const solVal = solution.grid[r][c] === true; // Treat null as false?
                const inputVal = userInput[r][c] === true;
                if (solVal !== inputVal)
                    return false;
            }
        }
        return true;
    },
    getHint: (solution, currentInput) => {
        // Provide a hint about a mismatch
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (currentInput[r][c] === true && solution.grid[r][c] !== true) {
                    return "Check your 'O' placements.";
                }
            }
        }
        return "Keep looking at the clues!";
    },
    calculateDifficulty: (_data) => {
        return 4;
    },
    calculateScore: PuzzleEngine_1.defaultCalculateScore
};
