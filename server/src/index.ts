import express, { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const app = express();
app.use(express.json());

//healthy
app.get("/healthy", (req: Request, res: Response) => {
  res.json({
    message: "healthy",
  });
});

// app.use("/api/user");
