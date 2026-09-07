import { useEffect } from "react";
import {
  startSession,
  endSession,
  trackVisit,
} from "@/services/visitor-tracking";

export function useVisitorTracking() {
  useEffect(() => {
    startSession();
    trackVisit();

    const onHide = () => endSession();
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") endSession();
    };

    window.addEventListener("pagehide", onHide);
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", onHide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);
}