import { Router } from "express";
import type express from "express";
import { authMiddleware } from "../../middleware/auth";
import { aiContextService } from "./aiContext.service";
import { z } from "zod";
import ApiError from "../../errors/ApiError";

const router: express.Router = Router();

const resolveContextSchema = z.object({
  type: z.enum(["paper", "workspace", "dashboard"]),
  id: z.string().optional(),
});

router.post("/resolve", authMiddleware, async (req, res, next) => {
  try {
    const parsed = resolveContextSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, "Invalid context request");
    }

    const { type, id } = parsed.data;
    const userId = (req as any).user?.id;

    if (type !== "dashboard" && !id) {
      throw new ApiError(400, "id is required for paper and workspace context");
    }

    const context = await aiContextService.resolve({
      type: type as "paper" | "workspace" | "dashboard",
      id: id!,
      userId,
    });

    res.json({ success: true, data: context });
  } catch (err) {
    next(err);
  }
});

export const aiContextRoutes = router;
