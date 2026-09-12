import express from 'express';
import path from 'path';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db';
import 'dotenv/config';

// Import Routes (to be created)
import authRoutes from './server/routes/auth';
import questRoutes from './server/routes/quests';
import shopRoutes from './server/routes/shop';
import historyRoutes from './server/routes/history';
import { seedData } from './seed';
import { seedDemo } from './server/utils/seedDemo';

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Connect to Database
  await connectDB();
  
  // Seed initial data
  await seedData();
  await seedDemo();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'NEXUS System Online' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/quests', questRoutes);
  app.use('/api/shop', shopRoutes);
  app.use('/api/history', historyRoutes);

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

  app.listen(PORT, () => {
    console.log(`NEXUS Server running on port ${PORT}`);
  });
}

startServer();
