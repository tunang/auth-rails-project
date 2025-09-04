import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { categorySaga } from "./categorySaga";

export function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
  ]);
}