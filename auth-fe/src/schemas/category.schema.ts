import { z } from "zod";

// Category Schema
export const categorySchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, "Tên là bắt buộc")
    .min(2, "Tên phải có ít nhất 2 ký tự")
    .max(50, "Tên không được quá 50 ký tự"),
  description: z
    .string()
    .optional(),
  parent_id: z.number().optional(),
});

export type CategoryRequest = z.infer<typeof categorySchema>;