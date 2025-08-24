"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const sessionValidationSchema = zod_1.z.object({
    token: zod_1.z.string(),
});
router.post("/session/validate", async (req, res) => {
    try {
        const { token } = sessionValidationSchema.parse(req.body);
        const jwtSecret = process.env.NEXTAUTH_SECRET;
        if (!jwtSecret) {
            res.status(500).json({ error: "JWT secret not configured" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const user = await prisma.user.findUnique({
            where: { id: decoded.sub },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
                isDeleted: true,
            },
        });
        if (!user || user.isDeleted) {
            res.status(401).json({ error: "Invalid token or user not found" });
            return;
        }
        res.json({
            valid: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image,
            },
        });
    }
    catch (error) {
        console.error("Session validation error:", error);
        res.status(401).json({
            valid: false,
            error: "Invalid token",
        });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map