
import prisma from '../_lib/prisma.js';
import { verifyToken } from '../_lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const userPayload = verifyToken(req);
    if (!userPayload) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = userPayload.id;
    let { name, username, mobile } = req.body;

    // Sanitize inputs
    if (typeof name === 'string' && name.trim() === '') name = null;
    if (typeof username === 'string' && username.trim() === '') username = null;
    if (typeof mobile === 'string' && mobile.trim() === '') mobile = null;

    try {
        // Check uniqueness if username is changing
        if (username) {
            const existing = await prisma.user.findUnique({
                where: { username }
            });
            if (existing && existing.id !== userId) {
                return res.status(400).json({ error: 'Username already taken' });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { name, username, mobile }
        });

        res.json(updatedUser);
    } catch (e) {
        console.error('Update profile error', e);
        res.status(500).json({ error: `Update failed: ${e.message}` });
    }
}
