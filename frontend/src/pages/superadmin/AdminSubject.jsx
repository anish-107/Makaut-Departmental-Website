/** AdminSubject.jsx
 * @author Anish
 * @description This is the jsx file for Admin Panel Subject
 * @date 2-12-2025
 * @returns a JSX Layout
 */

import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, X, AlertTriangle } from "lucide-react";
import { getAccessCsrfToken } from "@/utils/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function AdminSubject() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [programs, setPrograms] = useState([]);
  const [programsLoading, setProgramsLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // form fields
  const [programId, setProgramId] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");

  // delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // error banner (for backend errors like FK, forbidden, etc.)
  const [errorMsg, setErrorMsg] = useState("");

  // -----------------------------
  // FETCH ALL SUBJECTS
  // -----------------------------
  async function loadSubjects() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/subjects/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setSubjects(data || []);
    } catch (err) {
      console.error("Failed to fetch subjects", err);
      setErrorMsg("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  }

  // -----------------------------
  // FETCH ALL PROGRAMS
  // -----------------------------
  async function loadPrograms() {
    try {
      setProgramsLoading(true);
      const res = await fetch(`${API_BASE_URL}/programs/all`, {
        credentials: "include",
      });
      const data = await res.json();
      setPrograms(data || []);
    } catch (err) {
      console.error("Failed to fetch programs", err);
      setErrorMsg("Failed to load programs.");
    } finally {
      setProgramsLoading(false);
    }
  }

  useEffect(() => {
    loadSubjects();
    loadPrograms();
  }, []);

  // -----------------------------
  // OPEN ADD MODAL
  // -----------------------------
  function openAddModal() {
    setEditMode(false);
    setSelectedId(null);
    setProgramId("");
    setCode("");
    setName("");
    setSemester("");
    setModalOpen(true);
    setErrorMsg("");
  }

  // -----------------------------
  // OPEN EDIT MODAL
  // (Simulate update as delete+add because backend has no update route)
  // -----------------------------
  function openEditModal(item) {
    setEditMode(true);
    setSelectedId(item.subject_id);
    setProgramId(
      item.program_id != null ? String(item.program_id) : ""
    );
    setCode(item.code || "");
    setName(item.name || "");
    setSemester(item.semester != null ? String(item.semester) : "");
    setModalOpen(true);
    setErrorMsg("");
  }

  // -----------------------------
  // ADD / "UPDATE" SUBJECT
  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");

    const csrf = getAccessCsrfToken();

    const programIdNum = Number(programId);
    const semesterNum = Number(semester);

    if (!programIdNum || Number.isNaN(programIdNum)) {
      setErrorMsg("Please select a valid program.");
      return;
    }
    if (!semesterNum || Number.isNaN(semesterNum)) {
      setErrorMsg("Please enter a valid semester.");
      return;
    }

    const payload = {
      program_id: programIdNum,
      code,
      name,
      semester: semesterNum,
    };

    try {
      // If editing, delete old subject then add new one
      if (editMode && selectedId != null) {
        try {
          await fetch(`${API_BASE_URL}/subjects/delete/${selectedId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": csrf,
            },
            credentials: "include",
          });
        } catch (err) {
          console.error("Failed to delete before re-adding subject", err);
        }
      }

      const res = await fetch(`${API_BASE_URL}/subjects/add`, {
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
        console.error("Add subject failed:", res.status, data);
        setErrorMsg(
          data?.error ||
            `Failed to save subject (status ${res.status}).`
        );
        return;
      }

      setModalOpen(false);
      loadSubjects();
    } catch (err) {
      console.error("Failed to save subject", err);
      setErrorMsg("Failed to save subject due to a network error.");
    }
  }

  // -----------------------------
  // DELETE SUBJECT
  // -----------------------------
  async function confirmDelete() {
    const csrf = getAccessCsrfToken();
    setErrorMsg("");

    try {
      const res = await fetch(
        `${API_BASE_URL}/subjects/delete/${deleteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMsg(
          data?.error ||
            `Failed to delete subject (status ${res.status}).`
        );
      }

      setDeleteId(null);
      loadSubjects();
    } catch (err) {
      console.error("Delete failed", err);
      setErrorMsg("Failed to delete subject due to a network error.");
    }
  }

  // helper to label a program nicely
  function programLabel(p) {
    const name = p.name || p.program_name || "";
    const code = p.code || p.program_code || "";
    if (code && name) return `${code} — ${name}`;
    if (name) return name;
    if (code) return code;
    return `Program ${p.program_id}`;
  }

  // ==================================================================
  // UI
  // ==================================================================
  return (
    <div className="p-6">
      {/* PAGE HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-grey-600">Manage Subjects</h2>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r 
                     from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                     px-4 py-2 text-white font-medium shadow-lg shadow-cyan-500/25 
                     hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Add Subject
        </button>
      </div>

      {/* ERROR BANNER */}
      {errorMsg && (
        <div className="mb-4 rounded-xl border border-red-500/70 bg-red-900/70 
                        px-4 py-3 text-sm text-red-50 flex items-center justify-between 
                        shadow-lg shadow-red-500/40">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-200" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            onClick={() => setErrorMsg("")}
            className="text-red-100 hover:text-white text-xs font-medium underline decoration-dotted"
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
                Subject ID
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Program
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Code
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Name
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Semester
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
                  colSpan="6"
                  className="text-center py-6 text-slate-400 italic"
                >
                  Loading subjects...
                </td>
              </tr>
            )}

            {!loading && subjects.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-slate-400 italic"
                >
                  No subjects found.
                </td>
              </tr>
            )}

            {subjects.map((item, idx) => {
              const program = programs.find(
                (p) => Number(p.program_id) === Number(item.program_id)
              );

              return (
                <tr
                  key={item.subject_id}
                  className={`transition-all ${
                    idx % 2 === 0 ? "bg-white/5" : "bg-white/10"
                  } hover:bg-cyan-500/20`}
                >
                  <td className="px-5 py-4 text-[13px] font-mono">
                    {item.subject_id}
                  </td>
                  <td className="px-5 py-4">
                    {program ? programLabel(program) : item.program_id}
                  </td>
                  <td className="px-5 py-4 text-[15px]">{item.code}</td>
                  <td className="px-5 py-4 text-[15px]">{item.name}</td>
                  <td className="px-5 py-4">{item.semester}</td>

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
                        onClick={() => setDeleteId(item.subject_id)}
                        className="text-red-400 hover:text-red-500 hover:scale-110 transition-transform duration-150"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
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
              {editMode ? "Edit Subject" : "Add Subject"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PROGRAM SELECT */}
              <div>
                <label className="text-slate-300 text-sm">Program</label>
                <select
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={programId}
                  onChange={(e) => setProgramId(e.target.value)}
                  required
                >
                  <option value="">Select a program</option>
                  {programsLoading && (
                    <option disabled>Loading programs...</option>
                  )}
                  {!programsLoading &&
                    programs.map((p) => (
                      <option key={p.program_id} value={p.program_id}>
                        {programLabel(p)}
                      </option>
                    ))}
                </select>
              </div>

              {/* CODE */}
              <div>
                <label className="text-slate-300 text-sm">Subject Code</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  placeholder="e.g. CS101"
                />
              </div>

              {/* NAME */}
              <div>
                <label className="text-slate-300 text-sm">Subject Name</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Data Structures"
                />
              </div>

              {/* SEMESTER */}
              <div>
                <label className="text-slate-300 text-sm">Semester</label>
                <input
                  type="number"
                  min="1"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  required
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
                {editMode ? "Save Changes" : "Add Subject"}
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
              Delete Subject?
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
