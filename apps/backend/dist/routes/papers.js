"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const paperFilterSchema = zod_1.z.object({
    page: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 1)),
    limit: zod_1.z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val) : 20)),
    search: zod_1.z.string().optional(),
    workspaceId: zod_1.z.string().optional(),
    semantic: zod_1.z
        .string()
        .optional()
        .transform((val) => val === "true"),
});
router.get("/", async (req, res) => {
    try {
        const { page, limit, search, workspaceId, semantic } = paperFilterSchema.parse(req.query);
        const offset = (page - 1) * limit;
        const where = {
            isDeleted: false,
        };
        if (workspaceId) {
            where.workspaceId = workspaceId;
        }
        if (search && !semantic) {
            where.OR = [
                { title: { contains: search, mode: "insensitive" } },
                { abstract: { contains: search, mode: "insensitive" } },
            ];
        }
        if (semantic && search) {
            res.json({
                papers: [],
                total: 0,
                page,
                totalPages: 0,
                message: "Semantic search not yet implemented",
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
                        select: {
                            id: true,
                            contentType: true,
                            sizeBytes: true,
                            pageCount: true,
                        },
                    },
                    _count: {
                        select: { annotations: true, collectionJoins: true },
                    },
                },
                orderBy: { createdAt: "desc" },
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
    }
    catch (error) {
        console.error("Error fetching papers:", error);
        res.status(500).json({ error: "Failed to fetch papers" });
    }
});
router.get("/:id", async (req, res) => {
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
                    select: {
                        id: true,
                        idx: true,
                        page: true,
                        content: true,
                        tokenCount: true,
                    },
                    orderBy: { idx: "asc" },
                },
                annotations: {
                    where: { isDeleted: false },
                    include: {
                        user: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                    orderBy: { createdAt: "desc" },
                },
                aiSummaries: {
                    orderBy: { createdAt: "desc" },
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
            res.status(404).json({ error: "Paper not found" });
            return;
        }
        res.json(paper);
    }
    catch (error) {
        console.error("Error fetching paper:", error);
        res.status(500).json({ error: "Failed to fetch paper" });
    }
});
router.post("/upload-url", async (req, res) => {
    try {
        res.status(501).json({
            error: "Upload URL generation not yet implemented",
            message: "This endpoint will generate S3 pre-signed URLs for file uploads",
        });
    }
    catch (error) {
        console.error("Error generating upload URL:", error);
        res.status(500).json({ error: "Failed to generate upload URL" });
    }
});
router.post("/import", async (req, res) => {
    try {
        res.status(501).json({
            error: "Paper import not yet implemented",
            message: "This endpoint will import papers from DOI, arXiv, OpenAlex, etc.",
        });
    }
    catch (error) {
        console.error("Error importing paper:", error);
        res.status(500).json({ error: "Failed to import paper" });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const paper = await prisma.paper.findUnique({
            where: { id, isDeleted: false },
            select: { uploaderId: true, workspaceId: true },
        });
        if (!paper) {
            res.status(404).json({ error: "Paper not found" });
            return;
        }
        if (paper.uploaderId !== userId) {
            res.status(403).json({ error: "Not authorized to delete this paper" });
            return;
        }
        await prisma.paper.update({
            where: { id },
            data: { isDeleted: true },
        });
        res.json({ message: "Paper deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting paper:", error);
        res.status(500).json({ error: "Failed to delete paper" });
    }
});
exports.default = router;
//# sourceMappingURL=papers.js.map