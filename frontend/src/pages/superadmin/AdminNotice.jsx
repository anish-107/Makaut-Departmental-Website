/** AdminNotice.jsx
 * @author Anish
 * @description Admin panel page for managing Notices (CRUD)
 * @date 2-12-2025
 * @returns a JSX Layout
 */

import React, { useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export default function AdminNotice() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ title: "", content: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all notices on mount
  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/notice/all`, {
        method: "GET",
        credentials: "include", 
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch notices: ${res.status}`);
      }

      const data = await res.json();
      setNotices(data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load notices.");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setForm({ title: "", content: "" });
    setIsEditing(false);
    setEditingNotice(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleEditClick(notice) {
    setIsEditing(true);
    setEditingNotice(notice);
    setForm({
      title: notice.title || "",
      content: notice.content || "",
    });
  }

  async function handleDeleteClick(notice) {
    const noticeId = notice.notice_id ?? notice.id;

    if (!noticeId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete notice #${noticeId}?`
    );
    if (!confirmed) return;

    try {
      setSubmitting(true);
      setError("");

      const res = await fetch(`${API_BASE_URL}/notice/delete/${noticeId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || `Failed to delete notice: ${res.status}`);
      }

      // Remove from local state
      setNotices((prev) =>
        prev.filter((n) => (n.notice_id ?? n.id) !== noticeId)
      );

      // Clear form if we were editing this one
      if (
        editingNotice &&
        (editingNotice.notice_id ?? editingNotice.id) === noticeId
      ) {
        resetForm();
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete notice.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      if (isEditing && editingNotice) {
        // UPDATE mode
        const noticeId = editingNotice.notice_id ?? editingNotice.id;

        const payload = {
          title: form.title.trim(),
          content: form.content.trim(),
          // Preserve original posted_by and created_at
          posted_by: editingNotice.posted_by,
          created_at: editingNotice.created_at,
        };

        const res = await fetch(`${API_BASE_URL}/notice/update/${noticeId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || `Failed to update notice: ${res.status}`);
        }

        // Update local list
        setNotices((prev) =>
          prev.map((n) =>
            (n.notice_id ?? n.id) === noticeId
              ? {
                  ...n,
                  title: payload.title,
                  content: payload.content,
                  posted_by: payload.posted_by,
                  created_at: payload.created_at,
                }
              : n
          )
        );
      } else {
        // ADD mode
        const payload = {
          title: form.title.trim(),
          content: form.content.trim(),
          // posted_by & created_at filled by backend
        };

        const res = await fetch(`${API_BASE_URL}/notice/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || `Failed to add notice: ${res.status}`);
        }

        // Refetch to include new notice
        await fetchNotices();
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setError(
        err.message ||
          (isEditing ? "Failed to update notice." : "Failed to add notice.")
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="w-full h-full flex flex-col gap-6 p-6 bg-gray-50">
      {/* Header / Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Notice Management
          </h2>
          <p className="text-sm text-gray-600">
            Add, edit, and delete notices for students and faculty.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-800 shadow-sm border">
            Total Notices: <span className="ml-1">{notices.length}</span>
          </span>
          <button
            type="button"
            onClick={resetForm}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-800 hover:bg-gray-100 transition"
          >
            Clear Form
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {isEditing ? "Edit Notice" : "Create New Notice"}
          </h3>
          {isEditing && editingNotice && (
            <span className="text-xs text-gray-500">
              Editing ID: {editingNotice.notice_id ?? editingNotice.id}
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              placeholder="Enter notice title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={4}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-y"
              placeholder="Write the notice details here..."
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
                disabled={submitting}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed transition"
            >
              {submitting
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                ? "Save Changes"
                : "Create Notice"}
            </button>
          </div>
        </form>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-1 flex flex-col overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800">All Notices</h3>
          {loading && (
            <span className="text-xs text-gray-500">Loading...</span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  ID
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Title
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Content
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Posted By
                </th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">
                  Created At
                </th>
                <th className="px-4 py-2 text-right font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 && !loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    No notices found.
                  </td>
                </tr>
              ) : (
                notices.map((notice) => {
                  const id = notice.notice_id ?? notice.id;
                  return (
                    <tr
                      key={id}
                      className="border-b last:border-b-0 hover:bg-gray-50/80"
                    >
                      <td className="px-4 py-2 align-top text-gray-800">
                        {id}
                      </td>
                      <td className="px-4 py-2 align-top font-medium text-gray-900 max-w-xs truncate">
                        {notice.title}
                      </td>
                      <td className="px-4 py-2 align-top text-gray-700 max-w-md">
                        <p className="line-clamp-3 text-xs sm:text-sm">
                          {notice.content}
                        </p>
                      </td>
                      <td className="px-4 py-2 align-top text-gray-700 text-xs sm:text-sm">
                        {notice.posted_by ?? "—"}
                      </td>
                      <td className="px-4 py-2 align-top text-gray-500 text-xs sm:text-sm whitespace-nowrap">
                        {notice.created_at
                          ? new Date(notice.created_at).toLocaleString()
                          : "—"}
                      </td>
                      <td className="px-4 py-2 align-top text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditClick(notice)}
                            className="rounded-md border border-gray-300 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteClick(notice)}
                            disabled={submitting}
                            className="rounded-md border border-red-200 px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition disabled:opacity-60"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
