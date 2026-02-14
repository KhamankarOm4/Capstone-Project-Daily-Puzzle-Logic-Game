
export interface ScoreBreakdown {
    baseScore: number;
    timeSeconds: number;
    timePenalty: number;
    hintsUsed: number;
    hintPenalty: number;
    perfectBonus: number;
    finalScore: number;
    grade: string;
    gradeColor: string;
}

export const defaultCalculateScore = (timeSeconds: number, hintsUsed: number): number => {
    // Legacy support wrapper
    return calculateScore(timeSeconds, hintsUsed).finalScore;
};

export const calculateScore = (timeSeconds: number, hintsUsed: number, isPractice: boolean = false): ScoreBreakdown => {
    const baseScore = 1000;

    // Time penalty: -1 point per second (capped at 500)
    const timePenalty = Math.min(500, Math.floor(timeSeconds * 1));

    // Hint penalty: -150 points per hint
    const hintPenalty = hintsUsed * 150;

    // Perfect bonus: +200 if no hints and under 2 minutes (120s)
    let perfectBonus = 0;
    if (hintsUsed === 0 && timeSeconds < 120) {
        perfectBonus = 200;
    }

    let finalScore = baseScore - timePenalty - hintPenalty + perfectBonus;
    if (finalScore < 0) finalScore = 0;

    // Determine Grade
    let grade = 'C';
    let gradeColor = 'text-gray-400';

    if (finalScore >= 1100) {
        grade = 'S';
        gradeColor = 'text-yellow-400';
    } else if (finalScore >= 900) {
        grade = 'A';
        gradeColor = 'text-green-500';
    } else if (finalScore >= 700) {
        grade = 'B';
        gradeColor = 'text-blue-500';
    } else if (finalScore >= 500) {
        grade = 'C';
        gradeColor = 'text-orange-500';
    } else {
        grade = 'D';
        gradeColor = 'text-red-500';
    }

    return {
        baseScore,
        timeSeconds,
        timePenalty,
        hintsUsed,
        hintPenalty,
        perfectBonus,
        finalScore,
        grade,
        gradeColor
    };
};
