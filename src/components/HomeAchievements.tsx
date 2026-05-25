import { Calendar, Users, Award } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function HomeAchievements() {
  return (
    <section id="about" className="py-24 px-6 md:px-12 lg:px-24 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <span className="text-orange-500 font-bold tracking-wider uppercase text-sm mb-2 block">Our impact</span>
            <h2 className="text-4xl font-extrabold text-slate-800 mb-6 leading-tight">Achievements that Inspire</h2>
            <p className="text-lg text-slate-500 mb-8 leading-relaxed">
              Numbers that reflect a thriving culture of learning and excellence at MVJ College of Engineering. Join thousands of students engaging in events that shape their future.
            </p>
            <Link to="/student/dashboard" className="hidden lg:inline-flex px-8 py-3.5 rounded-xl font-bold bg-[#A0522D] text-white hover:bg-[#8B4513] transition-colors shadow-sm">
              Login to View Details
            </Link>
          </div>
          
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center sm:text-left">
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <Calendar size={24} />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-800 mb-2">100+</h3>
              <h4 className="font-bold text-slate-700 mb-2">Events Conducted</h4>
              <p className="text-sm text-slate-500">Across academics, culture, and sports</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center sm:text-left sm:translate-y-8">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-500 flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <Users size={24} />
              </div>
              <h3 className="text-4xl font-extrabold text-slate-800 mb-2">5,000+</h3>
              <h4 className="font-bold text-slate-700 mb-2">Active Participants</h4>
              <p className="text-sm text-slate-500">Students engaged every academic year</p>
            </div>
            
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center sm:text-left sm:col-span-2">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-yellow-100 text-yellow-600 flex items-center justify-center shrink-0">
                  <Award size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-1">National Level Recognition</h3>
                  <p className="text-sm text-slate-500">Award-winning student initiatives across India</p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full text-center lg:hidden mt-8">
            <Link to="/student/dashboard" className="inline-flex px-8 py-3.5 rounded-xl font-bold bg-[#A0522D] text-white hover:bg-[#8B4513] transition-colors shadow-sm">
              Login to View Details
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
