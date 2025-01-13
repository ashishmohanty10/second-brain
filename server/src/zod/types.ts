import { z } from "zod";

export const signupSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Min length is 1",
    })
    .email({ message: "Invalid Email address" }),

  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name cannot exceed 32 characters" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Password cannot exceed 32 characters" }),
});

export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(32, { message: "Password cannot exceed 32 characters" }),
});

export type signupSchemaType = z.infer<typeof signupSchema>;
export type signinSchemaType = z.infer<typeof signinSchema>;
