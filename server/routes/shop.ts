import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { ShopItem } from '../models/ShopItem';
import { User } from '../models/User';
import { Activity } from '../models/Activity';

const router = express.Router();

// @route   GET /api/shop
router.get('/', protect, async (req, res) => {
  try {
    const items = await ShopItem.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/shop/:id/purchase
router.post('/:id/purchase', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const user = await User.findById(req.user.id);
    const item = await ShopItem.findById(req.params.id);

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Check if already owns
    if (user.inventory.includes(item._id) || user.badges.includes(item._id)) {
      return res.status(400).json({ message: 'You already own this item' });
    }

    if (user.credits < item.price) {
      return res.status(400).json({ message: 'Insufficient credits' });
    }

    // Purchase
    user.credits -= item.price;
    
    if (item.type === 'badge') {
      user.badges.push(item._id);
    } else {
      user.inventory.push(item._id);
    }

    await user.save();

    await Activity.create({
      userId: user._id,
      action: 'ITEM_PURCHASED',
      details: {
        itemId: item._id,
        itemName: item.name,
        price: item.price
      }
    });

    res.json({
      message: 'Item purchased successfully',
      credits: user.credits,
      inventory: user.inventory,
      badges: user.badges
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
