import { type PuzzleEngine } from './PuzzleEngine';
import { MiniSudokuEngine } from './MiniSudoku';
import { PatternSequenceEngine } from './PatternSequence';
import { DeductionGridEngine } from './DeductionGrid';
import { NumberSequenceEngine } from './NumberSequence';
import { BinaryGridEngine } from './BinaryGrid';
import { ConstraintPathEngine } from './ConstraintPathPuzzle';
import { LogicOperatorsEngine } from './LogicOperatorsPuzzle';
import { RotatingPatternEngine } from './RotatingPatternPuzzle';
import { WeightedSudokuEngine } from './WeightedSudoku';
import { GraphColoringEngine } from './GraphColoringPuzzle';
import { CryptarithmEngine } from './CryptarithmPuzzle';

export const puzzleEngines: Record<string, PuzzleEngine<any, any, any>> = {
    'mini-sudoku': MiniSudokuEngine,
    'pattern-sequence': PatternSequenceEngine,
    'deduction-grid': DeductionGridEngine,
    'number-sequence': NumberSequenceEngine,
    'binary-grid': BinaryGridEngine,
    'constraint-path': ConstraintPathEngine,
    'logic-operators': LogicOperatorsEngine,
    'rotating-pattern': RotatingPatternEngine,
    'weighted-sudoku': WeightedSudokuEngine,
    'graph-coloring': GraphColoringEngine,
    'cryptarithm': CryptarithmEngine
};

export type PuzzleType = keyof typeof puzzleEngines;

// Select puzzle based on seed
export const selectPuzzleForDay = (seed: string): PuzzleType => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const types: PuzzleType[] = [
        'mini-sudoku',
        'pattern-sequence',
        'deduction-grid',
        'number-sequence',
        'binary-grid',
        'constraint-path',
        'logic-operators',
        'rotating-pattern',
        'weighted-sudoku',
        'graph-coloring',
        'cryptarithm'
    ];
    return types[seedNum % types.length];
};

export const getPuzzleEngine = (type: PuzzleType) => puzzleEngines[type];
