import { Link } from '@tanstack/react-router';
import { GraduationCap } from 'lucide-react';

export function HomeNavbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex items-center justify-between text-white">
      <div className="flex items-center gap-3 font-bold text-2xl">
        <GraduationCap className="w-8 h-8 text-orange-500" />
        <span className="hidden sm:inline-block">CDG</span>
      </div>
      <div className="hidden md:flex items-center gap-8 font-medium">
        <a href="#" className="font-semibold border-b-2 border-orange-500 pb-1 text-white">Home</a>
        <a href="#about" className="text-white/80 hover:text-white transition-colors">About</a>
        <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
      </div>
      <Link 
        to="/auth" 
        className="px-6 py-2.5 rounded-xl font-bold bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
      >
        Login
      </Link>
    </nav>
  );
}
