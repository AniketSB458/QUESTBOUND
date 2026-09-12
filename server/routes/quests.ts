import express from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { protect, AuthRequest } from '../middleware/auth';
import { Quest } from '../models/Quest';
import { User } from '../models/User';
import { Activity } from '../models/Activity';
import { calculateQuestRewards, mapCategoryToAttribute, getXPRequiredForLevel } from '../utils/rpgLogic';

const router = express.Router();
const categories = ['Coding', 'Study', 'Fitness', 'Health', 'Reading', 'Creativity', 'Personal', 'Other'] as const;
const difficulties = ['Easy', 'Medium', 'Hard', 'Epic'] as const;
const questInput = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).default(''),
  category: z.enum(categories),
  difficulty: z.enum(difficulties),
  dueDate: z.coerce.date().optional(),
});
const questUpdate = questInput.partial().refine((value) => Object.keys(value).length > 0, 'At least one field is required');

const localDayNumber = (date: Date, timezone: string) => {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
    return Math.floor(Date.UTC(get('year'), get('month') - 1, get('day')) / 86_400_000);
  } catch {
    return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
  }
};

router.get('/', protect, async (req: AuthRequest, res) => {
  try {
    const completed = req.query.completed === undefined ? undefined : req.query.completed === 'true';
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const page = Math.min(Math.max(Number(req.query.page) || 1, 1), 1000);
    const filter: Record<string, unknown> = { userId: req.user!.id };
    if (completed !== undefined) filter.completed = completed;
    res.json(await Quest.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean());
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to load quests' } });
  }
});

router.post('/', protect, async (req: AuthRequest, res) => {
  try {
    const parsed = questInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid quest', fields: parsed.error.flatten().fieldErrors } });
    const rewards = calculateQuestRewards(parsed.data.difficulty);
    const quest = await Quest.create({ userId: req.user!.id, ...parsed.data, xpReward: rewards.xp, creditReward: rewards.credits, attributeReward: rewards.attribute });
    res.status(201).json(quest);
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to create quest' } });
  }
});

router.patch('/:id', protect, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
    const parsed = questUpdate.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid quest update', fields: parsed.error.flatten().fieldErrors } });
    const update: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.difficulty) {
      const rewards = calculateQuestRewards(parsed.data.difficulty);
      Object.assign(update, { xpReward: rewards.xp, creditReward: rewards.credits, attributeReward: rewards.attribute });
    }
    const quest = await Quest.findOneAndUpdate({ _id: req.params.id, userId: req.user!.id, completed: false }, { $set: update }, { new: true, runValidators: true });
    if (!quest) return res.status(404).json({ error: { code: 'QUEST_NOT_FOUND', message: 'Active quest not found' } });
    res.json(quest);
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to update quest' } });
  }
});

router.post('/:id/complete', protect, async (req: AuthRequest, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
  const session = await mongoose.startSession();
  let result: Record<string, unknown> | undefined;
  try {
    await session.withTransaction(async () => {
      const completedAt = new Date();
      const quest = await Quest.findOneAndUpdate(
        { _id: req.params.id, userId: req.user!.id, completed: false },
        { $set: { completed: true, completedAt } },
        { new: true, session },
      );
      if (!quest) throw Object.assign(new Error('Quest not found or already completed'), { status: 409, code: 'QUEST_ALREADY_COMPLETED' });
      const user = await User.findById(req.user!.id).session(session);
      if (!user) throw Object.assign(new Error('User not found'), { status: 404, code: 'USER_NOT_FOUND' });

      const rewards = calculateQuestRewards(quest.difficulty);
      const targetAttribute = mapCategoryToAttribute(quest.category);
      const previousLevel = user.level;
      user.xp += rewards.xp;
      user.credits += rewards.credits;
      const attributes = user.attributes as unknown as Record<string, number>;
      attributes[targetAttribute] = (attributes[targetAttribute] ?? 1) + rewards.attribute;

      const today = localDayNumber(completedAt, user.timezone || 'UTC');
      const lastDay = user.lastActiveDate ? localDayNumber(user.lastActiveDate, user.timezone || 'UTC') : undefined;
      if (lastDay === undefined || today - lastDay > 1) user.streak = 1;
      else if (today - lastDay === 1) user.streak += 1;
      user.longestStreak = Math.max(user.longestStreak, user.streak);
      user.lastActiveDate = completedAt;
      while (user.xp >= getXPRequiredForLevel(user.level)) user.level += 1;
      await user.save({ session });

      await Activity.create([{ userId: user._id, questId: quest._id, action: 'QUEST_COMPLETED', xpEarned: rewards.xp, creditsEarned: rewards.credits, attribute: targetAttribute, attributeIncrease: rewards.attribute, date: completedAt, details: { questTitle: quest.title, levelUp: user.level > previousLevel, newLevel: user.level } }], { session });
      result = {
        message: 'Quest completed', quest,
        rewards: { xp: rewards.xp, credits: rewards.credits, attribute: targetAttribute, attributeIncrease: rewards.attribute },
        playerState: { level: user.level, xp: user.xp, credits: user.credits, streak: user.streak, longestStreak: user.longestStreak, attributes: user.attributes },
        levelUpEvent: user.level > previousLevel ? { previousLevel, newLevel: user.level } : null,
      };
    });
    res.json(result);
  } catch (error) {
    const known = error as { status?: number; code?: string };
    res.status(known.status || 500).json({ error: { code: known.code || 'INTERNAL_ERROR', message: known.status ? (error as Error).message : 'Unable to complete quest' } });
  } finally {
    await session.endSession();
  }
});

router.delete('/:id', protect, async (req: AuthRequest, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ error: { code: 'QUEST_NOT_FOUND', message: 'Quest not found' } });
    const quest = await Quest.findOneAndDelete({ _id: req.params.id, userId: req.user!.id, completed: false });
    if (!quest) return res.status(404).json({ error: { code: 'QUEST_NOT_FOUND', message: 'Active quest not found' } });
    res.status(204).send();
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to delete quest' } });
  }
});

export default router;
