import type { CategoryRequest } from "@/schemas/category.schema";
import type { ListResponse, Pagination, SingleResponse, PaginationParams } from "@/types";
import type { Category } from "@/types/category.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categories: Category[];
  deletedCategories: Category[];
  message: string | null;
  isLoading: boolean;
  isLoadingDeleted: boolean;
  pagination: Pagination;
  deletedPagination: Pagination;
  perPage: number;
}

const initialState: CategoryState = {
  categories: [],
  deletedCategories: [],
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    getCategoriesRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoading = true;
      state.message = null;
    },
    getCategoriesSuccess: (
      state,
      action: PayloadAction<ListResponse<Category>>
    ) => {
      state.isLoading = false;
      state.categories = action.payload.data;
      state.pagination = action.payload.pagination ?? state.pagination;
    },
    getCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    createCategoryRequest: (state, _action:PayloadAction<CategoryRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    createCategorySuccess: (state, action: PayloadAction<SingleResponse<Category>>) => {
      console.log(action.payload);
      state.isLoading = false;
      state.categories.push(action.payload.data as Category);
      state.message = action.payload.status.message;
    },
    createCategoryFailure: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      state.isLoading = false;
      state.message = action.payload;
    },
    
    updateCategoryRequest: (state, _action: PayloadAction<CategoryRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    updateCategorySuccess: (state, action: PayloadAction<SingleResponse<Category>>) => {
      state.isLoading = false;
      state.categories = state.categories.map((category) =>
        category.id === action.payload.data?.id ? action.payload.data as Category : category
      );
      state.message = action.payload.status.message;
    },
    updateCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },


    deleteCategoryRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    deleteCategorySuccess: (state, action: PayloadAction<SingleResponse<Category>>) => {
      state.isLoading = false;
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload.data?.id
      );
      state.message = action.payload.status.message;
    },
    deleteCategoryFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    getDeletedCategoriesRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoadingDeleted = true;
      state.message = null;
    },
    getDeletedCategoriesSuccess: (
      state,
      action: PayloadAction<ListResponse<Category>>
    ) => {
      state.isLoadingDeleted = false;
      state.deletedCategories = action.payload.data;
      state.deletedPagination = action.payload.pagination ?? state.deletedPagination;
    },
    getDeletedCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.isLoadingDeleted = false;
      state.message = action.payload;
    },

    restoreCategoryRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    restoreCategorySuccess: (state, action: PayloadAction<SingleResponse<Category>>) => {
      state.isLoading = false;
      // Remove category from deleted categories list
      state.deletedCategories = state.deletedCategories.filter(
        (category) => category.id !== action.payload.data?.id
      );
      // Add category back to categories list if we're on the regular categories view
      if (action.payload.data) {
        state.categories.unshift(action.payload.data as Category);
      }
      state.message = action.payload.status.message;
    },
    restoreCategoryFailure: (state, action: PayloadAction<string>) => {
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
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  createCategoryRequest,
  createCategorySuccess,
  createCategoryFailure,
  updateCategoryRequest,
  updateCategorySuccess,
  updateCategoryFailure,
  deleteCategoryRequest,
  deleteCategorySuccess,
  deleteCategoryFailure,
  getDeletedCategoriesRequest,
  getDeletedCategoriesSuccess,
  getDeletedCategoriesFailure,
  restoreCategoryRequest,
  restoreCategorySuccess,
  restoreCategoryFailure,
  setPerPage,
} = categorySlice.actions;

export default categorySlice.reducer;
