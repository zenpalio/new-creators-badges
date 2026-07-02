// Simple persistence for Ads Studio state.
// - JSON state (intro/headline/captions) via localStorage
// - Clip File via IndexedDB (localStorage can't hold binary File efficiently)

const DB_NAME = "ads-studio";
const STORE = "files";
const CLIP_KEY = "clip";

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveClip(file: File | null): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    if (file) store.put(file, CLIP_KEY);
    else store.delete(CLIP_KEY);
    await new Promise<void>((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch (e) {
    console.warn("saveClip failed", e);
  }
}

export async function loadClip(): Promise<File | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.get(CLIP_KEY);
    const result = await new Promise<File | undefined>((resolve, reject) => {
      req.onsuccess = () => resolve(req.result as File | undefined);
      req.onerror = () => reject(req.error);
    });
    db.close();
    return result ?? null;
  } catch (e) {
    console.warn("loadClip failed", e);
    return null;
  }
}

export function loadJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}
