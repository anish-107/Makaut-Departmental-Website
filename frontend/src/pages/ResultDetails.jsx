import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../Components/Header";
import "./ResultPage.css";

const ResultDetails = () => {
  const location = useLocation();

  // Safely extract values to avoid errors if state is missing
  const session = location.state?.session || "Not Provided";
  const semester = location.state?.semester || "Not Provided";

  return (
    <div className="result-page">

      {/* HEADER */}
      <Header
        user={{
          name: "John Doe",
          email: "john@example.com",
          img: "/default-profile.png",
        }}
      />

      {/* STUDENT INFO */}
      <div className="result-subheader">
        <span>Student Name - John Doe</span>
        <span>Email - john@example.com</span>
      </div>

      {/* SHOW SESSION */}
      <h3 className="session-info">Session: {session}</h3>

      {/* ========================================= */}
      {/* COURSE REGISTERED TABLE                   */}
      {/* ========================================= */}
      <h2 className="section-title">Course Registered</h2>

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
              <td>1</td>
              <td>VII</td>
              <td>HSMC-701</td>
              <td>Organizational Behavior</td>
              <td>Theory</td>
              <td>3.00</td>
              <td>Registered</td>
              <td>Not Registered</td>
            </tr>

            <tr>
              <td>2</td>
              <td>VII</td>
              <td>OEC-IT701D</td>
              <td>Numerical Methods</td>
              <td>Theory</td>
              <td>3.00</td>
              <td>Registered</td>
              <td>Not Registered</td>
            </tr>

            <tr>
              <td>3</td>
              <td>VII</td>
              <td>PCC-IT701</td>
              <td>Internet & Web Technology</td>
              <td>Theory</td>
              <td>3.00</td>
              <td>Registered</td>
              <td>Not Registered</td>
            </tr>

            <tr>
              <td>4</td>
              <td>VII</td>
              <td>PCC-IT791</td>
              <td>IWT Lab</td>
              <td>Practical</td>
              <td>2.00</td>
              <td>Registered</td>
              <td>Not Registered</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ========================================= */}
      {/* SEMESTER RESULT TABLE                    */}
      {/* ========================================= */}
      <h2 className="section-title">Semester {semester} Result</h2>

      <div className="course-table-container">
        <table className="course-table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Semester</th>
              <th>Credits</th>
              <th>Grade</th>
              <th>GD Points</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>PCC-IT401 - Discrete Mathematics</td>
              <td>IV</td>
              <td>4.0</td>
              <td>O</td>
              <td>10.00</td>
            </tr>

            <tr>
              <td>PCC-IT402 - Computer Organization & Architecture</td>
              <td>IV</td>
              <td>3.0</td>
              <td>A</td>
              <td>8.00</td>
            </tr>

            <tr>
              <td>PCC-IT403 - Automata Theory</td>
              <td>IV</td>
              <td>3.0</td>
              <td>A</td>
              <td>8.00</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* RESULT SUMMARY + DOWNLOAD BUTTON */}
      <div className="result-summary">
        <div>
          <p><strong>Total Credit:</strong> 18</p>
          <p><strong>SGPA:</strong> 8.85</p>
        </div>

        <button className="download-btn">Download Result</button>
      </div>

    </div>
  );
};

export default ResultDetails;
