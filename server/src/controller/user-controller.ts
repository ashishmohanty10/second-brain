import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/db";
import bcrypt from "bcryptjs";
import { config } from "../config/config";
import jwt from "jsonwebtoken";

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, firstname, lastname, password } = req.body;

  if (!email || !firstname || !lastname || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return next(createHttpError(400, "User already registered"));
    } else {
      const hasdedPasswrod = await bcrypt.hash(password, 10);
      try {
        const newUser = await prisma.user.create({
          data: {
            email,
            firstname,
            lastname,
            password: hasdedPasswrod,
          },
        });

        const token = jwt.sign(
          {
            sub: newUser.id,
          },
          config.jwtSecret as string,
          { expiresIn: "7d" }
        );

        res.status(201).json({
          message: "User created successfully",
          accessToken: token,
        });
      } catch (error) {
        console.log("error", error);
        return next(createHttpError(500, "Could not create new user"));
      }
    }
  } catch (error) {
    console.log("error", error);
    return next(createHttpError(500, "Internal serve error"));
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return next(createHttpError(400, "User not found"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(createHttpError(400, "Username or password incorrect"));
    }

    const token = jwt.sign(
      {
        sub: user.id,
      },
      config.jwtSecret as string,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      accessToken: token,
    });
  } catch (error) {
    console.log("error", error);
    return next(createHttpError(500, "Internal server error"));
  }
};
