/**
 * @author Anish
 * @description This is the the jsx file that is being displayed in main.jsx
 * @date 29-11-2025
 * @returns a JSX page
 */

// Imports
import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import FacultyPage from "./Pages/FacultyPage";
import NoticePage from "./Pages/NoticePage";

// Constants
// const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
    return (
      <>
        <Router>
          <div className="app-layout">
            
            {/* LEFT SIDEBAR */}
            <Sidebar />

            {/* RIGHT SIDE CONTENT */}
            <div className="main-content">
              <Routes>
                <Route path="/faculty" element={<FacultyPage />} />
                <Route path="/notices" element={<NoticePage />} />
                {/* Add other pages later */}
                <Route path="*" element={<FacultyPage />} />
              </Routes>
            </div>

          </div>
        </Router>
      </>
  );
}

export default App;
