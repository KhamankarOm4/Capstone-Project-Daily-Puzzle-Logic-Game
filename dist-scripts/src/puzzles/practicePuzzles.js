"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.practicePuzzles = void 0;
exports.practicePuzzles = [
    {
        "id": "practice-mini-sudoku-1",
        "date": "Practice Mini Sudoku",
        "type": "mini-sudoku",
        "difficulty": "Easy",
        "data": {
            "grid": [
                [null, 2, 3, 4],
                [3, null, 1, 2],
                [2, 3, null, 1],
                [4, 1, 2, null]
            ],
            "initialGrid": [
                [null, 2, 3, 4],
                [3, null, 1, 2],
                [2, 3, null, 1],
                [4, 1, 2, null]
            ]
        },
        "solution": {
            "grid": [
                [1, 2, 3, 4],
                [3, 4, 1, 2],
                [2, 3, 4, 1],
                [4, 1, 2, 3]
            ]
        }
    },
    {
        "id": "practice-pattern-sequence-1",
        "date": "Practice Pattern Sequence",
        "type": "pattern-sequence",
        "difficulty": "Hard",
        "data": {
            "sequence": [2, 5, -1, 12, 19, 31],
            "missingIndex": 2,
            "pattern": "fibonacci"
        },
        "solution": {
            "answer": 7
        }
    },
    {
        "id": "practice-deduction-grid-1",
        "date": "Practice Deduction Grid",
        "type": "deduction-grid",
        "difficulty": "Hard",
        "data": {
            "categories": [
                ["Alice", "Bob", "Charlie"],
                ["Red", "Blue", "Green"],
                ["Dog", "Cat", "Fish"]
            ],
            "clues": [
                "Alice doesn't have a Dog.",
                "The person with the Red shirt has a Cat.",
                "Bob is wearing Blue."
            ],
            "solution": []
        },
        "solution": {
            "grid": [
                [null, true, null],
                [true, null, null],
                [null, null, true]
            ]
        }
    },
    {
        "id": "practice-number-sequence-1",
        "date": "Practice Number Sequence",
        "type": "number-sequence",
        "difficulty": "Easy",
        "data": {
            "sequence": [5, 6, 11, 17, 28, 45],
            "sequenceType": "fibonacci",
            "description": "Each number is the sum of the previous two"
        },
        "solution": {
            "nextNumber": 73
        }
    },
    {
        "id": "practice-binary-grid-1",
        "date": "Practice Binary Grid",
        "type": "binary-grid",
        "difficulty": "Medium",
        "data": {
            "grid": [
                [0, 1, 0, 1, null, 1],
                [0, 1, 0, null, 0, 1],
                [0, 1, null, 1, 0, 1],
                [0, null, 0, 1, 0, 1],
                [null, 1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, null]
            ],
            "initialGrid": [
                [0, 1, 0, 1, null, 1],
                [0, 1, 0, null, 0, 1],
                [0, 1, null, 1, 0, 1],
                [0, null, 0, 1, 0, 1],
                [null, 1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, null]
            ],
            "size": 6
        },
        "solution": {
            "grid": [
                [0, 1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, 1],
                [0, 1, 0, 1, 0, 1]
            ]
        }
    },
    {
        "id": "practice-constraint-path-1",
        "date": "Practice Constraint Path",
        "type": "constraint-path",
        "difficulty": "Hard",
        "data": {
            "gridSize": 5,
            "start": { "r": 0, "c": 0 },
            "end": { "r": 4, "c": 4 },
            "constraints": [{ "point": { "r": 0, "c": 2 }, "type": "must-visit" }],
            "walls": []
        },
        "solution": {
            "path": [
                { "r": 0, "c": 0 }, { "r": 0, "c": 1 }, { "r": 0, "c": 2 }, { "r": 0, "c": 3 }, { "r": 0, "c": 4 },
                { "r": 1, "c": 4 }, { "r": 2, "c": 4 }, { "r": 3, "c": 4 }, { "r": 4, "c": 4 }
            ]
        }
    },
    {
        "id": "practice-logic-operators-1",
        "date": "Practice Logic Operators",
        "type": "logic-operators",
        "difficulty": "Medium",
        "data": {
            "initialGrid": [[null, null, null], [null, null, null], [null, null, null]],
            "rowOperators": [["OR", "AND"], ["OR", "AND"], ["OR", "AND"]],
            "colOperators": [["OR", "XOR"], ["XOR", "OR"], ["AND", "XOR"]],
            "rowTargets": [0, 1, 0],
            "colTargets": [0, 1, 0]
        },
        "solution": {
            "grid": [[0, 1, 0], [1, 1, 1], [0, 1, 0]]
        }
    },
    {
        "id": "practice-rotating-pattern-1",
        "date": "Practice Rotating Pattern",
        "type": "rotating-pattern",
        "difficulty": "Hard",
        "data": {
            "sequence": [
                { "type": "triangle", "color": "green", "rotation": 315 },
                { "type": "triangle", "color": "yellow", "rotation": 0 },
                { "type": "triangle", "color": "purple", "rotation": 45 }
            ],
            "options": [
                { "type": "triangle", "color": "blue", "rotation": 90 },
                { "type": "triangle", "color": "red", "rotation": 90 },
                { "type": "triangle", "color": "blue", "rotation": 90 },
                { "type": "triangle", "color": "red", "rotation": 180 }
            ],
            "ruleDescription": "Rotate 45°, Color Shift 1"
        },
        "solution": {
            "correctOptionIndex": 1
        }
    },
    {
        "id": "practice-weighted-sudoku-1",
        "date": "Practice Weighted Sudoku",
        "type": "weighted-sudoku",
        "difficulty": "Hard",
        "data": {
            "initialGrid": [[0, 2, 0, 4], [3, 0, 1, 2], [0, 1, 0, 0], [4, 3, 0, 0]],
            "weights": { "1": 8, "2": 5, "3": 2, "4": 9 },
            "rowTargets": [24, 24, 24, 24],
            "colTargets": [24, 24, 24, 24]
        },
        "solution": {
            "grid": [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]]
        }
    },
    {
        "id": "practice-graph-coloring-1",
        "date": "Practice Graph Coloring",
        "type": "graph-coloring",
        "difficulty": "Easy",
        "data": {
            "nodes": [
                { "x": 83.23, "y": 21.27 }, { "x": 30.91, "y": 14.18 }, { "x": 67.46, "y": 28.21 }, { "x": 60.47, "y": 43.16 },
                { "x": 10.41, "y": 25.31 }, { "x": 16.62, "y": 64.16 }, { "x": 86.01, "y": 51.44 }, { "x": 79.83, "y": 85.39 },
                { "x": 37.87, "y": 51.27 }
            ],
            "edges": [
                [0, 2], [0, 6], [0, 3], [1, 4], [1, 8], [1, 2], [2, 3], [2, 8], [3, 8], [3, 6], [3, 7], [4, 8], [4, 5], [5, 8], [5, 7], [6, 7], [7, 8]
            ],
            "minColors": 4
        },
        "solution": {
            "colors": [0, 0, 1, 2, 1, 0, 3, 1, 3],
            "edges": [
                [0, 2], [0, 6], [0, 3], [1, 4], [1, 8], [1, 2], [2, 3], [2, 8], [3, 8], [3, 6], [3, 7], [4, 8], [4, 5], [5, 8], [5, 7], [6, 7], [7, 8]
            ]
        }
    },
    {
        "id": "practice-cryptarithm-1",
        "date": "Practice Cryptarithm",
        "type": "cryptarithm",
        "difficulty": "Medium",
        "data": {
            "equation": ["PCZ", "+", "PAB", "=", "CDD"],
            "uniqueLetters": ["A", "B", "C", "D", "P", "Z"]
        },
        "solution": {
            "mapping": { "P": 3, "C": 6, "Z": 1, "A": 2, "B": 7, "D": 8 }
        }
    }
];
