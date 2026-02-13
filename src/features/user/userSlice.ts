import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface User {
    id: string;
    googleId?: string; // Optional now as we might not use it directly
    email: string;
    name?: string;
    username?: string;
    mobile?: string;
    avatar?: string;
    streak_count: number;
    total_points: number;
    last_played: string | null;
}

interface UserState {
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: UserState = {
    isAuthenticated: false,
    user: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login(state, action: PayloadAction<User>) {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        logout(state) {
            state.isAuthenticated = false;
            state.user = null;
        },
        updateUser(state, action: PayloadAction<Partial<User>>) {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
            }
        }
    },
});

export const { login, logout, updateUser } = userSlice.actions;
export default userSlice.reducer;
