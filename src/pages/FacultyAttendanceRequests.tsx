import { Sidebar } from "../components/Sidebar";
import {
  ArrowLeft,
  FileSpreadsheet,
  Check,
  X,
  MessageSquareText,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function FacultyAttendanceRequests() {
  const [requests, setRequests] = useState<any[]>([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const { data, error } = await supabase
      .from("attendance_requests")
      .select(`
        *,
        events(title)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    setRequests(data || []);
  };

const updateStatus = async (
  requestId: string,
  status: "approved" | "rejected"
) => {

  const request = requests.find((r) => r.id === requestId);

  if (!request) return;

  const { error } = await supabase
    .from("attendance_requests")
    .update({
      status,
      remarks: remarks[requestId] || "",
    })
    .eq("id", requestId);

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  // Create notification for club admin
  if (request.requested_by) {

    await supabase.from("notifications").insert([
      {
        user_id: request.requested_by,

        title:
          status === "approved"
            ? "Attendance Approved"
            : "Attendance Rejected",

       message:
  status === "approved"
    ? `Your attendance request for "${request.events?.title}" was approved by faculty.`
    : `Your attendance request for "${request.events?.title}" was rejected by faculty.`,
      },
    ]);
  }

  toast.success(`Request ${status}!`);

  fetchRequests();
};

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="faculty" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto p-8">
          <header className="flex items-center gap-4 mb-8">
            <Link
              to="/faculty/dashboard"
              className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Attendance Requests
              </h1>

              <p className="text-sm text-slate-500 font-medium">
                Review and approve club event attendance
              </p>
            </div>
          </header>

          <div className="space-y-6">
            {requests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100"
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-bold text-slate-800 tracking-tight">
                        {req.events?.title || "Event"}
                      </h2>

                      <span
                        className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide ${
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

                    <p className="text-sm font-bold text-orange-500 mb-4">
                      Attendance Approval Request
                    </p>

                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-4">
                      <div className="flex items-start gap-2 text-slate-600 text-sm">
                        <MessageSquareText
                          size={18}
                          className="text-slate-400 shrink-0 mt-0.5"
                        />

                        <p className="leading-relaxed">
                          "{req.remarks || "No remarks added"}"
                        </p>
                      </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold border border-blue-100 hover:bg-blue-100 transition-colors">
                      <FileSpreadsheet size={16} />
                      Attendance Sheet
                    </button>
                  </div>

                  {/* Actions */}
                  {req.status === "pending" && (
                    <div className="w-full md:w-72 bg-slate-50 rounded-2xl p-5 border border-slate-100 flex flex-col">
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                        Add Remarks
                      </label>

                      <textarea
                        rows={2}
                        value={remarks[req.id] || ""}
                        onChange={(e) =>
                          setRemarks({
                            ...remarks,
                            [req.id]: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none mb-4"
                        placeholder="Type feedback..."
                      />

                      <div className="grid grid-cols-2 gap-3 mt-auto">
                        <button
                          onClick={() =>
                            updateStatus(req.id, "rejected")
                          }
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-xl font-bold text-sm transition-colors"
                        >
                          <X size={16} />
                          Reject
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(req.id, "approved")
                          }
                          className="flex items-center justify-center gap-1.5 py-2.5 bg-green-500 text-white hover:bg-green-600 rounded-xl font-bold text-sm shadow-sm transition-colors"
                        >
                          <Check size={16} />
                          Approve
                        </button>
                      </div>
                    </div>
                  )}

                  {req.status !== "pending" && (
                    <div className="w-full md:w-72 flex items-center justify-center bg-slate-50 rounded-2xl p-5 border border-slate-100">
                      <p className="text-sm font-bold text-slate-400 text-center">
                        Action already taken.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {requests.length === 0 && (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 text-slate-500 font-medium">
                No attendance requests found.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}