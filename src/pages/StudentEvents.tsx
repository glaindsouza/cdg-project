import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Calendar,
  Users,
  Building,
  Info,
  CheckCircle2,
  X,
} from "lucide-react";

import { Link } from "@tanstack/react-router";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export function StudentEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const [selectedPoster, setSelectedPoster] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const defaultPoster =
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60";

  useEffect(() => {
    fetchEvents();
    fetchRegistrations();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    setEvents(data || []);
  };

  const fetchRegistrations = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return;

    const user = sessionData.session.user;

    const { data, error } = await supabase
      .from("registrations")
      .select("event_id")
      .eq("student_id", user.id);

    if (error) {
      console.error(error);
      return;
    }

    const ids = (data || []).map((item) => item.event_id);
    setRegisteredIds(ids);
  };

  const handleRegister = async (event: any) => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) {
      toast.error("Please login first");
      return;
    }

    const user = sessionData.session.user;

    if (registeredIds.includes(event.id)) {
      toast.error("Already registered for this event");
      setSelectedEvent(null);
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id);

    if (!profileData || profileData.length === 0) {
      toast.error("Complete profile first");
      return;
    }

    const profile = profileData[0];

    const { error } = await supabase.from("registrations").insert([
      {
        event_id: event.id,
        student_id: user.id,
        student_name: profile.full_name,
        student_email: profile.email,
        usn: profile.usn,
        department: profile.department,
        semester: profile.semester,
        phone: profile.phone,
      },
    ]);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    toast.success("Registered successfully!");

    setRegisteredIds([...registeredIds, event.id]);
    setSelectedEvent(null);
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="student" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto p-8">
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
                  All Campus Events
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Discover and register for upcoming activities
                </p>
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => {
              const isRegistered = registeredIds.includes(event.id);
              const poster = event.poster_url || defaultPoster;

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all flex flex-col group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    <img
                      src={poster}
                      alt={event.title}
                      onClick={() => setSelectedPoster(poster)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 cursor-pointer"
                    />

                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-bold text-orange-600 border border-white/50 shadow-sm">
                      {event.club_name || "Club"}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-bold text-slate-800 mb-4 tracking-tight">
                      {event.title}
                    </h2>

                    <div className="space-y-3 mb-6 flex-1">
                      <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
                        <Calendar
                          size={18}
                          className="text-orange-500 shrink-0 mt-0.5"
                        />
                        <span>{event.event_date || "TBA"}</span>
                      </div>

                      <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
                        <Clock
                          size={18}
                          className="text-blue-500 shrink-0 mt-0.5"
                        />
                        <span>{event.event_time || "TBA"}</span>
                      </div>

                      <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
                        <MapPin
                          size={18}
                          className="text-green-500 shrink-0 mt-0.5"
                        />
                        <span>{event.venue || "Venue TBA"}</span>
                      </div>

                      <div className="flex items-start gap-3 text-sm font-medium text-slate-600">
                        <Info
                          size={18}
                          className="text-purple-500 shrink-0 mt-0.5"
                        />
                        <span className="leading-relaxed text-slate-500">
                          {event.description || "No description available."}
                        </span>
                      </div>
                    </div>

                    {event.registration_link && (
                      <a
                        href={event.registration_link}
                        target="_blank"
                        rel="noreferrer"
                        className="mb-4 block text-center py-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-bold text-sm hover:bg-blue-100 transition-colors"
                      >
                        Open Google Form
                      </a>
                    )}

                    <div className="pt-4 border-t border-slate-100 mb-6 flex items-center justify-between text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Building size={14} />
                        {event.club_name || "Club"}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Users size={14} />
                        Open
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedEvent(event)}
                      disabled={isRegistered}
                      className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        isRegistered
                          ? "bg-green-50 text-green-600 border border-green-200 cursor-not-allowed"
                          : "bg-orange-500 text-white hover:bg-orange-600 shadow-sm hover:shadow-md active:scale-[0.98]"
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 size={18} />
                          Registered
                        </>
                      ) : (
                        "View & Register"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {events.length === 0 && (
              <div className="col-span-full bg-white rounded-3xl p-10 text-center border border-slate-100 text-slate-500 font-medium">
                No events available right now.
              </div>
            )}
          </div>
        </div>
      </main>

      {selectedPoster && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedPoster(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedPoster(null)}
            className="absolute top-6 right-6 bg-white text-slate-800 rounded-full p-2 shadow-lg"
          >
            <X size={22} />
          </button>

          <img
            src={selectedPoster}
            alt="Event poster"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl"
          />
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative">
            <button
              type="button"
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 bg-white text-slate-800 rounded-full p-2 shadow-lg z-10"
            >
              <X size={20} />
            </button>

            <img
              src={selectedEvent.poster_url || defaultPoster}
              alt={selectedEvent.title}
              className="w-full h-64 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                {selectedEvent.title}
              </h2>

              <p className="text-sm text-slate-500 mb-4">
                {selectedEvent.description || "No description available."}
              </p>

              <div className="space-y-2 text-sm text-slate-600 mb-6">
                <p>
                  <strong>Date:</strong> {selectedEvent.event_date || "TBA"}
                </p>
                <p>
                  <strong>Time:</strong> {selectedEvent.event_time || "TBA"}
                </p>
                <p>
                  <strong>Venue:</strong> {selectedEvent.venue || "TBA"}
                </p>
                <p>
                  <strong>Club:</strong> {selectedEvent.club_name || "Club"}
                </p>
              </div>

              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-6">
                <p className="font-bold text-orange-700 mb-1">
                  Confirm Your Registration
                </p>
                <p className="text-sm text-slate-600">
                  Are you willing to attend this event? Click confirm only if
                  you want to register.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => handleRegister(selectedEvent)}
                  className="flex-1 py-3 rounded-xl bg-orange-500 text-white font-bold hover:bg-orange-600"
                >
                  Confirm Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}