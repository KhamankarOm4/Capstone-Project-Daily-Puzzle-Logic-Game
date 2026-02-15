import { serialize, parse } from 'cookie';

export default function handler(req, res) {
    const { check } = req.query;

    if (check) {
        // Read cookie
        const cookies = parse(req.headers.cookie || '');
        const testCookie = cookies['test_cookie'];

        return res.status(200).json({
            status: 'ok',
            message: 'Reading cookie',
            cookieValue: testCookie || 'NOT FOUND',
            allCookies: Object.keys(cookies) // Don't log values for security, just keys
        });
    } else {
        // Set cookie
        const cookie = serialize('test_cookie', 'hello_vercel', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/',
            maxAge: 60 * 60, // 1 hour
            sameSite: 'lax',
        });

        res.setHeader('Set-Cookie', cookie);
        res.status(200).json({ status: 'ok', message: 'Cookie set! Now visit /api/test-cookie?check=true' });
    }
}
