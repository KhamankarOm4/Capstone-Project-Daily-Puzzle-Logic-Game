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
    const Component = engine.PuzzleComponent;
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
                        // FIX: Wrap in expected data structure (grid + initialGrid)
                        // Engine expects { grid: ..., initialGrid: ... }
                        setPuzzleData({
                            grid: puzzle.initialBoard.map(row => [...row]),
                            initialGrid: puzzle.initialBoard.map(row => [...row])
                        });
                        setPuzzleSolution({ grid: puzzle.solution }); // Also fix solution structure if needed
                        setPuzzleType(puzzle.type);
                        setCompleted(false);
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
                const puzzle = await engine.generatePuzzle(seed);
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
        if (hintsRemaining > 0) {
            useHint(puzzleData, puzzleType);
            setHintsRemaining(getHintsRemaining());
            setHintTrigger(prev => prev + 1);
            setHintText("Hint applied! A cell has been revealed.");
            setTimeout(() => setHintText(null), 3000);
        } else {
            setHintText('No hints remaining for today!');
            setTimeout(() => setHintText(null), 3000);
        }
    };

    // React to server user data for completion status
    useEffect(() => {
        if (user?.last_played) {
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
    }, [user]);

    const handleSubmit = async () => {
        if (!currentInput) return;

        let engine;
        let solutionToValidate;

        if (mode === 'practice' && practiceId) {
            const puzzle = practicePuzzles.find(p => p.id === practiceId);
            if (!puzzle) return;
            engine = getPuzzleEngine(puzzle.type);
            solutionToValidate = { grid: puzzle.solution };
        } else {
            const seed = getDailySeed();
            const type = selectPuzzleForDay(seed);
            engine = getPuzzleEngine(type);
            const puzzle = await engine.generatePuzzle(seed);
            solutionToValidate = puzzle.solution;
        }

        const isCorrect = (engine as any).validateSolution(currentInput, solutionToValidate);

        if (isCorrect) {
            const score = calculateScore(getElapsedSeconds(), mode === 'practice');
            setScoreResult(score);

            // Sync puzzle completion with backend
            try {
                const response = await fetch('http://localhost:3001/api/puzzle/complete', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ score: score.finalScore }),
                    credentials: 'include',
                });
                if (response.ok) {
                    const data = await response.json();
                    dispatch(updateUser({
                        streak_count: data.streak,
                        total_points: data.total_points
                    }));

                    // Trigger celebration if streak >= 2
                    if (data.streak >= 2) {
                        setShowCelebration(true);
                        setTimeout(() => setShowCelebration(false), 4000);
                    }
                } else {
                    const errData = await response.json().catch(() => ({}));
                    console.error('Failed to sync. Status:', response.status, errData);
                    alert(`Score not saved! Server error: ${response.status}\nDetails: ${errData.details || errData.error || 'Unknown'}`);
                }
            } catch (error) {
                console.error('Failed to sync puzzle completion:', error);
                alert('Connection error. Score not saved.');
            }

            dispatch(recordWin(guesses.length));
            recordDayActivity(true);

            markTodayCompleted(true, 1);
            setCompleted(true);

            // Submit to leaderboard (fire-and-forget)
            const userId = localStorage.getItem('daily-puzzle-user') || 'guest';
            submitScore(userId, todayDate, score.finalScore, score.timeSeconds).catch(() => { });

            setShowModal(true);
        } else {
            recordDayActivity(false);
            alert('Incorrect solution. Try again!');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePuzzleInput = (input: any) => {
        setCurrentInput(input);
        dispatch(makeGuess(JSON.stringify(input)));
    };

    return (
        <Layout>
            <div className="w-full max-w-4xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 drop-shadow-sm tracking-tight">
                        Daily Puzzle Challenge
                    </h1>
                    <p className="text-gray-400 text-lg font-light">
                        Solve the puzzle before time runs out!
                    </p>
                </div>

                {/* Loading State */}
                {!puzzleData && !completed && isAuthenticated ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                        <p className="text-gray-400">Loading today's challenge...</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {!isAuthenticated ? (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="text-center p-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl"
                            >
                                <h2 className="text-2xl font-bold text-white mb-4">Ready to Play?</h2>
                                <p className="text-gray-300 mb-8">Sign in to track your progress and compete on the leaderboard!</p>
                                <Navigate to="/login" />
                            </motion.div>
                        ) : completed ? (
                            <motion.div
                                key="completed"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl text-center space-y-8 max-w-2xl mx-auto"
                            >
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-2">Puzzle Completed!</h2>
                                    <p className="text-gray-300 text-lg">Come back tomorrow for a new challenge.</p>
                                </div>

                                <div className="flex justify-center">
                                    <NextPuzzleCountdown />
                                </div>

                                <div className="flex justify-center">
                                    <StatsDisplay streak={user?.streak_count || 0} />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="game"
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.5, type: 'spring' }}
                                className="space-y-8"
                            >
                                <div className="relative bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl transition-transform duration-500 hover:scale-[1.01] hover:shadow-orange-500/5 group">
                                    <div className="absolute top-6 right-8 opacity-90 group-hover:opacity-100 transition-opacity">
                                        <GameTimer
                                            startTime={startTime}
                                            isRunning={!completed}
                                        />
                                    </div>

                                    <div className="mt-8 flex justify-center">
                                        <PuzzleRenderer
                                            puzzleData={puzzleData}
                                            puzzleType={puzzleType}
                                            onInput={handlePuzzleInput}
                                            disabled={completed}
                                            solution={puzzleSolution}
                                            hintTrigger={hintTrigger}
                                        />
                                    </div>
                                </div>

                                <div className="max-w-xl mx-auto">
                                    <GameControls
                                        onSubmit={handleSubmit}
                                        onHint={handleHint}
                                        hintsRemaining={hintsRemaining}
                                        disabled={completed}
                                    />
                                    {hintText && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="text-center text-blue-400 font-medium mt-4 bg-blue-500/10 py-2 rounded-lg"
                                        >
                                            {hintText}
                                        </motion.div>
                                    )}
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
                </AnimatePresence>
            </div>
        </Layout>
    );
};

export default GamePage;
