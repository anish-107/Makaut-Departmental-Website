import React from "react";
import { ArrowRight } from "lucide-react";

export default function HODSection() {
  return (
    <section className="mt-10">
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col lg:flex-row gap-6 border-l-4 border-maroon">
        <img
          src="https://it.makautwb.ac.in/images/faculty/4.jpg"
          alt="HOD"
          className="w-full lg:w-56 h-72 object-cover rounded-lg border"
        />

        <div className="flex-1">
          <h2 className="text-xl font-extrabold text-slate-900">
            Message from the HOD
          </h2>
          <h3 className="mt-2 text-maroon font-bold text-lg">
            Prof. Dr. Debashish Giri
          </h3>
          <p className="text-slate-600 font-semibold">Head of Department, IT</p>

          <p className="mt-4 text-slate-700 border-l-4 border-yellow-200 pl-3">
            “Our department is committed to academic excellence,
            industry-oriented research, and producing global leaders in
            engineering.”
          </p>

          <a
            className="inline-flex items-center gap-2 mt-4 font-bold text-slate-900 hover:text-maroon"
            href="#"
          >
            Know More <ArrowRight className="w-4 h-4 text-maroon" />
          </a>
        </div>
      </div>
    </section>
  );
}
