import React from "react";

export default function LinkItem({ icon, label }) {
  return (
    <a className="flex items-center gap-4 p-4 bg-white rounded-xl shadow hover:shadow-md">
      <div className="text-blue-700">{icon}</div>
      <div className="font-semibold text-slate-800">{label}</div>
    </a>
  );
}
