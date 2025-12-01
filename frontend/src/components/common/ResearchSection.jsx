import React from "react";
import { Microscope, Shield, Server, Zap } from "lucide-react";

const researchGroups = [
  {
    title: "AI & ML Lab",
    icon: <Microscope />,
    desc: "Predictive models & neural networks.",
  },
  {
    title: "Cybersecurity Lab",
    icon: <Shield />,
    desc: "Pen-testing & digital forensics.",
  },
  {
    title: "Cloud Computing Group",
    icon: <Server />,
    desc: "Virtualization & high availability.",
  },
  {
    title: "IoT & Embedded Lab",
    icon: <Zap />,
    desc: "Real-time embedded systems.",
  },
];

export default function ResearchSection() {
  return (
    <section
      id="research"
      className="mt-10 bg-gradient-to-b from-sky-50/30 rounded-xl p-6"
    >
      <h2 className="text-2xl font-extrabold text-slate-900">
        Research Clusters
      </h2>

      <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {researchGroups.map((r, i) => (
          <div key={i} className="bg-white p-5 rounded-xl text-center shadow">
            <div className="text-blue-700 mb-3">{r.icon}</div>
            <h4 className="font-bold text-slate-900">{r.title}</h4>
            <p className="text-slate-600 mt-2">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
