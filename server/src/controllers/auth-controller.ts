import { NextFunction, Request, Response } from "express";
import { signupSchema } from "../zod/types";

import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../db/db";
import { config } from "../config/config";
import createHttpError from "http-errors";

export async function signupController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { name, password, email } = req.body;

  try {
    const data = signupSchema.safeParse({ name, email, password });

    if (!data.success) {
      return next(createHttpError(400, { message: "Invalid inputs" }));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return next(createHttpError(409, "User already exits"));
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const token = jwt.sign(
      { userId: newUser.id },
      config.jwt_secret as string,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      token: token,
      message: "User created successfully",
    });
  } catch (error) {
    console.log("--error while signup", error);
  }
}
