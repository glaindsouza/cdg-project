import { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Users, Calendar, MapPin, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";

export function ClubAdminManageClubs() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      toast.error(error.message);
      setLoading(false);
      return;
    }

    setClubs(data || []);
    setLoading(false);
  };

  const deleteClub = async (id: string) => {
    const confirmDelete = window.confirm("Delete this club?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("clubs").delete().eq("id", id);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Club deleted");
    fetchClubs();
  };

  return (
    <div className="flex min-h-screen bg-[#F4F6F9] font-sans">
      <Sidebar role="club-admin" />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/club-admin/dashboard"
              className="p-2 bg-white rounded-full border border-slate-200"
            >
              <ArrowLeft size={20} />
            </Link>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Manage Clubs
              </h1>
              <p className="text-sm text-slate-500">
                View and manage campus clubs
              </p>
            </div>
          </div>

          {loading ? (
            <p className="text-slate-500 font-medium">Loading clubs...</p>
          ) : clubs.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-slate-100">
              <p className="text-slate-500 font-medium">
                No clubs created yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <div
                  key={club.id}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm"
                >
                  <div className="h-44 bg-slate-100">
                    {club.photo_url ? (
                      <img
                        src={club.photo_url}
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-orange-500">
                        <Users size={40} />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-1">
                      {club.name}
                    </h2>

                    <p className="text-xs font-bold text-orange-600 mb-3">
                      {club.category || "Club"}
                    </p>

                    <p className="text-sm text-slate-500 mb-4 line-clamp-3">
                      {club.description || "No description added."}
                    </p>

                    {club.is_audition_open && (
                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-3 mb-4 text-xs text-slate-600">
                        <p className="font-bold text-orange-700 mb-1">
                          Audition Open
                        </p>
                        <p className="flex gap-2 items-center">
                          <Calendar size={13} />
                          {club.audition_date || "TBA"}
                        </p>
                        <p className="flex gap-2 items-center">
                          <MapPin size={13} />
                          {club.venue || "TBA"}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => deleteClub(club.id)}
                      className="w-full py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-100"
                    >
                      <Trash2 size={16} />
                      Delete Club
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