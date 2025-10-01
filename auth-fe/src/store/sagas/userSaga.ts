import { call, put, takeLatest } from "redux-saga/effects";
import { 
  getUsersRequest,
  getUsersSuccess,
  getUsersFailure,
} from "../slices/userSlice";
import { userApi } from "@/services/user.api";
import type { ListResponse, PaginationParams } from "@/types";
import type { User } from "@/types/user.type";
import type { PayloadAction } from "@reduxjs/toolkit";

export function* getUsersSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<User> = yield call(userApi.admin.getUsers, params);
        yield put(getUsersSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getUsersFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* watchUserSaga() {
    yield takeLatest(getUsersRequest.type, getUsersSaga);
}
