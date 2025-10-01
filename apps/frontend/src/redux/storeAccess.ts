import type { Persistor } from "redux-persist";
import { apiSlice } from "./api/apiSlice";
import { clearCredentials } from "./auth/authSlice";
import type { AppStore } from "./store";

let storeRef: AppStore | null = null;
let persistorRef: Persistor | null = null;

export function setAppStore(store: AppStore) {
  storeRef = store;
}

export function getAppStore() {
  return storeRef;
}

export function setAppPersistor(persistor: Persistor) {
  persistorRef = persistor;
}

export function getAppPersistor() {
  return persistorRef;
}

async function clearAllStorage() {
  if (typeof window === "undefined") {
    return;
  }

  // Clear localStorage - remove all ScholarFlow-related keys
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i);
      if (key) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => {
      try {
        window.localStorage.removeItem(key);
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`Failed to remove localStorage key ${key}:`, err);
        }
      }
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to clear localStorage:", error);
    }
  }

  // Clear sessionStorage
  try {
    window.sessionStorage.clear();
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("Failed to clear sessionStorage:", error);
    }
  }

  // Clear IndexedDB databases
  if ("indexedDB" in window) {
    try {
      const databases = await window.indexedDB.databases();
      for (const db of databases) {
        if (db.name) {
          try {
            window.indexedDB.deleteDatabase(db.name);
          } catch (err) {
            if (process.env.NODE_ENV !== "production") {
              console.warn(`Failed to delete IndexedDB ${db.name}:`, err);
            }
          }
        }
      }
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Failed to clear IndexedDB:", error);
      }
    }
  }
}

export async function resetAppState() {
  const store = storeRef;
  if (store) {
    store.dispatch(clearCredentials());
    store.dispatch(apiSlice.util.resetApiState());
  }

  const persistor = persistorRef;
  if (persistor) {
    try {
      // Ensure all pending state writes are processed before purging
      await persistor.flush();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Persistor flush failed:", error);
      }
    }

    try {
      await persistor.purge();
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Persistor purge failed:", error);
      }
    }
  }

  // Clear all browser storage
  await clearAllStorage();
}
