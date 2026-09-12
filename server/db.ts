import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongoServer: MongoMemoryReplSet | null = null;

export const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MONGODB_URI found. Starting in-memory MongoDB for local testing...');
      mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
      mongoUri = mongoServer.getUri();
    }

    mongoose.set('bufferCommands', false); // CRITICAL: fail fast, don't hang
    await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error instanceof Error ? error.message : error}`);
    console.warn('[AI Studio] Database offline or could not connect — mock fallback will handle requests');
  }
};
