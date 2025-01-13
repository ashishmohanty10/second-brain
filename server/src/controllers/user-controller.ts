import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { postSchema } from "../zod/types";
import { prisma } from "../db/db";
import { AuthRequest } from "../middleware/auth-middleware";

export async function createPost(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { title, link, content, tags, image } = req.body;

  try {
    const data = postSchema.safeParse({ title, link, content, tags, image });
    if (!data.success) {
      return next(createHttpError(400, "Invalid inputs"));
    }

    if (link) {
      const existingPost = await prisma.posts.findUnique({
        where: {
          link,
          userId: req.user?.id,
        },
      });

      if (existingPost)
        return next(createHttpError(400, "Post already exists"));
    }
    await prisma.posts.create({
      data: {
        title,
        content,
        image,
        userId: req.user?.id as string,
        tags: {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { tag: tagName },
            create: { tag: tagName },
          })),
        },
      },
    });

    res.status(201).json({
      message: "Post created successfully",
    });
  } catch (error) {
    console.log("--error while creating post", error);
    next(createHttpError(500, "Internal server error"));
  }
}

export async function getAllPosts(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const postData = await prisma.posts.findMany({
      where: {
        userId: req.user?.id,
      },
    });

    res.status(200).json({
      data: postData,
    });
  } catch (error) {
    console.log("error while getting all posts");
    next(createHttpError(500, "Internal server error"));
  }
}
