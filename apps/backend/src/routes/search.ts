import express, { Router } from "express";
import { AuthRequest } from "../middleware/auth";

const router: Router = express.Router();

// POST /search/semantic
router.post("/semantic", async (req: AuthRequest, res) => {
  res.status(501).json({
    error: "Semantic search not yet implemented",
    message:
      "This endpoint will perform vector similarity search using pgvector",
  });
});

export default router;
