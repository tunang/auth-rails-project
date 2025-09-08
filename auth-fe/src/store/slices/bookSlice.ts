import type { BookRequest } from "@/schemas/book.schema";
import type { ListResponse, Pagination, SingleResponse, PaginationParams } from "@/types";
import type { Book } from "@/types/book.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface BookState {
  books: Book[];
  message: string | null;
  isLoading: boolean;
  pagination: Pagination;
  perPage: number;
}

const initialState: BookState = {
  books: [],
  message: null,
  isLoading: false,
  pagination: {
    current_page: 1,
    next_page: null,
    prev_page: null,
    total_pages: 0,
    total_count: 0,
  },
  perPage: 10,
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    getBooksRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoading = true;
      state.message = null;
    },
    getBooksSuccess: (
      state,
      action: PayloadAction<ListResponse<Book>>
    ) => {
      state.isLoading = false;
      state.books = action.payload.data;
      state.pagination = action.payload.pagination ?? state.pagination;
    },
    getBooksFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    createBookRequest: (state, _action: PayloadAction<FormData>) => {
      state.isLoading = true;
      state.message = null;
    },
    createBookSuccess: (state, action: PayloadAction<SingleResponse<Book>>) => {
      console.log(action.payload);
      state.isLoading = false;
      state.books.push(action.payload.data as Book);
      state.message = action.payload.status.message;
    },
    createBookFailure: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.isLoading = false;
      state.message = action.payload;
    },
    
    updateBookRequest: (state, _action: PayloadAction<{ id: number; data: FormData }>) => {
      state.isLoading = true;
      state.message = null;
    },
    updateBookSuccess: (state, action: PayloadAction<SingleResponse<Book>>) => {
      state.isLoading = false;
      console.log(action.payload);
      state.books = state.books.map((book) =>
        book.id === action.payload.data?.id ? action.payload.data as Book : book
      );
      state.message = action.payload.status.message;
    },
    updateBookFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    deleteBookRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    deleteBookSuccess: (state, action: PayloadAction<SingleResponse<Book>>) => {
      state.isLoading = false;
      state.books = state.books.filter(
        (book) => book.id !== action.payload.data?.id
      );
      state.message = action.payload.status.message;
    },
    deleteBookFailure: (state, action: PayloadAction<string>) => {
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
  getBooksRequest,
  getBooksSuccess,
  getBooksFailure,
  createBookRequest,
  createBookSuccess,
  createBookFailure,
  updateBookRequest,
  updateBookSuccess,
  updateBookFailure,
  deleteBookRequest,
  deleteBookSuccess,
  deleteBookFailure,
  setPerPage,
} = bookSlice.actions;

export default bookSlice.reducer;