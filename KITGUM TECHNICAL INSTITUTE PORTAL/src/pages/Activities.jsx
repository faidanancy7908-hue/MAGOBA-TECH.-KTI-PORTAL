import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  Sparkles, Users, Calendar, MapPin, CheckCircle2, 
  ArrowRight, Heart, Lightbulb, Compass, Award, Check
} from 'lucide-react';

const Activities = () => {
  const { 
    campusActivities, 
    campusEvents, 
    rsvpEvent, 
    joinClub,
    currentUser 
  } = useGlobalContext();

  const [activeCategory, setActiveCategory] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');

  const handleJoin = (clubId, clubName) => {
    joinClub(clubId);
    setSuccessMsg(`Congratulations! You have joined "${clubName}". Check your student email for the next meeting schedule.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const handleRsvp = (eventId, eventTitle) => {
    rsvpEvent(eventId);
    setSuccessMsg(`RSVP confirmed for "${eventTitle}"! A digital event badge has been reserved for you.`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const filteredClubs = campusActivities.filter(club => {
    if (activeCategory === 'All') return true;
    return club.category.toLowerCase().includes(activeCategory.toLowerCase());
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-950 via-slate-900 to-indigo-950 p-8 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Student Life & Co-Curricular Excellence
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">Activities & Life</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Beyond the workshops and lecture halls, Kitgum Technical Institute fosters vibrant student creativity, cultural heritage preservation, tech innovation clubs, and community volunteer outreaches.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🌟 5 Registered Student Clubs
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🎭 Annual Acholi Cultural Gala
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🛠️ Community Technical Repair Camps
            </span>
          </div>
        </div>
      </div>

      {/* Global Toast Success Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Flagship Annual Events & Galas */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Flagship Annual Events & Galas</h2>
          <p className="text-sm text-slate-500">Major calendar highlights bringing together students, faculty, alumni, and the general public.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campusEvents.map(event => (
            <div 
              key={event.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="h-48 overflow-hidden relative bg-slate-900">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                    onError={(e) => { e.target.src = '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/exhibition.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur text-slate-900 px-3 py-1 rounded-xl text-xs font-black shadow-sm">
                    {event.date}
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-500 space-y-1">
                    <p className="flex items-center gap-1.5"><MapPin size={13} className="text-slate-400" /> {event.venue}</p>
                    <p className="flex items-center gap-1.5"><Calendar size={13} className="text-slate-400" /> {event.time}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button 
                  onClick={() => handleRsvp(event.id, event.title)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                    event.userRsvp 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
                >
                  {event.userRsvp ? (
                    <>
                      <Check size={14} /> RSVP Confirmed ({event.rsvpCount})
                    </>
                  ) : (
                    <>
                      RSVP / Attend Event ({event.rsvpCount} Attending)
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clubs & Societies Directory */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Student Clubs & Societies</h2>
            <p className="text-sm text-slate-500">Join a peer community to sharpen leadership, technical innovation, and volunteer skills.</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1">
            {['All', 'Innovation', 'Community', 'Culture', 'Environment', 'Leadership'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  activeCategory === cat ? 'bg-amber-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map(club => (
            <div 
              key={club.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                    {club.category}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{club.members} Members</span>
                </div>

                <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                  {club.name}
                </h3>
                
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {club.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
                  <p><span className="font-bold text-slate-700">President:</span> {club.president}</p>
                  <p><span className="font-bold text-slate-700">Meets:</span> {club.meetingDay}</p>
                </div>
              </div>

              <div className="mt-5 pt-0">
                <button 
                  onClick={() => handleJoin(club.id, club.name)}
                  className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 ${
                    club.joined 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                      : 'bg-slate-50 hover:bg-amber-600 hover:text-white text-amber-700 border border-slate-200'
                  }`}
                >
                  {club.joined ? (
                    <>
                      <Check size={14} /> Active Member
                    </>
                  ) : (
                    <>
                      Join This Club <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Authentic Campus Life Photo Gallery */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Life on Campus in Pictures</h2>
          <p className="text-sm text-slate-500">Real scenes from workshops, sports competitions, graduation ceremonies, and cultural galas.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-44 rounded-2xl overflow-hidden relative group">
            <img src="/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/workshop-1.jpg" alt="Workshop Practical" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold">Electrical Workshop</span>
            </div>
          </div>
          <div className="h-44 rounded-2xl overflow-hidden relative group">
            <img src="/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/sports-football.jpg" alt="Warriors Football" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold">Warriors Athletics</span>
            </div>
          </div>
          <div className="h-44 rounded-2xl overflow-hidden relative group">
            <img src="/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/graduation-alumni.jpg" alt="Graduation" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold">UBTEB Graduation</span>
            </div>
          </div>
          <div className="h-44 rounded-2xl overflow-hidden relative group">
            <img src="/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/guild-event.jpg" alt="Guild Assembly" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
              <span className="text-white text-xs font-bold">Guild Gathering</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Activities;
