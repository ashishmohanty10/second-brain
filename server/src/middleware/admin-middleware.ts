import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

interface AdminRequest extends Request {
  user?: { id: string; role: string };
}

export function isAdminMiddleware(
  req: AdminRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return next(createHttpError(401, "User not authenticated"));
  }

  console.log(req.user);
  if (req.user.role !== "ADMIN") {
    return res.status(401).json({
      message: "Admin Only",
    });
  }

  next();
}
