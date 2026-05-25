import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  GraduationCap,
  LogOut,
  Calendar,
  CalendarCheck,
  FileCheck,
  Users,
  Menu,
  LayoutDashboard,
  PlusCircle,
  Bell,
} from "lucide-react";

import { supabase } from "../lib/supabaseClient";

interface SidebarProps {
  role: "student" | "club-admin" | "faculty";
}

export function Sidebar({ role }: SidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) return;

      const user = sessionData.session.user;

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error(error);
        return;
      }

      setProfile(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const getDisplayName = () => {
    if (role === "student") {
      return profile?.full_name || profile?.name || "Student";
    }

    if (role === "club-admin") {
      return (
        profile?.club_name ||
        profile?.full_name ||
        profile?.name ||
        "Club Admin"
      );
    }

    if (role === "faculty") {
      return profile?.full_name || profile?.name || "Faculty";
    }

    return "User";
  };

  const getSubtitle = () => {
    if (role === "student") {
      return `USN: ${profile?.usn || "---"}`;
    }

    if (role === "club-admin") {
      return profile?.designation || "Club Administrator";
    }

    if (role === "faculty") {
      return profile?.department || "Faculty Member";
    }

    return "";
  };

  const getProfileImage = () => {
    if (profile?.passport_photo_url) return profile.passport_photo_url;
    if (profile?.photo_url) return profile.photo_url;
    if (profile?.profile_photo_url) return profile.profile_photo_url;

    return "https://i.pravatar.cc/150?u=student";
  };

  const getProfileLink = () => {
    if (role === "student") return "/student/profile-completion";
    if (role === "club-admin") return "/club-admin/dashboard";
    if (role === "faculty") return "/faculty/dashboard";
    return "/";
  };

  const getNavLinks = () => {
    switch (role) {
      case "student":
        return [
          { to: "/student/dashboard", icon: Calendar, label: "Upcoming Events" },
          {
            to: "/student/registrations",
            icon: CalendarCheck,
            label: "My Registrations",
          },
          {
            to: "/student/attendance",
            icon: FileCheck,
            label: "Attendance Status",
          },
          { to: "/student/clubs", icon: Users, label: "Campus Clubs" },
        ];

      case "club-admin":
        return [
          {
            to: "/club-admin/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
          },
          {
            to: "/club-admin/create-event",
            icon: PlusCircle,
            label: "Create Event",
          },
          {
            to: "/club-admin/manage-events",
            icon: Calendar,
            label: "Manage Events",
          },
          {
            to: "/club-admin/manage-clubs",
            icon: Users,
            label: "Manage Clubs",
          },
          {
            to: "/club-admin/registered-students",
            icon: Users,
            label: "Registered Students",
          },
          {
            to: "/club-admin/attendance-request",
            icon: FileCheck,
            label: "Attendance Request",
          },
        ];

      case "faculty":
        return [
          {
            to: "/faculty/dashboard",
            icon: LayoutDashboard,
            label: "Dashboard",
          },
          {
            to: "/faculty/attendance-requests",
            icon: FileCheck,
            label: "Attendance Requests",
          },
          {
            to: "/faculty/notifications",
            icon: Bell,
            label: "Notifications",
          },
        ];

      default:
        return [];
    }
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        <Menu size={24} className="text-slate-700" />
      </button>

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 bg-[#fbfbfb] border-r border-slate-200 w-64 flex flex-col transition-transform duration-300 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 p-6">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white">
            <GraduationCap size={20} />
          </div>

          <span className="font-bold text-xl text-slate-800 tracking-tight">
            CDG
          </span>
        </div>

        <div className="px-5 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            {role === "student" ? (
              <div className="w-16 h-16 rounded-full overflow-hidden mb-3 border-2 border-white shadow-sm bg-orange-100">
                <img
                  src={getProfileImage()}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center mb-3">
                {role === "club-admin" ? (
                  <Users size={26} />
                ) : (
                  <GraduationCap size={26} />
                )}
              </div>
            )}

            <h3 className="font-bold text-slate-800 text-sm">
              {getDisplayName()}
            </h3>

            <p className="text-[11px] text-slate-400 mb-4 font-medium uppercase tracking-wider">
              {getSubtitle()}
            </p>

            <Link
              to={getProfileLink()}
              className="w-full py-1.5 rounded-lg text-xs font-semibold text-orange-500 bg-orange-50 hover:bg-orange-100 transition-colors"
            >
              {role === "student" ? "View Profile" : "Dashboard"}
            </Link>
          </div>
        </div>

        <nav className="flex-1 px-3 flex flex-col gap-1 overflow-y-auto">
          {getNavLinks().map((link) => {
            const isActive =
              location.pathname === link.to ||
              (link.to === "/student/dashboard" && location.pathname === "/");

            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "text-orange-500 bg-orange-50/50 font-semibold shadow-sm border border-orange-100/50"
                    : "text-slate-500 hover:text-orange-500 hover:bg-slate-50 font-medium"
                }`}
              >
                <link.icon
                  size={18}
                  className={isActive ? "text-orange-500" : "text-slate-400"}
                />

                <span className="text-sm">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-5 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}