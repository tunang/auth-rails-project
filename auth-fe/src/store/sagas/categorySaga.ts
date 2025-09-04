import { call, put, takeLatest } from "redux-saga/effects";
import { getCategoriesFailure, getCategoriesRequest, getCategoriesSuccess } from "../slices/categorySlice";
import { categoryApi } from "@/services/category.api";
import type { ApiResponse } from "@/types";
import type { Category } from "@/types/category.type";

export function* getCategoriesSaga() {
    try {
        const response: ApiResponse<Category[]> = yield call(categoryApi.admin.getCategories);
        console.log(response);
        yield put(getCategoriesSuccess(response));
    } catch (error: ApiResponse<null> | any) {
        yield put(getCategoriesFailure(error.message));
    }
}

export function* categorySaga() {
    yield takeLatest(getCategoriesRequest.type, getCategoriesSaga);
}