import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice';
import { rootSaga } from './sagas';
import categoryReducer from './slices/categorySlice';
import authorReducer from './slices/authorSlice';
import bookReducer from './slices/bookSlice';
import orderReducer from './slices/orderSlice';
import cartReducer from './slices/cartSlice';
import addressReducer from './slices/addressSlice';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    author: authorReducer,
    book: bookReducer,
    order: orderReducer,
    cart: cartReducer,
    address: addressReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: false, // Disable thunk since we're using saga
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Run saga
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;