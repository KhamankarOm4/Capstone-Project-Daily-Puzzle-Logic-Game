import express from 'express';
import { getGoogleAuthURL, getGoogleUser } from '../lib/google.js';
import { generateToken, setTokenCookie, removeTokenCookie, verifyToken } from '../lib/auth.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

/**
 * Helper to get origin from request
 */
function getOrigin(req) {
    const proto = req.headers['x-forwarded-proto'] || (req.headers.host?.startsWith('localhost') ? 'http' : 'https');
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    return host ? `${proto}://${host}` : null;
}

/**
 * GET /auth/google
 * Initiates Google OAuth flow
 */
router.get('/google', (req, res) => {
    const origin = getOrigin(req);
    const url = getGoogleAuthURL(origin);
    res.redirect(url);
});

/**
 * GET /auth/google/callback
 * Handles Google OAuth callback
 */
router.get('/google/callback', async (req, res) => {
    const logs = [];
    const log = (msg) => {
        const entry = `${new Date().toISOString().split('T')[1]} - ${msg}`;
        console.log(entry);
        logs.push(entry);
    };

    log('Callback handler started');

    const { code } = req.query;
    const origin = getOrigin(req);

    if (!code) {
        log('Error: Missing Authorization Code');
        return res.status(400).json({ message: 'Missing Authorization Code', logs });
    }

    try {
        log(`Processing code: ${code.substring(0, 5)}...`);

        log('Fetching Google User...');
        const googleUser = await getGoogleUser(code, origin);
        log(`Google fetching success: ${googleUser.email}`);

        const { email, name, picture } = googleUser;

        log('Connecting to Prisma...');
        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            log('User not found. Creating new user...');
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    avatar: picture,
                    username: email.split('@')[0],
                },
            });
            log(`User created: ${user.id}`);
        } else {
            log(`User found: ${user.id}`);
        }

        log('Generating Token...');
        const token = generateToken(user);

        log('Setting Cookie...');
        setTokenCookie(res, token);
        log('Cookie set.');

        const returnUrl = origin ? `${origin.replace(/\/$/, '')}/?login=success&token=${encodeURIComponent(token)}` : `/?login=success&token=${encodeURIComponent(token)}`;
        const html = `
        <html>
            <body style="background: #002200; color: #00ff00; font-family: monospace; padding: 20px;">
                <h1>✅ AUTH SUCCESS</h1>
                <div style="border: 1px solid #004400; padding: 10px; margin: 10px 0;">
                    <strong>Token:</strong> ${token.substring(0, 20)}...
                </div>
                <a href="${returnUrl}" style="display: block; padding: 20px; background: #00ff00; color: black; text-align: center; font-weight: bold; text-decoration: none; font-size: 20px; margin: 20px 0;">
                    ENTER GAME NOW
                </a>
                <h3>Execution Logs:</h3>
                <pre style="color: #88ff88;">${logs.join('\n')}</pre>
            </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);

    } catch (error) {
        log(`🔥 CRITICAL ERROR: ${error.message}`);
        if (error.stack) log(error.stack);

        const loginUrl = origin ? `${origin.replace(/\/$/, '')}/login` : '/login';
        const html = `
        <html>
            <body style="background: #220000; color: #ff5555; font-family: monospace; padding: 20px;">
                <h1>⚠️ AUTH FAILED</h1>
                <h2>Error: ${error.message}</h2>
                <a href="${loginUrl}" style="color: white; border: 1px solid white; padding: 5px 10px; text-decoration: none;">Back to Login</a>
                <h3>Execution Logs:</h3>
                <pre style="color: #ffaaaa;">${logs.join('\n')}</pre>
            </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    }
});

/**
 * GET /auth/user
 * Returns current authenticated user
 */
router.get('/user', (req, res) => {
    const userPayload = verifyToken(req);

    if (!userPayload || userPayload.error) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    res.json(userPayload);
});

/**
 * POST /auth/logout
 * Clears auth cookie
 */
router.post('/logout', (req, res) => {
    removeTokenCookie(res);
    res.json({ message: 'Logged out successfully' });
});

/**
 * GET /auth/ping
 * Health check endpoint
 */
router.get('/ping', (req, res) => {
    res.json({ message: 'pong' });
});

export default router;
