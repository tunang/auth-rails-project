import type { ListResponse, PaginationParams, SingleResponse } from "@/types";
import { api } from "./api.service";
import type { Book } from "@/types/book.type";
import { defaultParams } from "@/constants/pagination";

export const bookApi = {
  admin: {
    getBooks: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Book>> => {
      const response = await api.get("/admin/books", {
        params,
      });
      return response.data;
    },
    createBook: async (data: FormData): Promise<SingleResponse<Book>> => {
      const response = await api.post("/admin/books", data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    updateBook: async (id: number, data: FormData): Promise<SingleResponse<Book>> => {
      const response = await api.put(`/admin/books/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    },
    deleteBook: async (id: number): Promise<SingleResponse<null>> => {
      const response = await api.delete(`/admin/books/${id}`);
      return response.data;
    },
    getDeletedBooks: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Book>> => {
      const response = await api.get("/admin/books/deleted/list", {
        params,
      });
      return response.data;
    },
    restoreBook: async (id: number): Promise<SingleResponse<Book>> => {
      const response = await api.post(`/admin/books/${id}/restore`);
      return response.data;
    },
  },

  user: {
    getBooks: async (
      params: PaginationParams = defaultParams
    ): Promise<ListResponse<Book>> => {
      const response = await api.get("/user/books", {
        params,
      });
      return response.data;
    },
    getBooksByCategory: async (categoryId: number | string, params: PaginationParams = defaultParams): Promise<ListResponse<Book>> => {
      const response = await api.get(`/user/categories/${categoryId}/products`, { params });
      return response.data;
    },
    getBookDetail: async (id: number | string): Promise<SingleResponse<Book>> => {
      const response = await api.get(`user/books/${id}`);
      return response.data;
    },
  },
};