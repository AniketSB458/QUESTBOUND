import express from 'express';
import { protect, AuthRequest } from '../middleware/auth';
import { Quest } from '../models/Quest';
import { User } from '../models/User';
import { Activity } from '../models/Activity';
import { calculateQuestRewards, mapCategoryToAttribute, getXPRequiredForLevel } from '../utils/rpgLogic';

const router = express.Router();

// @route   GET /api/quests
router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const quests = await Quest.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(quests);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/quests
router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    
    const { title, description, category, difficulty } = req.body;
    
    if (!title || !category || !difficulty) {
      return res.status(400).json({ message: 'Title, category, and difficulty are required' });
    }

    const rewards = calculateQuestRewards(difficulty);

    const quest = await Quest.create({
      userId: req.user.id,
      title,
      description,
      category,
      difficulty,
      xpReward: rewards.xp,
      creditReward: rewards.credits,
      attributeReward: rewards.attribute,
    });

    res.status(201).json(quest);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/quests/:id/complete
router.post('/:id/complete', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    // Check ownership
    if (quest.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to complete this quest' });
    }

    if (quest.completed) {
      return res.status(400).json({ message: 'Quest already completed' });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Update Quest
    quest.completed = true;
    quest.completedAt = new Date();
    await quest.save();

    // 2. Calculate rewards (Server-side trust)
    const rewards = calculateQuestRewards(quest.difficulty);
    const targetAttribute = mapCategoryToAttribute(quest.category);

    // 3. Update User Stats
    const prevLevel = user.level;
    user.xp += rewards.xp;
    user.credits += rewards.credits;
    
    // Type assertion to access dynamic attributes safely
    const attributes = user.attributes as any;
    if (attributes && typeof attributes[targetAttribute] === 'number') {
      attributes[targetAttribute] += rewards.attribute;
    }

    // Streak logic
    const now = new Date();
    const lastActive = user.lastActiveDate;
    
    if (lastActive) {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const last = new Date(lastActive.getFullYear(), lastActive.getMonth(), lastActive.getDate());
      
      const diffTime = Math.abs(today.getTime() - last.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      if (diffDays === 1) {
        user.streak += 1;
      } else if (diffDays > 1) {
        user.streak = 1;
      }
      // if diffDays === 0, already active today, streak stays same
    } else {
       user.streak = 1;
    }

    if (user.streak > user.longestStreak) {
      user.longestStreak = user.streak;
    }
    
    user.lastActiveDate = now;

    // Check Level Up
    let levelUp = false;
    let newLevel = prevLevel;
    while (user.xp >= getXPRequiredForLevel(user.level)) {
       user.level += 1;
       levelUp = true;
       newLevel = user.level;
    }

    await user.save();

    // 4. Record Activity
    await Activity.create({
      userId: user._id,
      questId: quest._id,
      action: 'QUEST_COMPLETED',
      xpEarned: rewards.xp,
      creditsEarned: rewards.credits,
      attribute: targetAttribute,
      attributeIncrease: rewards.attribute,
      details: {
        questTitle: quest.title,
        levelUp,
        newLevel
      }
    });

    res.json({
      message: 'Quest completed',
      quest,
      rewards: {
        xp: rewards.xp,
        credits: rewards.credits,
        attribute: targetAttribute,
        attributeIncrease: rewards.attribute
      },
      playerState: {
        level: user.level,
        xp: user.xp,
        credits: user.credits,
        streak: user.streak,
        attributes: user.attributes
      },
      levelUpEvent: levelUp ? { previousLevel: prevLevel, newLevel: newLevel } : null
    });

  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// @route   DELETE /api/quests/:id
router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    const quest = await Quest.findById(req.params.id);

    if (!quest) {
      return res.status(404).json({ message: 'Quest not found' });
    }

    if (quest.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await quest.deleteOne();
    res.json({ message: 'Quest removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
