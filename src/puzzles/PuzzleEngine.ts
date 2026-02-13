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

export interface PuzzleEngine<TData, TSolution, TInput> {
    /**
     * Generates a unique puzzle based on a seed string (e.g., "2023-10-27").
     * Should be deterministic.
     */
    generatePuzzle(seed: string): Promise<PuzzleInstance<TData, TSolution>>;

    /**
     * The React component that renders the puzzle UI.
     */
    PuzzleComponent: FC<PuzzleProps<TData, TSolution, TInput>>;

    /**
     * Validates the user's input against the correct solution.
     */
    validateSolution(userInput: TInput, solution: TSolution): boolean;

    /**
     * Calculates a score (0-100 or similar) based on performance.
     */
    calculateScore(timeSeconds: number, hintsUsed: number): number;
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
