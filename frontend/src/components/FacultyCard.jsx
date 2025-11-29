import React from "react";
import "./FacultyCard.css";

const FacultyCard = ({ faculty }) => {
  return (
    <div className="faculty-card">
      <h3>{faculty.name}</h3>
      <p><strong>Department:</strong> {faculty.department}</p>
      <p><strong>Area of Interest:</strong> {faculty.interest}</p>
      <p><strong>Contact:</strong> {faculty.contact}</p>
      <p><strong>Email:</strong> {faculty.email}</p>
    </div>
  );
};

export default FacultyCard;
