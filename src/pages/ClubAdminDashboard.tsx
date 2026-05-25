import { Sidebar } from '../components/Sidebar';
import { Calendar, Users, FileCheck, PlusCircle, LayoutDashboard } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
export function ClubAdminDashboard() {
  const [stats, setStats] = useState<any[]>([]);
const [recentEvents, setRecentEvents] = useState<any[]>([]);
const [requestStatus, setRequestStatus] = useState<any[]>([]);

useEffect(() => {
  fetchDashboardData();
}, []);
 const fetchDashboardData = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  // FETCH ONLY THIS ADMIN'S EVENTS
  const { data: events } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", user.id);

  const eventIds = events?.map((event) => event.id) || [];

  // FETCH ONLY REGISTRATIONS FOR THIS ADMIN'S EVENTS
  let registrations: any[] = [];

  if (eventIds.length > 0) {
    const { data: registrationsData } = await supabase
      .from("registrations")
      .select("*")
      .in("event_id", eventIds);

    registrations = registrationsData || [];
  }

  // ATTENDANCE REQUESTS
  const { data: requests } = await supabase
    .from("attendance_requests")
    .select("*")
    .eq("requested_by", user.id);

  setStats([
    {
      title: "Total Events",
      value: events?.length || 0,
      icon: <LayoutDashboard size={20} />,
      color: "text-orange-500",
      bg: "bg-orange-100",
    },
    {
      title: "Active Events",
      value:
        events?.filter((e) => e.status !== "completed").length || 0,
      icon: <Calendar size={20} />,
      color: "text-blue-500",
      bg: "bg-blue-100",
    },
    {
      title: "Total Registrations",
      value: registrations.length || 0,
      icon: <Users size={20} />,
      color: "text-green-500",
      bg: "bg-green-100",
    },
    {
      title: "Pending Requests",
      value:
        requests?.filter((r) => r.status === "pending").length || 0,
      icon: <FileCheck size={20} />,
      color: "text-yellow-500",
      bg: "bg-yellow-100",
    },
  ]);

  setRecentEvents(events || []);

  setRequestStatus(requests || []);
};
  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
     <Sidebar role="club-admin" />
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8">
          
          <header className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Club Admin Dashboard</h1>
            <p className="text-sm text-slate-500 font-medium">Manage your club events, students, and requests</p>
          </header>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-slate-800">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.title}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions & Recent Events */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Quick Actions */}
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <Link to="/club-admin/create-event" className="flex flex-col items-center p-4 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 transition-colors text-center group">
                    <PlusCircle size={24} className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-orange-700">Create Event</span>
                  </Link>
                  <Link to="/club-admin/manage-events" className="flex flex-col items-center p-4 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-100 transition-colors text-center group">
                    <Calendar size={24} className="text-blue-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-blue-700">Manage Events</span>
                  </Link>
                  <Link to="/club-admin/registered-students" className="flex flex-col items-center p-4 rounded-xl bg-green-50 hover:bg-green-100 border border-green-100 transition-colors text-center group">
                    <Users size={24} className="text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-green-700">View Students</span>
                  </Link>
                  <Link to="/club-admin/attendance-request" className="flex flex-col items-center p-4 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-100 transition-colors text-center group">
                    <FileCheck size={24} className="text-purple-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold text-purple-700">Send Request</span>
                  </Link>
                  
                  <Link
  to="/club-admin/create-club"
  className="flex flex-col items-center p-4 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors text-center group"
>
  <Users
    size={24}
    className="text-pink-500 mb-2 group-hover:scale-110 transition-transform"
  />

  <span className="text-xs font-bold text-pink-700">
    Create Club
  </span>
</Link>
<Link
  to="/club-admin/manage-clubs"
  className="flex flex-col items-center p-4 rounded-xl bg-pink-50 hover:bg-pink-100 border border-pink-100 transition-colors text-center group"
>
  <Users size={24} className="text-pink-500 mb-2 group-hover:scale-110 transition-transform" />
  <span className="text-xs font-bold text-pink-700">Manage Clubs</span>
</Link>
                </div>
              </div>

              {/* Recent Events */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-800">Recent Events</h2>
                  <Link to="/club-admin/manage-events" className="text-sm font-bold text-orange-500 hover:underline">View All</Link>
                </div>
                <div className="p-0">
                  <table className="w-full text-left">
                    <tbody className="text-sm">
                      {recentEvents.map(event => (
                        <tr key={event.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-800">{event.title}</td>
                          <td className="px-6 py-4 text-slate-500 text-xs font-medium">{event.event_date}</td>
                          <td className="px-6 py-4 text-right">
                            <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
  Active
</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
            </div>

            {/* Request Status Preview */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">
              <h2 className="text-lg font-bold text-slate-800 mb-4">Request Status</h2>
              <div className="space-y-4">
                {requestStatus.map((req, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-100 flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center shrink-0">
                   <FileCheck size={16} className={req.status === "approved" ? "text-green-500" : "text-yellow-500"} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{req.event_name || "Attendance Request"}</h3>
                      <p className="text-xs text-slate-500 mb-1">To: Faculty</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-400">{new Date(req.created_at).toLocaleDateString()}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span className={`text-[10px] font-bold ${req.status === "pending" ? 'text-yellow-600' : 'text-green-600'}`}>{req.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/club-admin/attendance-request" className="mt-6 block w-full py-2.5 rounded-xl border border-slate-200 text-center text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                View All Requests
              </Link>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
