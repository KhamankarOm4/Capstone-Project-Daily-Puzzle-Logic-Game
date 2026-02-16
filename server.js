import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import leaderboardRoutes from './routes/leaderboard.js';
import puzzleRoutes from './routes/puzzle.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
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

        // In production, allow same-origin requests
        if (process.env.NODE_ENV === 'production') {
            return callback(null, true);
        }

        const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use('/puzzle', puzzleRoutes);

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// SPA fallback - serve index.html for all non-API routes
// Express 5 syntax: use '(.*)' instead of '*' for catch-all routes
app.get('/(.*)', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📂 Serving static files from: ${path.join(__dirname, 'dist')}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
