import { useState, useEffect } from 'react';
import { type PuzzleProps } from './PuzzleEngine';
import { type RotatingPatternData, type RotatingPatternSolution, type RotatingPatternInput, type Shape, type Color, type ShapeType } from './engines/RotatingPatternEngine';

export const RotatingPatternRenderer = ({ data, onInput, disabled, solution, hintTrigger }: PuzzleProps<RotatingPatternData, RotatingPatternSolution, RotatingPatternInput>) => {
    const [selected, setSelected] = useState<number | null>(null);

    // Hint: Eliminate 2 wrong options?
    // Or just highlight the correct one?
    // Let's implement: Highlight correct option if hinted.
    useEffect(() => {
        if (hintTrigger > 0) {
            setSelected(solution.correctOptionIndex);
            onInput(solution.correctOptionIndex);
        }
    }, [hintTrigger, onInput, solution]);

    const handleClick = (idx: number) => {
        if (disabled) return;
        setSelected(idx);
        onInput(idx);
    };

    // Render Shape Helper
    const renderShape = (shape: Shape, size: number = 60) => {
        const colorMap: Record<Color, string> = {
            red: '#ef4444',
            blue: '#3b82f6',
            green: '#22c55e',
            yellow: '#eab308',
            purple: '#a855f7'
        };
        const fill = colorMap[shape.color];

        // SVG Paths
        let path = "";

        switch (shape.type) {
            case 'square': path = "M 20 20 H 80 V 80 H 20 Z"; break;
            case 'circle': path = "M 50 10 A 40 40 0 1 1 50 90 A 40 40 0 1 1 50 10 Z"; break; // Circle path approximation or just circle tag
            case 'triangle': path = "M 50 15 L 85 85 H 15 Z"; break;
            // Pentagon: approx points
            case 'pentagon': path = "M 50 10 L 90 40 L 75 90 H 25 L 10 40 Z"; break;
            // Star: approx 5 point star
            case 'star': path = "M 50 10 L 61 35 L 88 35 L 66 50 L 75 75 L 50 60 L 25 75 L 34 50 L 12 35 L 39 35 Z"; break;
        }

        return (
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                className="transition-all duration-500 ease-in-out"
                style={{
                    transform: `rotate(${shape.rotation}deg)`,
                    filter: 'drop-shadow(0px 0px 5px rgba(255,255,255,0.2))'
                }}
            >
                <path d={path} fill={fill} stroke="rgba(255,255,255,0.5)" strokeWidth="3" />
            </svg>
        );
    };

    return (
        <div className="flex flex-col items-center gap-10 w-full max-w-3xl mx-auto p-10 glass-panel rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <span className="text-8xl font-black text-white">↺</span>
            </div>

            <div className="text-center space-y-2 relative z-10">
                <h3 className="text-3xl font-black text-white tracking-tighter">Rotating <span className="text-accent-glow">Pattern</span></h3>
                <p className="text-neutral-300 text-sm font-medium">Predict the next shape in the sequence.</p>
            </div>

            {/* Sequence */}
            <div className="flex items-center gap-4 md:gap-8 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                {data.sequence.map((shape, i) => (
                    <div key={i} className="flex items-center gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-surface-100 rounded-xl border border-white/10 shadow-lg">
                            {renderShape(shape, 60)}
                        </div>
                        <div className="text-white/20 text-2xl font-light">→</div>
                    </div>
                ))}
                <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-black/40 rounded-xl border-2 border-dashed border-white/20 shadow-inner">
                    <span className="text-4xl text-white/20 font-bold">?</span>
                </div>
            </div>

            {/* Options */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                {data.options.map((shape, i) => (
                    <button
                        key={i}
                        onClick={() => handleClick(i)}
                        disabled={disabled}
                        className={`
                                relative h-28 flex flex-col items-center justify-center rounded-2xl border-2 transition-all duration-300 group
                                ${selected === i
                                ? 'bg-accent/20 border-accent shadow-[0_0_20px_rgba(112,0,255,0.4)] scale-105'
                                : 'bg-surface-200 border-white/5 hover:bg-white/10 hover:border-white/20 hover:scale-105'}
                            `}
                    >
                        <div className="group-hover:scale-110 transition-transform duration-300">
                            {renderShape(shape, 50)}
                        </div>
                        <span className="absolute top-2 left-3 text-xs font-bold text-white/30">{String.fromCharCode(65 + i)}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
