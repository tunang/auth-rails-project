import { z } from "zod";

// Book Schema
export const bookSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, "Tiêu đề là bắt buộc")
    .min(2, "Tiêu đề phải có ít nhất 2 ký tự")
    .max(255, "Tiêu đề không được quá 255 ký tự"),
  description: z
    .string()
    .optional(),
  price: z
    .number()
    .min(0, "Giá phải lớn hơn hoặc bằng 0")
    .max(99999999, "Giá không được quá 99,999,999"),
  stock_quantity: z
    .number()
    .int("Số lượng tồn kho phải là số nguyên")
    .min(0, "Số lượng tồn kho phải lớn hơn hoặc bằng 0"),
  featured: z
    .boolean()
    .default(false),
  sold_count: z
    .number()
    .int("Số lượng đã bán phải là số nguyên")
    .min(0, "Số lượng đã bán phải lớn hơn hoặc bằng 0")
    .optional(),
  cost_price: z
    .number()
    .min(0, "Giá vốn phải lớn hơn hoặc bằng 0")
    .optional(),
  discount_percentage: z
    .number()
    .min(0, "Phần trăm giảm giá phải lớn hơn hoặc bằng 0")
    .max(100, "Phần trăm giảm giá không được quá 100")
    .optional(),
  cover_image: z
    .any()
    .optional(),
  sample_pages: z
    .array(z.any())
    .optional(),
  author_ids: z
    .array(z.number())
    .min(1, "Phải chọn ít nhất một tác giả"),
  category_ids: z
    .array(z.number())
    .min(1, "Phải chọn ít nhất một thể loại"),
});

export type BookRequest = z.infer<typeof bookSchema>;