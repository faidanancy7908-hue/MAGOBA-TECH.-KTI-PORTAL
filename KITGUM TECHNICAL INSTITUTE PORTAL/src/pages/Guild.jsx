import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  Shield, Users, ThumbsUp, Plus, CheckCircle2, AlertCircle, 
  Sparkles, MessageSquare, Award, Clock, ArrowRight, Vote, Check
} from 'lucide-react';

const Guild = () => {
  const { 
    guildCabinet, 
    guildProjects, 
    guildPetitions, 
    submitGuildPetition, 
    upvoteGuildPetition,
    currentUser 
  } = useGlobalContext();

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academic');
  const [newDescription, setNewDescription] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorDept, setAuthorDept] = useState('Electrical');
  const [showForm, setShowForm] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmitPetition = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) {
      alert("Please enter petition title and description.");
      return;
    }

    submitGuildPetition({
      title: newTitle.trim(),
      description: newDescription.trim(),
      category: newCategory,
      author: authorName || 'Concerned Trainee',
      department: authorDept
    });

    setNewTitle('');
    setNewDescription('');
    setSubmitSuccess(true);
    setTimeout(() => {
      setSubmitSuccess(false);
      setShowForm(false);
    }, 3000);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-8 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Shield size={14} /> Students' Guild Government • 2025/2026 Executive
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            The Students' <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Guild Government</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            The sovereign student representative body of Kitgum Technical Institute. Dedicated to defending student welfare, fostering workshop excellence, upholding campus discipline, and building a united community.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🏛️ 18 GRC Departmental Representatives
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              ⚖️ Autonomous Student Constitution
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🌱 Over 4 Student Welfare Projects
            </span>
          </div>
        </div>
      </div>

      {/* Guild Executive Cabinet Showcase */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Guild Executive Cabinet</h2>
          <p className="text-sm text-slate-500">Meet the elected student leaders serving the student fraternity.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guildCabinet.map((leader, idx) => (
            <div 
              key={idx}
              className={`bg-white rounded-3xl p-6 shadow-sm border transition-all flex flex-col justify-between group ${
                idx === 0 
                  ? 'border-blue-500/40 ring-2 ring-blue-500/20 bg-gradient-to-br from-white to-blue-50/40' 
                  : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                    idx === 0 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {leader.title}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{leader.term}</span>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-blue-600 text-white flex items-center justify-center font-black text-xl shadow-inner">
                    {leader.name.split(' ')[1]?.charAt(0) || 'L'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">{leader.department}</p>
                  </div>
                </div>

                <blockquote className="text-xs italic text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{leader.quote}"
                </blockquote>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Phone: {leader.phone}</span>
                <span className="text-blue-600 font-bold">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Guild Ongoing Projects */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Guild Projects & Welfare Schemes</h2>
          <p className="text-sm text-slate-500">Major infrastructure and student-centered developmental projects undertaken by the Guild government.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {guildProjects.map(proj => (
            <div key={proj.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-base text-slate-900">{proj.title}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {proj.status}
                </span>
              </div>
              
              <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>
              
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-slate-500">Progress</span>
                  <span className="text-blue-600">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      proj.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 flex justify-between text-xs text-slate-500">
                <span>Allocated Budget: <strong className="text-slate-700">{proj.budget}</strong></span>
                <span className="text-slate-400">Audit Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Student Petitions & Voice System */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <MessageSquare size={24} className="text-blue-600" />
              Student Voice & Interactive Petitions
            </h2>
            <p className="text-sm text-slate-500">Direct democracy in action. Vote on open student petitions or submit your own request to the Guild Cabinet.</p>
          </div>

          <button 
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Submit a Petition
          </button>
        </div>

        {/* Petition Submission Form */}
        {showForm && (
          <form onSubmit={handleSubmitPetition} className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4 animate-in fade-in duration-200">
            <h3 className="font-extrabold text-base text-slate-900">Draft New Student Petition to Guild Cabinet</h3>
            
            {submitSuccess && (
              <div className="p-4 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 size={16} /> Petition submitted successfully and queued for review!
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Petition Title *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Install Solar Fan in Automotive Workshop" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Academic">Academic & Exams</option>
                  <option value="Workshop">Workshop Infrastructure</option>
                  <option value="Sports">Sports & Athletics</option>
                  <option value="Welfare">Student Welfare & Health</option>
                  <option value="Canteen">Canteen & Hostels</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Jane Doe" 
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                <select 
                  value={authorDept}
                  onChange={(e) => setAuthorDept(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Electrical">Electrical (DEEE)</option>
                  <option value="Civil & Building">Civil & Building (DBC)</option>
                  <option value="Automotive">Automotive (DAME)</option>
                  <option value="ICT">ICT (DICT)</option>
                  <option value="Agriculture">Agriculture (DAG)</option>
                  <option value="Fashion">Fashion (DFGD)</option>
                  <option value="Business">Business (DBIA)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Petition Details & Justification *</label>
                <textarea 
                  required
                  rows={3}
                  placeholder="Explain why this request is important to the trainees and what action the Guild Cabinet should take..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-white text-slate-600 hover:bg-slate-100 font-bold text-xs border border-slate-200"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
              >
                Submit Petition
              </button>
            </div>
          </form>
        )}

        {/* Petitions List with Upvote Action */}
        <div className="space-y-3">
          {guildPetitions.map(petition => (
            <div key={petition.id} className="p-5 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                    {petition.category}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    petition.status === 'Implemented' ? 'bg-emerald-100 text-emerald-800' :
                    petition.status === 'Approved by Principal' ? 'bg-blue-100 text-blue-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {petition.status}
                  </span>
                  <span className="text-slate-400 text-xs">• {petition.date}</span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{petition.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{petition.description}</p>
                <p className="text-[11px] text-slate-400">Author: <strong className="text-slate-600">{petition.author}</strong> ({petition.department})</p>
              </div>

              {/* Upvote Button with Live Counter */}
              <button 
                onClick={() => upvoteGuildPetition(petition.id)}
                className="flex items-center sm:flex-col justify-center gap-1.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-2xl bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 transition-all shrink-0 font-bold group"
                title="Upvote this petition"
              >
                <ThumbsUp size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-sm font-black">{petition.upvotes}</span>
                <span className="text-[10px] uppercase font-bold text-slate-400 group-hover:text-blue-100">Signatures</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Guild;
