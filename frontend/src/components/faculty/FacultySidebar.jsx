/**
 * @author Anish
 * @description Faculty Sidebar
 * @date 30-11-2025
 */

import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Bell,
  Calendar,
  BookOpen,
  Award,
  PartyPopper,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  GraduationCap,
  School,
} from "lucide-react";

export default function FacultySidebar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    if (path === "/student") return pathname === "/student";
    return pathname?.startsWith(path);
  };

  // Disable body scroll when sidebar is open (mobile)
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const menu = [
    { name: "Dashboard", to: "faculty", icon: LayoutDashboard },
    { name: "Profile", to: "/faculty/profile", icon: User },
    { name: "Notices", to: "/faculty/notices", icon: Bell },
    { name: "Schedule", to: "/faculty/schedule", icon: Calendar },
    { name: "Students", to: "/faculty/students", icon: School },
    { name: "Results", to: "/faculty/results", icon: Award },
    { name: "Events", to: "/faculty/events", icon: PartyPopper },
    { name: "Job Updates", to: "/faculty/jobs", icon: Briefcase },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-24 left-4 z-[60] px-4 py-2 rounded-lg bg-[#0a1628]/95 text-slate-200 shadow-md flex items-center gap-2 border border-white/10"
      >
        <Menu className="w-5 h-5" />
        <span>Menu</span>
      </button>

      {/* BACKDROP (Mobile only) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:sticky
          top-0 lg:top-20
          left-0
          z-[70]
          h-screen lg:h-[calc(100vh-5rem-4rem)]
          bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]
          border-r border-white/5 shadow-xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${collapsed ? "w-20" : "w-64"}
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Branding */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between lg:justify-normal">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
              <GraduationCap className="text-cyan-400 w-5 h-5" />
            </div>

            {!collapsed && (
              <div>
                <div className="text-white font-medium text-sm">Dept. of IT</div>
                <div className="text-slate-400 text-xs">MAKAUT University</div>
              </div>
            )}
          </div>

          {/* Mobile Close Button */}
          <button
            className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20"
            onClick={() => setOpen(false)}
          >
            <X className="w-5 h-5 text-white" />
          </button>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed((prev) => !prev)}
            className="hidden lg:flex p-2 ml-auto rounded-lg bg-white/5 hover:bg-white/10 border border-white/10"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`
                  group flex items-center gap-3 p-3 rounded-lg transition-all
                  ${active ? "bg-cyan-600/30 text-white border border-cyan-500/40" : "text-slate-300 hover:bg-white/10"}
                  ${collapsed ? "justify-center" : ""}
                `}
              >
                <Icon className={`w-5 h-5 ${active ? "text-cyan-300" : "text-slate-400"}`} />

                {!collapsed && <span className="whitespace-nowrap">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* USER SECTION */}
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <User className="text-cyan-400 w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a1628]" />
          </div>

          {!collapsed && (
            <div>
              <p className="text-slate-400 text-xs">Logged in as</p>
              <p className="text-white text-sm font-semibold">Faculty Name</p>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
