/** Login.jsx - Improved UI */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function Login() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();
  const { setUser } = useAuth();

  function redirectByRole(role) {
    switch (role) {
      case "admin":
        navigate("/admin", { replace: true });
        break;
      case "teacher":
        navigate("/faculty", { replace: true });
        break;
      case "student":
        navigate("/student", { replace: true });
        break;
      default:
        navigate("/", { replace: true });
    }
  }

  function guessRoleFromId(id) {
    if (id.length < 2) return null;
    const prefix = id.slice(0, 2);
    if (prefix === "65") return "Admin";
    if (prefix === "70") return "Teacher";
    if (prefix === "83") return "Student";
    return null;
  }

  const guessedRole = guessRoleFromId(loginId);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!loginId.trim() || !password.trim()) {
      setError("Both login ID and password are required.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          login_id: loginId.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Invalid credentials.");
        return;
      }

      const user = data?.user;
      if (!user?.role) {
        setError("Login succeeded but role missing.");
        return;
      }

      setUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      redirectByRole(user.role);
    } catch (err) {
      console.error(err);
      setError("Unable to reach server. Check API.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center 
        bg-gradient-to-br from-[#dbe7f0] via-[#cfe6ff] to-[#d2f1ff] p-6">

      {/* Glass Card */}
      <div className="w-full max-w-md 
        backdrop-blur-xl bg-white/70 
        border border-white/40 shadow-xl 
        rounded-3xl p-8">

        {/* Header */}
        <div className="text-center mb-7">
          <h1 className="text-3xl font-semibold text-[#0f1c2c]">Welcome Back</h1>
          <p className="text-sm text-slate-600 mt-1">
            Login to access your department dashboard
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-300 bg-red-100 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Login ID */}
          <div>
            <label className="block text-sm font-medium text-[#0f1c2c] mb-1">
              Login ID
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="e.g. 65000001, 70000001"
              className="w-full rounded-lg border border-slate-300 
              bg-white/80 px-4 py-2.5 text-sm shadow-sm 
              focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              autoComplete="username"
            />

            {/* Role Hint */}
            <div className="mt-1 text-xs text-slate-600">
              Prefix decides role: 
              <span className="font-semibold"> 65 = Admin</span>, 
              <span className="font-semibold"> 70 = Teacher</span>, 
              <span className="font-semibold"> 83 = Student</span>
            </div>

            {guessedRole && (
              <div className="mt-1 text-xs font-semibold text-emerald-600">
                ✔ Detected Role: {guessedRole}
              </div>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#0f1c2c] mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border border-slate-300 
              bg-white/80 px-4 py-2.5 text-sm shadow-sm
              focus:ring-2 focus:ring-cyan-500 focus:outline-none"
              autoComplete="current-password"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-600 text-white 
            py-2.5 text-sm font-semibold shadow-md 
            hover:bg-cyan-700 transition disabled:opacity-60"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-5 text-center text-xs text-slate-600">
          Forgot your ID or password? Contact the department admin.
        </p>
      </div>
    </div>
  );
}
