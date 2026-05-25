import { Sidebar } from '../components/Sidebar';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function FacultyDashboard() {

  const [stats, setStats] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {

    // EVENTS
    const { data: events } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    // ATTENDANCE REQUESTS
    const { data: requests } = await supabase
      .from("attendance_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setStats([
      {
        title: 'Total Events',
        value: events?.length || 0,
        icon: <Calendar size={20} />,
        color: 'text-blue-500',
        bg: 'bg-blue-100'
      },
      {
        title: 'Pending Requests',
        value:
          requests?.filter((r) => r.status === "pending").length || 0,
        icon: <Clock size={20} />,
        color: 'text-yellow-500',
        bg: 'bg-yellow-100'
      },
      {
        title: 'Approved',
        value:
          requests?.filter((r) => r.status === "approved").length || 0,
        icon: <CheckCircle2 size={20} />,
        color: 'text-green-500',
        bg: 'bg-green-100'
      },
      {
        title: 'Rejected',
        value:
          requests?.filter((r) => r.status === "rejected").length || 0,
        icon: <XCircle size={20} />,
        color: 'text-red-500',
        bg: 'bg-red-100'
      },
    ]);

    setUpcomingEvents(events || []);
    setRecentRequests(requests || []);
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="faculty" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8">

          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
              Faculty Dashboard
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              Overview of campus activities and pending approvals
            </p>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>

                <div>
                  <div className="text-2xl font-extrabold text-slate-800">
                    {stat.value}
                  </div>

                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {stat.title}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Upcoming Events */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">
              <div className="p-6 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">
                  Upcoming Events
                </h2>
              </div>

              <div className="p-0">
                <table className="w-full text-left">
                  <tbody className="text-sm">

                    {upcomingEvents.map((event) => (
                      <tr
                        key={event.id}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-800">
                            {event.title}
                          </div>

                          <div className="text-xs font-medium text-slate-500">
                            {event.category || "Campus Event"}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {event.event_date}
                        </td>

                        <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                          {event.venue}
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Requests */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden h-fit">

              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-800">
                  Recent Attendance Requests
                </h2>

                <Link
                  to="/faculty/attendance-requests"
                  className="text-sm font-bold text-orange-500 hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="p-4 space-y-4">

                {recentRequests.map((req) => (

                  <div
                    key={req.id}
                    className="p-4 rounded-xl border border-slate-100 flex items-center justify-between"
                  >

                    <div>
                      <h3 className="font-bold text-slate-800 text-sm mb-1">
                        {req.event_name || "Attendance Request"}
                      </h3>

                      <p className="text-xs text-slate-500 font-medium">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wide
                      ${
                        req.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {req.status}
                    </span>

                  </div>

                ))}

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}