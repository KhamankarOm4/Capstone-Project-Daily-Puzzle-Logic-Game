import { getHintsUsed } from './hintSystem';

const BASE_SCORE = 1000;
const TIME_PENALTY_PER_SECOND = 2;    // −2 points per second
const HINT_PENALTY = 100;              // −100 points per hint
const MAX_TIME_PENALTY = 600;          // Cap at 5 minutes worth
const PERFECT_BONUS = 200;             // Bonus for no hints + under 60s

export interface ScoreBreakdown {
    baseScore: number;
    timePenalty: number;
    hintPenalty: number;
    perfectBonus: number;
    finalScore: number;
    timeSeconds: number;
    hintsUsed: number;
    grade: string;          // S, A, B, C, D
    gradeColor: string;     // Tailwind color class
}

// Calculate score after puzzle completion
export const calculateScore = (timeSeconds: number, isPractice = false): ScoreBreakdown => {
    if (isPractice) {
        return {
            baseScore: 100,
            timePenalty: 0,
            hintPenalty: 0,
            perfectBonus: 0,
            finalScore: 100,
            timeSeconds,
            hintsUsed: 0,
            grade: 'P',
            gradeColor: 'text-blue-500'
        };
    }

    const hintsUsed = getHintsUsed();

    const timePenalty = Math.min(timeSeconds * TIME_PENALTY_PER_SECOND, MAX_TIME_PENALTY);
    const hintPenalty = hintsUsed * HINT_PENALTY;
    const perfectBonus = (hintsUsed === 0 && timeSeconds < 60) ? PERFECT_BONUS : 0;

    const finalScore = Math.max(0, BASE_SCORE - timePenalty - hintPenalty + perfectBonus);

    const grade = getGrade(finalScore);

    return {
        baseScore: BASE_SCORE,
        timePenalty: Math.round(timePenalty),
        hintPenalty,
        perfectBonus,
        finalScore: Math.round(finalScore),
        timeSeconds,
        hintsUsed,
        grade: grade.letter,
        gradeColor: grade.color
    };
};

const getGrade = (score: number): { letter: string; color: string } => {
    if (score >= 1100) return { letter: 'S', color: 'text-yellow-500' };  // Perfect + bonus
    if (score >= 900) return { letter: 'A', color: 'text-green-500' };
    if (score >= 700) return { letter: 'B', color: 'text-blue-500' };
    if (score >= 400) return { letter: 'C', color: 'text-orange-500' };
    return { letter: 'D', color: 'text-red-500' };
};

// Format score for display
export const formatScore = (score: number): string => {
    return score.toLocaleString();
};
