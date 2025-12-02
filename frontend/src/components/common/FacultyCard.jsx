// src/components/home/FacultyCard.jsx
import React from "react";

export default function FacultyCard({
  name,
  photo,
  designation,
  interests,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[#c7d7e2] bg-[#f8fbfd] p-5 shadow-[0_4px_20px_rgba(0,40,90,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,40,90,0.12)]">
      {/* Soft accent */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-100 via-transparent to-blue-100 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex items-center gap-4">
        {/* Avatar */}
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-[#c7d7e2] bg-[#e6f0f7]">
          {photo ? (
            <img
              src={photo}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-cyan-700">
              {name?.[0] || "F"}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-[#0f1c2c]">{name}</h3>
          <p className="text-sm font-medium text-cyan-700">{designation}</p>
          <p className="text-xs text-[#3f4c5d]">
            <span className="font-semibold text-cyan-700">
              Subject of Interest:
            </span>{" "}
            {interests}
          </p>
        </div>
      </div>
    </div>
  );
}
