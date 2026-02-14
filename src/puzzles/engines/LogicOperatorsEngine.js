"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogicOperatorsEngine = void 0;
const PuzzleEngine_1 = require("../PuzzleEngine");
// Helper: Apply operator
const applyOp = (a, b, op) => {
    switch (op) {
        case 'AND': return (a & b);
        case 'OR': return (a | b);
        case 'XOR': return (a ^ b);
    }
};
// Helper: Calculate row/col result (Left-to-Right / Top-to-Bottom)
const calculateLine = (bits, ops) => {
    let result = bits[0];
    for (let i = 0; i < ops.length; i++) {
        result = applyOp(result, bits[i + 1], ops[i]);
    }
    return result;
};
// Generator
const generateLogicPuzzle = (seed) => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    // Generate Solution Grid randomly
    const solutionGrid = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            // Pseudorandom bit
            const val = (seedNum + i * 13 + j * 7 + i * j) % 2;
            row.push(val);
        }
        solutionGrid.push(row);
    }
    // Generate Operators
    const ops = ['AND', 'OR', 'XOR'];
    const rowOperators = [];
    const colOperators = [];
    // Rows
    for (let i = 0; i < 3; i++) {
        const rowOps = [];
        for (let j = 0; j < 2; j++) {
            const opIdx = (seedNum + i * 3 + j * 5) % 3;
            rowOps.push(ops[opIdx]);
        }
        rowOperators.push(rowOps);
    }
    // Cols
    for (let j = 0; j < 3; j++) {
        const colOps = [];
        for (let i = 0; i < 2; i++) {
            const opIdx = (seedNum + j * 7 + i * 11) % 3;
            colOps.push(ops[opIdx]);
        }
        colOperators.push(colOps);
    }
    // Calculate Targets
    const rowTargets = solutionGrid.map((row, i) => calculateLine(row, rowOperators[i]));
    const colTargets = [];
    for (let j = 0; j < 3; j++) {
        const col = [solutionGrid[0][j], solutionGrid[1][j], solutionGrid[2][j]];
        colTargets.push(calculateLine(col, colOperators[j]));
    }
    return {
        data: {
            initialGrid: Array(3).fill(null).map(() => Array(3).fill(null)),
            rowOperators,
            colOperators,
            rowTargets,
            colTargets
        },
        solution: { grid: solutionGrid }
    };
};
exports.LogicOperatorsEngine = {
    async generate(seed) {
        const { data, solution } = generateLogicPuzzle(seed);
        return {
            id: `logic-ops-${seed}`,
            seed,
            data,
            solution
        };
    },
    validate: (userInput, solution) => {
        // For this MVP, let's enforce strict match to `solution.grid`.
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (userInput[r][c] !== solution.grid[r][c])
                    return false;
            }
        }
        return true;
    },
    getHint: (solution, currentInput) => {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const val = currentInput[r][c];
                if (val !== null && val !== solution.grid[r][c]) {
                    return `Error at Row ${r + 1}, Col ${c + 1}`;
                }
            }
        }
        return "Fill in the empty cells.";
    },
    calculateDifficulty: (_data) => {
        return 6;
    },
    calculateScore: PuzzleEngine_1.defaultCalculateScore
};
