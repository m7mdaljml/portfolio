import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  type Firestore,
  type Unsubscribe,
} from "firebase/firestore";
import type { SiteContentState } from "@/domain/content-store";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean => {
  return Boolean(firebaseConfig.projectId && firebaseConfig.apiKey);
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

const DOC_ID = "site-content";
const COLLECTION = "portfolio";

/** Firestore does not allow nested arrays. Convert string[][] to Record<string, string[]> before saving. */
function sanitizeForFirebase(obj: unknown): unknown {
  if (Array.isArray(obj) && obj.length > 0 && Array.isArray(obj[0])) {
    const record: Record<string, string[]> = {};
    obj.forEach((item, i) => {
      record[String(i)] = item as string[];
    });
    return record;
  }
  if (typeof obj === "object" && obj !== null && !Array.isArray(obj)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj)) {
      out[k] = sanitizeForFirebase(v);
    }
    return out;
  }
  return obj;
}

/** Recursively sanitize a state tree for Firebase. */
function sanitizeState(state: SiteContentState): Record<string, unknown> {
  return sanitizeForFirebase(state) as Record<string, unknown>;
}

/** Recursively walk the object and convert any Record<"0", "1", ...> back to arrays. */
function hydrateNestedArrays(obj: unknown): unknown {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    if (Array.isArray(obj)) {
      return obj.map(hydrateNestedArrays);
    }
    return obj;
  }
  const entries = Object.entries(obj);
  if (entries.length > 0 && entries.every(([k]) => /^\d+$/.test(k))) {
    const arr = entries
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([, v]) => v);
    return arr.map(hydrateNestedArrays);
  }
  const out: Record<string, unknown> = {};
  for (const [k, v] of entries) {
    out[k] = hydrateNestedArrays(v);
  }
  return out;
}

function getDb(): Firestore | null {
  if (!isFirebaseConfigured()) return null;
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
  return db;
}

export async function loadContentFromFirebase(): Promise<SiteContentState | null> {
  const dbInstance = getDb();
  if (!dbInstance) return null;
  try {
    const snap = await getDoc(doc(dbInstance, COLLECTION, DOC_ID));
    if (snap.exists()) {
      return hydrateNestedArrays(snap.data()) as SiteContentState;
    }
    return null;
  } catch {
    return null;
  }
}

export interface SaveResult {
  ok: boolean;
  reason?: "not-configured" | "error";
  message?: string;
}

export function getFirebaseConfigStatus(): {
  configured: boolean;
  missing: string[];
} {
  const missing: string[] = [];
  if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) missing.push("VITE_FIREBASE_PROJECT_ID");
  if (!import.meta.env.VITE_FIREBASE_API_KEY) missing.push("VITE_FIREBASE_API_KEY");
  if (!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) missing.push("VITE_FIREBASE_AUTH_DOMAIN");
  if (!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) missing.push("VITE_FIREBASE_STORAGE_BUCKET");
  if (!import.meta.env.VITE_FIREBASE_APP_ID) missing.push("VITE_FIREBASE_APP_ID");
  return { configured: missing.length === 0, missing };
}

export async function saveContentToFirebase(
  state: SiteContentState,
): Promise<SaveResult> {
  const dbInstance = getDb();
  if (!dbInstance) {
    return {
      ok: false,
      reason: "not-configured",
      message: "Firebase is not configured in your .env",
    };
  }
  try {
    await setDoc(doc(dbInstance, COLLECTION, DOC_ID), sanitizeState(state), {
      merge: true,
    });
    return { ok: true };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown Firestore write error";
    return { ok: false, reason: "error", message };
  }
}

export function subscribeToFirebase(
  onChange: (state: SiteContentState) => void,
): Unsubscribe | null {
  const dbInstance = getDb();
  if (!dbInstance) return null;
  return onSnapshot(
    doc(dbInstance, COLLECTION, DOC_ID),
    (snap) => {
      if (snap.exists()) {
        onChange(hydrateNestedArrays(snap.data()) as SiteContentState);
      }
    },
    () => {
      // Ignore subscription errors; fall back to local cache.
    },
  );
}
