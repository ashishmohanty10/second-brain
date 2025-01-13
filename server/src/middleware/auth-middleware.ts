import { NextFunction, request, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import createHttpError from "http-errors";

export function authmiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next(createHttpError(400, "Authorization token is missing"));
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(
      token as unknown as string,
      config.jwt_secret as string
    ) as {
      userId: string;
    };

    if (!decodedToken.userId) {
      return next(createHttpError(400, "Invalid token: user ID missing"));
    }

    req.user = { id: decodedToken.userId };

    next();
  } catch (error) {
    console.log("-- authentication error", error);
    next(createHttpError(400, "Invalid or expired token"));
  }
}

export interface AuthRequest extends Request {
  user?: { id: string };
}
