import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type MiniSudokuData, type MiniSudokuSolution, type MiniSudokuInput, type SudokuGrid } from './engines/MiniSudokuEngine';

export const MiniSudokuRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<MiniSudokuData, MiniSudokuSolution, MiniSudokuInput>) => {
    const [grid, setGrid] = useState<SudokuGrid>(data.grid.map(row => [...row]));

    useEffect(() => {
        if (hintTrigger > 0) {
            // Find all empty cells
            const emptyCells: { r: number, c: number }[] = [];
            grid.forEach((row, r) => {
                row.forEach((cell, c) => {
                    if (cell === null) emptyCells.push({ r, c });
                });
            });

            if (emptyCells.length > 0) {
                // Pick random empty cell - simplified for deterministic behavior if needed, but random is fine for reveal
                const randomIdx = Math.floor(Math.random() * emptyCells.length);
                const { r, c } = emptyCells[randomIdx];
                const correctVal = solution.grid[r][c];

                if (correctVal !== null) {
                    const newGrid = grid.map(row => [...row]);
                    newGrid[r][c] = correctVal;
                    setGrid(newGrid);
                    onInput(newGrid);
                }
            }
        }
    }, [hintTrigger, grid, onInput, solution]);


    const handleChange = (row: number, col: number, value: string) => {
        if (data.initialGrid[row][col] !== null) return; // Can't change initial cells

        const newGrid = grid.map(r => [...r]);
        const num = value === '' ? null : parseInt(value);
        newGrid[row][col] = (num && num >= 1 && num <= 4) ? num : null;
        setGrid(newGrid);
        onInput(newGrid);
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <span className="text-8xl font-black text-white">4</span>
            </div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter">Mini <span className="text-accent-glow">Sudoku</span></h3>
                <p className="text-neutral-300 text-sm font-medium">Fill the grid. 1-4. No repeats.</p>
            </div>

            <div className="inline-grid grid-cols-4 gap-2.5 p-3 bg-black/20 rounded-2xl border border-white/5 backdrop-blur-sm relative z-10">
                {grid.map((row, i) => (
                    row.map((cell, j) => {
                        const isInitial = data.initialGrid[i][j] !== null;
                        // Add extra margin for the 2x2 blocks visual separation
                        const isRightBorder = j === 1;
                        const isBottomBorder = i === 1;

                        return (
                            <div key={`${i}-${j}`} className={`relative group ${isRightBorder ? 'mr-1' : ''} ${isBottomBorder ? 'mb-1' : ''}`}>
                                <input
                                    type="text"
                                    maxLength={1}
                                    value={cell || ''}
                                    onChange={(e) => handleChange(i, j, e.target.value)}
                                    disabled={disabled || isInitial}
                                    className={`w-14 h-14 sm:w-16 sm:h-16 text-center text-3xl font-bold rounded-xl transition-all duration-300
                                        ${isInitial
                                            ? 'bg-white/5 text-neutral-500 cursor-not-allowed border border-white/5'
                                            : 'bg-surface-200 text-white hover:bg-white/10 focus:bg-accent/20 border border-white/10 focus:border-accent shadow-[0_4px_10px_rgba(0,0,0,0.1)]'}
                                        ${!isInitial && 'focus:ring-0 focus:scale-105'}
                                        focus:outline-none focus:z-10 caret-transparent selection:bg-transparent`}
                                />
                                {!isInitial && !cell && !disabled && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};
