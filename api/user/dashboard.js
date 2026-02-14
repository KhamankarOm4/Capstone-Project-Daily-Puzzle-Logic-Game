
import prisma from '../_lib/prisma.js';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const userPayload = verifyToken(req);
    if (!userPayload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userPayload.id }
        });

        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (e) {
        console.error('Dashboard Error:', e);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
