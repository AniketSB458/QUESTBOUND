import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(503).json({ error: { code: 'SERVER_MISCONFIGURED', message: 'Authentication is unavailable' } });
  }

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] }) as { id: string };

      req.user = { id: decoded.id };
      next();
    } catch (error) {
      return res.status(401).json({ error: { code: 'INVALID_TOKEN', message: 'Authentication token is invalid or expired' } });
    }
  } else {
    return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Authentication is required' } });
  }
};
