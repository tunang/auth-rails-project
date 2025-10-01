import type { ListResponse, PaginationParams } from "@/types";
import { api } from "./api.service";
import type { User } from "@/types/user.type";
import { defaultParams } from "@/constants/pagination";

export const userApi = {
  admin: {
    getUsers: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<User>> => {
      const response = await api.get("/admin/users", {
        params,
      });
      return response.data;
    },
  },
};
