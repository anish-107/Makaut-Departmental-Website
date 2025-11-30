/**
 * @author Anish
 * @description This is the layout file for Student Section
 * @date 30-11-2025
 * @returns a JSX page
 */


import React from 'react'
import { Outlet } from 'react-router-dom'
import StudentSidebar from '@/components/student/StudentSidebar'
import StudentHeader from '@/components/student/StudentHeader';
import StudentFooter from "@/components/student/StudentFooter";


export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Header */}
      <StudentHeader />

      {/* Content Area → Sidebar + Main */}
      <div className="flex flex-1">
        
        {/* Sidebar (Left) */}
        <aside className="w-64 bg-white border-r">
          <StudentSidebar />
        </aside>

        {/* Main Content (Right) */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <StudentFooter />

    </div>
  );
}
