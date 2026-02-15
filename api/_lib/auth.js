
import jwt from 'jsonwebtoken';
import { serialize, parse } from 'cookie';

const SECRET = process.env.SESSION_SECRET || 'super-secret-key';
const COOKIE_NAME = 'auth_token';

export function setTokenCookie(res, token) {
    const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL === '1';
    console.log(`Debug: NODE_ENV=${process.env.NODE_ENV}, VERCEL=${process.env.VERCEL}, isProduction=${isProduction}`);

    const cookie = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: isProduction, // Must be true on Vercel
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'none', // Required for some OAuth flows, must be lowercase
    });
    console.log(`Setting Auth Cookie (Length: ${token.length}, Secure: ${isProduction}, SameSite: none)`);
    res.setHeader('Set-Cookie', cookie);
}

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

export function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '7d' });
}

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
        return { error: err.message }; // Return the specific error
    }
}
