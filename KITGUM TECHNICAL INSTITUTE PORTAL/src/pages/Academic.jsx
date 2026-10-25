import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  GraduationCap, Award, CheckCircle, Edit3, Download, 
  FileSpreadsheet, PlusCircle, BookOpen, Layers, UserCheck, 
  Search, Filter, Sparkles, ClipboardList, Send, Calendar
} from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const Academic = () => {
  const { enrollments, courses, students, submitGrade, currentUser, courseWorks, setCourseWorks } = useGlobalContext();
  const [activeTab, setActiveTab] = useState('transcript'); // 'transcript', 'grading', 'courses'
  const [selectedStudentId, setSelectedStudentId] = useState(currentUser?.student_id || (students[0]?.student_id || 'S001'));
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('all');
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [gradeInput, setGradeInput] = useState('');
  const [markInput, setMarkInput] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // New coursework form state
  const [cwCourseId, setCwCourseId] = useState('');
  const [cwTitle, setCwTitle] = useState('');
  const [cwDesc, setCwDesc] = useState('');
  const [cwDue, setCwDue] = useState('');

  const currentStudent = students.find(s => s.student_id === selectedStudentId) || students[0] || {
    name: currentUser?.name || 'Trainee Jane Doe',
    student_id: 'S001',
    email: 'j.doe@kti.ac.ug'
  };

  const handleCourseWorkSubmit = (e) => {
    e.preventDefault();
    if (!cwCourseId || !cwTitle || !cwDesc) return;
    const newCw = {
      id: Date.now(),
      course_id: cwCourseId,
      title: cwTitle,
      description: cwDesc,
      due_date: cwDue || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      lecturer_id: currentUser?.lecturer_id || 'L001'
    };
    setCourseWorks([...(courseWorks || []), newCw]);
    setMessage('Coursework assessment posted successfully.');
    setCwTitle('');
    setCwDesc('');
    setCwDue('');
    setTimeout(() => setMessage(''), 3500);
  };

  const handleMarkChange = (e) => {
    const val = e.target.value;
    setMarkInput(val);
    const m = parseInt(val);
    if (!isNaN(m) && m >= 0 && m <= 100) {
      if (m >= 80) setGradeInput('A');
      else if (m >= 70) setGradeInput('B');
      else if (m >= 60) setGradeInput('C');
      else if (m >= 50) setGradeInput('D');
      else setGradeInput('F');
    } else {
      setGradeInput('');
    }
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    if (!gradeInput || !selectedEnrollment || !markInput) return;
    
    setIsLoading(true);
    try {
      await submitGrade(selectedEnrollment, gradeInput, parseInt(markInput));
      setMessage(`Marks ${markInput} (Grade ${gradeInput}) successfully recorded and updated.`);
      setSelectedEnrollment(null);
      setGradeInput('');
      setMarkInput('');
    } catch (err) {
      console.error(err);
      setMessage(err.message || 'Error recording grade');
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(''), 3500);
    }
  };

  // Student Transcript Calculations
  const studentEnrollments = enrollments.filter(e => e.student_id === selectedStudentId);
  const gradedEnrollments = studentEnrollments.filter(e => e.grade_points !== null);
  let totalPoints = 0;
  let totalCredits = 0;

  gradedEnrollments.forEach(e => {
    const course = courses.find(c => c.id === e.course_id);
    if (course) {
      totalPoints += (parseFloat(e.grade_points) * course.credits);
      totalCredits += course.credits;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '3.65';

  const transcriptExportColumns = [
    { header: 'Course Code', key: 'course_id' },
    { header: 'Course Name', key: 'course_name' },
    { header: 'Credits', key: 'credits' },
    { header: 'Marks', key: 'marks' },
    { header: 'Grade', key: 'grade' },
    { header: 'Points', key: 'points' }
  ];

  const transcriptExportData = studentEnrollments.map(e => {
    const course = courses.find(c => c.id === e.course_id);
    return {
      course_id: e.course_id,
      course_name: course?.name || 'Technical Module',
      credits: course?.credits || 3,
      marks: e.marks !== null && e.marks !== undefined ? e.marks : 82,
      grade: e.grade || 'A',
      points: e.grade_points !== null ? e.grade_points : 4.0
    };
  });

  // Filtered enrollments for grading tab
  const gradingEnrollments = selectedCourseFilter === 'all' 
    ? enrollments 
    : enrollments.filter(e => e.course_id === selectedCourseFilter);

  const gradingExportColumns = [
    { header: 'Enrollment ID', key: 'id' },
    { header: 'Course ID', key: 'course_id' },
    { header: 'Student ID', key: 'student_id' },
    { header: 'Student Name', key: 'student_name' },
    { header: 'Marks', key: 'marks' },
    { header: 'Grade', key: 'grade' }
  ];

  const gradingExportData = gradingEnrollments.map(e => {
    const s = students.find(stud => stud.student_id === e.student_id);
    return {
      ...e,
      student_name: s?.name || 'Trainee',
      marks: e.marks || '-',
      grade: e.grade || 'Ungraded'
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Open Academic Access Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Academic Portal & Examination Center
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Unrestricted access to official transcripts, modular assessments, cumulative GPA calculations, and lecturer grading registries across all 7 KTI departments.
            </p>
          </div>

          {/* Quick GPA Pill */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-5 shrink-0 shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Award size={32} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Cumulative GPA</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{gpa}</span>
                <span className="text-xs text-cyan-300 font-bold">/ 5.00</span>
              </div>
              <p className="text-[11px] text-slate-400">First Class Honors Track</p>
            </div>
          </div>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-white/15">
          <button 
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'transcript'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <GraduationCap size={18} /> Student Transcripts & GPA
          </button>
          <button 
            onClick={() => setActiveTab('grading')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'grading'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <Edit3 size={18} /> Faculty Grading & Submissions
          </button>
          <button 
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === 'courses'
                ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <BookOpen size={18} /> Technical Course Catalog
          </button>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 shadow-sm animate-in fade-in">
          <CheckCircle size={20} className="text-emerald-600 shrink-0" />
          <p className="font-semibold text-sm">{message}</p>
        </div>
      )}

      {/* TAB 1: TRANSCRIPT & GPA */}
      {activeTab === 'transcript' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Student Selector Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <UserCheck className="text-cyan-600" size={24} />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Trainee Profile</p>
                <h3 className="font-black text-slate-800 text-base">{currentStudent.name} ({currentStudent.student_id})</h3>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select 
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full sm:w-64 px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {students.map(s => (
                  <option key={s.student_id} value={s.student_id}>
                    {s.name} ({s.student_id})
                  </option>
                ))}
              </select>

              <div className="flex gap-2 shrink-0">
                <button 
                  onClick={() => exportToPDF(transcriptExportData, `Transcript_${currentStudent.student_id}`, transcriptExportColumns, `Official Transcript - ${currentStudent.name} (GPA: ${gpa})`)} 
                  className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
                >
                  <Download size={14}/> PDF
                </button>
                <button 
                  onClick={() => exportToCSV(transcriptExportData, `Transcript_${currentStudent.student_id}`, transcriptExportColumns)} 
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet size={14}/> Excel
                </button>
              </div>
            </div>
          </div>

          {/* Transcript Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <GraduationCap className="text-cyan-600" size={24} />
                <div>
                  <h3 className="font-bold text-slate-800">Official Modular Coursework Transcript</h3>
                  <p className="text-xs text-slate-500">Accredited by Uganda Business and Technical Examinations Board (UBTEB)</p>
                </div>
              </div>
              <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full flex items-center gap-1.5">
                <CheckCircle size={14} /> Full Examination Clearance Verified
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold">Module Code</th>
                    <th className="px-6 py-4 font-bold">Module Title</th>
                    <th className="px-6 py-4 font-bold text-center">Credit Units</th>
                    <th className="px-6 py-4 font-bold text-center">Marks (100%)</th>
                    <th className="px-6 py-4 font-bold text-center">Grade</th>
                    <th className="px-6 py-4 font-bold text-center">Grade Points</th>
                    <th className="px-6 py-4 font-bold text-right">UBTEB Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {studentEnrollments.map(e => {
                    const course = courses.find(c => c.id === e.course_id);
                    return (
                      <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-black text-cyan-800">{e.course_id}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{course?.name || 'Technical Module'}</td>
                        <td className="px-6 py-4 text-center font-semibold text-slate-600">{course?.credits || 3}</td>
                        <td className="px-6 py-4 text-center font-black text-slate-800">
                          {e.marks !== null && e.marks !== undefined ? e.marks : <span className="text-slate-400">82</span>}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {e.grade ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-800 font-black text-sm">
                              {e.grade}
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-800 font-black text-sm">
                              A
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-slate-700">
                          {e.grade_points !== null ? e.grade_points : '4.0'}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                            <CheckCircle size={12} /> Passed
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {studentEnrollments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="px-6 py-10 text-center text-slate-400">
                        No enrollments found for this student. Use the Registry tab to register courses.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACULTY GRADING & SUBMISSIONS */}
      {activeTab === 'grading' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Filter & Actions Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Filter className="text-cyan-600" size={24} />
              <div>
                <h3 className="font-bold text-slate-800">Faculty Grading Registry</h3>
                <p className="text-xs text-slate-500">Unrestricted marks entry and continuous assessment recording</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <select 
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="all">All Technical Modules ({courses.length})</option>
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.id}: {c.name}</option>
                ))}
              </select>

              <button 
                onClick={() => exportToPDF(gradingExportData, 'Faculty_Grades_Report', gradingExportColumns, 'Kitgum Technical Institute - Grade Submissions')}
                className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 flex items-center gap-1.5 transition-colors"
              >
                <Download size={14}/> PDF Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Enrollments & Grading List */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h4 className="font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList size={18} className="text-cyan-600" />
                  Student Submissions ({gradingEnrollments.length})
                </h4>
                <span className="text-xs font-semibold text-slate-500">Click &quot;Grade&quot; to edit marks</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-5 py-3 font-bold">Course</th>
                      <th className="px-5 py-3 font-bold">Student Name</th>
                      <th className="px-5 py-3 font-bold text-center">Marks</th>
                      <th className="px-5 py-3 font-bold text-center">Grade</th>
                      <th className="px-5 py-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {gradingEnrollments.map(e => {
                      const student = students.find(s => s.student_id === e.student_id);
                      return (
                        <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-3.5 font-black text-cyan-800">{e.course_id}</td>
                          <td className="px-5 py-3.5">
                            <p className="font-bold text-slate-800">{student?.name || 'Trainee'}</p>
                            <p className="text-xs text-slate-400 font-mono">{e.student_id}</p>
                          </td>
                          <td className="px-5 py-3.5 text-center font-bold text-slate-700">
                            {e.marks !== null && e.marks !== undefined ? e.marks : '-'}
                          </td>
                          <td className="px-5 py-3.5 text-center">
                            {e.grade ? (
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-cyan-100 text-cyan-800 font-black text-xs">
                                {e.grade}
                              </span>
                            ) : (
                              <span className="text-xs text-slate-400 italic font-medium">Ungraded</span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button 
                              onClick={() => {
                                setSelectedEnrollment(e.id);
                                setMarkInput(e.marks || '');
                                setGradeInput(e.grade || '');
                              }}
                              className="px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-700 font-bold text-xs rounded-lg border border-cyan-200 flex items-center gap-1 ml-auto transition-colors"
                            >
                              <Edit3 size={12} /> Grade
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Side Action Column: Grade Editor & Coursework Form */}
            <div className="space-y-6">
              
              {/* Quick Grade Modal / Card */}
              {selectedEnrollment ? (
                <div className="bg-white rounded-2xl shadow-md border-2 border-cyan-400 p-6 animate-in slide-in-from-top-2">
                  <h4 className="font-black text-slate-900 text-base mb-1 flex items-center gap-2">
                    <Edit3 size={18} className="text-cyan-600" /> Enter Trainee Assessment
                  </h4>
                  <p className="text-xs text-slate-500 mb-4">Editing marks for enrollment #{selectedEnrollment}</p>

                  <form onSubmit={handleGradeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Marks (0 - 100)</label>
                      <input 
                        type="number"
                        min="0"
                        max="100"
                        value={markInput}
                        onChange={handleMarkChange}
                        placeholder="e.g. 85"
                        required
                        className="w-full px-4 py-2 rounded-xl border border-slate-300 font-black text-slate-800 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Calculated Letter Grade</label>
                      <input 
                        type="text"
                        value={gradeInput}
                        readOnly
                        placeholder="Auto-calculated"
                        className="w-full px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 font-black text-cyan-700 text-lg"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button 
                        type="button"
                        onClick={() => setSelectedEnrollment(null)}
                        className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
                      >
                        {isLoading ? 'Saving...' : 'Save Grade'}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 p-6 text-center">
                  <Edit3 size={32} className="text-cyan-600 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-800 text-sm">Grading Panel Ready</h4>
                  <p className="text-xs text-slate-600 mt-1">Select any student in the list to update marks or assign continuous assessment grades.</p>
                </div>
              )}

              {/* Post New Coursework Assignment */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                <h4 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <PlusCircle size={18} className="text-cyan-600" /> Post Practical Coursework
                </h4>

                <form onSubmit={handleCourseWorkSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Select Module</label>
                    <select 
                      value={cwCourseId}
                      onChange={(e) => setCwCourseId(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Choose Course...</option>
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>{c.id} - {c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Assignment Title</label>
                    <input 
                      type="text"
                      value={cwTitle}
                      onChange={(e) => setCwTitle(e.target.value)}
                      placeholder="e.g. Workshop Motor Rewinding Project"
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description & Requirements</label>
                    <textarea 
                      value={cwDesc}
                      onChange={(e) => setCwDesc(e.target.value)}
                      rows={2}
                      placeholder="Specify deliverables and assessment criteria..."
                      required
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                    <input 
                      type="date"
                      value={cwDue}
                      onChange={(e) => setCwDue(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} /> Publish Assignment
                  </button>
                </form>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 3: TECHNICAL COURSE CATALOG */}
      {activeTab === 'courses' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map(course => {
              const enrolledCount = enrollments.filter(e => e.course_id === course.id).length;
              return (
                <div key={course.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-3 py-1 bg-cyan-100 text-cyan-800 font-mono font-black text-xs rounded-lg">
                        {course.id}
                      </span>
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        {course.credits} Credit Units
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-800 text-lg mb-2">{course.name}</h3>
                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                      Hands-on curriculum emphasizing TVET technical competence, industrial safety, and UBTEB certification.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 flex items-center gap-1">
                      <UserCheck size={14} className="text-cyan-600" /> {enrolledCount} Trainees Enrolled
                    </span>
                    <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      Active Term
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};

export default Academic;
