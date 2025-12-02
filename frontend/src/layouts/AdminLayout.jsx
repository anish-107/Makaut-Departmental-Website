/**
 * @author Anish
 * @description This is the layout file for Admin Panel
 * @date 2-12-2025
 * @returns a JSX Layout
 */

import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import AdminSidebar from "@/components/superadmin/AdminSidebar";
import AdminHeader from "@/components/superadmin/AdminHeader";
import AdminFooter from "@/components/superadmin/AdminFooter";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <AdminHeader user={user} />

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-20 z-30 px-4 py-2 rounded-lg bg-[#0a1628]/95 text-slate-200 shadow-md flex items-center gap-2 border border-white/10 hover:bg-[#0a1628] transition-colors"
        aria-label="Open sidebar"
      >
        <Menu className="w-5 h-5" />
        <span className="hidden sm:inline">Menu</span>
      </button>

      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="fixed top-4 left-[17rem] z-50 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Content Area */}
      <div className="flex flex-1">
        <main className="flex-1 pt-20">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <AdminFooter />
    </div>
  );
}
