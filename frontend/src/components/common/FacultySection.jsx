// src/components/home/FacultySection.jsx
import React from "react";
import FacultyCard from "./FacultyCard";

const defaultFaculty = [
  {
    name: "Dr. Arjun Sen",
    photo: "/images/faculty/arjun-sen.jpg",
    designation: "Professor & Head of Department",
    interests: "Artificial Intelligence, Machine Learning, Data Mining",
  },
  {
    name: "Dr. Priya Sharma",
    photo: "/images/faculty/priya-sharma.jpg",
    designation: "Associate Professor",
    interests: "Computer Networks, Network Security",
  },
  {
    name: "Mr. Rohan Das",
    photo: "/images/faculty/rohan-das.jpg",
    designation: "Assistant Professor",
    interests: "Web Technologies, Human Computer Interaction",
  },
];

export default function FacultySection({ facultyList = defaultFaculty }) {
  return (
    <section className="bg-[#dbe7f0] py-16" id="faculty">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-700">
            Faculty
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[#0f1c2c] md:text-4xl">
            Our Distinguished Faculty
          </h2>
          <div className="mx-auto mt-4 h-1 w-24 rounded-full bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500" />
          <p className="mt-4 text-sm text-[#3f4c5d] md:text-base">
            A team of dedicated educators and researchers guiding students
            towards academic excellence and innovation.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {facultyList.map((f, idx) => (
            <FacultyCard key={idx} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
