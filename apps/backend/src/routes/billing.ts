import express, { Router } from "express";
import { AuthRequest } from "../middleware/auth";

const router: Router = express.Router();

// GET /subscriptions
router.get("/subscriptions", async (req: AuthRequest, res) => {
  res.status(501).json({
    error: "Billing not yet implemented",
    message: "This endpoint will return user subscriptions",
  });
});

// POST /subscriptions/checkout
router.post("/subscriptions/checkout", async (req: AuthRequest, res) => {
  res.status(501).json({
    error: "Billing not yet implemented",
    message: "This endpoint will create Stripe/SSLCommerz checkout sessions",
  });
});

// POST /webhooks/stripe
router.post(
  "/stripe",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    res.status(501).json({
      error: "Webhooks not yet implemented",
      message: "This endpoint will handle Stripe webhooks",
    });
  }
);

// POST /webhooks/sslcommerz
router.post("/sslcommerz", async (req, res) => {
  res.status(501).json({
    error: "Webhooks not yet implemented",
    message: "This endpoint will handle SSLCommerz webhooks",
  });
});

export default router;
