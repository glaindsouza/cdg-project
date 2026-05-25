import { Code, Music, Wrench, Trophy } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function HomeCategories() {
  return (
    <section id="events" className="py-24 px-6 md:px-12 lg:px-24 bg-[#F4F6F9] border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-2 block">What we offer</span>
          <h2 className="text-4xl font-extrabold text-slate-800 mb-4">Discover Event Categories</h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">From code to choreography — find your stage at MVJ College of Engineering.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            { title: 'Technical Events', desc: 'Hackathons, coding contests, and tech symposiums to spark innovation.', icon: <Code size={32} />, color: 'text-blue-500', bg: 'bg-blue-100', border: 'border-blue-200' },
            { title: 'Cultural Events', desc: 'Music, dance, and arts festivals celebrating creativity on campus.', icon: <Music size={32} />, color: 'text-pink-500', bg: 'bg-pink-100', border: 'border-pink-200' },
            { title: 'Workshops', desc: 'Hands-on sessions led by industry experts to build real-world skills.', icon: <Wrench size={32} />, color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200' },
            { title: 'Sports', desc: 'Inter-college tournaments and athletics fostering teamwork and spirit.', icon: <Trophy size={32} />, color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200' },
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-all hover:-translate-y-1 group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${feature.bg} ${feature.color} border ${feature.border} group-hover:scale-110 transition-transform`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <Link to="/student/dashboard" className="inline-flex px-8 py-3.5 rounded-xl font-bold border-2 border-orange-500 text-orange-500 hover:bg-orange-50 transition-colors">
            Login to Explore More
          </Link>
        </div>
      </div>
    </section>
  );
}
