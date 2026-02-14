const API_BASE = '/api';

export interface LeaderboardEntry {
    rank?: number;
    user_id: string;
    date: string;
    score: number;
    time_taken: number;
    submitted_at?: string;
    user?: {
        name?: string;
        username?: string;
        avatar?: string;
    };
}

export interface LeaderboardResponse {
    date: string;
    total: number;
    leaderboard: LeaderboardEntry[];
}

// Submit score to the leaderboard
export const submitScore = async (
    userId: string,
    date: string,
    score: number,
    timeTaken: number
): Promise<{ message: string; entry: LeaderboardEntry }> => {
    try {
        const response = await fetch(`${API_BASE}/leaderboard`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({
                user_id: userId,
                date,
                score,
                time_taken: timeTaken
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to submit score');
        }

        return response.json();
    } catch (error) {
        console.error('Error submitting score:', error);
        throw error;
    }
};

// Fetch the leaderboard (optionally filtered by date)
export const fetchLeaderboard = async (
    date?: string,
    limit: number = 20
): Promise<LeaderboardResponse> => {
    try {
        const params = new URLSearchParams();
        if (date) params.set('date', date);
        params.set('limit', limit.toString());

        const response = await fetch(`${API_BASE}/leaderboard?${params}`);

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        // Return empty leaderboard on error (API might be offline)
        return { date: date || 'all', total: 0, leaderboard: [] };
    }
};

// Fetch scores for a specific user
export const fetchUserScores = async (
    userId: string
): Promise<{ user_id: string; total: number; scores: LeaderboardEntry[] }> => {
    try {
        const response = await fetch(`${API_BASE}/leaderboard/${encodeURIComponent(userId)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch user scores');
        }

        return response.json();
    } catch (error) {
        console.error('Error fetching user scores:', error);
        return { user_id: userId, total: 0, scores: [] };
    }
};
