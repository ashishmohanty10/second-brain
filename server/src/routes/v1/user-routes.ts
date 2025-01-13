import { Router } from "express";
import { createPost } from "../../controllers/user-controller";
import { authmiddleware } from "../../middleware/auth-middleware";

export const userRouter = Router();

userRouter.use(authmiddleware);
userRouter.post("/post", createPost);
