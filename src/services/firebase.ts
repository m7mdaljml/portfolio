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
      return snap.data() as SiteContentState;
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
    await setDoc(doc(dbInstance, COLLECTION, DOC_ID), state, { merge: true });
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
        onChange(snap.data() as SiteContentState);
      }
    },
    () => {
      // Ignore subscription errors; fall back to local cache.
    },
  );
}
