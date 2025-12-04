// src/components/home/FacultyCard.jsx
import React from "react";

export default function FacultyCard({
  name = "Prof. Name Here",
  photo = null,
  designation = "Designation / Dept.",
  interests = "Artificial Intelligence, Machine Learning, Data Mining",
  email = "name.lastname@college.edu",
}) {
  return (
    <div className="w-full max-w-xl rounded-xl bg-[#f3fbff] p-5 shadow-[0_10px_30px_rgba(8,50,80,0.06)] border border-transparent">
      <div className="flex items-start gap-4">
        {/* avatar - fixed square like screenshot */}
        <div className="flex-shrink-0">
          <div className="h-20 w-20 overflow-hidden rounded-lg border-2 border-[#d6eaf2] bg-white">
            {photo ? (
              <img src={photo} alt={name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-bold text-cyan-700">
                {name?.[0] ?? "F"}
              </div>
            )}
          </div>
        </div>

        {/* info column - min-w-0 important to allow wrapping inside flex */}
        <div className="min-w-0 flex-1">
          {/* Name - allow two lines, slightly larger */}
          <h3 className="text-lg font-semibold text-[#0f2430] leading-snug">
            {name}
          </h3>

          {/* Designation - teal and slightly smaller */}
          <p className="mt-1 text-sm font-medium text-cyan-700">
            {designation}
          </p>

          {/* Interests - one paragraph with bold label */}
          <p className="mt-2 text-sm text-[#2f4654] leading-tight break-words whitespace-normal">
            <span className="font-semibold text-cyan-700">Subject of Interest: </span>
            <span className="text-sm">{interests}</span>
          </p>

          {/* Email - wrapped and will never overflow */}
          {email && (
            <p className="mt-2 text-sm">
              <a
                href={`mailto:${email}`}
                className="inline-block max-w-full text-sm font-medium text-[#0f4d6d] break-words break-all hover:underline"
                title={email}
              >
                {email}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
