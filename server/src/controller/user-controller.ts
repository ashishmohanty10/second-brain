import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/db";

export async function postContent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { link, type, tags } = req.body;

  if (!link || !tags || !type) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const postData = await prisma.content.create({
      data: {
        link,
        tags: {
          create: tags.map((tag: string) => ({ name: tag })),
        },
        type,
      },
    });

    res.status(201).json({
      status: "success",
      message: "Link added successfully!!",
      data: postData.id,
    });
  } catch (error) {
    console.log("error", error);
    return next(createHttpError(500, "Internal server error"));
  }
}
