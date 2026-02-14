"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultCalculateScore = void 0;
// Default score calculator
const defaultCalculateScore = (timeSeconds, hintsUsed) => {
    // Base score 1000
    let score = 1000;
    // Time penalty: -1 point per second
    score -= timeSeconds;
    // Hint penalty: -100 points per hint
    score -= (hintsUsed * 100);
    return Math.max(0, score);
};
exports.defaultCalculateScore = defaultCalculateScore;
