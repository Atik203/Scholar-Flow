"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use((0, auth_1.requireRole)(["ADMIN"]));
router.get("/users", async (req, res) => {
    res.status(501).json({
        error: "Admin endpoints not yet implemented",
        message: "This endpoint will return admin user management interface",
    });
});
router.get("/metrics", async (req, res) => {
    res.status(501).json({
        error: "Admin endpoints not yet implemented",
        message: "This endpoint will return system metrics and analytics",
    });
});
exports.default = router;
//# sourceMappingURL=admin.js.map