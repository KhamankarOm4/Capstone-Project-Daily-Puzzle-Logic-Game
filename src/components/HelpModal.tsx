import { motion, AnimatePresence } from 'framer-motion';
import { puzzleInstructions } from '../puzzles/puzzleInstructions';
import type { PuzzleType } from '../puzzles/puzzleRegistry';

interface HelpModalProps {
    isOpen: boolean;
    onClose: () => void;
    puzzleType: string;
}

const HelpModal = ({ isOpen, onClose, puzzleType }: HelpModalProps) => {
    // Fallback if puzzle type is generic or unknown
    const instruction = puzzleInstructions[puzzleType as PuzzleType] || {
        title: 'Puzzle Instructions',
        description: 'Solve the puzzle using logic and deduction.',
        rules: ['Follow the visual cues provided.', 'Use hints if you get stuck.']
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-surface-100 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-white pr-4">
                                How to Play: {instruction.title}
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-white/70 hover:text-white transition-colors text-xl font-bold bg-white/10 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/20"
                            >
                                ×
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <div className="bg-surface-200 dark:bg-primary/30 p-4 rounded-xl border border-black/5 dark:border-white/5">
                                <p className="text-neutral-700 dark:text-neutral-200 leading-relaxed font-medium">
                                    {instruction.description}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-sm uppercase tracking-wider text-accent-cyan font-bold">Rules</h3>
                                <ul className="space-y-3">
                                    {instruction.rules.map((rule, idx) => (
                                        <li key={idx} className="flex gap-3 text-neutral-600 dark:text-neutral-300 text-sm">
                                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2"></span>
                                            <span>{rule}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-neutral-900 dark:bg-white/10 hover:bg-neutral-800 dark:hover:bg-white/15 text-white font-bold rounded-xl transition-colors border border-transparent dark:border-white/5"
                            >
                                Got it, let's play!
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default HelpModal;
