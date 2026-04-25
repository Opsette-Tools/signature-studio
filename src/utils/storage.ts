/**
 * Centralized localStorage access. Every persistent key the app uses lives here.
 *
 * - One try/catch wrapper instead of six scattered ones.
 * - Keys live in one place; renaming a key is a single-line change.
 * - Consumers stay JSON-shape-aware via typed helpers.
 */

const KEYS = {
  draft: "esg.draft.v1",
  selectedTemplate: "esg.selectedTemplate.v1",
  saved: "esg.saved.v1",
  favorites: "esg.favorites.v1",
  theme: "esg.theme.v1",
  privacyDismissed: "esg.privacy-dismissed.v1",
} as const;

export type StorageKey = (typeof KEYS)[keyof typeof KEYS];

function readRaw(key: StorageKey): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeRaw(key: StorageKey, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* quota / private mode — silently drop */
  }
}

function removeRaw(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** Read a JSON value at `key`, or return `fallback` if missing/corrupt. */
export function readJSON<T>(key: StorageKey, fallback: T): T {
  const raw = readRaw(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/** Write a JSON-serializable value at `key`. */
export function writeJSON<T>(key: StorageKey, value: T): void {
  try {
    writeRaw(key, JSON.stringify(value));
  } catch {
    /* circular ref or other JSON failure — silently drop */
  }
}

/** Read a string value at `key`, or return `fallback` if missing. */
export function readString(key: StorageKey, fallback = ""): string {
  return readRaw(key) ?? fallback;
}

/** Write a raw string value at `key`. */
export function writeString(key: StorageKey, value: string): void {
  writeRaw(key, value);
}

/** Remove a key entirely. */
export function remove(key: StorageKey): void {
  removeRaw(key);
}

export const storageKeys = KEYS;
