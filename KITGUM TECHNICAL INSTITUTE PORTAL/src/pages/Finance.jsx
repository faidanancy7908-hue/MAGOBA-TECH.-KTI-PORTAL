import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import { 
  CreditCard, PlusCircle, CheckCircle, AlertTriangle, 
  Download, FileSpreadsheet, ShieldCheck, UserCheck, 
  Search, ArrowUpRight, DollarSign, Receipt, Sparkles 
} from 'lucide-react';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

const Finance = () => {
  const { ledger, makePayment, getStudentBalance, currentUser, students } = useGlobalContext();
  const [selectedStudentId, setSelectedStudentId] = useState(currentUser?.student_id || (students[0]?.student_id || 'S001'));
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('Tuition & Practical Workshop Fee');
  const [filterStudent, setFilterStudent] = useState('all');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isLoading, setIsLoading] = useState(false);

  const activeStudent = students.find(s => s.student_id === selectedStudentId) || students[0] || {
    name: 'Jane Doe',
    student_id: 'S001'
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!amount || !description) {
      setMessage({ text: 'Please enter an amount and payment description.', type: 'error' });
      return;
    }
    
    setIsLoading(true);
    try {
      await makePayment(selectedStudentId, amount, description);
      setMessage({ 
        text: `Payment of UGX ${Number(amount).toLocaleString()} for ${activeStudent.name} recorded successfully. Official receipt issued.`, 
        type: 'success' 
      });
      setAmount('');
      setDescription('Tuition & Practical Workshop Fee');
    } catch (err) {
      setMessage({ text: err.message || 'Payment processing failed', type: 'error' });
    } finally {
      setIsLoading(false);
    }
    
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  // Filtered Ledger
  const displayedLedger = filterStudent === 'all'
    ? ledger
    : ledger.filter(l => l.student_id === filterStudent);

  // Chronological sorting (oldest to newest)
  const sortedLedger = [...displayedLedger].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Running Balance Calculation
  const ledgerWithRunningBalance = sortedLedger.reduce((acc, entry) => {
    const lastBalance = acc.length > 0 ? acc[acc.length - 1].runningBalance : 0;
    const runningBalance = lastBalance + parseFloat(entry.amount);
    acc.push({ ...entry, runningBalance });
    return acc;
  }, []);

  const currentStudentBalance = getStudentBalance(selectedStudentId);
  const isOwed = currentStudentBalance < 0;

  const totalCollected = ledger
    .filter(l => l.amount > 0)
    .reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const exportColumns = [
    { header: 'Date', key: 'date' },
    { header: 'Student ID', key: 'student_id' },
    { header: 'Student Name', key: 'student_name' },
    { header: 'Type', key: 'type' },
    { header: 'Description', key: 'description' },
    { header: 'Amount (UGX)', key: 'amount' },
    { header: 'Running Balance (UGX)', key: 'runningBalance' }
  ];

  const exportData = ledgerWithRunningBalance.map(entry => {
    const student = students.find(s => s.student_id === entry.student_id);
    return {
      ...entry,
      student_name: student?.name || 'Institutional Account',
      amount: parseFloat(entry.amount).toLocaleString(),
      runningBalance: parseFloat(entry.runningBalance).toLocaleString()
    };
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-20 animate-in fade-in duration-300">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={14} /> Open Bursary & Financial Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Bursar & Finance Department
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
              Open tuition recording, student fee reconciliation, institutional treasury ledger, and instant fee clearance statements.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex items-center gap-5 shrink-0 shadow-lg">
            <div className="w-14 h-14 rounded-xl bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
              <Receipt size={32} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Treasury Volume</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-black text-white">UGX {totalCollected.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-emerald-300 font-semibold">Reconciled & Audited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unrestricted Policy Callout */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 className="font-bold text-emerald-900 text-sm">KTI TVET Open Academic Guarantee</h3>
            <p className="text-xs text-emerald-700">
              All enrolled trainees maintain full access to workshop machinery, exam halls, and course materials. No student is locked out of technical education.
            </p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 text-white text-xs font-bold rounded-lg shadow-sm shrink-0">
          <CheckCircle size={14} /> Zero Restrictions Active
        </div>
      </div>

      {/* Student Balance Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0">
            <UserCheck size={28} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Trainee Account Statement</p>
            <h3 className="text-xl font-black text-slate-800">{activeStudent.name} ({activeStudent.student_id})</h3>
            <p className="text-xs text-slate-500">Student ID: {activeStudent.student_id} • Status: Active Trainee</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <select 
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {students.map(s => (
              <option key={s.student_id} value={s.student_id}>
                {s.name} ({s.student_id})
              </option>
            ))}
          </select>

          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Account Balance</p>
            <p className={`text-2xl font-black ${isOwed ? 'text-amber-600' : 'text-emerald-700'}`}>
              UGX {Math.abs(currentStudentBalance).toLocaleString()} {isOwed ? '(Pending Balance)' : '(Fully Cleared)'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Payment Form & Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Record Payment (Open to all roles) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-6">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <PlusCircle className="text-emerald-600" size={22} />
              <h3 className="font-bold text-slate-800 text-base">Record Tuition Payment</h3>
            </div>

            <div className="p-6">
              {message.text && (
                <div className={`mb-5 p-4 rounded-xl flex items-start gap-3 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {message.type === 'success' ? <CheckCircle size={18} className="shrink-0 mt-0.5" /> : <AlertTriangle size={18} className="shrink-0 mt-0.5" />}
                  <p className="text-xs font-medium">{message.text}</p>
                </div>
              )}

              <form onSubmit={handlePayment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Beneficiary Trainee</label>
                  <select 
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {students.map(s => (
                      <option key={s.student_id} value={s.student_id}>{s.name} ({s.student_id})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Amount to Pay (UGX)</label>
                  <input 
                    type="number"
                    min="1000"
                    step="500"
                    placeholder="e.g. 250000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-black text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Payment Narrative / Purpose</label>
                  <input 
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Term II Workshop Fee"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-[11px] text-slate-500 leading-relaxed">
                  Receipts are electronically tagged with an audit timestamp and instantly credited to the student&apos;s ledger.
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CreditCard size={16} />
                  {isLoading ? 'Processing...' : 'Authorize & Issue Receipt'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Ledger & Transactions Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <Receipt className="text-emerald-600" size={22} />
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Treasury Ledger & Audit Trail</h3>
                  <p className="text-xs text-slate-500">Live journal entries and student fee account statements</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <select 
                  value={filterStudent}
                  onChange={(e) => setFilterStudent(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white"
                >
                  <option value="all">All Students Ledger</option>
                  {students.map(s => (
                    <option key={s.student_id} value={s.student_id}>{s.name}</option>
                  ))}
                </select>

                <button 
                  onClick={() => exportToPDF(exportData, 'KTI_Finance_Ledger', exportColumns, 'Kitgum Technical Institute - Official Finance Ledger')} 
                  className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-lg border border-red-200 flex items-center gap-1 transition-colors"
                >
                  <Download size={13}/> PDF
                </button>
                <button 
                  onClick={() => exportToCSV(exportData, 'KTI_Finance_Ledger', exportColumns)} 
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
                >
                  <FileSpreadsheet size={13}/> CSV
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-5 py-3 font-bold">Date</th>
                    <th className="px-5 py-3 font-bold">Student</th>
                    <th className="px-5 py-3 font-bold">Narrative</th>
                    <th className="px-5 py-3 font-bold text-right">Amount (UGX)</th>
                    <th className="px-5 py-3 font-bold text-right">Balance (UGX)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {ledgerWithRunningBalance.map((item, index) => {
                    const student = students.find(s => s.student_id === item.student_id);
                    const isCredit = item.amount > 0;
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 font-mono text-xs text-slate-500">{item.date}</td>
                        <td className="px-5 py-3">
                          <p className="font-bold text-slate-800 text-xs">{student?.name || 'General'}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{item.student_id}</p>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-700 font-medium">{item.description}</td>
                        <td className={`px-5 py-3 text-right font-black text-xs ${isCredit ? 'text-emerald-600' : 'text-slate-800'}`}>
                          {isCredit ? '+' : ''}{parseFloat(item.amount).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-right font-mono text-xs font-bold text-slate-700">
                          {parseFloat(item.runningBalance).toLocaleString()}
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

    </div>
  );
};

export default Finance;
