import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongoServer: MongoMemoryReplSet | null = null;

export const connectDB = async () => {
  mongoose.set('bufferCommands', false);
  let mongoUri = process.env.MONGODB_URI;

  if (!mongoUri && process.env.NODE_ENV === 'production') {
    throw new Error('MONGODB_URI is required in production');
  }

  if (!mongoUri) {
    console.log('No MONGODB_URI found. Starting development-only in-memory MongoDB...');
    mongoServer = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
    mongoUri = mongoServer.getUri();
  }

  await mongoose.connect(mongoUri, {
    maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE) || 20,
    minPoolSize: Number(process.env.DB_MIN_POOL_SIZE) || 0,
    maxIdleTimeMS: 60_000,
    serverSelectionTimeoutMS: 8_000,
    socketTimeoutMS: 45_000,
    connectTimeoutMS: 10_000,
    retryWrites: true,
  });
  await mongoose.connection.db?.admin().ping();
  console.log(`MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
};

export const isDatabaseReady = () => mongoose.connection.readyState === 1;

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
    mongoServer = null;
  }
};
