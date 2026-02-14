import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine'; // eslint-disable-line @typescript-eslint/no-unused-vars

interface NumberSeqData {
    sequence: number[];
    sequenceType: string;
    description: string;
}

interface NumberSeqSolution {
    nextNumber: number;
}

type NumberSeqInput = number | null;

const generateNumberSequence = (seed: string): { sequence: number[]; nextNumber: number; type: string; description: string } => {
    const seedNum = parseInt(seed.substring(0, 8), 16);
    const types = ['fibonacci', 'squares', 'primes', 'powers-of-2'];
    const seqType = types[seedNum % types.length];

    let sequence: number[] = [];
    let nextNumber = 0;
    let description = '';

    switch (seqType) {
        case 'fibonacci':
            const start = (seedNum % 5) + 1;
            sequence = [start, start + 1];
            for (let i = 0; i < 4; i++) {
                sequence.push(sequence[sequence.length - 1] + sequence[sequence.length - 2]);
            }
            nextNumber = sequence[sequence.length - 1] + sequence[sequence.length - 2];
            description = 'Each number is the sum of the previous two';
            break;
        case 'squares':
            const offset = (seedNum % 3) + 1;
            sequence = Array.from({ length: 6 }, (_, i) => Math.pow(i + offset, 2));
            nextNumber = Math.pow(sequence.length + offset, 2);
            description = 'Perfect squares';
            break;
        case 'primes':
            const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
            const startIdx = seedNum % 3;
            sequence = primes.slice(startIdx, startIdx + 6);
            nextNumber = primes[startIdx + 6];
            description = 'Prime numbers';
            break;
        case 'powers-of-2':
            const exp = (seedNum % 3) + 1;
            sequence = Array.from({ length: 6 }, (_, i) => Math.pow(2, i + exp));
            nextNumber = Math.pow(2, sequence.length + exp);
            description = 'Powers of 2';
            break;
    }

    return { sequence, nextNumber, type: seqType, description };
};

export const NumberSequenceEngine: PuzzleEngine<NumberSeqData, NumberSeqSolution, NumberSeqInput> = {
    async generate(seed: string): Promise<PuzzleInstance<NumberSeqData, NumberSeqSolution>> {
        const { sequence, nextNumber, type, description } = generateNumberSequence(seed);

        return {
            id: `number-seq-${seed}`,
            seed,
            data: {
                sequence,
                sequenceType: type,
                description
            },
            solution: { nextNumber }
        };
    },

    render: ({ data, onInput, disabled, solution, hintTrigger }) => {
        const [answer, setAnswer] = useState<string>('');

        useEffect(() => {
            if (hintTrigger > 0) {
                setAnswer(solution.nextNumber.toString());
                onInput(solution.nextNumber);
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
                    <span className="text-8xl font-black text-white">#</span>
                </div>

                <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-3xl font-black text-white tracking-tighter">Number <span className="text-accent-glow">Sequence</span></h3>
                    <p className="text-neutral-300 text-sm font-medium">{data.description || 'Find the pattern and enter the next number.'}</p>
                </div>

                <div className="w-full flex-1 flex flex-col items-center justify-center gap-8 relative z-10">
                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-black/20 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
                        {data.sequence.map((num, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-2xl sm:text-3xl font-bold text-white bg-surface-100 rounded-2xl border border-white/10 shadow-lg group-hover:-translate-y-2 group-hover:shadow-[0_10px_30px_-5px_rgba(112,0,255,0.3)] group-hover:bg-surface-200 transition-all duration-300">
                                    {num}
                                </div>
                                {i < data.sequence.length - 1 && (
                                    <div className="text-white/20 text-xl font-light hidden sm:block">→</div>
                                )}
                            </div>
                        ))}

                        <div className="flex items-center gap-4">
                            <div className="text-3xl font-light text-accent-glow animate-pulse hidden sm:block">→</div>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={answer}
                                    onChange={(e) => handleChange(e.target.value)}
                                    disabled={disabled}
                                    placeholder="?"
                                    className="w-24 h-20 sm:w-28 sm:h-24 text-center text-3xl sm:text-4xl font-black bg-black/40 text-accent-glow border-2 border-accent/30 rounded-2xl focus:border-accent focus:bg-black/60 focus:ring-4 focus:ring-accent/20 outline-none transition-all placeholder:text-white/10 shadow-[0_0_20px_rgba(112,0,255,0.2)]"
                                />
                                <div className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    },

    validate: (userInput: NumberSeqInput, solution: NumberSeqSolution): boolean => {
        return userInput === solution.nextNumber;
    },

    getHint: (solution: NumberSeqSolution, _currentInput: NumberSeqInput): string | null => {
        return `The answer is ${solution.nextNumber}`;
    },

    calculateDifficulty: (_data: NumberSeqData): number => {
        return 2;
    },

    calculateScore: defaultCalculateScore
};
