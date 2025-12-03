/** AdminSchedule.jsx
 * @author Anish
 * @description Admin panel page for managing image-based Schedules (upload + CRUD)
 * @date 03-12-2025
 * @returns a JSX Layout
 */

import React, { useEffect, useState } from "react";
import {
  PlusCircle,
  Pencil,
  Trash2,
  X,
  CalendarClock,
  MapPin,
  BookOpen,
} from "lucide-react";
import { getAccessCsrfToken } from "@/utils/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function AdminSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const [deleteId, setDeleteId] = useState(null);

  // form fields
  const [programId, setProgramId] = useState("");
  const [semester, setSemester] = useState("");
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  // programs for dropdown
  const [programs, setPrograms] = useState([]);
  const [metaLoading, setMetaLoading] = useState(true);

  // -----------------------------
  async function loadSchedules() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/schedule/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setSchedules(data || []);
    } catch (err) {
      console.error("Failed to fetch schedules", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadPrograms() {
    try {
      setMetaLoading(true);
      const res = await fetch(`${API_BASE_URL}/programs/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setPrograms(data || []);
    } catch (err) {
      console.error("Failed to fetch programs", err);
    } finally {
      setMetaLoading(false);
    }
  }

  useEffect(() => {
    loadSchedules();
    loadPrograms();
  }, []);

  // -----------------------------
  function openAddModal() {
    setEditMode(false);
    setSelectedId(null);
    setProgramId("");
    setSemester("");
    setTitle("");
    setFile(null);
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditMode(true);
    setSelectedId(item.schedule_id);
    setProgramId(item.program_id ? String(item.program_id) : "");
    setSemester(item.semester ? String(item.semester) : "");
    setTitle(item.title || "");
    setFile(null);
    setModalOpen(true);
  }

  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    if (!programId || !semester) {
      alert("Program and semester are required");
      return;
    }

    let imageUrl = null;

    // Upload file if provided (required for add; optional for edit)
    if (file) {
      const fd = new FormData();
      fd.append("file", file);

      try {
        const csrf = getAccessCsrfToken(); // safe even if upload route doesn't require it
        const upRes = await fetch(`${API_BASE_URL}/upload/schedule-image`, {
          method: "POST",
          credentials: "include",
          headers: csrf ? { "X-CSRF-TOKEN": csrf } : undefined,
          body: fd,
        });

        // Try to parse JSON safely, fallback to text
        let upData;
        try {
          upData = await upRes.json();
        } catch {
          const text = await upRes.text().catch(() => "");
          upData = { error: text || `Upload failed with status ${upRes.status}` };
        }

        if (!upRes.ok) {
          console.error("Upload failed:", upRes.status, upData);
          alert(upData?.error || `Image upload failed (status ${upRes.status})`);
          return;
        }

        imageUrl = upData.image_url;
        if (!imageUrl) {
          console.error("Upload succeeded but no image_url returned:", upData);
          alert("Upload returned no image URL.");
          return;
        }
      } catch (err) {
        console.error("Upload failed (network):", err);
        alert("Upload failed due to network error.");
        return;
      }
    }

    // create / update schedule entry
    const payload = {
      program_id: Number(programId),
      semester: Number(semester),
      title: title || "",
    };
    if (imageUrl) payload.image_url = imageUrl;

    const csrf = getAccessCsrfToken();

    try {
      if (editMode) {
        await fetch(`${API_BASE_URL}/schedule/update/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE_URL}/schedule/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify({ ...payload, image_url: imageUrl }),
        });
      }
      setModalOpen(false);
      loadSchedules();
    } catch (err) {
      console.error("Failed to save schedule", err);
      alert("Failed to save schedule");
    }
  }

  // -----------------------------
  async function confirmDelete() {
    const csrf = getAccessCsrfToken();
    try {
      await fetch(`${API_BASE_URL}/schedule/delete/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf,
        },
        credentials: "include",
      });
      setDeleteId(null);
      loadSchedules();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Delete failed");
    }
  }

  // -----------------------------
  function imageSrc(url) {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url}`;
  }

  // ==================================================================
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-grey-600 flex items-center gap-2">
          <CalendarClock className="w-6 h-6 text-cyan-400" />
          Manage Schedules
        </h2>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r 
                     from-cyan-500 to-blue-500 px-4 py-2 text-white font-medium shadow-lg"
        >
          <PlusCircle className="w-5 h-5" />
          Add Schedule
        </button>
      </div>

      <div className="bg-[#0b1220]/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl p-4">
        {loading ? (
          <div className="text-slate-400 p-8 text-center">Loading schedules...</div>
        ) : schedules.length === 0 ? (
          <div className="text-slate-400 p-8 text-center">No schedules yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((s) => (
              <div key={s.schedule_id} className="rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900 to-slate-800 shadow-lg">
                <img
                  src={imageSrc(s.image_url)}
                  alt={s.title || "Schedule"}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs text-slate-300 font-mono">{s.program_code ? `${s.program_code}` : `Program ${s.program_id}`}</div>
                      <h3 className="text-lg font-semibold text-white">{s.title || "Schedule"}</h3>
                      <div className="text-xs text-slate-400 mt-1">Semester: {s.semester}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(s)} className="text-cyan-300 p-2">
                        <Pencil className="w-5 h-5" />
                      </button>
                      <button onClick={() => setDeleteId(s.schedule_id)} className="text-red-400 p-2">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#0d1d35] rounded-xl p-6 w-full max-w-2xl border border-white/10">
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-slate-400"><X /></button>
            <h3 className="text-lg text-white font-semibold mb-4">{editMode ? "Edit Schedule" : "Add Schedule"}</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 text-sm">Program</label>
                  <select value={programId} onChange={(e) => setProgramId(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white">
                    <option value="">Select program</option>
                    {metaLoading ? <option disabled>Loading programs...</option> : programs.map((p) => <option key={p.program_id} value={p.program_id}>{p.code ? `${p.code} — ${p.name}` : p.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 text-sm">Semester</label>
                  <input type="number" value={semester} onChange={(e) => setSemester(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white" />
                </div>
              </div>

              <div>
                <label className="text-slate-300 text-sm">Title (optional)</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 text-white" />
              </div>

              <div>
                <label className="text-slate-300 text-sm">Schedule Image {editMode ? "(leave blank to keep existing)" : "*"}</label>
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mt-1 text-sm text-slate-300" />
              </div>

              <div className="flex gap-2">
                <button type="submit" className="rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-white font-medium">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="rounded-lg bg-white/5 px-4 py-2 text-white">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/60 z-60 flex items-center justify-center">
          <div className="bg-[#0d1d35] rounded-xl p-6 max-w-sm border border-white/10 text-center">
            <h3 className="text-white font-semibold mb-2">Delete schedule?</h3>
            <p className="text-slate-400 mb-4">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-lg bg-white/5 text-white">Cancel</button>
              <button onClick={confirmDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
