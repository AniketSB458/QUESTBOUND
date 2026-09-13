import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db';
import 'dotenv/config';

// Import Routes
import authRoutes from './server/routes/auth';
import questRoutes from './server/routes/quests';
import shopRoutes from './server/routes/shop';
import historyRoutes from './server/routes/history';
import { seedData } from './seed';
import { seedDemo } from './server/utils/seedDemo';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to Database
  await connectDB();
  
  // Seed initial data if connected
  if (mongoose.connection.readyState === 1) {
    try {
      await seedData();
      await seedDemo();
    } catch (err) {
      console.warn('Seed data warning:', err);
    }
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'NEXUS System Online' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/quests', questRoutes);
  app.use('/api/shop', shopRoutes);
  app.use('/api/history', historyRoutes);

  // Database error fallback middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === 'MongooseError' || err.name === 'MongoNetworkError' || (err.message && err.message.includes('buffering timed out'))) {
      console.warn('[AI Studio] Database offline — returning mock empty response');
      if (req.method === 'GET') {
        return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
      }
      return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
    }
    next(err);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXUS Server running on port ${PORT}`);
  });
}

startServer();
