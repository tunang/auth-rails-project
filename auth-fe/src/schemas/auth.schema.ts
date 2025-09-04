import { z } from "zod";

// Login Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Định dạng email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginRequest = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Định dạng email không hợp lệ"),
  name: z
    .string()
    .min(1, "Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số"),
  password_confirmation: z
    .string()
    .min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["password_confirmation"],
});

export type RegisterRequest = z.infer<typeof registerSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Định dạng email không hợp lệ"),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema (for API request)
export const resetPasswordSchema = z.object({
  reset_password_token: z
    .string(),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số"),
  confirmation_password: z
    .string()
    .min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmation_password, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmation_password"],
});

// Reset Password Form Schema (for form validation only - without token)
export const resetPasswordFormSchema = z.object({
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .regex(/[0-9]/, "Mật khẩu phải có ít nhất 1 số"),
  confirmation_password: z
    .string()
    .min(1, "Xác nhận mật khẩu là bắt buộc"),
}).refine((data) => data.password === data.confirmation_password, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmation_password"],
});

export type ResetPasswordRequest = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordFormSchema>;

// Confirm Email Schema (for URL params)
export const confirmEmailSchema = z.object({
  token: z
    .string()
    .min(1, "Token xác thực là bắt buộc"),
  email: z
    .string()
    .email("Định dạng email không hợp lệ")
    .optional(),
});

export type ConfirmEmailRequest = z.infer<typeof confirmEmailSchema>;