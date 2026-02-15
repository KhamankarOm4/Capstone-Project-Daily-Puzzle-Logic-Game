import { getGoogleUser } from '../_lib/google.js';
import prisma from '../_lib/prisma.js';
import { generateToken, setTokenCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: 'Missing Authorization Code' });
    }

    try {
        console.log('Processing Google Callback with code:', code ? 'PRESENT' : 'MISSING');
        const googleUser = await getGoogleUser(code);
        console.log('Google User fetched:', googleUser.email);

        const { email, name, picture } = googleUser;

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            console.log('Creating new user:', email);
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    avatar: picture,
                    username: email.split('@')[0], // Default username
                },
            });
        } else {
            console.log('User found in DB:', user.id);
        }

        const token = generateToken(user);
        setTokenCookie(res, token);
        console.log('Token cookie set. Returning JSON for debug...');

        // DEBUG: Return JSON to verify callback execution
        res.status(200).json({
            message: 'Login Successful',
            user: { email: user.email, id: user.id },
            tokenPreview: token.substring(0, 10) + '...',
            cookieSet: true
        });
    } catch (error) {
        console.error('Auth Error Trace:', error);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
}
