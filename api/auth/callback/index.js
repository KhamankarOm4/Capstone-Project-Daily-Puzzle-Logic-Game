import { getGoogleUser } from '../_lib/google.js';
import prisma from '../_lib/prisma.js';
import { generateToken, setTokenCookie } from '../_lib/auth.js';

export default async function handler(req, res) {
    const logs = [];
    const log = (msg) => {
        const entry = `${new Date().toISOString().split('T')[1]} - ${msg}`;
        console.log(entry);
        logs.push(entry);
    };

    log('Callback handler started');

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { code } = req.query;

    if (!code) {
        log('Error: Missing Authorization Code');
        return res.status(400).json({ message: 'Missing Authorization Code', logs });
    }

    try {
        log(`Processing code: ${code.substring(0, 5)}...`);

        log('Fetching Google User...');
        const googleUser = await getGoogleUser(code);
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

        const html = `
        <html>
            <body style="background: #002200; color: #00ff00; font-family: monospace; padding: 20px;">
                <h1>✅ AUTH SUCCESS</h1>
                <div style="border: 1px solid #004400; padding: 10px; margin: 10px 0;">
                    <strong>Token:</strong> ${token.substring(0, 20)}...
                </div>
                <a href="/?login=success&token=${token}" style="display: block; padding: 20px; background: #00ff00; color: black; text-align: center; font-weight: bold; text-decoration: none; font-size: 20px; margin: 20px 0;">
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

        const html = `
        <html>
            <body style="background: #220000; color: #ff5555; font-family: monospace; padding: 20px;">
                <h1>⚠️ AUTH FAILED</h1>
                <h2>Error: ${error.message}</h2>
                <a href="/login" style="color: white; border: 1px solid white; padding: 5px 10px; text-decoration: none;">Back to Login</a>
                <h3>Execution Logs:</h3>
                <pre style="color: #ffaaaa;">${logs.join('\n')}</pre>
            </body>
        </html>
        `;

        // Return 200 even on error to ensure user SEES the page (bypasses browser error pages)
        res.setHeader('Content-Type', 'text/html');
        res.status(200).send(html);
    }
}
