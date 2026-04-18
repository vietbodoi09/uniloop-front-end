import { z } from "zod";

export const EDU_VN_REGEX =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.edu\.vn$/;

export const isUniversityEmail = (email: string) =>
  EDU_VN_REGEX.test(email.trim().toLowerCase());

export const signupSchema = z
  .object({
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email")
      .refine(isUniversityEmail, {
        message: "Must be a Vietnamese university email (*.edu.vn)",
      }),
    password: z.string().min(8, "Password must be ≥ 8 characters"),
    confirm: z.string(),
    fullName: z.string().min(2, "Full name is required"),
  })
  .refine((d) => d.password === d.confirm, {
    path: ["confirm"],
    message: "Passwords do not match",
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email()
    .refine(isUniversityEmail, {
      message: "Only *.edu.vn accounts are allowed",
    }),
  password: z.string().min(1, "Password is required"),
});

export const magicLinkSchema = z.object({
  email: z
    .string()
    .email()
    .refine(isUniversityEmail, {
      message: "Only *.edu.vn accounts are allowed",
    }),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
