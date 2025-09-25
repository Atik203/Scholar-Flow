import { WebStorage } from "redux-persist";

/**
 * Creates a safe storage wrapper that handles SSR gracefully
 * Falls back to noopStorage when localStorage is not available
 */
function createNoopStorage(): WebStorage {
  return {
    getItem(_key: string): Promise<string | null> {
      return Promise.resolve(null);
    },
    setItem(_key: string, _value: string): Promise<void> {
      return Promise.resolve();
    },
    removeItem(_key: string): Promise<void> {
      return Promise.resolve();
    },
  };
}

/**
 * Safe storage that works in both SSR and browser environments
 */
export const safeStorage: WebStorage = (() => {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return createNoopStorage();
  }

  try {
    // Test if localStorage is available and working
    const testKey = "__redux_persist_test__";
    window.localStorage.setItem(testKey, "test");
    window.localStorage.removeItem(testKey);

    return {
      getItem(key: string): Promise<string | null> {
        try {
          return Promise.resolve(window.localStorage.getItem(key));
        } catch {
          return Promise.resolve(null);
        }
      },
      setItem(key: string, value: string): Promise<void> {
        try {
          window.localStorage.setItem(key, value);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
      removeItem(key: string): Promise<void> {
        try {
          window.localStorage.removeItem(key);
          return Promise.resolve();
        } catch {
          return Promise.resolve();
        }
      },
    };
  } catch {
    // localStorage is not available (e.g., private browsing mode)
    return createNoopStorage();
  }
})();
