// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Sidebar from "./Components/Sidebar";
// import FacultyPage from "./Pages/FacultyPage";
// import NoticePage from "./Pages/NoticePage";
// import SelectionScreen from "./Pages/SelectionScreen";
// import ResultDetails from "./Pages/ResultDetails";
// import ClassSchedule from "./Pages/ClassSchedule";
// import JobUpdates from "./Pages/JobUpdates";
// import StudentProfile from "./Pages/StudentProfile";

// import "./App.css";

// function App() {
//   return (
//     <Router>
//       <div className="app-layout">
//         <Sidebar />

//         <div className="main-content">
//           <Routes>
//             {/* Main pages */}
//             <Route path="/faculty" element={<FacultyPage />} />
//             <Route path="/notice" element={<NoticePage />} />

//             {/* Result pages */}
//             <Route path="/results" element={<SelectionScreen />} />
//             <Route path="/result-details" element={<ResultDetails />} />

//             {/* Class Schedule page */}
//             <Route path="/schedule" element={<ClassSchedule />} />

//             {/* Job Updates page */}
//             <Route path="/jobs" element={<JobUpdates />} />

//             {/* Student Profile page */}
//             <Route path="/student-profile" element={<StudentProfile />} />

//             {/* Default */}
//             <Route path="*" element={<h2>404 – Page Not Found</h2>} />
//           </Routes>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;

/**
 * @author Anish
 * @description This is the main JSX file that will be rendered in Layout
 * @date 29-11-2025
 * @returns a JSX page
 */

// src/App.jsx
import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import StudentLayout from './layouts/StudentLayout'
import FacultyLayout from './layouts/FacultyLayout'

const Landing = lazy(() => import('./pages/LandingPage'))

// student pages
const StudentHome = lazy(() => import('./pages/student/StudentHome'))
const StudentProfile = lazy(() => import('./pages/student/StudentProfile'))
const StudentEvent = lazy(() => import('./pages/student/StudentEvent'))
const StudentJob = lazy(() => import('./pages/student/StudentJob'))
const StudentNotice = lazy(() => import('./pages/student/StudentNotice'))
const StudentResult = lazy(() => import('./pages/student/StudentResult'))
const StudentSchedule = lazy(() => import('./pages/student/StudentSchedule'))
const StudentSubject = lazy(() => import('./pages/student/StudentSubject'))


// faculty pages
const FacultyHome = lazy(() => import('./pages/faculty/FacultyHome'))
const FacultyProfile = lazy(() => import('./pages/faculty/FacultyProfile'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="p-6">Loading...</div>}>
        <Routes>
          {/* Public / root */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Landing />} />
          </Route>

          {/* Student area with its own layout */}
          <Route path="/student" element={<StudentLayout />}>
            <Route index element={<StudentHome />} />
            <Route path="profile" element={<StudentProfile />} />
            <Route path="notices" element={<StudentProfile />} />
            <Route path="schedule" element={<StudentSchedule />} />
            <Route path="subjects" element={<StudentSubject />} />
            <Route path="results" element={<StudentResult />} />
            <Route path="events" element={<StudentEvent />} />
            <Route path="jobs" element={<StudentJob />} />
          </Route>

          {/* Faculty area with its own layout */}
          <Route path="/faculty" element={<FacultyLayout />}>
            <Route index element={<FacultyHome />} />
            <Route path="profile" element={<FacultyProfile />} />
            {/* add more faculty routes here */}
          </Route>

          {/* 404 fallback - keep a simple one */}
          <Route path="*" element={<div className="p-6">404: Not found</div>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
