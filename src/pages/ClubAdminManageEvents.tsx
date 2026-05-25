import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, Edit, Trash2, Eye } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function ClubAdminManageEvents() {
const [events, setEvents] = useState<any[]>([]);
const [registrationCounts, setRegistrationCounts] = useState<any>({});

  useEffect(() => {
    fetchEvents();
  }, []);
const fetchEvents = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  const { data: eventsData, error } = await supabase
    .from("events")
    .select("*")
    .eq("created_by", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    toast.error(error.message);
    return;
  }

  setEvents(eventsData || []);

  const eventIds = (eventsData || []).map((event) => event.id);

  if (eventIds.length === 0) {
    setRegistrationCounts({});
    return;
  }

  const { data: registrations } = await supabase
    .from("registrations")
    .select("event_id")
    .in("event_id", eventIds);

  const counts: any = {};

  registrations?.forEach((reg) => {
    counts[reg.event_id] = (counts[reg.event_id] || 0) + 1;
  });

  setRegistrationCounts(counts);
};

  const handleDelete = async (eventId: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this event?");

    if (!confirmDelete) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", eventId);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    toast.success("Event deleted successfully!");
    fetchEvents();
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="club-admin" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/club-admin/dashboard"
                className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Manage Events
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  View, edit, or delete your club&apos;s events
                </p>
              </div>
            </div>

            <Link
              to="/club-admin/create-event"
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-orange-500 hover:bg-orange-600 shadow-sm transition-colors"
            >
              Create New
            </Link>
          </header>

          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] uppercase font-bold tracking-wider text-slate-500">
                    <th className="px-8 py-5">Event Name</th>
                    <th className="px-6 py-5">Date</th>
                    <th className="px-6 py-5">Venue</th>
                    <th className="px-6 py-5">Registrations</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {events.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5 font-bold text-slate-800">
                        {event.title}
                      </td>

                      <td className="px-6 py-5 text-slate-600 font-medium">
                        {event.event_date || "Not set"}
                      </td>

                      <td className="px-6 py-5 text-slate-500 text-xs font-medium">
                        {event.venue || "Not set"}
                      </td>

                      <td className="px-6 py-5 font-bold text-slate-700">
                        {registrationCounts[event.id] || 0}
                      </td>

                      <td className="px-6 py-5">
                        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                          Active
                        </span>
                      </td>

                      <td className="px-8 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            className="p-2 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {events.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-8 py-12 text-center text-slate-500 font-medium"
                      >
                        No events created yet.
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