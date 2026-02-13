import dayjs from 'dayjs';

const COMPLETION_KEY = 'daily-puzzle-completion';

export interface CompletionRecord {
    date: string;        // YYYY-MM-DD
    completedAt: string; // ISO timestamp
    won: boolean;
    attempts: number;
}

// Check if today's puzzle is already completed
export const isTodayCompleted = (): boolean => {
    const today = dayjs().format('YYYY-MM-DD');
    const record = getCompletionRecord(today);
    return record !== null && record.won;
};

// Get completion record for a specific date
export const getCompletionRecord = (date: string): CompletionRecord | null => {
    try {
        const stored = localStorage.getItem(COMPLETION_KEY);
        if (!stored) return null;
        const records: Record<string, CompletionRecord> = JSON.parse(stored);
        return records[date] || null;
    } catch {
        return null;
    }
};

// Mark today's puzzle as completed
export const markTodayCompleted = (won: boolean, attempts: number): void => {
    const today = dayjs().format('YYYY-MM-DD');
    try {
        const stored = localStorage.getItem(COMPLETION_KEY);
        const records: Record<string, CompletionRecord> = stored ? JSON.parse(stored) : {};

        // Only update if not already marked as won
        if (records[today]?.won) return;

        records[today] = {
            date: today,
            completedAt: new Date().toISOString(),
            won,
            attempts: (records[today]?.attempts || 0) + attempts
        };

        localStorage.setItem(COMPLETION_KEY, JSON.stringify(records));
    } catch (error) {
        console.error('Error saving completion record:', error);
    }
};

// Get milliseconds until midnight local time
export const getMsUntilMidnight = (): number => {
    const now = dayjs();
    const midnight = now.add(1, 'day').startOf('day');
    return midnight.diff(now);
};

// Format milliseconds as HH:MM:SS
export const formatCountdown = (ms: number): string => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
