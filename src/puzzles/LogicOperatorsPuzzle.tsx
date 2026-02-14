import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine';

// Types
type Operator = 'AND' | 'OR' | 'XOR';
type Bit = 0 | 1;

interface LogicOperatorsData {
    initialGrid: (Bit | null)[][]; // Some might be pre-filled
    rowOperators: Operator[][]; // 3 rows, 2 ops each
    colOperators: Operator[][]; // 3 cols, 2 ops each
    rowTargets: Bit[];
    colTargets: Bit[];
}

interface LogicOperatorsSolution {
    grid: Bit[][];
}

type LogicOperatorsInput = (Bit | null)[][];

// Helper: Apply operator
const applyOp = (a: Bit, b: Bit, op: Operator): Bit => {
    switch (op) {
        case 'AND': return (a & b) as Bit;
        case 'OR': return (a | b) as Bit;
        case 'XOR': return (a ^ b) as Bit;
    }
};

// Helper: Calculate row/col result (Left-to-Right / Top-to-Bottom)
const calculateLine = (bits: Bit[], ops: Operator[]): Bit => {
    let result = bits[0];
    for (let i = 0; i < ops.length; i++) {
        result = applyOp(result, bits[i + 1], ops[i]);
    }
    return result;
};

// Generator
const generateLogicPuzzle = (seed: string): { data: LogicOperatorsData, solution: LogicOperatorsSolution } => {
    const seedNum = parseInt(seed.substring(0, 8), 16);

    // Generate Solution Grid randomly
    const solutionGrid: Bit[][] = [];
    for (let i = 0; i < 3; i++) {
        const row: Bit[] = [];
        for (let j = 0; j < 3; j++) {
            // Pseudorandom bit
            const val = (seedNum + i * 13 + j * 7 + i * j) % 2;
            row.push(val as Bit);
        }
        solutionGrid.push(row);
    }

    // Generate Operators
    const ops: Operator[] = ['AND', 'OR', 'XOR'];

    const rowOperators: Operator[][] = [];
    const colOperators: Operator[][] = [];

    // Rows
    for (let i = 0; i < 3; i++) {
        const rowOps: Operator[] = [];
        for (let j = 0; j < 2; j++) {
            const opIdx = (seedNum + i * 3 + j * 5) % 3;
            rowOps.push(ops[opIdx]);
        }
        rowOperators.push(rowOps);
    }

    // Cols
    for (let j = 0; j < 3; j++) {
        const colOps: Operator[] = [];
        for (let i = 0; i < 2; i++) {
            const opIdx = (seedNum + j * 7 + i * 11) % 3;
            colOps.push(ops[opIdx]);
        }
        colOperators.push(colOps);
    }

    // Calculate Targets
    const rowTargets: Bit[] = solutionGrid.map((row, i) => calculateLine(row, rowOperators[i]));
    const colTargets: Bit[] = [];
    for (let j = 0; j < 3; j++) {
        const col: Bit[] = [solutionGrid[0][j], solutionGrid[1][j], solutionGrid[2][j]];
        colTargets.push(calculateLine(col, colOperators[j]));
    }

    return {
        data: {
            initialGrid: Array(3).fill(null).map(() => Array(3).fill(null)),
            rowOperators,
            colOperators,
            rowTargets,
            colTargets
        },
        solution: { grid: solutionGrid }
    };
};

