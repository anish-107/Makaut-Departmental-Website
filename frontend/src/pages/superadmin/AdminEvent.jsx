/** AdminEvent.jsx
 * @author Anish
 * @description This is the jsx file for Admin Panel Events
 * @date 2-12-2025
 * @returns a JSX Layout
 */

import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, X, CalendarDays } from "lucide-react";
import { getAccessCsrfToken } from "@/utils/csrf";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function AdminEvent() {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastDate, setLastDate] = useState("");

  // delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // -----------------------------
  // FETCH ALL EVENTS
  // -----------------------------
  async function loadEvents() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/event/all`);
      const data = await res.json();
      setEvents(data || []);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  // -----------------------------
  // OPEN ADD MODAL
  // -----------------------------
  function openAddModal() {
    setEditMode(false);
    setSelectedId(null);
    setTitle("");
    setContent("");
    setLastDate("");
    setModalOpen(true);
  }

  // -----------------------------
  // OPEN EDIT MODAL
  // -----------------------------
  function openEditModal(item) {
    setEditMode(true);
    setSelectedId(item.event_id);
    setTitle(item.title || "");
    setContent(item.content || "");
    // assume backend returns a full datetime string; keep only date part for date input
    const datePart = item.last_date ? String(item.last_date).slice(0, 10) : "";
    setLastDate(datePart);
    setModalOpen(true);
  }

  // -----------------------------
  // ADD / UPDATE EVENT
  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const csrf = getAccessCsrfToken();
    const payload = {
      title,
      content,
      last_date: lastDate || undefined, // backend will default if missing
      posted_by: user?.login_id,
    };

    try {
      if (editMode) {
        await fetch(`${API_BASE_URL}/event/update/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE_URL}/event/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      }

      setModalOpen(false);
      loadEvents();
    } catch (err) {
      console.error("Failed to save event", err);
    }
  }

  // -----------------------------
  // DELETE EVENT
  // -----------------------------
  async function confirmDelete() {
    const csrf = getAccessCsrfToken();

    try {
      await fetch(`${API_BASE_URL}/event/delete/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf,
        },
        credentials: "include",
      });

      setDeleteId(null);
      loadEvents();
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  // ==================================================================
  // UI
  // ==================================================================
  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-grey-600">Manage Events</h2>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r 
                     from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                     px-4 py-2 text-white font-medium shadow-lg shadow-cyan-500/25 
                     hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-[#0b1220]/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
        <table className="w-full text-sm text-left text-slate-200">
          <thead className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-b border-white/20">
            <tr>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Title
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Content
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Last Date
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Posted By
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-slate-400 italic"
                >
                  Loading events...
                </td>
              </tr>
            )}

            {!loading && events.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-slate-400 italic"
                >
                  No events found.
                </td>
              </tr>
            )}

            {events.map((item, idx) => (
              <tr
                key={item.event_id}
                className={`transition-all ${
                  idx % 2 === 0 ? "bg-white/5" : "bg-white/10"
                } hover:bg-cyan-500/20`}
              >
                <td className="px-5 py-4 text-[15px]">{item.title}</td>
                <td className="px-5 py-4 text-[15px] max-w-md truncate">
                  {item.content}
                </td>
                <td className="px-5 py-4 flex items-center gap-2 whitespace-nowrap">
                  <CalendarDays className="w-4 h-4 text-cyan-300" />

                  <span>
                    {item.last_date
                      ? new Date(item.last_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </span>
                </td>


                <td className="px-5 py-4">{item.posted_by}</td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-4">
                    {/* EDIT */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-cyan-300 hover:text-cyan-400 hover:scale-110 transition-transform duration-150"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setDeleteId(item.event_id)}
                      className="text-red-400 hover:text-red-500 hover:scale-110 transition-transform duration-150"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ========================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ========================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0d1d35] border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-semibold text-white mb-4">
              {editMode ? "Edit Event" : "Add Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* TITLE */}
              <div>
                <label className="text-slate-300 text-sm">Title</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* CONTENT */}
              <div>
                <label className="text-slate-300 text-sm">Content</label>
                <textarea
                  rows="4"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              {/* LAST DATE (OPTIONAL) */}
              <div>
                <label className="text-slate-300 text-sm">
                  Last Date{" "}
                  <span className="text-slate-500 text-xs">(optional)</span>
                </label>
                <input
                  type="date"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={lastDate}
                  onChange={(e) => setLastDate(e.target.value)}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 
                           hover:from-cyan-400 hover:to-blue-400 text-white py-2 text-lg font-medium
                           shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 
                           transition-all duration-300 hover:scale-[1.03]"
              >
                {editMode ? "Save Changes" : "Add Event"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* DELETE CONFIRMATION */}
      {/* ========================================================= */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#0d1d35] border border-white/10 rounded-xl p-6 w-full max-w-sm shadow-xl text-center">
            <h3 className="text-white text-lg font-semibold mb-2">
              Delete Event?
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-600 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
