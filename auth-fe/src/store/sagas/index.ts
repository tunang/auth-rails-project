import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { categorySaga } from "./categorySaga";
import { authorSaga } from "./authorSaga";
import { bookSaga } from "./bookSaga";

export function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
    authorSaga(),
    bookSaga(),
  ]);
}