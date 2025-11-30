import React from "react";
import Header from "../Components/Header";
import "./ClassSchedule.css";

const ClassSchedule = () => {
  return (
    <div className="class-page">

      {/* HEADER */}
      <Header
        user={{
          name: "John Doe",
          email: "john@example.com",
          img: "/default-profile.png"
        }}
      />

      {/* TOP STUDENT INFO */}
      <div className="student-info">
        <span>Student Name – John Doe</span>
        <span>Email – john@example.com</span>
      </div>

      {/* CLASS SCHEDULE IMAGE */}
      <div className="schedule-container">
        <img
          src="/class-schedule.png"      // CHANGE THIS IMAGE PER STREAM
          alt="Class Schedule"
          className="schedule-img"
        />
      </div>

    </div>
  );
};

export default ClassSchedule;
