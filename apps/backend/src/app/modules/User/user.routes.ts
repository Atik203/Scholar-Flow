import express from "express";
import { userController } from "./user.controller";

const router: import("express").Router = express.Router();

router.get("/", userController.getAllFromDB);

router.get("/me", userController.getMyProfile);

router.post("/change-password", userController.changePassword);

export const userRoutes = router;
