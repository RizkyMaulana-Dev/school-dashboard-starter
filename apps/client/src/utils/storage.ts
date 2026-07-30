/**
 * Safe wrapper untuk localStorage dengan error handling dan SSR support
 */

const isBrowser = typeof window !== "undefined";

export const storage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (!isBrowser) return defaultValue ?? null;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear(): void {
    if (!isBrowser) return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },

  // Get all keys
  keys(): string[] {
    if (!isBrowser) return [];

    try {
      return Object.keys(localStorage);
    } catch (error) {
      console.error("Error getting localStorage keys:", error);
      return [];
    }
  },

  // Check if key exists
  has(key: string): boolean {
    if (!isBrowser) return false;
    return localStorage.getItem(key) !== null;
  },
};

export const sessionStorage = {
  get<T>(key: string, defaultValue?: T): T | null {
    if (!isBrowser) return defaultValue ?? null;

    try {
      const item = window.sessionStorage.getItem(key);
      if (item === null) return defaultValue ?? null;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading sessionStorage key "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  set<T>(key: string, value: T): void {
    if (!isBrowser) return;

    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting sessionStorage key "${key}":`, error);
    }
  },

  remove(key: string): void {
    if (!isBrowser) return;

    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing sessionStorage key "${key}":`, error);
    }
  },
};
