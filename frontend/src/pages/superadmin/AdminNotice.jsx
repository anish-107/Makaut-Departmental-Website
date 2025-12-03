/** AdminNotice.jsx
 * @author Anish
 * @description Admin panel page for managing Notices (CRUD)
 * @date 2-12-2025
 * @returns a JSX Layout
 */


import React, { useEffect, useState } from "react";
import { PlusCircle, Pencil, Trash2, X } from "lucide-react";
import { getAccessCsrfToken } from "@/utils/csrf";
import { useAuth } from "@/hooks/useAuth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8080";

export default function AdminNotice() {
  const { user } = useAuth();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // -----------------------------
  // FETCH ALL NOTICES
  // -----------------------------
  async function loadNotices() {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/notice/all`);
      const data = await res.json();
      setNotices(data || []);
    } catch (err) {
      console.error("Failed to fetch notices", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  // -----------------------------
  // OPEN ADD MODAL
  // -----------------------------
  function openAddModal() {
    setEditMode(false);
    setSelectedId(null);
    setTitle("");
    setContent("");
    setModalOpen(true);
  }

  // -----------------------------
  // OPEN EDIT MODAL
  // -----------------------------
  function openEditModal(item) {
    setEditMode(true);
    setSelectedId(item.notice_id);
    setTitle(item.title);
    setContent(item.content);
    setModalOpen(true);
  }

  // -----------------------------
  // ADD / UPDATE NOTICE
  // -----------------------------
  async function handleSubmit(e) {
    e.preventDefault();

    const csrf = getAccessCsrfToken();
    const payload = {
      title,
      content,
      posted_by: user.login_id, // backend accepts this
    };

    try {
      if (editMode) {
        // update
        await fetch(`${API_BASE_URL}/notice/update/${selectedId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": csrf,
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });
      } else {
        // add
        await fetch(`${API_BASE_URL}/notice/add`, {
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
      loadNotices();
    } catch (err) {
      console.error("Failed to save notice", err);
    }
  }

  // -----------------------------
  // DELETE NOTICE
  // -----------------------------
  async function confirmDelete() {
    const csrf = getAccessCsrfToken();

    try {
      await fetch(`${API_BASE_URL}/notice/delete/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrf,
        },
        credentials: "include",
      });

      setDeleteId(null);
      loadNotices();
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
        <h2 className="text-2xl font-semibold text-grey-600">Manage Notices</h2>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r 
                     from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 
                     px-4 py-2 text-white font-medium shadow-lg shadow-cyan-500/25 
                     hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
        >
          <PlusCircle className="w-5 h-5" />
          Add Notice
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
                Posted By
              </th>
              <th className="px-5 py-4 font-semibold tracking-wide uppercase text-xs">
                Created
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
                  Loading Notices...
                </td>
              </tr>
            )}

            {!loading && notices.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-slate-400 italic"
                >
                  No notices found.
                </td>
              </tr>
            )}

            {notices.map((item, idx) => (
              <tr
                key={item.notice_id}
                className={`transition-all ${
                  idx % 2 === 0
                    ? "bg-white/5"
                    : "bg-white/10"
                } hover:bg-cyan-500/20`}
              >
                <td className="px-5 py-4 text-[15px]">{item.title}</td>
                <td className="px-5 py-4 text-[15px]">{item.content}</td>
                <td className="px-5 py-4">{item.posted_by}</td>
                <td className="px-5 py-4">{item.created_at}</td>

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
                      onClick={() => setDeleteId(item.notice_id)}
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
              {editMode ? "Edit Notice" : "Add Notice"}
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

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 
                           hover:from-cyan-400 hover:to-blue-400 text-white py-2 text-lg font-medium
                           shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 
                           transition-all duration-300 hover:scale-[1.03]"
              >
                {editMode ? "Save Changes" : "Add Notice"}
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
              Delete Notice?
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
