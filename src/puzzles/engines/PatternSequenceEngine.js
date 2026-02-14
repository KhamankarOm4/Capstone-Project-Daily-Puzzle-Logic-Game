"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PatternSequenceEngine = void 0;
const PuzzleEngine_1 = require("../PuzzleEngine");
// Generate different sequence types
const generateSequence = (seed, type) => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const start = (seedNum % 10) + 1;
    const diff = (seedNum % 5) + 2;
    switch (type) {
        case 'arithmetic':
            return Array.from({ length: 6 }, (_, i) => start + i * diff);
        case 'geometric':
            return Array.from({ length: 6 }, (_, i) => start * Math.pow(2, i));
        case 'fibonacci': {
            const fib = [start, start + diff];
            for (let i = 2; i < 6; i++) {
                fib.push(fib[i - 1] + fib[i - 2]);
            }
            return fib;
        }
        default:
            return [];
    }
};
exports.PatternSequenceEngine = {
    async generate(seed) {
        const seedNum = parseInt(seed.substring(0, 8), 16);
        const types = ['arithmetic', 'geometric', 'fibonacci'];
        const patternType = types[seedNum % types.length];
        const fullSequence = generateSequence(seed, patternType);
        const missingIndex = (seedNum % 4) + 1; // Remove element at index 1-4
        const answer = fullSequence[missingIndex];
        const displaySequence = [...fullSequence];
        displaySequence[missingIndex] = -1; // Placeholder for missing
        return {
            id: `pattern-${seed}`,
            seed,
            data: {
                sequence: displaySequence,
                missingIndex,
                pattern: patternType
            },
            solution: { answer }
        };
    },
    validate: (userInput, solution) => {
        return userInput === solution.answer;
    },
    getHint: (solution, _currentInput) => {
        return `The answer is ${solution.answer}`;
    },
    calculateDifficulty: (_data) => {
        return 3;
    },
    calculateScore: PuzzleEngine_1.defaultCalculateScore
};
