import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { MessageSquare, Bell, Calendar, Info, AlertTriangle, ShieldCheck, Send, MessageCircle } from 'lucide-react';

const Announcements = () => {
  const { announcements, currentUser } = useGlobalContext();
  const [filter, setFilter] = useState('All');
  const [replies, setReplies] = useState({});
  const [replyText, setReplyText] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);

  const handleReplySubmit = (e, id) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    
    const newReply = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      user: currentUser?.name || 'Student',
      text: replyText,
      // eslint-disable-next-line react-hooks/purity
      date: new Date().toISOString()
    };
    
    setReplies(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), newReply]
    }));
    setReplyText('');
  };

  // Sorted by newest first
  const sortedAnnouncements = [...announcements].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  const filteredAnnouncements = filter === 'All' 
    ? sortedAnnouncements 
    : sortedAnnouncements.filter(a => a.department === filter);

  const departments = ['All', ...new Set(announcements.map(a => a.department))];

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'high': return <AlertTriangle size={18} className="text-red-500" />;
      case 'normal': return <Info size={18} className="text-blue-500" />;
      case 'low': return <ShieldCheck size={18} className="text-emerald-500" />;
      default: return <Bell size={18} className="text-slate-400" />;
    }
  };

  const getPriorityClasses = (priority) => {
    switch(priority) {
      case 'high': return 'bg-red-50 border-red-100 shadow-red-100/50';
      case 'normal': return 'bg-blue-50 border-blue-100 shadow-blue-100/50';
      case 'low': return 'bg-emerald-50 border-emerald-100 shadow-emerald-100/50';
      default: return 'bg-white border-slate-200 shadow-slate-100/50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
          <MessageSquare className="text-primary" size={32} />
          Administrative Announcements
        </h1>
        <p className="text-slate-500 mt-2">Stay up to date with official communications from all departments.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setFilter(dept)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filter === dept 
                ? 'bg-primary text-white shadow-md shadow-primary/30' 
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Announcements Feed */}
      <div className="space-y-6">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((announcement) => (
            <div 
              key={announcement.id} 
              className={`p-6 rounded-2xl border shadow-sm transition-transform hover:-translate-y-1 ${getPriorityClasses(announcement.priority)}`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
                    {getPriorityIcon(announcement.priority)}
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 bg-white rounded-lg shadow-sm text-slate-700">
                        {announcement.department}
                      </span>
                      {announcement.priority === 'high' && (
                        <span className="text-xs font-bold uppercase px-2.5 py-1 bg-red-100 text-red-700 rounded-lg">
                          Important
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">{announcement.title}</h2>
                    <p className="text-slate-700 leading-relaxed text-sm md:text-base mb-4">
                      {announcement.content}
                    </p>
                    
                    {/* Responses Section */}
                    <div className="mt-4 pt-4 border-t border-slate-200/60">
                      <button 
                        onClick={() => setActiveReplyId(activeReplyId === announcement.id ? null : announcement.id)}
                        className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors"
                      >
                        <MessageCircle size={16} /> 
                        {replies[announcement.id]?.length || 0} Responses
                      </button>
                      
                      {activeReplyId === announcement.id && (
                        <div className="mt-4 space-y-4 animate-in fade-in slide-in-from-top-2">
                          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                            {(replies[announcement.id] || []).map(reply => (
                              <div key={reply.id} className="bg-white/60 p-3 rounded-xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-sm text-slate-800">{reply.user}</span>
                                  <span className="text-xs text-slate-400">{new Date(reply.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-slate-600">{reply.text}</p>
                              </div>
                            ))}
                            {(replies[announcement.id] || []).length === 0 && (
                              <p className="text-sm text-slate-400 italic">No responses yet. Be the first!</p>
                            )}
                          </div>
                          <form onSubmit={(e) => handleReplySubmit(e, announcement.id)} className="flex gap-2">
                            <input
                              type="text"
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Type your response..."
                              className="flex-1 px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
                            />
                            <button type="submit" className="p-2 bg-primary text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
                              <Send size={18} />
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-slate-500 shrink-0 md:flex-col md:items-end">
                  <Calendar size={16} />
                  <span className="text-sm font-medium">{new Date(announcement.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center flex flex-col items-center">
            <Bell size={48} className="text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-700">No Announcements Found</h3>
            <p className="text-slate-500 mt-2">There are currently no announcements for this department.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Announcements;
