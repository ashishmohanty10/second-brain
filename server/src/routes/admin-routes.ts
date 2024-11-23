import express from "express";
import { authMiddleware } from "../middleware/auth-middkeware";

export const adminRouter = express.Router();

adminRouter.post("/tags", authMiddleware);
