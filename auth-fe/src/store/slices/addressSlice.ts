import type { CreateAddressRequest } from "@/schemas/address.schema";
import type { ListResponse, SingleResponse } from "@/types";
import type { Address } from "@/types/address.type";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AddressState {
  addresses: Address[];
  message: string | null;
  isLoading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  message: null,
  isLoading: false,
};

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    getAddressesRequest: (state) => {
      state.isLoading = true;
      state.message = null;
    },
    getAddressesSuccess: (
      state,
      action: PayloadAction<ListResponse<Address>>
    ) => {
      state.isLoading = false;
      state.addresses = action.payload.data;
    },
    getAddressesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    createAddressRequest: (state, _action: PayloadAction<CreateAddressRequest>) => {
      state.isLoading = true;
      state.message = null;
    },
    createAddressSuccess: (state, action: PayloadAction<SingleResponse<Address>>) => {
      state.isLoading = false;
      if (action.payload.data) {
        state.addresses.push(action.payload.data);
      }
      state.message = action.payload.status.message;
    },
    createAddressFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },
    
    updateAddressRequest: (state, _action: PayloadAction<{ id: number; data: CreateAddressRequest }>) => {
      state.isLoading = true;
      state.message = null;
    },
    updateAddressSuccess: (state, action: PayloadAction<SingleResponse<Address>>) => {
      state.isLoading = false;
      if (action.payload.data) {
        state.addresses = state.addresses.map((address) =>
          address.id === action.payload.data?.id ? action.payload.data as Address : address
        );
      }
      state.message = action.payload.status.message;
    },
    updateAddressFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    deleteAddressRequest: (state, _action: PayloadAction<number>) => {
      state.isLoading = true;
      state.message = null;
    },
    deleteAddressSuccess: (state, action: PayloadAction<{ id: number; response: SingleResponse<null> }>) => {
      state.isLoading = false;
      state.addresses = state.addresses.filter(
        (address) => address.id !== action.payload.id
      );
      state.message = action.payload.response.status.message;
    },
    deleteAddressFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },

    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const {
  getAddressesRequest,
  getAddressesSuccess,
  getAddressesFailure,
  createAddressRequest,
  createAddressSuccess,
  createAddressFailure,
  updateAddressRequest,
  updateAddressSuccess,
  updateAddressFailure,
  deleteAddressRequest,
  deleteAddressSuccess,
  deleteAddressFailure,
  clearMessage,
} = addressSlice.actions;

export default addressSlice.reducer;