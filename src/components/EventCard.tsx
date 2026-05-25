import { MapPin, Clock } from 'lucide-react';

interface EventCardProps {
  title: string;
  category: string;
  dateStr: string; // e.g., "OCT 15"
  time: string;
  venue: string;
  imageUrl?: string;
eventId: string;
isRegistered?: boolean;
onRegister?: (eventId: string) => void;
}

export function EventCard({ 
  eventId,
  title, 
  category, 
  dateStr, 
  time, 
  venue, 
  imageUrl, 
 onRegister,
isRegistered = false
}: EventCardProps) {
  const [month, day] = dateStr.split(' ');

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all flex flex-col h-full group">
      <div className="h-40 relative overflow-hidden bg-slate-200">
        <img 
          src={imageUrl || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60"} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        {/* Date Badge */}
        <div className="absolute top-3 left-3 bg-white rounded-xl px-2 py-1.5 flex flex-col items-center justify-center shadow-sm min-w-[48px]">
          <span className="text-[10px] font-bold text-slate-500 uppercase leading-none">{month}</span>
          <span className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">{day}</span>
        </div>
      </div>
      
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-[10px] font-bold text-orange-500 tracking-wider uppercase bg-orange-50 px-2 py-0.5 rounded-md">{category}</span>
          <div className="flex items-center text-[11px] text-slate-500 font-medium">
            <Clock size={12} className="mr-1" />
            {time}
          </div>
        </div>
        
        <h3 className="font-bold text-slate-800 text-base leading-tight line-clamp-1 mb-1.5">{title}</h3>
        
        <div className="flex items-center text-xs text-slate-500 mb-4 flex-1">
          <MapPin size={12} className="mr-1 opacity-70" />
          <span className="truncate">{venue}</span>
        </div>
        
      <button
  type="button"
  onClick={() => onRegister?.(eventId)}
  disabled={isRegistered}
  className={`w-full py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm ${
    isRegistered
      ? "bg-green-100 text-green-700 cursor-not-allowed"
      : "bg-[#A0522D] text-white hover:bg-[#8B4513]"
  }`}
>
  {isRegistered ? "Registered" : "Register Now"}
</button>
      </div>
    </div>
  );
}
