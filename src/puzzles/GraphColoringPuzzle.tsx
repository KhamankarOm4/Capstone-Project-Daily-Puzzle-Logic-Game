import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine';

// Types
interface Point {
    x: number;
    y: number;
}

interface GraphData {
    nodes: Point[];
    edges: [number, number][]; // Indices of connected nodes
    minColors: number; // Chromatic number (target usually 3 or 4)
}

interface GraphSolution {
    colors: number[]; // Index = node index, Value = color index (0-3)
    edges?: [number, number][]; // Required for validation of custom colorings
}

type GraphInput = number[]; // User's colors for each node (-1 if uncolored)

// Assets / Constants
const PALETTE = [
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

    // Ensure connectivity (BFS check? Skip for MVP, dense enough usually)

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
        // Fallback or retry? Should be 4-colorable if planar.
        // If fails, we just clear edges? 
        // For MVP, just return what we have, validation might fail if impossible, 
        // but planar graphs are 4-colorable.
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

export const GraphColoringEngine: PuzzleEngine<GraphData, GraphSolution, GraphInput> = {
    async generate(seed: string): Promise<PuzzleInstance<GraphData, GraphSolution>> {
        const { data, solution } = generateGraphPuzzle(seed);
        return {
            id: `graph-coloring-${seed}`,
            seed,
            data,
            solution
        };
    },

    render: ({ data, onInput, disabled, solution, hintTrigger }) => {
        const [nodeColors, setNodeColors] = useState<number[]>(new Array(data.nodes.length).fill(-1));

        // Hint: Fill one correct node
        useEffect(() => {
            if (hintTrigger > 0) {
                const uncolored = nodeColors.map((c, i) => c === -1 ? i : -1).filter(i => i !== -1);
                if (uncolored.length > 0) {
                    // Pick random uncolored or wrong node
                    const wrongOrEmpty = nodeColors.map((c, i) => (c !== solution.colors[i] ? i : -1)).filter(i => i !== -1);
                    if (wrongOrEmpty.length > 0) {
                        const targetIdx = wrongOrEmpty[Math.floor(Math.random() * wrongOrEmpty.length)];
                        const newColors = [...nodeColors];
                        newColors[targetIdx] = solution.colors[targetIdx];
                        setNodeColors(newColors);
                        onInput(newColors);
                    }
                }
            }
        }, [hintTrigger, onInput, solution, nodeColors]);

        const handleNodeClick = (idx: number) => {
            if (disabled) return;
            const newColors = [...nodeColors];
            newColors[idx] = (newColors[idx] + 2) % (PALETTE.length + 1) - 1; // Cycle: -1 -> 0 -> 1 -> 2 -> 3 -> -1
            if (newColors[idx] >= 4) newColors[idx] = -1; // Limit to 4 colors for challenge? Or use palette size?
            // Let's cycle -1 (empty) -> 0 -> 1 -> 2 -> 3
            if (nodeColors[idx] === 3) newColors[idx] = -1;
            else newColors[idx] = nodeColors[idx] + 1;

            setNodeColors(newColors);
            onInput(newColors);
        };

        return (
            <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
                <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-3xl font-black text-white">Graph <span className="text-accent-glow">coloring</span></h3>
                    <p className="text-neutral-300 text-sm">No two connected nodes can share a color.</p>
                </div>

                <div className="relative w-full aspect-square max-w-[400px] bg-black/20 rounded-xl border border-white/10 p-4">
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                        {/* Edges */}
                        {data.edges.map(([a, b], i) => (
                            <line
                                key={i}
                                x1={data.nodes[a].x}
                                y1={data.nodes[a].y}
                                x2={data.nodes[b].x}
                                y2={data.nodes[b].y}
                                stroke="rgba(255,255,255,0.2)"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Nodes */}
                        {data.nodes.map((n, i) => (
                            <g
                                key={i}
                                onClick={() => handleNodeClick(i)}
                                className={`cursor-pointer transition-transform duration-200 hover:scale-110 ${disabled ? 'cursor-not-allowed' : ''}`}
                            >
                                <circle
                                    cx={n.x}
                                    cy={n.y}
                                    r="6"
                                    fill={nodeColors[i] === -1 ? '#1e293b' : PALETTE[nodeColors[i]]}
                                    className="transition-colors duration-300"
                                    stroke={nodeColors[i] === -1 ? 'white' : 'none'}
                                    strokeWidth={nodeColors[i] === -1 ? '2' : '0'}
                                    strokeOpacity={nodeColors[i] === -1 ? '0.3' : '1'}
                                />
                                {/* Label for accessibility/debug?? No, keep clean */}
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Palette Legend */}
                <div className="flex gap-4 p-4 bg-black/20 rounded-xl">
                    {PALETTE.slice(0, 4).map((color, i) => (
                        <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg"
                            style={{ backgroundColor: color }}
                            title={`Color ${i + 1}`}
                        />
                    ))}
                </div>
            </div>
        );
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
