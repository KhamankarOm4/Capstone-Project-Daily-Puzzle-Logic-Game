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
            <body style="background: #111; color: white; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
                <h1>✅ Login Successful!</h1>
                <p>Token Generated. Click below to finish.</p>
                <a href="/?login=success&token=${token}" style="padding: 15px 30px; background: #0070f3; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    ENTER APP
                </a>
                <p style="margin-top: 20px; color: #666; font-size: 12px;">Token: ${token.substring(0, 10)}...</p>
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
