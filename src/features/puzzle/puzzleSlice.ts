import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PuzzleState {
    currentPuzzleId: string | null;
    status: 'idle' | 'playing' | 'completed' | 'failed';
    guesses: string[];
    maxGuesses: number;
    solution: string | null; // In a real app, maybe hidden, but for now kept here
}

const initialState: PuzzleState = {
    currentPuzzleId: null,
    status: 'idle',
    guesses: [],
    maxGuesses: 6,
    solution: null,
};

const puzzleSlice = createSlice({
    name: 'puzzle',
    initialState,
    reducers: {
        startPuzzle(state, action: PayloadAction<{ id: string; solution: string }>) {
            state.currentPuzzleId = action.payload.id;
            state.solution = action.payload.solution;
            state.status = 'playing';
            state.guesses = [];
        },
        makeGuess(state, action: PayloadAction<string>) {
            if (state.status === 'playing') {
                state.guesses.push(action.payload);
                if (state.guesses.length >= state.maxGuesses && action.payload !== state.solution) {
                    state.status = 'failed';
                } else if (action.payload === state.solution) {
                    state.status = 'completed';
                }
            }
        },
        resetPuzzle(state) {
            state.status = 'idle';
            state.guesses = [];
            state.currentPuzzleId = null;
            state.solution = null;
        }
    },
});

export const { startPuzzle, makeGuess, resetPuzzle } = puzzleSlice.actions;
export default puzzleSlice.reducer;
