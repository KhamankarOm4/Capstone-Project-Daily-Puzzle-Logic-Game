import { useState, useEffect } from 'react';
import { setElapsedSeconds } from '../utils/gameTimerUtils';

interface GameTimerProps {
    startTime?: number;
    isRunning?: boolean;
}

const GameTimer = ({ startTime, isRunning = true }: GameTimerProps) => {
    const [seconds, setSeconds] = useState(() => {
        if (startTime) {
            const derived = Math.floor((Date.now() - startTime) / 1000);
            setElapsedSeconds(derived);
            return derived;
        }
        return 0;
    });

    useEffect(() => {
        if (startTime) {
            const derivedSeconds = Math.floor((Date.now() - startTime) / 1000);
            // setSeconds(derivedSeconds); // removed to avoid cascading update if possible, but actually if startTime changes we need it.
            // But usually startTime is stable.
            setElapsedSeconds(derivedSeconds);
        }
    }, [startTime]);

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setSeconds((prev) => {
                const next = prev + 1;
                setElapsedSeconds(next);
                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="flex items-center gap-2 bg-white dark:bg-black/30 px-6 py-3 rounded-xl shadow-lg border border-gray-200 dark:border-white/10 backdrop-blur-md">
            <svg className="w-5 h-5 text-blue-600 dark:text-accent-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-2xl font-mono font-bold text-gray-800 dark:text-white">{formatTime(seconds)}</span>
        </div>
    );
};

export default GameTimer;
