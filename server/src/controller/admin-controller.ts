import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../db/db";

export async function createTags(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { tagName } = req.body;

  if (!tagName) {
    return next(createHttpError(400, "All fields are required"));
  }

  try {
    const newTag = await prisma.tag.create({
      data: {
        name: tagName,
      },
    });

    res.json({
      type: "success",
      message: "Tag created successfully",
      tags: newTag,
    });
  } catch (error) {
    console.log("--error", error);
    next(createHttpError(500, "Invalid server error"));
  }
}
