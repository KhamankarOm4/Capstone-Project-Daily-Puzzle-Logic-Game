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
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any localhost origin
        if (origin.match(/^http:\/\/localhost:\d+$/)) {
            return callback(null, true);
        }

        // Allow specific production domain if needed
        if (origin === process.env.FRONTEND_URL) {
            return callback(null, true);
        }

        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
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
});

// Update User Profile
app.put('/api/user/profile', requireAuth(), async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.user.id;
        let { name, username, mobile } = req.body;

        // Sanitize inputs: convert empty strings to null to avoid unique constraint violations
        if (typeof name === 'string' && name.trim() === '') name = null;
        if (typeof username === 'string' && username.trim() === '') username = null;
        if (typeof mobile === 'string' && mobile.trim() === '') mobile = null;

        // Check uniqueness if username is changing
        if (username) {
            const existing = await prisma.user.findUnique({
                where: { username }
            });
            if (existing && existing.id !== userId) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, username, mobile }
        });

        res.json(updatedUser);
    } catch (e) {
        console.error('Update profile error', e);
        res.status(500).json({ error: `Update failed: ${e.message}` });
    }
});

// GET User Dashboard
app.get('/api/user/dashboard', requireAuth(), async (req, res) => {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json(user);
});
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
    if (req.isAuthenticated && req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Logout
// Logout
app.get('/auth/logout', (req, res) => {
    req.logout((err) => {
        if (err) { return next(err); }
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: 'Could not log out' });
            } else {
                res.clearCookie('connect.sid');
                return res.json({ message: 'Logged out successfully' });
            }
        });
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




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🏆 API running on http://localhost:${PORT}`);
});
