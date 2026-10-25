import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, BookOpen, CreditCard, GraduationCap, LayoutDashboard, 
  FileText, MessageSquare, Map, AlertCircle, CheckCircle, 
  Download, ClipboardList, Calendar, Sparkles, UserCheck, ShieldCheck 
} from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { exportToPDF } from '../utils/exportUtils';

const NavIcon = ({ icon, label, active, to }) => (
  <Link to={to || '#'} className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors min-w-[64px] ${active ? 'text-primary' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
    {icon}
    <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
  </Link>
);

const Students = () => {
  const { currentUser, students, departments, ledger, enrollments, courses, updateProfilePicture, courseWorks } = useGlobalContext();
  const fileInputRef = React.useRef(null);

  // Fallback to student profile or first student in database
  const initialStudent = students.find(s => s.user_id === currentUser?.id) || students[0] || {
    name: currentUser?.name || 'Jane Doe',
    student_id: 'S001',
    email: 'j.doe@kti.ac.ug',
    department_id: 1
  };

  const [selectedStudentId, setSelectedStudentId] = useState(initialStudent.student_id);

  const studentProfile = students.find(s => s.student_id === selectedStudentId) || initialStudent;
  const department = departments.find(d => d.id === studentProfile.department_id);
  const courseName = department ? department.name : 'Electrical & Electronic Engineering';

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProfilePicture(currentUser?.id || 1, reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate Balance
  const studentLedger = ledger.filter(l => l.student_id === studentProfile.student_id);
  const balance = studentLedger.reduce((sum, item) => sum + item.amount, 0);

  // Active Modules (100% Unrestricted)
  const studentEnrollments = enrollments.filter(e => e.student_id === studentProfile.student_id);
  const activeModules = studentEnrollments.length > 0 ? studentEnrollments.map(e => ({
    ...e,
    courseDetails: courses.find(c => c.id === e.course_id)
  })) : [
    { course_id: 'DEEE101', status: 'Enrolled', courseDetails: { name: 'Electrical Principles & Solar Installation' } },
    { course_id: 'DEEE102', status: 'Enrolled', courseDetails: { name: 'Domestic & Industrial Wiring' } },
    { course_id: 'DICT101', status: 'Enrolled', courseDetails: { name: 'Applied Computing & CAD Workshop' } }
  ];

  // Actual Result History
  const resultHistory = studentEnrollments.map(e => {
    const course = courses.find(c => c.id === e.course_id);
    return {
      id: e.id,
      semester: '2025/2026 Academic Session',
      course: course ? course.name : e.course_id,
      marks: e.marks !== null && e.marks !== undefined ? e.marks : 82,
      grade: e.grade || 'A',
      status: 'Completed (UBTEB Certified)'
    };
  });

  const resultExportColumns = [
    { header: 'Session', key: 'semester' },
    { header: 'Module / Practical Unit', key: 'course' },
    { header: 'Marks (100%)', key: 'marks' },
    { header: 'Grade', key: 'grade' },
    { header: 'Status', key: 'status' }
  ];

  return (
    <div className="animate-in fade-in duration-500 pb-28">
      
      {/* Student Passport & Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden rounded-3xl mb-6">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end justify-between gap-6 relative z-10">
          
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            {/* Passport Photo Area */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="w-32 h-40 bg-white/10 rounded-2xl border-4 border-white/30 flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-2xl relative group cursor-pointer backdrop-blur-sm"
            >
              {currentUser?.profile_pic ? (
                <img src={currentUser.profile_pic} alt="Passport Photo" className="w-full h-full object-cover" />
              ) : (
                <User size={64} className="text-white/60 group-hover:scale-110 transition-transform duration-300" />
              )}
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-[11px] font-bold text-white text-center px-2">Update Passport Photo</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div className="mb-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 text-xs font-bold uppercase tracking-wider mb-2">
                <ShieldCheck size={14} /> KTI Verified Trainee
              </div>
              <h1 className="text-3xl md:text-4xl font-black mb-2 text-white">{studentProfile.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-cyan-100 font-medium text-xs sm:text-sm">
                <span className="bg-white/15 px-3 py-1 rounded-lg border border-white/20">{courseName}</span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg"><BookOpen size={14} /> ID: {studentProfile.student_id}</span>
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg"><User size={14} /> {studentProfile.email}</span>
              </div>
            </div>
          </div>

          {/* Student Switcher for Multi-profile inspection */}
          <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 shrink-0 w-full md:w-auto">
            <p className="text-[11px] font-bold text-cyan-200 uppercase tracking-wider mb-1.5">Switch Trainee Portal</p>
            <select 
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl border border-white/20 bg-slate-900/80 text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400"
            >
              {students.map(s => (
                <option key={s.student_id} value={s.student_id} className="bg-slate-900 text-white">
                  {s.name} ({s.student_id})
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6">

        {/* Unrestricted TVET Training Status Banner */}
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-emerald-600 shrink-0 mt-0.5" size={24} />
            <div>
              <h3 className="text-emerald-900 font-bold text-base">Unrestricted Academic & Workshop Status</h3>
              <p className="text-emerald-700 text-xs sm:text-sm mt-0.5">
                All modular coursework, computer labs, electrical workshops, and technical drawing studios are fully unlocked for this academic semester.
              </p>
            </div>
          </div>
          <Link 
            to="/academic" 
            className="whitespace-nowrap px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            <Sparkles size={14} /> Access All Courseworks
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content Area: Modules & Results */}
          <div className="lg:col-span-2 space-y-6">

            {/* Current Modules (All Unlocked) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="text-cyan-600" size={22} />
                  Current Semester Technical Modules ({activeModules.length})
                </h2>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
                  100% Active
                </span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeModules.map((module, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50/50 hover:border-cyan-400 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800 text-sm leading-snug">
                        {module.courseDetails?.name || module.course_id}
                      </h3>
                      <CheckCircle className="text-emerald-500 shrink-0 ml-2" size={18} />
                    </div>
                    <p className="text-xs text-slate-500 font-mono mb-3">Module Code: {module.course_id}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider">
                        <CheckCircle size={12} /> Active Access
                      </span>
                      <Link to="/academic" className="text-xs font-bold text-cyan-600 hover:text-cyan-800">
                        View Resources →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Result History */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="text-purple-600" size={22} />
                  UBTEB Assessment Record & Marks
                </h2>
                <button
                  onClick={() => exportToPDF(resultHistory, `Result_History_${studentProfile.student_id}`, resultExportColumns, `Result History - ${studentProfile.name}`)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-red-600 flex items-center gap-1.5 text-xs font-bold shadow-sm transition-colors"
                >
                  <Download size={14} /> PDF Slip
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-bold border-b border-slate-200">Session</th>
                      <th className="p-4 font-bold border-b border-slate-200">Module Title</th>
                      <th className="p-4 font-bold border-b border-slate-200 text-center">Marks</th>
                      <th className="p-4 font-bold border-b border-slate-200 text-center">Grade</th>
                      <th className="p-4 font-bold border-b border-slate-200">UBTEB Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {resultHistory.map(res => (
                      <tr key={res.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-medium text-slate-600 text-xs">{res.semester}</td>
                        <td className="p-4 font-bold text-slate-800 text-xs">{res.course}</td>
                        <td className="p-4 font-black text-slate-800 text-center">{res.marks}</td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                            {res.grade}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-bold text-xs uppercase tracking-wider text-emerald-600">{res.status}</span>
                        </td>
                      </tr>
                    ))}
                    {resultHistory.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-400">No previous examination marks on record.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column (Side details) */}
          <div className="space-y-6">

            {/* Financial Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 text-base mb-4 flex items-center gap-2">
                <CreditCard className="text-cyan-600" size={20} />
                Financial Summary
              </h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600">Current Ledger Balance:</span>
                  <span className="text-sm font-black text-slate-800">
                    UGX {Math.abs(balance).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600">Access Standing:</span>
                  <span className="text-xs font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Active & Permitted
                  </span>
                </div>
              </div>
              <Link to="/finance" className="block text-center w-full mt-4 py-2 text-xs font-bold text-cyan-700 bg-cyan-50 hover:bg-cyan-600 hover:text-white rounded-xl transition-colors">
                View Full Tuition Ledger & Pay Fees →
              </Link>
            </div>

            {/* Active Student Clubs & Sports */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-slate-800 text-base mb-3 flex items-center gap-2">
                <GraduationCap className="text-cyan-600" size={20} />
                Co-Curricular & Sports
              </h3>
              <p className="text-xs text-slate-500 mb-3">Enrolled in active clubs and varsity teams.</p>
              <div className="space-y-2.5">
                <Link to="/sports" className="flex items-center gap-3 p-3 bg-blue-50/70 hover:bg-blue-100 rounded-xl text-xs font-bold text-blue-900 transition-colors">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> KTI Warriors Football Team
                </Link>
                <Link to="/activities" className="flex items-center gap-3 p-3 bg-purple-50/70 hover:bg-purple-100 rounded-xl text-xs font-bold text-purple-900 transition-colors">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-600"></span> Engineering Innovators Society
                </Link>
                <Link to="/guild" className="flex items-center gap-3 p-3 bg-emerald-50/70 hover:bg-emerald-100 rounded-xl text-xs font-bold text-emerald-900 transition-colors">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Students&apos; Guild Representative Body
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Fixed Bottom Navigation Area */}
      <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-slate-200 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40 pb-safe">
        <div className="max-w-6xl mx-auto px-2 py-2 flex justify-between sm:justify-center sm:gap-8 overflow-x-auto hide-scrollbar">
          <NavIcon to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          <NavIcon to="/students" icon={<User size={20} />} label="Profile" active={true} />
          <NavIcon to="/academic" icon={<BookOpen size={20} />} label="Academic" />
          <NavIcon to="/academic" icon={<FileText size={20} />} label="Results" />
          <NavIcon to="/finance" icon={<CreditCard size={20} />} label="Finance" />
          <NavIcon to="/announcements" icon={<MessageSquare size={20} />} label="Notices" />
          <NavIcon to="/activities" icon={<Map size={20} />} label="Activities" />
        </div>
      </div>

    </div>
  );
};

export default Students;
