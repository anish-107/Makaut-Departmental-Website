// AuthProvider.jsx
import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";
import { getRefreshCsrfToken } from "@/utils/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMe() {
      try {
        if (!cancelled) setLoading(true);

        // first attempt
        let res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        // if access token expired or missing -> try to refresh (POST /auth/refresh)
        if (res.status === 401) {
          try {
            const csrf = getRefreshCsrfToken();
            const refreshHeaders = csrf
              ? { "Content-Type": "application/json", "X-CSRF-TOKEN": csrf }
              : { "Content-Type": "application/json" };

            const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh`, {
              method: "POST",
              credentials: "include",
              headers: refreshHeaders,
            });

            if (refreshRes.ok) {
              // retry /auth/me once
              res = await fetch(`${API_BASE_URL}/auth/me`, {
                method: "GET",
                credentials: "include",
              });
            } else {
              // refresh failed -> treat as logged out
              if (!cancelled) setUser(null);
              return;
            }
          } catch (err) {
            console.error("Refresh failed:", err);
            if (!cancelled) setUser(null);
            return;
          }
        }

        if (!res.ok) {
          if (!cancelled) setUser(null);
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          setUser(data?.user || null);
        }
      } catch (err) {
        console.error("Failed to fetch /auth/me", err);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMe();

    // re-check every 5 minutes (optional) to keep UI synced — you can remove this if unwanted
    const interval = setInterval(fetchMe, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  const value = { user, setUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
