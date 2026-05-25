import { Sidebar } from '../components/Sidebar';
import { ArrowLeft, Send, Search } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function FacultyChat() {
  const contacts = [
    { id: 1, name: 'Coding Club Admin', lastMsg: 'Sent the attendance sheet for review.', time: '10:45 AM', active: true },
    { id: 2, name: 'Innovation Society', lastMsg: 'When can we schedule a meeting?', time: 'Yesterday', active: false },
    { id: 3, name: 'Debate Society', lastMsg: 'Thank you for the approval!', time: 'Mon', active: false },
  ];

  const messages = [
    { id: 1, sender: 'Coding Club Admin', role: 'Club Admin', text: 'Good morning Dr. Smith. I have uploaded the attendance sheet for yesterday\'s hackathon.', time: '10:30 AM', isMe: false },
    { id: 2, sender: 'Dr. Smith', role: 'Faculty', text: 'Good morning. I will review it today after my lectures.', time: '10:42 AM', isMe: true },
    { id: 3, sender: 'Coding Club Admin', role: 'Club Admin', text: 'Sent the attendance sheet for review. Thank you!', time: '10:45 AM', isMe: false },
  ];

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden font-sans">
      <Sidebar role="faculty" />
      
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="max-w-[1400px] mx-auto w-full h-full p-8 flex flex-col">
          
          <header className="flex items-center gap-4 mb-6">
            <Link to="/faculty/dashboard" className="p-2 bg-white text-slate-500 rounded-full hover:bg-slate-50 border border-slate-200 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Messages</h1>
              <p className="text-sm text-slate-500 font-medium">Communicate with club administrators</p>
            </div>
          </header>

          {/* Chat Interface Container */}
          <div className="flex-1 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden flex min-h-0">
            
            {/* Left Panel - Contacts */}
            <div className="w-80 border-r border-slate-100 flex flex-col bg-slate-50/50">
              <div className="p-4 border-b border-slate-100">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={16} className="text-slate-400" />
                  </div>
                  <input type="text" placeholder="Search chats..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {contacts.map(contact => (
                  <div key={contact.id} className={`p-4 border-b border-slate-100 cursor-pointer transition-colors ${contact.active ? 'bg-orange-50 border-l-4 border-l-orange-500' : 'hover:bg-slate-100 border-l-4 border-l-transparent'}`}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className={`font-bold text-sm ${contact.active ? 'text-orange-700' : 'text-slate-800'}`}>{contact.name}</h3>
                      <span className="text-[10px] font-bold text-slate-400">{contact.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 truncate">{contact.lastMsg}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Panel - Chat Area */}
            <div className="flex-1 flex flex-col bg-white">
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
                  CC
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-sm">Coding Club Admin</h2>
                  <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col max-w-[70%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                    <div className="flex items-baseline gap-2 mb-1 px-1">
                      <span className="text-xs font-bold text-slate-700">{msg.sender}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{msg.role}</span>
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.isMe ? 'bg-orange-500 text-white rounded-tr-sm' : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <input type="text" placeholder="Type a message..." className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all" />
                  <button className="w-12 h-12 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 shadow-sm transition-all active:scale-95">
                    <Send size={18} className="ml-1" />
                  </button>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}
