import { useEffect, useState } from "react";

const STORAGE_KEY = "portfolio-last-email-sent";
const COOLDOWN_MS = 2 * 60 * 1000;

export function getRemainingCooldown(): number {
  if (typeof window === "undefined") return 0;
  const last = localStorage.getItem(STORAGE_KEY);
  if (!last) return 0;
  const remaining = COOLDOWN_MS - (Date.now() - Number(last));
  return remaining > 0 ? remaining : 0;
}

export function recordEmailSent(): void {
  localStorage.setItem(STORAGE_KEY, String(Date.now()));
}

export function formatCooldown(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
}

export function formatTimer(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function useEmailCooldown(): number {
  const [remaining, setRemaining] = useState<number>(getRemainingCooldown);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemainingCooldown());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return remaining;
}
