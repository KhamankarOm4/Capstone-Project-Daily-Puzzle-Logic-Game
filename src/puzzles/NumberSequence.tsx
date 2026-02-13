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
    async generatePuzzle(seed: string): Promise<PuzzleInstance<NumberSeqData, NumberSeqSolution>> {
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

    PuzzleComponent: ({ data, onInput, disabled, solution, hintTrigger }) => {
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
            <div className="flex flex-col items-center gap-4">
                <h3 className="text-xl font-bold">Number Sequence</h3>
                <p className="text-sm text-gray-600">{data.description}</p>
                <div className="flex items-center gap-3">
                    {data.sequence.map((num, i) => (
                        <div key={i} className="w-16 h-16 flex items-center justify-center text-xl font-bold bg-gray-100 rounded-lg border-2 border-gray-300">
                            {num}
                        </div>
                    ))}
                    <div className="text-2xl font-bold text-gray-400">→</div>
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => handleChange(e.target.value)}
                        disabled={disabled}
                        className="w-20 h-16 text-center text-xl font-bold border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-black"
                        placeholder="?"
                    />
                </div>
            </div>
        );
    },

    validateSolution(userInput: NumberSeqInput, solution: NumberSeqSolution): boolean {
        return userInput === solution.nextNumber;
    },

    calculateScore: defaultCalculateScore
};
