import { type PuzzleLogic, type PuzzleInstance, defaultCalculateScore } from '../PuzzleEngine';

// Types
export interface Point {
    x: number;
    y: number;
}

export interface GraphData {
    nodes: Point[];
    edges: [number, number][]; // Indices of connected nodes
    minColors: number; // Chromatic number (target usually 3 or 4)
}

export interface GraphSolution {
    colors: number[]; // Index = node index, Value = color index (0-3)
    edges?: [number, number][]; // Required for validation of custom colorings
}

export type GraphInput = number[]; // User's colors for each node (-1 if uncolored)

// Assets / Constants
export const PALETTE = [
    '#ef4444', // Red
    '#3b82f6', // Blue
    '#22c55e', // Green
    '#eab308', // Yellow
    '#a855f7', // Purple
];

// Helper: Check if two edges intersect
const intersect = (p1: Point, p2: Point, p3: Point, p4: Point): boolean => {
    const ccw = (a: Point, b: Point, c: Point) => (c.y - a.y) * (b.x - a.x) > (b.y - a.y) * (c.x - a.x);
    return (ccw(p1, p3, p4) !== ccw(p2, p3, p4)) && (ccw(p1, p2, p3) !== ccw(p1, p2, p4));
};

// Generator
const generateGraphPuzzle = (seed: string): { data: GraphData, solution: GraphSolution } => {
    const seedNum = parseInt(seed.substring(0, 8), 16);

    // Deterministic Random
    let rngState = seedNum;
    const random = () => {
        rngState = (rngState * 1664525 + 1013904223) % 4294967296;
        return rngState / 4294967296;
    };

    const numNodes = 6 + (seedNum % 5); // 6 to 10 nodes
    const nodes: Point[] = [];
    const edges: [number, number][] = [];

    // 1. Generate Nodes (ensure spread)
    for (let i = 0; i < numNodes; i++) {
        let p: Point;
        let attempts = 0;
        do {
            p = { x: 10 + random() * 80, y: 10 + random() * 80 };
            attempts++;
        } while (nodes.some(n => Math.hypot(n.x - p.x, n.y - p.y) < 15) && attempts < 50);
        nodes.push(p);
    }

    // 2. Generate Edges (Delaunay-ish / Proximity w/o intersection)
    // Simple greedy approach: connect closest nodes avoiding intersection
    for (let i = 0; i < numNodes; i++) {
        // Find distances to all other nodes
        const dists = nodes.map((n, idx) => ({ idx, d: Math.hypot(n.x - nodes[i].x, n.y - nodes[i].y) }));
        dists.sort((a, b) => a.d - b.d);

        // Try to connect to 3 closest neighbors (skipping self)
        let connected = 0;
        for (let j = 1; j < dists.length && connected < 3; j++) {
            const target = dists[j].idx;
            if (target < i) continue; // Avoid dupes, handled by earlier node

            // Check intersection with existing
            const p1 = nodes[i];
            const p2 = nodes[target];
            const hasIntersection = edges.some(([a, b]) => {
                if (a === i || a === target || b === i || b === target) return false; // Shared node isn't intersection
                return intersect(p1, p2, nodes[a], nodes[b]);
            });

            if (!hasIntersection) {
                // Check redundancy (don't over-connect)
                edges.push([i, target]);
                connected++;
            }
        }
    }

    // 3. Solve (Greedy Coloring to find validity)
    // Simple backtracking to find valid coloring
    const colors = new Array(numNodes).fill(-1);
    const solve = (idx: number): boolean => {
        if (idx === numNodes) return true;

        // Try colors 0-3
        for (let c = 0; c < 4; c++) {
            // Check neighbors
            const valid = edges.every(([a, b]) => {
                if (a === idx && colors[b] === c) return false;
                if (b === idx && colors[a] === c) return false;
                return true;
            });

            if (valid) {
                colors[idx] = c;
                if (solve(idx + 1)) return true;
                colors[idx] = -1;
            }
        }
        return false;
    };

    if (!solve(0)) {
        console.warn("Could not 4-color graph");
    }

    return {
        data: {
            nodes,
            edges,
            minColors: 4
        },
        solution: { colors, edges }
    };
};

export const GraphColoringEngine: PuzzleLogic<GraphData, GraphSolution, GraphInput> = {
    async generate(seed: string): Promise<PuzzleInstance<GraphData, GraphSolution>> {
        const { data, solution } = generateGraphPuzzle(seed);
        return {
            id: `graph-coloring-${seed}`,
            seed,
            data,
            solution
        };
    },

    validate: (userInput: GraphInput, solution: GraphSolution): boolean => {
        // Check if edges are available for constraint validation
        if (solution.edges) {
            // 1. Verify all nodes colored
            if (userInput.some(c => c === -1)) return false;

            // 2. Verify adjacency constraints
            for (const [a, b] of solution.edges) {
                if (userInput[a] === userInput[b]) return false;
            }
            return true;
        }

        // Fallback: Strict match (should not happen if edges provided)
        return JSON.stringify(userInput) === JSON.stringify(solution.colors);
    },

    getHint: (_solution: GraphSolution, _currentInput: GraphInput): string | null => {
        return "Adjacent nodes cannot have the same color.";
    },

    calculateDifficulty: (_data: GraphData): number => {
        return 5;
    },

    calculateScore: defaultCalculateScore
};
