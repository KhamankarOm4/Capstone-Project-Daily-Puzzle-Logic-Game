import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const SECRET = process.env.SESSION_SECRET || 'super-secret-key';
const COOKIE_NAME = 'auth_token';

/**
 * Generate JWT token for user
 * @param {object} user - User object with id and email
 * @returns {string} JWT token
 */
export function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
}

/**
 * Set JWT token as HTTP-only cookie
 * @param {object} res - Express response object
 * @param {string} token - JWT token
 */
export function setTokenCookie(res, token) {
    const cookie = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: true,        // MUST be true on HTTPS (Render)
        sameSite: 'none',    // REQUIRED for cross-site OAuth redirects
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
    });

    res.setHeader('Set-Cookie', cookie);
}

/**
 * Remove auth token cookie
 * @param {object} res - Express response object
 */
export function removeTokenCookie(res) {
    const cookie = serialize(COOKIE_NAME, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: -1,
        sameSite: 'lax',
    });
    res.setHeader('Set-Cookie', cookie);
}

/**
 * Verify JWT token from request (cookie or Authorization header)
 * @param {object} req - Express request object
 * @returns {object|null} Decoded token payload or null if invalid
 */
export function verifyToken(req) {
    // 1. Try reading from Authorization Header (Bearer Token)
    const authHeader = req.headers.authorization;
    let token;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
        console.log('verifyToken: Found Bearer token in header');
    } else {
        // 2. Fallback to Cookie
        const cookies = parse(req.headers.cookie || '');
        token = cookies[COOKIE_NAME];
    }

    if (!token) {
        console.log('verifyToken: No token found in headers or cookies.');
        return null;
    }

    try {
        const decoded = jwt.verify(token, SECRET);
        return decoded;
    } catch (err) {
        console.error('verifyToken: JWT Verification failed:', err.message);
        return { error: err.message };
    }
}

/**
 * Auth middleware - requires valid JWT token
 * @param {object} options - Middleware options
 * @param {boolean} options.allowGuest - Allow requests without auth
 * @returns {Function} Express middleware
 */
export function requireAuth(options = {}) {
    return (req, res, next) => {
        const userPayload = verifyToken(req);

        if (!userPayload || userPayload.error) {
            if (options.allowGuest) {
                req.user = null;
                return next();
            }
            return res.status(401).json({ error: 'Unauthorized' });
        }

        req.user = userPayload;
        next();
    };
}
