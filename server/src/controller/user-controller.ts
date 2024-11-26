import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/db";

interface NewRequest extends Request {
  user?: { id: string; role: "ADMIN" | "USER" };
}

export async function postContent(
  req: NewRequest,
  res: Response,
  next: NextFunction
) {
  const { name, link, type, tags } = req.body;

  try {
    const postData = await prisma.content.create({
      data: {
        name,
        type,
        userId: req.user!.id,
        link,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      },
    });

    res.status(201).json({
      status: "success",
      message: "Link added successfully!!",
      post: postData,
    });
  } catch (error) {
    console.log("error", error);
    return next(createHttpError(500, "Internal server error"));
  }
}

export async function getContent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const allData = await prisma.content.findMany({});
    res.status(200).json({
      allData,
    });
  } catch (error) {
    console.log("Error", error);
    return next(createHttpError(500, "Internal server error"));
  }
}
