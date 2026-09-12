import { ShopItem } from './server/models/ShopItem';
import { connectDB } from './server/db';
import mongoose from 'mongoose';

const seedData = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }

    const count = await ShopItem.countDocuments();
    if (count > 0) {
      console.log('Shop items already exist. Skipping seed.');
      return;
    }

    console.log('Clearing existing shop items...');
    await ShopItem.deleteMany();

    const items = [
      {
        name: 'Neon Crown',
        description: 'A glowing cyberpunk crown for the elite.',
        price: 1500,
        type: 'cosmetic',
        rarity: 'Legendary',
        icon: 'Crown',
      },
      {
        name: 'Cyber Badge',
        description: 'Show your dedication to the network.',
        price: 500,
        type: 'badge',
        rarity: 'Rare',
        icon: 'Award',
      },
      {
        name: 'Galaxy Theme',
        description: 'A theme as vast as your potential.',
        price: 2000,
        type: 'theme',
        rarity: 'Epic',
        icon: 'Palette',
      },
      {
        name: 'Elite Frame',
        description: 'Frame your avatar with cybernetic precision.',
        price: 1000,
        type: 'cosmetic',
        rarity: 'Epic',
        icon: 'Crop',
      },
      {
        name: 'Legendary Explorer Badge',
        description: 'For those who forge their own paths.',
        price: 3000,
        type: 'badge',
        rarity: 'Legendary',
        icon: 'Compass',
      }
    ];

    await ShopItem.insertMany(items);
    console.log('Shop items seeded successfully.');
  } catch (error) {
    console.error('Error seeding data:', error);
    throw error;
  }
};

export { seedData };
