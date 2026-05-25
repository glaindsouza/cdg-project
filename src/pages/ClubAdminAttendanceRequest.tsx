import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, UploadCloud, Send } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function ClubAdminAttendanceRequest() {
  const [events, setEvents] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    eventId: "",
    remarks: "",
  });

  useEffect(() => {
    fetchEvents();
    fetchRequests();
  }, []);

  const fetchEvents = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  setEvents(data || []);
};

 const fetchRequests = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  const { data, error } = await supabase
    .from("attendance_requests")
    .select("*, events(title)")
    .eq("requested_by", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  setRequests(data || []);
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventId) {
      toast.error("Please select an event");
      return;
    }

    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      toast.error("Please login again");
      return;
    }

    const user = sessionData.session.user;

    const { error } = await supabase.from("attendance_requests").insert([
      {
        event_id: formData.eventId,
        requested_by: user.id,
        status: "pending",
        remarks: formData.remarks,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }
const { data: facultyUsers } = await supabase
  .from("profiles")
  .select("user_id")
  .eq("role", "faculty");

if (facultyUsers && facultyUsers.length > 0) {
  await supabase.from("notifications").insert(
    facultyUsers.map((faculty) => ({
      user_id: faculty.user_id,
      title: "New Attendance Request",
      message:
        "A club admin has submitted an attendance request for approval.",
      is_read: false,
    }))
  );
}
    toast.success("Attendance request sent successfully!");

    setFormData({
      eventId: "",
      remarks: "",
    });

    fetchRequests();
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="club-admin" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <header className="lg:col-span-2 flex items-center gap-4 mb-4">
            <Link
              to="/club-admin/dashboard"
              className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                Attendance Request
              </h1>
              <p className="text-sm text-slate-500 font-medium">
                Send attendance requests to faculty for approval
              </p>
            </div>
          </header>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-6">
              New Request
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Select Event
                </label>
                <select
                  value={formData.eventId}
                  onChange={(e) =>
                    setFormData({ ...formData, eventId: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium text-slate-600 appearance-none"
                >
                  <option value="">-- Choose an event --</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Faculty
                </label>
                <input
                  type="text"
                  readOnly
                  value="Faculty approval pending"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 outline-none font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Remarks / Message
                </label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all font-medium resize-none"
                  placeholder="Add any notes for the faculty..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Upload Attendance Sheet
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                  <UploadCloud size={28} className="mb-2 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">
                    Excel upload will be connected later
                  </p>
                  <p className="text-xs text-slate-400">.xlsx or .csv</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm transition-all active:scale-[0.98]"
              >
                <Send size={18} />
                Send Request
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Previous Requests
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase font-bold tracking-wider text-slate-500">
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Remarks</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50"
                    >
                      <td className="px-6 py-4 font-bold text-slate-800">
                        {req.events?.title || "Event"}
                      </td>

                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {req.remarks || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide ${
                            req.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : req.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {requests.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-10 text-center text-slate-500 font-medium"
                      >
                        No attendance requests sent yet.
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