import express, { Request, Response } from "express";
import * as UserController from "../controllers/userController";
const router = express.Router();

// router 
router.post('/create', UserController.createUser)

export default router;