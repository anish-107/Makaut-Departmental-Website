// src/pages/student/StudentEvent.jsx
/**
 * @description Student Events page - read only cards for all events
 */

import React, { useEffect, useState } from "react";
import {
  CalendarRange,
  CalendarClock,
  User,
} from "lucide-react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function StudentEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  // -----------------------------
  // Fetch all events
  // -----------------------------
  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/event/all`);
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch events", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // -----------------------------
  // Fetch teachers + students for posted_by -> name mapping
  // -----------------------------
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

  // -----------------------------
  // Map posted_by (login_id) -> name
  // -----------------------------
  function getPostedByName(loginId) {
    if (!loginId) return "Unknown";

    const prefix = loginId.toString().slice(0, 2);

    if (prefix === "70") {
      const t = teachers.find((x) => x.login_id === loginId);
      return t ? t.name : "Teacher";
    }

    if (prefix === "83") {
      const s = students.find((x) => x.login_id === loginId);
      return s ? s.name : "Student";
    }

    if (prefix === "65") {
      return "Admin";
    }

    return "Unknown";
  }

  // date formatter (no time)
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

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 flex items-center gap-2">
          <CalendarRange className="w-6 h-6 text-cyan-400" />
          Events
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Upcoming and recent events organized by the department.
        </p>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="bg-[#0b1220]/80 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <p className="text-slate-300 text-sm animate-pulse">
            Loading events...
          </p>
        </div>
      ) : events.length === 0 ? (
        <div className="bg-[#0b1220]/80 border border-white/10 rounded-2xl p-6 shadow-2xl text-center">
          <p className="text-slate-300 text-sm">
            No events available right now.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => {
            const postedName = getPostedByName(event.posted_by);

            return (
              <article
                key={event.event_id}
                className="group rounded-2xl bg-gradient-to-b from-[#0b1220] via-[#020617] to-[#020617] border border-white/10 shadow-xl hover:shadow-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300"
              >
                {/* Top row */}
                <div className="flex items-center justify-between px-5 pt-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-cyan-600/20 px-3 py-1 text-[11px] font-medium text-cyan-100 border border-cyan-400/60">
                    <CalendarRange className="w-3 h-3" />
                    Event
                  </div>

                  {event.last_date && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-300">
                      <CalendarClock className="w-3 h-3 text-slate-400" />
                      <span>Last date: {formatDate(event.last_date)}</span>
                    </div>
                  )}
                </div>

                {/* Title & content */}
                <div className="px-5 pt-3 pb-4">
                  <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-cyan-100 line-clamp-2 mb-2">
                    {event.title || "Event"}
                  </h3>
                  <p className="text-xs md:text-sm text-slate-300 line-clamp-5">
                    {event.content || "No description provided for this event."}
                  </p>
                </div>

                {/* Footer: posted by */}
                <div className="px-5 pb-4 pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-300">
                    <User className="w-3 h-3 text-slate-400" />
                    Posted by:{" "}
                    <span className="font-medium text-slate-200">
                      {postedName}
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
