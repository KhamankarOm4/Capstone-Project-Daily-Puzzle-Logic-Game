export interface StreakData {
    currentStreak: number;
    maxStreak: number;
    lastPlayedDate: string;
    totalGamesPlayed: number;
    totalGamesWon: number;
}

export const getStreakData = (): StreakData => ({
    currentStreak: 0,
    maxStreak: 0,
    lastPlayedDate: '',
    totalGamesPlayed: 0,
    totalGamesWon: 0
});

export const hasPlayedToday = (): boolean => false;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateStreakOnCompletion = async (_won: boolean): Promise<StreakData> => {
    return getStreakData();
};

export const initializeStreak = (): StreakData => getStreakData();

export const getStreakStats = () => {
    return {
        currentStreak: 0,
        maxStreak: 0,
        totalGamesPlayed: 0,
        totalGamesWon: 0,
        winRate: 0,
        lastPlayedDate: ''
    };
};
