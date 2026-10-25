import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  GraduationCap, Award, Briefcase, Calendar, Search, 
  MapPin, Mail, Phone, CheckCircle2, Clock, FileText, 
  ArrowRight, Plus, Heart, Sparkles, Check, Download
} from 'lucide-react';

const Alumni = () => {
  const { 
    alumniDirectory, 
    alumniJobs, 
    alumniRequests, 
    submitTranscriptRequest,
    currentUser 
  } = useGlobalContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchTracking, setSearchTracking] = useState('');
  const [trackedRequest, setTrackedRequest] = useState(null);
  const [trackingError, setTrackingError] = useState('');

  // Request form state
  const [reqData, setReqData] = useState({
    name: currentUser?.name || '',
    type: 'Official Academic Transcript',
    department: 'Electrical Engineering',
    year: '2022',
    email: '',
    phone: '',
    destination: 'Uganda Technical College / Employer'
  });
  const [issuedTracking, setIssuedTracking] = useState(null);

  const handleRequestSubmit = (e) => {
    e.preventDefault();
    if (!reqData.name || !reqData.phone) {
      alert("Please provide your full name and phone number.");
      return;
    }

    const tracking = submitTranscriptRequest(reqData);
    setIssuedTracking(tracking);
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    setTrackingError('');
    setTrackedRequest(null);
    if (!searchTracking.trim()) return;

    const query = searchTracking.trim().toUpperCase();
    const found = alumniRequests.find(r => r.trackingCode.toUpperCase() === query || r.studentName.toUpperCase().includes(query));

    if (found) {
      setTrackedRequest(found);
    } else {
      setTrackingError(`No academic request record found for "${searchTracking}". Please check your tracking code or contact the Registrar.`);
    }
  };

  const filteredAlumni = alumniDirectory.filter(alum => {
    const matchesSearch = alum.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          alum.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          alum.employer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'All' || alum.department.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-fuchsia-950 via-slate-900 to-indigo-950 p-8 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-fuchsia-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/20 border border-fuchsia-400/30 text-fuchsia-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap size={14} /> Kitgum Technical Institute Alumni Association
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            The Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-300 to-pink-400">Alumni Network</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Connecting over 5,000+ technical graduates, master craftsmen, engineers, and entrepreneurs building the physical and digital infrastructure of Uganda and the diaspora.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-300">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              🎓 5,032 Registered Alumni
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              💼 91.2% Employment / Enterprise Rate
            </span>
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              📜 Online Transcript Tracking
            </span>
          </div>
        </div>
      </div>

      {/* Online Services & Transcript Tracking Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <FileText size={20} className="text-fuchsia-600" />
              Online Academic Document Verification & Tracker
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Check the status of your requested transcript or completion certificate using your Tracking Code (e.g., <span className="font-bold text-fuchsia-600">KTI-TR-8821</span>).
            </p>
          </div>

          <form onSubmit={handleTrackSubmit} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="e.g. KTI-TR-8821" 
              value={searchTracking}
              onChange={(e) => setSearchTracking(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-full sm:w-60"
            />
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-sm rounded-xl transition-all shrink-0"
            >
              Track Status
            </button>
          </form>
        </div>

        {/* Tracking Result Banner */}
        {trackingError && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm">
            {trackingError}
          </div>
        )}

        {trackedRequest && (
          <div className="p-5 rounded-2xl bg-fuchsia-50/70 border border-fuchsia-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-fuchsia-700 bg-white px-2 py-0.5 rounded border border-fuchsia-200">
                Tracking: {trackedRequest.trackingCode}
              </span>
              <h4 className="text-base font-black text-slate-900 mt-1">{trackedRequest.studentName}</h4>
              <p className="text-xs text-slate-600">{trackedRequest.requestType} • {trackedRequest.department} (Class of {trackedRequest.yearOfGraduation})</p>
            </div>
            
            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">
                {trackedRequest.status}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Processed: {trackedRequest.date}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          <div 
            onClick={() => document.getElementById('request-transcript-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-fuchsia-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Award size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800">Request Official Transcript</h3>
            <p className="text-xs text-slate-500 mt-1">Order signed academic transcripts dispatched electronically or via courier.</p>
          </div>

          <div 
            onClick={() => document.getElementById('alumni-jobs-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-fuchsia-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <Briefcase size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800">Alumni Career Hub</h3>
            <p className="text-xs text-slate-500 mt-1">Explore job openings, internships, and apprenticeships posted by fellow graduates.</p>
          </div>

          <div 
            onClick={() => document.getElementById('directory-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-fuchsia-300 hover:shadow-sm transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3 group-hover:scale-105 transition-transform">
              <GraduationCap size={20} />
            </div>
            <h3 className="font-extrabold text-sm text-slate-800">Alumni Directory</h3>
            <p className="text-xs text-slate-500 mt-1">Search, connect, and collaborate with verified KTI graduates in your field.</p>
          </div>
        </div>
      </div>

      {/* Alumni Directory */}
      <div id="directory-section" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Alumni Directory & Hall of Fame</h2>
            <p className="text-sm text-slate-500">Inspiring graduates leading technical enterprises across Uganda.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search name, job, employer..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500 w-full sm:w-64"
              />
            </div>

            <select 
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm font-semibold text-slate-700"
            >
              <option value="All">All Departments</option>
              <option value="Electrical">Electrical</option>
              <option value="Building">Building / Civil</option>
              <option value="Information">ICT</option>
              <option value="Automotive">Automotive</option>
              <option value="Fashion">Fashion & Garment</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map(alum => (
            <div 
              key={alum.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-fuchsia-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-black text-fuchsia-700 bg-fuchsia-50 px-2.5 py-0.5 rounded-md border border-fuchsia-100">
                    {alum.classYear}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{alum.department}</span>
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <img 
                    src={alum.avatar} 
                    alt={alum.name} 
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs" 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'; }}
                  />
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 group-hover:text-fuchsia-600 transition-colors">
                      {alum.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-700">{alum.role}</p>
                    <p className="text-[11px] text-slate-500">{alum.employer}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                  "{alum.achievement}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" /> {alum.location}</span>
                <span className="font-semibold text-fuchsia-600 truncate">{alum.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Alumni Job Board & Opportunities */}
      <div id="alumni-jobs-section" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Briefcase size={22} className="text-emerald-600" />
            Alumni Job & Apprenticeship Board
          </h2>
          <p className="text-sm text-slate-500">Exclusive employment and training vacancies posted by alumni companies for KTI graduates.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {alumniJobs.map(job => (
            <div key={job.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px]">
                    {job.type}
                  </span>
                  <span className="text-slate-400 font-semibold">{job.salary}</span>
                </div>
                
                <h3 className="font-extrabold text-base text-slate-900">{job.title}</h3>
                <p className="text-xs text-slate-600 mt-1 font-semibold">{job.company} • {job.location}</p>
                <p className="text-[11px] text-slate-400 mt-2">Posted by: {job.postedBy}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500">Deadline: {job.deadline}</span>
                <button 
                  onClick={() => alert(`Application submitted for "${job.title}". The hiring manager will contact you.`)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all"
                >
                  Apply Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Request Transcript & Certificate Form */}
      <div id="request-transcript-section" className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-fuchsia-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Award size={16} /> Academic Registry Service
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Request Official Transcript or Certificate</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Graduates can order stamped academic transcripts or certificates of completion online. Track fulfillment status anytime.
          </p>
        </div>

        {issuedTracking && (
          <div className="my-6 p-6 rounded-2xl bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-950 space-y-2">
            <h3 className="font-black text-base flex items-center gap-2 text-fuchsia-800">
              <CheckCircle2 size={20} /> Request Lodged Successfully!
            </h3>
            <p className="text-xs">
              Your official Tracking Code is <strong className="text-fuchsia-900 text-sm">{issuedTracking}</strong>. The Academic Registry has queued your request for verification and issuance.
            </p>
          </div>
        )}

        <form onSubmit={handleRequestSubmit} className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name as on Record *</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Graduated George" 
              value={reqData.name}
              onChange={(e) => setReqData({...reqData, name: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Service Requested *</label>
            <select 
              value={reqData.type}
              onChange={(e) => setReqData({...reqData, type: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="Official Academic Transcript">Official Academic Transcript</option>
              <option value="Certificate of Completion Verification">Certificate of Completion Verification</option>
              <option value="Recommendation / Testimonial Letter">Recommendation / Testimonial Letter</option>
              <option value="Certified UBTEB Result Slip">Certified UBTEB Result Slip</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Department Completed *</label>
            <select 
              value={reqData.department}
              onChange={(e) => setReqData({...reqData, department: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            >
              <option value="Electrical Engineering">Electrical Engineering (NCES)</option>
              <option value="Building & Civil Engineering">Building & Civil Engineering (NCBC)</option>
              <option value="Automotive Mechanics">Automotive Mechanics (NCAM)</option>
              <option value="Information & Comm. Technology">Information & Comm. Technology (NCICT)</option>
              <option value="Agriculture & Agribusiness">Agriculture (NCAG)</option>
              <option value="Fashion & Garment Design">Fashion & Garment (NCFD)</option>
              <option value="Business Administration">Business Studies (DBIA)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Year of Graduation</label>
            <input 
              type="text" 
              placeholder="e.g. 2021" 
              value={reqData.year}
              onChange={(e) => setReqData({...reqData, year: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone *</label>
            <input 
              type="tel" 
              required
              placeholder="+256 77X XXX XXX" 
              value={reqData.phone}
              onChange={(e) => setReqData({...reqData, phone: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Recipient Institution / Employer</label>
            <input 
              type="text" 
              placeholder="e.g. Makerere University / Umeme" 
              value={reqData.destination}
              onChange={(e) => setReqData({...reqData, destination: e.target.value})}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          <div className="sm:col-span-2 pt-2">
            <button 
              type="submit" 
              className="w-full sm:w-auto px-8 py-3 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-fuchsia-600/20 transition-all flex items-center justify-center gap-2"
            >
              <Check size={18} /> Submit Document Request
            </button>
          </div>
        </form>
      </div>

    </div>
  );
};

export default Alumni;
