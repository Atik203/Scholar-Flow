"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get("/:paperId/annotations", async (req, res) => {
    res.status(501).json({
        error: "Annotations not yet implemented",
        message: "This endpoint will return annotations for a paper",
    });
});
router.post("/:paperId/annotations", async (req, res) => {
    res.status(501).json({
        error: "Annotations not yet implemented",
        message: "This endpoint will create new annotations",
    });
});
exports.default = router;
//# sourceMappingURL=annotations.js.map