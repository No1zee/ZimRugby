/**
 * Lightweight IndexedDB helper for offline draft submission buffering.
 * Provides save, retrieve, and clear operations with SSR safety guards.
 */

const DB_NAME = "zru-offline-drafts";
const DB_VERSION = 1;
const STORE_NAME = "draft_submissions";

interface DraftSubmission {
  id: string;
  formType: string;
  data: Record<string, unknown>;
  createdAt: string;
}

function openDB(): Promise<IDBDatabase> | null {
  if (typeof window === "undefined") return null;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveDraftSubmission(
  formType: string,
  data: Record<string, unknown>
): Promise<{ success: boolean; id: string }> {
  if (typeof window === "undefined") {
    return { success: false, id: "" };
  }

  const db = await openDB();
  if (!db) return { success: false, id: "" };

  const id = `draft_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const entry: DraftSubmission = {
    id,
    formType,
    data,
    createdAt: new Date().toISOString(),
  };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.add(entry);

    request.onsuccess = () => resolve({ success: true, id });
    request.onerror = () => reject(request.error);
  });
}

export async function getDraftSubmissions(): Promise<DraftSubmission[]> {
  if (typeof window === "undefined") return [];

  const db = await openDB();
  if (!db) return [];

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as DraftSubmission[]);
    request.onerror = () => reject(request.error);
  });
}

export async function clearDraftSubmissions(): Promise<{ success: boolean }> {
  if (typeof window === "undefined") return { success: false };

  const db = await openDB();
  if (!db) return { success: false };

  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve({ success: true });
    request.onerror = () => reject(request.error);
  });
}
