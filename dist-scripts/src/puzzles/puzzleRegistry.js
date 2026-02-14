"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPuzzleEngine = exports.selectPuzzleForDay = exports.puzzleEngines = void 0;
const MiniSudokuEngine_1 = require("./engines/MiniSudokuEngine");
const MiniSudoku_1 = require("./MiniSudoku");
// Batch 2
const PatternSequenceEngine_1 = require("./engines/PatternSequenceEngine");
const PatternSequence_1 = require("./PatternSequence");
const DeductionGridEngine_1 = require("./engines/DeductionGridEngine");
const DeductionGrid_1 = require("./DeductionGrid");
const NumberSequenceEngine_1 = require("./engines/NumberSequenceEngine");
const NumberSequence_1 = require("./NumberSequence");
const BinaryGridEngine_1 = require("./engines/BinaryGridEngine");
const BinaryGrid_1 = require("./BinaryGrid");
// Batch 3
const ConstraintPathEngine_1 = require("./engines/ConstraintPathEngine");
const ConstraintPathPuzzle_1 = require("./ConstraintPathPuzzle");
const LogicOperatorsEngine_1 = require("./engines/LogicOperatorsEngine");
const LogicOperatorsPuzzle_1 = require("./LogicOperatorsPuzzle");
// Batch 4
const RotatingPatternEngine_1 = require("./engines/RotatingPatternEngine");
const RotatingPatternPuzzle_1 = require("./RotatingPatternPuzzle");
const WeightedSudokuEngine_1 = require("./engines/WeightedSudokuEngine");
const WeightedSudoku_1 = require("./WeightedSudoku");
const GraphColoringEngine_1 = require("./engines/GraphColoringEngine");
const GraphColoringPuzzle_1 = require("./GraphColoringPuzzle");
// Others
const CryptarithmEngine_1 = require("./engines/CryptarithmEngine");
const CryptarithmPuzzle_1 = require("./CryptarithmPuzzle");
exports.puzzleEngines = {
    'mini-sudoku': { ...MiniSudokuEngine_1.MiniSudokuEngine, render: MiniSudoku_1.MiniSudokuRenderer },
    'pattern-sequence': { ...PatternSequenceEngine_1.PatternSequenceEngine, render: PatternSequence_1.PatternSequenceRenderer },
    'deduction-grid': { ...DeductionGridEngine_1.DeductionGridEngine, render: DeductionGrid_1.DeductionGridRenderer },
    'number-sequence': { ...NumberSequenceEngine_1.NumberSequenceEngine, render: NumberSequence_1.NumberSequenceRenderer },
    'binary-grid': { ...BinaryGridEngine_1.BinaryGridEngine, render: BinaryGrid_1.BinaryGridRenderer },
    'constraint-path': { ...ConstraintPathEngine_1.ConstraintPathEngine, render: ConstraintPathPuzzle_1.ConstraintPathRenderer },
    'logic-operators': { ...LogicOperatorsEngine_1.LogicOperatorsEngine, render: LogicOperatorsPuzzle_1.LogicOperatorsRenderer },
    'rotating-pattern': { ...RotatingPatternEngine_1.RotatingPatternEngine, render: RotatingPatternPuzzle_1.RotatingPatternRenderer },
    'weighted-sudoku': { ...WeightedSudokuEngine_1.WeightedSudokuEngine, render: WeightedSudoku_1.WeightedSudokuRenderer },
    'graph-coloring': { ...GraphColoringEngine_1.GraphColoringEngine, render: GraphColoringPuzzle_1.GraphColoringRenderer },
    'cryptarithm': { ...CryptarithmEngine_1.CryptarithmEngine, render: CryptarithmPuzzle_1.CryptarithmRenderer }
};
// Select puzzle based on seed
const selectPuzzleForDay = (seed) => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const types = [
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
exports.selectPuzzleForDay = selectPuzzleForDay;
const getPuzzleEngine = (type) => exports.puzzleEngines[type];
exports.getPuzzleEngine = getPuzzleEngine;
