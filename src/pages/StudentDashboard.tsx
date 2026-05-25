import { Sidebar } from "../components/Sidebar";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { EventCard } from "../components/EventCard";
import { Link } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useNavigate } from "@tanstack/react-router";
import {
  Search,
  Bell,
  Settings,
  Rocket,
  CheckCircle2,
  Hourglass,
  Calendar,
  ChevronDown,
  Download,
  Plus,
  
  Users,
} from "lucide-react";

export function StudentDashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [studentName, setStudentName] = useState("");
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [attendances, setAttendances] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
const [clubs, setClubs] = useState<any[]>([]);
  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);

      await Promise.all([
        fetchEvents(),
        fetchStudent(),
        fetchRegistrations(),
        fetchAttendance(),
        fetchNotifications(),
        fetchClubs(),
      ]);

      setLoading(false);
    };

    loadDashboard();
  }, []);
const navigate = useNavigate();
  const fetchStudent = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return;

    const user = sessionData.session.user;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.length > 0) {
      setStudentName(data[0].name || data[0].full_name || "Student");
    }
  };

  const fetchRegistrations = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return;

    const user = sessionData.session.user;

    const { data, error } = await supabase
      .from("registrations")
      .select(`
        *,
        events (
          title,
          event_date,
          venue
        )
      `)
      .eq("student_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    setRegisteredEvents(data || []);
    setRegisteredEventIds(
  (data || []).map((item) => item.event_id)
);
  };

  const fetchAttendance = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return;

    const user = sessionData.session.user;

    const { data, error } = await supabase
      .from("attendance_requests")
      .select(`
        *,
        events (
          title
        )
      `)
      .eq("requested_by", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setAttendances(data || []);
  };
const fetchNotifications = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_read", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setNotificationCount(data?.length || 0);
};
  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setUpcomingEvents(data || []);
  };
const fetchClubs = async () => {
  const { data, error } = await supabase
    .from("clubs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setClubs(data || []);
};
  const handleRegister = async (eventId: string) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      toast.error("Please login first");
      return;
    }

    const user = sessionData.session.user;

    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id);

    const profile = profiles?.[0];

    if (profileError || !profile) {
      toast.error("Complete profile first");
      return;
    }

    const { data: existing } = await supabase
      .from("registrations")
      .select("*")
      .eq("event_id", eventId)
      .eq("student_id", user.id);

    if (existing && existing.length > 0) {
      toast.error("Already registered for this event");
      return;
    }

   const { error } = await supabase.from("registrations").insert([
  {
    event_id: eventId,
    student_id: user.id,
    student_name: profile.name || profile.full_name,
    student_email: profile.email,
    department: profile.department,
  },
]);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    toast.success("Registered successfully!");

    fetchRegistrations();
  } catch (err) {
    console.error(err);
    toast.error("Something went wrong");
  }
};

  const filteredEvents = upcomingEvents.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="student" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1200px] mx-auto p-8">
          <header className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-orange-500 tracking-tight">
              Dashboard
            </h1>

            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  placeholder="Search events, clubs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white rounded-full text-sm border border-slate-200 w-64 focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition-all"
                />
              </div>

              <Link
                to="/student/notifications"
                className="relative p-2 text-slate-500 hover:bg-white rounded-full transition-colors"
              >
                <Bell size={20} />

                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center font-bold">
                    {notificationCount}
                  </span>
                )}
              </Link>

              <Link
  to="/student/profile-completion"
  className="p-2 text-slate-500 hover:bg-white rounded-full transition-colors"
>
  <Settings size={20} />
</Link>
            </div>
          </header>

          <div className="relative bg-gradient-to-r from-[#D97706] to-[#FBBF24] rounded-2xl p-8 text-white shadow-md mb-8 overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">
                Welcome back, {studentName || "Student"}!
              </h2>

              <p className="text-white/90 text-sm mb-6 font-medium">
                You have {upcomingEvents.length} upcoming events this week.
              </p>

              <button className="bg-white text-orange-600 font-bold px-6 py-2.5 rounded-xl text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
                View Schedule
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 flex flex-col h-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Rocket size={18} className="text-orange-500" />
                  Upcoming Events
                </h3>

              <Link
  to="/student/events"
  className="text-orange-500 font-bold text-xs hover:underline"
>
  See all
</Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 flex-1">
                {loading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl h-64 animate-pulse border border-slate-100"
                    />
                  ))
                ) : filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => (
                    <EventCard
                    isRegistered={registeredEventIds.includes(event.id)}
                      key={event.id}
                      eventId={event.id}
                      title={event.title}
                      category={event.category || "Event"}
                      dateStr={event.event_date || "TBA"}
                      time={event.event_time || "TBA"}
                      venue={event.venue || "Venue TBA"}
                      imageUrl={
                        event.poster_url ||
                        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"
                      }
                      onRegister={() =>
  navigate({
    to: "/student/events",
  })
}
                    />
                  ))
                ) : (
                  <div className="col-span-2 bg-white rounded-2xl border border-slate-100 p-10 text-center">
                    <p className="text-slate-500 font-medium">
                      No matching events found.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                <div className="w-5 h-5 rounded-md border-2 border-orange-500 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500"></div>
                </div>
                Attendance
              </h3>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex-1 flex flex-col gap-4">
                {attendances.map((item) => {
                  const isApproved =
                    item.status?.toLowerCase() === "approved";

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors"
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shrink-0 ${
                          isApproved
                            ? "border-green-100 text-green-500"
                            : "border-yellow-100 text-yellow-500"
                        }`}
                      >
                        {isApproved ? (
                          <CheckCircle2 size={20} />
                        ) : (
                          <Hourglass size={18} />
                        )}
                      </div>

                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {item.events?.title || "Event"}
                        </h4>

                        <p className="text-[11px] text-slate-500 font-medium mb-1">
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>

                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            isApproved
                              ? "text-green-600 bg-green-50"
                              : "text-yellow-600 bg-yellow-50"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {attendances.length === 0 && (
                  <p className="text-sm text-slate-500 font-medium text-center py-8">
                    No attendance records yet.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Calendar size={18} className="text-orange-500" />
                Events Registered
              </h3>

              <div className="flex items-center gap-2">
                <button className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50">
                  <ChevronDown size={16} />
                </button>

                <button className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-500 hover:bg-slate-50">
                  <Download size={16} />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden relative">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    <th className="px-6 py-4">Event Name</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Venue</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="text-sm">
                  {registeredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 flex items-center gap-3 font-bold text-slate-800">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-orange-100">
                          <Calendar size={16} className="text-orange-600" />
                        </div>
                        {event.events?.title || "Event"}
                      </td>

                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {event.events?.event_date || "-"}
                      </td>

                      <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                        {event.events?.venue || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide bg-green-100 text-green-700">
                          Registered
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-xs pr-12">
                        <button className="text-orange-600 hover:underline">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}

                  {registeredEvents.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-8 text-center text-slate-500 font-medium"
                      >
                        You have not registered for any events yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <button className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#A0522D] rounded-full text-white flex items-center justify-center shadow-md hover:bg-[#8B4513] transition-colors">
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users size={18} className="text-orange-500" />
                Campus Clubs
              </h3>
<Link
  to="/student/clubs"
  className="text-orange-500 font-bold text-xs hover:underline"
>
  Explore More
</Link>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
  {clubs.length > 0 ? (
    clubs.map((club) => (
      <div
        key={club.id}
        className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-all min-h-[280px]"
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-orange-100">
          <Users size={24} className="text-orange-500" />
        </div>

        <h4 className="font-bold text-slate-800 text-sm mb-2">
          {club.name}
        </h4>

        <p className="text-[11px] text-slate-500 font-medium leading-relaxed mb-6">
          {club.description ||
            "Explore this club and participate in campus activities."}
        </p>

        {club.is_audition_open && (
          <div className="w-full text-left bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4">
            <p className="text-[11px] font-bold text-orange-700 mb-1">
              Audition Open
            </p>

            <p className="text-[11px] text-slate-600">
              Date: {club.audition_date || "TBA"}
            </p>

            <p className="text-[11px] text-slate-600">
              Venue: {club.venue || "TBA"}
            </p>
          </div>
        )}

        <button className="w-full py-2 rounded-xl text-xs font-bold border mt-auto transition-colors hover:bg-slate-50 border-orange-500 text-orange-500">
          {club.is_audition_open
            ? "Register for Audition"
            : "Explore Club"}
        </button>
      </div>
    ))
  ) : (
    <div className="col-span-4 bg-white rounded-2xl border border-slate-100 p-10 text-center">
      <p className="text-slate-500 font-medium">
        Clubs will appear here once created by club admins.
      </p>
    </div>
  )}
</div>
          </div>
        </div>
      </main>
    </div>
  );
}