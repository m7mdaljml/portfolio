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

const SESSION_START_KEY = "portfolio-session-start";
const PENDING_DURATION_KEY = "portfolio-pending-duration";

export interface VisitRecord {
  timestamp: string;
  path: string;
  referrer: string;
}

export interface VisitorData {
  firstVisit: string;
  lastVisit: string;
  visits: VisitRecord[];
  totalTimeMs?: number;
  sessions?: number;
}

export interface VisitorsDoc {
  visitors: Record<string, VisitorData>;
  summary: {
    totalUniqueVisitors: number;
    totalVisits: number;
    totalTimeMs?: number;
    trackedSessions?: number;
    lastUpdated: FieldValue;
  };
}

/** Record the start of the current browsing session for time-on-site tracking. */
export function startSession(): void {
  try {
    if (!sessionStorage.getItem(SESSION_START_KEY)) {
      sessionStorage.setItem(SESSION_START_KEY, String(Date.now()));
    }
  } catch {
    // Ignore storage failures.
  }
}

/** End the current session and stash the elapsed time to be flushed on next load. */
export function endSession(): void {
  try {
    const start = Number(sessionStorage.getItem(SESSION_START_KEY));
    sessionStorage.removeItem(SESSION_START_KEY);
    if (!start) return;
    const duration = Math.max(0, Date.now() - start);
    if (duration > 0) {
      localStorage.setItem(PENDING_DURATION_KEY, String(duration));
    }
  } catch {
    // Ignore storage failures.
  }
}

function consumePendingDuration(): number {
  try {
    const raw = localStorage.getItem(PENDING_DURATION_KEY);
    if (!raw) return 0;
    localStorage.removeItem(PENDING_DURATION_KEY);
    const value = Number(raw);
    return Number.isFinite(value) && value > 0 ? Math.round(value) : 0;
  } catch {
    return 0;
  }
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
    const pendingTime = consumePendingDuration();
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
            totalTimeMs: pendingTime,
            sessions: pendingTime > 0 ? 1 : 0,
          },
        },
        summary: {
          totalUniqueVisitors: 1,
          totalVisits: 1,
          totalTimeMs: pendingTime,
          trackedSessions: pendingTime > 0 ? 1 : 0,
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
              totalTimeMs: increment(pendingTime) as unknown as FieldValue,
              sessions: increment(pendingTime > 0 ? 1 : 0) as unknown as FieldValue,
            },
          },
          summary: {
            totalVisits: increment(1) as unknown as FieldValue,
            totalTimeMs: increment(pendingTime) as unknown as FieldValue,
            trackedSessions: increment(pendingTime > 0 ? 1 : 0) as unknown as FieldValue,
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
              totalTimeMs: pendingTime,
              sessions: pendingTime > 0 ? 1 : 0,
            },
          },
          summary: {
            totalUniqueVisitors: increment(1) as unknown as FieldValue,
            totalVisits: increment(1) as unknown as FieldValue,
            totalTimeMs: increment(pendingTime) as unknown as FieldValue,
            trackedSessions: increment(pendingTime > 0 ? 1 : 0) as unknown as FieldValue,
            lastUpdated: serverTimestamp(),
          },
        },
        { merge: true },
      );
    }
  } catch {
    // Silently fail - tracking should never break the site
  }
}

export async function getVisitorStats(): Promise<{
  totalUniqueVisitors: number;
  totalVisits: number;
  totalTimeMs: number;
  avgTimeMs: number;
  recentVisits: (VisitRecord & { fingerprint: string })[];
  dailyVisits: Record<string, number>;
  visitorTimes: {
    fingerprint: string;
    totalTimeMs: number;
    sessions: number;
    totalVisits: number;
    lastVisit: string;
  }[];
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
    const visitorTimes: {
      fingerprint: string;
      totalTimeMs: number;
      sessions: number;
      totalVisits: number;
      lastVisit: string;
    }[] = [];

    for (const [fp, v] of Object.entries(visitors)) {
      const visits = v.visits || [];
      for (const visit of visits) {
        allVisits.push({ ...visit, fingerprint: fp });
        const day = visit.timestamp.slice(0, 10);
        dailyVisits[day] = (dailyVisits[day] || 0) + 1;
      }
      visitorTimes.push({
        fingerprint: fp,
        totalTimeMs: v.totalTimeMs || 0,
        sessions: v.sessions || 0,
        totalVisits: visits.length,
        lastVisit: v.lastVisit,
      });
    }

    allVisits.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );

    visitorTimes.sort((a, b) => b.totalTimeMs - a.totalTimeMs);

    const totalTimeMs = summary.totalTimeMs || 0;
    const trackedSessions = summary.trackedSessions || 0;

    return {
      totalUniqueVisitors: summary.totalUniqueVisitors,
      totalVisits: summary.totalVisits,
      totalTimeMs,
      avgTimeMs: trackedSessions > 0 ? totalTimeMs / trackedSessions : 0,
      recentVisits: allVisits.slice(0, 20),
      dailyVisits,
      visitorTimes: visitorTimes.slice(0, 20),
    };
  } catch {
    return null;
  }
}
