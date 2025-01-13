import { Router } from "express";
import { signupController } from "../../controllers/auth-controller";

export const authRoute = Router();

authRoute.post("/signup", signupController);
