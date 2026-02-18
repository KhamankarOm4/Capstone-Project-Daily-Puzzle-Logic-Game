import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Trust Render's proxy to allow secure cookies
app.set('trust proxy', 1);

const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (origin.match(/^http:\/\/localhost:\d+$/)) return callback(null, true);
        if (origin === process.env.FRONTEND_URL) return callback(null, true);
        if (process.env.NODE_ENV === 'production') return callback(null, true);
        return callback(null, false);
    },
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Health check endpoint - responds immediately without DB dependency
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from React build (Non-blocking)
app.use(express.static('dist'));

// Start server with async initialization
async function startServer() {
    try {
        console.log('🔄 Starting server...');

        // Bind to port first (critical for Render health checks)
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`📂 Serving static files from: dist`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });

        console.log('⏳ Loading application routes...');

        // Dynamic imports for routes to prevent startup-time DB blocking
        const { default: authRoutes } = await import('./routes/auth.js');
        const { default: userRoutes } = await import('./routes/user.js');
        const { default: leaderboardRoutes } = await import('./routes/leaderboard.js');
        const { default: puzzleRoutes } = await import('./routes/puzzle.js');

        // Mount API Routes
        app.use('/auth', authRoutes);
        app.use('/user', userRoutes);
        app.use('/leaderboard', leaderboardRoutes);
        app.use('/puzzle', puzzleRoutes);

        // SPA fallback - serve index.html for all non-API routes (Moved after routes)
        app.get(/.*/, (req, res) => {
            res.sendFile(path.resolve('dist', 'index.html'));
        });

        console.log('✅ Routes loaded & Server ready');

    } catch (err) {
        console.error('❌ Server startup failed:', err);
        process.exit(1);
    }
}

startServer();
