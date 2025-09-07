import { z } from "zod";

// Author Schema
export const authorSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(100, "Tên không được quá 100 ký tự"),
  biography: z
    .string()
    .optional(),
  nationality: z
    .string()
    .min(1, "Quốc tịch là bắt buộc")
    .max(50, "Quốc tịch không được quá 50 ký tự"),
  birth_date: z
    .string()
    .min(1, "Ngày sinh là bắt buộc")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày sinh phải có định dạng YYYY-MM-DD"),
  photo: z
    .any()
    .optional(),
});

export type AuthorRequest = z.infer<typeof authorSchema>;