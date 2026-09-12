import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { Activity } from '../models/Activity';

const router = express.Router();

// @route   GET /api/history
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const page = Math.min(Math.max(Number(req.query.page) || 1, 1), 1000);
    const history = await Activity.find({ userId: req.user.id })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();
      
    res.json(history);
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to load activity history' } });
  }
});

export default router;
