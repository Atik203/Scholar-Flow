import { Router } from "express";
import { DiscussionService } from "../services/discussion.service";
import { authMiddleware } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { z } from "zod";

const router: Router = Router();

// Validation schemas
const createThreadSchema = z.object({
  body: z.object({
    paperId: z.string().uuid().optional(),
    collectionId: z.string().uuid().optional(),
    workspaceId: z.string().uuid().optional(),
    title: z.string().min(1).max(200),
    content: z.string().min(1).max(5000),
    tags: z.array(z.string().max(50)).optional().default([])
  }).refine(
    (data) => data.paperId || data.collectionId || data.workspaceId,
    {
      message: "At least one of paperId, collectionId, or workspaceId must be provided"
    }
  )
});

const getThreadsSchema = z.object({
  query: z.object({
    paperId: z.string().uuid().optional(),
    collectionId: z.string().uuid().optional(),
    workspaceId: z.string().uuid().optional(),
    isResolved: z.string().transform(val => val === 'true').optional(),
    isPinned: z.string().transform(val => val === 'true').optional(),
    tags: z.string().optional().transform(val => val ? val.split(',') : []),
    limit: z.string().transform(Number).optional().default("20"),
    offset: z.string().transform(Number).optional().default("0")
  })
});

const getThreadSchema = z.object({
  params: z.object({
    threadId: z.string().uuid()
  })
});

const updateThreadSchema = z.object({
  params: z.object({
    threadId: z.string().uuid()
  }),
  body: z.object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).max(5000).optional(),
    isResolved: z.boolean().optional(),
    isPinned: z.boolean().optional(),
    tags: z.array(z.string().max(50)).optional()
  })
});

const deleteThreadSchema = z.object({
  params: z.object({
    threadId: z.string().uuid()
  })
});

const createMessageSchema = z.object({
  body: z.object({
    threadId: z.string().uuid(),
    content: z.string().min(1).max(2000),
    parentId: z.string().uuid().optional()
  })
});

const updateMessageSchema = z.object({
  params: z.object({
    messageId: z.string().uuid()
  }),
  body: z.object({
    content: z.string().min(1).max(2000)
  })
});

const deleteMessageSchema = z.object({
  params: z.object({
    messageId: z.string().uuid()
  })
});

/**
 * @swagger
 * /api/discussions:
 *   post:
 *     summary: Create a new discussion thread
 *     description: Create a new discussion thread for a paper, collection, or workspace
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               paperId:
 *                 type: string
 *                 format: uuid
 *                 description: Paper ID for paper-specific discussion
 *               collectionId:
 *                 type: string
 *                 format: uuid
 *                 description: Collection ID for collection-specific discussion
 *               workspaceId:
 *                 type: string
 *                 format: uuid
 *                 description: Workspace ID for workspace-specific discussion
 *               title:
 *                 type: string
 *                 maxLength: 200
 *                 description: Discussion title
 *               content:
 *                 type: string
 *                 maxLength: 5000
 *                 description: Discussion content
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 50
 *                 description: Discussion tags
 *     responses:
 *       201:
 *         description: Discussion thread created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Paper, collection, or workspace not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authMiddleware,
  validateRequest(createThreadSchema),
  async (req, res, next) => {
    try {
      const thread = await DiscussionService.createThread(req, req.body);
      
      res.status(201).json({
        success: true,
        data: thread
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/discussions:
 *   get:
 *     summary: Get discussion threads
 *     description: Retrieve discussion threads with filtering options
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: paperId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by paper ID
 *       - in: query
 *         name: collectionId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by collection ID
 *       - in: query
 *         name: workspaceId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by workspace ID
 *       - in: query
 *         name: isResolved
 *         schema:
 *           type: boolean
 *         description: Filter by resolved status
 *       - in: query
 *         name: isPinned
 *         schema:
 *           type: boolean
 *         description: Filter by pinned status
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated tags to filter by
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of threads to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of threads to skip
 *     responses:
 *       200:
 *         description: Discussion threads retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authMiddleware,
  validateRequest(getThreadsSchema),
  async (req, res, next) => {
    try {
      const result = await DiscussionService.getThreads(req, req.query);
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/discussions/{threadId}:
 *   get:
 *     summary: Get a specific discussion thread
 *     description: Retrieve a discussion thread with all its messages
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Discussion thread ID
 *     responses:
 *       200:
 *         description: Discussion thread retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Discussion thread not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:threadId",
  authMiddleware,
  validateRequest(getThreadSchema),
  async (req, res, next) => {
    try {
      const thread = await DiscussionService.getThread(req, req.params.threadId);
      
      res.json({
        success: true,
        data: thread
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/discussions/{threadId}:
 *   put:
 *     summary: Update a discussion thread
 *     description: Update a discussion thread (only by the creator)
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Discussion thread ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 maxLength: 200
 *               content:
 *                 type: string
 *                 maxLength: 5000
 *               isResolved:
 *                 type: boolean
 *               isPinned:
 *                 type: boolean
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                   maxLength: 50
 *     responses:
 *       200:
 *         description: Discussion thread updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Discussion thread not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:threadId",
  authMiddleware,
  validateRequest(updateThreadSchema),
  async (req, res, next) => {
    try {
      const thread = await DiscussionService.updateThread(
        req,
        req.params.threadId,
        req.body
      );
      
      res.json({
        success: true,
        data: thread
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/discussions/{threadId}:
 *   delete:
 *     summary: Delete a discussion thread
 *     description: Delete a discussion thread (only by the creator)
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Discussion thread ID
 *     responses:
 *       200:
 *         description: Discussion thread deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Discussion thread not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:threadId",
  authMiddleware,
  validateRequest(deleteThreadSchema),
  async (req, res, next) => {
    try {
      await DiscussionService.deleteThread(req, req.params.threadId);
      
      res.json({
        success: true,
        message: "Discussion thread deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/discussions/messages:
 *   post:
 *     summary: Add a message to a discussion thread
 *     description: Add a new message or reply to a discussion thread
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - threadId
 *               - content
 *             properties:
 *               threadId:
 *                 type: string
 *                 format: uuid
 *                 description: Discussion thread ID
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Message content
 *               parentId:
 *                 type: string
 *                 format: uuid
 *                 description: Parent message ID for replies
 *     responses:
 *       201:
 *         description: Message added successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Discussion thread not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/messages",
  authMiddleware,
  validateRequest(createMessageSchema),
  async (req, res, next) => {
    try {
      const message = await DiscussionService.addMessage(req, req.body);
      
      res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/discussions/messages/{messageId}:
 *   put:
 *     summary: Update a discussion message
 *     description: Update a discussion message (only by the author)
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 maxLength: 2000
 *                 description: Updated message content
 *     responses:
 *       200:
 *         description: Message updated successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/messages/:messageId",
  authMiddleware,
  validateRequest(updateMessageSchema),
  async (req, res, next) => {
    try {
      const message = await DiscussionService.updateMessage(
        req,
        req.params.messageId,
        req.body
      );
      
      res.json({
        success: true,
        data: message
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @swagger
 * /api/discussions/messages/{messageId}:
 *   delete:
 *     summary: Delete a discussion message
 *     description: Delete a discussion message (only by the author)
 *     tags: [Discussions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Message ID
 *     responses:
 *       200:
 *         description: Message deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Message not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/messages/:messageId",
  authMiddleware,
  validateRequest(deleteMessageSchema),
  async (req, res, next) => {
    try {
      await DiscussionService.deleteMessage(req, req.params.messageId);
      
      res.json({
        success: true,
        message: "Message deleted successfully"
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as discussionRoutes };
