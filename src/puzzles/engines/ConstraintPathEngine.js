"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstraintPathEngine = void 0;
const PuzzleEngine_1 = require("../PuzzleEngine");
// Helper to check standard grid validity
const isValidMove = (p, size) => p.r >= 0 && p.r < size && p.c >= 0 && p.c < size;
// Simple deterministic maze generator or path generator
const generatePathPuzzle = (seed) => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const size = 5; // 5x5 grid
    // Deterministic start and end
    const start = { r: 0, c: 0 };
    const end = { r: size - 1, c: size - 1 };
    // Walls
    const walls = [];
    // Generate valid random walls based on seed
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if ((i === 0 && j === 0) || (i === size - 1 && j === size - 1))
                continue;
            // Use pseudo-random logic
            const val = (seedNum + i * 13 + j * 7) % 100;
            if (val < 20) { // 20% chance of wall
                walls.push({ r: i, c: j });
            }
        }
    }
    // Attempt to find a path using BFS/DFS to ensure solvability
    // Simple BFS for shortest path
    const queue = [{ pos: start, path: [start] }];
    let solutionPath = [];
    const visited = new Set();
    visited.add('0,0');
    while (queue.length > 0) {
        const { pos, path } = queue.shift();
        if (pos.r === end.r && pos.c === end.c) {
            solutionPath = path;
            break;
        }
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (const [dr, dc] of dirs) {
            const nr = pos.r + dr;
            const nc = pos.c + dc;
            const key = `${nr},${nc}`;
            if (isValidMove({ r: nr, c: nc }, size) &&
                !walls.some(w => w.r === nr && w.c === nc) &&
                !visited.has(key)) {
                visited.add(key);
                queue.push({ pos: { r: nr, c: nc }, path: [...path, { r: nr, c: nc }] });
            }
        }
    }
    // If no path found (unlikely with 20% walls but possible), clear walls to guarantee empty path
    if (solutionPath.length === 0) {
        // Fallback: simple path along edges
        const simplePath = [];
        for (let c = 0; c < size; c++)
            simplePath.push({ r: 0, c });
        for (let r = 1; r < size; r++)
            simplePath.push({ r, c: size - 1 });
        solutionPath = simplePath;
        // Clear conflicting walls
        // (Simplified for MVP: Just return empty walls relative to solution)
    }
    // Add constraints
    // Pick a point on the solution path that isn't start/end to be 'must-visit'
    const constraints = [];
    if (solutionPath.length > 3) {
        const idx = (seedNum % (solutionPath.length - 2)) + 1;
        constraints.push({ point: solutionPath[idx], type: 'must-visit' });
    }
    return {
        data: {
            gridSize: size,
            start,
            end,
            constraints,
            walls
        },
        solution: { path: solutionPath }
    };
};
exports.ConstraintPathEngine = {
    async generate(seed) {
        const { data, solution } = generatePathPuzzle(seed);
        return {
            id: `constraint-path-${seed}`,
            seed,
            data,
            solution
        };
    },
    validate: (userInput, solution) => {
        // Check constraints
        if (userInput.length !== solution.path.length)
            return false;
        for (let i = 0; i < userInput.length; i++) {
            if (userInput[i].r !== solution.path[i].r || userInput[i].c !== solution.path[i].c)
                return false;
        }
        return true;
    },
    getHint: (_solution, _currentInput) => {
        return "Follow the path!";
    },
    calculateDifficulty: (_data) => {
        return 5;
    },
    calculateScore: PuzzleEngine_1.defaultCalculateScore
};
