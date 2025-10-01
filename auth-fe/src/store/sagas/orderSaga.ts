import { call, put, takeLatest } from "redux-saga/effects";
import { 
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
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
  payOrderRequest,
  payOrderSuccess,
  payOrderFailure,
} from "../slices/orderSlice";
import { orderApi } from "@/services/order.api";
import type { ListResponse, SingleResponse, PaginationParams } from "@/types";
import type { Order, UpdateOrderStatusRequest } from "@/types/order.type";
import type { PayloadAction } from "@reduxjs/toolkit";

export function* getOrdersSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<Order> = yield call(orderApi.admin.getOrders, params);
        yield put(getOrdersSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getOrdersFailure(error.message));
    }
}

export function* getOrderDetailSaga(action: PayloadAction<number>) {
    try {
        const response: SingleResponse<Order> = yield call(orderApi.admin.getOrderDetail, action.payload);
        yield put(getOrderDetailSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(getOrderDetailFailure(error.message));
    }
}

export function* getUserOrdersSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<Order> = yield call(orderApi.user.getOrders, params);
        yield put(getUserOrdersSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getUserOrdersFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* getUserOrderDetailSaga(action: PayloadAction<number>) {
    try {
        const response: SingleResponse<Order> = yield call(orderApi.user.getOrderDetail, action.payload);
        yield put(getUserOrderDetailSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(getUserOrderDetailFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* updateOrderStatusSaga(action: PayloadAction<{ id: number; data: UpdateOrderStatusRequest }>) {
    try {
        const { id, data } = action.payload;
        const response: SingleResponse<Order> = yield call(orderApi.admin.updateOrderStatus, id, data);
        yield put(updateOrderStatusSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(updateOrderStatusFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* payOrderSaga(action: PayloadAction<string>) {
    try {
        const stripeSessionId = action.payload;
        const response: { status: { code: number; message: string }; data: { order: Order; payment_url: string } } = yield call(orderApi.user.payOrder, stripeSessionId);
        yield put(payOrderSuccess(response.data));
    } catch (error: any) {
        yield put(payOrderFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* watchOrderSaga() {
    yield takeLatest(getOrdersRequest.type, getOrdersSaga);
    yield takeLatest(getUserOrdersRequest.type, getUserOrdersSaga);
    yield takeLatest(getOrderDetailRequest.type, getOrderDetailSaga);
    yield takeLatest(getUserOrderDetailRequest.type, getUserOrderDetailSaga);
    yield takeLatest(updateOrderStatusRequest.type, updateOrderStatusSaga);
    yield takeLatest(payOrderRequest.type, payOrderSaga);
}