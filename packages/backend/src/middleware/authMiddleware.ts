// packages/backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface AuthRequest extends Request {
  user?: string;
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): any => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: 'Authorization header missing' });

  const token = authHeader.split(' ')[1];
  if (!token)
    return res.status(401).json({ message: 'Token missing' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
    req.user = decoded.userId;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};
