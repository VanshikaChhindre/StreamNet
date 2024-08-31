import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist";
import { apiSlice } from "./api/apiSlice";

const persistConfig = {
    key: 'auth',
    storage,
     // Only persist the auth reducer
};

const rootReducer = combineReducers({
    auth: persistReducer(persistConfig, authReducer),
    [apiSlice.reducerPath]: apiSlice.reducer,
});

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Required for redux-persist
        }).concat(apiSlice.middleware),
}); 

/* export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
});
     */

export const persistor = persistStore(store);