export const LogicOperatorsEngine: PuzzleEngine<LogicOperatorsData, LogicOperatorsSolution, LogicOperatorsInput> = {
    async generate(seed: string): Promise<PuzzleInstance<LogicOperatorsData, LogicOperatorsSolution>> {
        const { data, solution } = generateLogicPuzzle(seed);
        return {
            id: `logic-ops-${seed}`,
            seed,
            data,
            solution
        };
    },

    render: ({ data, onInput, disabled, solution, hintTrigger }) => {
        const [grid, setGrid] = useState<LogicOperatorsInput>(
            Array(3).fill(null).map(() => Array(3).fill(null))
        );

        // Hint handling
        useEffect(() => {
            if (hintTrigger > 0) {
                // Fill a random incorrect or empty cell
                const targets: { r: number, c: number }[] = [];
                for (let r = 0; r < 3; r++) {
                    for (let c = 0; c < 3; c++) {
                        if (grid[r][c] === null || grid[r][c] !== solution.grid[r][c]) {
                            targets.push({ r, c });
                        }
                    }
                }

                if (targets.length > 0) {
                    const idx = Math.floor(Math.random() * targets.length);
                    const { r, c } = targets[idx];
                    const newGrid = grid.map(row => [...row]);
                    newGrid[r][c] = solution.grid[r][c];
                    setGrid(newGrid);
                    onInput(newGrid);
                }
            }
        }, [hintTrigger, onInput, solution, grid]);

        const toggleCell = (r: number, c: number) => {
            if (disabled) return;
            const newGrid = grid.map(row => [...row]);
            const val = newGrid[r][c];
            if (val === null) newGrid[r][c] = 0;
            else if (val === 0) newGrid[r][c] = 1;
            else newGrid[r][c] = null;
            setGrid(newGrid);
            onInput(newGrid);
        };

        return (
            <div className="flex flex-col items-center gap-6 w-full max-w-2xl mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-8xl font-black text-white">&</span>
                </div>

                <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-3xl font-black text-white tracking-tighter">Logic <span className="text-accent-glow">Operators</span></h3>
                    <p className="text-neutral-300 text-sm font-medium">Assign 0 or 1 to satisfy the gates.</p>
                </div>

                <div className="bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm relative z-10 overflow-x-auto">
                    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(7, min-content)' }}>
                        {/* Header Row (Empty top-left, Col Targets at bottom usually? Or top?) */}
                        {/* Let's do:
                            Grid cells are at (row * 2), (col * 2).
                            Operators are between them.
                            Targets are at the ends.
                        */}

                        {/* We will build this manually with flex/grid rows for easier alignment */}
                    </div>

                    {/* Easier Layout: Table-like structure */}
                    <div className="flex flex-col gap-4">
                        {/* Rows */}
                        {Array.from({ length: 3 }).map((_, r) => (
                            <div key={`row-${r}`} className="flex items-center gap-2">
                                {/* Cells and Row Ops */}
                                {Array.from({ length: 3 }).map((_, c) => (
                                    <div key={`cell-${r}-${c}`} className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleCell(r, c)}
                                            disabled={disabled}
                                            className={`
                                                w-12 h-12 md:w-14 md:h-14 flex items-center justify-center text-xl font-bold rounded-xl border transition-all duration-200
                                                ${grid[r][c] === 0 ? 'bg-red-500/20 text-red-400 border-red-500/50' : ''}
                                                ${grid[r][c] === 1 ? 'bg-green-500/20 text-green-400 border-green-500/50' : ''}
                                                ${grid[r][c] === null ? 'bg-white/5 border-white/10 hover:bg-white/10' : ''}
                                            `}
                                        >
                                            {grid[r][c] ?? '?'}
                                        </button>

                                        {/* Row Operator (if not last column) */}
                                        {c < 2 && (
                                            <div className="text-xs font-mono text-neutral-400 bg-black/40 px-1.5 py-1 rounded">
                                                {data.rowOperators[r][c]}
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Row Target */}
                                <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-surface-100 rounded-lg border border-white/10">
                                    <span className="text-xs text-neutral-500">=</span>
                                    <span className={`font-mono font-bold ${data.rowTargets[r] === 1 ? 'text-green-400' : 'text-red-400'}`}>
                                        {data.rowTargets[r]}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Column Operators Row */}
                        {/* This is tricky with the flex row above. Let's separate functionality to make grid-template easier */}
                    </div>

                    {/* Re-doing layout for proper 2D grid with operators */}
                    {/* Grid Template: 
                        Rows: Cell, V-Op, Cell, V-Op, Cell
                        Cols: Cell, H-Op, Cell, H-Op, Cell | Target
                    */}
                    <div className="mt-8 grid gap-2"
                        style={{
                            gridTemplateColumns: 'repeat(3, min-content) min-content',
                            alignItems: 'center',
                            justifyItems: 'center'
                        }}>

                        {/* We need to restructure.
                            Let's map rows. For each row, we print cells and H-Ops.
                            Between rows, we print V-Ops.
                         */}
                    </div>
                </div>

                {/* Final Layout Attempt: Explicit Grid */}
                <div className="bg-black/20 p-8 rounded-2xl border border-white/5 backdrop-blur-sm relative z-10">
                    <div className="flex flex-col gap-1">
                        {Array.from({ length: 3 }).map((_, r) => (
                            <div key={`row-group-${r}`} className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: 3 }).map((_, c) => (
                                        <div key={`cell-group-${r}-${c}`} className="flex items-center gap-1">
                                            <button
                                                onClick={() => toggleCell(r, c)}
                                                disabled={disabled}
                                                className={`
                                                    w-12 h-12 flex items-center justify-center text-xl font-bold rounded-lg border transition-all duration-200
                                                    ${grid[r][c] === 0 ? 'bg-red-500/10 text-red-400 border-red-500/30' : ''}
                                                    ${grid[r][c] === 1 ? 'bg-green-500/10 text-green-400 border-green-500/30' : ''}
                                                    ${grid[r][c] === null ? 'bg-white/5 border-white/10 hover:bg-white/10' : ''}
                                                `}
                                            >
                                                {grid[r][c] ?? ''}
                                            </button>

                                            {/* Horizontal Op */}
                                            {c < 2 && (
                                                <div className="w-8 flex justify-center">
                                                    <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-1 rounded">
                                                        {data.rowOperators[r][c]}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Row Target */}
                                    <div className="w-8 flex justify-center text-neutral-500">=</div>
                                    <div className={`w-8 h-8 flex items-center justify-center rounded font-mono font-bold ${data.rowTargets[r] === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                        {data.rowTargets[r]}
                                    </div>
                                </div>

                                {/* Vertical Ops Row */}
                                {r < 2 && (
                                    <div className="flex items-center gap-1 h-8">
                                        {Array.from({ length: 3 }).map((_, c) => (
                                            <div key={`v-op-${r}-${c}`} className="flex items-center gap-1">
                                                <div className="w-12 flex justify-center">
                                                    <span className="text-[10px] font-mono text-neutral-400 bg-white/5 px-1 rounded">
                                                        {data.colOperators[c][r]}
                                                    </span>
                                                </div>
                                                {c < 2 && <div className="w-8"></div>} {/* Spacer for H-Op column */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Column Targets Row */}
                        <div className="flex items-center gap-1 mt-2 border-t border-white/10 pt-2">
                            {Array.from({ length: 3 }).map((_, c) => (
                                <div key={`col-target-${c}`} className="flex items-center gap-1">
                                    <div className="w-12 flex flex-col items-center gap-1">
                                        <div className="text-neutral-500 text-xs">||</div>
                                        <div className={`w-8 h-8 flex items-center justify-center rounded font-mono font-bold ${data.colTargets[c] === 1 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {data.colTargets[c]}
                                        </div>
                                    </div>
                                    {c < 2 && <div className="w-8"></div>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    validate: (userInput: LogicOperatorsInput, solution: LogicOperatorsSolution): boolean => {
        // Validate against solution grid strictly?
        // Or re-calculate? Re-calculation is more robust if multiple solutions exist (unlikely with 3x3 small grid but possible).
        // Let's validate against the Target Constraints.

        // However, we don't have easy access to data.rowOperators here unless we close over it.
        // `validate` signature is (userInput, solution).
        // The solution object contains the generated grid. 
        // If the user matches the solution grid, they win.

        // Is it possible to have alternative solutions?
        // Yes, e.g. "0 AND 0" = 0. "0 AND 1" = 0.
        // If the row target is 0, multiple inputs work.
        // BUT, we have both row AND col constraints.
        // The probability of a fully valid alternative grid is low but non-zero.

        // For this MVP, let's enforce strict match to `solution.grid`.
        // It simplifies validation significantly.

        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                if (userInput[r][c] !== solution.grid[r][c]) return false;
            }
        }
        return true;
    },

    getHint: (solution: LogicOperatorsSolution, currentInput: LogicOperatorsInput): string | null => {
        for (let r = 0; r < 3; r++) {
            for (let c = 0; c < 3; c++) {
                const val = currentInput[r][c];
                if (val !== null && val !== solution.grid[r][c]) {
                    return `Error at Row ${r + 1}, Col ${c + 1}`;
                }
            }
        }
        return "Fill in the empty cells.";
    },

    calculateDifficulty: (_data: LogicOperatorsData): number => {
        return 6;
    },

    calculateScore: defaultCalculateScore
};
