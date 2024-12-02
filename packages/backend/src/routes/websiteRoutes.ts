// packages/backend/src/routes/websiteRoutes.ts
import { Router } from 'express';
import { 
  createWebsiteHandler, 
  getUserWebsitesHandler,
  getWebsiteDetailsHandler,
  deleteWebsiteHandler,
  uploadImageHandler
} from '../controllers/websiteController';
import { authMiddleware } from '../middleware/authMiddleware';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadsPath = path.join(__dirname, '../../../astro-template/public/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadsPath)) {
      fs.mkdirSync(uploadsPath, { recursive: true });
    }
    cb(null, uploadsPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'));
    }
  }
});

// Create website
router.post('/', authMiddleware, createWebsiteHandler);

// Upload image
router.post('/upload-image', authMiddleware, upload.single('image'), uploadImageHandler);

// Get user's websites
router.get('/', authMiddleware, getUserWebsitesHandler);

// Get website details
router.get('/:id', authMiddleware, getWebsiteDetailsHandler);

// Delete website
router.delete('/:id', authMiddleware, deleteWebsiteHandler);

export default router;
