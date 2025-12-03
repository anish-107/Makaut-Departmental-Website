/**
 * AdminProgram.jsx
 * @author Anish (converted)
 * @description Admin Programs management page — list, add, delete (and attempt update when available)
 * @date 03-12-2025
 */

import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, X, ExternalLink } from "lucide-react";
import { getAccessCsrfToken } from "@/utils/csrf";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function AdminProgram() {
  useAuth();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // form fields for program
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [duration, setDuration] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");

  // delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // feedback
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // -----------------------------
  // FETCH ALL PROGRAMS
  // -----------------------------
  async function loadPrograms() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/programs/all`);
      const data = await res.json();
      setPrograms(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch programs", err);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPrograms();
  }, []);

  // -----------------------------
  // OPEN ADD MODAL
  // -----------------------------
  function openAddModal() {
    setEditMode(false);
    setSelectedId(null);
    setCode("");
    setName("");
    setDuration("");
    setLevel("");
    setDescription("");
    setErrorMsg("");
    setSuccessMsg("");
    setModalOpen(true);
  }

  // -----------------------------
  // OPEN EDIT MODAL
  // -----------------------------
  function openEditModal(item) {
    setEditMode(true);
    setSelectedId(item.program_id);
    setCode(item.code || "");
    setName(item.name || "");
    setDuration(item.duration ? String(item.duration) : "");
    setLevel(item.level || "");
    setDescription(item.description || "");
    setErrorMsg("");
    setSuccessMsg("");
    setModalOpen(true);
  }

  // -----------------------------
  // ADD / UPDATE PROGRAM
  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    // basic validation
    if (!code || !name || !duration || !level) {
      setErrorMsg("Please fill code, name, duration and level.");
      return;
    }

    // duration should be numeric
    const durationI = parseInt(duration, 10);
    if (Number.isNaN(durationI) || durationI <= 0) {
      setErrorMsg("Duration must be a positive integer.");
      return;
    }

    const csrf = getAccessCsrfToken();
    const payload = {
      code,
      name,
      duration: durationI,
      level,
      description,
    };

    try {
      setSaving(true);

      if (editMode) {
        // Try to call update endpoint if it exists. If backend doesn't have it,
        // the call will likely 404 — show the error to the user.
        const res = await fetch(`${API_BASE_URL}/programs/update/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          // if update endpoint is not present or update fails, surface message
          const data = await res.json().catch(() => ({}));
          const msg =
            data?.error ||
            data?.message ||
            `Failed to update program (status ${res.status}).`;
          setErrorMsg(msg);
          // don't silently fall back to add — editing without backend update could create duplicates
          return;
        }

        setSuccessMsg("Program updated successfully.");
      } else {
        // Add new program
        const res = await fetch(`${API_BASE_URL}/programs/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorMsg(
            data?.error || data?.message || `Failed to add program (status ${res.status}).`
          );
          return;
        }

        setSuccessMsg("Program added successfully.");
      }

      setModalOpen(false);
      loadPrograms();
    } catch (err) {
      console.error("Failed to save program", err);
      setErrorMsg("Network error while saving program.");
    } finally {
      setSaving(false);
    }
  }

  // -----------------------------
  // DELETE PROGRAM
  // -----------------------------
  async function confirmDelete() {
    setErrorMsg("");
    setSuccessMsg("");
    const csrf = getAccessCsrfToken();

    try {
      const res = await fetch(`${API_BASE_URL}/programs/delete/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf,
        },
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorMsg(data?.error || `Delete failed (status ${res.status}).`);
        return;
      }

      setDeleteId(null);
      setSuccessMsg("Program deleted.");
      loadPrograms();
    } catch (err) {
      console.error("Delete failed", err);
      setErrorMsg("Network error while deleting program.");
    }
  }

  // ==================================================================
  // UI
  // ==================================================================
  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-grey-600">Manage Programs</h2>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r 
                     from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                     px-4 py-2 text-white font-medium shadow-lg shadow-cyan-500/25 
                     hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Add Program
        </button>
      </div>

      {/* ALERTS */}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/70 bg-red-900/80 px-4 py-3 text-sm text-red-50 flex items-center justify-between shadow-lg shadow-red-500/40">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
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
        <div className="mb-4 rounded-xl border border-emerald-500/70 bg-emerald-900/80 px-4 py-3 text-sm text-emerald-50 flex items-center justify-between shadow-lg shadow-emerald-500/40">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-4 h-4" />
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

      {/* TABLE */}
      <div className="bg-[#0b1220]/80 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl">
        <table className="w-full text-sm text-left text-slate-200">
          <thead className="bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border-b border-white/20">
            <tr>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Code
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Name
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Duration
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Level
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Description
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs text-right">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-400 italic">
                  Loading programs...
                </td>
              </tr>
            )}

            {!loading && programs.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-slate-400 italic">
                  No programs found.
                </td>
              </tr>
            )}

            {programs.map((item, idx) => (
              <tr
                key={item.program_id}
                className={`transition-all ${idx % 2 === 0 ? "bg-white/5" : "bg-white/10"} hover:bg-cyan-500/20`}
              >
                <td className="px-5 py-4 text-[15px] font-mono">{item.code}</td>
                <td className="px-5 py-4 text-[15px]">{item.name}</td>
                <td className="px-5 py-4 text-[15px]">{item.duration}</td>
                <td className="px-5 py-4 text-[15px]">{item.level}</td>
                <td className="px-5 py-4 text-[15px] max-w-sm truncate">{item.description}</td>

                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-4">
                    {/* EDIT */}
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-cyan-300 hover:text-cyan-400 hover:scale-110 transition-transform duration-150"
                      title="Edit (only if backend supports /programs/update/:id)"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>

                    {/* DELETE */}
                    <button
                      onClick={() => setDeleteId(item.program_id)}
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
              {editMode ? "Edit Program" : "Add Program"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* CODE */}
              <div>
                <label className="text-slate-300 text-sm">Program Code</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="eg. MCA-FT, MTECH-CSE"
                  disabled={editMode} // code often should be immutable; don't allow editing by default
                />
              </div>

              {/* NAME */}
              <div>
                <label className="text-slate-300 text-sm">Program Name</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* DURATION */}
              <div>
                <label className="text-slate-300 text-sm">Duration (years)</label>
                <input
                  type="number"
                  min="1"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              {/* LEVEL */}
              <div>
                <label className="text-slate-300 text-sm">Level</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                  required
                  placeholder="eg. Undergraduate / Postgraduate / Diploma"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label className="text-slate-300 text-sm">
                  Description <span className="text-slate-500 text-xs">(optional)</span>
                </label>
                <textarea
                  rows="4"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 
                           hover:from-cyan-400 hover:to-blue-400 text-white py-2 text-lg font-medium
                           shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 
                           transition-all duration-300 hover:scale-[1.03]"
              >
                {saving ? "Saving..." : editMode ? "Save Changes" : "Add Program"}
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
            <h3 className="text-white text-lg font-semibold mb-2">Delete Program?</h3>
            <p className="text-slate-400 text-sm mb-4">This action cannot be undone.</p>

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
