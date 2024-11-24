import express, { Request, Response } from "express";
import userRouter from "./routes/userRoutes";
import { adminRouter } from "./routes/admin-routes";
import { isAdminMiddleware } from "./middleware/admin-middleware";
import { authMiddleware } from "./middleware/auth-middkeware";

export const app = express();
app.use(express.json());

//healthy
app.get("/healthy", (req: Request, res: Response) => {
  res.json({
    message: "healthy",
  });
});

app.use("/api/v1/", userRouter);
app.use("/api/v1", adminRouter);
