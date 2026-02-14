import { type PuzzleLogic, type PuzzleInstance, defaultCalculateScore } from '../PuzzleEngine';

// Types
export type Operator = 'AND' | 'OR' | 'XOR';
export type Bit = 0 | 1;

export interface LogicOperatorsData {
    initialGrid: (Bit | null)[][]; // Some might be pre-filled
    rowOperators: Operator[][]; // 3 rows, 2 ops each
    colOperators: Operator[][]; // 3 cols, 2 ops each
    rowTargets: Bit[];
    colTargets: Bit[];
}

export interface LogicOperatorsSolution {
    grid: Bit[][];
}

export type LogicOperatorsInput = (Bit | null)[][];

// Helper: Apply operator
const applyOp = (a: Bit, b: Bit, op: Operator): Bit => {
    switch (op) {
        case 'AND': return (a & b) as Bit;
        case 'OR': return (a | b) as Bit;
        case 'XOR': return (a ^ b) as Bit;
    }
};

// Helper: Calculate row/col result (Left-to-Right / Top-to-Bottom)
const calculateLine = (bits: Bit[], ops: Operator[]): Bit => {
    let result = bits[0];
    for (let i = 0; i < ops.length; i++) {
        result = applyOp(result, bits[i + 1], ops[i]);
    }
    return result;
};

// Generator
const generateLogicPuzzle = (seed: string): { data: LogicOperatorsData, solution: LogicOperatorsSolution } => {
    const seedNum = parseInt(seed.substring(0, 8), 16);

    // Generate Solution Grid randomly
    const solutionGrid: Bit[][] = [];
    for (let i = 0; i < 3; i++) {
        const row: Bit[] = [];
        for (let j = 0; j < 3; j++) {
            // Pseudorandom bit
            const val = (seedNum + i * 13 + j * 7 + i * j) % 2;
            row.push(val as Bit);
        }
        solutionGrid.push(row);
    }

    // Generate Operators
    const ops: Operator[] = ['AND', 'OR', 'XOR'];

    const rowOperators: Operator[][] = [];
    const colOperators: Operator[][] = [];

    // Rows
    for (let i = 0; i < 3; i++) {
        const rowOps: Operator[] = [];
        for (let j = 0; j < 2; j++) {
            const opIdx = (seedNum + i * 3 + j * 5) % 3;
            rowOps.push(ops[opIdx]);
        }
        rowOperators.push(rowOps);
    }

    // Cols
    for (let j = 0; j < 3; j++) {
        const colOps: Operator[] = [];
        for (let i = 0; i < 2; i++) {
            const opIdx = (seedNum + j * 7 + i * 11) % 3;
            colOps.push(ops[opIdx]);
        }
        colOperators.push(colOps);
    }

    // Calculate Targets
    const rowTargets: Bit[] = solutionGrid.map((row, i) => calculateLine(row, rowOperators[i]));
    const colTargets: Bit[] = [];
    for (let j = 0; j < 3; j++) {
        const col: Bit[] = [solutionGrid[0][j], solutionGrid[1][j], solutionGrid[2][j]];
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

export const LogicOperatorsEngine: PuzzleLogic<LogicOperatorsData, LogicOperatorsSolution, LogicOperatorsInput> = {
    async generate(seed: string): Promise<PuzzleInstance<LogicOperatorsData, LogicOperatorsSolution>> {
        const { data, solution } = generateLogicPuzzle(seed);
        return {
            id: `logic-ops-${seed}`,
            seed,
            data,
            solution
        };
    },

    validate: (userInput: LogicOperatorsInput, solution: LogicOperatorsSolution): boolean => {
        // For this MVP, let's enforce strict match to `solution.grid`.
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (userInput[r][c] !== solution.grid[r][c]) return false;
            }
        }
        return true;
    },

    getHint: (solution: LogicOperatorsSolution, currentInput: LogicOperatorsInput): string | null => {
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

    calculateDifficulty: (_data: LogicOperatorsData): number => {
        return 6;
    },

    calculateScore: defaultCalculateScore
};
