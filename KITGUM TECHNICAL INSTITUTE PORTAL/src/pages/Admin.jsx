import React from 'react';
import { Shield, Settings, Users, Database } from 'lucide-react';

const Admin = () => {
  return (
    <div className="p-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary/10 p-3 rounded-xl">
          <Shield className="text-primary" size={32} />
        </div>
        <h1 className="text-3xl font-black tracking-tight text-slate-800">Admin Portal</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-1">
          <div className="bg-blue-50 p-4 rounded-full mb-6">
            <Users size={32} className="text-blue-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800">User Management</h2>
          <p className="text-slate-500 text-sm">Manage system users, roles, and permissions.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-1">
          <div className="bg-slate-50 p-4 rounded-full mb-6">
            <Settings size={32} className="text-slate-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm">Configure global system parameters.</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:shadow-md hover:-translate-y-1">
          <div className="bg-emerald-50 p-4 rounded-full mb-6">
            <Database size={32} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold mb-2 text-slate-800">Database Backups</h2>
          <p className="text-slate-500 text-sm">Manage data backups and restoration.</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
