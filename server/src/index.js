console.log("🔥 THIS INDEX FILE IS RUNNING");

import express from 'express';
import cors from 'cors';
import prisma from './prisma.js';
import session from 'express-session';
import passport from './auth/googleAuth.js';
import { requireAuth } from './middleware/authMiddleware.js';


import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logError = (context, error) => {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] ${context}: ${error.message}\n${error.stack}\n\n`;
    try {
        const logPath = path.resolve(__dirname, '../../server_error.log');
        console.log(`📝 Writing error to: ${logPath}`);
        fs.appendFileSync(logPath, message);
    } catch (err) {
        console.error('❌ Failed to write log:', err);
    }
};

const app = express();
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// POST score
app.post('/api/leaderboard', requireAuth({ allowGuest: true }), async (req, res) => {
    let { user_id, date, score, time_taken } = req.body;

    // Use logged-in user ID if available
    if (req.user && req.user.id) {
        user_id = req.user.id;
    } else if (!user_id || user_id === 'guest') {
        user_id = `guest_${Math.floor(Math.random() * 1000000)}`;
    }

    if (!user_id || !date || score == null || time_taken == null)
        return res.status(400).json({ error: 'Missing fields' });

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
});

app.get('/', (req, res) => {
    res.send('WORKING NOW');
});


// GET leaderboard
app.get('/api/leaderboard', async (req, res) => {
    const scores = await prisma.dailyScore.findMany({
        orderBy: [{ score: 'desc' }, { time_taken: 'asc' }],
        take: 100
    });

    res.json(scores);
});

// GET auth/google
// Start login
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback
app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_URL);
    }
);

// Get logged-in user
app.get('/auth/user', (req, res) => {
    res.json(req.user || null);
});

// Logout
app.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.redirect(process.env.FRONTEND_URL);
    });
});

// Update Streak
// Puzzle Complete
app.post('/api/puzzle/complete', requireAuth(), async (req, res) => {
    const userId = req.user.id;
    const { score } = req.body;
    console.log(`🧩 HIT /api/puzzle/complete for user ${userId}. Score: ${score}`);
    console.log(`📂 CWD: ${process.cwd()}`);

    // Fetch user to check last_played and current points
    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            console.log('❌ User not found');
            return res.status(404).json({ error: 'User not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastPlayed = user.last_played ? new Date(user.last_played) : null;
        if (lastPlayed) lastPlayed.setHours(0, 0, 0, 0);

        console.log(`📅 Date Debug: Today=${today.toISOString()}, LastPlayed=${lastPlayed?.toISOString()}`);

        // If played today, just return current stats
        if (lastPlayed && lastPlayed.getTime() === today.getTime()) {
            console.log('⚠️ Already completed today.');
            return res.json({
                message: 'Already completed today',
                streak: user.streak_count,
                total_points: user.total_points
            });
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        let newStreak = 1;
        // If last played was yesterday, increment streak
        if (lastPlayed && lastPlayed.getTime() === yesterday.getTime()) {
            newStreak = user.streak_count + 1;
            console.log('🔥 Streak incremented!');
        } else {
            console.log('💔 Streak reset (not played yesterday).');
        }

        // Update user
        const safeScore = Number(score) || 0;
        const currentPoints = user.total_points || 0;

        console.log(`📝 Updating user ${userId}: streak=${newStreak}, score=${safeScore}, current=${currentPoints}`);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                streak_count: newStreak,
                last_played: new Date(),
                total_points: currentPoints + safeScore
            }
        });
        console.log(`✅ User updated: Streak=${updatedUser.streak_count}, Points=${updatedUser.total_points}`);

        res.json({
            streak: newStreak,
            total_points: updatedUser.total_points,
            message: 'Puzzle completed'
        });
    } catch (e) {
        console.error('❌ Error updating user:', e);
        try {
            logError('Puzzle Complete Error', e);
        } catch (logErr) {
            console.error('❌ Failed to write to log file:', logErr);
        }
        res.status(500).json({ error: 'Database update failed', details: e.message });
    }
});


// GET User Dashboard
app.get('/api/user/dashboard', requireAuth(), async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            email: true,
            streak_count: true,
            last_played: true,
            total_points: true
        }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🏆 API running on http://localhost:${PORT}`);
});
