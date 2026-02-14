import { type PuzzleEngine } from './PuzzleEngine';
import { MiniSudokuEngine } from './engines/MiniSudokuEngine';

import { MiniSudokuRenderer } from './MiniSudoku';

// Batch 2
import { PatternSequenceEngine as PatternLogic } from './engines/PatternSequenceEngine';
import { PatternSequenceRenderer } from './PatternSequence';
import { DeductionGridEngine as DeductionLogic } from './engines/DeductionGridEngine';
import { DeductionGridRenderer } from './DeductionGrid';
import { NumberSequenceEngine as NumberLogic } from './engines/NumberSequenceEngine';
import { NumberSequenceRenderer } from './NumberSequence';
import { BinaryGridEngine as BinaryLogic } from './engines/BinaryGridEngine';
import { BinaryGridRenderer } from './BinaryGrid';

// Batch 3
import { ConstraintPathEngine as ConstraintLogic } from './engines/ConstraintPathEngine';
import { ConstraintPathRenderer } from './ConstraintPathPuzzle';
import { LogicOperatorsEngine as LogicLogic } from './engines/LogicOperatorsEngine';
import { LogicOperatorsRenderer } from './LogicOperatorsPuzzle';

// Batch 4
import { RotatingPatternEngine as RotatingLogic } from './engines/RotatingPatternEngine';
import { RotatingPatternRenderer } from './RotatingPatternPuzzle';
import { WeightedSudokuEngine as WeightedLogic } from './engines/WeightedSudokuEngine';
import { WeightedSudokuRenderer } from './WeightedSudoku';
import { GraphColoringEngine as GraphLogic } from './engines/GraphColoringEngine';
import { GraphColoringRenderer } from './GraphColoringPuzzle';

// Others
import { CryptarithmEngine as CryptarithmLogic } from './engines/CryptarithmEngine';
import { CryptarithmRenderer } from './CryptarithmPuzzle';

export const puzzleEngines: Record<string, PuzzleEngine<any, any, any>> = {
    'mini-sudoku': { ...MiniSudokuEngine, render: MiniSudokuRenderer },
    'pattern-sequence': { ...PatternLogic, render: PatternSequenceRenderer },
    'deduction-grid': { ...DeductionLogic, render: DeductionGridRenderer },
    'number-sequence': { ...NumberLogic, render: NumberSequenceRenderer },
    'binary-grid': { ...BinaryLogic, render: BinaryGridRenderer },
    'constraint-path': { ...ConstraintLogic, render: ConstraintPathRenderer },
    'logic-operators': { ...LogicLogic, render: LogicOperatorsRenderer },
    'rotating-pattern': { ...RotatingLogic, render: RotatingPatternRenderer },
    'weighted-sudoku': { ...WeightedLogic, render: WeightedSudokuRenderer },
    'graph-coloring': { ...GraphLogic, render: GraphColoringRenderer },
    'cryptarithm': { ...CryptarithmLogic, render: CryptarithmRenderer }
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
