import { Router } from 'express';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../lib/auth.js';

const router = Router();

// POST /puzzle/complete - record daily puzzle completion and update streak/points
router.post('/complete', requireAuth(), async (req, res) => {
  const userId = req.user.id;
  // Support both property names to be extra safe
  const finalScore = req.body.finalScore !== undefined ? req.body.finalScore : req.body.score;

  console.log(`🧩 [DEBUG] /puzzle/complete HIT`);
  console.log(`🧩 [DEBUG] User ID: ${userId}`);
  console.log(`🧩 [DEBUG] req.body keys:`, Object.keys(req.body));
  console.log(`🧩 [DEBUG] extracted finalScore: ${finalScore}`);

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPlayed = user.last_played ? new Date(user.last_played) : null;
    if (lastPlayed) lastPlayed.setHours(0, 0, 0, 0);

    if (lastPlayed && lastPlayed.getTime() === today.getTime()) {
      return res.json({
        message: 'Already completed today',
        streak_count: user.streak_count,
        total_points: user.total_points,
      });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let newStreak = 1;
    if (lastPlayed && lastPlayed.getTime() === yesterday.getTime()) {
      newStreak = user.streak_count + 1;
    }

    const safeScore = Number(finalScore) || 0;
    const currentPoints = user.total_points || 0;
    const finalPoints = currentPoints + safeScore;

    console.log(`🧩 [DEBUG] Current DB State - Streak: ${user.streak_count}, Points: ${user.total_points}, LastPlayed: ${user.last_played}`);
    console.log(`🧩 [DEBUG] Calculated Updates - NewStreak: ${newStreak}, FinalPoints: ${finalPoints}, safeScore: ${safeScore}`);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        streak_count: newStreak,
        last_played: new Date(),
        total_points: finalPoints,
      },
    });

    console.log(`🧩 [DEBUG] DB Update Success: streak=${updatedUser.streak_count}, points=${updatedUser.total_points}`);

    res.json({
      streak_count: newStreak,
      streak: newStreak, // Backwards compatibility
      total_points: updatedUser.total_points,
      message: 'Puzzle completed',
    });
  } catch (e) {
    console.error('Puzzle complete error:', e);
    res.status(500).json({ error: 'Database update failed', details: e.message });
  }
});

export default router;
