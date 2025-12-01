/**
 * @author Anish
 * @description This is the layout file for Faculty Section
 * @date 30-11-2025
 * @returns a JSX page
 */



import React from 'react'
import { Outlet } from 'react-router-dom'
import FacultySidebar from '@/components/faculty/FacultySidebar'
import FacultyHeader from '@/components/faculty/FacultyHeader';
import FacultyFooter from "@/components/faculty/FacultyFooter";


export default function StudentLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      
      {/* Header */}
      <FacultyHeader />

      {/* Content Area → Sidebar + Main */}
      <div className="flex flex-1">
        
        {/* Sidebar (Left) */}
        <aside className="w-64 bg-white border-r">
          <FacultySidebar />
        </aside>

        {/* Main Content (Right) */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <FacultyFooter />

    </div>
  );
}
