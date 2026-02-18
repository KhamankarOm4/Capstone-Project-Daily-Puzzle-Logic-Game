import express from 'express';
import { requireAuth } from '../lib/auth.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

/**
 * POST /leaderboard
 * Submit score (auth optional, supports guest users)
 */
router.post('/', requireAuth({ allowGuest: true }), async (req, res) => {
    let { user_id, date, score, time_taken } = req.body;

    // Use logged-in user ID if available
    if (req.user && req.user.id) {
        user_id = req.user.id;
    } else if (!user_id || user_id === 'guest') {
        user_id = `guest_${Math.floor(Math.random() * 1000000)}`;
    }

    if (!user_id || !date || score == null || time_taken == null) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const existing = await prisma.dailyScore.findFirst({
            where: { user_id, date: new Date(date) }
        });

        if (existing) {
            if (score > existing.score) {
                await prisma.dailyScore.update({
                    where: { id: existing.id },
                    data: { score, time_taken }
                });
            } else {
                return res.json({ message: 'Higher score already exists' });
            }
        } else {
            await prisma.dailyScore.create({
                data: { user_id, date: new Date(date), score, time_taken }
            });
        }

        res.json({ message: 'Score saved' });
    } catch (e) {
        console.error('Submit score error', e);
        res.status(500).json({ error: `Failed to save score: ${e.message}` });
    }
});

/**
 * GET /leaderboard
 * Fetch top 100 scores with user details
 */
router.get('/', async (req, res) => {
    try {
        const { date, limit = 100 } = req.query;
        let where = {};

        if (date) {
            const queryDate = new Date(date);
            const startOfDay = new Date(queryDate.setHours(0, 0, 0, 0));
            const endOfDay = new Date(queryDate.setHours(23, 59, 59, 999));
            where.date = { gte: startOfDay, lte: endOfDay };
        } else {
            // Default to today if no date specified for "Daily" leaderboard
            const today = new Date();
            const startOfDay = new Date(today.setHours(0, 0, 0, 0));
            const endOfDay = new Date(today.setHours(23, 59, 59, 999));
            where.date = { gte: startOfDay, lte: endOfDay };
        }

        const scores = await prisma.dailyScore.findMany({
            where,
            orderBy: [{ score: 'desc' }, { time_taken: 'asc' }],
            take: Number(limit)
        });

        // Manually fetch user details for the leaderboard to avoid foreign key issues with guest IDs
        const userIds = [...new Set(scores.map(s => s.user_id).filter(id => !id.startsWith('guest_')))];

        let usersMap = {};
        if (userIds.length > 0) {
            const users = await prisma.user.findMany({
                where: { id: { in: userIds } },
                select: { id: true, username: true, name: true, avatar: true }
            });
            users.forEach(u => usersMap[u.id] = u);
        }

        const enrichedScores = scores.map(score => {
            const user = usersMap[score.user_id];
            return {
                ...score,
                user: user ? {
                    username: user.username,
                    name: user.name,
                    avatar: user.avatar
                } : null
            };
        });

        res.json({
            leaderboard: enrichedScores,
            total: enrichedScores.length
        });
    } catch (e) {
        console.error('Get leaderboard error', e);
        res.status(500).json({ error: `Failed to fetch leaderboard: ${e.message}` });
    }
});

export default router;
