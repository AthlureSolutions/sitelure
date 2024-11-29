// packages/backend/src/routes/websiteRoutes.ts
import { Router } from 'express';
import { createWebsiteHandler } from '../controllers/websiteController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createWebsiteHandler);

export default router;
