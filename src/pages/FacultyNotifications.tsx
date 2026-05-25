import { Sidebar } from "../components/Sidebar";
import { ArrowLeft, Bell, Info } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import toast from "react-hot-toast";
export function FacultyNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
  const { data: sessionData } = await supabase.auth.getSession();

  if (!sessionData.session) return;

  const user = sessionData.session.user;

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return;
  }

  setNotifications(data || []);
};

  const markAllAsRead = async () => {
    const { data: sessionData } = await supabase.auth.getSession();

    if (!sessionData.session) return;

    const user = sessionData.session.user;

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id);

    if (error) {
      console.error(error);
      toast.error(error.message);
      return;
    }

    fetchNotifications();
  };

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="faculty" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[800px] mx-auto p-8">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link
                to="/faculty/dashboard"
                className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                  Notifications
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                  Stay updated on campus activities
                </p>
              </div>
            </div>

            <button
              onClick={markAllAsRead}
              className="text-sm font-bold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Mark all as read
            </button>
          </header>

          <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center">
                <Bell size={20} />
              </div>

              <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                Recent Activity
              </h2>
            </div>

            <div className="divide-y divide-slate-100">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-6 flex gap-4 transition-colors hover:bg-slate-50 ${
                    !notif.read ? "bg-orange-50/30" : ""
                  }`}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-orange-100 text-orange-600">
                    <Info size={18} />
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3
                        className={`text-sm font-bold ${
                          !notif.read ? "text-slate-900" : "text-slate-700"
                        }`}
                      >
                        {notif.title}
                      </h3>

                      <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap ml-4">
                        {new Date(notif.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <p
                      className={`text-sm leading-relaxed ${
                        !notif.read
                          ? "text-slate-700 font-medium"
                          : "text-slate-500"
                      }`}
                    >
                      {notif.message}
                    </p>
                  </div>

                  {!notif.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-500 mt-2 shrink-0"></div>
                  )}
                </div>
              ))}

              {notifications.length === 0 && (
                <div className="p-10 text-center text-slate-500 font-medium">
                  No notifications yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}