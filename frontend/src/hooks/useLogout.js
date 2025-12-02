/** useLogout.js
 * @author Anish
 * @description This is the Logout Hook
 * @date 2/12/2025
 * @returns logout context
 */

import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getRefreshCsrfToken } from "@/utils/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

export function useLogout() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    try {
      const csrf = getRefreshCsrfToken();

      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: csrf
          ? {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": csrf,
            }
          : {
              "Content-Type": "application/json",
            },
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout failed (will still clear client state):", err);
    } finally {
      // Clear client state regardless of API result
      setUser(null);
      localStorage.removeItem("currentUser");
      navigate("/", { replace: true });
    }
  }, [setUser, navigate]);

  return logout;
}
