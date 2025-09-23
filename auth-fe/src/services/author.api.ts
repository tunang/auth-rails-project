import type { ListResponse, PaginationParams, SingleResponse } from "@/types";
import { api } from "./api.service";
import type { Author } from "@/types/author.type";
import { defaultParams } from "@/constants/pagination";

export const authorApi = {
  admin: {
    getAuthors: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Author>> => {
      const response = await api.get("/admin/authors", {
        params,
      });
      return response.data;
    },
    createAuthor: async (data: FormData): Promise<SingleResponse<Author>> => {
      const response = await api.post("/admin/authors", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    updateAuthor: async (id: number, data: FormData): Promise<SingleResponse<Author>> => {
      const response = await api.put(`/admin/authors/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    deleteAuthor: async (id: number): Promise<SingleResponse<null>> => {
      const response = await api.delete(`/admin/authors/${id}`);
      return response.data;
    },
    getDeletedAuthors: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Author>> => {
      const response = await api.get("/admin/authors/deleted/list", {
        params,
      });
      return response.data;
    },
    restoreAuthor: async (id: number): Promise<SingleResponse<Author>> => {
      const response = await api.post(`/admin/authors/${id}/restore`);
      return response.data;
    },
  },
};