import express, { Request, Response } from "express";
import { config } from "./config/config";
import { authRouter } from "./routes/v1/auth-route";
import { userRouter } from "./routes/v1/user-routes";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const PORT = config.port || 3000;

app.use(
  cors({
    origin: config.frontend_url,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/healthy", (req: Request, res: Response) => {
  res.json({
    message: "Healthy",
  });
});

app.use("/api/v1/user", authRouter);
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
