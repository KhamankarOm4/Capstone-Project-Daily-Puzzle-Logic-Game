import { getGoogleUser, getRedirectUri } from '../../_lib/google.js';
import prisma from '../../_lib/prisma.js';
import { generateToken, setTokenCookie } from '../../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: 'Missing Authorization Code' });
    }

    try {
        const redirectUri = getRedirectUri(req.headers.host);
        const googleUser = await getGoogleUser(code, redirectUri);
        const { email, name, picture } = googleUser;

        let user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    avatar: picture,
                    username: email.split('@')[0], // Default username
                },
            });
        }

        const token = generateToken(user);
        setTokenCookie(res, token);

        res.redirect('/');
    } catch (error) {
        console.error('Auth Error:', error);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
}
