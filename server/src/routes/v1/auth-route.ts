import { Router } from "express";
import {
  signinController,
  signoutController,
  signupController,
} from "../../controllers/auth-controller";

export const authRouter = Router();

authRouter.post("/signup", signupController);
authRouter.post("/signin", signinController);
authRouter.post("/logout", signoutController);
