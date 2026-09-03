const AUTH_KEY = "portfolio-admin-auth";

export function checkAdminPassword(password: string): boolean {
  const expected = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
  if (!expected) return false;
  return password === expected;
}

export function isAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(AUTH_KEY) === "1";
  } catch {
    return false;
  }
}

export function setAdminAuthenticated(value: boolean): void {
  try {
    if (value) {
      localStorage.setItem(AUTH_KEY, "1");
    } else {
      localStorage.removeItem(AUTH_KEY);
    }
  } catch {
    // Ignore storage failures.
  }
}
