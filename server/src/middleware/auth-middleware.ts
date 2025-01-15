import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import createHttpError from "http-errors";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  user?: { id: string };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      return next(createHttpError(401, "Authorization token is missing"));
    }

    const decodedToken = jwt.verify(token, config.jwt_secret as string) as {
      userId: string;
    };

    if (!decodedToken.userId) {
      return next(createHttpError(401, "Invalid token: user ID missing"));
    }

    req.user = { id: decodedToken.userId };
    next();
  } catch (error) {
    console.error("-- authentication error", error);
    next(createHttpError(401, "Invalid or expired token"));
  }
}
