import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, UploadCloud, Send, FileSpreadsheet } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export function ClubAdminAttendanceRequest() {
  const [events, setEvents] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [sheetFile, setSheetFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

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
      toast.error(error.message);
      return;
    }

    setRequests(data || []);
  };

  const uploadAttendanceSheet = async () => {
    if (!sheetFile) return "";

    const fileExt = sheetFile.name.split(".").pop();
    const fileName = `attendance/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("attendance-sheets")
      .upload(fileName, sheetFile);

    if (error) throw error;

    const { data } = supabase.storage
      .from("attendance-sheets")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.eventId) {
      toast.error("Please select an event");
      return;
    }

    setLoading(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();

      if (!sessionData.session) {
        toast.error("Please login again");
        return;
      }

      const user = sessionData.session.user;

      const fileUrl = await uploadAttendanceSheet();

      const { error } = await supabase.from("attendance_requests").insert([
        {
          event_id: formData.eventId,
          requested_by: user.id,
          status: "pending",
          remarks: formData.remarks,
          file_url: fileUrl || null,
        },
      ]);

      if (error) {
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
            message: "A club admin has submitted an attendance request for approval.",
            is_read: false,
          }))
        );
      }

      toast.success("Attendance request sent successfully!");

      setFormData({ eventId: "", remarks: "" });
      setSheetFile(null);
      fetchRequests();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="club-admin" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <header className="lg:col-span-2 flex items-center gap-4 mb-4">
            <Link
              to="/club-admin/dashboard"
              className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
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
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
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
                  Remarks / Message
                </label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) =>
                    setFormData({ ...formData, remarks: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none resize-none"
                  placeholder="Add notes for the faculty..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Upload Attendance Sheet
                </label>

                <label className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer">
                  <UploadCloud size={28} className="mb-2 text-slate-400" />
                  <p className="text-sm font-bold text-slate-700">
                    {sheetFile ? sheetFile.name : "Upload Attendance Sheet"}
                  </p>
                  <p className="text-xs text-slate-400">.xlsx, .xls or .csv</p>

                  <input
                    type="file"
                    hidden
                    accept=".xlsx,.xls,.csv"
                    onChange={(e) => setSheetFile(e.target.files?.[0] || null)}
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60"
              >
                <Send size={18} />
                {loading ? "Sending..." : "Send Request"}
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-fit">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                Previous Requests
              </h2>
            </div>

            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase font-bold text-slate-500">
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Sheet</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>

              <tbody className="text-sm">
                {requests.map((req) => (
                  <tr key={req.id} className="border-b border-slate-50">
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {req.events?.title || "Event"}
                    </td>

                    <td className="px-6 py-4">
                      {req.file_url ? (
                        <a
                          href={req.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline"
                        >
                          <FileSpreadsheet size={15} />
                          View Sheet
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">No file</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase bg-yellow-100 text-yellow-700">
                        {req.status}
                      </span>
                    </td>
                  </tr>
                ))}

                {requests.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-10 text-center text-slate-500">
                      No attendance requests sent yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}