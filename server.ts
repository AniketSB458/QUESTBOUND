import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import { connectDB, disconnectDB, isDatabaseReady } from './server/db';
import 'dotenv/config';

// Import Routes
import authRoutes from './server/routes/auth';
import questRoutes from './server/routes/quests';
import shopRoutes from './server/routes/shop';
import historyRoutes from './server/routes/history';
import dashboardRoutes from './server/routes/dashboard';
import { seedData } from './seed';
import { seedDemo } from './server/utils/seedDemo';

async function startServer() {
  if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
    throw new Error('JWT_SECRET must contain at least 32 characters in production');
  }
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middleware
  const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000').split(',').map((origin) => origin.trim());
  app.disable('x-powered-by');
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(cors({ origin: (origin, callback) => !origin || allowedOrigins.includes(origin) ? callback(null, true) : callback(new Error('Origin not allowed')), credentials: true }));
  app.use(express.json({ limit: '32kb' }));
  app.use('/api', rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: 'draft-8', legacyHeaders: false }));
  app.use('/api/auth', rateLimit({ windowMs: 15 * 60_000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false }));

  // Connect to Database
  await connectDB();
  
  // Seed initial data
  if (process.env.SEED_DATA === 'true') {
    await seedData();
    if (process.env.SEED_DEMO === 'true') await seedDemo();
  }

  // API Routes
  app.get('/api/health', (_req, res) => {
    const ready = isDatabaseReady();
    res.status(ready ? 200 : 503).json({ status: ready ? 'ok' : 'degraded', service: 'questbound-api', database: ready ? 'connected' : 'disconnected', timestamp: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/quests', questRoutes);
  app.use('/api/shop', shopRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/dashboard', dashboardRoutes);
  app.use('/api', (_req, res) => res.status(404).json({ error: { code: 'NOT_FOUND', message: 'API endpoint not found' } }));

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

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`QUESTBOUND server running on port ${PORT}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received; shutting down gracefully`);
    server.close(async () => {
      try {
        await disconnectDB();
        process.exit(0);
      } catch (error) {
        console.error('Graceful shutdown failed', error);
        process.exit(1);
      }
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((error) => {
  console.error('Server startup failed:', error instanceof Error ? error.message : error);
  process.exit(1);
});
