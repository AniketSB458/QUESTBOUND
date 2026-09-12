import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { protect, AuthRequest } from '../middleware/auth';

const router = express.Router();

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'nexus_super_secret_key_dev', {
    expiresIn: '30d',
  });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
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
    res.status(500).json({ message: 'Server error during registration', error });
  }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

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
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login', error });
  }
});

// @route   POST /api/auth/quiz
router.post('/quiz', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
       return res.status(401).json({ message: 'Not authorized' });
    }
    const { 
      characterClass, 
      identity, 
      element, 
      companion, 
      specialAbility, 
      baseAttributes, 
      rewards 
    } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.characterClass = characterClass || user.characterClass;
    user.identity = identity || user.identity;
    user.element = element || user.element;
    user.companion = companion || user.companion;
    user.specialAbility = specialAbility || user.specialAbility;
    user.quizCompleted = true;

    if (baseAttributes) {
      if (typeof baseAttributes.strength === 'number') user.attributes.strength = Math.max(user.attributes.strength || 1, baseAttributes.strength);
      if (typeof baseAttributes.intellect === 'number') user.attributes.intellect = Math.max(user.attributes.intellect || 1, baseAttributes.intellect);
      if (typeof baseAttributes.discipline === 'number') user.attributes.discipline = Math.max(user.attributes.discipline || 1, baseAttributes.discipline);
      if (typeof baseAttributes.creativity === 'number') user.attributes.creativity = Math.max(user.attributes.creativity || 1, baseAttributes.creativity);
      if (typeof baseAttributes.energy === 'number') user.attributes.energy = Math.max(user.attributes.energy || 1, baseAttributes.energy);
      if (typeof baseAttributes.empathy === 'number') user.attributes.empathy = Math.max(user.attributes.empathy || 1, baseAttributes.empathy);
    }

    if (rewards && user.discoveryVersion !== 2) {
      if (typeof rewards.xp === 'number') user.xp += rewards.xp;
      if (typeof rewards.credits === 'number') user.credits += rewards.credits;
    }

    user.discoveryVersion = 2;
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating quiz', error });
  }
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
       return res.status(401).json({ message: 'Not authorized' });
    }
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user', error });
  }
});

export default router;
