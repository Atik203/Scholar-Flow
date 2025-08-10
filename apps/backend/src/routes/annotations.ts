import express from 'express';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// GET /papers/:id/annotations
router.get('/:paperId/annotations', async (req: AuthRequest, res) => {
  res.status(501).json({ 
    error: 'Annotations not yet implemented',
    message: 'This endpoint will return annotations for a paper'
  });
});

// POST /papers/:id/annotations
router.post('/:paperId/annotations', async (req: AuthRequest, res) => {
  res.status(501).json({ 
    error: 'Annotations not yet implemented',
    message: 'This endpoint will create new annotations'
  });
});

export default router;