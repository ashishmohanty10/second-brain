import express, { Request, Response } from "express";
import userRouter from "./routes/userRoutes";

export const app = express();
app.use(express.json());

//healthy
app.get("/healthy", (req: Request, res: Response) => {
  res.json({
    message: "healthy",
  });
});

app.use("/api/user", userRouter);
