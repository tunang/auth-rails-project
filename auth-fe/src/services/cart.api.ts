import type { ListResponse, SingleResponse } from "@/types";
import { api } from "./api.service";
import type { CartItem, UpdateCartRequest } from "@/types/cart.type";

export const cartApi = {
  user: {
    getCartItems: async (): Promise<ListResponse<CartItem>> => {
      const response = await api.get("/user/cart");
      return response.data;
    },
    addToCart: async (data: UpdateCartRequest): Promise<SingleResponse<null>> => {
      const response = await api.post("/user/cart/add", data);
      return response.data;
    },
    updateCartItem: async (data: UpdateCartRequest): Promise<SingleResponse<null>> => {
      const response = await api.patch("/user/cart/update", data);
      return response.data;
    },
    removeFromCart: async (bookId: number): Promise<SingleResponse<null>> => {
      const response = await api.delete(`user/cart/remove/${bookId}`);
      return response.data;
    },
    clearCart: async (): Promise<SingleResponse<null>> => {
      const response = await api.delete("/user/cart/clear");
      return response.data;
    },
  },
};