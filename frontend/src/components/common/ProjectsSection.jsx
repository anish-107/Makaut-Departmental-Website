import React from "react";
import { Server, Zap, Shield, TrendingUp, ArrowRight } from "lucide-react";

const projectList = [
  {
    title: "AI Traffic Monitoring System",
    desc: "Deep learning-based real-time vehicle detection.",
    icon: <Server />,
  },
  {
    title: "IoT Health Monitoring",
    desc: "Sensor-driven smart healthcare ecosystem.",
    icon: <Zap />,
  },
  {
    title: "Cyber Forensics Suite",
    desc: "Complete toolkit for digital investigation.",
    icon: <Shield />,
  },
  {
    title: "Cloud Compute Engine",
    desc: "Distributed container execution platform.",
    icon: <TrendingUp />,
  },
];

export default function ProjectsSection() {
  return (
    <section id="projects" className="mt-10">
      <h2 className="text-2xl font-extrabold text-slate-900">Top Projects</h2>

      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {projectList.map((p, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="text-blue-700 mb-3">{p.icon}</div>
            <h4 className="font-extrabold text-slate-900">{p.title}</h4>
            <p className="mt-2 text-slate-600">{p.desc}</p>
            <a
              className="inline-flex items-center gap-2 mt-3 text-maroon font-semibold"
              href="#"
            >
              Learn More <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
