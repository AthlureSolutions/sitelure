// packages/backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): any => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    console.log('Decoded token:', decoded);
    
    const userId = (decoded as any).userId;
    console.log('Extracted user ID:', userId);
    
    if (!userId) {
      console.error('No user ID in token');
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Set user object with id property
    (req as AuthenticatedRequest).user = { id: userId };
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};
