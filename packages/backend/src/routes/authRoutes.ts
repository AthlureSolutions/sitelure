// packages/backend/src/routes/authRoutes.ts
import { Router } from 'express';
import { register, login, deleteAccount } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.delete('/delete-account', authMiddleware, deleteAccount);

export default router;
