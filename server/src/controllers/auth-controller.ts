import { CookieOptions, NextFunction, Request, Response } from "express";
import { signinSchema, signupSchema } from "../zod/types";

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

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return next(createHttpError(409, "User already exists"));
    }

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const access_token = jwt.sign(
      { userId: newUser.id },
      config.jwt_secret as string,
      { expiresIn: "168h" }
    );

    const refresh_token = jwt.sign(
      { userId: newUser.id },
      config.jwt_secret as string,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      sameSite: "strict",
      secure: config.node_env === "development",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "strict",
      secure: config.node_env === "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      access_token: access_token,
      refresh_token: refresh_token,
      message: "User created successfully",
    });
  } catch (error) {
    console.error("--error while signup", error);
    next(createHttpError(500, "Internal Server Error"));
  }
}

const cookieSettings: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: config.node_env === "development",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function signinController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  try {
    const data = signinSchema.safeParse({ email, password });
    if (!data.success) {
      return next(createHttpError(400, "Invalid inputs"));
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(createHttpError(400, "No user found"));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return next(createHttpError(400, "Invalid credentials"));
    }

    const access_token = jwt.sign(
      { userId: user.id },
      config.jwt_secret as string,
      { expiresIn: "168h" }
    );

    const refresh_token = jwt.sign(
      { userId: user.id },
      config.jwt_secret as string,
      { expiresIn: "1h" }
    );

    res.cookie("access_token", access_token, {
      httpOnly: true,
      sameSite: "strict",
      secure: config.node_env === "development",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      sameSite: "strict",
      secure: config.node_env === "development",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      access_token: access_token,
      refresh_token: refresh_token,
      message: "User logged in successfully",
    });
  } catch (error) {
    console.log("--error while signin", error);
    next(createHttpError(500, "Internal Server Error"));
  }
}

export async function signoutController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: config.node_env !== "development",
      path: "/",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: "strict",
      secure: config.node_env !== "development",
      path: "/",
    });

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
}

export async function verifyAuth(req: Request, res: Response) {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      res.status(401).json({ isAuthenticated: false });
    }

    jwt.verify(token, config.jwt_secret as string);
    res.status(200).json({ isAuthenticated: true });
  } catch (error) {
    res.status(401).json({ isAuthenticated: false });
  }
}
