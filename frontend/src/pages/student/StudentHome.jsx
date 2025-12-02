/**
 * @author Anish
 * @description Student Home page – simple profile card view-only
 * @date 02-12-2025
 * @returns a JSX Layout
 */

import React from "react";
import { User, Mail, IdCard, Hash, BadgeInfo } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function StudentHome() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Student Home
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

  if (!user) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          Student Home
        </h2>
        <div className="bg-[#0b1220]/80 border border-red-400/40 rounded-xl p-6 text-red-100">
          <p className="font-medium">
            You are not logged in, or no student record was found.
          </p>
        </div>
      </div>
    );
  }

  const {
    login_id,
    name,
    email,
    roll_no,
    semester,
    program_id,
    student_id,
    role,
  } = user;

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center gap-2">
          Student Home
        </h2>
      </div>

      {/* PROFILE CARD */}
      <div className="bg-[#0b1220]/80 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl p-6 md:p-8">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/40 to-blue-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-semibold text-white">
                {name || "Student"}
              </h3>
              <p className="text-slate-300 text-sm mt-1">
                {email || "No email available"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {login_id && (
              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-600/20 border border-cyan-400/60 px-3 py-1 text-xs font-mono text-cyan-100">
                <IdCard className="w-4 h-4" />
                {login_id}
              </span>
            )}

            {typeof student_id !== "undefined" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-600/20 border border-indigo-400/60 px-3 py-1 text-xs font-mono text-indigo-100">
                <Hash className="w-4 h-4" />
                ID: {student_id}
              </span>
            )}

            {role && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600/20 border border-emerald-400/60 px-3 py-1 text-xs font-semibold text-emerald-100">
                <BadgeInfo className="w-4 h-4" />
                {role.toUpperCase()}
              </span>
            )}
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Roll No */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
              Roll Number
            </p>
            <p className="text-sm md:text-base font-medium text-white">
              {roll_no || "Not set"}
            </p>
          </div>

          {/* Semester */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
              Semester
            </p>
            <p className="text-sm md:text-base font-medium text-white">
              {typeof semester === "number" || semester
                ? `Semester ${semester}`
                : "Not set"}
            </p>
          </div>

          {/* Program ID – raw for now */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
              Program ID
            </p>
            <p className="text-sm md:text-base font-medium text-white">
              {program_id ?? "Not set"}
            </p>
          </div>

          {/* Email duplicate (more visible) */}
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-3">
            <Mail className="w-5 h-5 text-cyan-300" />
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">
                Email
              </p>
              <p className="text-sm md:text-base font-medium text-white break-all">
                {email || "Not set"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
