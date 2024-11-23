import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface AuthRequest extends Request {
  user?: { id: string; role: "ADMIN" | "USER" };
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(
      createHttpError(401, "Authorization header is missing or invalid")
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, config.jwtSecret as string) as {
      userId: string;
      role: "ADMIN" | "USER";
    };

    if (!decodedToken.userId) {
      throw createHttpError(401, "Invalid token payload");
    }

    req.user = { id: decodedToken.userId, role: decodedToken.role };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(createHttpError(401, "Invalid or expired token"));
    }

    return next(createHttpError(500, "Internal server error"));
  }
}
