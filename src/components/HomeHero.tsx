import { CalendarPlus, ClipboardCheck, Users } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function HomeHero() {
  return (
    <>
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          {/* Using a reliable high-quality placeholder video of students on campus */}
          <source src="https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-4253-large.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-black/60 z-10"></div>

        {/* Centered Content */}
        <div className="relative z-20 text-center px-6 max-w-4xl mx-auto flex flex-col items-center mt-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-orange-400 font-bold text-xs tracking-wider uppercase mb-8 border border-white/20">
            Campus Digital Gateway
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg leading-[1.1]">
            MVJ College of <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Engineering</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-white/90 mb-6 drop-shadow-md">
            Empowering Students Through Innovation & Events
          </h2>
          
          <p className="text-lg text-white/80 mb-12 leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-sm">
            Explore, Participate, and Grow through Campus Activities. The ultimate platform for managing your college life, attendance, and club events all in one place.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
            <Link 
              to="/student/dashboard" 
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-orange-500 text-white font-bold text-lg hover:bg-orange-600 hover:-translate-y-0.5 transition-all shadow-[0_8px_20px_rgba(249,115,22,0.4)] flex items-center justify-center"
            >
              Get Started
            </Link>
            <a 
              href="#events" 
              className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-lg border border-white/30 hover:bg-white/20 hover:-translate-y-0.5 transition-all text-center"
            >
              Browse Events
            </a>
          </div>
        </div>
      </section>

      {/* What You Can Do Section */}
      <section className="py-24 bg-[#F4F6F9]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full">
          <h2 className="text-3xl font-extrabold text-slate-800 mb-10 text-center sm:text-left tracking-tight">What You Can Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Register for Events", desc: "Discover and sign up for technical and cultural fests easily.", icon: <CalendarPlus size={28} />, color: "text-orange-600", bg: "bg-orange-50", glow: "group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]" },
              { title: "Track Attendance", desc: "Monitor your participation and get certificates verified.", icon: <ClipboardCheck size={28} />, color: "text-blue-600", bg: "bg-blue-50", glow: "group-hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]" },
              { title: "Join Clubs", desc: "Connect with like-minded peers in various campus societies.", icon: <Users size={28} />, color: "text-green-600", bg: "bg-green-50", glow: "group-hover:shadow-[0_0_20px_rgba(34,197,94,0.2)]" }
            ].map((card, idx) => (
              <div key={idx} className="group bg-white p-10 rounded-[2rem] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${card.bg} ${card.color} transition-all duration-300 ${card.glow}`}>
                  {card.icon}
                </div>
                <h3 className="font-extrabold text-slate-800 text-2xl mb-4 tracking-tight">{card.title}</h3>
                <p className="text-slate-500 text-base leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
