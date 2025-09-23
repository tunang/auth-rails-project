import type { AuthorRequest } from "@/schemas/author.schema";
import type { ListResponse, Pagination, SingleResponse, PaginationParams } from "@/types";
import type { Author } from "@/types/author.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthorState {
  authors: Author[];
  deletedAuthors: Author[];
  message: string | null;
  isLoading: boolean;
  isLoadingDeleted: boolean;
  pagination: Pagination;
  deletedPagination: Pagination;
  perPage: number;
}

const initialState: AuthorState = {
  authors: [],
  deletedAuthors: [],
  message: null,
  isLoading: false,
  isLoadingDeleted: false,
  pagination: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 0,
    total_count: 0,
  },
  deletedPagination: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 0,
    total_count: 0,
  },
  perPage: 10,
};

const authorSlice = createSlice({
  name: "author",
  initialState,
  reducers: {
    getAuthorsRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoading = true;
      state.message = null;
    },
    getAuthorsSuccess: (
      state,
      action: PayloadAction<ListResponse<Author>>
    ) => {
      state.isLoading = false;
      state.authors = action.payload.data;
      state.pagination = action.payload.pagination ?? state.pagination;
    },
    getAuthorsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    createAuthorRequest: (state, _action: PayloadAction<FormData>) => {
      state.isLoading = true;
      state.message = null;
    },
    createAuthorSuccess: (state, action: PayloadAction<SingleResponse<Author>>) => {
      console.log(action.payload);
      state.isLoading = false;
      state.authors.push(action.payload.data as Author);
      state.message = action.payload.status.message;
    },
    createAuthorFailure: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.isLoading = false;
      state.message = action.payload;
    },
    
    updateAuthorRequest: (state, _action: PayloadAction<{ id: number; data: FormData }>) => {
      state.isLoading = true;
      state.message = null;
    },
    updateAuthorSuccess: (state, action: PayloadAction<SingleResponse<Author>>) => {
      state.isLoading = false;
      state.authors = state.authors.map((author) =>
        author.id === action.payload.data?.id ? action.payload.data as Author : author
      );
      state.message = action.payload.status.message;
    },
    updateAuthorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    deleteAuthorRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    deleteAuthorSuccess: (state, action: PayloadAction<SingleResponse<Author>>) => {
      state.isLoading = false;
      state.authors = state.authors.filter(
        (author) => author.id !== action.payload.data?.id
      );
      state.message = action.payload.status.message;
    },
    deleteAuthorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    getDeletedAuthorsRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoadingDeleted = true;
      state.message = null;
    },
    getDeletedAuthorsSuccess: (
      state,
      action: PayloadAction<ListResponse<Author>>
    ) => {
      state.isLoadingDeleted = false;
      state.deletedAuthors = action.payload.data;
      state.deletedPagination = action.payload.pagination ?? state.deletedPagination;
    },
    getDeletedAuthorsFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingDeleted = false;
      state.message = action.payload;
    },

    restoreAuthorRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    restoreAuthorSuccess: (state, action: PayloadAction<SingleResponse<Author>>) => {
      state.isLoading = false;
      // Remove author from deleted authors list
      state.deletedAuthors = state.deletedAuthors.filter(
        (author) => author.id !== action.payload.data?.id
      );
      // Add author back to authors list if we're on the regular authors view
      if (action.payload.data) {
        state.authors.unshift(action.payload.data as Author);
      }
      state.message = action.payload.status.message;
    },
    restoreAuthorFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      // Reset to page 1 when changing per page
      state.pagination.current_page = 1;
    },
  },
});

export const {
  getAuthorsRequest,
  getAuthorsSuccess,
  getAuthorsFailure,
  createAuthorRequest,
  createAuthorSuccess,
  createAuthorFailure,
  updateAuthorRequest,
  updateAuthorSuccess,
  updateAuthorFailure,
  deleteAuthorRequest,
  deleteAuthorSuccess,
  deleteAuthorFailure,
  getDeletedAuthorsRequest,
  getDeletedAuthorsSuccess,
  getDeletedAuthorsFailure,
  restoreAuthorRequest,
  restoreAuthorSuccess,
  restoreAuthorFailure,
  setPerPage,
} = authorSlice.actions;

export default authorSlice.reducer;