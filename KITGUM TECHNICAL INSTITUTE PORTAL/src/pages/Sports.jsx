import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  Trophy, Award, Calendar, Clock, MapPin, Users, CheckCircle2, 
  ArrowRight, Shield, Activity, Plus, Check, Sparkles
} from 'lucide-react';

const Sports = () => {
  const { 
    sportsTeams, 
    sportsFixtures, 
    sportsStandings, 
    submitSportsTryout, 
    currentUser 
  } = useGlobalContext();

  const [tryoutData, setTryoutData] = useState({
    studentName: currentUser?.name || '',
    studentId: currentUser?.student_id || '',
    sport: 'Football (KTI Warriors)',
    position: 'Striker / Forward',
    phone: '',
    experience: 'Played for high school varsity'
  });

  const [registeredSuccess, setRegisteredSuccess] = useState(false);

  const handleTryoutSubmit = (e) => {
    e.preventDefault();
    if (!tryoutData.studentName || !tryoutData.phone) {
      alert("Please provide your name and phone number.");
      return;
    }

    submitSportsTryout(tryoutData);
    setRegisteredSuccess(true);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-rose-950 to-slate-900 p-8 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-bold uppercase tracking-wider">
            <Trophy size={14} /> Home of the Champions • KTI Warriors & Queens
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Sports & Athletics <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-300">Hub</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Nurturing athletic discipline, teamwork, and championship gold across Northern Uganda and national USSSA technical institutions tournaments.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🥇 #1 Northern Tech League Leaders
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              ⚽ 5 Institute Teams
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🏟️ Standard Grass Stadium & Courts
            </span>
          </div>
        </div>
      </div>

      {/* Match Center: Upcoming Fixtures & Results */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Activity size={24} className="text-rose-600" />
              Match Center & Fixtures
            </h2>
            <p className="text-sm text-slate-500">Upcoming games and recent technical games scorelines.</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-rose-50 text-rose-700 rounded-xl border border-rose-200 w-fit">
            2025/2026 League Season
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sportsFixtures.map(fixture => (
            <div 
              key={fixture.id} 
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                fixture.status === 'Completed' 
                  ? 'bg-slate-50/80 border-slate-200' 
                  : 'bg-white border-rose-200 shadow-sm ring-1 ring-rose-500/10'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                    {fixture.sport}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    fixture.status === 'Completed' ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800 animate-pulse'
                  }`}>
                    {fixture.status}
                  </span>
                </div>

                <div className="text-base font-extrabold text-slate-900 mb-1">
                  {fixture.match}
                </div>
                
                <p className="text-xs text-slate-500 font-medium">{fixture.tournament}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-slate-400" /> {fixture.date} • {fixture.time}
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                  <MapPin size={13} className="text-slate-400" /> {fixture.venue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Teams Showcase */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Institute Varsity Teams</h2>
          <p className="text-sm text-slate-500">KTI athletic clubs competing in regional and national technical sports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sportsTeams.map(team => (
            <div 
              key={team.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative bg-slate-900">
                  <img 
                    src={team.banner} 
                    alt={team.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-75"
                    onError={(e) => { e.target.src = '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/sports-football.jpg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-600 text-white px-2 py-0.5 rounded">
                      {team.sport}
                    </span>
                    <h3 className="text-lg font-black text-white mt-1">{team.name}</h3>
                  </div>
                </div>

                <div className="p-5 space-y-2 text-xs text-slate-600">
                  <p><span className="font-bold text-slate-800">Head Coach:</span> {team.coach}</p>
                  <p><span className="font-bold text-slate-800">Team Captain:</span> {team.captain}</p>
                  <p><span className="font-bold text-slate-800">Training Times:</span> {team.trainingDays}</p>
                  <p className="pt-2 text-emerald-700 font-bold flex items-center gap-1">
                    <Trophy size={14} className="text-amber-500 shrink-0" /> {team.trophies}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button 
                  onClick={() => {
                    setTryoutData({...tryoutData, sport: team.name});
                    document.getElementById('tryout-form-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-rose-600 hover:text-white text-rose-600 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
                >
                  Register for Tryouts <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* League Standings Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Northern Technical Institutions League Table</h2>
          <p className="text-sm text-slate-500">Official standings for the 2025/2026 Inter-Institute Football & Athletics Shield.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <th className="py-3 px-4">Pos</th>
                <th className="py-3 px-4">Institution / Club</th>
                <th className="py-3 px-3 text-center">P</th>
                <th className="py-3 px-3 text-center">W</th>
                <th className="py-3 px-3 text-center">D</th>
                <th className="py-3 px-3 text-center">L</th>
                <th className="py-3 px-3 text-center">GD</th>
                <th className="py-3 px-4 text-center font-black">Pts</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sportsStandings.map(row => (
                <tr 
                  key={row.rank} 
                  className={`transition-colors ${row.rank === 1 ? 'bg-rose-50/40 font-bold text-slate-900' : 'hover:bg-slate-50'}`}
                >
                  <td className="py-3.5 px-4 font-black">
                    <span className={`w-6 h-6 rounded-lg inline-flex items-center justify-center text-xs ${
                      row.rank === 1 ? 'bg-amber-400 text-slate-950 font-black' : 'text-slate-600'
                    }`}>
                      {row.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 flex items-center gap-2">
                    {row.team}
                    {row.rank === 1 && <span className="text-[10px] bg-rose-600 text-white px-2 py-0.5 rounded font-black">LEADERS</span>}
                  </td>
                  <td className="py-3.5 px-3 text-center text-slate-600">{row.played}</td>
                  <td className="py-3.5 px-3 text-center text-emerald-600 font-bold">{row.won}</td>
                  <td className="py-3.5 px-3 text-center text-slate-500">{row.drawn}</td>
                  <td className="py-3.5 px-3 text-center text-red-500">{row.lost}</td>
                  <td className="py-3.5 px-3 text-center font-mono">{row.gd}</td>
                  <td className="py-3.5 px-4 text-center font-black text-rose-700 text-base">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Athlete Tryout Registration Form */}
      <div id="tryout-form-section" className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Trophy size={16} /> Varsity Athlete Enrollment
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Student Athlete Tryouts Registration</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Want to represent Kitgum Technical Institute in football, netball, volleyball, athletics, or indoor sports? Register for upcoming coaches' trials.
          </p>
        </div>

        {registeredSuccess && (
          <div className="my-6 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <h3 className="font-extrabold text-base flex items-center gap-2 text-emerald-800">
              <CheckCircle2 size={20} /> Tryout Registration Confirmed!
            </h3>
            <p className="text-xs">
              Athlete clearance slip issued for <strong>{tryoutData.studentName}</strong> ({tryoutData.sport}). Report to the Sports Pavilion on Monday at 4:00 PM with your training kit.
            </p>
          </div>
        )}

        <form onSubmit={handleTryoutSubmit} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Ocan Derrick" 
              value={tryoutData.studentName}
              onChange={(e) => setTryoutData({...tryoutData, studentName: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Student ID (Optional if applicant)</label>
            <input 
              type="text" 
              placeholder="e.g. S002" 
              value={tryoutData.studentId}
              onChange={(e) => setTryoutData({...tryoutData, studentId: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Sport Discipline *</label>
            <select 
              value={tryoutData.sport}
              onChange={(e) => setTryoutData({...tryoutData, sport: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              <option value="Football (KTI Warriors Men)">Football (KTI Warriors Men)</option>
              <option value="Football (KTI Queens Women)">Football (KTI Queens Women)</option>
              <option value="Netball (Kitgum Tech Queens)">Netball (Kitgum Tech Queens)</option>
              <option value="Volleyball (KTI Titans)">Volleyball (KTI Titans)</option>
              <option value="Track & Field Athletics">Track & Field Athletics</option>
              <option value="Woodball & Table Tennis">Woodball & Table Tennis</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Position / Preferred Event</label>
            <input 
              type="text" 
              placeholder="e.g. Midfielder / 100m Sprinter / Setter" 
              value={tryoutData.position}
              onChange={(e) => setTryoutData({...tryoutData, position: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone *</label>
            <input 
              type="tel" 
              required
              placeholder="+256 77X XXX XXX" 
              value={tryoutData.phone}
              onChange={(e) => setTryoutData({...tryoutData, phone: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Previous Sports Experience</label>
            <input 
              type="text" 
              placeholder="e.g. 2 years school team, district runner-up" 
              value={tryoutData.experience}
              onChange={(e) => setTryoutData({...tryoutData, experience: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button 
              type="submit" 
              className="w-full sm:w-auto px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} /> Register for Tryout Trials
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Sports;
