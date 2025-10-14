import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { apiSlice } from "./api/apiSlice";
import { phase2Api } from "./api/phase2Api";
import authReducer from "./auth/authSlice";

// Create a noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem(_key: string) {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: any) {
      return Promise.resolve(value);
    },
    removeItem(_key: string) {
      return Promise.resolve();
    },
  };
};

// Create client-side localStorage wrapper
const createLocalStorage = () => {
  return {
    getItem(key: string) {
      return Promise.resolve(window.localStorage.getItem(key));
    },
    setItem(key: string, value: string) {
      return Promise.resolve(window.localStorage.setItem(key, value));
    },
    removeItem(key: string) {
      return Promise.resolve(window.localStorage.removeItem(key));
    },
  };
};

// Use localStorage on client, noop on server
const storage =
  typeof window !== "undefined" ? createLocalStorage() : createNoopStorage();

// Persist config for auth slice only
const authPersistConfig = {
  key: "scholarflow-auth",
  storage,
  whitelist: ["user", "accessToken", "isAuthenticated"], // Only persist these fields
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
  [phase2Api.reducerPath]: phase2Api.reducer,
});

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            // Ignore redux-persist actions
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            // Ignore RTK Query actions that might have non-serializable data
            "api/executeQuery/pending",
            "api/executeQuery/fulfilled",
            "api/executeQuery/rejected",
            "api/executeMutation/pending",
            "api/executeMutation/fulfilled",
            "api/executeMutation/rejected",
          ],
          ignoredActionsPaths: ["meta.arg", "payload.timestamp"],
          ignoredPaths: [
            // Ignore RTK Query cache and mutations
            "api.queries",
            "api.mutations",
            "api.provided",
            "api.subscriptions",
            "api.config",
          ],
        },
      }).concat(apiSlice.middleware, phase2Api.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

// Persistor for PersistGate
export const createPersistor = (store: AppStore) => persistStore(store);
