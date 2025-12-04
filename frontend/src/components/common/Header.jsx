/**
 * @author Anish
 * @description Header component for the landing page (Airforce blue theme)
 * @date 30-11-2025 (updated)
 * @returns a JSX component
 */

import React from "react";
import { Link } from "react-router-dom";
import MakautLogo from "@/assets/self/makaut.png";
import GuestImg from "@/assets/self/guest.png";

export default function Header({ user }) {
  const profileImg = user?.img || GuestImg;

  return (
    <header className="w-full" aria-label="Department header">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

      {/* Main header */}
      <div className="bg-[#e6f0f7] border-b border-[#c7d7e2] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
            {/* LEFT: Logo + Branding */}
            <Link
              to="/"
              className="flex items-center gap-3 sm:gap-4 group min-w-0"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full opacity-40 blur group-hover:opacity-70 transition-opacity" />
                <img
                  src={MakautLogo || "/placeholder.svg"}
                  alt="MAKAUT Logo"
                  className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain bg-white p-1 shadow-md"
                />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm sm:text-base lg:text-lg font-semibold leading-tight tracking-tight text-[#0f1c2c]">
                  Department of Information Technology
                </h1>
                <p className="text-xs sm:text-sm mt-0.5 flex items-center gap-2 text-[#58677a]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  MAKAUT University
                </p>
              </div>
            </Link>

            {/* CENTER: Tagline - hidden on mobile */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-[#58677a]">
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-cyan-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                  Excellence
                </span>
                <span className="w-1 h-1 rounded-full bg-[#c7d7e2]" />
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                  Research
                </span>
                <span className="w-1 h-1 rounded-full bg-[#c7d7e2]" />
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-emerald-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  Innovation
                </span>
              </div>
            </div>

            {/* RIGHT: Actions + Profile */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Login Button */}
              <Link
                to="/auth/login"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 px-4 py-2 text-white text-sm font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 hover:scale-105"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                <span className="hidden sm:inline">Sign In</span>
              </Link>

              {/* Profile Section */}
              <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-[#c7d7e2]">
                <div className="flex items-center">
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full opacity-0 group-hover:opacity-40 blur transition-opacity" />
                    <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full ring-2 ring-[#c7d7e2] group-hover:ring-cyan-400/70 overflow-hidden transition-all bg-[#f8fbfd]">
                      <img
                        src={profileImg || "/placeholder.svg"}
                        alt={user?.name || "Guest profile"}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = GuestImg;
                        }}
                      />
                    </div>

                    {user && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-[#e6f0f7] rounded-full" />
                    )}
                  </div>

                  <div className="hidden md:flex flex-col min-w-0 ml-3">
                    <span className="text-[#0f1c2c] text-sm font-medium truncate max-w-[120px]">
                      {user?.name || "Guest User"}
                    </span>
                    <span className="text-[#58677a] text-xs truncate max-w-[120px]">
                      {user?.email || "Not signed in"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
