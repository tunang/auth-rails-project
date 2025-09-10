import type { ListResponse, SingleResponse } from "@/types";
import { api } from "./api.service";
import type { Address, CreateAddressRequest } from "@/types/address.type";

export const addressApi = {
  user: {
    getAddresses: async (): Promise<ListResponse<Address>> => {
      const response = await api.get("/user/addresses");
      return response.data;
    },
    createAddress: async (data: CreateAddressRequest): Promise<SingleResponse<Address>> => {
      const response = await api.post("/user/addresses", data);
      return response.data;
    },
    updateAddress: async (id: number, data: CreateAddressRequest): Promise<SingleResponse<Address>> => {
      const response = await api.put(`/user/addresses/${id}`, data);
      return response.data;
    },
    deleteAddress: async (id: number): Promise<SingleResponse<null>> => {
      const response = await api.delete(`/user/addresses/${id}`);
      return response.data;
    },
  },
};