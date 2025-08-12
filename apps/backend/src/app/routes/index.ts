import express from "express";
import { userRoutes } from "../modules/User/user.routes";

const router: import("express").Router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    route: userRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
