import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function StudentAttendance() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchAttendanceStatus();
  }, []);

  const fetchAttendanceStatus = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  const { data: registrations, error: regError } = await supabase
    .from("registrations")
    .select("event_id")
    .eq("student_id", user.id);

  if (regError) {
    console.error(regError);
    toast.error(regError.message);
    return;
  }

  const eventIds = registrations?.map((reg) => reg.event_id) || [];

  if (eventIds.length === 0) {
    setRequests([]);
    return;
  }

  const { data, error } = await supabase
    .from("attendance_requests")
    .select(`
      *,
      events(title)
    `)
    .in("event_id", eventIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  setRequests(data || []);
};

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="student" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto p-8">

          {/* Header */}
          <header className="flex items-center gap-4 mb-8">
            <Link
              to="/student/dashboard"
              className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Attendance Status
              </h1>

              <p className="text-sm text-slate-500 font-medium">
                Track approval status of your attended events
              </p>
            </div>
          </header>

          {/* Attendance Cards */}
          <div className="space-y-5">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">

                  {/* Left */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">
                      {req.events?.title || "Event"}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      Attendance approval request
                    </p>

                    <p className="text-xs text-slate-400 mt-3">
                      {new Date(req.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right */}
                  <div>
                    {req.status === "approved" && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 text-green-700 font-bold text-sm">
                        <CheckCircle2 size={18} />
                        Approved
                      </div>
                    )}

                    {req.status === "pending" && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-100 text-yellow-700 font-bold text-sm">
                        <Clock size={18} />
                        Pending
                      </div>
                    )}

                    {req.status === "rejected" && (
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 text-red-700 font-bold text-sm">
                        <XCircle size={18} />
                        Rejected
                      </div>
                    )}
                  </div>

                </div>

                {/* Remarks */}
                {req.remarks && (
                  <div className="mt-5 bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-1 uppercase tracking-wide">
                      Faculty Remarks
                    </p>

                    <p className="text-sm text-slate-700">
                      {req.remarks}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {requests.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 text-slate-500 font-medium">
                No attendance records found.
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}