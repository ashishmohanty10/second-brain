import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/db";

interface NewRequest extends Request {
  user?: { userId: string; role: "ADMIN" | "USER" };
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
        userId: req.user!.userId,
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
  req: NewRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const allData = await prisma.content.findMany({
      where: {
        userId: req.user!.userId,
      },
    });
    res.status(200).json({
      allData,
    });
  } catch (error) {
    console.log("Error", error);
    return next(createHttpError(500, "Internal server error"));
  }
}

export async function updateContent(
  req: NewRequest,
  res: Response,
  next: NextFunction
) {
  const { name, link, tags, type, contentId } = req.body;

  try {
    const findContent = await prisma.content.findUnique({
      where: {
        id: contentId,
      },
    });

    if (!findContent) {
      return next(createHttpError(404, "No content found"));
    }

    const updatedData = await prisma.content.update({
      where: {
        id: contentId,
      },
      data: {
        name,
        type,
        userId: req.user!.userId,
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
      message: "Updated successsfully",
      id: updatedData.id,
    });
  } catch (error) {
    console.log("error", error);
    return next(createHttpError(500, "Internal server error"));
  }
}
