"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberSequenceEngine = void 0;
const PuzzleEngine_1 = require("../PuzzleEngine");
const generateNumberSequence = (seed) => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const types = ['fibonacci', 'squares', 'primes', 'powers-of-2'];
    const seqType = types[seedNum % types.length];
    let sequence = [];
    let nextNumber = 0;
    let description = '';
    switch (seqType) {
        case 'fibonacci':
            const start = (seedNum % 5) + 1;
            sequence = [start, start + 1];
            for (let i = 0; i < 4; i++) {
                sequence.push(sequence[sequence.length - 1] + sequence[sequence.length - 2]);
            }
            nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
            description = 'Each number is the sum of the previous two';
            break;
        case 'squares':
            const offset = (seedNum % 3) + 1;
            sequence = Array.from({ length: 6 }, (_, i) => Math.pow(i + offset, 2));
            nextNumber = Math.pow(sequence.length + offset, 2);
            description = 'Perfect squares';
            break;
        case 'primes':
            const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
            const startIdx = seedNum % 3;
            sequence = primes.slice(startIdx, startIdx + 6);
            nextNumber = primes[startIdx + 6];
            description = 'Prime numbers';
            break;
        case 'powers-of-2':
            const exp = (seedNum % 3) + 1;
            sequence = Array.from({ length: 6 }, (_, i) => Math.pow(2, i + exp));
            nextNumber = Math.pow(2, sequence.length + exp);
            description = 'Powers of 2';
            break;
    }
    return { sequence, nextNumber, type: seqType, description };
};
exports.NumberSequenceEngine = {
    async generate(seed) {
        const { sequence, nextNumber, type, description } = generateNumberSequence(seed);
        return {
            id: `number-seq-${seed}`,
            seed,
            data: {
                sequence,
                sequenceType: type,
                description
            },
            solution: { nextNumber }
        };
    },
    validate: (userInput, solution) => {
        return userInput === solution.nextNumber;
    },
    getHint: (solution, _currentInput) => {
        return `The answer is ${solution.nextNumber}`;
    },
    calculateDifficulty: (_data) => {
        return 2;
    },
    calculateScore: PuzzleEngine_1.defaultCalculateScore
};
