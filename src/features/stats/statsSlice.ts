import { createSlice, type PayloadAction } from '@reduxjs/toolkit';


interface StatsState {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    winDistribution: Record<number, number>; // guesses -> count
}

const initialState: StatsState = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    winDistribution: {},
};

const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        recordWin(state, action: PayloadAction<number>) {
            state.gamesPlayed++;
            state.gamesWon++;
            const guesses = action.payload;
            state.winDistribution[guesses] = (state.winDistribution[guesses] || 0) + 1;
        },
        recordLoss(state) {
            state.gamesPlayed++;
        },
        updateStreak(state, action: PayloadAction<{ currentStreak: number; maxStreak: number }>) {
            state.currentStreak = action.payload.currentStreak;
            state.maxStreak = action.payload.maxStreak;
        },
        loadStats(state, action: PayloadAction<StatsState>) {
            return action.payload;
        },
        resetStats(_state) {
            return initialState;
        },
    },
});

export const { recordWin, recordLoss, updateStreak, loadStats, resetStats } = statsSlice.actions;
export default statsSlice.reducer;
