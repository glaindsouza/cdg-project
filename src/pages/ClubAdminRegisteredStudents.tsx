import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, Search, Download } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function ClubAdminRegisteredStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, []);

const fetchRegistrations = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  // FETCH ONLY THIS ADMIN'S EVENTS
  const { data: eventsData, error: eventsError } = await supabase
    .from("events")
    .select("id")
    .eq("created_by", user.id);

  if (eventsError) {
    console.error(eventsError);
    toast.error(eventsError.message);
    return;
  }

  const eventIds = eventsData?.map((event) => event.id) || [];

  if (eventIds.length === 0) {
    setStudents([]);
    return;
  }

  // FETCH REGISTRATIONS ONLY FOR THOSE EVENTS
  const { data, error } = await supabase
    .from("registrations")
    .select(`
      *,
      events(title)
    `)
    .in("event_id", eventIds)
    .order("id", { ascending: false });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  setStudents(data || []);
};

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();

    return (
      student.student_name?.toLowerCase().includes(keyword) ||
      student.usn?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="club-admin" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/club-admin/dashboard"
                className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Registered Students
                </h1>

                <p className="text-sm text-slate-500 font-medium">
                  View and manage event participants
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-slate-400" />
                </div>

                <input
                  type="text"
                  placeholder="Search USN or Name"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 w-full sm:w-64"
                />
              </div>

              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-sm shadow-sm">
                <Download size={16} />
                Export
              </button>
            </div>
          </header>

          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase font-bold tracking-wider text-slate-500">
                    <th className="px-6 py-5">Student Details</th>
                    <th className="px-6 py-5">Branch/Sem</th>
                    <th className="px-6 py-5">Contact</th>
                    <th className="px-6 py-5">Event</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">
                          {student.student_name}
                        </div>

                        <div className="text-xs text-slate-500 font-medium">
                          {student.usn}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-700">
                          {student.department}
                        </div>

                        <div className="text-xs text-slate-500 font-medium">
                          {student.semester} Sem
                        </div>
                      </td>

                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {student.phone}
                      </td>

                      <td className="px-6 py-4 font-bold text-slate-700">
                        {student.events?.title || "Event"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                          Registered
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-10 text-center text-slate-500 font-medium"
                      >
                        No registered students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}