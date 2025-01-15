import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../../controllers/user-controller";
import { authMiddleware } from "../../middleware/auth-middleware";

export const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.post("/post", createPost);
userRouter.get("/post", getAllPosts);

userRouter.get("/post/:id", getPostById);
userRouter.delete("/post", deletePost);
userRouter.put("/post/:id", updatePost);
