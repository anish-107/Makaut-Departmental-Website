/**
 * @author Anish
 * @description This is the the jsx file that is being displayed in main.jsx
 * @date 29-11-2025
 * @returns a JSX page
 */

// Imports
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

// Constants
const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [members, setMembers] = useState([]);
  const [notices, setNotices] = useState([]);
  const [loadingNotices, setLoadingNotices] = useState(true);
  const [noticesError, setNoticesError] = useState(null);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get(`${API_URL}/`);
        setMembers(response.data.members ?? []);
      } catch (err) {
        console.error("Failed to fetch members:", err);
      }
    };

    fetchMembers();
  }, []);

  useEffect(() => {
    const fetchNotices = async () => {
      setLoadingNotices(true);
      setNoticesError(null);

      try {
        const response = await axios.get(`${API_URL}/notice/all`);
        const data = response.data;         // this is already an array
        setNotices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
        setNoticesError(err?.response?.data || err.message || "Failed to load notices");
      } finally {
        setLoadingNotices(false);
      }
    };

    fetchNotices();
  }, []);


  const formatDate = (rawDate) => {
    if (!rawDate) return null;
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return rawDate; 
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center bg-white text-gray-900">
        <main className="container mx-auto px-4 py-8 w-full max-w-5xl">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome</h2>
            <p className="text-gray-600">Tailwind is working! Customize this page as you like.</p>
          </section>

          <section className="mb-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Members</h3>
            <div className="bg-white border rounded-md shadow-sm divide-y">
              {members.length === 0 && (
                <div className="p-4 text-sm text-gray-500">No members available.</div>
              )}
              {members.map((member, index) => (
                <div
                  key={index}
                  className="w-full flex items-center gap-3 py-3 px-4"
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-700 font-medium">
                    {member?.charAt(0)?.toUpperCase() ?? "?"}
                  </div>
                  <span className="text-sm text-gray-800">{member}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Notices</h3>
              <div className="text-sm text-gray-500">{loadingNotices ? "Loading..." : `${notices.length} notices`}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loadingNotices && (
                <div className="col-span-full p-4 bg-gray-50 border rounded text-gray-500">
                  Loading notices...
                </div>
              )}

              {noticesError && (
                <div className="col-span-full p-4 bg-red-50 border border-red-200 rounded text-red-700">
                  Error: {String(noticesError)}
                </div>
              )}

              {!loadingNotices && !noticesError && notices.length === 0 && (
                <div className="col-span-full p-4 bg-gray-50 border rounded text-gray-500">
                  No notices available.
                </div>
              )}

              {!loadingNotices && !noticesError && notices.map((n) => {
                const key = n.notice_id ?? n.id ?? `${n.title}-${Math.random()}`;
                const dateStr = n.created_at ?? n.date ?? null;
                const content = n.content ?? n.body ?? n.description ?? "";
                return (
                  <article
                    key={key}
                    className="p-4 border rounded-lg bg-white shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="text-sm font-semibold text-gray-800">{n.title ?? "Untitled"}</h4>
                      {dateStr && (
                        <time className="text-xs text-gray-400">{formatDate(dateStr)}</time>
                      )}
                    </div>

                    <p className="mt-2 text-sm text-gray-600">
                      {content}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                      <div>
                        {n.posted_by != null && <span>Posted by: {String(n.posted_by)}</span>}
                      </div>
                      {n.link && (
                        <a
                          href={n.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block text-sm text-blue-600 hover:underline"
                        >
                          View more
                        </a>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}

export default App;
