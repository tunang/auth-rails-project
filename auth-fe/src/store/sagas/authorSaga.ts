import { call, put, takeLatest } from "redux-saga/effects";
import { 
  createAuthorFailure, 
  createAuthorSuccess, 
  getAuthorsFailure, 
  getAuthorsRequest, 
  getAuthorsSuccess, 
  updateAuthorSuccess, 
  updateAuthorFailure, 
  deleteAuthorFailure, 
  deleteAuthorSuccess, 
  createAuthorRequest, 
  deleteAuthorRequest, 
  updateAuthorRequest,
  getDeletedAuthorsRequest,
  getDeletedAuthorsSuccess,
  getDeletedAuthorsFailure,
  restoreAuthorRequest,
  restoreAuthorSuccess,
  restoreAuthorFailure
} from "../slices/authorSlice";
import { authorApi } from "@/services/author.api";
import type { ListResponse, SingleResponse, PaginationParams } from "@/types";
import type { Author } from "@/types/author.type";
import type { PayloadAction } from "@reduxjs/toolkit";

export function* getAuthorsSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<Author> = yield call(authorApi.admin.getAuthors, params);
        yield put(getAuthorsSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getAuthorsFailure(error.message));
    }
}

export function* createAuthorSaga(action: PayloadAction<FormData>) {
    try {
        const response: SingleResponse<Author> = yield call(authorApi.admin.createAuthor, action.payload);
        yield put(createAuthorSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(createAuthorFailure(error.response.data.status.message));
    }
}

export function* updateAuthorSaga(action: PayloadAction<{ id: number; data: FormData }>) {
    try {
        const { id, data } = action.payload;
        const response: SingleResponse<Author> = yield call(authorApi.admin.updateAuthor, id, data);
        yield put(updateAuthorSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(updateAuthorFailure(error.message));
    }
}

export function* deleteAuthorSaga(action: PayloadAction<number>) {
    try {
        const response: SingleResponse<Author> = yield call(authorApi.admin.deleteAuthor, action.payload);
        yield put(deleteAuthorSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(deleteAuthorFailure(error.message));
    }
}

export function* getDeletedAuthorsSaga(action: PayloadAction<PaginationParams>) {
    try {
        const params = action.payload || {};
        const response: ListResponse<Author> = yield call(authorApi.admin.getDeletedAuthors, params);
        yield put(getDeletedAuthorsSuccess(response));
    } catch (error: ListResponse<null> | any) {
        yield put(getDeletedAuthorsFailure(error.message));
    }
}

export function* restoreAuthorSaga(action: PayloadAction<number>) {
    try {
        const response: SingleResponse<Author> = yield call(authorApi.admin.restoreAuthor, action.payload);
        yield put(restoreAuthorSuccess(response));
    } catch (error: SingleResponse<null> | any) {
        yield put(restoreAuthorFailure(error.message));
    }
}

export function* authorSaga() {
    yield takeLatest(getAuthorsRequest.type, getAuthorsSaga);
    yield takeLatest(createAuthorRequest.type, createAuthorSaga);
    yield takeLatest(updateAuthorRequest.type, updateAuthorSaga);
    yield takeLatest(deleteAuthorRequest.type, deleteAuthorSaga);
    yield takeLatest(getDeletedAuthorsRequest.type, getDeletedAuthorsSaga);
    yield takeLatest(restoreAuthorRequest.type, restoreAuthorSaga);
}