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
    async generatePuzzle(seed: string): Promise<PuzzleInstance<PatternData, PatternSolution>> {
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

    PuzzleComponent: ({ data, onInput, disabled, solution, hintTrigger }) => {
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
            <div className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-bold">Pattern Sequence</h3>
                <p className="text-sm text-gray-600">Find the missing number in the sequence</p>
                <div className="flex items-center gap-3">
                    {data.sequence.map((num, i) => (
                        <div key={i}>
                            {num === -1 ? (
                                <input
                                    type="number"
                                    value={answer}
                                    onChange={(e) => handleChange(e.target.value)}
                                    disabled={disabled}
                                    className="w-16 h-16 text-center text-xl font-bold border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                                    placeholder="?"
                                />
                            ) : (
                                <div className="w-16 h-16 flex items-center justify-center text-xl font-bold bg-gray-100 rounded-lg border-2 border-gray-300">
                                    {num}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 italic">Pattern: {data.pattern}</p>
            </div>
        );
    },

    validateSolution(userInput: PatternInput, solution: PatternSolution): boolean {
        return userInput === solution.answer;
    },

    calculateScore: defaultCalculateScore
};
