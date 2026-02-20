import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Navigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import GameTimer from '../components/GameTimer';
import { practicePuzzles } from '../puzzles/practicePuzzles';
import { getElapsedSeconds } from '../utils/gameTimerUtils';
import GameControls from '../components/GameControls';
import ResultModal from '../components/ResultModal';
import NextPuzzleCountdown from '../components/NextPuzzleCountdown';
import StatsDisplay from '../components/StatsDisplay';
import { StreakCelebration } from '../components/StreakCelebration';
import { makeGuess } from '../features/puzzle/puzzleSlice';
import { recordWin } from '../features/stats/statsSlice';
import { getTodayDateString, getDailySeed } from '../utils/dailySeed';
import { useAutoSave, loadProgress } from '../utils/autoSave';
import { selectPuzzleForDay, getPuzzleEngine } from '../puzzles/puzzleRegistry';
import { recordDayActivity } from '../utils/activityTracker';
import { isTodayCompleted, markTodayCompleted } from '../utils/dailyReset';
import { useHint, getHintsRemaining } from '../utils/hintSystem';
import { calculateScore } from '../utils/scoring';
import { submitScore } from '../api/leaderboard';
import { updateUser } from '../features/user/userSlice';
import HelpModal from '../components/HelpModal';
import { useSound } from '../contexts/SoundContext';
import CelebrationConfetti from '../components/effects/CelebrationConfetti';

// Separate component that renders a puzzle — keeps hooks stable
const PuzzleRenderer = ({
    puzzleData,
    puzzleType,
    onInput,
    disabled,
    solution,
    hintTrigger
}: {
    puzzleData: any;
    puzzleType: any;
    onInput: (input: any) => void;
    disabled: boolean;
    solution: any;
    hintTrigger: number;
}) => {
    const engine = getPuzzleEngine(puzzleType) as any;
    const Component = engine.render;
    return <Component data={puzzleData} onInput={onInput} disabled={disabled} solution={solution} hintTrigger={hintTrigger} />;
};

interface GamePageProps {
    mode?: 'daily' | 'practice';
}

