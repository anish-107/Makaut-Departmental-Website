/**
 * @author Anish
 * @description Faculty Sidebar
 * @date 30-11-2025
 */

import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Bell,
  Calendar,
  PartyPopper,
  Briefcase,
  School,
} from "lucide-react";

export default function FacultySidebar({ open, onClose, user }) {
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (path === "/faculty") return pathname === "/faculty";
    return pathname?.startsWith(path);
  };

  const menu = [
    { name: "Dashboard", to: "/faculty", icon: LayoutDashboard },
    { name: "Profile", to: "/faculty/profile", icon: User },
    { name: "Notices", to: "/faculty/notices", icon: Bell },
    { name: "Schedule", to: "/faculty/schedule", icon: Calendar },
    { name: "Students", to: "/faculty/students", icon: School },
    { name: "Events", to: "/faculty/events", icon: PartyPopper },
    { name: "Job Updates", to: "/faculty/jobs", icon: Briefcase },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]
          border-r border-white/5 shadow-xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Top Branding */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
            <School className="text-cyan-400 w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-medium text-sm">Dept. of IT</div>
            <div className="text-slate-400 text-xs">MAKAUT University</div>
          </div>
        </div>

        {/* Menu items */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);

            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 p-3 rounded-lg transition-all
                  ${
                    active
                      ? "bg-cyan-600/30 text-white border border-cyan-500/40"
                      : "text-slate-300 hover:bg-white/10"
                  }
                `}
              >
                <Icon
                  className={`w-5 h-5 ${
                    active ? "text-cyan-300" : "text-slate-400"
                  }`}
                />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
              <User className="text-cyan-400 w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-[#0a1628]" />
          </div>
          <div className="min-w-0">
            <p className="text-slate-400 text-xs">Logged in as</p>
            <p className="text-white text-sm font-semibold truncate">
              {user?.name || "Faculty"}
            </p>
            {user?.email && (
              <p className="text-slate-400 text-xs truncate">
                {user.email}
              </p>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
