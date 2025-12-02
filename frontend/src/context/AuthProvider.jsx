/** AuthProvider.jsx 
 * @author Anish
 * @description This file returns the Auth Context Component
 * @date 2/12/2025
 * @returns a JSX component for providing authorization
*/


import { useEffect, useState } from "react";
import { AuthContext } from "./auth-context";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchMe() {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

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

    return () => {
      cancelled = true;
    };
  }, []);

  const value = { user, setUser, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
