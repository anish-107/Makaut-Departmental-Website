import React, { useEffect, useState } from "react";
import Header from "../Components/Header";
import FacultyCard from "../Components/FacultyCard";
import "./Facultypage.css";

const FacultyPage = () => {
  const [user, setUser] = useState(null);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    setUser({
      name: "John Doe",
      email: "john@example.com",
      img: "/default-profile.png",
    });

    // Replace with API later
    setFacultyList([
      {
        id: 1,
        name: "Prof. A Sharma",
        interest: "Machine Learning",
        department: "IT",
        contact: "9876543210",
        email: "a.sharma@college.edu",
      },
    ]);
  }, []);

  return (
    <div className="faculty-page">
      {user && <Header user={user} />}

      <div className="faculty-page-subheader">
        <span>Student Name - {user?.name}</span>
        <span>Email - {user?.email}</span>
      </div>

      <div className="faculty-list">
        {facultyList.map((fac) => (
          <FacultyCard key={fac.id} faculty={fac} />
        ))}
      </div>
    </div>
  );
};

export default FacultyPage;
