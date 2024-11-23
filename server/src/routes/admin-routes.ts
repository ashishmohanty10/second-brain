import express from "express";
import { authMiddleware } from "../middleware/auth-middkeware";
import { createTags } from "../controller/admin-controller";

export const adminRouter = express.Router();

adminRouter.post("/tags", createTags);
