import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  LayoutDashboard, Users, BookOpen, CreditCard, LogOut, 
  GraduationCap, Menu, X, Settings, User, Building2, 
  Search, Bell, MessageSquare, Share2, Trophy, Shield, 
  Sparkles, Compass, CheckCircle2, ChevronDown, Zap, Activity
} from 'lucide-react';

const Layout = () => {
  const { 
    currentUser, 
    logout, 
    switchRole, 
    announcements, 
    isFunctionRunning, 
    activeFunctionName, 
    triggerSystemFunction 
  } = useGlobalContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const baseUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    const handleScroll = () => {
      const mainContent = document.getElementById('main-scroll-area');
      if (mainContent) {
        setScrolled(mainContent.scrollTop > 10);
      }
    };
    const mainContent = document.getElementById('main-scroll-area');
    if (mainContent) {
      mainContent.addEventListener('scroll', handleScroll);
      return () => mainContent.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Kitgum Technical Institute Portal',
          text: 'Explore Kitgum Technical Institute - Education for Self Reliance',
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Institutional portal link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Main Dashboard', icon: <LayoutDashboard size={19} /> },
    { path: '/about', label: 'Mission & Vision', icon: <Compass size={19} /> },
    { path: '/admissions', label: 'Admissions', icon: <Users size={19} /> },
    { path: '/departments', label: 'Departments', icon: <Building2 size={19} /> },
    { path: '/guild', label: 'Students\' Guild', icon: <Shield size={19} /> },
    { path: '/sports', label: 'Warriors Sports', icon: <Trophy size={19} /> },
    { path: '/activities', label: 'Campus Activities', icon: <Sparkles size={19} /> },
    { path: '/alumni', label: 'Alumni Network', icon: <GraduationCap size={19} /> },
    { path: '/students', label: 'Student Portal', icon: <User size={19} /> },
    { path: '/academic', label: 'Academic Portal', icon: <BookOpen size={19} /> },
    { path: '/finance', label: 'Finance & Fees', icon: <CreditCard size={19} /> },
    { path: '/registry', label: 'Registry Department', icon: <BookOpen size={19} /> },
    { path: '/principal', label: 'Principal Office', icon: <Building2 size={19} /> },
    { path: '/admin', label: 'Admin Portal', icon: <Settings size={19} /> },
    { path: '/announcements', label: 'Campus News', icon: <MessageSquare size={19} /> }
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative font-sans text-slate-800">
      
      {/* Decorative ambient background */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-blue-100/40 via-blue-50/20 to-transparent pointer-events-none -z-10"></div>
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-all duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 glass-dark text-white transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-auto flex flex-col border-r border-white/5 shadow-2xl ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand header with dynamic badge animation when function is running */}
        <div className="p-6 border-b border-white/10 relative">
          <div className="flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              
              {/* Badge with energetic glowing/pulsing animation when a function is running */}
              <div className="relative">
                {isFunctionRunning && (
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-cyan-400 to-blue-500 rounded-2xl blur-md opacity-90 animate-pulse"></div>
                )}
                <div className={`relative w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden p-1 shrink-0 transition-all duration-300 ${
                  isFunctionRunning 
                    ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-900 scale-105 shadow-[0_0_25px_rgba(34,211,238,0.8)]' 
                    : 'group-hover:scale-105'
                }`}>
                  <img 
                    src={`${baseUrl}badge-final.png`} 
                    alt="KTI School Badge" 
                    className={`w-full h-full object-contain ${isFunctionRunning ? 'scale-110 drop-shadow-md' : ''}`} 
                    onError={(e) => { e.target.src = `${baseUrl}images/logo.jpg`; }}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-sm font-extrabold tracking-wide leading-tight text-white uppercase">
                  Kitgum Technical<br />
                  <span className="text-cyan-400">Institute</span>
                </h2>
                <p className="text-[10px] text-cyan-300 tracking-wider font-semibold italic">Education for Self Reliance</p>
              </div>
            </Link>

            <button className="lg:hidden text-slate-400 hover:text-white transition-colors bg-white/5 p-2 rounded-xl" onClick={() => setIsSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          {/* Active Function Running Banner under Badge */}
          {isFunctionRunning && (
            <div className="mt-3 p-2 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 shadow-lg shadow-cyan-500/20">
              <span className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300">Function Running</span>
                  <Activity size={12} className="text-cyan-400 animate-spin" />
                </div>
                <p className="text-[11px] font-bold text-white truncate">{activeFunctionName || 'Processing...'}</p>
              </div>
            </div>
          )}

          {/* Interactive Trigger Button for User Testing */}
          <button
            id="btn-test-active-function"
            onClick={() => triggerSystemFunction('Live Academic & TVET Sync', 8000)}
            className="mt-3 w-full py-1.5 px-3 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center gap-1.5 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer"
            title="Simulate active function to watch sidebar badge illuminate"
          >
            <Zap size={12} className="text-amber-400" />
            {isFunctionRunning ? 'Function In Progress...' : 'Test Active Function'}
          </button>
        </div>
        
        {/* Main Navigation links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-3">
            Institutional Navigation
          </div>
          
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs sm:text-sm font-medium ${
                  isActive 
                    ? 'bg-blue-600/30 text-cyan-300 font-bold border border-cyan-400/30 shadow-sm' 
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`${isActive ? 'text-cyan-400 drop-shadow-md' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>}
              </Link>
            );
          })}
        </nav>
        
        {/* User profile & session footer */}
        <div className="p-4 mt-auto border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 text-white flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{currentUser?.name || 'Public Visitor'}</p>
                <p className="text-[11px] text-cyan-300 truncate font-semibold">{currentUser?.role || 'Guest'}</p>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex-1 py-1.5 px-2 bg-white/10 hover:bg-white/20 text-cyan-200 text-xs font-semibold rounded-lg text-center transition-all"
              >
                Switch Role
              </button>
              <button 
                onClick={handleLogout}
                className="py-1.5 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg transition-all"
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>

            {/* Quick role selection dropdown in sidebar */}
            {showRoleMenu && (
              <div className="mt-2 pt-2 border-t border-white/10 grid grid-cols-2 gap-1 animate-in fade-in">
                {['Administrator', 'Student', 'Guild President', 'Alumni', 'Guest'].map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      switchRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`text-[10px] py-1 px-1.5 rounded text-left truncate font-semibold ${
                      currentUser?.role === r ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Top Header Bar */}
        <header className={`flex items-center justify-between px-6 lg:px-10 py-3.5 z-20 transition-all duration-300 ${scrolled ? 'glass border-b border-slate-200/80' : 'bg-transparent border-b border-transparent'}`}>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="lg:hidden p-2.5 text-slate-700 hover:bg-white rounded-xl shadow-xs border border-slate-200 transition-all bg-white/80"
              title="Open Navigation"
            >
              <Menu size={20} />
            </button>
            
            {/* Search Bar */}
            <div className="hidden sm:flex items-center bg-white/90 backdrop-blur-md rounded-2xl px-4 py-2 border border-slate-200/80 shadow-xs focus-within:ring-2 focus-within:ring-blue-500/20 w-64 lg:w-96 group">
              <Search size={16} className="text-slate-400 group-focus-within:text-blue-500 transition-colors mr-2.5 shrink-0" />
              <input 
                type="text" 
                placeholder="Search courses, departments, guild, sports..." 
                className="bg-transparent border-none outline-none text-xs sm:text-sm w-full text-slate-700 placeholder:text-slate-400 font-medium" 
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const q = e.target.value.toLowerCase();
                    if (q.includes('sport') || q.includes('warrior')) navigate('/sports');
                    else if (q.includes('admiss') || q.includes('apply')) navigate('/admissions');
                    else if (q.includes('guild') || q.includes('petition')) navigate('/guild');
                    else if (q.includes('dept') || q.includes('elect') || q.includes('civil')) navigate('/departments');
                    else if (q.includes('alumn') || q.includes('transcript')) navigate('/alumni');
                    else if (q.includes('activ') || q.includes('club')) navigate('/activities');
                    else navigate('/dashboard');
                  }
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            
            {/* Role indicator pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-blue-700">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              Role: {currentUser?.role || 'Guest'}
            </div>

            {/* Share button */}
            <button 
              onClick={handleShare} 
              className="p-2.5 text-slate-600 hover:text-blue-600 bg-white/90 hover:bg-white rounded-xl shadow-xs border border-slate-200 transition-all" 
              title="Share Portal Link"
            >
              <Share2 size={16} />
            </button>

            {/* Notifications Button & Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2.5 text-slate-600 hover:text-blue-600 bg-white/90 hover:bg-white rounded-xl shadow-xs border border-slate-200 transition-all relative"
                title="Notifications"
              >
                <Bell size={16} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
                    <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">Campus Alerts</span>
                    <span className="text-[10px] text-blue-600 font-bold">{announcements.length} New</span>
                  </div>
                  <div className="space-y-2.5 text-xs">
                    {announcements.slice(0, 3).map(a => (
                      <div key={a.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <p className="font-bold text-slate-800">{a.title}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">{a.content}</p>
                      </div>
                    ))}
                  </div>
                  <Link 
                    to="/announcements" 
                    onClick={() => setShowNotifMenu(false)}
                    className="block text-center mt-3 pt-2 border-t border-slate-100 text-xs font-bold text-blue-600 hover:underline"
                  >
                    View All Official Notices
                  </Link>
                </div>
              )}
            </div>

            {/* User avatar pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser?.name || 'Visitor'}</p>
                <p className="text-[10px] text-slate-400 font-medium">{currentUser?.role || 'Guest'}</p>
              </div>
            </div>

          </div>
        </header>

        {/* Scrollable Viewport */}
        <main id="main-scroll-area" className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 flex flex-col scroll-smooth">
          <div className="flex-1 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
          
          {/* Institutional Footer */}
          <footer className="mt-20 pt-8 pb-6 border-t border-slate-200/80 text-center text-xs text-slate-500 space-y-2">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
              <Link to="/dashboard" className="hover:text-blue-600">Dashboard</Link>
              <span>•</span>
              <Link to="/admissions" className="hover:text-blue-600">Admissions</Link>
              <span>•</span>
              <Link to="/departments" className="hover:text-blue-600">Departments</Link>
              <span>•</span>
              <Link to="/guild" className="hover:text-blue-600">Students' Guild</Link>
              <span>•</span>
              <Link to="/sports" className="hover:text-blue-600">Warriors Sports</Link>
              <span>•</span>
              <Link to="/activities" className="hover:text-blue-600">Activities & Galas</Link>
              <span>•</span>
              <Link to="/alumni" className="hover:text-blue-600">Alumni Network</Link>
            </div>
            <p className="text-slate-400">
              &copy; {new Date().getFullYear()} Kitgum Technical Institute. P.O. Box 34, Kitgum, Uganda. Accredited by UBTEB & DIT. All rights reserved.
            </p>
          </footer>
        </main>

      </div>
    </div>
  );
};

export default Layout;
