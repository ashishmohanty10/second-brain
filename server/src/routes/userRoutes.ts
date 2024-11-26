import express from "express";
import { loginUser, registerUser } from "../controller/auth-controller";
import { getContent, postContent } from "../controller/user-controller";
import { authMiddleware } from "../middleware/auth-middkeware";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.use(authMiddleware);

userRouter.post("/content", postContent);
userRouter.get("/content", getContent);

export default userRouter;
