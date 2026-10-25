import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  UserPlus, CheckCircle2, Download, Search, FileText, 
  BookOpen, Clock, Award, Phone, Mail, MapPin, 
  Calendar, Check, AlertCircle, ArrowRight, Printer, Sparkles
} from 'lucide-react';

const Admissions = () => {
  const { 
    admissionPrograms, 
    admissionApplications, 
    submitAdmissionApplication,
    currentUser 
  } = useGlobalContext();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    gender: 'Male',
    phone: '',
    email: '',
    district: 'Kitgum',
    highSchool: '',
    qualification: 'UCE (O-Level)',
    grades: '',
    programCode: 'NCES',
    programTitle: 'National Certificate in Electrical Installation Systems & Maintenance',
    studyMode: 'Full-time Day',
    nextOfKinName: '',
    nextOfKinPhone: ''
  });

  const [submittedRef, setSubmittedRef] = useState(null);
  const [searchRef, setSearchRef] = useState('');
  const [trackedApp, setTrackedApp] = useState(null);
  const [searchError, setSearchError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [showSlip, setShowSlip] = useState(false);

  const handleProgramSelect = (prog) => {
    setFormData({
      ...formData,
      programCode: prog.code,
      programTitle: prog.title
    });
    // Scroll to form smoothly
    document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert("Please fill in applicant full name and contact phone number.");
      return;
    }

    const ref = submitAdmissionApplication(formData);
    setSubmittedRef(ref);
    setShowSlip(true);
  };

  const handleTrackApplication = (e) => {
    e.preventDefault();
    setSearchError('');
    setTrackedApp(null);
    if (!searchRef.trim()) return;

    const query = searchRef.trim().toUpperCase();
    const found = admissionApplications.find(
      a => a.id.toUpperCase() === query || a.phone.includes(query) || a.applicantName.toUpperCase().includes(query)
    );

    if (found) {
      setTrackedApp(found);
    } else {
      setSearchError(`No application record found for reference "${searchRef}". Please check your Reference Number or contact the Registrar.`);
    }
  };

  const filteredPrograms = admissionPrograms.filter(prog => {
    if (selectedFilter === 'All') return true;
    return prog.department.toLowerCase().includes(selectedFilter.toLowerCase());
  });

  return (
    <div className="space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Admissions Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 p-8 sm:p-10 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} /> Admissions Open for August 2026/2027 Academic Year
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Launch Your Technical Career at <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400">Kitgum Technical Institute</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Gain practical, hands-on, accredited qualifications certified by the Uganda Business and Technical Examinations Board (UBTEB) and the Directorate of Industrial Training (DIT). Education for Self Reliance.
          </p>

          <div className="flex flex-wrap gap-4 pt-2 text-xs sm:text-sm text-slate-200">
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              <Calendar size={16} className="text-cyan-300" /> Deadline: July 31, 2026
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              <Award size={16} className="text-emerald-300" /> UBTEB & DIT Accredited
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3.5 py-1.5 rounded-xl border border-white/10">
              <Clock size={16} className="text-amber-300" /> Day & Boarding Facilities
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Admission Status Tracker Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <Search size={20} className="text-blue-600" />
              Track Admission Application Status
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Already submitted an application? Enter your Application Reference ID (e.g., <span className="font-semibold text-blue-600">KTI-ADM-2026-1042</span>) or Phone Number.
            </p>
          </div>

          <form onSubmit={handleTrackApplication} className="flex gap-2 w-full md:w-auto">
            <input 
              type="text" 
              placeholder="e.g. KTI-ADM-2026-1042" 
              value={searchRef}
              onChange={(e) => setSearchRef(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shrink-0"
            >
              Track
            </button>
          </form>
        </div>

        {/* Search Results */}
        {searchError && (
          <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" /> {searchError}
          </div>
        )}

        {trackedApp && (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-200/60">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-white px-2.5 py-0.5 rounded-md border border-blue-200">
                  Application ID: {trackedApp.id}
                </span>
                <h4 className="text-xl font-black text-slate-900 mt-1">{trackedApp.applicantName}</h4>
                <p className="text-xs text-slate-600">Applied for: <span className="font-bold">{trackedApp.programTitle}</span></p>
              </div>

              <div className="text-left sm:text-right">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-xs">
                  {trackedApp.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">Submitted on: {trackedApp.submissionDate}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
              <div>
                <span className="text-slate-500">Contact Phone:</span>
                <p className="font-bold text-slate-800">{trackedApp.phone}</p>
              </div>
              <div>
                <span className="text-slate-500">Prior School:</span>
                <p className="font-bold text-slate-800">{trackedApp.highSchool}</p>
              </div>
              <div>
                <span className="text-slate-500">Reporting Date:</span>
                <p className="font-bold text-blue-700">August 17, 2026</p>
              </div>
              <div>
                <span className="text-slate-500">Next Action:</span>
                <p className="font-bold text-emerald-700">Collect Official Admission Letter</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Program Directory & Entry Requirements */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Accredited Academic Programs</h2>
            <p className="text-sm text-slate-500">Select a course to view requirements and auto-populate your application form.</p>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-2">
            {['All', 'Electrical', 'Civil', 'Automotive', 'ICT', 'Agriculture', 'Fashion'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap ${
                  selectedFilter === cat ? 'bg-blue-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredPrograms.map(prog => (
            <div 
              key={prog.code} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {prog.code}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">{prog.duration}</span>
                </div>
                
                <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 transition-colors leading-snug">
                  {prog.title}
                </h3>
                
                <div className="mt-3 space-y-2 text-xs text-slate-600">
                  <p><span className="font-semibold text-slate-700">Award:</span> {prog.qualification}</p>
                  <p><span className="font-semibold text-slate-700">Requirements:</span> {prog.minRequirements}</p>
                  <p className="font-bold text-emerald-600">Tuition: {prog.tuition}</p>
                </div>
              </div>

              <button 
                onClick={() => handleProgramSelect(prog)}
                className="mt-5 w-full py-2.5 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-blue-600 font-bold text-xs border border-slate-200 transition-all flex items-center justify-center gap-1.5"
              >
                Apply for Course <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Practical Training Facilities Showcase */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">State-of-the-Art TVET Infrastructure</span>
            <h3 className="text-xl sm:text-2xl font-black text-white">Workshop & Learning Environment</h3>
          </div>
          <span className="text-xs text-slate-400 font-medium">Hands-on practicals commence in week one</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="group relative rounded-2xl overflow-hidden h-40 border border-white/10 shadow-md">
            <img 
              src={`${import.meta.env.BASE_URL}images/workshop-1.jpg`} 
              alt="Electrical Engineering Workshops" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Electrical Bays</span>
              <p className="text-xs font-bold text-white">Domestic & Industrial Wiring</p>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden h-40 border border-white/10 shadow-md">
            <img 
              src={`${import.meta.env.BASE_URL}images/workshop-2.jpg`} 
              alt="Civil & Construction Workshops" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Building & Carpentry</span>
              <p className="text-xs font-bold text-white">Woodworking & Masonry Arenas</p>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden h-40 border border-white/10 shadow-md">
            <img 
              src={`${import.meta.env.BASE_URL}images/lab-session.jpg`} 
              alt="Computer Science & Design Lab" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">ICT & CAD Lab</span>
              <p className="text-xs font-bold text-white">Computer Hardware & Drafting</p>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden h-40 border border-white/10 shadow-md">
            <img 
              src={`${import.meta.env.BASE_URL}images/campus-main.jpg`} 
              alt="Main Campus & Hostels" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Residential Campus</span>
              <p className="text-xs font-bold text-white">Hostels & Sports Grounds</p>
            </div>
          </div>
        </div>
      </div>

      {/* Online Admission Application Form */}
      <div id="application-form-section" className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider mb-2">
            <UserPlus size={16} /> Online Enrollment System
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Student Admission Application Form</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete the form below to apply for the August 2026/2027 intake. No application fee is required for online provisional submissions.
          </p>
        </div>

        {/* Modal-style Success Slip */}
        {showSlip && submittedRef && (
          <div className="my-8 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white border border-emerald-500/30 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">Application Successfully Submitted!</h3>
                  <p className="text-xs text-emerald-300">Your provisional admission record has been filed with the Academic Registrar.</p>
                </div>
              </div>
              <button 
                onClick={() => window.print()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20"
              >
                <Printer size={14} /> Print Slip
              </button>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-xs">
              <div>
                <span className="text-slate-400">Application Reference ID:</span>
                <p className="text-lg font-black text-cyan-300 mt-0.5">{submittedRef}</p>
              </div>
              <div>
                <span className="text-slate-400">Applicant:</span>
                <p className="text-sm font-bold text-white mt-0.5">{formData.firstName} {formData.lastName}</p>
              </div>
              <div>
                <span className="text-slate-400">Program:</span>
                <p className="text-sm font-bold text-white mt-0.5">{formData.programTitle}</p>
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-300">
              Please preserve your Reference ID <strong className="text-white">{submittedRef}</strong>. Report to Kitgum Technical Institute Academic Registry with your original O-Level/PLE result slips and 4 passport photos by August 15, 2026.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-8">
          
          {/* Section 1: Personal Details */}
          <div>
            <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">1</span>
              Applicant Personal Details
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Geoffrey" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Last / Surname *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Odoch" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Gender *</label>
                <select 
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Phone *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="+256 77X XXX XXX" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  placeholder="name@example.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Background */}
          <div>
            <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">2</span>
              Academic Qualifications & Prior Education
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Last School Attended</label>
                <input 
                  type="text" 
                  placeholder="e.g. Kitgum High School" 
                  value={formData.highSchool}
                  onChange={(e) => setFormData({...formData, highSchool: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Highest Qualification</label>
                <select 
                  value={formData.qualification}
                  onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="UCE (O-Level)">UCE (O-Level)</option>
                  <option value="UACE (A-Level)">UACE (A-Level)</option>
                  <option value="PLE (Primary)">PLE Certificate</option>
                  <option value="Artisan Trade Test">DIT / Artisan Trade Test</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Key Grades / Passes</label>
                <input 
                  type="text" 
                  placeholder="e.g. Math: Pass, Physics: Credit" 
                  value={formData.grades}
                  onChange={(e) => setFormData({...formData, grades: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Program & Study Details */}
          <div>
            <h3 className="text-base font-bold text-slate-800 pb-3 border-b border-slate-100 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">3</span>
              Program Selection & Guardian
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Choice of Course / Program *</label>
                <select 
                  value={formData.programCode}
                  onChange={(e) => {
                    const sel = admissionPrograms.find(p => p.code === e.target.value);
                    setFormData({
                      ...formData,
                      programCode: e.target.value,
                      programTitle: sel?.title || e.target.value
                    });
                  }}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {admissionPrograms.map(p => (
                    <option key={p.code} value={p.code}>{p.code} - {p.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Study Mode</label>
                <select 
                  value={formData.studyMode}
                  onChange={(e) => setFormData({...formData, studyMode: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Full-time Day">Full-time Day</option>
                  <option value="Boarding / Residential">Boarding / Residential</option>
                  <option value="Modular Weekend">Modular Weekend</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Parent / Next of Kin Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Betty Akot" 
                  value={formData.nextOfKinName}
                  onChange={(e) => setFormData({...formData, nextOfKinName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Parent / Guardian Phone</label>
                <input 
                  type="tel" 
                  placeholder="+256 77X XXX XXX" 
                  value={formData.nextOfKinPhone}
                  onChange={(e) => setFormData({...formData, nextOfKinPhone: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-end">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Submit Application
                </button>
              </div>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
};

export default Admissions;
