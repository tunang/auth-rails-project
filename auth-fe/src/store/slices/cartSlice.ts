import type { UpdateCartRequest, RemoveFromCartRequest } from "@/schemas/cart.schema";
import type { ListResponse, SingleResponse } from "@/types";
import type { CartItem } from "@/types/cart.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
  message: string | null;
  isLoading: boolean;
  totalItems: number;
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  message: null,
  isLoading: false,
  totalItems: 0,
  totalAmount: 0,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.book.price);
    const discountPercentage = parseFloat(item.book.discount_percentage);
    const discountedPrice = price * (1 - discountPercentage / 100);
    return sum + (discountedPrice * item.quantity);
  }, 0);
  return { totalItems, totalAmount };
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    getCartItemsRequest: (state) => {
      state.isLoading = true;
      state.message = null;
    },
    getCartItemsSuccess: (
      state,
      action: PayloadAction<ListResponse<CartItem>>
    ) => {
      state.isLoading = false;
      state.items = action.payload.data;
      const totals = calculateTotals(action.payload.data);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
    },
    getCartItemsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    updateCartItemRequest: (state, _action: PayloadAction<UpdateCartRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    updateCartItemSuccess: (state, action: PayloadAction<SingleResponse<null>>) => {
      state.isLoading = false;
      state.message = action.payload.status.message;
      // We'll refresh the cart after successful update
    },
    updateCartItemFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    removeFromCartRequest: (state, _action: PayloadAction<RemoveFromCartRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    removeFromCartSuccess: (state, action: PayloadAction<SingleResponse<null>>) => {
      state.isLoading = false;
      state.message = action.payload.status.message;
      // We'll refresh the cart after successful removal
    },
    removeFromCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    clearCartRequest: (state) => {
      state.isLoading = true;
      state.message = null;
    },
    clearCartSuccess: (state, action: PayloadAction<SingleResponse<null>>) => {
      state.isLoading = false;
      state.items = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.message = action.payload.status.message;
    },
    clearCartFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const {
  getCartItemsRequest,
  getCartItemsSuccess,
  getCartItemsFailure,
  updateCartItemRequest,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartRequest,
  clearCartSuccess,
  clearCartFailure,
  clearMessage,
} = cartSlice.actions;

export default cartSlice.reducer;