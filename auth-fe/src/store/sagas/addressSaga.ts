import { call, put, takeLatest } from "redux-saga/effects";
import { 
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
} from "../slices/addressSlice";
import { addressApi } from "@/services/address.api";
import type { ListResponse, SingleResponse } from "@/types";
import type { Address, CreateAddressRequest } from "@/types/address.type";
import type { PayloadAction } from "@reduxjs/toolkit";

export function* getAddressesSaga() {
    try {
        const response: ListResponse<Address> = yield call(addressApi.user.getAddresses);
        yield put(getAddressesSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getAddressesFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* createAddressSaga(action: PayloadAction<CreateAddressRequest>) {
    try {
        const response: SingleResponse<Address> = yield call(addressApi.user.createAddress, action.payload);
        yield put(createAddressSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(createAddressFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* updateAddressSaga(action: PayloadAction<{ id: number; data: CreateAddressRequest }>) {
    try {
        const { id, data } = action.payload;
        const response: SingleResponse<Address> = yield call(addressApi.user.updateAddress, id, data);
        yield put(updateAddressSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(updateAddressFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* deleteAddressSaga(action: PayloadAction<number>) {
    try {
        const id = action.payload;
        const response: SingleResponse<null> = yield call(addressApi.user.deleteAddress, id);
        yield put(deleteAddressSuccess({ id, response }));
    } catch (error: SingleResponse<null> | any) {
        yield put(deleteAddressFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* watchAddressSaga() {
    yield takeLatest(getAddressesRequest.type, getAddressesSaga);
    yield takeLatest(createAddressRequest.type, createAddressSaga);
    yield takeLatest(updateAddressRequest.type, updateAddressSaga);
    yield takeLatest(deleteAddressRequest.type, deleteAddressSaga);
}