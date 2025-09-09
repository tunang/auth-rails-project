import { call, put, takeLatest } from "redux-saga/effects";
import { 
  getOrdersRequest,
  getOrdersSuccess,
  getOrdersFailure,
  getOrderDetailRequest,
  getOrderDetailSuccess,
  getOrderDetailFailure,
  updateOrderStatusRequest,
  updateOrderStatusSuccess,
  updateOrderStatusFailure,
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

export function* updateOrderStatusSaga(action: PayloadAction<{ id: number; data: UpdateOrderStatusRequest }>) {
    try {
        const { id, data } = action.payload;
        const response: SingleResponse<Order> = yield call(orderApi.admin.updateOrderStatus, id, data);
        yield put(updateOrderStatusSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(updateOrderStatusFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* watchOrderSaga() {
    yield takeLatest(getOrdersRequest.type, getOrdersSaga);
    yield takeLatest(getOrderDetailRequest.type, getOrderDetailSaga);
    yield takeLatest(updateOrderStatusRequest.type, updateOrderStatusSaga);
}