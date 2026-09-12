import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { Activity } from '../models/Activity';

const router = express.Router();

// @route   GET /api/history
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const history = await Activity.find({ userId: req.user.id })
      .sort({ date: -1 })
      .limit(limit)
      .lean();
      
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
