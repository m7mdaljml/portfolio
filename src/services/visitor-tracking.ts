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
const VISITORS_DOC = "visitors";

export interface VisitRecord {
  timestamp: string;
  path: string;
  referrer: string;
}

export interface VisitorData {
  firstVisit: string;
  lastVisit: string;
  visits: VisitRecord[];
}

export interface VisitorsDoc {
  visitors: Record<string, VisitorData>;
  summary: {
    totalUniqueVisitors: number;
    totalVisits: number;
    lastUpdated: FieldValue;
  };
}

function generateFingerprint(): string {
  const components = [
    navigator.userAgent,
    screen.width + "x" + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.language,
    navigator.hardwareConcurrency,
    navigator.maxTouchPoints,
  ];
  const raw = components.join("|||");
  return raw;
}

async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export async function trackVisit(): Promise<void> {
  if (!isFirebaseConfigured()) return;

  const db = getDb();
  if (!db) return;

  try {
    const fingerprint = await hashString(generateFingerprint());
    const now = new Date().toISOString();
    const path = window.location.pathname;
    const referrer = document.referrer || "";

    const visit: VisitRecord = { timestamp: now, path, referrer };
    const ref = doc(db, COLLECTION, VISITORS_DOC);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const doc: VisitorsDoc = {
        visitors: {
          [fingerprint]: {
            firstVisit: now,
            lastVisit: now,
            visits: [visit],
          },
        },
        summary: {
          totalUniqueVisitors: 1,
          totalVisits: 1,
          lastUpdated: serverTimestamp(),
        },
      };
      await setDoc(ref, doc);
      return;
    }

    const data = snap.data() as VisitorsDoc;
    const existing = data.visitors?.[fingerprint];

    if (existing) {
      await setDoc(
        ref,
        {
          visitors: {
            [fingerprint]: {
              lastVisit: now,
              visits: arrayUnion(visit) as unknown as FieldValue,
            },
          },
          summary: {
            totalVisits: increment(1),
            lastUpdated: serverTimestamp(),
          },
        },
        { merge: true },
      );
    } else {
      await setDoc(
        ref,
        {
          visitors: {
            [fingerprint]: {
              firstVisit: now,
              lastVisit: now,
              visits: [visit],
            },
          },
          summary: {
            totalUniqueVisitors: increment(1),
            totalVisits: increment(1),
            lastUpdated: serverTimestamp(),
          },
        },
        { merge: true },
      );
    }
  } catch {
    // Silently fail — tracking should never break the site
  }
}

export async function getVisitorStats(): Promise<{
  totalUniqueVisitors: number;
  totalVisits: number;
  recentVisits: (VisitRecord & { fingerprint: string })[];
  dailyVisits: Record<string, number>;
} | null> {
  const db = getDb();
  if (!db) return null;

  try {
    const ref = doc(db, COLLECTION, VISITORS_DOC);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data() as VisitorsDoc;
    const summary = data.summary;
    const visitors = data.visitors || {};

    const allVisits: (VisitRecord & { fingerprint: string })[] = [];
    const dailyVisits: Record<string, number> = {};

    for (const [fp, v] of Object.entries(visitors)) {
      for (const visit of v.visits || []) {
        allVisits.push({ ...visit, fingerprint: fp });
        const day = visit.timestamp.slice(0, 10);
        dailyVisits[day] = (dailyVisits[day] || 0) + 1;
      }
    }

    allVisits.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    return {
      totalUniqueVisitors: summary.totalUniqueVisitors,
      totalVisits: summary.totalVisits,
      recentVisits: allVisits.slice(0, 20),
      dailyVisits,
    };
  } catch {
    return null;
  }
}
