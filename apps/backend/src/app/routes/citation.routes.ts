import { Router } from "express";
import { CitationExportService } from "../services/citationExport.service";
import { authMiddleware } from "../middleware/auth";
import { validateRequest } from "../middleware/validateRequest";
import { z } from "zod";

const router: Router = Router();

// Validation schemas
const exportCitationsSchema = z.object({
  body: z.object({
    paperIds: z.array(z.string().uuid()).optional(),
    collectionId: z.string().uuid().optional(),
    format: z.enum(['BIBTEX', 'ENDNOTE', 'APA', 'MLA', 'IEEE', 'CHICAGO', 'HARVARD']),
    includeAbstract: z.boolean().optional().default(false),
    includeKeywords: z.boolean().optional().default(false)
  }).refine(
    (data) => data.paperIds || data.collectionId,
    {
      message: "Either paperIds or collectionId must be provided"
    }
  )
});

const getExportHistorySchema = z.object({
  query: z.object({
    limit: z.string().transform(Number).optional().default("20"),
    offset: z.string().transform(Number).optional().default("0")
  })
});

/**
 * @swagger
 * /api/citations/export:
 *   post:
 *     summary: Export citations in various formats
 *     description: Export citations for papers or collections in BibTeX, EndNote, APA, MLA, IEEE, Chicago, or Harvard format
 *     tags: [Citations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - format
 *             properties:
 *               paperIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of paper IDs to export
 *               collectionId:
 *                 type: string
 *                 format: uuid
 *                 description: Collection ID to export papers from
 *               format:
 *                 type: string
 *                 enum: [BIBTEX, ENDNOTE, APA, MLA, IEEE, CHICAGO, HARVARD]
 *                 description: Citation format
 *               includeAbstract:
 *                 type: boolean
 *                 default: false
 *                 description: Include abstract in citation
 *               includeKeywords:
 *                 type: boolean
 *                 default: false
 *                 description: Include keywords in citation
 *     responses:
 *       200:
 *         description: Citations exported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     content:
 *                       type: string
 *                       description: Formatted citation content
 *                     format:
 *                       type: string
 *                       description: Citation format used
 *                     count:
 *                       type: number
 *                       description: Number of papers exported
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Papers or collection not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/export",
  authMiddleware,
  validateRequest(exportCitationsSchema),
  async (req, res, next) => {
    try {
      const result = await CitationExportService.exportCitations(req, req.body);
      
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
 * /api/citations/history:
 *   get:
 *     summary: Get citation export history
 *     description: Retrieve the user's citation export history
 *     tags: [Citations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of exports to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of exports to skip
 *     responses:
 *       200:
 *         description: Export history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     exports:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           format:
 *                             type: string
 *                           exportedAt:
 *                             type: string
 *                             format: date-time
 *                           paper:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               title:
 *                                 type: string
 *                           collection:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.get(
  "/history",
  authMiddleware,
  validateRequest(getExportHistorySchema),
  async (req, res, next) => {
    try {
      const result = await CitationExportService.getExportHistory(
        req,
        Number(req.query.limit),
        Number(req.query.offset)
      );
      
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as citationRoutes };
