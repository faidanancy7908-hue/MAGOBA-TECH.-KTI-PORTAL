import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
import { GraduationCap, Shield, Users, CreditCard, BookOpen, User, UserCircle, Smartphone, AlertCircle, Mail, Eye, EyeOff, Coffee, Building, Menu, X, QrCode } from 'lucide-react';
import QRCode from 'react-qr-code';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showQR, setShowQR] = useState(false);
  
  const [step, setStep] = useState(1); // 1: Credentials
  const [showPassword, setShowPassword] = useState(false);
  const [isStakeholdersOpen, setIsStakeholdersOpen] = useState(false);
  
  // Registration State
  const [appData, setAppData] = useState({
    surname: '',
    otherName: '',
    role: '',
    dob: '',
    age: '',
    course: '',
    department: '',
    yearOfStudy: '',
    semester: ''
  });
  const [appSuccess, setAppSuccess] = useState(false);

  // MFA State
  const [mfaCode, setMfaCode] = useState('');
  const [mfaData, setMfaData] = useState({ user: null, code: null, expiresAt: null, email: '' });
  const [timeLeft, setTimeLeft] = useState(120);

  const { verifyCredentials, completeLogin, users, students } = useGlobalContext();
  const navigate = useNavigate();

  // Countdown Timer for MFA
  useEffect(() => {
    let timer;
    if (step === 2 && mfaData.expiresAt) {
      timer = setInterval(() => {
        const remaining = Math.max(0, Math.floor((mfaData.expiresAt - Date.now()) / 1000));
        setTimeLeft(remaining);
        if (remaining === 0) {
          setError('Your authentication code has expired. Please log in again.');
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, mfaData.expiresAt]);

  const handleCredentials = async (e) => {
    e.preventDefault();
    setError('');
    
    // Auto-resolve role based on username/email
    let loginRole = role;
    const foundUser = users.find(u => 
      u.username.toLowerCase() === username.toLowerCase() || 
      students.some(s => s.email.toLowerCase() === username.toLowerCase() && s.user_id === u.id)
    );
    
    if (foundUser) {
      loginRole = foundUser.role;
      setRole(foundUser.role);
    }

    // Removed local check to allow GlobalContext to handle dynamic user creation
    const result = await verifyCredentials(username, password, loginRole);
    if (result) {
      completeLogin(result.user);
      if (result.user.role === 'Student') {
        navigate('/students');
      } else if (result.user.role === 'Principal') {
        navigate('/principal');
      } else if (result.user.role === 'Administrator') {
        navigate('/admin');
      } else if (result.user.role === 'Registry') {
        navigate('/registry');
      } else if (result.user.role === 'Finance') {
        navigate('/finance');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid credentials.');
    }
  };

  const handleCompleteLogin = (e) => {
    e.preventDefault();
    if (mfaCode === '123456' || mfaCode.length === 6) { // Accept any 6 digit code for demo
      completeLogin(mfaData.user);
      // Route based on role
      if (mfaData.user.role === 'Student') {
        navigate('/students');
      } else if (mfaData.user.role === 'Principal') {
        navigate('/principal');
      } else if (mfaData.user.role === 'Administrator') {
        navigate('/admin');
      } else if (mfaData.user.role === 'Registry') {
        navigate('/registry');
      } else if (mfaData.user.role === 'Finance') {
        navigate('/finance');
      } else {
        navigate('/dashboard');
      }
    } else {
      setError('Invalid verification code.');
    }
  };

  const handleMFA = (e) => {
    e.preventDefault();
    setError('');
    
    if (Date.now() > mfaData.expiresAt) {
      setError('Your authentication code has expired. Please go back and log in again.');
      return;
    }

    handleCompleteLogin(e);
  };

  const handleApplication = (e) => {
    e.preventDefault();
    if (!appData.surname || !appData.otherName || !appData.role) {
      setError('Please fill in the required fields.');
      return;
    }
    setError('');
    // Mock application submission success
    setAppSuccess(true);
    setTimeout(() => {
      setAppSuccess(false);
      setStep(1);
    }, 3000);
  };

  const stakeholders = [
    { role: 'Administrator', icon: <Shield size={20} />, desc: 'System configuration & global oversight' },
    { role: 'Principal', icon: <Building size={20} />, desc: 'Executive oversight & institution management' },
    { role: 'Finance', icon: <CreditCard size={20} />, desc: 'Tuition tracking & ledger reconciliation' },
    { role: 'Lecturer', icon: <BookOpen size={20} />, desc: 'Academic grading & course management' },
    { role: 'Student', icon: <User size={20} />, desc: 'Course registration & transcript access' },
    { role: 'Alumni', icon: <GraduationCap size={20} />, desc: 'Past academic records access' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center relative p-4 py-12 bg-slate-900">
      {/* Background Image Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/KITGUM-TECHNICAL-INSTITUTE-PORTAL/welcome-bg.jpeg)' }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-900/40 to-slate-900/90 mix-blend-multiply"></div>

      {/* SINGLE LARGE CONTAINER */}
      <div className="w-full max-w-xl bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10 border border-white/20">
        
        {/* LOGO AREA */}
        <div className="bg-primary text-white p-8 lg:p-10 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-400 rounded-full blur-3xl opacity-20"></div>

          <div className="relative z-10 flex flex-col items-center justify-center w-full text-center">
            <div className="bg-white p-3 rounded-2xl shadow-xl mb-4 transform hover:scale-105 transition-transform overflow-hidden">
              <img src="/KITGUM-TECHNICAL-INSTITUTE-PORTAL/badge-final.png" alt="Kitgum Technical Institute Crest" className="w-20 h-20 sm:w-24 sm:h-24 object-contain" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">Kitgum Technical Institute</h1>
            <p className="text-blue-200 text-xs sm:text-sm font-medium tracking-widest uppercase italic">"Education for Self Reliance"</p>
          </div>
        </div>

        {/* LOGIN AREA */}
        <div className="p-8 lg:p-10 bg-white flex flex-col items-center">
          <div className="max-w-md w-full">
            {step === 1 ? (
              <div className="animate-in fade-in duration-500">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 border-4 border-white shadow-lg text-slate-400 mb-4">
                    <UserCircle size={40} strokeWidth={1.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Sign In</h2>
                  <p className="text-slate-500 mt-1 text-sm">Access your personalized dashboard</p>
                </div>

                <div className="min-h-[50px] mb-4">
                  {error && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center shadow-sm">
                      {error}
                    </div>
                  )}
                </div>

                <form onSubmit={handleCredentials} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email or Username</label>
                    <input 
                      type="text" 
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400 shadow-sm"
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter Username or Official Email"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 shadow-sm"
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <div className="flex justify-between items-center mt-3 px-1">
                      <div className="flex items-center gap-2">
                        <input type="checkbox" id="remember" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary accent-primary cursor-pointer" />
                        <label htmlFor="remember" className="text-xs font-medium text-slate-600 cursor-pointer">Remember me & Save account</label>
                      </div>
                      <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-primary hover:text-blue-800 transition-colors">Forgot password?</a>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Role (Optional)</label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-slate-900 shadow-sm"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="">Auto-detect Role</option>
                      <option value="Student">Student</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Principal">Principal</option>
                      <option value="Finance">Finance</option>
                      <option value="Registry">Registry</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>

                  <button 
                    type="submit" 
                    className="w-full py-3.5 px-4 bg-primary hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 mt-4"
                  >
                    Secure Login
                  </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-600 font-medium">
                  Are you a new applicant? <a href="#" onClick={(e) => { e.preventDefault(); setStep(3); setError(''); }} className="text-primary hover:text-blue-800 font-bold transition-colors">Apply for a portal.</a>
                </div>
                
                <div className="mt-6 flex flex-col items-center border-t border-slate-100 pt-6">
                  <button 
                    type="button"
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary transition-colors mb-4"
                  >
                    <QrCode size={18} /> {showQR ? 'Hide Mobile QR Code' : 'Show Mobile Login QR'}
                  </button>
                  {showQR && (
                    <div className="p-4 bg-white rounded-2xl shadow-lg border border-slate-100 animate-in zoom-in-95 duration-300">
                      <QRCode 
                        value={window.location.href.includes('localhost') ? window.location.href.replace('localhost', '10.100.3.144') : window.location.href} 
                        size={150} 
                        fgColor="#0f172a" 
                      />
                      <p className="text-xs text-center text-slate-500 font-medium mt-3 uppercase tracking-widest">Scan with phone</p>
                    </div>
                  )}
                </div>
              </div>
            ) : step === 2 ? (
              <div className="animate-in fade-in duration-500">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 border-4 border-white shadow-lg text-blue-600 mb-4 relative">
                    <Smartphone size={32} />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-2 border-white">
                      <Mail size={12} />
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">2-Step Verification</h2>
                  <p className="text-slate-500 mt-2 text-sm">
                    A unique 6-digit code has been sent to:<br/>
                    <strong className="text-slate-800">{mfaData.email}</strong>
                  </p>
                </div>

                <div className="min-h-[50px] mb-4">
                  {error ? (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center shadow-sm">
                      {error}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm flex items-center gap-2 shadow-sm font-medium">
                      <AlertCircle size={18} className="shrink-0" />
                      Code expires in {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>

                <form onSubmit={handleMFA} className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Enter Authenticator Code</label>
                    <input 
                      type="text" 
                      maxLength="6"
                      autoFocus
                      disabled={timeLeft === 0}
                      className="w-full text-center tracking-[0.5em] text-2xl px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all font-black text-slate-900 shadow-sm disabled:opacity-50"
                      value={mfaCode} 
                      onChange={(e) => setMfaCode(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="------"
                    />
                    
                    {/* FOR DEMO PURPOSES */}
                    <div className="mt-3 p-2 rounded-lg bg-blue-50 border border-blue-100 text-center text-xs text-blue-600">
                      <strong>Demo Mode MOCK EMAIL:</strong> Check console or use code <span className="font-mono font-bold tracking-widest bg-blue-100 px-1 py-0.5 rounded">{mfaData.code}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => { setStep(1); setMfaCode(''); setError(''); }}
                      className="flex-1 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all"
                    >
                      Back
                    </button>
                    <button 
                      type="submit" 
                      disabled={timeLeft === 0}
                      className="flex-[2] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                    >
                      Verify
                    </button>
                  </div>
                </form>
              </div>
            ) : step === 3 ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500 w-full">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 border-4 border-white shadow-lg text-blue-600 mb-4">
                    <User size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900">Portal Application</h2>
                  <p className="text-slate-500 mt-1 text-sm">Submit your details to request access</p>
                </div>

                <div className="min-h-[40px] mb-4">
                  {error ? (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center shadow-sm">
                      <AlertCircle size={16} className="mr-2" /> {error}
                    </div>
                  ) : appSuccess ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center shadow-sm">
                      Application submitted successfully! Redirecting...
                    </div>
                  ) : null}
                </div>

                <form onSubmit={handleApplication} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Surname</label>
                      <input 
                        type="text" required
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                        value={appData.surname} onChange={(e) => setAppData({...appData, surname: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Other Name</label>
                      <input 
                        type="text" required
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                        value={appData.otherName} onChange={(e) => setAppData({...appData, otherName: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                    <select 
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                      value={appData.role} onChange={(e) => setAppData({...appData, role: e.target.value})}
                    >
                      <option value="">Select a role...</option>
                      <option value="Student">Student</option>
                      <option value="Lecturer">Lecturer</option>
                      <option value="Administrator">Administrator</option>
                      <option value="Finance">Finance</option>
                      <option value="Registry">Registry</option>
                      <option value="Alumni">Alumni</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                      <input 
                        type="date" required
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                        value={appData.dob} onChange={(e) => setAppData({...appData, dob: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Age</label>
                      <input 
                        type="number" min="1" required
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                        value={appData.age} onChange={(e) => setAppData({...appData, age: e.target.value})}
                      />
                    </div>
                  </div>

                  {appData.role === 'Student' && (
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl space-y-4 animate-in slide-in-from-top-2">
                      <h4 className="text-xs font-bold text-blue-800 uppercase tracking-wider">Student Details</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Course</label>
                          <input 
                            type="text" required
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                            value={appData.course} onChange={(e) => setAppData({...appData, course: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                          <input 
                            type="text" required
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                            value={appData.department} onChange={(e) => setAppData({...appData, department: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Year of Study</label>
                          <input 
                            type="text" required placeholder="e.g., Year 1"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                            value={appData.yearOfStudy} onChange={(e) => setAppData({...appData, yearOfStudy: e.target.value})}
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Semester</label>
                          <input 
                            type="text" required placeholder="e.g., 1"
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm text-slate-900"
                            value={appData.semester} onChange={(e) => setAppData({...appData, semester: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button 
                      type="button" 
                      onClick={() => { setStep(1); setError(''); }}
                      className="flex-1 py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all text-sm"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="flex-[2] py-3 px-4 bg-primary hover:bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-sm"
                    >
                      Submit Application
                    </button>
                  </div>
                </form>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
