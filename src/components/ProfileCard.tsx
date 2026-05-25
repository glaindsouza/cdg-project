import { Mail, Phone, BookOpen, GraduationCap } from 'lucide-react';

interface ProfileCardProps {
  fullName: string;
  usn: string;
  email: string;
  phone: string;
  department: string;
  semester: string;
  avatarUrl?: string;
}

export function ProfileCard({ fullName, usn, email, phone, department, semester, avatarUrl }: ProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="h-24 bg-gradient-to-r from-orange-400 to-yellow-400"></div>
      <div className="px-6 pb-6 relative">
        <div className="w-24 h-24 rounded-full border-4 border-white bg-white shadow-sm overflow-hidden absolute -top-12">
          {avatarUrl ? (
            <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-3xl font-bold">
              {fullName.charAt(0)}
            </div>
          )}
        </div>
        
        <div className="mt-14 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">{fullName}</h2>
            <p className="text-orange-500 font-medium">{usn}</p>
          </div>
          <button className="text-sm font-medium text-slate-600 bg-slate-100 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex items-center gap-3 text-slate-600">
            <Mail size={18} className="text-slate-400" />
            <span className="text-sm">{email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone size={18} className="text-slate-400" />
            <span className="text-sm">{phone}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <BookOpen size={18} className="text-slate-400" />
            <span className="text-sm">{department}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <GraduationCap size={18} className="text-slate-400" />
            <span className="text-sm">Semester {semester}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
