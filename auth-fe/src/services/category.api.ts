import type { ApiResponse } from "@/types";
import { api } from "./api.service";
import type { Category } from "@/types/category.type";

export const categoryApi = {
  admin: {
    getCategories: async (): Promise<ApiResponse<Category[]>> => {
      const response = await api.get("/admin/categories");
      return response.data;
    },
  },
};
