import { type FC } from 'react';

// Generic types for Puzzle components
// TData: The structure of the puzzle data (what gets rendered)
// TSolution: The structure of the solution (what validates the input)
// TInput: The structure of the user's input

export interface PuzzleInstance<TData, TSolution> {
    id: string;
    seed: string;
    data: TData;
    solution: TSolution;
}

export interface PuzzleProps<TData, TSolution, TInput> {
    data: TData;
    onInput: (input: TInput) => void;
    disabled: boolean;
    solution: TSolution;
    hintTrigger: number;
}

export interface PuzzleLogic<TData, TSolution, TInput> {
    /**
     * Generates a unique puzzle based on a seed string (e.g., "SHA256(YYYY-MM-DD)").
     * Should be deterministic.
     */
    generate(seed: string): Promise<PuzzleInstance<TData, TSolution>>;

    /**
     * Validates the user's input against the correct solution.
     */
    validate(userInput: TInput, solution: TSolution): boolean;

    /**
     * Provides a hint based on the current solution and input.
     */
    getHint(solution: TSolution, currentInput: TInput): string | null;

    /**
     * Calculates the difficulty rating of the generated puzzle (e.g., 1-10).
     */
    calculateDifficulty(data: TData): number;

    /**
     * Calculates a score (0-100 or similar) based on performance.
     * @deprecated Use specific scoring utility instead if possible, but kept for compatibility/extension.
     */
    calculateScore(timeSeconds: number, hintsUsed: number): number;
}

export interface PuzzleEngine<TData, TSolution, TInput> extends PuzzleLogic<TData, TSolution, TInput> {
    /**
     * The React component that renders the puzzle UI.
     */
    render: FC<PuzzleProps<TData, TSolution, TInput>>;
}

// Default score calculator
export const defaultCalculateScore = (timeSeconds: number, hintsUsed: number): number => {
    // Base score 1000
    let score = 1000;

    // Time penalty: -1 point per second
    score -= timeSeconds;

    // Hint penalty: -100 points per hint
    score -= (hintsUsed * 100);

    return Math.max(0, score);
};
