import express from 'express';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validation schemas
const paperFilterSchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 20),
  search: z.string().optional(),
  workspaceId: z.string().optional(),
  semantic: z.string().optional().transform(val => val === 'true'),
});

// GET /papers - List papers with filtering
router.get('/', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { page, limit, search, workspaceId, semantic } = paperFilterSchema.parse(req.query);
    const offset = (page - 1) * limit;

    const where: any = {
      isDeleted: false,
    };

    // Add workspace filter if provided
    if (workspaceId) {
      where.workspaceId = workspaceId;
    }

    // Add search filter
    if (search && !semantic) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { abstract: { contains: search, mode: 'insensitive' } },
      ];
    }

    // For semantic search, we'll need to implement vector search later
    if (semantic && search) {
      // TODO: Implement vector similarity search using pgvector
      res.json({
        papers: [],
        total: 0,
        page,
        totalPages: 0,
        message: 'Semantic search not yet implemented',
      });
      return;
    }

    const [papers, total] = await Promise.all([
      prisma.paper.findMany({
        where,
        include: {
          uploader: {
            select: { id: true, name: true, email: true },
          },
          workspace: {
            select: { id: true, name: true },
          },
          file: {
            select: { id: true, contentType: true, sizeBytes: true, pageCount: true },
          },
          _count: {
            select: { annotations: true, collectionJoins: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit,
      }),
      prisma.paper.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      papers,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error('Error fetching papers:', error);
    res.status(500).json({ error: 'Failed to fetch papers' });
  }
});

// GET /papers/:id - Get paper details
router.get('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { id } = req.params;

    const paper = await prisma.paper.findUnique({
      where: { id, isDeleted: false },
      include: {
        uploader: {
          select: { id: true, name: true, email: true },
        },
        workspace: {
          select: { id: true, name: true },
        },
        file: true,
        chunks: {
          select: { id: true, idx: true, page: true, content: true, tokenCount: true },
          orderBy: { idx: 'asc' },
        },
        annotations: {
          where: { isDeleted: false },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
        aiSummaries: {
          orderBy: { createdAt: 'desc' },
        },
        _count: {
          select: { 
            citationsFrom: true, 
            citationsTo: true,
            collectionJoins: true,
          },
        },
      },
    });

    if (!paper) {
      res.status(404).json({ error: 'Paper not found' });
      return;
    }

    res.json(paper);
  } catch (error) {
    console.error('Error fetching paper:', error);
    res.status(500).json({ error: 'Failed to fetch paper' });
  }
});

// POST /papers/upload-url - Get pre-signed upload URL
router.post('/upload-url', async (req: AuthRequest, res) => {
  try {
    // TODO: Implement S3 pre-signed URL generation
    res.status(501).json({ 
      error: 'Upload URL generation not yet implemented',
      message: 'This endpoint will generate S3 pre-signed URLs for file uploads'
    });
  } catch (error) {
    console.error('Error generating upload URL:', error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
});

// POST /papers/import - Import paper by DOI/API
router.post('/import', async (req: AuthRequest, res) => {
  try {
    // TODO: Implement paper import from external APIs
    res.status(501).json({ 
      error: 'Paper import not yet implemented',
      message: 'This endpoint will import papers from DOI, arXiv, OpenAlex, etc.'
    });
  } catch (error) {
    console.error('Error importing paper:', error);
    res.status(500).json({ error: 'Failed to import paper' });
  }
});

// DELETE /papers/:id - Soft delete paper
router.delete('/:id', async (req: AuthRequest, res): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user!.id;

    const paper = await prisma.paper.findUnique({
      where: { id, isDeleted: false },
      select: { uploaderId: true, workspaceId: true },
    });

    if (!paper) {
      res.status(404).json({ error: 'Paper not found' });
      return;
    }

    // Check if user can delete this paper (owner or admin)
    if (paper.uploaderId !== userId) {
      // TODO: Check if user is admin or workspace owner
      res.status(403).json({ error: 'Not authorized to delete this paper' });
      return;
    }

    await prisma.paper.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    console.error('Error deleting paper:', error);
    res.status(500).json({ error: 'Failed to delete paper' });
  }
});

export default router;