import { z } from "zod";
import { OrderStatus } from "@/types/order.type";

export const updateOrderStatusSchema = z.object({
  status: z.number().refine(
    (val) => Object.values(OrderStatus).includes(val as any),
    {
      message: "Trạng thái đơn hàng không hợp lệ",
    }
  ),
});

export type UpdateOrderStatusRequest = z.infer<typeof updateOrderStatusSchema>;