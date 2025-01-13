import express, { Request, Response } from "express";
import { config } from "./config/config";
import { authRoute } from "./routes/v1/auth-route";

const app = express();
const PORT = config.port || 3000;
app.use(express.json());

app.get("/healthy", (req: Request, res: Response) => {
  res.json({
    message: "Healthy",
  });
});

app.use("/api/v1/user", authRoute);

app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
