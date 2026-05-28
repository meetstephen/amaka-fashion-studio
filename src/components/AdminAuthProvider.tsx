"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AdminAuthState {
  /** True only after a successful /api/admin/me check. */
  authenticated: boolean;
  /** True while the initial /api/admin/me request is in flight. */
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuthState>({
  authenticated: false,
  loading: true,
});

/**
 * Provides server-verified admin auth state to client components.
 *
 * Renders children immediately and resolves auth in the background
 * by calling /api/admin/me once on mount. Components such as the
 * EditPencil and AdminEditOverlay rely on this so localStorage flags
 * alone cannot reveal admin UI to spoofing visitors.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AdminAuthState>({
    authenticated: false,
    loading: true,
  });

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/me", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((d) => {
        if (cancelled) return;
        setState({ authenticated: Boolean(d?.authenticated), loading: false });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ authenticated: false, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AdminAuthContext.Provider value={state}>
      {children}
    </AdminAuthContext.Provider>
  );
}

/** Hook for reading server-verified admin auth state. */
export function useAdminAuth(): AdminAuthState {
  return useContext(AdminAuthContext);
}
