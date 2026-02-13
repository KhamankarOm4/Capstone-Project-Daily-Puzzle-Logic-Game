import { useState, useEffect } from 'react';
import { getMsUntilMidnight, formatCountdown } from '../utils/dailyReset';

const NextPuzzleCountdown = () => {
    const [msLeft, setMsLeft] = useState(getMsUntilMidnight());

    useEffect(() => {
        const interval = setInterval(() => {
            const remaining = getMsUntilMidnight();
            setMsLeft(remaining);

            // Auto-reload when midnight hits
            if (remaining <= 0) {
                clearInterval(interval);
                window.location.reload();
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const timeStr = formatCountdown(msLeft);
    const [hours, minutes, seconds] = timeStr.split(':');

    return (
        <div className="flex flex-col items-center gap-6 p-10">
            <div className="text-5xl mb-2">🎉</div>
            <h2 className="text-2xl font-bold text-gray-800">Puzzle Complete!</h2>
            <p className="text-gray-500 text-center max-w-xs">
                Great job! Come back tomorrow for a new challenge.
            </p>

            <div className="flex flex-col items-center gap-2 mt-2">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Next puzzle in</span>
                <div className="flex items-center gap-3">
                    {[
                        { value: hours, label: 'HRS' },
                        { value: minutes, label: 'MIN' },
                        { value: seconds, label: 'SEC' },
                    ].map(({ value, label }, i) => (
                        <div key={label} className="flex items-center gap-3">
                            <div className="flex flex-col items-center">
                                <div className="bg-gradient-to-b from-gray-800 to-gray-900 text-white text-3xl font-mono font-bold w-16 h-16 flex items-center justify-center rounded-xl shadow-lg">
                                    {value}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 mt-1 tracking-widest">{label}</span>
                            </div>
                            {i < 2 && <span className="text-2xl font-bold text-gray-400 mb-4">:</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NextPuzzleCountdown;
