
import { verifyToken } from '../_lib/auth.js';
import prisma from '../_lib/prisma.js';

export default async function handler(req, res) {
    const userPayload = verifyToken(req);

    if (!userPayload) {
        return res.status(401).json({ error: 'Not authenticated' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userPayload.id },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
