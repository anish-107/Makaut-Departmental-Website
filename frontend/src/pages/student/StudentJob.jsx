// src/pages/student/StudentJob.jsx
/**
 * @description Student Job Updates page with last_date and expired styling
 */

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Building2,
  CalendarClock,
  ExternalLink,
  ArrowRight,
  User,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function StudentJob() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // -------------------------------------------------------------
  // Load all jobs
  // -------------------------------------------------------------
  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/job/all`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  // -------------------------------------------------------------
  // Load teachers + students so we can map login_id → name
  // -------------------------------------------------------------
  useEffect(() => {
    async function loadPeople() {
      try {
        const t = await fetch(`${API_BASE_URL}/teachers/all`);
        const s = await fetch(`${API_BASE_URL}/students/all`);

        const tData = await t.json();
        const sData = await s.json();

        setTeachers(Array.isArray(tData) ? tData : []);
        setStudents(Array.isArray(sData) ? sData : []);
      } catch (err) {
        console.error("Failed to fetch people", err);
      }
    }

    loadPeople();
  }, []);

  // Map posted_by (login_id) → NAME (fallback: login_id)
  function getPostedByName(loginId) {
    if (!loginId) return "Unknown";

    const idStr = String(loginId);
    const prefix = idStr.slice(0, 2);

    if (prefix === "70") {
      const t = teachers.find((x) => String(x.login_id) === idStr);
      return t?.name || idStr;
    }

    if (prefix === "83") {
      const s = students.find((x) => String(x.login_id) === idStr);
      return s?.name || idStr;
    }

    if (prefix === "65") {
      // admin – still just show login id for now
      return idStr;
    }

    return idStr;
  }

  // Helpers
  function formatDate(value) {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  function isExpired(job) {
    if (!job.last_date) return false;
    const d = new Date(job.last_date);
    if (Number.isNaN(d.getTime())) return false;
    return d < today;
  }

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-cyan-400" />
          Job Updates
        </h2>
        <p className="mt-1 text-sm text-grey-400">
          Explore recent opportunities shared by the department. Older/expired
          jobs appear faded.
        </p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="bg-[#0b1220]/80 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <p className="text-slate-300 text-sm animate-pulse">
            Loading job updates...
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-[#0b1220]/80 border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
          <p className="text-slate-300 text-sm">
            No job updates available right now.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => {
            const postedName = getPostedByName(job.posted_by);
            const expired = isExpired(job);

            return (
              <article
                key={job.job_id}
                className={
                  "group rounded-2xl border shadow-xl transition-all duration-300 " +
                  (expired
                    ? "bg-[#020617]/80 border-white/5 text-slate-400 opacity-70 hover:opacity-80"
                    : "bg-gradient-to-b from-[#0b1220] via-[#020617] to-[#020617] border-white/10 hover:shadow-cyan-500/30 hover:border-cyan-400/60")
                }
              >
                {/* Top badge row */}
                <div className="flex items-center justify-between px-5 pt-4">
                  <div
                    className={
                      "inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium border " +
                      (expired
                        ? "bg-slate-700/40 text-slate-200 border-slate-400/50"
                        : "bg-cyan-600/20 text-cyan-100 border-cyan-400/60")
                    }
                  >
                    <Briefcase className="w-3 h-3" />
                    Job Opportunity
                  </div>

                  {job.last_date && (
                    <div className="flex flex-col items-end gap-0.5 text-[11px]">
                      <div className="flex items-center gap-1 text-slate-300">
                        <CalendarClock className="w-3 h-3 text-slate-400" />
                        <span>
                          Apply by:{" "}
                          <span className="font-medium">
                            {formatDate(job.last_date)}
                          </span>
                        </span>
                      </div>
                      {expired && (
                        <span className="text-[10px] text-red-300">
                          (Deadline passed)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Title & company */}
                <div className="px-5 pt-3">
                  <h3
                    className={
                      "text-base md:text-lg font-semibold line-clamp-2 " +
                      (expired
                        ? "text-slate-200"
                        : "text-white group-hover:text-cyan-100")
                    }
                  >
                    {job.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-300">
                    <Building2 className="w-3 h-3 text-cyan-300" />
                    <span className="truncate">{job.company}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="px-5 pt-3 pb-4">
                  <p className="text-xs md:text-sm text-slate-300 line-clamp-4">
                    {job.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="px-5 pb-4 pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <User className="w-3 h-3 text-slate-400" />
                    Posted by:{" "}
                    <span className="font-medium text-slate-200">
                      {postedName}
                    </span>
                  </div>

                  {job.apply_link && !expired ? (
                    <a
                      href={job.apply_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 text-[11px] font-medium text-white shadow-md shadow-cyan-500/30 hover:from-cyan-400 hover:to-blue-400 hover:shadow-cyan-500/50 transition-all duration-300"
                    >
                      Apply <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <button
                      disabled
                      className="inline-flex items-center gap-1 rounded-full bg-slate-700/60 px-3 py-1.5 text-[11px] font-medium text-slate-200 cursor-not-allowed"
                    >
                      <ArrowRight className="w-3 h-3" />
                      {expired ? "Closed" : "No link"}
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
