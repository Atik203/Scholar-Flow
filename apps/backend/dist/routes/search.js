"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/semantic", async (req, res) => {
    res.status(501).json({
        error: "Semantic search not yet implemented",
        message: "This endpoint will perform vector similarity search using pgvector",
    });
});
exports.default = router;
//# sourceMappingURL=search.js.map