import {
  doc,
  getDoc,
  setDoc,
  increment,
  arrayUnion,
  serverTimestamp,
  type FieldValue,
} from "firebase/firestore";
import { getDb, isFirebaseConfigured } from "./firebase";

const COLLECTION = "portfolio";
const ANALYTICS_DOC = "analytics";

export interface MessageRecord {
  timestamp: string;
  name: string;
  email: string;
  topic: string;
}

export interface AnalyticsDoc {
  messages?: {
    total: number;
    recent: MessageRecord[];
  };
  repoClicks?: {
    total: number;
    byRepo: Record<string, number>;
  };
  lastUpdated?: FieldValue;
}

export async function recordContactMessage(
  name: string,
  email: string,
  topic: string,
): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  if (!db) return;

  try {
    const ref = doc(db, COLLECTION, ANALYTICS_DOC);
    const message: MessageRecord = {
      timestamp: new Date().toISOString(),
      name,
      email,
      topic,
    };
    await setDoc(
      ref,
      {
        messages: {
          total: increment(1) as unknown as FieldValue,
          recent: arrayUnion(message) as unknown as FieldValue,
        },
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    );
  } catch {
    // Silently fail - tracking should never break the site
  }
}

export async function recordRepoClick(repoName: string): Promise<void> {
  if (!isFirebaseConfigured()) return;
  const db = getDb();
  if (!db) return;

  try {
    const ref = doc(db, COLLECTION, ANALYTICS_DOC);
    await setDoc(
      ref,
      {
        repoClicks: {
          total: increment(1) as unknown as FieldValue,
          byRepo: {
            [repoName]: increment(1) as unknown as FieldValue,
          },
        },
        lastUpdated: serverTimestamp(),
      },
      { merge: true },
    );
  } catch {
    // Silently fail - tracking should never break the site
  }
}

export async function getAnalyticsData(): Promise<{
  messageTotal: number;
  recentMessages: MessageRecord[];
  repoClickTotal: number;
  repoClicks: Record<string, number>;
} | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const ref = doc(db, COLLECTION, ANALYTICS_DOC);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as AnalyticsDoc;
    const messages = data.messages;
    const repoClicks = data.repoClicks;

    return {
      messageTotal: messages?.total ?? 0,
      recentMessages: (messages?.recent ?? []).slice(0, 20),
      repoClickTotal: repoClicks?.total ?? 0,
      repoClicks: repoClicks?.byRepo ?? {},
    };
  } catch {
    return null;
  }
}