import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import {
  generateUploadUrl,
  confirmUpload,
  generateDownloadUrl,
  getFileMetadata,
  deleteFile,
} from '../controllers/fileController';

const router = Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

// File upload routes
router.post('/upload-url', generateUploadUrl);
router.post('/confirm-upload', confirmUpload);

// File download routes
router.post('/download-url', generateDownloadUrl);

// File management routes
router.get('/:fileId/metadata', getFileMetadata);
router.delete('/:fileId', deleteFile);

export default router;
