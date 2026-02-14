import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine';

interface PatternData {
    sequence: number[];
    missingIndex: number;
    pattern: string;
}

interface PatternSolution {
    answer: number;
}

type PatternInput = number | null;

// Generate different sequence types
const generateSequence = (seed: string, type: 'arithmetic' | 'geometric' | 'fibonacci'): number[] => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const start = (seedNum % 10) + 1;
    const diff = (seedNum % 5) + 2;

    switch (type) {
        case 'arithmetic':
            return Array.from({ length: 6 }, (_, i) => start + i * diff);
        case 'geometric':
            return Array.from({ length: 6 }, (_, i) => start * Math.pow(2, i));
        case 'fibonacci': {
            const fib = [start, start + diff];
            for (let i = 2; i < 6; i++) {
                fib.push(fib[i - 1] + fib[i - 2]);
            }
            return fib;
        }
        default:
            return [];
    }
};

export const PatternSequenceEngine: PuzzleEngine<PatternData, PatternSolution, PatternInput> = {
    async generate(seed: string): Promise<PuzzleInstance<PatternData, PatternSolution>> {
        const seedNum = parseInt(seed.substring(0, 8), 16);
        const types: ('arithmetic' | 'geometric' | 'fibonacci')[] = ['arithmetic', 'geometric', 'fibonacci'];
        const patternType = types[seedNum % types.length];

        const fullSequence = generateSequence(seed, patternType);
        const missingIndex = (seedNum % 4) + 1; // Remove element at index 1-4
        const answer = fullSequence[missingIndex];

        const displaySequence = [...fullSequence];
        displaySequence[missingIndex] = -1; // Placeholder for missing

        return {
            id: `pattern-${seed}`,
            seed,
            data: {
                sequence: displaySequence,
                missingIndex,
                pattern: patternType
            },
            solution: { answer }
        };
    },

    render: ({ data, onInput, disabled, solution, hintTrigger }) => {
        const [answer, setAnswer] = useState<string>('');

        useEffect(() => {
            if (hintTrigger > 0) {
                // For pattern, just reveal the answer
                setAnswer(solution.answer.toString());
                onInput(solution.answer);
            }
        }, [hintTrigger, onInput, solution]);

        const handleChange = (value: string) => {
            setAnswer(value);
            const num = parseInt(value);
            onInput(isNaN(num) ? null : num);
        };

        return (
            <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto p-10 glass-panel rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                    <span className="text-8xl font-black text-white">?</span>
                </div>

                <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-3xl font-black text-white tracking-tighter">Pattern <span className="text-accent-glow">Sequence</span></h3>
                    <p className="text-neutral-300 text-sm font-medium">Find the missing number in the sequence</p>
                </div>

                <div className="w-full flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        {data.sequence.map((num, i) => (
                            <div key={i} className="relative group">
                                {num === -1 ? (
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-accent-glow/20 blur-xl animate-pulse"></div>
                                        <input
                                            type="number"
                                            value={answer}
                                            onChange={(e) => handleChange(e.target.value)}
                                            disabled={disabled}
                                            placeholder="?"
                                            className="w-16 h-16 sm:w-20 sm:h-20 text-center text-2xl sm:text-3xl font-black bg-black/40 text-accent-glow border-2 border-accent/50 rounded-xl focus:border-accent focus:bg-black/60 focus:ring-4 focus:ring-accent/20 outline-none transition-all placeholder:text-white/10 shadow-[0_0_20px_rgba(99,102,241,0.5)] relative z-10"
                                        />
                                    </div>
                                ) : (
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-xl sm:text-2xl font-bold text-white bg-surface-100 rounded-xl border border-white/10 shadow-lg group-hover:-translate-y-1 group-hover:bg-surface-200 transition-all duration-300">
                                        {num}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="bg-surface-100 px-6 py-2 rounded-full border border-white/10 shadow-lg">
                        <p className="text-xs text-neutral-400 uppercase tracking-widest font-bold flex items-center gap-2">
                            Pattern Detected:
                            <span className="text-white bg-white/10 px-2 py-0.5 rounded border border-white/5">{data.pattern}</span>
                        </p>
                    </div>
                </div>
            </div>
        );
    },

    validate: (userInput: PatternInput, solution: PatternSolution): boolean => {
        return userInput === solution.answer;
    },

    getHint: (solution: PatternSolution, _currentInput: PatternInput): string | null => {
        return `The answer is ${solution.answer}`;
    },

    calculateDifficulty: (_data: PatternData): number => {
        return 3;
    },

    calculateScore: defaultCalculateScore
};
