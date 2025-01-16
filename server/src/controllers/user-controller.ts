import { NextFunction, Response } from "express";
import createHttpError from "http-errors";
import { postSchema, updateProfile } from "../zod/types";
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
  console.log(id);

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

export async function getAllPostsByUsers(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const posts = await prisma.posts.findMany({
      include: {
        User: {
          select: {
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    res.status(200).json({
      data: posts,
    });
  } catch (error) {
    console.error("Error fetching posts", error);
    next(error);
  }
}

export async function getUserInfo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
      select: {
        email: true,
        createdAt: true,
        image: true,
        name: true,
      },
    });

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    next(createHttpError(500, "Internal server error"));
    console.log("Internal server error", error);
  }
}

export async function updateUserInfo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const { name, email } = req.body;

  try {
    const parsedData = updateProfile.safeParse({ name, email });
    if (!parsedData.success) {
      res.status(400).json({
        message: "Invalid input data",
        errors: parsedData.error.errors,
      });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: req.user?.id,
      },
    });

    if (!user) {
      res.status(404).json({
        message: "No user found",
      });
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        name,
        email,
      },
      select: {
        name: true,
        email: true,
      },
    });

    res.status(200).json({
      message: "Data updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
}
