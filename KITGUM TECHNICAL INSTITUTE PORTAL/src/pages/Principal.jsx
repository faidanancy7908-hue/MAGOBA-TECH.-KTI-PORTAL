import React, { useState } from 'react';
import { Building, Users, BookOpen, CreditCard, Activity, Menu, User, X, ShieldAlert, CheckCircle, ChevronDown, Lock } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';

const Principal = () => {
  const { students, enrollments, ledger, courses, users } = useGlobalContext();
  const [stakeholdersOpen, setStakeholdersOpen] = useState(false);
  const [clearedStudents, setClearedStudents] = useState(['S001', 'S002']);

  // Mock Data for Roadmaps & Communication
  const roadmaps = [
    { id: 1, title: 'End of Semester Exams', date: '2025-06-15', status: 'Upcoming' },
    { id: 2, title: 'Ministry Compliance Audit', date: '2025-07-02', status: 'In Preparation' },
    { id: 3, title: 'Annual General Meeting', date: '2025-08-10', status: 'Scheduled' },
  ];

  const communications = [
    { id: 1, from: 'Board of Directors', message: 'Ensure all departments meet the new TVET compliance standards by Q3.', date: 'Today' },
    { id: 2, from: 'Ministry of Education', message: 'Submission of student enrollment figures required by end of month.', date: 'Yesterday' },
  ];

  const stakeholders = ['Ministry of Education', 'Board of Directors', 'Sponsors', 'Local Government', 'Alumni Association'];

  // Financial Calculations
  const payments = ledger.filter(l => l.amount > 0);
  const totalRevenue = payments.reduce((sum, item) => sum + item.amount, 0);

  // Student Financial Status (Unrestricted access)
  const studentFinancials = students.map(student => {
    const studentLedger = ledger.filter(l => l.student_id === student.student_id);
    const balance = studentLedger.reduce((sum, item) => sum + item.amount, 0);
    return {
      ...student,
      balance,
      owesMoney: balance < 0,
      debtAmount: balance < 0 ? Math.abs(balance) : 0,
      isCleared: clearedStudents.includes(student.student_id)
    };
  });

  const handleGrantClearance = (studentId) => {
    if (clearedStudents.includes(studentId)) {
      setClearedStudents(clearedStudents.filter(id => id !== studentId));
    } else {
      setClearedStudents([...clearedStudents, studentId]);
    }
  };

  // Academic Overview
  const coursePerformance = courses.map(course => {
    const courseEnrollments = enrollments.filter(e => e.course_id === course.id);
    const passed = courseEnrollments.filter(e => e.grade && ['A', 'B', 'C'].includes(e.grade)).length;
    const total = courseEnrollments.filter(e => e.grade).length;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    const lecturer = users.find(u => u.role === 'Lecturer' && u.lecturer_id === course.lecturer_id);
    
    return {
      ...course,
      lecturerName: lecturer ? lecturer.name : 'Unassigned',
      passRate,
      enrolledCount: courseEnrollments.length
    };
  });

  // Latest Results
  const latestResults = enrollments
    .filter(e => e.grade)
    .slice(-4)
    .map(e => {
      const student = students.find(s => s.student_id === e.student_id);
      const course = courses.find(c => c.id === e.course_id);
      return { ...e, studentName: student?.name, courseName: course?.name };
    });

  return (
    <div className="animate-in fade-in duration-500 pb-20 bg-slate-50 min-h-screen">
      
      {/* Top Stakeholder Hamburger Menu */}
      <div className="bg-slate-900 text-white relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <button 
            onClick={() => setStakeholdersOpen(!stakeholdersOpen)}
            className="w-full flex items-center justify-between py-3 text-sm font-bold uppercase tracking-wider hover:text-blue-300 transition-colors"
          >
            <span className="flex items-center gap-2"><Menu size={18} /> Stakeholders & Affiliates</span>
            <ChevronDown size={18} className={`transition-transform duration-300 ${stakeholdersOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
        
        {/* Stakeholders Dropdown */}
        {stakeholdersOpen && (
          <div className="bg-slate-800 border-t border-slate-700 animate-in slide-in-from-top-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
              <div className="flex flex-wrap gap-4">
                {stakeholders.map((sh, idx) => (
                  <span key={idx} className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-blue-600 text-sm font-medium cursor-pointer transition-colors border border-slate-600 hover:border-blue-500">
                    {sh}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Executive Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 text-white p-8 sm:p-12 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl"></div>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-8 relative z-10">
          
          <div className="w-40 h-48 bg-white/10 rounded-2xl border-4 border-white/20 flex flex-col items-center justify-center overflow-hidden shrink-0 shadow-2xl backdrop-blur-sm relative group cursor-pointer">
             <User size={80} className="text-white/40 group-hover:scale-110 transition-transform duration-500" />
             <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <span className="text-xs font-bold uppercase tracking-widest text-white">Update Photo</span>
             </div>
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-2 uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-200">
              The School Principal
            </h1>
            <p className="text-lg text-blue-200 font-medium tracking-wide">Executive Dashboard & Control Center</p>
            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20 text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              System Status: Operational
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-8 mt-4">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="bg-indigo-100 p-4 rounded-xl text-indigo-600"><Users size={28} /></div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Students</p>
              <p className="text-3xl font-black text-slate-800">{students.length}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600"><CreditCard size={28} /></div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Revenue</p>
              <p className="text-3xl font-black text-slate-800">{totalRevenue.toLocaleString()} UGX</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className="bg-purple-100 p-4 rounded-xl text-purple-600"><BookOpen size={28} /></div>
            <div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Active Courses</p>
              <p className="text-3xl font-black text-slate-800">{courses.length}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* LEFT COLUMN: Academic Overview & Results */}
          <div className="space-y-8">
            
            {/* Course Performance */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Activity className="text-indigo-600" size={20} /> Course & Faculty Overview
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {coursePerformance.map(course => (
                  <div key={course.id} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-800">{course.name}</h3>
                      <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded">{course.id}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                      <User size={14} /> Lecturer: <span className="font-semibold">{course.lecturerName}</span>
                    </div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-500">Pass Rate</span>
                      <span className="font-bold text-indigo-600">{course.passRate}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${course.passRate}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Latest Academic Results */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <BookOpen className="text-emerald-600" size={20} /> Latest Faculty Submissions
                </h2>
              </div>
              <div className="p-0">
                {latestResults.map(res => (
                  <div key={res.id} className="flex justify-between items-center p-4 border-b border-slate-50 hover:bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{res.studentName}</p>
                      <p className="text-xs text-slate-500">{res.courseName}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                      {res.grade}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Institutional & Finance */}
          <div className="space-y-8">
            
            {/* Roadmaps & Communication */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Building className="text-purple-600" size={20} /> Institutional Directives
                </h2>
              </div>
              <div className="p-5 space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Admin Communication</h3>
                  <div className="space-y-3">
                    {communications.map(comm => (
                      <div key={comm.id} className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="font-bold text-purple-800">{comm.from}</span>
                          <span className="text-purple-400">{comm.date}</span>
                        </div>
                        <p className="text-sm text-slate-700">{comm.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">School Roadmaps</h3>
                  <div className="space-y-3 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                    {roadmaps.map(rm => (
                      <div key={rm.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-white bg-slate-300 group-[.is-active]:bg-purple-500 text-slate-500 group-[.is-active]:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10"></div>
                        <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.25rem)] p-3 rounded-xl border border-slate-100 bg-white shadow-sm">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-slate-800 text-sm">{rm.title}</span>
                          </div>
                          <div className="text-xs text-slate-500">{rm.date} <span className="text-purple-600 font-medium ml-2">{rm.status}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* FULL WIDTH: TVET Student Support & Clearance Assistance */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="text-emerald-600" size={20} /> TVET Student Bursary & Institutional Clearance
            </h2>
            <div className="text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              Open Academic Access Guarantee Active
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                  <th className="p-4 font-bold border-b border-slate-200">Student Name</th>
                  <th className="p-4 font-bold border-b border-slate-200">ID / Dept</th>
                  <th className="p-4 font-bold border-b border-slate-200">Financial Balance</th>
                  <th className="p-4 font-bold border-b border-slate-200">Academic Standing</th>
                  <th className="p-4 font-bold border-b border-slate-200 text-right">Clearance Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {studentFinancials.map(student => {
                  return (
                    <tr key={student.student_id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-bold text-slate-800">
                        {student.name}
                        {student.isCleared && <span className="ml-2 inline-flex items-center text-[10px] text-emerald-600 uppercase tracking-wider font-bold"><CheckCircle size={10} className="mr-1"/> Cleared</span>}
                      </td>
                      <td className="p-4 text-slate-600">
                        {student.student_id} <br/>
                        <span className="text-xs text-slate-400">Dept: {student.department_id}</span>
                      </td>
                      <td className="p-4">
                        <span className={`font-black ${student.owesMoney ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {student.balance.toLocaleString()} UGX
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-xs font-bold uppercase text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded">
                          <CheckCircle size={12}/> 100% Permitted
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button 
                          onClick={() => handleGrantClearance(student.student_id)}
                          className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all uppercase tracking-wider ${student.isCleared ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-cyan-50 text-cyan-700 hover:bg-cyan-600 hover:text-white border border-cyan-200'}`}
                        >
                          {student.isCleared ? 'Clearance Issued' : 'Grant TVET Relief'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Principal;
