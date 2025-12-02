/** AdminStudent.jsx
 * @author Anish
 * @description This is the jsx file for Admin Panel Student
 * @date 2-12-2025
 * @returns a JSX Layout
 */

import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, X, IdCard, Mail } from "lucide-react";
import { getAccessCsrfToken } from "@/utils/csrf";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function AdminStudent() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [semester, setSemester] = useState("");
  const [programId, setProgramId] = useState("");

  // delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // special: show last generated login_id when registering student
  const [lastLoginId, setLastLoginId] = useState("");

  // -----------------------------
  // FETCH ALL STUDENTS
  // -----------------------------
  async function loadStudents() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/students/all`);
      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  // -----------------------------
  // OPEN ADD MODAL (REGISTER STUDENT)
  // -----------------------------
  function openAddModal() {
    setEditMode(false);
    setSelectedId(null);
    setName("");
    setEmail("");
    setPassword("");
    setRollNo("");
    setSemester("");
    setProgramId("");
    setModalOpen(true);
  }

  // -----------------------------
  // OPEN EDIT MODAL
  // -----------------------------
  function openEditModal(item) {
    setEditMode(true);
    setSelectedId(item.student_id);
    setName(item.name || "");
    setEmail(item.email || "");
    // do not prefill password for security; user can set new one
    setPassword("");
    setRollNo(item.roll_no || "");
    setSemester(item.semester != null ? String(item.semester) : "");
    setProgramId(item.program_id != null ? String(item.program_id) : "");
    setModalOpen(true);
  }

  // -----------------------------
  // ADD (REGISTER) / UPDATE STUDENT
  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const csrf = getAccessCsrfToken();

    // Common payload
    const payload = {
      name,
      email,
      password: password || undefined, // backend treats missing as "no change" on update
      roll_no: rollNo || undefined,
      semester: semester || undefined,
      program_id: programId || undefined,
    };

    try {
      if (editMode) {
        // UPDATE existing student
        await fetch(`${API_BASE_URL}/students/update/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        setLastLoginId(""); // not a new registration
      } else {
        // REGISTER new student via /students/add
        const res = await fetch(`${API_BASE_URL}/students/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (res.ok && data?.login_id) {
          setLastLoginId(data.login_id);
        } else {
          setLastLoginId("");
        }
      }

      setModalOpen(false);
      loadStudents();
    } catch (err) {
      console.error("Failed to save student", err);
    }
  }

  // -----------------------------
  // DELETE STUDENT
  // -----------------------------
  async function confirmDelete() {
    const csrf = getAccessCsrfToken();

    try {
      await fetch(`${API_BASE_URL}/students/delete/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf,
        },
        credentials: "include",
      });

      setDeleteId(null);
      loadStudents();
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
        <h2 className="text-2xl font-semibold text-white">Manage Students</h2>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r 
                     from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                     px-4 py-2 text-white font-medium shadow-lg shadow-cyan-500/25 
                     hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Register Student
        </button>
      </div>

      {/* LAST GENERATED LOGIN ID BANNER */}
      {lastLoginId && (
        <div className="mb-4 rounded-xl border border-emerald-500/80 bg-emerald-800/90 
                        px-4 py-3 text-sm text-emerald-50 flex items-center justify-between 
                        shadow-lg shadow-emerald-500/40">
          <div className="flex items-center gap-2">
            <IdCard className="w-4 h-4 text-emerald-200" />
            <span className="font-semibold">New student registered.</span>
            <span className="opacity-90">
              Login ID:{" "}
              <span className="ml-1 inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 
                              font-mono text-xs font-semibold text-emerald-50 shadow-inner">
                {lastLoginId}
              </span>
            </span>
          </div>
          <button
            onClick={() => setLastLoginId("")}
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
                Login ID
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Name
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Email
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Roll No
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Semester
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Program ID
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
                  colSpan="7"
                  className="text-center py-6 text-slate-400 italic"
                >
                  Loading students...
                </td>
              </tr>
            )}

            {!loading && students.length === 0 && (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-slate-400 italic"
                >
                  No students found.
                </td>
              </tr>
            )}

            {students.map((item, idx) => (
              <tr
                key={item.student_id}
                className={`transition-all ${
                  idx % 2 === 0 ? "bg-white/5" : "bg-white/10"
                } hover:bg-cyan-500/20`}
              >
                <td className="px-5 py-4 font-mono text-[13px]">
                  {item.login_id}
                </td>
                <td className="px-5 py-4 text-[15px]">{item.name}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 max-w-xs">
                    <Mail className="w-4 h-4 text-cyan-300" />
                    <span className="truncate">{item.email}</span>
                  </div>
                </td>
                <td className="px-5 py-4">{item.roll_no || "—"}</td>
                <td className="px-5 py-4">{item.semester ?? "—"}</td>
                <td className="px-5 py-4">{item.program_id ?? "—"}</td>

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
                      onClick={() => setDeleteId(item.student_id)}
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
              {editMode ? "Edit Student" : "Register Student"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* NAME */}
              <div>
                <label className="text-slate-300 text-sm">Name</label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="text-slate-300 text-sm">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="text-slate-300 text-sm">
                  {editMode ? "New Password (optional)" : "Password"}
                </label>
                <input
                  type="password"
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!editMode}
                  placeholder={editMode ? "Leave blank to keep current" : ""}
                />
              </div>

              {/* ROLL NO */}
              <div>
                <label className="text-slate-300 text-sm">
                  Roll No <span className="text-slate-500 text-xs">(optional)</span>
                </label>
                <input
                  className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                             focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                />
              </div>

              {/* SEMESTER & PROGRAM ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 text-sm">
                    Semester{" "}
                    <span className="text-slate-500 text-xs">(optional)</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                               focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-slate-300 text-sm">
                    Program ID{" "}
                    <span className="text-slate-500 text-xs">(optional)</span>
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 px-3 py-2 rounded-lg bg-black/20 border border-white/10 
                               focus:ring-2 focus:ring-cyan-500 text-white outline-none"
                    value={programId}
                    onChange={(e) => setProgramId(e.target.value)}
                  />
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 
                           hover:from-cyan-400 hover:to-blue-400 text-white py-2 text-lg font-medium
                           shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 
                           transition-all duration-300 hover:scale-[1.03]"
              >
                {editMode ? "Save Changes" : "Register Student"}
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
              Delete Student?
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
