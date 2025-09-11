import { call, put, takeLatest } from "redux-saga/effects";
import { 
  getCartItemsRequest,
  getCartItemsSuccess,
  getCartItemsFailure,
  addToCartRequest,
  addToCartSuccess,
  addToCartFailure,
  updateCartItemRequest,
  updateCartItemSuccess,
  updateCartItemFailure,
  removeFromCartRequest,
  removeFromCartSuccess,
  removeFromCartFailure,
  clearCartRequest,
  clearCartSuccess,
  clearCartFailure,
} from "../slices/cartSlice";
import { cartApi } from "@/services/cart.api";
import type { ListResponse, SingleResponse } from "@/types";
import type { CartItem, UpdateCartRequest, RemoveFromCartRequest } from "@/types/cart.type";
import type { PayloadAction } from "@reduxjs/toolkit";

export function* getCartItemsSaga() {
    try {
        const response: ListResponse<CartItem> = yield call(cartApi.user.getCartItems);
        yield put(getCartItemsSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getCartItemsFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* addToCartSaga(action: PayloadAction<UpdateCartRequest>) {
    try {
        const response: SingleResponse<null> = yield call(cartApi.user.addToCart, action.payload);
        yield put(addToCartSuccess(response));
        // Refresh cart after successful addition
        yield put(getCartItemsRequest());
    } catch (error: SingleResponse<null> | any) {
        yield put(addToCartFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* updateCartItemSaga(action: PayloadAction<UpdateCartRequest>) {
    try {
        const response: SingleResponse<null> = yield call(cartApi.user.updateCartItem, action.payload);
        yield put(updateCartItemSuccess(response));
        // Refresh cart after successful update
        yield put(getCartItemsRequest());
    } catch (error: SingleResponse<null> | any) {
        yield put(updateCartItemFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* removeFromCartSaga(action: PayloadAction<RemoveFromCartRequest>) {
    try {
        const response: SingleResponse<null> = yield call(cartApi.user.removeFromCart, action.payload.book_id);
        yield put(removeFromCartSuccess(response));
        // Refresh cart after successful removal
        yield put(getCartItemsRequest());
    } catch (error: SingleResponse<null> | any) {
        yield put(removeFromCartFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* clearCartSaga() {
    try {
        const response: SingleResponse<null> = yield call(cartApi.user.clearCart);
        yield put(clearCartSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(clearCartFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* watchCartSaga() {
    yield takeLatest(getCartItemsRequest.type, getCartItemsSaga);
    yield takeLatest(addToCartRequest.type, addToCartSaga);
    yield takeLatest(updateCartItemRequest.type, updateCartItemSaga);
    yield takeLatest(removeFromCartRequest.type, removeFromCartSaga);
    yield takeLatest(clearCartRequest.type, clearCartSaga);
}