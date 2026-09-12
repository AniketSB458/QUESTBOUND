import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Quest } from '../models/Quest';
import { ShopItem } from '../models/ShopItem';
import { Activity } from '../models/Activity';
import { calculateQuestRewards, mapCategoryToAttribute } from './rpgLogic';

export const seedDemo = async () => {
  try {
    const demoEmail = 'demo@nexus.net';
    const existingDemo = await User.findOne({ email: demoEmail });
    
    if (existingDemo) {
      console.log('Demo user already exists. Skipping demo seed.');
      return;
    }

    console.log('Seeding demo data...');
    
    // Ensure Shop Items exist
    const shopItems = await ShopItem.find({});
    if (shopItems.length === 0) {
       console.log('Shop items not found, run seed.ts first');
       return;
    }

    const crown = shopItems.find(i => i.name === 'Neon Crown');
    const badge = shopItems.find(i => i.name === 'Legendary Explorer Badge');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('nexus2077', salt);

    // XP calculation: 
    // Level 16 -> 6400 XP
    // Level 17 -> 7009 XP
    // 6800 XP gives Level 17 with some progress towards 18
    const demoUser = await User.create({
      name: 'CyberPunk',
      email: demoEmail,
      password: hashedPassword,
      level: 17,
      xp: 6800, 
      credits: 1337,
      streak: 12,
      longestStreak: 24,
      attributes: {
        strength: 72,
        intellect: 91,
        discipline: 85,
        creativity: 63,
        endurance: 44,
        health: 80
      },
      inventory: crown ? [crown._id] : [],
      badges: badge ? [badge._id] : [],
    });

    // Add Active Quests
    const activeQuests = [
      { title: 'Deploy NEXUS to Production', category: 'Coding', difficulty: 'Epic' },
      { title: 'Morning Cyber-Jog (5km)', category: 'Fitness', difficulty: 'Medium' },
      { title: 'Read "Do Androids Dream of Electric Sheep?"', category: 'Reading', difficulty: 'Hard' },
      { title: '15 Min Void Meditation', category: 'Personal', difficulty: 'Easy' },
    ] as const;

    for (const q of activeQuests) {
      const rewards = calculateQuestRewards(q.difficulty);
      await Quest.create({
        userId: demoUser._id,
        ...q,
        xpReward: rewards.xp,
        creditReward: rewards.credits,
        attributeReward: rewards.attribute,
        completed: false
      });
    }

    // Add Completed Quests & Activity
    const completedQuests = [
      { title: 'Optimize Database Queries', category: 'Coding', difficulty: 'Hard' },
      { title: 'Meal Prep for the week', category: 'Health', difficulty: 'Medium' },
    ] as const;

    for (let i = 0; i < completedQuests.length; i++) {
      const q = completedQuests[i];
      const rewards = calculateQuestRewards(q.difficulty);
      const date = new Date();
      date.setDate(date.getDate() - i - 1); // past few days

      const quest = await Quest.create({
        userId: demoUser._id,
        ...q,
        xpReward: rewards.xp,
        creditReward: rewards.credits,
        attributeReward: rewards.attribute,
        completed: true,
        completedAt: date,
        createdAt: date
      });

      if (quest) {
        await Activity.create({
          userId: demoUser._id,
          questId: quest._id,
          action: 'QUEST_COMPLETED',
          xpEarned: rewards.xp,
          creditsEarned: rewards.credits,
          attribute: mapCategoryToAttribute(q.category),
          attributeIncrease: rewards.attribute,
          date: date,
          details: {
            questTitle: quest.title,
            levelUp: false
          }
        });
      }
    }

    console.log('Demo user seeded successfully.');
  } catch (error) {
     console.error('Failed to seed demo data', error);
  }
};
