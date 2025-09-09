import type { ListResponse, PaginationParams, SingleResponse } from "@/types";
import { api } from "./api.service";
import type { Order, UpdateOrderStatusRequest } from "@/types/order.type";
import { defaultParams } from "@/constants/pagination";

export const orderApi = {
  admin: {
    getOrders: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Order>> => {
      const response = await api.get("/admin/orders/get_all", {
        params,
      });
      return response.data;
    },
    getOrderDetail: async (id: number): Promise<SingleResponse<Order>> => {
      const response = await api.get(`/admin/orders/${id}`);
      return response.data;
    },
    updateOrderStatus: async (
      id: number, 
      data: UpdateOrderStatusRequest
    ): Promise<SingleResponse<Order>> => {
      const response = await api.patch(`/admin/orders/${id}`, data);
      return response.data;
    },
  },
};