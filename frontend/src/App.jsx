import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import FacultyPage from "./Pages/FacultyPage";
import NoticePage from "./Pages/NoticePage";
import SelectionScreen from "./Pages/SelectionScreen";
import ResultDetails from "./Pages/ResultDetails";
import ClassSchedule from "./Pages/ClassSchedule";
import JobUpdates from "./Pages/JobUpdates";
import StudentProfile from "./Pages/StudentProfile";


import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Sidebar />

        <div className="main-content">
          <Routes>
            {/* Main pages */}
            <Route path="/faculty" element={<FacultyPage />} />
            <Route path="/notice" element={<NoticePage />} />

            {/* Result pages */}
            <Route path="/results" element={<SelectionScreen />} />
            <Route path="/result-details" element={<ResultDetails />} />

            {/* Class Schedule page */}
            <Route path="/schedule" element={<ClassSchedule />} />

            {/* Job Updates page */}
            <Route path="/jobs" element={<JobUpdates />} />
            
            {/* Student Profile page */}
            <Route path="/student-profile" element={<StudentProfile />} />

            {/* Default */}
            <Route path="*" element={<h2>404 – Page Not Found</h2>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