const GamePage = ({ mode = 'daily' }: GamePageProps) => {
    const { id: practiceId } = useParams();
    const dispatch = useAppDispatch();
    const { user, isAuthenticated } = useAppSelector((state) => state.user);
    const { guesses } = useAppSelector((state) => state.puzzle);
    const [showModal, setShowModal] = useState(false);
    const [showHelp, setShowHelp] = useState(false);
    const { playClick, playSuccess, playError, playPop } = useSound();

    // Restore local state
    const [puzzleData, setPuzzleData] = useState<any>(null);
    const [puzzleSolution, setPuzzleSolution] = useState<any>(null); // Store solution for hints
    const [hintTrigger, setHintTrigger] = useState(0); // Increment to trigger a hint
    const [puzzleType, setPuzzleType] = useState<string>('');
    const [completed, setCompleted] = useState(false);
    const [currentInput, setCurrentInput] = useState<any>(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [hintsRemaining, setHintsRemaining] = useState(3);
    const [hintText, setHintText] = useState<string | null>(null);
    const [scoreResult, setScoreResult] = useState<any>(null);
    const [showCelebration, setShowCelebration] = useState(false);
    const [shakeKey, setShakeKey] = useState(0); // Key to trigger shake animation
    const todayDate = getTodayDateString();

    // Auto-save current progress
    useAutoSave(
        todayDate,
        guesses,
        completed ? 'completed' : 'playing',
        startTime,
        {
            onSaveError: (error) => console.error('Auto-save error:', error)
        }
    );

    // Initialize puzzle on mount
    useEffect(() => {
        const loadPuzzle = async () => {
            try {
                if (mode === 'practice' && practiceId) {
                    const puzzle = practicePuzzles.find(p => p.id === practiceId);
                    if (puzzle) {
                        setPuzzleData(puzzle.data);
                        setPuzzleSolution(puzzle.solution);
                        setPuzzleType(puzzle.type);
                        setCompleted(false);
                        setStartTime(Date.now()); // Reset timer
                    } else {
                        alert('Puzzle not found!');
                    }
                    return;
                }

                let isComplete = isTodayCompleted();

                // Sync check: If local says done but server says no, allow retry
                if (isComplete && user?.last_played) {
                    const lastPlayedDate = new Date(user.last_played);
                    const today = new Date();
                    const isSameDay = lastPlayedDate.getDate() === today.getDate() &&
                        lastPlayedDate.getMonth() === today.getMonth() &&
                        lastPlayedDate.getFullYear() === today.getFullYear();

                    if (!isSameDay) {
                        console.log('Local completion found, but server out of sync. Allowing retry.');
                        isComplete = false;
                        setCompleted(false);
                    }
                } else if (isComplete && !isAuthenticated) {
                    // Trust local if not logged in
                }

                if (isComplete) {
                    setCompleted(true);
                }

                const seed = getDailySeed();
                const type = selectPuzzleForDay(seed);
                setPuzzleType(type);

                const engine = getPuzzleEngine(type);
                const puzzle = await engine.generate(seed);
                setPuzzleData(puzzle.data);
                setPuzzleSolution(puzzle.solution); // Store the solution

                // Restore progress if exists
                const savedProgress = await loadProgress(todayDate);
                if (savedProgress) {
                    if (savedProgress.startTime) setStartTime(savedProgress.startTime);
                    if (savedProgress.status === 'playing' && !isComplete) {
                        savedProgress.guesses.forEach(guess => {
                            dispatch(makeGuess(guess));
                        });
                    }
                }
            } catch (error) {
                console.error('Error initializing puzzle:', error);
            }
        };

        if (isAuthenticated !== undefined) {
            loadPuzzle();
        }
    }, [dispatch, todayDate, user, isAuthenticated, mode, practiceId]);

    const handleHint = () => {
        playClick();
        if (hintsRemaining > 0) {
            useHint(puzzleData, puzzleType);
            setHintsRemaining(getHintsRemaining());
            setHintTrigger(prev => prev + 1);
            setHintText("Hint applied! A cell has been revealed.");
            playPop();
            setTimeout(() => setHintText(null), 3000);
        } else {
            setHintText('No hints remaining for today!');
            setShakeKey(prev => prev + 1);
            playError();
            setTimeout(() => setHintText(null), 3000);
        }
    };

    // React to server user data for completion status
    useEffect(() => {
        if (mode !== 'practice' && user?.last_played) {
            const lastPlayedDate = new Date(user.last_played);
            const today = new Date();
            if (
                lastPlayedDate.getDate() === today.getDate() &&
                lastPlayedDate.getMonth() === today.getMonth() &&
                lastPlayedDate.getFullYear() === today.getFullYear()
            ) {
                setCompleted(true);
            }
        }
    }, [user, mode]);

    const handleSubmit = async () => {
        playClick();
        if (!currentInput) return;

        let engine;
        let solutionToValidate;

        if (mode === 'practice' && practiceId) {
            const puzzle = practicePuzzles.find(p => p.id === practiceId);
            if (!puzzle) return;
            engine = getPuzzleEngine(puzzle.type);
            solutionToValidate = puzzle.solution;
        } else {
            const seed = getDailySeed();
            const type = selectPuzzleForDay(seed);
            engine = getPuzzleEngine(type);
            const puzzle = await engine.generate(seed);
            solutionToValidate = puzzle.solution;
        }

        const isCorrect = (engine as any).validate(currentInput, solutionToValidate);

        if (isCorrect) {
            playSuccess();
            // Calculate hints used based on remaining hints
            const hintsUsed = 3 - hintsRemaining;
            const score = calculateScore(getElapsedSeconds(), hintsUsed, mode === 'practice');
            setScoreResult(score);

            // Sync puzzle completion with backend ONLY if not practice
            if (mode !== 'practice') {
                try {
                    const token = localStorage.getItem('auth_token');
                    const headers: HeadersInit = { 'Content-Type': 'application/json' };
                    if (token) headers['Authorization'] = `Bearer ${token}`;

                    const response = await fetch('/puzzle/complete', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': token ? `Bearer ${token}` : '',
                        },
                        body: JSON.stringify({
                            finalScore: score.finalScore,
                            timeSeconds: score.timeSeconds
                        }),
                        credentials: 'include',
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // Only update if we have a valid user state
                        if (user) {
                            dispatch(updateUser({
                                streak_count: data.streak_count,
                                total_points: data.total_points,
                                last_played: new Date().toISOString()
                            }));
                        }

                        // Trigger celebration if streak_count >= 2
                        if (data.streak_count >= 2) {
                            setShowCelebration(true);
                            setTimeout(() => setShowCelebration(false), 4000);
                        }
                    } else {
                        const errData = await response.json().catch(() => ({}));
                        console.error('Failed to sync. Status:', response.status, errData);
                    }
                } catch (error) {
                    console.error('Failed to sync puzzle completion:', error);
                }

                dispatch(recordWin(guesses.length));
                recordDayActivity(true);

                markTodayCompleted(true, 1);

                // Submit to leaderboard (fire-and-forget)
                const userId = user?.id || localStorage.getItem('daily-puzzle-user') || 'guest';
                submitScore(userId, todayDate, score.finalScore, score.timeSeconds).catch(() => { });
            }

            setCompleted(true);
            setShowModal(true);
        } else {
            playError();
            setShakeKey(prev => prev + 1); // Trigger shake
            recordDayActivity(false);
            // alert('Incorrect solution. Try again!'); // Removed alert in favor of visual feedback
            setHintText("Incorrect. Check your logic and try again.");
            setTimeout(() => setHintText(null), 3000);
        }
    };

    const handleCloseModal = () => {
        playClick();
        setShowModal(false);
    };

    const handlePuzzleInput = (input: any) => {
        setCurrentInput(input);
        dispatch(makeGuess(JSON.stringify(input)));
    };

    const handleShare = async () => {
        playClick();
        if (!scoreResult) return;

        const date = new Date().toLocaleDateString();
        const emoji = scoreResult.finalScore > 900 ? '🤩' : scoreResult.finalScore > 700 ? '😎' : '🤔';

        const shareText = `Logic Looper Daily #${date}\nScore: ${scoreResult.finalScore} ${emoji}\nTime: ${scoreResult.timeSeconds}s\nStreak: ${user?.streak_count || 0} 🔥\n\nCan you beat my score? Play at: logic-looper.com`;

        try {
            await navigator.clipboard.writeText(shareText);
            alert('Result copied to clipboard!');
        } catch (err) {
            console.error('Failed to copy', err);
            alert('Failed to copy result.');
        }
    };

    return (
        <Layout>
            <div className="w-full max-w-5xl mx-auto space-y-12">
                {/* Global Confetti */}
                <CelebrationConfetti isActive={completed} />

                {/* Header Section */}
                <div className="text-center space-y-4 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-32 bg-accent/20 blur-[100px] rounded-full pointer-events-none"></div>
                    <h1 className="relative text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neutral-900 via-neutral-700 to-neutral-500 dark:from-white dark:via-neutral-200 dark:to-neutral-400 drop-shadow-sm tracking-tighter">
                        Daily <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan via-accent to-accent-glow">Puzzle</span>
                    </h1>

                    {/* Help Button - Added absolute positioning */}
                    <button
                        onClick={() => {
                            playClick();
                            setShowHelp(true);
                        }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors z-20"
                        title="How to Play"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                        </svg>
                    </button>

                    <p className="relative text-neutral-600 dark:text-neutral-300 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                        One challenge. One chance. <span className="text-neutral-900 dark:text-white font-bold">Prove your logic.</span>
                    </p>
                </div>

                {/* Loading State */}
                {!puzzleData && !completed && isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-32">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin"></div>
                            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full animate-pulse"></div>
                        </div>
                        <p className="mt-8 text-neutral-400 font-medium tracking-wide uppercase text-sm">Initializing System...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {!isAuthenticated ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="text-center p-16 glass-panel rounded-[2.5rem] max-w-3xl mx-auto relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                                <h2 className="relative text-3xl font-bold text-neutral-900 dark:text-white mb-6">Enter the Arena</h2>
                                <p className="relative text-neutral-600 dark:text-neutral-300 mb-10 text-lg">Sign in to track your streak, earn points, and climb the global leaderboard.</p>
                                <div className="relative">
                                    <Navigate to="/login" />
                                </div>
                            </motion.div>
                        ) : completed ? (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="glass-panel rounded-[2.5rem] p-12 text-center space-y-10 max-w-3xl mx-auto border border-accent/20 shadow-[0_0_50px_-10px_rgba(112,0,255,0.3)]"
                            >
                                <div className="relative">
                                    <div className="absolute inset-0 bg-accent/20 blur-3xl rounded-full animate-pulse"></div>
                                    <img
                                        src="/assets/3d-models/puzzle-success.png"
                                        alt="Success!"
                                        className="relative w-40 h-40 mx-auto object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] animate-float"
                                    />
                                </div>

                                <div>
                                    <h2 className="text-5xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">Mission Complete</h2>
                                    <p className="text-neutral-600 dark:text-neutral-300 text-xl">
                                        {mode === 'practice' ? 'Great practice session! Ready for more?' : 'Excellent work, Agent. The system is secure.'}
                                    </p>
                                </div>

                                {mode === 'practice' ? (
                                    <div className="flex flex-col gap-4 items-center">
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => {
                                                    playClick();
                                                    window.location.href = '/practice';
                                                }}
                                                className="px-8 py-3 rounded-xl bg-surface-100 hover:bg-black/5 dark:hover:bg-white/10 text-neutral-900 dark:text-white font-bold border border-black/5 dark:border-white/10 transition-colors"
                                            >
                                                Back to Lab
                                            </button>
                                            <button
                                                onClick={() => {
                                                    playClick();
                                                    window.location.reload();
                                                }}
                                                className="px-8 py-3 rounded-xl bg-accent hover:bg-accent-glow text-white font-bold shadow-lg transition-all"
                                            >
                                                Replay Logic
                                            </button>
                                        </div>
                                        {scoreResult && (
                                            <button
                                                onClick={handleShare}
                                                className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors flex items-center gap-2 text-sm font-bold"
                                            >
                                                <span>📤</span> Share Result
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                                            <div className="bg-primary/40 rounded-2xl p-6 border border-black/5 dark:border-white/5">
                                                <div className="text-neutral-500 dark:text-neutral-400 text-sm uppercase tracking-wider font-bold mb-2">Next Mission</div>
                                                <NextPuzzleCountdown />
                                            </div>
                                            <div className="bg-primary/40 rounded-2xl p-6 border border-black/5 dark:border-white/5">
                                                <div className="text-neutral-500 dark:text-neutral-400 text-sm uppercase tracking-wider font-bold mb-2">Current Status</div>
                                                <StatsDisplay streak={user?.streak_count || 0} />
                                            </div>
                                        </div>
                                        {scoreResult && (
                                            <button
                                                onClick={handleShare}
                                                className="mx-auto px-8 py-3 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-neutral-900 dark:text-white font-bold rounded-xl border border-black/5 dark:border-white/10 transition-colors flex items-center gap-2"
                                            >
                                                <span>📤</span> Share Result
                                            </button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="game"
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -40 }}
                                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                className="max-w-3xl mx-auto"
                            >
                                {/* Main Puzzle Card */}
                                <motion.div
                                    key={`card-${shakeKey}`}
                                    animate={shakeKey > 0 ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                    className={`relative glass-card rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 overflow-hidden
                                        ${completed ? 'border-accent shadow-[0_0_50px_rgba(112,0,255,0.4)]' : 'shadow-2xl'}`}
                                >
                                    {/* Top Bar: Timer & Status */}
                                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/5 dark:border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse"></div>
                                            <span className="text-sm font-bold text-neutral-500 dark:text-neutral-400 tracking-widest uppercase">
                                                {mode === 'practice' ? 'Training Mode' : 'Live Mission'}
                                            </span>
                                        </div>
                                        <GameTimer
                                            startTime={startTime}
                                            isRunning={!completed}
                                        />
                                    </div>

                                    {/* Puzzle Area */}
                                    <div className="flex justify-center min-h-[300px] items-center mb-10">
                                        <PuzzleRenderer
                                            puzzleData={puzzleData}
                                            puzzleType={puzzleType}
                                            onInput={handlePuzzleInput}
                                            disabled={completed}
                                            solution={puzzleSolution}
                                            hintTrigger={hintTrigger}
                                        />
                                    </div>

                                    {/* Controls Area (Integrated) */}
                                    <div className="bg-surface-200 dark:bg-black/20 rounded-2xl p-6 border border-black/5 dark:border-white/5">
                                        <div className="flex flex-col md:flex-row items-center gap-6 justify-between">
                                            <div className="text-left w-full md:w-auto">
                                                <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">
                                                    Mission Controls
                                                </p>
                                                <p className="text-sm text-neutral-600 dark:text-neutral-300">
                                                    {hintsRemaining} hint{hintsRemaining !== 1 ? 's' : ''} available
                                                </p>
                                            </div>

                                            <div className="flex-1 w-full md:w-auto">
                                                <GameControls
                                                    onSubmit={handleSubmit}
                                                    onHint={handleHint}
                                                    hintsRemaining={hintsRemaining}
                                                    disabled={completed}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hint Alert Overlay */}
                                    <AnimatePresence>
                                        {hintText && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: 10 }}
                                                className={`absolute bottom-24 left-1/2 -translate-x-1/2 border px-6 py-3 rounded-full backdrop-blur-md shadow-lg z-20 
                                                    ${hintText.includes('Incorrect') || hintText.includes('No hints')
                                                        ? 'bg-red-500/10 border-red-500/30 text-red-500'
                                                        : 'bg-accent-cyan/10 border-accent-cyan/30 text-accent-cyan'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg">
                                                        {hintText.includes('Incorrect') || hintText.includes('No hints') ? '⚠️' : '💡'}
                                                    </span>
                                                    <span className="text-sm font-bold">{hintText}</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>

                                {/* Minimal Footer */}
                                <div className="text-center mt-6">
                                    <p className="text-neutral-500 text-xs uppercase tracking-widest">
                                        {mode === 'practice' ? 'Practice makes perfect.' : 'Accuracy is key. Good luck.'}
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

                {/* Modals and Overlays */}
                <AnimatePresence>
                    {showModal && (
                        <ResultModal
                            isWin={true}
                            score={scoreResult}
                            streak={user?.streak_count || 0}
                            onClose={handleCloseModal}
                        />
                    )}
                    {showCelebration && <StreakCelebration streak={user?.streak_count || 0} />}
                    {showHelp && (
                        <HelpModal
                            isOpen={showHelp}
                            onClose={() => setShowHelp(false)}
                            puzzleType={puzzleType}
                        />
                    )}
                </AnimatePresence>
            </div>
        </Layout >
    );
};

export default GamePage;
