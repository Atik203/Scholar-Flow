import { apiSlice } from "./api/apiSlice";
import { clearCredentials } from "./auth/authSlice";
import type { AppStore } from "./store";

let storeRef: AppStore | null = null;

export function setAppStore(store: AppStore) {
  storeRef = store;
}

export function getAppStore() {
  return storeRef;
}

export function resetAppState() {
  const store = storeRef;
  if (store) {
    // Clear auth state
    store.dispatch(clearCredentials());

    // Reset entire API state including all cached queries
    store.dispatch(apiSlice.util.resetApiState());

    // Force invalidate all tags to ensure fresh data on next login
    store.dispatch(apiSlice.util.invalidateTags(["User"]));
  }
}
