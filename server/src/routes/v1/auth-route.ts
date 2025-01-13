import { Router } from "express";
import {
  signinController,
  signupController,
} from "../../controllers/auth-controller";

export const user = Router();

user.post("/signup", signupController);
user.post("/signin", signinController);
