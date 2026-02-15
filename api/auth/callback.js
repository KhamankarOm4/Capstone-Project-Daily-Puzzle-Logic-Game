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
        console.log('Token generated. Sending manual confirmation page.');

        const html = `
        <html>
            <head>
                <meta http-equiv="refresh" content="3;url=/?login=success&token=${token}" />
            </head>
            <body style="background: #220000; color: #ffcccc; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
                <h1 style="color: #ff0000; font-size: 40px;">🛑 LOGIN SUCCESS 🛑</h1>
                <p>Redirecting in 3 seconds...</p>
                <a href="/?login=success&token=${token}" style="padding: 20px 40px; background: #ff0000; color: white; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 20px;">
                    CLICK TO ENTER APP
                </a>
                <p style="margin-top: 20px; color: #995555; font-size: 12px;">Token: ${token.substring(0, 10)}...</p>
            </body>
        </html>
        `;

        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    } catch (error) {
        console.error('Auth Error Trace:', error);
        res.status(500).json({ message: 'Authentication failed', error: error.message });
    }
}
