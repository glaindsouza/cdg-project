import { Link } from "@tanstack/react-router";
import { GraduationCap, Bell } from "lucide-react";

export function HomeNavbar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100 px-6 md:px-12 py-4 flex items-center justify-between">

      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-sm">
          <GraduationCap size={22} />
        </div>

        <div>
          <h1 className="font-bold text-xl text-slate-800 tracking-tight">
            CDG
          </h1>

          <p className="text-[11px] text-slate-400 font-medium">
            Campus Digital Gateway
          </p>
        </div>
      </div>

      {/* Center Nav */}
      <div className="hidden md:flex items-center gap-8">
        <a
          href="#features"
          className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors"
        >
          Features
        </a>

        <a
          href="#events"
          className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors"
        >
          Events
        </a>

        <a
          href="#clubs"
          className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors"
        >
          Clubs
        </a>

        <a
          href="#contact"
          className="text-sm font-semibold text-slate-600 hover:text-orange-500 transition-colors"
        >
          Contact
        </a>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        <button className="hidden md:flex w-10 h-10 rounded-xl border border-slate-200 bg-white items-center justify-center text-slate-500 hover:text-orange-500 hover:border-orange-200 transition-all">
          <Bell size={18} />
        </button>

        <Link
          to="/auth"
          className="px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors shadow-sm"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}