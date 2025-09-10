import { call, put, takeLatest } from "redux-saga/effects";
import { 
  createBookFailure, 
  createBookSuccess, 
  getBooksFailure, 
  getBooksRequest, 
  getBooksSuccess, 
  updateBookSuccess, 
  updateBookFailure, 
  deleteBookFailure, 
  deleteBookSuccess, 
  createBookRequest, 
  deleteBookRequest, 
  updateBookRequest, 
  getBooksByCategorySuccess,
  getBooksByCategoryFailure,
  getBooksByCategoryRequest
} from "../slices/bookSlice";
import { bookApi } from "@/services/book.api";
import type { ListResponse, SingleResponse, PaginationParams } from "@/types";
import type { Book } from "@/types/book.type";
import type { PayloadAction } from "@reduxjs/toolkit";

export function* getBooksSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<Book> = yield call(bookApi.admin.getBooks, params);
        yield put(getBooksSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getBooksFailure(error.message));
    }
}

export function* getBooksByCategorySaga(action: PayloadAction<{ categoryId: number; params: PaginationParams }>) {
    try {
        const { categoryId, params } = action.payload;
        const response: ListResponse<Book> = yield call(bookApi.user.getBooksByCategory, categoryId, params);
        yield put(getBooksByCategorySuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getBooksByCategoryFailure(error.message));
    }
}

export function* createBookSaga(action: PayloadAction<FormData>) {
    try {
        const response: SingleResponse<Book> = yield call(bookApi.admin.createBook, action.payload);
        yield put(createBookSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(createBookFailure(error.response.data.status.message));
    }
}

export function* updateBookSaga(action: PayloadAction<{ id: number; data: FormData }>) {
    try {
        const { id, data } = action.payload;
        const response: SingleResponse<Book> = yield call(bookApi.admin.updateBook, id, data);
        yield put(updateBookSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(updateBookFailure(error.message));
    }
}

export function* deleteBookSaga(action: PayloadAction<number>) {
    try {
        const response: SingleResponse<Book> = yield call(bookApi.admin.deleteBook, action.payload);
        yield put(deleteBookSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(deleteBookFailure(error.message));
    }
}

export function* bookSaga() {
    yield takeLatest(getBooksRequest.type, getBooksSaga);
    yield takeLatest(createBookRequest.type, createBookSaga);
    yield takeLatest(updateBookRequest.type, updateBookSaga);
    yield takeLatest(deleteBookRequest.type, deleteBookSaga);
    yield takeLatest(getBooksByCategoryRequest.type, getBooksByCategorySaga);
}