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
  getBooksByCategoryRequest,
  getBookDetailRequest,
  getBookDetailSuccess,
  getBookDetailFailure,
  getDeletedBooksRequest,
  getDeletedBooksSuccess,
  getDeletedBooksFailure,
  restoreBookRequest,
  restoreBookSuccess,
  restoreBookFailure
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

export function* getBookDetailSaga(action: PayloadAction<number | string>) {
    try {
        const response: SingleResponse<Book> = yield call(bookApi.user.getBookDetail, action.payload);
        yield put(getBookDetailSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(getBookDetailFailure(error.response?.data?.status?.message || error.message));
    }
}

export function* getDeletedBooksSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<Book> = yield call(bookApi.admin.getDeletedBooks, params);
        yield put(getDeletedBooksSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getDeletedBooksFailure(error.message));
    }
}

export function* restoreBookSaga(action: PayloadAction<number>) {
    try {
        const response: SingleResponse<Book> = yield call(bookApi.admin.restoreBook, action.payload);
        yield put(restoreBookSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(restoreBookFailure(error.message));
    }
}

export function* bookSaga() {
    yield takeLatest(getBooksRequest.type, getBooksSaga);
    yield takeLatest(createBookRequest.type, createBookSaga);
    yield takeLatest(updateBookRequest.type, updateBookSaga);
    yield takeLatest(deleteBookRequest.type, deleteBookSaga);
    yield takeLatest(getBooksByCategoryRequest.type, getBooksByCategorySaga);
    yield takeLatest(getBookDetailRequest.type, getBookDetailSaga);
    yield takeLatest(getDeletedBooksRequest.type, getDeletedBooksSaga);
    yield takeLatest(restoreBookRequest.type, restoreBookSaga);
}