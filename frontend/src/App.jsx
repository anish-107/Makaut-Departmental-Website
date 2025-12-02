/** App.jsx
 * @author Anish
 * @description This is the main JSX file that will be rendered in Layout
 * @date 29-11-2025
 * @returns a JSX page
 */


import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/layouts/MainLayout';
import StudentLayout from '@/layouts/StudentLayout';
import FacultyLayout from '@/layouts/FacultyLayout';
import AdminLayout from '@/layouts/AdminLayout';
import AuthProvider from "@/context/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute";

// Common Page
const Landing = lazy(() => import('@/pages/LandingPage'))

// student pages
const StudentHome = lazy(() => import('@/pages/student/StudentHome'))
const StudentProfile = lazy(() => import('@/pages/student/StudentProfile'))
const StudentEvent = lazy(() => import('@/pages/student/StudentEvent'))
const StudentJob = lazy(() => import('@/pages/student/StudentJob'))
const StudentNotice = lazy(() => import('@/pages/student/StudentNotice'))
const StudentSchedule = lazy(() => import('@/pages/student/StudentSchedule'))


// faculty pages
const FacultyHome = lazy(() => import('@/pages/faculty/FacultyHome'))
const FacultyProfile = lazy(() => import('@/pages/faculty/FacultyProfile'))
const FacultyEvent = lazy(() => import('@/pages/faculty/FacultyEvent'))
const FacultyJob = lazy(() => import('@/pages/faculty/FacultyJob'))
const FacultyNotice = lazy(() => import('@/pages/faculty/FacultyNotice'))
const FacultySchedule = lazy(() => import('@/pages/faculty/FacultySchedule'))
const FacultyStudents = lazy(() => import('@/pages/faculty/FacultyStudents'))

// Admin Pages
const AdminHome = lazy(() => import('@/pages/superadmin/AdminHome'))
const AdminProfile = lazy(() => import('@/pages/superadmin/AdminProfile'))
const AdminEvent = lazy(() => import('@/pages/superadmin/AdminEvent'))
const AdminJob = lazy(() => import('@/pages/superadmin/AdminJob'))
const AdminNotice = lazy(() => import('@/pages/superadmin/AdminNotice'))
const AdminSchedule = lazy(() => import('@/pages/superadmin/AdminSchedule'))
const AdminStudent = lazy(() => import('@/pages/superadmin/AdminStudent'))
const AdminFaculty = lazy(() => import('@/pages/superadmin/AdminFaculty'))

// Login
const Login = lazy(() => import('@/pages/auth/Login'))


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="p-6">Loading...</div>}>
          <Routes>
            {/* Public / root */}
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Landing />} />
            </Route>

            {/* Public login */}
            <Route path="/auth/login" element={
                <PublicOnlyRoute>
                  <Login />
                </PublicOnlyRoute>
              }
            />

            {/* Student area (must be logged in as student) */}
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={["student"]}>
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StudentHome />} />
              <Route path="profile" element={<StudentProfile />} />
              <Route path="notices" element={<StudentNotice />} />
              <Route path="schedule" element={<StudentSchedule />} />
              <Route path="events" element={<StudentEvent />} />
              <Route path="jobs" element={<StudentJob />} />
            </Route>

            {/* Faculty area (must be logged in as teacher) */}
            <Route
              path="/faculty"
              element={
                <ProtectedRoute allowedRoles={["teacher"]}>
                  <FacultyLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<FacultyHome />} />
              <Route path="profile" element={<FacultyProfile />} />
              <Route path="notices" element={<FacultyNotice />} />
              <Route path="schedule" element={<FacultySchedule />} />
              <Route path="students" element={<FacultyStudents />} />
              <Route path="events" element={<FacultyEvent />} />
              <Route path="jobs" element={<FacultyJob />} />
            </Route>

            {/* Admin area (must be logged in as admin) */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHome />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="notices" element={<AdminNotice />} />
              <Route path="schedule" element={<AdminSchedule />} />
              <Route path="students" element={<AdminStudent />} />
              <Route path="events" element={<AdminEvent />} />
              <Route path="jobs" element={<AdminJob />} />
              <Route path="faculty" element={<AdminFaculty />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<div className="p-6">404: Not found</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
