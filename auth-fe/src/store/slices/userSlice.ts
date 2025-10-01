import type { ListResponse, Pagination, PaginationParams } from "@/types";
import type { User } from "@/types/user.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  users: User[];
  message: string | null;
  isLoading: boolean;
  pagination: Pagination;
  perPage: number;
}

const initialState: UserState = {
  users: [],
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

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsersRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoading = true;
      state.message = null;
    },
    getUsersSuccess: (
      state,
      action: PayloadAction<ListResponse<User>>
    ) => {
      state.isLoading = false;
      state.users = action.payload.data;
      state.pagination = action.payload.pagination ?? state.pagination;
    },
    getUsersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      state.pagination.current_page = 1;
    },
  },
});

export const {
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
  setPerPage,
} = userSlice.actions;

export default userSlice.reducer;
