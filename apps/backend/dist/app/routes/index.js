"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/User/user.routes");
const auth_1 = __importDefault(require("../../routes/auth"));
const router = express_1.default.Router();
router.use("/user", user_routes_1.userRoutes);
router.use("/auth", auth_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map