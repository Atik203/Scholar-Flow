import express from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schema for session validation
const sessionValidationSchema = z.object({
  token: z.string(),
});

// POST /auth/session/validate - Validate JWT session
router.post('/session/validate', async (req, res): Promise<void> => {
  try {
    const { token } = sessionValidationSchema.parse(req.body);
    const jwtSecret = process.env.NEXTAUTH_SECRET;

    if (!jwtSecret) {
      res.status(500).json({ error: 'JWT secret not configured' });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        image: true,
        isDeleted: true,
      }
    });

    if (!user || user.isDeleted) {
      res.status(401).json({ error: 'Invalid token or user not found' });
      return;
    }

    res.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error('Session validation error:', error);
    res.status(401).json({ 
      valid: false, 
      error: 'Invalid token' 
    });
  }
});

export default router;