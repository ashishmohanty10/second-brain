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
    const newPost = await prisma.posts.create({
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
      post: newPost,
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
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        link: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            tag: true,
          },
        },
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

export async function getPostById(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  try {
    const postsById = await prisma.posts.findFirst({
      where: {
        userId: req.user?.id,
        id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        image: true,
        link: true,
        createdAt: true,
        updatedAt: true,
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    res.status(200).json({
      data: postsById,
    });
  } catch (error) {
    console.log("-error while getting posts by id", error);
    next(createHttpError(500, "Internal server error"));
  }
}

export async function deletePost(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.body;

  try {
    const post = await prisma.posts.findUnique({
      where: {
        userId: req.user?.id,
        id,
      },
    });

    if (!post) return;

    await prisma.posts.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.log("--error while deleting a post", error);
    next(createHttpError(500, "Internal server error "));
  }
}

export async function updatePost(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;

  if (!id) {
    return next(createHttpError(400, "Post ID is required"));
  }

  const { title, link, tags, content, image } = req.body;

  try {
    const data = postSchema.safeParse({ title, link, tags, content, image });
    if (!data.success) {
      return next(createHttpError(400, "Invalid inputs"));
    }

    if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
      return next(createHttpError(400, "Tags must be an array of strings"));
    }

    const existingPost = await prisma.posts.findFirst({
      where: { id: id, userId: req.user?.id },
    });

    if (!existingPost) {
      return next(createHttpError(404, "Post not found"));
    }

    // Update the post
    const updatedPost = await prisma.posts.update({
      where: { id: id },
      data: {
        title,
        content,
        link,
        image,
        tags: {
          connectOrCreate: tags.map((tagName: string) => ({
            where: { tag: tagName },
            create: { tag: tagName },
          })),
        },
      },
    });

    res.status(200).json({ message: "Post updated successfully", updatedPost });
  } catch (error) {
    console.error("- Error while updating post:", error);
    next(createHttpError(500, "Internal Server error"));
  }
}
