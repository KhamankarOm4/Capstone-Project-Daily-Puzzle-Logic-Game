import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface DailyPuzzleDB extends DBSchema {
    dailyProgress: {
        key: string; // date string YYYY-MM-DD
        value: {
            date: string;
            guesses: string[];
            status: 'playing' | 'completed' | 'failed';
            startTime?: number;
        };
    };
    hintsUsed: {
        key: string; // puzzleId
        value: {
            puzzleId: string;
            count: number;
        };
    };
    puzzleCache: {
        key: string; // puzzleId
        value: {
            id: string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data: any; // Puzzle data structure
            fetchedAt: number;
        };
    };
    offlineStats: {
        key: string; // 'stats'
        value: {
            gamesPlayed: number;
            gamesWon: number;
            currentStreak: number;
            maxStreak: number;
            winDistribution: Record<number, number>;
        };
    };
}

const DB_NAME = 'daily-puzzle-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<DailyPuzzleDB>>;

export const initDB = () => {
    if (!dbPromise) {
        dbPromise = openDB<DailyPuzzleDB>(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains('dailyProgress')) {
                    db.createObjectStore('dailyProgress', { keyPath: 'date' });
                }
                if (!db.objectStoreNames.contains('hintsUsed')) {
                    db.createObjectStore('hintsUsed', { keyPath: 'puzzleId' });
                }
                if (!db.objectStoreNames.contains('puzzleCache')) {
                    db.createObjectStore('puzzleCache', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('offlineStats')) {
                    db.createObjectStore('offlineStats', { keyPath: 'key' });
                }
            },
        });
    }
    return dbPromise;
};

export const dbOperations = {
    async saveProgress(date: string, guesses: string[], status: 'playing' | 'completed' | 'failed', startTime?: number) {
        const db = await initDB();
        await db.put('dailyProgress', { date, guesses, status, startTime });
    },

    async getProgress(date: string) {
        const db = await initDB();
        return db.get('dailyProgress', date);
    },

    async saveHintUsage(puzzleId: string, count: number) {
        const db = await initDB();
        await db.put('hintsUsed', { puzzleId, count });
    },

    async getHintUsage(puzzleId: string) {
        const db = await initDB();
        return db.get('hintsUsed', puzzleId);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async cachePuzzle(id: string, data: any) {
        const db = await initDB();
        await db.put('puzzleCache', { id, data, fetchedAt: Date.now() });
    },

    async getCachedPuzzle(id: string) {
        const db = await initDB();
        return db.get('puzzleCache', id);
    },

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async saveStats(stats: any) {
        const db = await initDB();
        await db.put('offlineStats', { ...stats, key: 'stats' });
    },

    async getStats() {
        const db = await initDB();
        return db.get('offlineStats', 'stats');
    }
};
