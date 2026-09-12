import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';
import { z } from 'zod';
import { calculateCharacterProfile } from '../utils/characterProfile';

const router = express.Router();

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
});

const registerSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(50),
  timezone: z.string().trim().min(1).max(64).default('UTC'),
});

const traitsSchema = z.object({
  intellect: z.number().int().min(0).max(15),
  courage: z.number().int().min(0).max(15),
  discipline: z.number().int().min(0).max(15),
  creativity: z.number().int().min(0).max(15),
  empathy: z.number().int().min(0).max(15),
  energy: z.number().int().min(0).max(15),
}).refine((traits) => Object.values(traits).reduce((sum, value) => sum + value, 0) === 25, 'Quiz traits must total 25 points');

const generateToken = (id: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return jwt.sign({ id }, secret, {
    expiresIn: '7d',
    algorithm: 'HS256',
  });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid registration details', fields: parsed.error.flatten().fieldErrors } });
    const { name, email, password, timezone } = parsed.data;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(409).json({ error: { code: 'EMAIL_IN_USE', message: 'An account with this email already exists' } });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      timezone,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        credits: user.credits,
        streak: user.streak,
        longestStreak: user.longestStreak,
        attributes: user.attributes,
        characterClass: user.characterClass,
        quizCompleted: user.quizCompleted,
        inventory: user.inventory,
        badges: user.badges,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    if ((error as { code?: number }).code === 11000) return res.status(409).json({ error: { code: 'EMAIL_IN_USE', message: 'An account with this email already exists' } });
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to create account' } });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const parsed = credentialsSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A valid email and password are required' } });
    const { email, password } = parsed.data;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        level: user.level,
        xp: user.xp,
        credits: user.credits,
        streak: user.streak,
        longestStreak: user.longestStreak,
        attributes: user.attributes,
        characterClass: user.characterClass,
        quizCompleted: user.quizCompleted,
        inventory: user.inventory,
        badges: user.badges,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } });
    }
  } catch (error) {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to sign in' } });
  }
});

// @route   POST /api/auth/quiz
router.post('/quiz', protect, async (req: AuthRequest, res) => {
  try {
    const parsed = traitsSchema.safeParse(req.body?.traits);
    if (!parsed.success) return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid quiz result', fields: parsed.error.flatten().fieldErrors } });
    const profile = calculateCharacterProfile(parsed.data);
    const attributes = Object.fromEntries(Object.entries(profile.baseAttributes).map(([key, value]) => [`attributes.${key}`, value]));
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user!.id, quizCompleted: false },
      {
        $set: { characterClass: profile.characterClass, identity: profile.identity, element: profile.element, companion: profile.companion, specialAbility: profile.specialAbility, quizCompleted: true, discoveryVersion: 2 },
        $max: attributes,
        $inc: { xp: 250, credits: 100 },
      },
      { new: true, runValidators: true },
    );
    if (!updatedUser) {
      const exists = await User.exists({ _id: req.user!.id });
      return res.status(exists ? 409 : 404).json({ error: { code: exists ? 'QUIZ_ALREADY_COMPLETED' : 'USER_NOT_FOUND', message: exists ? 'Character discovery is already complete' : 'User not found' } });
    }
    res.json(updatedUser);
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to complete character discovery' } });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Authentication is required' } });
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: { code: 'USER_NOT_FOUND', message: 'User not found' } });
    res.json(user);
  } catch {
    res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unable to load profile' } });
  }
});

export default router;
