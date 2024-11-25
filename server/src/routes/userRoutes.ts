import express from "express";
import { loginUser, registerUser } from "../controller/auth-controller";
import { postContent } from "../controller/user-controller";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

userRouter.post("/content", postContent);

export default userRouter;
