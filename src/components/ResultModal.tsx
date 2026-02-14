import { motion } from 'framer-motion';
import { successPop, successGrade } from './animations';
import type { ScoreBreakdown } from '../utils/scoring';
import { useState } from 'react';

interface ResultModalProps {
    onClose: () => void;
    isWin: boolean;
    score?: ScoreBreakdown;
    streak?: number;
}

const ResultModal = ({ onClose, isWin, score, streak }: ResultModalProps) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        if (!score) return;

        const date = new Date().toLocaleDateString();
        const emoji = score.finalScore > 900 ? '🤩' : score.finalScore > 700 ? '😎' : '🤔';

        const shareText = `Logic Looper Daily #${date}\nScore: ${score.finalScore} ${emoji}\nTime: ${score.timeSeconds}s\nStreak: ${streak} 🔥\n\nCan you beat my score? Play at: logic-looper.com`;

        try {
            await navigator.clipboard.writeText(shareText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy', err);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
        >
            <motion.div
                variants={successPop}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-3xl p-10 max-w-md w-full shadow-2xl text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                    className="text-6xl mb-4"
                >
                    {isWin ? '🎉' : '😅'}
                </motion.div>

                <h2 className={`text-3xl font-bold mb-2 ${isWin ? 'text-green-600' : 'text-orange-600'} `}>
                    {isWin ? 'Amazing!' : 'Not Quite!'}
                </h2>

                <p className="text-gray-500 mb-6">
                    {isWin ? "You solved today's puzzle!" : 'Keep trying! You can do it!'}
                </p>

                {/* Streak badge */}
                {isWin && streak && streak >= 2 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-red-100 px-5 py-2 rounded-full mb-6"
                    >
                        <span className="text-2xl">🔥</span>
                        <span className="text-lg font-bold text-orange-600">{streak} day streak!</span>
                    </motion.div>
                )}

                {/* Score breakdown */}
                {isWin && score && (
                    <div className="mb-6">
                        {/* Grade */}
                        <motion.div
                            variants={successGrade}
                            initial="hidden"
                            animate="visible"
                            className="mb-4"
                        >
                            <span className={`text-7xl font-black ${score.gradeColor} `}>
                                {score.grade}
                            </span>
                        </motion.div>

                        {/* Final score */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="text-4xl font-bold text-gray-800 mb-4"
                        >
                            {score.finalScore.toLocaleString()} <span className="text-lg text-gray-400">pts</span>
                        </motion.div>

                        {/* Breakdown */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-gray-50 rounded-xl p-4 text-left space-y-2"
                        >
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Base score</span>
                                <span className="font-mono font-bold text-gray-800">+{score.baseScore}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Time ({score.timeSeconds}s)</span>
                                <span className="font-mono font-bold text-red-500">−{score.timePenalty}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Hints ({score.hintsUsed} used)</span>
                                <span className="font-mono font-bold text-red-500">
                                    {score.hintPenalty > 0 ? `−${score.hintPenalty} ` : '−0'}
                                </span>
                            </div>
                            {score.perfectBonus > 0 && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Perfect bonus ⭐</span>
                                    <span className="font-mono font-bold text-green-500">+{score.perfectBonus}</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-2 flex justify-between text-sm font-bold">
                                <span className="text-gray-800">Total</span>
                                <span className="font-mono text-gray-800">{score.finalScore}</span>
                            </div>
                        </motion.div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="w-full px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                    >
                        {isWin ? 'Done' : 'Try Again'}
                    </motion.button>

                    {isWin && (
                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleShare}
                            className="w-full px-8 py-3 bg-gray-100 text-gray-700 text-lg font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                        >
                            {copied ? (
                                <><span>✅</span> Copied!</>
                            ) : (
                                <><span>📤</span> Share Result</>
                            )}
                        </motion.button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ResultModal;
