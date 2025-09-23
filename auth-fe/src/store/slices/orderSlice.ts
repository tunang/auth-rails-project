import type { UpdateOrderStatusRequest } from "@/schemas/order.schema";
import type { ListResponse, Pagination, SingleResponse, PaginationParams } from "@/types";
import type { Order } from "@/types/order.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  message: string | null;
  isLoading: boolean;
  pagination: Pagination;
  perPage: number;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
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

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    getOrdersRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoading = true;
      state.message = null;
    },
    getOrdersSuccess: (
      state,
      action: PayloadAction<ListResponse<Order>>
    ) => {
      state.isLoading = false;
      state.orders = action.payload.data;
      state.pagination = action.payload.pagination ?? state.pagination;
    },
    getOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    getUserOrdersRequest: (state, _action: PayloadAction<PaginationParams>) => {
      state.isLoading = true;
      state.message = null;
    },
    getUserOrdersSuccess: (
      state,
      action: PayloadAction<ListResponse<Order>>
    ) => {
      state.isLoading = false;
      state.orders = action.payload.data;
      state.pagination = action.payload.pagination ?? state.pagination;
    },
    getUserOrdersFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    getOrderDetailRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    getOrderDetailSuccess: (state, action: PayloadAction<SingleResponse<Order>>) => {
      state.isLoading = false;
      state.currentOrder = action.payload.data;
    },
    getOrderDetailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    getUserOrderDetailRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    getUserOrderDetailSuccess: (state, action: PayloadAction<SingleResponse<Order>>) => {
      state.isLoading = false;
      state.currentOrder = action.payload.data;
    },
    getUserOrderDetailFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    addOrder: (state, action: PayloadAction<Order>) => {
      console.log("addOrder slice", action.payload);
      state.orders.push(action.payload);
    },

    updateOrderStatusRequest: (
      state, 
      _action: PayloadAction<{ id: number; data: UpdateOrderStatusRequest }>
    ) => {
      state.isLoading = true;
      state.message = null;
    },
    updateOrderStatusSuccess: (state, action: PayloadAction<SingleResponse<Order>>) => {
      state.isLoading = false;
      // Update order in the list
      state.orders = state.orders.map((order) =>
        order.id === action.payload.data?.id ? action.payload.data as Order : order
      );
      // Update current order if it's the same one
      if (state.currentOrder?.id === action.payload.data?.id) {
        state.currentOrder = action.payload.data as Order;
      }
      state.message = action.payload.status.message;
    },
    updateOrderStatusFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    setPerPage: (state, action: PayloadAction<number>) => {
      state.perPage = action.payload;
      // Reset to page 1 when changing per page
      state.pagination.current_page = 1;
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
});

export const {
  getOrdersRequest,
  getOrdersSuccess,
  getOrdersFailure,
  getUserOrdersRequest,
  getUserOrdersSuccess,
  getUserOrdersFailure,
  getOrderDetailRequest,
  getOrderDetailSuccess,
  getOrderDetailFailure,
  getUserOrderDetailRequest,
  getUserOrderDetailSuccess,
  getUserOrderDetailFailure,
  addOrder,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  setPerPage,
  clearCurrentOrder,
} = orderSlice.actions;

export default orderSlice.reducer;