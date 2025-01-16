import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getAllPostsByUsers,
  getPostById,
  getUserInfo,
  updatePost,
  updateUserInfo,
} from "../../controllers/user-controller";
import { authMiddleware } from "../../middleware/auth-middleware";

export const userRouter = Router();

userRouter.use(authMiddleware);
userRouter.get("/publicPosts", getAllPostsByUsers);
userRouter.post("/post", createPost);
userRouter.get("/post", getAllPosts);

userRouter.get("/post/:id", getPostById);
userRouter.delete("/post", deletePost);
userRouter.put("/post/:id", updatePost);

userRouter.get("/info", getUserInfo);
userRouter.put("/updateInfo", updateUserInfo);
