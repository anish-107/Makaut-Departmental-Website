import React from "react";

export default function AboutSection() {
  return (
    <section id="about" className="mt-10">
      <h2 className="text-2xl font-extrabold text-slate-900">
        About Our Department
      </h2>

      <div className="mt-6 grid gap-6 grid-cols-1 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-slate-900">Who We Are</h3>
          <p className="mt-3 text-slate-600">
            A leading engineering department with strong academic programs,
            nationally accredited labs, and industry partnerships.
          </p>
          <ul className="mt-3 text-slate-600 list-disc list-inside">
            <li>5 Academic Programs</li>
            <li>NBA &amp; NAAC Accredited</li>
            <li>14+ Advanced Research Labs</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold text-slate-900">Vision &amp; Mission</h3>
          <p className="mt-3">
            <b>Vision:</b> To cultivate globally competent engineers and
            innovators.
          </p>
          <p className="mt-2">
            <b>Mission:</b> To deliver high-quality education and research
            excellence.
          </p>
          <a
            className="inline-block mt-4 px-4 py-2 bg-yellow-400 rounded-md font-bold text-slate-900"
            href="#"
          >
            Read More
          </a>
        </div>
      </div>
    </section>
  );
}
