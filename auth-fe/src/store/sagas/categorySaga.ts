import { call, put, takeLatest } from "redux-saga/effects";
import { createCategoryFailure, createCategorySuccess, getCategoriesFailure, getCategoriesRequest, getCategoriesSuccess, updateCategorySuccess, updateCategoryFailure, deleteCategoryFailure, deleteCategorySuccess, createCategoryRequest, deleteCategoryRequest, updateCategoryRequest } from "../slices/categorySlice";
import { categoryApi } from "@/services/category.api";
import type {ListResponse, SingleResponse, PaginationParams } from "@/types";
import type { Category } from "@/types/category.type";
import type { PayloadAction } from "@reduxjs/toolkit";

export function* getCategoriesSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<Category> = yield call(categoryApi.admin.getCategories, params);
        yield put(getCategoriesSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getCategoriesFailure(error.message));
    }
}

export function* createCategorySaga(action: PayloadAction<Category>) {
    try {
        const response: SingleResponse<Category> = yield call(categoryApi.admin.createCategory, action.payload);
        yield put(createCategorySuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(createCategoryFailure(error.response.data.status.message));
    }
}

export function* updateCategorySaga(action: PayloadAction<Category>) {
    try {
        const response: SingleResponse<Category> = yield call(categoryApi.admin.updateCategory, action.payload.id, action.payload);
        yield put(updateCategorySuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(updateCategoryFailure(error.message));
    }
}

export function* deleteCategorySaga(action: PayloadAction<number>) {
    try {
        const response: SingleResponse<Category> = yield call(categoryApi.admin.deleteCategory, action.payload);
        yield put(deleteCategorySuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(deleteCategoryFailure(error.message));
    }
}


export function* categorySaga() {
    yield takeLatest(getCategoriesRequest.type, getCategoriesSaga);
    yield takeLatest(createCategoryRequest.type, createCategorySaga);
    yield takeLatest(updateCategoryRequest.type, updateCategorySaga);
    yield takeLatest(deleteCategoryRequest.type, deleteCategorySaga);
}