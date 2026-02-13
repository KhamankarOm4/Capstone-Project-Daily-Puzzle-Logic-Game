import { useEffect, useRef, useCallback } from 'react';
import { dbOperations } from './db';

interface AutoSaveOptions {
    debounceMs?: number;
    onSaveSuccess?: () => void;
    onSaveError?: (error: Error) => void;
}

/**
 * Custom hook for auto-saving puzzle progress to IndexedDB
 * @param date - Date string (YYYY-MM-DD) for the puzzle
 * @param guesses - Current user guesses/moves
 * @param status - Current puzzle status
 * @param options - Configuration options
 */
export const useAutoSave = (
    date: string,
    guesses: string[],
    status: 'playing' | 'completed' | 'failed',
    startTime: number,
    options: AutoSaveOptions = {}
) => {
    const { debounceMs = 300, onSaveSuccess, onSaveError } = options;
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const isMountedRef = useRef(true);

    const saveProgress = useCallback(async () => {
        try {
            await dbOperations.saveProgress(date, guesses, status, startTime);
            if (isMountedRef.current && onSaveSuccess) {
                onSaveSuccess();
            }
        } catch (error) {
            console.error('Failed to save progress:', error);
            if (isMountedRef.current && onSaveError) {
                onSaveError(error as Error);
            }
        }
    }, [date, guesses, status, startTime, onSaveSuccess, onSaveError]);

    // Debounced auto-save
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            saveProgress();
        }, debounceMs);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [guesses, status, startTime, debounceMs, saveProgress]);

    // Save immediately before page unload
    useEffect(() => {
        const handleBeforeUnload = () => {
            // Synchronous save attempt (best effort)
            dbOperations.saveProgress(date, guesses, status, startTime).catch(console.error);
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [date, guesses, status, startTime]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    // Return manual save function
    const saveNow = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        return saveProgress();
    }, [saveProgress]);

    return { saveNow };
};

/**
 * Load saved progress for a specific date
 */
export const loadProgress = async (date: string) => {
    try {
        return await dbOperations.getProgress(date);
    } catch (error) {
        console.error('Failed to load progress:', error);
        return null;
    }
};
