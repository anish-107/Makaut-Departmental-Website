/** AdminSidebar.jsx
 * @author Anish
 * @description This is the Sidebar Component for the admin panel
 * @date 2/12/2025
 * @returns a jsx component
 */



import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, User, Bell, Calendar, PartyPopper, Briefcase, GraduationCap, School, Book, BookOpen } from "lucide-react"

export default function AdminSidebar({ open, onClose, user }) {
  const { pathname } = useLocation()

  const isActive = (path) => {
    if (path === "/admin") return pathname === "/admin"
    return pathname?.startsWith(path)
  }

  const menu = [
    { name: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { name: "Programs", to: "/admin/program", icon: BookOpen },
    { name: "Students", to: "/admin/students", icon: GraduationCap },
    { name: "Faculty", to: "/admin/faculty", icon: School },
    { name: "Notices", to: "/admin/notices", icon: Bell },
    { name: "Schedule", to: "/admin/schedule", icon: Calendar },
    { name: "Events", to: "/admin/events", icon: PartyPopper },
    { name: "Job Updates", to: "/admin/jobs", icon: Briefcase },
    {name: "Subjects", to: "/admin/subjects", icon: Book},
  ]

  return (
    <>
      {open && <div onClick={onClose} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden" />}

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-64
          bg-gradient-to-b from-[#0a1628] via-[#0d1d35] to-[#0a1628]
          border-r border-white/5 shadow-xl
          flex flex-col
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Top Branding */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center">
            <GraduationCap className="text-cyan-400 w-5 h-5" />
          </div>
          <div>
            <div className="text-white font-medium text-sm">Dept. of IT</div>
            <div className="text-slate-400 text-xs">MAKAUT University</div>
          </div>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {menu.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`
                  group flex items-center gap-3 p-3 rounded-lg transition-all
                  ${active ? "bg-cyan-600/30 text-white border border-cyan-500/40" : "text-slate-300 hover:bg-white/10"}
                `}
              >
                <Icon className={`w-5 h-5 ${active ? "text-cyan-300" : "text-slate-400"}`} />
                <span className="whitespace-nowrap">{item.name}</span>
              </Link>
            )
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
          <div>
            <p className="text-slate-400 text-xs">Logged in as</p>
            <p className="text-white text-sm font-semibold">{user?.name || "Superadmin"}</p>
          </div>
        </div>
      </aside>
    </>
  )
}
