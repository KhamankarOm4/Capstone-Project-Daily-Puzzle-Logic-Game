
import prisma from './_lib/prisma.js';
import { verifyToken } from './_lib/auth.js';

export default async function handler(req, res) {
    const userPayload = verifyToken(req);

    // POST: Submit Score
    if (req.method === 'POST') {
        let { user_id, date, score, time_taken } = req.body;

        // Use logged-in user ID if available
        if (userPayload && userPayload.id) {
            user_id = userPayload.id;
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

            return res.json({ message: 'Score saved' });
        } catch (e) {
            console.error('Leaderboard POST Error:', e);
            return res.status(500).json({ error: 'Failed to save score' });
        }
    }

    // GET: Retrieve Leaderboard
    if (req.method === 'GET') {
        try {
            const scores = await prisma.dailyScore.findMany({
                orderBy: [{ score: 'desc' }, { time_taken: 'asc' }],
                take: 100
            });

            // Manually fetch user details to avoid guest ID issues
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

            return res.json({
                leaderboard: enrichedScores,
                total: enrichedScores.length
            });
        } catch (e) {
            console.error('Leaderboard GET Error:', e);
            return res.status(500).json({ error: 'Failed to fetch leaderboard' });
        }
    }

    return res.status(405).json({ message: 'Method not allowed' });
}
