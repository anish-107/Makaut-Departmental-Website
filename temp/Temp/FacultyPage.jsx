import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import FacultyCard from "../../Components/FacultyCard";
import "./Facultypage.css";

const FacultyPage = () => {
  const [user, setUser] = useState(null);
  const [facultyList, setFacultyList] = useState([]);


  useEffect(() => {
    // Student Info
    setUser({
      name: "I am Sam",
      email: "iamsam88@example.com",
      img: "/iamsam.jpeg",
    });

    // Faculty List — replace with backend API later
    setFacultyList([
      {
        id: 1,
        name: "Prof. A Sharma",
        interest: "Machine Learning",
        department: "IT",
        contact: "9876543210",
        email: "a.sharma@college.edu",
        img: "https://in.pinterest.com/pin/244320348531270968/"
      },
      {
        id: 2,
        name: "Prof. Ritika Sen",
        interest: "Cyber Security",
        department: "IT",
        contact: "9123456780",
        email: "ritika.sen@college.edu",
        img: "/default-profile.png"
      },
      {
        id: 3,
        name: "Prof. Devraj Ghosh",
        interest: "Data Science",
        department: "CSE",
        contact: "9898989898",
        email: "d.ghosh@college.edu",
        img: "/default-profile.png"
      }
    ]);
  }, []);

  return (
    <div className="faculty-page">

      {/* HEADER */}
      {user && <Header user={user} />}

      {/* STUDENT INFO */}
      <div className="faculty-page-subheader">
        <span>Student Name – {user?.name}</span>
        <span>Email – {user?.email}</span>
      </div>

      {/* FACULTY LIST */}
      <div className="faculty-list">
        {facultyList.map((fac) => (
          <div key={fac.id} className="faculty-card-wrapper">
            <FacultyCard faculty={fac} />

            {/* VIEW PROFILE BUTTON */}
            <button
              className="faculty-message-btn"
              onClick={() => alert("Chat feature coming soon!")}
            >
              Send Message
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FacultyPage;
