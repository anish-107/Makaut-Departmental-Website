import React from "react";

const achievementList = [
  { count: "150+", label: "Research Papers" },
  { count: "30+", label: "Funded Projects" },
  { count: "95%", label: "Placement Rate" },
  { count: "12+", label: "Patents" },
];

export default function Achievements() {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-extrabold text-slate-900">Achievements</h2>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {achievementList.map((a, i) => (
          <div key={i} className="bg-white p-6 rounded-xl text-center shadow">
            <h3 className="text-2xl font-extrabold text-blue-700">{a.count}</h3>
            <p className="mt-2 font-semibold text-slate-600">{a.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
