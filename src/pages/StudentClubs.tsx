import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Users, Calendar, Clock, MapPin } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export function StudentClubs() {
  const [clubs, setClubs] = useState<any[]>([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      return;
    }

    setClubs(data || []);
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans">
      <Sidebar role="student" />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/student/dashboard"
              className="p-2 bg-white rounded-full border border-slate-200"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Campus Clubs
              </h1>
              <p className="text-sm text-slate-500">
                Explore clubs, auditions, and student communities
              </p>
            </div>
          </div>

          {clubs.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
              <p className="text-slate-500 font-medium">
                Clubs will appear here once created by club admins.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
                >
                  <div className="h-48 bg-slate-100">
                    {club.photo_url ? (
                      <img
                        src={club.photo_url}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-500">
                        <Users size={44} />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-xl font-bold text-slate-800 mb-1">
                      {club.name}
                    </h2>

                    <p className="text-xs font-bold text-orange-600 mb-3">
                      {club.category || "Club"}
                    </p>

                    <p className="text-sm text-slate-500 mb-5">
                      {club.description || "No description added."}
                    </p>

                    {club.is_audition_open ? (
                      <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 mb-5">
                        <p className="font-bold text-orange-700 mb-2">
                          Audition Open
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={15} />
                          {club.audition_date || "TBA"}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={15} />
                          {club.audition_time || "TBA"}
                        </p>

                        <p className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={15} />
                          {club.venue || "TBA"}
                        </p>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5">
                        <p className="text-sm text-slate-500 font-medium">
                          Auditions are currently closed.
                        </p>
                      </div>
                    )}

                    <button
                      disabled={!club.is_audition_open}
                      className={`w-full py-3 rounded-xl font-bold text-sm ${
                        club.is_audition_open
                          ? "bg-orange-500 text-white hover:bg-orange-600"
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {club.is_audition_open
                        ? "Register for Audition"
                        : "Explore Club"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}