import dayjs from 'dayjs';

export interface DayActivity {
    date: string;       // YYYY-MM-DD
    played: boolean;
    won: boolean;
    attempts: number;
}

const ACTIVITY_KEY = 'daily-puzzle-activity';

// Load all activity data
export const loadActivityData = (): Record<string, DayActivity> => {
    try {
        const stored = localStorage.getItem(ACTIVITY_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
};

// Save activity data
const saveActivityData = (data: Record<string, DayActivity>): void => {
    try {
        localStorage.setItem(ACTIVITY_KEY, JSON.stringify(data));
    } catch (error) {
        console.error('Error saving activity data:', error);
    }
};

// Record activity for today
export const recordDayActivity = (won: boolean): void => {
    const today = dayjs().format('YYYY-MM-DD');
    const data = loadActivityData();

    if (data[today]) {
        data[today].attempts++;
        if (won) data[today].won = true;
    } else {
        data[today] = {
            date: today,
            played: true,
            won,
            attempts: 1
        };
    }

    saveActivityData(data);
};

// Get activity level for a day (0-4, like GitHub)
export const getActivityLevel = (activity: DayActivity | undefined): number => {
    if (!activity || !activity.played) return 0;
    if (activity.won && activity.attempts === 1) return 4;  // Perfect
    if (activity.won) return 3;                              // Won
    if (activity.attempts >= 3) return 2;                    // Tried hard
    return 1;                                                // Attempted
};

// Get 365 days of activity for the heatmap
export const getYearActivity = (): { date: string; level: number; activity?: DayActivity }[] => {
    const data = loadActivityData();
    const days: { date: string; level: number; activity?: DayActivity }[] = [];

    // Start from 364 days ago up to today
    for (let i = 364; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day').format('YYYY-MM-DD');
        const activity = data[date];
        days.push({
            date,
            level: getActivityLevel(activity),
            activity
        });
    }

    return days;
};

// Get month labels for the heatmap
export const getMonthLabels = (): { label: string; col: number }[] => {
    const labels: { label: string; col: number }[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let lastMonth = -1;

    for (let i = 364; i >= 0; i--) {
        const date = dayjs().subtract(i, 'day');
        const month = date.month();
        if (month !== lastMonth) {
            const col = Math.floor((364 - i) / 7);
            labels.push({ label: months[month], col });
            lastMonth = month;
        }
    }

    return labels;
};
