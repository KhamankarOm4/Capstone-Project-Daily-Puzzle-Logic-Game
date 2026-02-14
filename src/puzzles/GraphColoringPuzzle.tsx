import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type GraphData, type GraphSolution, type GraphInput, PALETTE } from './engines/GraphColoringEngine';

export const GraphColoringRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<GraphData, GraphSolution, GraphInput>) => {
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
};
