import { useEffect } from "react";
import { trackVisit } from "@/services/visitor-tracking";

export function useVisitorTracking() {
  useEffect(() => {
    trackVisit();
  }, []);
}
