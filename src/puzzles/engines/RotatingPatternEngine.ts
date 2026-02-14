import { type PuzzleLogic, type PuzzleInstance } from '../PuzzleEngine';
import { defaultCalculateScore } from '../../utils/scoring';

// Types
export type ShapeType = 'triangle' | 'square' | 'pentagon' | 'circle' | 'star';
export type Color = 'red' | 'blue' | 'green' | 'yellow' | 'purple';

export interface Shape {
    type: ShapeType;
    color: Color;
    rotation: number; // degrees
}

export interface RotatingPatternData {
    sequence: Shape[]; // 3 items
    options: Shape[]; // 4 items (1 correct)
    ruleDescription: string; // Optional debug/hint
}

export interface RotatingPatternSolution {
    correctOptionIndex: number;
}

export type RotatingPatternInput = number | null; // Index of selected option

// Assets / Constants
const COLORS: Color[] = ['red', 'blue', 'green', 'yellow', 'purple'];
const SHAPES: ShapeType[] = ['triangle', 'square', 'pentagon', 'circle', 'star'];

// Helper: Apply transformation
const transformShape = (shape: Shape, rule: { rot: number, colorShift: number }): Shape => {
    const colorIdx = COLORS.indexOf(shape.color);
    const newColorIdx = (colorIdx + rule.colorShift) % COLORS.length;
    return {
        type: shape.type,
        color: COLORS[newColorIdx],
        rotation: (shape.rotation + rule.rot) % 360
    };
};

// Generator
const generateRotatingPuzzle = (seed: string): { data: RotatingPatternData, solution: RotatingPatternSolution } => {
    const seedNum = parseInt(seed.substring(0, 8), 16);

    // 1. Base Shape
    const baseShape: Shape = {
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
    const sequence: Shape[] = [baseShape];
    for (let i = 0; i < 2; i++) {
        sequence.push(transformShape(sequence[sequence.length - 1], rule));
    }

    // 4. Generate Solution
    const correctShape = transformShape(sequence[sequence.length - 1], rule);

    // 5. Generate Distractors
    const options: Shape[] = [];
    const correctIdx = seedNum % 4;

    for (let i = 0; i < 4; i++) {
        if (i === correctIdx) {
            options.push(correctShape);
        } else {
            // Generate distractor
            // Error type: Wrong Rotation OR Wrong Color
            const errType = (seedNum + i) % 2;
            let distractor = { ...correctShape };

            if (errType === 0) {
                // Wrong Rotation
                distractor.rotation = (distractor.rotation + 90) % 360;
            } else {
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

export const RotatingPatternEngine: PuzzleLogic<RotatingPatternData, RotatingPatternSolution, RotatingPatternInput> = {
    async generate(seed: string): Promise<PuzzleInstance<RotatingPatternData, RotatingPatternSolution>> {
        const { data, solution } = generateRotatingPuzzle(seed);
        return {
            id: `rotating-pattern-${seed}`,
            seed,
            data,
            solution
        };
    },

    validate: (userInput: RotatingPatternInput, solution: RotatingPatternSolution): boolean => {
        return userInput === solution.correctOptionIndex;
    },

    getHint: (solution: RotatingPatternSolution, _currentInput: RotatingPatternInput): string | null => {
        return `The answer is Option ${String.fromCharCode(65 + solution.correctOptionIndex)}`;
    },

    calculateDifficulty: (_data: RotatingPatternData): number => {
        return 4;
    },

    calculateScore: defaultCalculateScore
};
