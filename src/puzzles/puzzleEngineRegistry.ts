import { MiniSudokuEngine } from './engines/MiniSudokuEngine';
import { PatternSequenceEngine } from './engines/PatternSequenceEngine';
import { DeductionGridEngine } from './engines/DeductionGridEngine';
import { NumberSequenceEngine } from './engines/NumberSequenceEngine';
import { BinaryGridEngine } from './engines/BinaryGridEngine';
import { ConstraintPathEngine } from './engines/ConstraintPathEngine';
import { LogicOperatorsEngine } from './engines/LogicOperatorsEngine';
import { RotatingPatternEngine } from './engines/RotatingPatternEngine';
import { WeightedSudokuEngine } from './engines/WeightedSudokuEngine';
import { GraphColoringEngine } from './engines/GraphColoringEngine';
import { CryptarithmEngine } from './engines/CryptarithmEngine';

export const puzzleEngineRegistry = {
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
