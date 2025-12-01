import React from "react";

export default function Hero() {
  return (
    <section
      id="home"
      className="mt-8 bg-gradient-to-br from-sky-50/50 via-white to-white rounded-2xl p-8"
    >
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900">
            Department of{" "}
            <span className="text-maroon">INFORMATION TECHNOLOGY</span>
          </h1>

          <p className="mt-4 text-slate-600 max-w-prose">
            A premier academic center dedicated to excellence in education,
            innovation, and groundbreaking research.
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href="#about"
              className="inline-block bg-blue-700 text-white px-5 py-3 rounded-full font-bold"
            >
              Explore Department
            </a>
            <a
              href="#projects"
              className="inline-block px-5 py-3 rounded-full border border-slate-200 font-semibold"
            >
              View Projects
            </a>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            className="w-full max-w-md rounded-xl shadow-2xl"
            src="https://img.collegepravesh.com/2021/08/MAKAUT-Kolkata.jpg"
            alt="Campus"
          />
        </div>
      </div>
    </section>
  );
}
