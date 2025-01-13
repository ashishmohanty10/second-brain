import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  updatePost,
} from "../../controllers/user-controller";
import { authmiddleware } from "../../middleware/auth-middleware";

export const userRouter = Router();

userRouter.use(authmiddleware);
userRouter.post("/post", createPost);
userRouter.get("/post", getAllPosts);

userRouter.get("/post/:id", getPostById);
userRouter.delete("/post", deletePost);
userRouter.put("/post/:id", updatePost);
