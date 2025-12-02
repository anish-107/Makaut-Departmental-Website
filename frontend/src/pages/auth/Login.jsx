/** Login.jsx
 * @author Anish
 * @description This is the login page
 * @date 2/12/2025
 * @returns a jsx page
 */


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "";

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
        break;
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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        body: JSON.stringify({
          login_id: loginId.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data?.error || "Login failed. Please check your credentials.");
        return;
      }

      const user = data?.user;
      if (!user || !user.role) {
        setError("Login succeeded but role is missing in response.");
        return;
      }

      setUser(user);
      localStorage.setItem("currentUser", JSON.stringify(user));
      redirectByRole(user.role);
    } catch (err) {
      console.error(err);
      setError("Unable to reach server. Check API URL or network.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-slate-200 p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Department Login
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Single login for Admin, Teacher and Student.
            <br />
            Role is auto-detected from your ID.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Login ID
            </label>
            <input
              type="text"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="e.g. 65000001, 70000001, 83000001"
              autoComplete="username"
            />
            <p className="mt-1 text-xs text-slate-500">
              Prefix decides role:
              <br />
              <span className="font-medium">65</span> → Admin,&nbsp;
              <span className="font-medium">70</span> → Teacher,&nbsp;
              <span className="font-medium">83</span> → Student
            </p>
            {guessedRole && (
              <p className="mt-1 text-xs text-emerald-600">
                Detected role:{" "}
                <span className="font-semibold">{guessedRole}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex justify-center items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500">
            Forgot your ID or password? Contact the department admin.
          </p>
        </div>
      </div>
    </div>
  );
}
