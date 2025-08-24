"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/subscriptions", async (req, res) => {
    res.status(501).json({
        error: "Billing not yet implemented",
        message: "This endpoint will return user subscriptions",
    });
});
router.post("/subscriptions/checkout", async (req, res) => {
    res.status(501).json({
        error: "Billing not yet implemented",
        message: "This endpoint will create Stripe/SSLCommerz checkout sessions",
    });
});
router.post("/stripe", express_1.default.raw({ type: "application/json" }), async (req, res) => {
    res.status(501).json({
        error: "Webhooks not yet implemented",
        message: "This endpoint will handle Stripe webhooks",
    });
});
router.post("/sslcommerz", async (req, res) => {
    res.status(501).json({
        error: "Webhooks not yet implemented",
        message: "This endpoint will handle SSLCommerz webhooks",
    });
});
exports.default = router;
//# sourceMappingURL=billing.js.map