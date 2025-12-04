// src/components/home/FacultySection.jsx
import React from "react";
import FacultyCard from "./FacultyCard";
import Faculty1 from "@/assets/Common/faculty1.jpg";
import Faculty2 from "@/assets/Common/faculty2.jpg";
import Faculty3 from "@/assets/Common/faculty3.jpg";
import Faculty4 from "@/assets/Common/faculty4.jpg";
import Faculty5 from "@/assets/Common/faculty5.jpg";
import Faculty6 from "@/assets/Common/faculty6.jpg";
import Faculty7 from "@/assets/Common/faculty7.jpg";
import Faculty8 from "@/assets/Common/faculty8.jpg";
import Faculty9 from "@/assets/Common/faculty9.jpg";
import Faculty10 from "@/assets/Common/faculty10.jpg";
import Faculty11 from "@/assets/Common/faculty11.jpg";


const defaultFaculty = [
  {
    name: "Dr. Debasis Giri",
    photo: Faculty2,
    designation: "Associate Professor & HoD Department of Information Technology",
    interests: "Cryptography, Information Security, E-commerce security and Design & Analysis of Algorithms.",
    email: "debasis.giri@makautwb.ac.in"
  },
  {
    name: "Prof. Nabarun Bhattacharyya",
    photo: Faculty1,
    designation: "Professor Department of Information Technology",
    interests: "Artificial Intelligence, Machine Learning, Data Mining",
    email: "nabarun.bhattacharyya@makautwb.ac.in",
  },
  {
    name: "Dr. Somdatta Chakravortty",
    photo: Faculty3,
    designation: "Associate Professor & HoD(GI)Department of Information Technology",
    interests: "Hyperspectral remote sensing, Machine Learning, Image processing",
    email: "somdatta.chakravortty@makautwb.ac.in",
  },
    {
    name: "Dr. Dipanwita Ghosh",
    photo: Faculty4,
    designation: "AAssistant ProfessorDepartment of Information Technology",
    interests: "Artificial Intellegence, Machine Learning, Satellite Image Processing",
    email: " ghosh.dipanwita90@gmail.com"
  },
  {
    name: "Dr. Jadav Chandra Das",
    photo: Faculty5,
    designation: "Assistant Professor Department of Information Technology",
    interests: "Nano Communication, Quantum Dot-Cellular Automata, IoT",
    email: "jadavchandra.das@makautwb.ac.in",
  },
  {
    name: "Dr. Kamarujjaman",
    photo: Faculty6,
    designation: "Assistant Professor Department of Information Technology",
    interests: "Medical Image Processing, Machine Learning, Soft Computing, Signal & Image Processing, FPGA-based Implementation and Bio-informatics",
    email: "skmasum000@gmail.com",
  },
    {
    name: "Dr. Nabanita Ganguly",
    photo: Faculty7,
    designation: "Assistant Professor Department of Information Technology",
    interests: "Information Security",
    email: "nabanita.ganguly@makautwb.ac.in"
  },
  {
    name: "Dr. Sayantani Saha",
    photo: Faculty8,
    designation: "Assistant Professor Department of Information Technology",
    interests: "Data security, access control, mobility management, Wireless Sensor Network etc.",
    email: "sayantani.saha@makautwb.ac.in",
  },
  {
    name: "Mr. Joy Samadder",
    photo: Faculty9,
    designation: "Assistant Professor Department of Information Technology",
    interests: "IoT, Cloud Computing, Information Security",
    email: "joy.samadder@makautwb.ac.in",
  },
  {
    name: "Ms. Kamalika Bhattacharjya",
    photo: Faculty10,
    designation: "Assistant Professor Department of Information Technology",
    interests: "Wireless Sensor Network (WSN), Internet of Things (IoT),Wireless Sensor Underwater Network (UWSN), Internet of Underwater Things (IoUT), Cloud Computing, Edge Computing",
    email: "b.kamalika01@gmail.com",
  },
  {
    name: "Ms. Sayani Manna",
    photo: Faculty11,
    designation: "Assistant Professor Department of Information Technology",
    interests: "Assistant ProfessorDepartment of Information Technology",
    email: "sayaniresearch2018@gmail.com",
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
