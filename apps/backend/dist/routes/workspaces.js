"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post("/", async (req, res) => {
    res.status(501).json({
        error: "Workspaces not yet implemented",
        message: "This endpoint will create new workspaces",
    });
});
router.get("/", async (req, res) => {
    res.status(501).json({
        error: "Workspaces not yet implemented",
        message: "This endpoint will return user workspaces",
    });
});
exports.default = router;
//# sourceMappingURL=workspaces.js.map