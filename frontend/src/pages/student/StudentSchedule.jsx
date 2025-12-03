/** StudentSchedule.jsx
 * Student view: show schedules for logged-in student's program & semester
 * Adds a Download button for each schedule image.
 */

import React, { useEffect, useState } from "react";
import { CalendarClock, AlertCircle, Download } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function StudentSchedule() {
  const { user, loading: authLoading } = useAuth();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!user || user.role !== "student") {
        setSchedules([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/schedule/by-program?program_id=${user.program_id}&semester=${user.semester}`,
          {
            credentials: "include",
          }
        );
        const data = await res.json().catch(() => []);
        setSchedules(data || []);
      } catch (err) {
        console.error("Failed to load schedules", err);
        setSchedules([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  function imageSrc(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  }

  function filenameFromUrl(url) {
    try {
      const parts = url.split("/");
      return parts[parts.length - 1] || "schedule-image";
    } catch {
      return "schedule-image";
    }
  }

  if (authLoading || loading) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-cyan-400" />
          Schedule
        </h2>
        <div className="bg-[#0b1220]/80 rounded-xl p-6 animate-pulse" />
      </div>
    );
  }

  if (!user || user.role !== "student") {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-cyan-400" />
          Schedule
        </h2>
        <div className="rounded-xl border border-red-600 bg-red-900/80 p-4 text-red-50 flex items-center gap-2">
          <AlertCircle />
          <div>You must be logged in as a student to view schedules.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-semibold text-white flex items-center gap-2">
            <CalendarClock className="w-6 h-6 text-cyan-400" />
            Your Schedule
          </h2>
          <p className="text-xs text-slate-400">
            Showing schedule for your program and semester.
          </p>
        </div>

        <Link
          to="/student/profile"
          className="hidden sm:inline-flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-xs text-slate-100"
        >
          View Profile
        </Link>
      </div>

      {schedules.length === 0 ? (
        <div className="bg-[#020617]/90 rounded-xl border border-white/10 p-6 text-slate-300">
          <p className="font-medium text-white">
            No schedules found for your program / semester.
          </p>
          <p className="text-sm text-slate-400">
            Wait for admin to upload schedule images.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {schedules.map((s) => (
            <div
              key={s.schedule_id}
              className="rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg"
            >
              <img
                src={imageSrc(s.image_url)}
                alt={s.title || "Schedule"}
                className="w-full object-cover max-h-72"
              />
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-slate-300 font-mono">
                      {s.program_code || `Program ${s.program_id}`}
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      {s.title || "Schedule"}
                    </h3>
                    <div className="text-xs text-slate-400 mt-1">
                      Semester: {s.semester}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Uploaded by: {s.uploaded_by}
                    </div>
                  </div>

                  {/* Download button */}
                  <div className="flex-shrink-0 self-start">
                    <a
                      href={imageSrc(s.image_url)}
                      download={filenameFromUrl(s.image_url)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-2 text-xs text-white hover:bg-white/10 transition"
                      title="Download schedule image"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Download</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
