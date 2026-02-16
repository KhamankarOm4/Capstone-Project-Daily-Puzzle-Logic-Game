import express from 'express';
import { requireAuth } from '../lib/auth.js';
import prisma from '../lib/prisma.js';

const router = express.Router();

/**
 * PUT /user/profile
 * Update user profile (requires auth)
 */
router.put('/profile', requireAuth(), async (req, res) => {
    const userId = req.user.id;
    let { name, username, mobile } = req.body;

    // Sanitize inputs: convert empty strings to null
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
});

/**
 * GET /user/dashboard
 * Get user dashboard data (requires auth)
 */
router.get('/dashboard', requireAuth(), async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (e) {
        console.error('Get dashboard error', e);
        res.status(500).json({ error: `Failed to fetch user: ${e.message}` });
    }
});

export default router;
