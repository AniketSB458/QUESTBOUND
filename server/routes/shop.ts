import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { ShopItem } from '../models/ShopItem';
import { User } from '../models/User';
import { Activity } from '../models/Activity';
import mongoose from 'mongoose';

const router = express.Router();

// @route   GET /api/shop
router.get('/', protect, async (req, res) => {
  try {
    const items = await ShopItem.find({}).sort({ price: 1 }).lean();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/shop/:id/purchase
router.post('/:id/purchase', protect, async (req: AuthRequest, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { code: 'ITEM_NOT_FOUND', message: 'Item not found' } });
  const session = await mongoose.startSession();
  try {
    let result: Record<string, unknown> | undefined;
    await session.withTransaction(async () => {
      const item = await ShopItem.findById(req.params.id).session(session);
      if (!item) throw Object.assign(new Error('Item not found'), { status: 404, code: 'ITEM_NOT_FOUND' });
      const ownershipFilter = item.type === 'badge'
        ? { badges: { $ne: item._id } }
        : { inventory: { $ne: item._id } };
      const destination = item.type === 'badge' ? 'badges' : 'inventory';
      const user = await User.findOneAndUpdate(
        { _id: req.user!.id, credits: { $gte: item.price }, ...ownershipFilter },
        { $inc: { credits: -item.price }, $addToSet: { [destination]: item._id } },
        { new: true, session },
      );
      if (!user) {
        const current = await User.findById(req.user!.id).session(session);
        if (!current) throw Object.assign(new Error('User not found'), { status: 404, code: 'USER_NOT_FOUND' });
        const owned = current.inventory.some((id) => id.equals(item._id)) || current.badges.some((id) => id.equals(item._id));
        throw Object.assign(new Error(owned ? 'You already own this item' : 'Insufficient credits'), { status: 409, code: owned ? 'ITEM_ALREADY_OWNED' : 'INSUFFICIENT_CREDITS' });
      }
      await Activity.create([{ userId: user._id, action: 'ITEM_PURCHASED', details: { itemId: item._id, itemName: item.name, price: item.price } }], { session });
      result = { message: 'Item purchased successfully', credits: user.credits, inventory: user.inventory, badges: user.badges };
    });
    res.json(result);
  } catch (error) {
    const known = error as { status?: number; code?: string };
    res.status(known.status || 500).json({ error: { code: known.code || 'INTERNAL_ERROR', message: known.status ? (error as Error).message : 'Unable to purchase item' } });
  } finally {
    await session.endSession();
  }
});

export default router;
