
import React, { useState, useEffect } from 'react';
import { User, ActivityLog } from '../types';
import { supabaseService } from '../services/supabase';
import { AdminResetPasswordModal } from '../components/Modals/AdminResetPasswordModal';
import { AddUserModal } from '../components/Modals/AddUserModal';

interface Props {
  user: User;
}

const AdminPage: React.FC<Props> = ({ user }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [activeTab, setActiveTab] = useState<'users' | 'logs'>('users');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchData = () => {
    supabaseService.getUsers().then(setUsers);
    supabaseService.getLogs().then(setLogs);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetPassword = (target: User) => {
    setSelectedUser(target);
    setShowResetModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 border-b w-full md:w-auto">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            Gestion Utilisateurs
          </button>
          <button 
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-3 font-bold text-sm transition-all border-b-2 ${activeTab === 'logs' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-400'}`}
          >
            Journal d'activité
          </button>
        </div>

        {activeTab === 'users' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
          >
            <i className="fas fa-user-plus"></i> Ajouter un Utilisateur
          </button>
        )}
      </div>

      {activeTab === 'users' ? (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Departement</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold text-xs uppercase">
                        {u.fullname.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{u.fullname}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider border ${
                      u.role === 'superviseur' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 
                      u.role === 'gestionnaire' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium capitalize">{u.departement}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleResetPassword(u)}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-all"
                        title="Réinitialiser mot de passe"
                      >
                        <i className="fas fa-key text-xs"></i>
                      </button>
                      <button className="w-8 h-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">User</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {logs.map(log => (
                <tr key={log.id} className="text-sm hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-slate-400 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</td>
                  <td className="px-6 py-3 font-bold text-slate-700">{log.user}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                      log.level === 'security' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-slate-500 italic">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showResetModal && selectedUser && (
        <AdminResetPasswordModal 
          targetUser={selectedUser} 
          adminUser={user} 
          onClose={() => {
            setShowResetModal(false);
            setSelectedUser(null);
          }} 
        />
      )}

      {showAddModal && (
        <AddUserModal 
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            fetchData();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AdminPage;
