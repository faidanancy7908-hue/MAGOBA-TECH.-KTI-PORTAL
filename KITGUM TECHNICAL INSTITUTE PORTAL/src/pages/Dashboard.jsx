import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  Users, BookOpen, GraduationCap, Trophy, CheckCircle2, 
  Clock, Plus, Trash2, ArrowRight, Shield, Activity, 
  Calendar, Building2, Sparkles, Filter, AlertCircle, Wrench, ChevronRight, Compass
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { 
    currentUser, 
    departments, 
    guildProjects, 
    sportsFixtures, 
    tasks, 
    schedule, 
    announcements, 
    addTask, 
    toggleTask, 
    deleteTask,
    switchRole
  } = useGlobalContext();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Academic');
  const [newTaskPriority, setNewTaskPriority] = useState('Medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    addTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: newTaskDueDate || 'This Week'
    });
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const filteredTasks = tasks.filter(t => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Pending') return !t.completed;
    if (filterCategory === 'Completed') return t.completed;
    return t.category === filterCategory;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0;
  const baseUrl = import.meta.env.BASE_URL;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Official Institutional Badge & Welcoming Crown at the Top of Welcoming Page */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 sm:p-8 text-white shadow-2xl border border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {/* Illuminated School Badge */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 rounded-full blur-md opacity-75 group-hover:opacity-100 transition animate-pulse"></div>
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white p-2 border-2 border-amber-400 shadow-xl flex items-center justify-center overflow-hidden">
                <img 
                  src={`${baseUrl}badge-final.png`}
                  alt="Kitgum Technical Institute Official Badge"
                  className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
                  onError={(e) => { e.target.src = `${baseUrl}images/logo.jpg`; }}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-[11px] font-bold uppercase tracking-wider">
                <Sparkles size={13} className="text-amber-400" /> Monsignor Antonio Vignato Memorial
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                Kitgum Technical <span className="text-cyan-400">Institute</span>
              </h1>
              <p className="text-amber-300 font-serif italic text-sm font-bold tracking-wide">
                &ldquo;Education for Self Reliance&rdquo;
              </p>
              <p className="text-xs text-slate-300 max-w-xl">
                Government-Aided TVET Institution • UBTEB Examination Center #UBT042 • Kitgum, Uganda
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link 
              to="/about"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black rounded-xl text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Compass size={16} /> Mission, Vision & Values
            </Link>
            <Link 
              to="/admissions"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-400/30 font-bold rounded-xl text-xs sm:text-sm transition-all"
            >
              <BookOpen size={16} /> Apply Online
            </Link>
          </div>
        </div>
      </div>
      
      {/* Top Welcome & Executive Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 p-8 text-white shadow-2xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-32 -bottom-20 w-64 h-64 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              Kitgum Technical Institute • Academic Year 2025/2026
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">{currentUser?.name || 'Scholar'}</span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Your centralized institutional dashboard for technical operations, department workshops, Guild initiatives, admissions, and campus athletics.
            </p>
            
            {/* Quick action buttons */}
            <div className="flex flex-wrap gap-2.5 pt-2">
              <Link to="/admissions" className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold rounded-xl text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all hover:scale-105">
                <Plus size={16} /> New Admission
              </Link>
              <Link to="/guild" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/15 backdrop-blur transition-all">
                <Shield size={16} /> Guild Petitions
              </Link>
              <Link to="/sports" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/15 backdrop-blur transition-all">
                <Trophy size={16} /> Warriors Athletics
              </Link>
              <Link to="/alumni" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs sm:text-sm border border-white/15 backdrop-blur transition-all">
                <GraduationCap size={16} /> Alumni Hub
              </Link>
            </div>
          </div>

          {/* Quick Perspective Switcher Card */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-5 backdrop-blur-md lg:w-72 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-bold text-cyan-200 tracking-wider">Current Role</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">{currentUser?.role || 'Guest'}</span>
            </div>
            <p className="text-xs text-slate-300 mb-3">Switch role preview to test multi-role productivity:</p>
            <div className="grid grid-cols-2 gap-1.5">
              <button onClick={() => switchRole('Administrator')} className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${currentUser?.role === 'Administrator' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/5 hover:bg-white/15 text-slate-200'}`}>Admin</button>
              <button onClick={() => switchRole('Student')} className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${currentUser?.role === 'Student' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/5 hover:bg-white/15 text-slate-200'}`}>Student</button>
              <button onClick={() => switchRole('Guild President')} className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${currentUser?.role === 'Guild President' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/5 hover:bg-white/15 text-slate-200'}`}>Guild Head</button>
              <button onClick={() => switchRole('Alumni')} className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-all ${currentUser?.role === 'Alumni' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-white/5 hover:bg-white/15 text-slate-200'}`}>Alumni</button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Productivity Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Enrollment</span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800">2,184</div>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              <span className="text-emerald-500">↑ 12%</span> vs last intake (August 2024)
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Male: 1,320</span>
            <span>Female: 864 (39.5%)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Departments & Labs</span>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Building2 size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800">{departments.length} Units</div>
            <p className="text-xs font-semibold text-blue-600 mt-1 flex items-center gap-1">
              18 Fully Equipped Workshops
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Civil • Elec • Auto</span>
            <span>ICT • Agri • Garment</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Guild Initiatives</span>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800">{guildProjects.length} Active</div>
            <p className="text-xs font-semibold text-indigo-600 mt-1 flex items-center gap-1">
              85% Avg Completion Rate
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Wi-Fi • Overalls • Green</span>
            <Link to="/guild" className="text-blue-600 font-semibold hover:underline">View Guild</Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 hover:shadow-md transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sports League</span>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy size={24} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-black text-slate-800">#1 Top Table</div>
            <p className="text-xs font-semibold text-emerald-600 mt-1 flex items-center gap-1">
              22 Points • 7 Wins, 0 Losses
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-xs text-slate-500">
            <span>Next: vs UTC Lira</span>
            <Link to="/sports" className="text-rose-600 font-semibold hover:underline">Match Center</Link>
          </div>
        </div>
      </div>

      {/* Main Productivity Hub: Tasks Manager + Daily Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Interactive Study & Task Planner (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><CheckCircle2 size={20} /></span>
                  <h2 className="text-xl font-bold text-slate-800">Productive Tasks & Study Planner</h2>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">Keep track of workshop assignments, guild duties, and academic deadlines.</p>
              </div>

              {/* Progress pill */}
              <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-700">{completedCount} of {tasks.length} Done</div>
                  <div className="text-[10px] text-slate-400">Completion: {taskProgress}%</div>
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white font-bold text-xs">
                  {taskProgress}%
                </div>
              </div>
            </div>

            {/* Quick Add Form */}
            <form onSubmit={handleCreateTask} className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" 
                  placeholder="Add a new academic or workshop action item..." 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all shrink-0 flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Task
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Category:</span>
                  <select 
                    value={newTaskCategory} 
                    onChange={(e) => setNewTaskCategory(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    <option value="Academic">Academic</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Guild">Guild</option>
                    <option value="Sports">Sports</option>
                    <option value="Registry">Registry</option>
                    <option value="Alumni">Alumni</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Priority:</span>
                  <select 
                    value={newTaskPriority} 
                    onChange={(e) => setNewTaskPriority(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500 font-semibold">Due:</span>
                  <input 
                    type="text" 
                    placeholder="e.g. Tomorrow 4pm" 
                    value={newTaskDueDate}
                    onChange={(e) => setNewTaskDueDate(e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-700 w-32"
                  />
                </div>
              </div>
            </form>

            {/* Task Filters */}
            <div className="flex items-center gap-2 overflow-x-auto py-3 mt-4 text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Filter size={12} /> Filter:
              </span>
              {['All', 'Pending', 'Completed', 'Academic', 'Workshop', 'Guild', 'Sports'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${
                    filterCategory === cat 
                      ? 'bg-slate-800 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Tasks List */}
            <div className="space-y-2.5 mt-2">
              {filteredTasks.length === 0 ? (
                <div className="p-8 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
                  No tasks found in this category. Use the form above to add one!
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                      task.completed 
                        ? 'bg-slate-50/70 border-slate-200 opacity-60' 
                        : 'bg-white border-slate-200/90 shadow-xs hover:border-blue-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <button 
                        onClick={() => toggleTask(task.id)}
                        className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors shrink-0 ${
                          task.completed 
                            ? 'bg-emerald-500 border-emerald-500 text-white' 
                            : 'border-slate-300 hover:border-blue-500 bg-white'
                        }`}
                      >
                        {task.completed && <CheckCircle2 size={16} />}
                      </button>
                      <div className="min-w-0">
                        <p className={`text-sm font-semibold truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {task.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className={`px-2 py-0.5 rounded-md font-bold ${
                            task.priority === 'High' ? 'bg-red-50 text-red-600 border border-red-200' :
                            task.priority === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {task.priority} Priority
                          </span>
                          <span className="text-slate-400 font-medium">• {task.category}</span>
                          <span className="text-slate-400 font-medium">• Due {task.dueDate}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-red-500 p-2 rounded-lg transition-colors ml-2"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Department Quick Links & Innovation Highlights */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Technical Departments & Workshops</h3>
                <p className="text-xs text-slate-500">7 accredited engineering, trade, and vocational disciplines</p>
              </div>
              <Link to="/departments" className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.slice(0, 6).map(dept => (
                <Link 
                  key={dept.id} 
                  to="/departments" 
                  className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                        {dept.code}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{dept.studentsCount} Trainees</span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">{dept.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description}</p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                    <span className="truncate">HOD: {dept.hod}</span>
                    <ChevronRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Daily Live Timetable + Announcements + Quick Shortcuts (1 Col) */}
        <div className="space-y-6">
          
          {/* Today's Timetable Widget */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Clock size={18} /></span>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Today's Schedule</h3>
                  <p className="text-[11px] text-slate-400">Live academic & practical sessions</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                Active
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {schedule.map(item => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-slate-300 transition-all">
                  <div className="flex items-center justify-between text-xs font-bold mb-1">
                    <span className="text-blue-600">{item.time}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-200/70 text-slate-700">{item.badge}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>📍 {item.venue}</span>
                    <span className="italic">{item.instructor}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Shortcuts Launchpad */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-white/10">
            <h3 className="font-bold text-base text-white flex items-center gap-2 mb-1">
              <Sparkles size={18} className="text-cyan-400" />
              Institutional Launchpad
            </h3>
            <p className="text-xs text-slate-300 mb-4">Direct shortcuts to primary institutional services:</p>

            <div className="space-y-2">
              <Link to="/admissions" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-xs font-semibold group">
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Online Admissions & Requirements
                </span>
                <ChevronRight size={14} className="text-cyan-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/guild" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-xs font-semibold group">
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-400"></span> Guild Cabinet & Student Petitions
                </span>
                <ChevronRight size={14} className="text-indigo-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/sports" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-xs font-semibold group">
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span> KTI Warriors Sports & Tryouts
                </span>
                <ChevronRight size={14} className="text-rose-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/activities" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-xs font-semibold group">
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span> Campus Activities & Cultural Gala
                </span>
                <ChevronRight size={14} className="text-amber-300 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/alumni" className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 transition-all text-xs font-semibold group">
                <span className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Alumni Career & Transcript Service
                </span>
                <ChevronRight size={14} className="text-emerald-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Campus Life & Technical Practical Showcase Photo Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-800 text-base">Campus & Workshop Life</h3>
              <Link to="/about" className="text-xs font-bold text-cyan-600 hover:underline">View All</Link>
            </div>
            
            <div className="grid grid-cols-2 gap-2.5">
              <Link to="/about" className="group relative rounded-xl overflow-hidden h-28 border border-slate-200 shadow-sm block">
                <img 
                  src={`${baseUrl}images/campus-main.jpg`} 
                  alt="KTI Main Campus" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white truncate">Main Campus</span>
                </div>
              </Link>
              <Link to="/departments" className="group relative rounded-xl overflow-hidden h-28 border border-slate-200 shadow-sm block">
                <img 
                  src={`${baseUrl}images/workshop-1.jpg`} 
                  alt="TVET Workshops" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white truncate">Workshops</span>
                </div>
              </Link>
              <Link to="/sports" className="group relative rounded-xl overflow-hidden h-28 border border-slate-200 shadow-sm block">
                <img 
                  src={`${baseUrl}images/sports-football.jpg`} 
                  alt="Warriors Sports" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white truncate">Warriors Sports</span>
                </div>
              </Link>
              <Link to="/activities" className="group relative rounded-xl overflow-hidden h-28 border border-slate-200 shadow-sm block">
                <img 
                  src={`${baseUrl}images/exhibition.jpg`} 
                  alt="Innovation Expo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-2">
                  <span className="text-[10px] font-bold text-white truncate">Tech Galas</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Announcements & News Feed */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-base">Campus Notices</h3>
              <Link to="/announcements" className="text-xs font-bold text-blue-600 hover:underline">All News</Link>
            </div>

            <div className="space-y-3">
              {announcements.slice(0, 3).map(item => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-bold text-blue-600">{item.department}</span>
                    <span>{item.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
