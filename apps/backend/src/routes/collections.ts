import express, { Router } from "express";
import { AuthRequest } from "../middleware/auth";

const router: Router = express.Router();

// GET /collections
router.get("/", async (req: AuthRequest, res) => {
  res.status(501).json({
    error: "Collections not yet implemented",
    message: "This endpoint will return user collections",
  });
});

// POST /collections
router.post("/", async (req: AuthRequest, res) => {
  res.status(501).json({
    error: "Collections not yet implemented",
    message: "This endpoint will create new collections",
  });
});

export default router;
