import express, { Request, Response } from "express";
import * as UserController from "../controllers/userController";
import { createRateLimiter } from "../middlewares/auth";
const router = express.Router();

const rateLimiter = createRateLimiter(5, 2);

// router
router.post("/create", UserController.createUser);
router.post("/login", [rateLimiter], UserController.login);
export default router;
