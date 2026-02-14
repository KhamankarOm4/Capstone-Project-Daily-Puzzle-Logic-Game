
import prisma from '../_lib/prisma.js';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const userPayload = verifyToken(req);
    if (!userPayload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = userPayload.id;
    const { score } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastPlayed = user.last_played ? new Date(user.last_played) : null;
        if (lastPlayed) lastPlayed.setHours(0, 0, 0, 0);

        if (lastPlayed && lastPlayed.getTime() === today.getTime()) {
            return res.json({
                message: 'Already completed today',
                streak: user.streak_count,
                total_points: user.total_points
            });
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak = 1;
        if (lastPlayed && lastPlayed.getTime() === yesterday.getTime()) {
            newStreak = user.streak_count + 1;
        }

        const safeScore = Number(score) || 0;
        const currentPoints = user.total_points || 0;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                streak_count: newStreak,
                last_played: new Date(),
                total_points: currentPoints + safeScore
            }
        });

        res.json({
            streak: newStreak,
            total_points: updatedUser.total_points,
            message: 'Puzzle completed'
        });
    } catch (e) {
        console.error('Puzzle Complete Error:', e);
        res.status(500).json({ error: 'Database update failed', details: e.message });
    }
}
