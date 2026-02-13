import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import puzzleReducer from '../features/puzzle/puzzleSlice';
import statsReducer from '../features/stats/statsSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        puzzle: puzzleReducer,
        stats: statsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
