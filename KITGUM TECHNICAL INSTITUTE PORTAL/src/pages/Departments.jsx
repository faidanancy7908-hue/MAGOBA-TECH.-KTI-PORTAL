import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  Building2, Users, Wrench, BookOpen, Award, CheckCircle2, 
  Sparkles, Phone, Mail, ArrowRight, Lightbulb, Shield, Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Departments = () => {
  const { departments } = useGlobalContext();
  const [activeDeptId, setActiveDeptId] = useState(1);

  const activeDept = departments.find(d => d.id === activeDeptId) || departments[0];

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-8 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Compass size={14} /> Center of Technical & Vocational Excellence
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Academic & Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Departments</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Kitgum Technical Institute houses 7 specialized engineering, construction, automotive, digital, agro-technical, garment, and business faculties delivering 70% practical workshop training.
          </p>
        </div>
      </div>

      {/* Department Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {departments.map(dept => {
          const isActive = dept.id === activeDeptId;
          return (
            <button
              key={dept.id}
              onClick={() => setActiveDeptId(dept.id)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2.5 border ${
                isActive 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20 scale-102' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-cyan-300' : 'bg-slate-300'}`}></span>
              {dept.name}
            </button>
          );
        })}
      </div>

      {/* Active Department Deep Dive Showcase */}
      <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200">
        
        {/* Banner with Image & Overview */}
        <div className="relative h-64 sm:h-80 overflow-hidden bg-slate-900">
          <img 
            src={activeDept.image} 
            alt={activeDept.name} 
            className="w-full h-full object-cover opacity-60"
            onError={(e) => { e.target.src = '/KITGUM-TECHNICAL-INSTITUTE-PORTAL/images/campus-main.jpg'; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="inline-block px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-blue-500 text-white shadow-xs mb-2">
                Department Code: {activeDept.code}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white">{activeDept.name}</h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl mt-1">{activeDept.description}</p>
            </div>

            <Link 
              to="/admissions" 
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg transition-all shrink-0 flex items-center justify-center gap-1.5"
            >
              Enroll in {activeDept.code} <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Content Grid: HOD & Details */}
        <div className="p-6 sm:p-10 space-y-8">
          
          {/* Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Active Trainees</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{activeDept.studentsCount}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Enrolled across cohorts</p>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Technical Instructors</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{activeDept.facultyCount} Specialists</p>
              <p className="text-[11px] text-slate-500 mt-0.5">1:15 Instructor-Student Ratio</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Workshops & Labs</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{activeDept.workshopsCount} Facilities</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Modern equipment verified</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">UBTEB Pass Rate</span>
              <p className="text-2xl font-black text-slate-900 mt-1">98.4%</p>
              <p className="text-[11px] text-slate-500 mt-0.5">National practical assessment</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Cols: Programs & Workshop Facilities */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Programs */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <BookOpen size={20} className="text-blue-600" />
                  Accredited Curriculums & Programs Offered
                </h3>
                <div className="space-y-2.5">
                  {activeDept.programs.map((prog, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-800">{prog}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">Examining Body: UBTEB (Uganda Business & Technical Examinations Board)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workshop Infrastructure */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-3">
                  <Wrench size={20} className="text-amber-600" />
                  Workshop Infrastructure & Specialized Equipment
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeDept.facilities.map((fac, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center gap-3">
                      <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />
                      <span className="text-xs font-bold text-slate-700">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Practical Innovation Spotlight */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-indigo-500/10 border border-amber-300/40">
                <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
                  <Lightbulb size={16} /> Student Practical Innovation Highlight
                </div>
                <h4 className="font-extrabold text-base text-slate-900">
                  {activeDept.innovation}
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                  Every final-year trainee in this department undertakes real-world fabrication and field engineering projects addressing Northern Uganda's infrastructure and commercial challenges.
                </p>
              </div>

            </div>

            {/* Right 1 Col: HOD Profile & Contact */}
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Head of Department (HOD)</h3>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-2xl flex items-center justify-center shadow-md shrink-0">
                    {activeDept.hod.charAt(4) || 'D'}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base text-slate-900">{activeDept.hod}</h4>
                    <p className="text-xs text-blue-600 font-semibold">{activeDept.qualification}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} className="text-slate-400" />
                    <span>{activeDept.contact.split('|')[0].trim()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={14} className="text-slate-400" />
                    <span>{activeDept.contact.split('|')[1]?.trim() || '+256 772 100 000'}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <Link 
                    to="/admissions" 
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                  >
                    Apply to this Department
                  </Link>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* All Departments Directory Grid */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black text-slate-800">All 7 Technical Faculties Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map(dept => (
            <div 
              key={dept.id} 
              onClick={() => {
                setActiveDeptId(dept.id);
                window.scrollTo({ top: 120, behavior: 'smooth' });
              }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {dept.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">{dept.studentsCount} Students</span>
                </div>
                
                <h3 className="font-extrabold text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                  {dept.name}
                </h3>
                
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {dept.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1">
                  <p><span className="font-semibold text-slate-700">HOD:</span> {dept.hod}</p>
                  <p><span className="font-semibold text-slate-700">Facilities:</span> {dept.workshopsCount} Workshops</p>
                </div>
              </div>

              <div className="mt-4 pt-3 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <span>View Full Details & Labs</span>
                <ArrowRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Departments;
