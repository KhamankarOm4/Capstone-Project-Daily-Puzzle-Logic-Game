import dayjs from 'dayjs';

const API_URL = '/leaderboard';

export const submitScore = async (userId, date, score, timeTaken) => {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                user_id: userId,
                score: score,
                time_taken: timeTaken,
                date: date // Use the provided date
            }),
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to submit score');
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting score:', error);
        throw error;
    }
};

export const getLeaderboard = async () => {
    try {
        const response = await fetch(API_URL, {
            credentials: 'include',
        });

        if (!response.ok) {
            throw new Error('Failed to fetch leaderboard');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        throw error;
    }
};
