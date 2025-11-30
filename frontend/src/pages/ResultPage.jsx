import React, { useState } from "react";
import Header from "../Components/Header";
import "./ResultPage.css";
import { useNavigate } from "react-router-dom";

const SelectionScreen = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState("");
  const [semester, setSemester] = useState("");

  const handleView = () => {
    if (!session || !semester) {
      alert("Please select both session and semester.");
      return;
    }

    navigate("/result-details", {
      state: { session, semester }
    });
  };

  return (
    <div className="result-page">

      <Header user={{
        name: "John Doe",
        email: "john@example.com",
        img: "/default-profile.png"
      }} />

      <div className="result-subheader">
        <span>Student Name - John Doe</span>
        <span>Email - john@example.com</span>
      </div>

      <div className="select-section">

        {/* ------------------------------------------ */}
        {/* COURSE REGISTERED — SHOW AT TOP            */}
        {/* ------------------------------------------ */}
        <h2 className="course-title">Course Registered</h2>

        <div className="course-table-container">
          <table className="course-table">
            <thead>
              <tr>
                <th>Sr No.</th>
                <th>Semester</th>
                <th>CCode</th>
                <th>Course Name</th>
                <th>Subject Type</th>
                <th>Credits</th>
                <th>Course Registration Status</th>
                <th>Exam Registration Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>1</td><td>VII</td><td>HSMC-701</td><td>Organizational Behavior</td>
                <td>Theory</td><td>3.00</td><td>Registered</td><td>Not Registered</td>
              </tr>
              <tr>
                <td>2</td><td>VII</td><td>OEC-IT701D</td><td>Numerical Methods</td>
                <td>Theory</td><td>3.00</td><td>Registered</td><td>Not Registered</td>
              </tr>
              <tr>
                <td>3</td><td>VII</td><td>PCC-IT701</td><td>Internet & Web Technology</td>
                <td>Theory</td><td>3.00</td><td>Registered</td><td>Not Registered</td>
              </tr>
              <tr>
                <td>4</td><td>VII</td><td>PCC-IT791</td><td>IWT Lab</td>
                <td>Practical</td><td>2.00</td><td>Registered</td><td>Not Registered</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ------------------------------------------ */}
        {/* STUDENT RESULT FORM BELOW THE TABLE        */}
        {/* ------------------------------------------ */}
        <h2 className="section-title form-title">STUDENT RESULT</h2>

        <div className="select-row">

          {/* SESSION DROPDOWN */}
          <div className="select-box">
            <label>*Session</label>
            <select value={session} onChange={(e) => setSession(e.target.value)}>
              <option value="">Please Select</option>
              <option value="2023-24">2023-24</option>
              <option value="2022-23">2022-23</option>
            </select>
          </div>

          {/* SEMESTER DROPDOWN */}
          <div className="select-box">
            <label>*Semester</label>
            <select value={semester} onChange={(e) => setSemester(e.target.value)}>
              <option value="">Please Select</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
            </select>
          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* BUTTONS AT THE VERY BOTTOM                 */}
        {/* ------------------------------------------ */}
        <div className="result-btn-row bottom-btns">
          <button className="view-marks-btn" onClick={handleView}>View Result</button>
          <button className="cancel-btn">Cancel</button>
        </div>

      </div>

    </div>
  );
};

export default SelectionScreen;
