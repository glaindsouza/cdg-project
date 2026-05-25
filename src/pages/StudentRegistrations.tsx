import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function StudentRegistrations() {
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return;

    const user = sessionData.session.user;

    const { data, error } = await supabase
      .from("registrations")
      .select("*")
      .eq("student_id", user.id)
      .order("registered_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    setRegisteredEvents(data || []);
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="student" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8">

          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/student/dashboard"
                className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  My Registrations
                </h1>

                <p className="text-sm text-slate-500 font-medium">
                  Manage and view your registered events
                </p>
              </div>
            </div>
          </header>

          {/* Registrations Table */}
          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                <Calendar size={20} />
              </div>

              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Registration History
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase font-bold tracking-wider text-slate-500">
                    <th className="px-8 py-5">Student Name</th>
                    <th className="px-6 py-5">Department</th>
                    <th className="px-6 py-5">USN</th>
                    <th className="px-6 py-5">Semester</th>
                    <th className="px-6 py-5">Status</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {registeredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5 font-bold text-slate-800">
                        {event.student_name}
                      </td>

                      <td className="px-6 py-5 text-slate-500 text-xs font-medium">
                        {event.department}
                      </td>

                      <td className="px-6 py-5 text-slate-500 text-xs font-medium">
                        {event.usn}
                      </td>

                      <td className="px-6 py-5 text-slate-500 text-xs font-medium">
                        {event.semester}
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                          Registered
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {registeredEvents.length === 0 && (
              <div className="p-12 text-center text-slate-500 font-medium">
                You haven't registered for any events yet.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}