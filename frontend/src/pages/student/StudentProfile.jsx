/**
 * @author Anish
 * @description Simple student profile page: update own email/password (and optionally name)
 * @date 03-12-2025 (simplified)
 * @returns JSX Layout
 */

import React, { useEffect, useState } from "react";
import { User, Mail, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getAccessCsrfToken } from "@/utils/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function StudentProfile() {
  const { user, setUser, loading } = useAuth();

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // initialise form from auth user
  useEffect(() => {
    if (!user || user.role !== "student") return;
    setName(user.name || "");
    setEmail(user.email || "");
  }, [user]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!user || user.role !== "student" || !user.student_id) {
      setErrorMsg("Student information missing. Please re-login.");
      return;
    }

    // password checks (only if user is trying to change it)
    if (newPassword || confirmPassword) {
      if (!newPassword || !confirmPassword) {
        setErrorMsg("Please fill both new password and confirmation.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg("New password and confirmation do not match.");
        return;
      }
      if (newPassword.length < 6) {
        setErrorMsg("New password should be at least 6 characters.");
        return;
      }
    }

    const payload = {};
    if (name && name !== user.name) payload.name = name;
    if (email && email !== user.email) payload.email = email;
    if (newPassword) payload.password = newPassword;

    if (Object.keys(payload).length === 0) {
      setErrorMsg("No changes to save.");
      return;
    }

    const csrf = getAccessCsrfToken();

    try {
      setSaving(true);
      const res = await fetch(
        `${API_BASE_URL}/students/update/${user.student_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(
          data?.error ||
            data?.message ||
            `Failed to update profile (status ${res.status}).`
        );
        return;
      }

      // update global auth user (keep everything else same)
      const updated = {
        ...user,
        ...(payload.name ? { name: payload.name } : {}),
        ...(payload.email ? { email: payload.email } : {}),
      };
      setUser(updated);

      // clear password fields
      setNewPassword("");
      setConfirmPassword("");
      setSuccessMsg("Profile updated successfully.");
    } catch (err) {
      console.error("Update profile failed", err);
      setErrorMsg("Network error while updating profile.");
    } finally {
      setSaving(false);
    }
  }

  // --------------- RENDER ----------------

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-white flex items-center gap-2">
          Student Profile
        </h2>
        <div className="bg-[#0b1220]/80 border border-white/10 rounded-xl p-6 animate-pulse">
          <div className="h-6 w-40 bg-white/10 rounded mb-3" />
          <div className="h-4 w-24 bg-white/10 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-5 bg-white/10 rounded" />
            <div className="h-5 bg-white/10 rounded" />
            <div className="h-5 bg-white/10 rounded" />
            <div className="h-5 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "student") {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Student Profile
        </h2>
        <div className="bg-red-900/80 border border-red-500/60 rounded-xl p-6 text-red-50">
          <p className="font-medium">
            You are not logged in as a student, or no student record was found.
          </p>
        </div>
      </div>
    );
  }

  const initial = (user.name || user.login_id || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 font-semibold">
            {initial}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-6 h-6 text-cyan-400" />
              {user.name || "Student"}
            </h2>
            <p className="mt-1 text-xs text-grey-400 flex items-center gap-2">
              <Mail className="w-3 h-3" />
              {user.email}
            </p>
          </div>
        </div>
      </div>

      {/* ALERTS */}
      {errorMsg && (
        <div className="rounded-xl border border-red-500/70 bg-red-900/80 px-4 py-3 text-sm text-red-50 flex items-center justify-between shadow-lg shadow-red-500/40">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            <span>{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg("")}
            className="text-red-100 hover:text-white text-xs font-medium underline decoration-dotted"
          >
            Dismiss
          </button>
        </div>
      )}

      {successMsg && (
        <div className="rounded-xl border border-emerald-500/70 bg-emerald-900/80 px-4 py-3 text-sm text-emerald-50 flex items-center justify-between shadow-lg shadow-emerald-500/40">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg("")}
            className="text-emerald-100 hover:text-white text-xs font-medium underline decoration-dotted"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* UPDATE FORM */}
      <div className="bg-[#020617]/90 rounded-2xl border border-white/10 shadow-2xl p-6 md:p-7">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">
              Update Profile
            </h3>
            <p className="text-xs text-slate-400">
              Change your name, email and password.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-300 text-xs uppercase tracking-wide">
              Name
            </label>
            <div className="mt-1 w-full rounded-lg bg-black/30 border border-white/10 px-3 py-2 text-sm text-slate-400 cursor-not-allowed">
              {user.name}
            </div>
          </div>


          <div>
            <label className="text-slate-300 text-xs uppercase tracking-wide">
              Email
            </label>
            <input
              type="email"
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your.email@example.com"
            />
          </div>

          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-3" />

          <div>
            <label className="text-slate-300 text-xs uppercase tracking-wide">
              New Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
            />
          </div>

          <div>
            <label className="text-slate-300 text-xs uppercase tracking-wide">
              Confirm New Password
            </label>
            <input
              type="password"
              className="mt-1 w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:ring-2 focus:ring-cyan-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new password"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:hover:scale-100"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
