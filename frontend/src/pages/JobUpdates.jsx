import React from "react";
import Header from "../Components/Header";
import "./JobUpdates.css";

const JobUpdates = () => {

  /* ===============================
     1️⃣ UPCOMING COMPANY DRIVES
  =============================== */
  const upcomingCompanies = [
    {
      company: "Microsoft",
      role: "Software Engineer Intern",
      description: "Work on cloud services, AI modules & backend systems.",
      applyLink: "#",
      criteriaPDF: "/criteria-microsoft.pdf"
    },
    {
      company: "Infosys",
      role: "System Engineer",
      description: "Development & support role. Includes aptitude + coding.",
      applyLink: "#",
      criteriaPDF: "/criteria-infosys.pdf"
    }
  ];

  /* ===============================
     2️⃣ SHORTLIST / MERIT LIST
  =============================== */
  const meritLists = [
    {
      company: "TCS",
      round: "Technical Round",
      pdfLink: "/tcs-tech-round-merit.pdf"
    },
    {
      company: "Wipro",
      round: "Aptitude Shortlist",
      pdfLink: "/wipro-aptitude-merit.pdf"
    }
  ];

  /* ===============================
     3️⃣ COMPLETED COMPANY VISITS
  =============================== */
  const completedCompanies = [
    {
      company: "TCS",
      placed: 12,
      pdfLink: "/tcs-selected.pdf"
    },
    {
      company: "Infosys",
      placed: 9,
      pdfLink: "/infosys-selected.pdf"
    },
    {
      company: "Accenture",
      placed: 7,
      pdfLink: "/accenture-selected.pdf"
    }
  ];

  return (
    <div className="job-updates-page">

      {/* HEADER */}
      <Header 
        user={{
          name: "John Doe",
          email: "john@example.com",
          img: "/default-profile.png"
        }}
      />

      {/* STUDENT INFO */}
      <div className="job-student-info">
        <span>Student Name – John Doe</span>
        <span>Email – john@example.com</span>
      </div>


      {/* ======================================================
           1️⃣ UPCOMING COMPANY DRIVES
      ====================================================== */}
      <h2 className="section-title">Upcoming Campus Drives</h2>

      <div className="upcoming-box">
        {upcomingCompanies.map((c, i) => (
          <div className="upcoming-card" key={i}>
            <h3>{c.company}</h3>
            <p><strong>Role:</strong> {c.role}</p>
            <p>{c.description}</p>

            <div className="upcoming-links">
              <a href={c.applyLink} target="_blank" rel="noopener noreferrer">Apply Now</a>
              <a href={c.criteriaPDF} target="_blank" rel="noopener noreferrer">View Criteria PDF</a>
            </div>
          </div>
        ))}
      </div>


      {/* ======================================================
           2️⃣ SHORTLIST / MERIT LIST SECTION
      ====================================================== */}
      <h2 className="section-title">Shortlisted Candidates</h2>

      <div className="merit-box">
        {meritLists.map((m, i) => (
          <div className="merit-card" key={i}>
            <h3>{m.company}</h3>
            <p><strong>Round:</strong> {m.round}</p>

            <a className="merit-link" href={m.pdfLink} target="_blank" rel="noopener noreferrer">
              View Merit List PDF
            </a>
          </div>
        ))}
      </div>


      {/* ======================================================
           3️⃣ COMPLETED COMPANY VISITS
      ====================================================== */}
      <h2 className="section-title">Companies Visited & Placements</h2>

      <div className="completed-box">
        {completedCompanies.map((c, i) => (
          <div className="completed-card" key={i}>
            <h3>{c.company}</h3>
            <p><strong>Students Placed:</strong> {c.placed}</p>

            <a className="completed-link" href={c.pdfLink} target="_blank" rel="noopener noreferrer">
              View Selected Students PDF
            </a>
          </div>
        ))}
      </div>

    </div>
  );
};

export default JobUpdates;
