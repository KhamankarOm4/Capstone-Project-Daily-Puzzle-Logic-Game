import { MiniSudokuEngine } from './MiniSudoku';
import { PatternSequenceEngine } from './PatternSequence';
import { DeductionGridEngine } from './DeductionGrid';
import { NumberSequenceEngine } from './NumberSequence';
import { BinaryGridEngine } from './BinaryGrid';
import { ConstraintPathEngine } from './ConstraintPathPuzzle';
import { LogicOperatorsEngine } from './LogicOperatorsPuzzle';
import { RotatingPatternEngine } from './RotatingPatternPuzzle';
import { WeightedSudokuEngine } from './WeightedSudoku';

export const puzzleEngines = {
    miniSudoku: MiniSudokuEngine,
    patternSequence: PatternSequenceEngine,
    deductionGrid: DeductionGridEngine,
    numberSequence: NumberSequenceEngine,
    binaryGrid: BinaryGridEngine,
    constraintPath: ConstraintPathEngine,
    logicOperators: LogicOperatorsEngine,
    rotatingPattern: RotatingPatternEngine,
    weightedSudoku: WeightedSudokuEngine
};

export type PuzzleType = keyof typeof puzzleEngines;

// Select puzzle based on seed
export const selectPuzzleForDay = (seed: string): PuzzleType => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const types: PuzzleType[] = [
        'miniSudoku',
        'patternSequence',
        'deductionGrid',
        'numberSequence',
        'binaryGrid',
        'constraintPath',
        'logicOperators',
        'rotatingPattern',
        'weightedSudoku'
    ];
    return types[seedNum % types.length];
};

export const getPuzzleEngine = (type: PuzzleType) => puzzleEngines[type];
