import type { UpdateCartRequest, RemoveFromCartRequest } from "@/schemas/cart.schema";
import type { ListResponse, SingleResponse } from "@/types";
import type { CartItem } from "@/types/cart.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
  selectedItems: number[]; // book_ids của items được chọn
  message: string | null;
  isLoading: boolean;
  totalItems: number;
  totalAmount: number;
  selectedTotalItems: number;
  selectedTotalAmount: number;
}

const initialState: CartState = {
  items: [],
  selectedItems: [],
  message: null,
  isLoading: false,
  totalItems: 0,
  totalAmount: 0,
  selectedTotalItems: 0,
  selectedTotalAmount: 0,
};

// Helper function to calculate totals
const calculateTotals = (items: CartItem[], selectedItems: number[] = []) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => {
    const price = parseFloat(item.book.price);
    const discountPercentage = parseFloat(item.book.discount_percentage);
    const discountedPrice = price * (1 - discountPercentage / 100);
    return sum + (discountedPrice * item.quantity);
  }, 0);

  const selectedTotalItems = items
    .filter(item => selectedItems.includes(item.book.id))
    .reduce((sum, item) => sum + item.quantity, 0);
  
  const selectedTotalAmount = items
    .filter(item => selectedItems.includes(item.book.id))
    .reduce((sum, item) => {
      const price = parseFloat(item.book.price);
      const discountPercentage = parseFloat(item.book.discount_percentage);
      const discountedPrice = price * (1 - discountPercentage / 100);
      return sum + (discountedPrice * item.quantity);
    }, 0);

  return { totalItems, totalAmount, selectedTotalItems, selectedTotalAmount };
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
      // Auto-select all items by default
      state.selectedItems = action.payload.data.map(item => item.book.id);
      const totals = calculateTotals(action.payload.data, state.selectedItems);
      state.totalItems = totals.totalItems;
      state.totalAmount = totals.totalAmount;
      state.selectedTotalItems = totals.selectedTotalItems;
      state.selectedTotalAmount = totals.selectedTotalAmount;
    },
    getCartItemsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    addToCartRequest: (state, _action: PayloadAction<UpdateCartRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    addToCartSuccess: (state, action: PayloadAction<SingleResponse<null>>) => {
      state.isLoading = false;
      state.message = action.payload.status.message;
      // We'll refresh the cart after successful addition
    },
    addToCartFailure: (state, action: PayloadAction<string>) => {
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
      // Update local state instead of fetching from server
      // The quantity will be updated by the component's local state
    },
    updateCartItemQuantity: (state, action: PayloadAction<{ bookId: number; quantity: number }>) => {
      const { bookId, quantity } = action.payload;
      const item = state.items.find(item => item.book.id === bookId);
      if (item) {
        item.quantity = quantity;
        // Recalculate totals
        const totals = calculateTotals(state.items, state.selectedItems);
        state.totalItems = totals.totalItems;
        state.totalAmount = totals.totalAmount;
        state.selectedTotalItems = totals.selectedTotalItems;
        state.selectedTotalAmount = totals.selectedTotalAmount;
      }
    },
    updateCartItemFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
      // Note: We don't revert quantity here as the optimistic update was already applied
      // The component should handle error display and user can retry
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

    toggleItemSelection: (state, action: PayloadAction<number>) => {
      const bookId = action.payload;
      if (state.selectedItems.includes(bookId)) {
        state.selectedItems = state.selectedItems.filter(id => id !== bookId);
      } else {
        state.selectedItems.push(bookId);
      }
      const totals = calculateTotals(state.items, state.selectedItems);
      state.selectedTotalItems = totals.selectedTotalItems;
      state.selectedTotalAmount = totals.selectedTotalAmount;
    },

    selectAllItems: (state) => {
      state.selectedItems = state.items.map(item => item.book.id);
      const totals = calculateTotals(state.items, state.selectedItems);
      state.selectedTotalItems = totals.selectedTotalItems;
      state.selectedTotalAmount = totals.selectedTotalAmount;
    },

    unselectAllItems: (state) => {
      state.selectedItems = [];
      state.selectedTotalItems = 0;
      state.selectedTotalAmount = 0;
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
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemRequest,
  updateCartItemSuccess,
  updateCartItemFailure,
  updateCartItemQuantity,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartRequest,
  clearCartSuccess,
  clearCartFailure,
  toggleItemSelection,
  selectAllItems,
  unselectAllItems,
  clearMessage,
} = cartSlice.actions;

export default cartSlice.reducer;