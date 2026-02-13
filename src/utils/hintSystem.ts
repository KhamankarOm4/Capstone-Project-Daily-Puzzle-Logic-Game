import dayjs from 'dayjs';

const HINTS_KEY = 'daily-puzzle-hints';
const MAX_HINTS_PER_DAY = 3;

interface HintRecord {
    date: string;
    hintsUsed: number;
}

// Get today's hint record
const getHintRecord = (): HintRecord => {
    try {
        const stored = localStorage.getItem(HINTS_KEY);
        if (stored) {
            const record: HintRecord = JSON.parse(stored);
            const today = dayjs().format('YYYY-MM-DD');
            // Reset if it's a new day
            if (record.date === today) return record;
        }
    } catch { /* ignore */ }

    return { date: dayjs().format('YYYY-MM-DD'), hintsUsed: 0 };
};

const saveHintRecord = (record: HintRecord): void => {
    localStorage.setItem(HINTS_KEY, JSON.stringify(record));
};

// Get remaining hints for today
export const getHintsRemaining = (): number => {
    const record = getHintRecord();
    return Math.max(0, MAX_HINTS_PER_DAY - record.hintsUsed);
};

// Get total hints used today
export const getHintsUsed = (): number => {
    return getHintRecord().hintsUsed;
};

// Use a hint. Returns the hint text or null if none remaining.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useHint = (puzzleData: any, puzzleType: string): string | null => {
    const record = getHintRecord();

    if (record.hintsUsed >= MAX_HINTS_PER_DAY) {
        return null; // No hints left
    }

    record.hintsUsed++;
    saveHintRecord(record);

    // Generate a hint based on puzzle type and hint number
    return generateHint(puzzleData, puzzleType, record.hintsUsed);
};

// Generate contextual hints based on puzzle type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const generateHint = (data: any, puzzleType: string, hintNumber: number): string => {
    switch (puzzleType) {
        case 'numberSequence':
            if (hintNumber === 1) return `Look at the pattern: ${data.description}`;
            if (hintNumber === 2) return `Try calculating the difference between consecutive numbers.`;
            return `The sequence type is: ${data.sequenceType}`;

        case 'patternSequence':
            if (hintNumber === 1) return `This is a ${data.pattern} sequence.`;
            if (hintNumber === 2) return `The missing number is at position ${data.missingIndex + 1}.`;
            return `Look at the relationship between adjacent numbers.`;

        case 'miniSudoku':
            if (hintNumber === 1) return `Each row must contain numbers 1-4 with no repeats.`;
            if (hintNumber === 2) return `Each column must also contain 1-4 with no repeats.`;
            return `Check the 2×2 boxes — each must have 1, 2, 3, and 4.`;

        case 'binaryGrid':
            if (hintNumber === 1) return `Each row and column must have exactly three 0s and three 1s.`;
            if (hintNumber === 2) return `No more than two consecutive same digits allowed.`;
            return `Start with rows or columns that already have several filled cells.`;

        case 'deductionGrid':
            if (hintNumber === 1) return `Each person matches exactly one item.`;
            if (hintNumber === 2) return `Use process of elimination — if a row has an ✓, all other cells in that row are ✗.`;
            return `Read the clues carefully — they tell you exactly which person likes which item.`;

        default:
            return `Think carefully about the pattern!`;
    }
};

export const MAX_HINTS = MAX_HINTS_PER_DAY;
