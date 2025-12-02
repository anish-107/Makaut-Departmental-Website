/** PublicOnlyRoutes.jsx
 * @author Anish
 * @description This file defines public only route
 * @date 2/12/2025
 * @returns routes
 */


import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Checking session…</p>
      </div>
    );
  }

  if (user) {
    // Already logged in → send them to the correct dashboard
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "teacher") return <Navigate to="/faculty" replace />;
    if (user.role === "student") return <Navigate to="/student" replace />;
    return <Navigate to="/" replace />;
  }

  // Not logged in → show login page
  return children;
}
