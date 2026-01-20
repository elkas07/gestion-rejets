
import React, { useState } from 'react';
import { User } from './types';
import { supabaseService } from './services/supabase';
import { ChangePasswordModal } from './components/Modals/ChangePasswordModal';

// Pages
import Dashboard from './pages/Dashboard';
import SaisiePage from './pages/SaisiePage';
import RejetsPage from './pages/RejetsPage';
import ValidationPage from './pages/ValidationPage';
import AdminPage from './pages/AdminPage';
import ReportsPage from './pages/ReportsPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPwdModal, setShowPwdModal] = useState(false);
  const [isPublicPwdChange, setIsPublicPwdChange] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: 'sramadan@ecobank.com', password: '', role: 'superviseur' as const });
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const users = await supabaseService.getUsers();
      const user = users.find(u => u.email === loginData.email && u.role === loginData.role);
      
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user);
        supabaseService.addLog({
          level: 'info',
          user: user.username,
          action: 'Connexion',
          details: `Connecté sur v3.6 Platinum`
        });
        
        if (user.force_password_change) {
          setShowPwdModal(true);
        }
      } else {
        setError("Identifiants ou rôle incorrects.");
      }
    } catch (err) {
      setError("Erreur de connexion au service.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 p-6">
        <div className="mb-8 flex flex-col items-center animate-bounce">
            <div className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_30px_rgba(6,182,212,0.4)] border-2 border-cyan-300">
               <i className="fas fa-crown mr-2"></i> v3.6 PLATINUM
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] w-full max-w-md p-12 border border-slate-100">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-3xl text-blue-600 mb-6 shadow-inner">
              <i className="fas fa-university text-4xl"></i>
            </div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">EcoBank</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Gestion des Rejets OV / RC</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-3 animate-pulse">
                <i className="fas fa-exclamation-circle text-lg"></i>
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email pro</label>
              <input 
                type="email" 
                value={loginData.email}
                onChange={e => setLoginData({...loginData, email: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900" 
                placeholder="nom@ecobank.com"
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Mot de passe</label>
              <input 
                type="password" 
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 focus:bg-white outline-none transition-all font-bold text-slate-900" 
                placeholder="••••••••"
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rôle</label>
              <select 
                value={loginData.role}
                onChange={e => setLoginData({...loginData, role: e.target.value as any})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-500 outline-none transition-all font-black text-slate-700 appearance-none cursor-pointer"
              >
                <option value="agent">Agent OPS</option>
                <option value="superviseur">Superviseur</option>
                <option value="gestionnaire">Gestionnaire</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-500/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.15em] mt-4">
              <i className="fas fa-shield-alt"></i> Connexion
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <button 
              onClick={() => { setIsPublicPwdChange(true); setShowPwdModal(true); }}
              className="text-slate-400 text-[10px] font-black hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Réinitialiser mon accès
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen overflow-y-auto border-r border-white/5">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <i className="fas fa-university text-xl"></i>
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight">EcoBank SGR</h1>
            <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">PLATINUM v3.6</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 mt-4">
          <NavItem active={currentPage === 'dashboard'} icon="fa-tachometer-alt" label="Tableau de bord" onClick={() => setCurrentPage('dashboard')} />
          <NavItem active={currentPage === 'saisie'} icon="fa-plus-circle" label="Saisir un rejet" onClick={() => setCurrentPage('saisie')} />
          <NavItem active={currentPage === 'rejets'} icon="fa-list-ul" label="Liste des rejets" onClick={() => setCurrentPage('rejets')} />
          {(currentUser?.role === 'superviseur' || currentUser?.role === 'gestionnaire') && (
            <NavItem active={currentPage === 'validation'} icon="fa-check-double" label="Validation" onClick={() => setCurrentPage('validation')} />
          )}
          <NavItem active={currentPage === 'reports'} icon="fa-chart-pie" label="Rapports PDF" onClick={() => setCurrentPage('reports')} />
          {currentUser?.role === 'superviseur' && (
            <NavItem active={currentPage === 'admin'} icon="fa-cogs" label="Administration" onClick={() => setCurrentPage('admin')} />
          )}
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="bg-white/5 p-5 rounded-2xl backdrop-blur-sm border border-white/5">
            <p className="text-sm font-black truncate text-white">{currentUser?.fullname}</p>
            <p className="text-[10px] text-cyan-400 uppercase font-black mb-4 tracking-widest">{currentUser?.role}</p>
            <button onClick={handleLogout} className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border border-red-500/20">
              Quitter la session
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen bg-slate-50/50">
        <header className="bg-white/80 backdrop-blur-md border-b px-10 py-5 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 capitalize tracking-tight">{currentPage}</h2>
          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </div>
          </div>
        </header>
        <div className="p-10">
          {currentPage === 'dashboard' && <Dashboard user={currentUser!} />}
          {currentPage === 'saisie' && <SaisiePage user={currentUser!} onComplete={() => setCurrentPage('rejets')} />}
          {currentPage === 'rejets' && <RejetsPage user={currentUser!} />}
          {currentPage === 'validation' && <ValidationPage user={currentUser!} />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'admin' && <AdminPage user={currentUser!} />}
        </div>
      </main>

      {showPwdModal && (
        <ChangePasswordModal 
          user={isPublicPwdChange ? null : currentUser} 
          onClose={() => { setShowPwdModal(false); setIsPublicPwdChange(false); }} 
        />
      )}
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
      active ? 'bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <i className={`fas ${icon} text-lg w-6`}></i>
    <span className="text-sm font-black tracking-tight">{label}</span>
  </button>
);

export default App;
