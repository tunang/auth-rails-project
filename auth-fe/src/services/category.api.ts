import type { ListResponse, PaginationParams, SingleResponse } from "@/types";
import { api } from "./api.service";
import type { Category } from "@/types/category.type";
import { defaultParams } from "@/constants/pagination";



export const categoryApi = {
  admin: {
    getCategories: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Category>> => {
      const response = await api.get("/admin/categories", {
        params,
      });
      return response.data;
    },
    createCategory: async (data: Category): Promise<SingleResponse<Category>> => {
      const response = await api.post("/admin/categories", data);
      return response.data;
    },
    updateCategory: async (id: number, data: Category): Promise<SingleResponse<Category>> => {
      const response = await api.put(`/admin/categories/${id}`, data);
      return response.data;
    },
    deleteCategory: async (id: number): Promise<SingleResponse<null>> => {
      const response = await api.delete(`/admin/categories/${id}`);
      return response.data;
    },
  },
};
