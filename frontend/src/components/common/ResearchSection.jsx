// src/components/home/ResearchSection.jsx
import React from "react";

const defaultResearch = [
  {
    title: "Intelligent Systems & AI Lab",
    lead: "Ms Sayani Manna",
    focus: "Deep learning, computer vision, and intelligent decision systems.",
    tags: ["AI", "Deep Learning", "Computer Vision"],
  },
  {
    title: "Networks & Cyber Security Group",
    lead: "Mr. Joy Samadder",
    focus:
      "Secure communication protocols, intrusion detection, and resilient networking.",
    tags: ["Networks", "Security", "IoT"],
  },
  {
    title: "Data Analytics & Cloud Computing Lab",
    lead: "Dr. Kamarujjaman",
    focus: "Big data analytics, cloud platforms, and scalable systems.",
    tags: ["Big Data", "Cloud", "Analytics"],
  },
];

export default function ResearchSection({ researchItems = defaultResearch }) {
  return (
    <section className="bg-[#dbe7f0] py-16" id="research">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
            Research
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0f1c2c] md:text-4xl">
            Research & Innovation
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500" />
          <p className="mt-4 text-sm text-[#3f4c5d] md:text-base">
            Exploring cutting-edge topics and real-world challenges through
            collaborative research.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {researchItems.map((item, idx) => (
            <article
              key={idx}
              className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#c7d7e2] bg-[#f8fbfd] p-6 shadow-[0_4px_20px_rgba(0,40,90,0.08)] transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,40,90,0.12)]"
            >
              <div>
                <h3 className="text-lg font-semibold text-[#0f1c2c]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-cyan-700">
                  Lead: {item.lead}
                </p>
                <p className="mt-3 text-sm text-[#3f4c5d]">
                  {item.focus}
                </p>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags?.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="rounded-full border border-cyan-300 bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
