import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { BookOpen, AlertCircle, CheckCircle, Download, FileSpreadsheet, Layers, UserCheck } from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const Registry = () => {
  const { courses, enrollments, currentUser, registerForCourse, getStudentBalance } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' or 'all-enrollments'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeStudentId = currentUser?.student_id || 'S001';

  const handleRegister = async (courseId) => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      await registerForCourse(activeStudentId, courseId);
      setSuccess(`Successfully registered for course ${courseId}!`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const myEnrollments = enrollments.filter(e => e.student_id === activeStudentId);
  const enrolledCourseIds = myEnrollments.map(e => e.course_id);
  const balance = getStudentBalance(activeStudentId);

  const courseExportColumns = [
    { header: 'Course Code', key: 'id' },
    { header: 'Course Name', key: 'name' },
    { header: 'Credits', key: 'credits' },
    { header: 'Status', key: 'status' }
  ];

  const exportData = courses.map(c => ({
    ...c,
    status: enrolledCourseIds.includes(c.id) ? 'Enrolled' : 'Available'
  }));

  const staffExportColumns = [
    { header: 'Enrollment ID', key: 'id' },
    { header: 'Student ID', key: 'student_id' },
    { header: 'Course ID', key: 'course_id' },
    { header: 'Status', key: 'status' },
    { header: 'Grade', key: 'grade' }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Academic Registry & Enrollment Hub</h1>
          <p className="text-slate-500 mt-1">Open course registration and cross-departmental academic records.</p>
        </div>

        {/* Unrestricted Tab Toggle */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'courses' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen size={15} /> Course Registration
          </button>
          <button
            onClick={() => setActiveTab('all-enrollments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'all-enrollments' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Layers size={15} /> All Enrollments ({enrollments.length})
          </button>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl flex items-start gap-3 bg-red-50 text-red-800 border border-red-200 text-xs sm:text-sm">
          <AlertCircle size={18} className="shrink-0 mt-0.5 text-red-600" />
          <div>
            <p className="font-bold">Notice</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl flex items-center gap-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs sm:text-sm">
          <CheckCircle size={18} className="shrink-0 text-emerald-600" />
          <p className="font-bold">{success}</p>
        </div>
      )}

      {/* View 1: Course Registration */}
      {activeTab === 'courses' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Available Course Modules</h3>
                <p className="text-xs text-slate-500">Register for modular technical units for Student ID: <span className="font-bold text-blue-600">{activeStudentId}</span></p>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs flex items-center gap-2">
                <span className="text-slate-500">Student Balance:</span>
                <span className={`font-bold ${balance < 0 ? 'text-emerald-600' : 'text-blue-600'}`}>
                  Clearance Granted (${Math.abs(balance).toFixed(2)})
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => exportToPDF(exportData, 'Course_Catalog', courseExportColumns, 'Course Catalog')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-red-600 flex items-center gap-1.5 text-xs font-bold shadow-xs transition-colors">
                  <Download size={14}/> PDF
                </button>
                <button onClick={() => exportToCSV(exportData, 'Course_Catalog', courseExportColumns)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-emerald-600 flex items-center gap-1.5 text-xs font-bold shadow-xs transition-colors">
                  <FileSpreadsheet size={14}/> Excel
                </button>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs sm:text-sm">
              <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-6 py-4">Code</th>
                  <th className="px-6 py-4">Course Name</th>
                  <th className="px-6 py-4">Credits</th>
                  <th className="px-6 py-4">Prerequisites</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courses.map(course => {
                  const isEnrolled = enrolledCourseIds.includes(course.id);
                  return (
                    <tr key={course.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-black text-slate-900">{course.id}</td>
                      <td className="px-6 py-4 font-semibold text-slate-700">{course.name}</td>
                      <td className="px-6 py-4 text-slate-500">{course.credits} Credits</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {course.prerequisites && course.prerequisites.length > 0 ? (
                            course.prerequisites.map(p => (
                              <span key={p} className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                                {p}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic">Open Enrollment</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {isEnrolled ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle size={14} /> Enrolled
                          </span>
                        ) : (
                          <button 
                            disabled={isLoading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm disabled:opacity-50" 
                            onClick={() => handleRegister(course.id)}
                          >
                            Register Course
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View 2: Master Enrollments Registry */}
      {activeTab === 'all-enrollments' && (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50/80 border-b border-slate-200 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-xl">
                <UserCheck size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800">Master Enrollment Registry</h3>
                <p className="text-xs text-slate-500">Live roster of all registered trainees across institutes</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => exportToPDF(enrollments, 'All_Enrollments', staffExportColumns, 'Master Enrollment List')} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-red-600 flex items-center gap-1.5 text-xs font-bold shadow-xs transition-colors">
                <Download size={14}/> PDF Export
              </button>
              <button onClick={() => exportToCSV(enrollments, 'All_Enrollments', staffExportColumns)} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-emerald-600 flex items-center gap-1.5 text-xs font-bold shadow-xs transition-colors">
                <FileSpreadsheet size={14}/> Excel Export
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left whitespace-nowrap text-xs sm:text-sm">
              <thead className="bg-slate-50/60 border-b border-slate-100 text-slate-500 uppercase text-[11px] font-bold">
                <tr>
                  <th className="px-6 py-4">Enrollment ID</th>
                  <th className="px-6 py-4">Student ID</th>
                  <th className="px-6 py-4">Course ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enrollments.map(e => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-400">#{e.id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {e.student_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-900">{e.course_id}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700">
                        {e.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      {e.grade ? <span className="text-emerald-600">{e.grade} ({e.marks || 85}%)</span> : <span className="text-slate-400 font-normal">Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default Registry;
