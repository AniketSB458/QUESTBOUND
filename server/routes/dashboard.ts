import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Quest } from '../models/Quest';
import { Activity } from '../models/Activity';
import { getXPProgress } from '../utils/rpgLogic';

const router = express.Router();

router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const userId = req.user!.id;
    const [user, activeQuests, recentActivity, completedCount] = await Promise.all([
      User.findById(userId).populate('inventory badges equippedAvatar equippedTheme').lean(),
      Quest.find({ userId, completed: false }).sort({ createdAt: -1 }).limit(10).lean(),
      Activity.find({ userId }).sort({ date: -1 }).limit(10).lean(),
      Quest.countDocuments({ userId, completed: true }),
    ]);
    if (!user) return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    res.json({ player: user, xpProgress: getXPProgress(user.xp, user.level), activeQuests, recentActivity, summary: { activeQuests: activeQuests.length, completedQuests: completedCount } });
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to load dashboard' } });
  }
});

export default router;
