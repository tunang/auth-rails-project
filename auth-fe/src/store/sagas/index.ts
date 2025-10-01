import { all } from "redux-saga/effects";
import { authSaga } from "./authSaga";
import { categorySaga } from "./categorySaga";
import { authorSaga } from "./authorSaga";
import { bookSaga } from "./bookSaga";
import { watchOrderSaga } from "./orderSaga";
import { watchCartSaga } from "./cartSaga";
import { watchAddressSaga } from "./addressSaga";
import { watchUserSaga } from "./userSaga";

export function* rootSaga() {
  yield all([
    authSaga(),
    categorySaga(),
    authorSaga(),
    bookSaga(),
    watchOrderSaga(),
    watchCartSaga(),
    watchAddressSaga(),
    watchUserSaga(),
  ]);
}