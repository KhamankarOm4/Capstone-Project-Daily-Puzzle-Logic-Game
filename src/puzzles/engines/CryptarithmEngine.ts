import { type PuzzleLogic, type PuzzleInstance, defaultCalculateScore } from '../PuzzleEngine';

// Types
export interface CryptarithmData {
    equation: string[]; // ["SEND", "+", "MORE", "=", "MONEY"]
    uniqueLetters: string[]; // ["S", "E", "N", "D", "M", "O", "R", "Y"]
}

export interface CryptarithmSolution {
    mapping: { [key: string]: number }; // S: 9, E: 5, etc.
}

export type CryptarithmInput = { [key: string]: string }; // User input for each letter (string to allow "")

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

export const CryptarithmEngine: PuzzleLogic<CryptarithmData, CryptarithmSolution, CryptarithmInput> = {
    async generate(seed: string): Promise<PuzzleInstance<CryptarithmData, CryptarithmSolution>> {
        const { data, solution } = generateCryptarithmPuzzle(seed);
        return {
            id: `cryptarithm-${seed}`,
            seed,
            data,
            solution
        };
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
