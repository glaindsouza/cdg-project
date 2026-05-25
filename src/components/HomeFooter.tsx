import { GraduationCap } from 'lucide-react';

export function HomeFooter() {
  return (
    <footer id="contact" className="bg-[#1e293b] text-slate-300 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-slate-700 pb-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-3 text-white font-bold text-2xl mb-6">
            <GraduationCap className="w-8 h-8 text-orange-500" />
            <span>CDG</span>
          </div>
          <p className="text-slate-400 leading-relaxed mb-6">
            Campus Digital Gateway<br/>
            MVJ College of Engineering — empowering students through innovation, culture, and excellence in education since 1982.
          </p>
        </div>
        
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
          <ul className="space-y-3">
            <li><a href="#" className="hover:text-orange-400 transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-orange-400 transition-colors">About</a></li>
            <li><a href="#events" className="hover:text-orange-400 transition-colors">Events</a></li>
            <li><a href="#contact" className="hover:text-orange-400 transition-colors">Contact</a></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-white font-bold text-lg mb-6">Contact</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-orange-500">📍</span>
              <span>Near ITPB, Channasandra, Bengaluru — 560067</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-orange-500">📞</span>
              <span>+91 80 4299 1000</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-orange-500">✉️</span>
              <span>info@mvjce.edu.in</span>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-500 gap-4">
        <p>© 2026 MVJ College of Engineering. All rights reserved.</p>
        <p>Crafted with care for the CDG community.</p>
      </div>
    </footer>
  );
}
