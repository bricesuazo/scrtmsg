import { z } from "zod";
export const signInSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters long.",
    })
    .max(50, {
      message: "Username must be at most 50 characters long.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .max(100, {
      message: "Password must be at most 100 characters long.",
    }),
});
export const signUpSchema = z.object({
  email: z.string().email({
    message: "Invalid email.",
  }),
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters long.",
    })
    .max(50, {
      message: "Username must be at most 50 characters long.",
    }),
  password: z
    .string()
    .min(8, {
      message: "Password must be at least 8 characters long.",
    })
    .max(100, {
      message: "Password must be at most 100 characters long.",
    }),
});
