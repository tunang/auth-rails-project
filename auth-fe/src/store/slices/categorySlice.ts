import type { ApiResponse, Pagination } from "@/types";
import type { Category } from "@/types/category.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
    categories: Category[];
    message: string | null;
    isLoading: boolean;
    pagination: Pagination;
  }
  
  const initialState: CategoryState = {
    categories: [],
    message: null,
    isLoading: false,
    pagination: {
        current_page: 1,
        next_page: null,
        prev_page: null,
        total_pages: 0,
        total_count: 0,
    },
  };

  const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {
        getCategoriesRequest: (state) => {
            state.isLoading = true;
            state.message = null;
        },
        getCategoriesSuccess: (state, action: PayloadAction<ApiResponse<Category[]>>) => {
            state.isLoading = false;
            state.categories = action.payload.data ?? [];
            state.pagination = action.payload.pagination ?? state.pagination;
        },
        getCategoriesFailure: (state, action: PayloadAction<string>) => {   
            state.isLoading = false;
            state.message = action.payload;
        },
    }
  })

  export const { getCategoriesRequest, getCategoriesSuccess, getCategoriesFailure } = categorySlice.actions;

  export default categorySlice.reducer;