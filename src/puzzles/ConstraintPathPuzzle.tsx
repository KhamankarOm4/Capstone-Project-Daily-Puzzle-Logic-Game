import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type ConstraintPathData, type ConstraintPathSolution, type ConstraintPathInput, type Point } from './engines/ConstraintPathEngine';

export const ConstraintPathRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<ConstraintPathData, ConstraintPathSolution, ConstraintPathInput>) => {
    const [currentPath, setCurrentPath] = useState<Point[]>([data.start]);
    const [isComplete, setIsComplete] = useState<boolean>(false);

    useEffect(() => {
        if (hintTrigger > 0 && !isComplete) {
            // Hint: Show next correct move from current tip
            const lastPos = currentPath[currentPath.length - 1];

            // Find index of lastPos in solution path
            // This assumes user is following THE solution path. 
            // If user deviated, we might need to find a path from current tip to end?
            // Simplified: Just show the next step of the OPTIMAL solution if we are on it.

            const solIdx = solution.path.findIndex(p => p.r === lastPos.r && p.c === lastPos.c);
            if (solIdx !== -1 && solIdx < solution.path.length - 1) {
                const nextMove = solution.path[solIdx + 1];
                const newPath = [...currentPath, nextMove];
                setCurrentPath(newPath);
                onInput(newPath);
                if (nextMove.r === data.end.r && nextMove.c === data.end.c) {
                    setIsComplete(true);
                }
            }
        }
    }, [hintTrigger, onInput, solution, currentPath, isComplete, data.end]);

    const handleCellClick = (r: number, c: number) => {
        if (disabled || isComplete) return;

        // Only allow valid moves from the last point
        const last = currentPath[currentPath.length - 1];

        // Check if clicking existing point (backtrack)
        const existingIdx = currentPath.findIndex(p => p.r === r && p.c === c);
        if (existingIdx !== -1) {
            // If clicking current tip, do nothing
            if (existingIdx === currentPath.length - 1) return;

            // Truncate path back to clicked point
            const newPath = currentPath.slice(0, existingIdx + 1);
            setCurrentPath(newPath);
            onInput(newPath);
            setIsComplete(false);
            return;
        }

        // Check if adjacent and not wall
        const isAdjacent = Math.abs(r - last.r) + Math.abs(c - last.c) === 1;
        const isWall = data.walls.some(w => w.r === r && w.c === c);

        if (isAdjacent && !isWall) {
            const newPath = [...currentPath, { r, c }];
            setCurrentPath(newPath);
            onInput(newPath);

            if (r === data.end.r && c === data.end.c) {
                setIsComplete(true);
            }
        }
    };

    return (
        <div className="flex flex-col items-center gap-8 w-full max-w-lg mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-8xl font-black text-neutral-900 dark:text-white">⚯</span>
            </div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tighter">Constraint <span className="text-accent-glow">Path</span></h3>
                <p className="text-neutral-600 dark:text-neutral-300 text-sm font-medium">Connect start to end. Visit required cells. Avoid walls.</p>
            </div>

            <div className="relative p-1 bg-surface-200 dark:bg-black/20 rounded-xl border border-black/5 dark:border-white/5 backdrop-blur-sm"
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${data.gridSize}, minmax(0, 1fr))`,
                    gap: '4px'
                }}>

                {Array.from({ length: data.gridSize }).map((_, r) => (
                    Array.from({ length: data.gridSize }).map((_, c) => {
                        const isAbyss = data.walls.some(w => w.r === r && w.c === c);
                        const pathIdx = currentPath.findIndex(p => p.r === r && p.c === c);
                        const isPath = pathIdx !== -1;
                        const isStart = r === data.start.r && c === data.start.c;
                        const isEnd = r === data.end.r && c === data.end.c;
                        const constraint = data.constraints.find(k => k.point.r === r && k.point.c === c);
                        const isMustVisit = constraint?.type === 'must-visit';

                        let bgClass = "bg-surface-200 hover:bg-white/10";
                        if (isAbyss) bgClass = "bg-black/50 border-transparent cursor-not-allowed";
                        else if (isStart) bgClass = "bg-accent-cyan text-black font-bold";
                        else if (isEnd) bgClass = "bg-accent text-white font-bold";
                        else if (isPath) bgClass = "bg-accent/40 border-accent/50 shadow-[0_0_10px_rgba(112,0,255,0.3)]";

                        return (
                            <div
                                key={`${r}-${c}`}
                                onClick={() => !isAbyss && handleCellClick(r, c)}
                                className={`
                                        w-12 h-12 flex items-center justify-center rounded-lg border transition-all duration-300
                                        ${isAbyss ? 'border-white/5' : 'border-white/10'}
                                        ${bgClass}
                                        ${!isAbyss && !disabled ? 'cursor-pointer active:scale-95' : ''}
                                        relative
                                    `}
                            >
                                {isMustVisit && !isStart && !isEnd && (
                                    <div className={`w-3 h-3 rounded-full ${isPath ? 'bg-white' : 'bg-accent-cyan animate-pulse'}`}></div>
                                )}

                                {isStart && "S"}
                                {isEnd && "E"}
                            </div>
                        );
                    })
                ))}
            </div>
        </div>
    );
};
