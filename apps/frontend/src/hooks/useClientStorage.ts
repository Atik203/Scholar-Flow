"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hook for localStorage with TypeScript support and error handling
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists to localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  // Remove item from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for sessionStorage with TypeScript support and error handling
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 */
export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.sessionStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== "undefined") {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.error(`Error setting sessionStorage key "${key}":`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * IndexedDB wrapper for large data storage
 */
interface IndexedDBConfig {
  dbName: string;
  storeName: string;
  version?: number;
}

class IndexedDBStorage {
  private dbName: string;
  private storeName: string;
  private version: number;
  private db: IDBDatabase | null = null;

  constructor({ dbName, storeName, version = 1 }: IndexedDBConfig) {
    this.dbName = dbName;
    this.storeName = storeName;
    this.version = version;
  }

  async init(): Promise<void> {
    if (typeof window === "undefined" || !window.indexedDB) {
      throw new Error("IndexedDB is not supported");
    }

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
    });
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result || null);
    });
  }

  async set<T>(key: string, value: T): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put(value, key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async remove(key: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(key);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.clear();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }
}

/**
 * Hook for IndexedDB with TypeScript support
 * @param config - IndexedDB configuration
 * @param key - Storage key
 * @param initialValue - Initial value if key doesn't exist
 */
export function useIndexedDB<T>(
  config: IndexedDBConfig,
  key: string,
  initialValue: T
): [
  T,
  (value: T) => Promise<void>,
  () => Promise<void>,
  boolean,
  string | null,
] {
  const [value, setValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storage] = useState(() => new IndexedDBStorage(config));

  useEffect(() => {
    const loadValue = async () => {
      try {
        setIsLoading(true);
        const storedValue = await storage.get<T>(key);
        if (storedValue !== null) {
          setValue(storedValue);
        }
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load value");
        console.error(`Error loading IndexedDB key "${key}":`, err);
      } finally {
        setIsLoading(false);
      }
    };

    loadValue();
  }, [key, storage]);

  const setStoredValue = useCallback(
    async (newValue: T) => {
      try {
        await storage.set(key, newValue);
        setValue(newValue);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save value");
        console.error(`Error setting IndexedDB key "${key}":`, err);
        throw err;
      }
    },
    [key, storage]
  );

  const removeValue = useCallback(async () => {
    try {
      await storage.remove(key);
      setValue(initialValue);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove value");
      console.error(`Error removing IndexedDB key "${key}":`, err);
      throw err;
    }
  }, [key, storage, initialValue]);

  return [value, setStoredValue, removeValue, isLoading, error];
}

/**
 * Cache with expiration support
 */
interface CacheItem<T> {
  value: T;
  expiry: number;
}

export class CacheStorage {
  private static instance: CacheStorage;
  private cache: Map<string, CacheItem<any>> = new Map();

  private constructor() {}

  static getInstance(): CacheStorage {
    if (!CacheStorage.instance) {
      CacheStorage.instance = new CacheStorage();
    }
    return CacheStorage.instance;
  }

  set<T>(key: string, value: T, ttlSeconds: number = 300): void {
    const expiry = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiry });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  remove(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Clean up expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

/**
 * Hook for in-memory cache with expiration
 */
export function useCache<T>(
  key: string,
  ttlSeconds: number = 300
): [T | null, (value: T) => void, () => void] {
  const [cache] = useState(() => CacheStorage.getInstance());
  const [value, setValue] = useState<T | null>(() => cache.get<T>(key));

  const setCachedValue = useCallback(
    (newValue: T) => {
      cache.set(key, newValue, ttlSeconds);
      setValue(newValue);
    },
    [key, ttlSeconds, cache]
  );

  const removeCachedValue = useCallback(() => {
    cache.remove(key);
    setValue(null);
  }, [key, cache]);

  return [value, setCachedValue, removeCachedValue];
}
