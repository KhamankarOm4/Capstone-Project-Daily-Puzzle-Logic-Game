/* eslint-disable */
import { useState, useEffect } from 'react';
import { getDailySeed, getTodayDateString } from '../utils/dailySeed';
import { selectPuzzleForDay, getPuzzleEngine } from '../puzzles/puzzleRegistry';

const TestPuzzle = () => {
    const [puzzleInfo, setPuzzleInfo] = useState<any>(null);
    const [puzzleData, setPuzzleData] = useState<any>(null);
    const [puzzleSolution, setPuzzleSolution] = useState<any>(null);
    const [currentInput, setCurrentInput] = useState<any>(null);

    useEffect(() => {
        const loadPuzzle = async () => {
            try {
                const seed = getDailySeed();
                const todayDate = getTodayDateString();
                const puzzleType = selectPuzzleForDay(seed);

                console.log('Date:', todayDate);
                console.log('Seed:', seed.substring(0, 20) + '...');
                console.log('Puzzle Type:', puzzleType);

                const engine = getPuzzleEngine(puzzleType);
                const puzzle = await engine.generatePuzzle(seed);

                console.log('Puzzle generated:', puzzle);

                setPuzzleInfo({ type: puzzleType, id: puzzle.id });
                setPuzzleData(puzzle.data);
                setPuzzleSolution(puzzle.solution);
            } catch (error) {
                console.error('Error loading puzzle:', error);
            }
        };

        loadPuzzle();
    }, []);

    const handleInput = (input: any) => {
        console.log('Input received:', input);
        setCurrentInput(input);
    };

    const handleSubmit = async () => {
        if (!currentInput || !puzzleInfo) return;

        const seed = getDailySeed();
        const engine = getPuzzleEngine(puzzleInfo.type) as any;
        const puzzle = await engine.generatePuzzle(seed);

        const isCorrect = engine.validateSolution(currentInput, puzzle.solution);
        alert(isCorrect ? '✅ Correct!' : '❌ Incorrect');
    };

    if (!puzzleData || !puzzleInfo) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                    <p className="text-xl font-medium text-gray-700">Loading puzzle...</p>
                </div>
            </div>
        );
    }

    const engine = getPuzzleEngine(puzzleInfo.type) as any;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-md p-4">
                <h1 className="text-2xl font-bold text-center">Daily Puzzle - {puzzleInfo.type}</h1>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-8 gap-8">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    {(() => {
                        const Component = engine.PuzzleComponent;
                        return <Component
                            data={puzzleData}
                            onInput={handleInput}
                            disabled={false}
                            solution={puzzleSolution}
                            hintTrigger={0}
                        />;
                    })()}
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!currentInput}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                    Check Solution
                </button>
            </main>
        </div>
    );
};

export default TestPuzzle;
