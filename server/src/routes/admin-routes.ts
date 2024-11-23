import express from "express";
import { authMiddleware } from "../middleware/auth-middkeware";
import { createTags } from "../controller/admin-controller";
import { isAdminMiddleware } from "../middleware/admin-middleware";

export const adminRouter = express.Router();
adminRouter.use(authMiddleware);

//@ts-ignore
adminRouter.use(isAdminMiddleware);

adminRouter.post("/admin/tags", createTags);
