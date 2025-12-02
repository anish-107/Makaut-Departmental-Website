/** ProtectedRoute.jsx
 * @author Anish
 * @description This route protects the user from accessing unauthorized routes
 * @date 2/12/2025
 * @return nothing 
 */


import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-slate-500">Checking session...</p>
      </div>
    );
  }

  // Not logged in → go to home "/"
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Logged in but role not allowed → also go to "/"
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // All good
  return children;
}
