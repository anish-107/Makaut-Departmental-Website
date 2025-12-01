import React, { useState } from "react";
import { Menu, GraduationCap } from "lucide-react";

const navigationLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Research", href: "#research" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-3">
          <div className="p-1 rounded-md bg-gradient-to-b from-white to-transparent">
            <GraduationCap className="text-maroon w-8 h-8" />
          </div>
          <span className="font-extrabold text-slate-900 text-lg">
            IT Department
          </span>
        </div>

        <nav className="hidden md:flex gap-6">
          {navigationLinks.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="font-semibold text-slate-700 hover:text-maroon"
            >
              {item.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button className="px-3 py-1 rounded-md bg-slate-100 text-slate-800 font-semibold">
            Admin Login
          </button>
          <button className="px-3 py-1 rounded-md bg-blue-700 text-white font-semibold">
            Faculty Login
          </button>
          <button className="px-3 py-1 rounded-full bg-yellow-400 text-slate-900 font-bold">
            Student Login
          </button>
        </div>

        <button
          className="md:hidden p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="menu"
        >
          <Menu />
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            {navigationLinks.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="py-2 text-slate-800 font-semibold"
              >
                {item.name}
              </a>
            ))}

            <div className="mt-2 flex flex-col gap-2">
              <button className="w-full py-2 rounded-md bg-slate-100">
                Admin Login
              </button>
              <button className="w-full py-2 rounded-md bg-blue-700 text-white">
                Faculty Login
              </button>
              <button className="w-full py-2 rounded-md bg-yellow-400 font-bold">
                Student Login
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
