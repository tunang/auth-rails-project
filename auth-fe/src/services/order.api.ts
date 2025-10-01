import type { ListResponse, PaginationParams, SingleResponse } from "@/types";
import { api } from "./api.service";
import type { Order, UpdateOrderStatusRequest, CreateOrderRequest, CreateOrderResponse } from "@/types/order.type";
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
  
  user: {
    createOrder: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
      const response = await api.post("/user/orders", data);
      return response.data;
    },
    getOrders: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Order>> => {
      const response = await api.get("/user/orders", {
        params,
      });
      return response.data;
    },
    getOrderDetail: async (id: number): Promise<SingleResponse<Order>> => {
      const response = await api.get(`/user/orders/${id}`);
      return response.data;
    },
    payOrder: async (stripeSessionId: string): Promise<{ status: { code: number; message: string }; data: { order: Order; payment_url: string } }> => {
      const response = await api.post(`/user/orders/pay`, { stripe_session_id: stripeSessionId });
      return response.data;
    },
  },
};