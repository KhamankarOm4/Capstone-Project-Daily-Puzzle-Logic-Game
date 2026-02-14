"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RotatingPatternEngine = void 0;
const PuzzleEngine_1 = require("../PuzzleEngine");
// Assets / Constants
const COLORS = ['red', 'blue', 'green', 'yellow', 'purple'];
const SHAPES = ['triangle', 'square', 'pentagon', 'circle', 'star'];
// Helper: Apply transformation
const transformShape = (shape, rule) => {
    const colorIdx = COLORS.indexOf(shape.color);
    const newColorIdx = (colorIdx + rule.colorShift) % COLORS.length;
    return {
        type: shape.type,
        color: COLORS[newColorIdx],
        rotation: (shape.rotation + rule.rot) % 360
    };
};
// Generator
const generateRotatingPuzzle = (seed) => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    // 1. Base Shape
    const baseShape = {
        type: SHAPES[seedNum % SHAPES.length],
        color: COLORS[(seedNum + 2) % COLORS.length],
        rotation: (seedNum * 15) % 360
    };
    // 2. Rule
    const rotOptions = [45, 90, -45, -90, 180];
    const rotRule = rotOptions[(seedNum % rotOptions.length)];
    const colorRule = (seedNum % 3) === 0 ? 1 : 0; // 33% chance of color shift
    const rule = { rot: rotRule, colorShift: colorRule };
    // 3. Generate Sequence
    const sequence = [baseShape];
    for (let i = 0; i < 2; i++) {
        sequence.push(transformShape(sequence[sequence.length - 1], rule));
    }
    // 4. Generate Solution
    const correctShape = transformShape(sequence[sequence.length - 1], rule);
    // 5. Generate Distractors
    const options = [];
    const correctIdx = seedNum % 4;
    for (let i = 0; i < 4; i++) {
        if (i === correctIdx) {
            options.push(correctShape);
        }
        else {
            // Generate distractor
            // Error type: Wrong Rotation OR Wrong Color
            const errType = (seedNum + i) % 2;
            let distractor = { ...correctShape };
            if (errType === 0) {
                // Wrong Rotation
                distractor.rotation = (distractor.rotation + 90) % 360;
            }
            else {
                // Wrong Color
                const cIdx = COLORS.indexOf(distractor.color);
                distractor.color = COLORS[(cIdx + 1) % COLORS.length];
            }
            options.push(distractor);
        }
    }
    return {
        data: {
            sequence,
            options,
            ruleDescription: `Rotate ${rotRule}°, Color Shift ${colorRule}`
        },
        solution: { correctOptionIndex: correctIdx }
    };
};
exports.RotatingPatternEngine = {
    async generate(seed) {
        const { data, solution } = generateRotatingPuzzle(seed);
        return {
            id: `rotating-pattern-${seed}`,
            seed,
            data,
            solution
        };
    },
    validate: (userInput, solution) => {
        return userInput === solution.correctOptionIndex;
    },
    getHint: (solution, _currentInput) => {
        return `The answer is Option ${String.fromCharCode(65 + solution.correctOptionIndex)}`;
    },
    calculateDifficulty: (_data) => {
        return 4;
    },
    calculateScore: PuzzleEngine_1.defaultCalculateScore
};
