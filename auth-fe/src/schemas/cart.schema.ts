import { z } from "zod";

export const updateCartSchema = z.object({
  book_id: z.number({
    message: "ID sách phải là số",
  }).positive("ID sách phải là số dương"),
  quantity: z.number({
    message: "Số lượng phải là số",
  }).min(1, "Số lượng phải ít nhất là 1").max(99, "Số lượng không được quá 99"),
});

export const removeFromCartSchema = z.object({
  book_id: z.number({
    message: "ID sách phải là số",
  }).positive("ID sách phải là số dương"),
});

export type UpdateCartRequest = z.infer<typeof updateCartSchema>;
export type RemoveFromCartRequest = z.infer<typeof removeFromCartSchema>;