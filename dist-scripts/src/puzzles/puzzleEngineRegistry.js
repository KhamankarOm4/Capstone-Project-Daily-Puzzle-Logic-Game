"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.puzzleEngineRegistry = void 0;
const MiniSudokuEngine_1 = require("./engines/MiniSudokuEngine");
const PatternSequenceEngine_1 = require("./engines/PatternSequenceEngine");
const DeductionGridEngine_1 = require("./engines/DeductionGridEngine");
const NumberSequenceEngine_1 = require("./engines/NumberSequenceEngine");
const BinaryGridEngine_1 = require("./engines/BinaryGridEngine");
const ConstraintPathEngine_1 = require("./engines/ConstraintPathEngine");
const LogicOperatorsEngine_1 = require("./engines/LogicOperatorsEngine");
const RotatingPatternEngine_1 = require("./engines/RotatingPatternEngine");
const WeightedSudokuEngine_1 = require("./engines/WeightedSudokuEngine");
const GraphColoringEngine_1 = require("./engines/GraphColoringEngine");
const CryptarithmEngine_1 = require("./engines/CryptarithmEngine");
exports.puzzleEngineRegistry = {
    'mini-sudoku': MiniSudokuEngine_1.MiniSudokuEngine,
    'pattern-sequence': PatternSequenceEngine_1.PatternSequenceEngine,
    'deduction-grid': DeductionGridEngine_1.DeductionGridEngine,
    'number-sequence': NumberSequenceEngine_1.NumberSequenceEngine,
    'binary-grid': BinaryGridEngine_1.BinaryGridEngine,
    'constraint-path': ConstraintPathEngine_1.ConstraintPathEngine,
    'logic-operators': LogicOperatorsEngine_1.LogicOperatorsEngine,
    'rotating-pattern': RotatingPatternEngine_1.RotatingPatternEngine,
    'weighted-sudoku': WeightedSudokuEngine_1.WeightedSudokuEngine,
    'graph-coloring': GraphColoringEngine_1.GraphColoringEngine,
    'cryptarithm': CryptarithmEngine_1.CryptarithmEngine
};
