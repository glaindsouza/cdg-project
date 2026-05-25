import {
  CalendarCheck,
  Users,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export function HomeHero() {
  return (
    <>
      <section className="min-h-screen bg-[#F4F6F9] pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex justify-center">
  <div className="max-w-4xl w-full bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-[0_10px_50px_rgba(0,0,0,0.06)] p-10 md:p-16">

    <div className="inline-flex px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-xs font-bold mb-6">
      Campus Digital Gateway
    </div>

    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-6">
      A smarter way to manage campus activities.
    </h1>

    <p className="text-base md:text-lg text-slate-500 leading-relaxed mb-10 max-w-3xl">
      Streamline event registrations, club management, attendance approvals,
      notifications, and student engagement through one unified campus platform.
    </p>

    <div className="flex flex-col sm:flex-row gap-4">
      <Link
        to="/auth"
        className="px-7 py-3 rounded-2xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
      >
        Get Started
        <ArrowRight size={16} />
      </Link>

      <a
        href="#features"
        className="px-7 py-3 rounded-2xl bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200 transition-colors text-center"
      >
        Explore Features
      </a>
    </div>

  </div>
</div>
          <div
            id="features"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {[
              {
                title: "Student Access",
                desc: "Students can complete profiles, register for events, and track attendance.",
                icon: <CalendarCheck size={24} />,
              },
              {
                title: "Club Management",
                desc: "Club admins can create events, manage clubs, and view registrations.",
                icon: <Users size={24} />,
              },
              {
                title: "Faculty Approval",
                desc: "Faculty can review attendance requests and approve or reject them.",
                icon: <ShieldCheck size={24} />,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-5">
                  {item.icon}
                </div>

                <h3 className="font-bold text-slate-800 mb-2">
                  {item.title}
                </h3>

                <p className="text-sm text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}