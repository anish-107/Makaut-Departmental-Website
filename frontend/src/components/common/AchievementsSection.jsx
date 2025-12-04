// src/components/home/AchievementsSection.jsx
import React from "react";

export default function AchievementsSection({
  stats = [
    { label: "Patents Filed", value: 12 },
    { label: "Research Papers Published", value: 85 },
    { label: "Postgraduate Students", value: 48 },
    { label: "Collaborative Projects", value: 14 },
    { label: "Industry Partnerships", value: 9 },
  ],
}) {
  return (
    <section className="bg-[#dbe7f0] py-16" id="achievements">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
            Achievements
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0f1c2c] md:text-4xl">
            Our Milestones
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500" />
          <p className="mt-4 text-sm text-[#3f4c5d] md:text-base">
            Highlighting the key achievements and progress of our department.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="group flex flex-col items-center rounded-2xl border border-[#c7d7e2] bg-[#f8fbfd] p-8 text-center shadow-[0_4px_20px_rgba(0,40,90,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,40,90,0.12)]"
            >
              <div className="text-4xl font-extrabold text-cyan-700 group-hover:scale-105 transition">
                {item.value}
              </div>
              <div className="mt-3 text-sm font-semibold text-[#0f1c2c]">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
