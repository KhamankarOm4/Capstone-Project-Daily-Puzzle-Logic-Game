import { useState, useEffect } from 'react';
import { type PuzzleEngine, type PuzzleInstance, defaultCalculateScore } from './PuzzleEngine';

// Types
interface CryptarithmData {
    equation: string[]; // ["SEND", "+", "MORE", "=", "MONEY"]
    uniqueLetters: string[]; // ["S", "E", "N", "D", "M", "O", "R", "Y"]
}

interface CryptarithmSolution {
    mapping: { [key: string]: number }; // S: 9, E: 5, etc.
}

type CryptarithmInput = { [key: string]: string }; // User input for each letter (string to allow "")

// Generator
const generateCryptarithmPuzzle = (seed: string): { data: CryptarithmData, solution: CryptarithmSolution } => {
    const seedNum = parseInt(seed.substring(0, 8), 16);

    // Simple generator: Number -> Letters
    // 1. Generate numbers
    // 2-3 digit numbers to keep it simple but interesting
    const n1 = (seedNum % 800) + 100; // 100-899
    const n2 = ((seedNum * 7) % 800) + 100; // 100-899
    const result = n1 + n2;

    const s1 = n1.toString();
    const s2 = n2.toString();
    const s3 = result.toString();

    // 2. Map digits to letters
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    // Shuffle alphabet deterministically
    const shuffled = alphabet.split('');
    for (let i = 0; i < shuffled.length; i++) {
        const j = (seedNum + i * 13) % shuffled.length;
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const digitToLetter: string[] = [];
    const usedLetters = new Set<string>();

    // Prefer letters that make it look like words?
    // Hard without dictionary. Random letters is safer logic-wise.
    // Let's just assign unique letters to the unique digits present.
    const uniqueDigits = Array.from(new Set((s1 + s2 + s3).split('')));
    const mapping: { [key: string]: number } = {};

    uniqueDigits.forEach((d, i) => {
        const letter = shuffled[i];
        digitToLetter[parseInt(d)] = letter;
        mapping[letter] = parseInt(d);
        usedLetters.add(letter);
    });

    const toWord = (n: string) => n.split('').map(d => digitToLetter[parseInt(d)]).join('');

    const w1 = toWord(s1);
    const w2 = toWord(s2);
    const w3 = toWord(s3);

    return {
        data: {
            equation: [w1, "+", w2, "=", w3],
            uniqueLetters: Array.from(usedLetters).sort()
        },
        solution: { mapping }
    };
};

export const CryptarithmEngine: PuzzleEngine<CryptarithmData, CryptarithmSolution, CryptarithmInput> = {
    async generate(seed: string): Promise<PuzzleInstance<CryptarithmData, CryptarithmSolution>> {
        const { data, solution } = generateCryptarithmPuzzle(seed);
        return {
            id: `cryptarithm-${seed}`,
            seed,
            data,
            solution
        };
    },

    render: ({ data, onInput, disabled, solution, hintTrigger }) => {
        const [inputs, setInputs] = useState<CryptarithmInput>({});

        // Initialize inputs
        useEffect(() => {
            const init: CryptarithmInput = {};
            data.uniqueLetters.forEach(l => init[l] = "");
            setInputs(prev => ({ ...init, ...prev }));
        }, [data.uniqueLetters]);

        useEffect(() => {
            if (hintTrigger > 0) {
                // Reveal one unknown letter
                const unrevealed = data.uniqueLetters.filter(l => inputs[l] !== solution.mapping[l].toString());
                if (unrevealed.length > 0) {
                    const target = unrevealed[Math.floor(Math.random() * unrevealed.length)];
                    const newInputs = { ...inputs, [target]: solution.mapping[target].toString() };
                    setInputs(newInputs);
                    onInput(newInputs);
                }
            }
        }, [hintTrigger, onInput, solution, inputs, data.uniqueLetters]);

        const handleChange = (letter: string, val: string) => {
            if (disabled) return;
            if (!/^[0-9]?$/.test(val)) return; // Only 0-9 or empty

            const newInputs = { ...inputs, [letter]: val };
            setInputs(newInputs);
            onInput(newInputs);
        };

        const w1 = data.equation[0];
        const w2 = data.equation[2];
        const w3 = data.equation[4];

        return (
            <div className="flex flex-col items-center gap-8 w-full max-w-3xl mx-auto p-8 glass-panel rounded-3xl relative overflow-hidden">
                <div className="text-center space-y-2 relative z-10">
                    <h3 className="text-3xl font-black text-white">Crypt<span className="text-accent-glow">arithm</span></h3>
                    <p className="text-neutral-300 text-sm">Decode the letters to make the math correct.</p>
                </div>

                {/* Equation Display */}
                <div className="flex flex-col items-end font-mono text-4xl md:text-6xl text-white tracking-widest bg-black/20 p-8 rounded-2xl border border-white/10 shadow-lg">
                    <div className="flex gap-2">
                        {w1.split('').map((l, i) => (
                            <span key={i} className={inputs[l] ? "text-accent-cyan" : ""}>
                                {inputs[l] || l}
                            </span>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-accent-glow mr-4">+</span>
                        {w2.split('').map((l, i) => (
                            <span key={i} className={inputs[l] ? "text-accent-cyan" : ""}>
                                {inputs[l] || l}
                            </span>
                        ))}
                    </div>
                    <div className="w-full h-1 bg-white/20 my-2"></div>
                    <div className="flex gap-2">
                        {w3.split('').map((l, i) => (
                            <span key={i} className={inputs[l] ? "text-accent-cyan" : ""}>
                                {inputs[l] || l}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Input Area */}
                <div className="grid grid-cols-5 gap-4">
                    {data.uniqueLetters.map(l => (
                        <div key={l} className="flex flex-col items-center gap-2">
                            <div className="text-xl font-bold text-white/50">{l}</div>
                            <input
                                type="text"
                                maxLength={1}
                                value={inputs[l] || ""}
                                onChange={(e) => handleChange(l, e.target.value)}
                                disabled={disabled}
                                className="w-12 h-14 bg-surface-100 border border-white/10 rounded-lg text-center text-2xl font-bold text-white focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 transition-all"
                            />
                        </div>
                    ))}
                </div>
            </div>
        );
    },

    validate: (userInput: CryptarithmInput, solution: CryptarithmSolution): boolean => {
        // Strict match of mapping
        for (const key of Object.keys(solution.mapping)) {
            if (userInput[key] !== solution.mapping[key].toString()) return false;
        }
        return true;
    },

    getHint: (_solution: CryptarithmSolution, _currentInput: CryptarithmInput): string | null => {
        return "Each letter corresponds to a unique digit (0-9).";
    },

    calculateDifficulty: (_data: CryptarithmData): number => {
        return 6;
    },

    calculateScore: defaultCalculateScore
};
