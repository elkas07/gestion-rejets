import React, { useState, useEffect } from 'react';
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
  useEffect(() => {
    console.log("%c 💎 ECOBANK DIAMOND v3.6.3 CHARGÉ 💎 ", "background: #10b981; color: white; font-size: 22px; font-weight: bold; border-radius: 8px; padding: 15px;");
  }, []);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showPwdModal, setShowPwdModal] = useState(false);
  
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
          details: `Session DIAMOND v3.6.3 démarrée`
        });
        
        if (user.force_password_change) {
          setShowPwdModal(true);
        }
      } else {
        setError("Identifiants incorrects (v3.6.3)");
      }
    } catch (err) {
      setError("Erreur Supabase v3.6.3");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#010307] p-6 relative overflow-hidden pt-12">
        <div className="absolute top-[-20%] left-[-20%] w-[70%] h-[70%] bg-emerald-600/5 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[70%] h-[70%] bg-blue-900/5 rounded-full blur-[150px]"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-10 text-center">
            <div className="inline-block px-6 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] mb-10">
              <i className="fas fa-gem mr-2"></i> DIAMOND BUILD 3.6.3
            </div>
            
            <div className="relative inline-flex items-center justify-center w-28 h-28 bg-gradient-to-tr from-emerald-600 to-blue-600 rounded-[2.8rem] text-white mb-8 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-700">
              <i className="fas fa-university text-5xl"></i>
            </div>
            <h1 className="text-5xl font-black text-white uppercase tracking-tighter mb-2 italic">EcoBank</h1>
            <p className="text-slate-600 text-[11px] font-black uppercase tracking-[0.8em]">Management Diamond</p>
          </div>

          <div className="bg-slate-900/40 backdrop-blur-3xl rounded-[4.5rem] border border-white/5 p-16 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)]">
            <form onSubmit={handleLogin} className="space-y-8">
              {error && (
                <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold rounded-3xl text-center">
                  {error}
                </div>
              )}
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Email EcoBank</label>
                <input 
                  type="email" 
                  value={loginData.email}
                  onChange={e => setLoginData({...loginData, email: e.target.value})}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-3xl px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold text-white shadow-inner" 
                  placeholder="nom@ecobank.com"
                  required 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Password</label>
                <input 
                  type="password" 
                  value={loginData.password}
                  onChange={e => setLoginData({...loginData, password: e.target.value})}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-3xl px-8 py-5 focus:border-emerald-500 outline-none transition-all font-bold text-white shadow-inner" 
                  placeholder="••••••••"
                  required 
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Rôle</label>
                <select 
                  value={loginData.role}
                  onChange={e => setLoginData({...loginData, role: e.target.value as any})}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-3xl px-8 py-5 focus:border-emerald-500 outline-none transition-all font-black text-white appearance-none cursor-pointer"
                >
                  <option value="agent">AGENT OPS</option>
                  <option value="superviseur">SUPERVISEUR</option>
                  <option value="gestionnaire">GESTIONNAIRE</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-500 hover:to-blue-500 text-white font-black py-6 rounded-3xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 text-[11px] uppercase tracking-[0.4em] mt-8">
                Connecter Diamond <i className="fas fa-bolt ml-2"></i>
              </button>
            </form>
          </div>
          
          <div className="mt-20 text-center opacity-20">
            <p className="text-white text-[8px] font-black uppercase tracking-[1.5em]">ECOBANK SGR v3.6.3 DIAMOND</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-[#010307] text-white flex-shrink-0 flex flex-col h-screen border-r border-white/5">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <i className="fas fa-university text-xl"></i>
          </div>
          <div>
            <h1 className="font-black text-sm tracking-tight leading-none">EcoBank SGR</h1>
            <p className="text-[9px] text-emerald-400 font-black uppercase mt-1">DIAMOND 3.6.3</p>
          </div>
        </div>

        <nav className="p-5 space-y-3 mt-4">
          <NavItem active={currentPage === 'dashboard'} icon="fa-tachometer-alt" label="Tableau de bord" onClick={() => setCurrentPage('dashboard')} />
          <NavItem active={currentPage === 'saisie'} icon="fa-plus-circle" label="Saisie Rejet" onClick={() => setCurrentPage('saisie')} />
          <NavItem active={currentPage === 'rejets'} icon="fa-list" label="Liste Globale" onClick={() => setCurrentPage('rejets')} />
          {currentUser?.role !== 'agent' && (
            <NavItem active={currentPage === 'validation'} icon="fa-check-double" label="Validation" onClick={() => setCurrentPage('validation')} />
          )}
          <NavItem active={currentPage === 'reports'} icon="fa-file-pdf" label="Reporting" onClick={() => setCurrentPage('reports')} />
          {currentUser?.role === 'superviseur' && (
            <NavItem active={currentPage === 'admin'} icon="fa-user-shield" label="Admin" onClick={() => setCurrentPage('admin')} />
          )}
        </nav>

        <div className="mt-auto p-6">
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
            <p className="text-xs font-black truncate text-white uppercase tracking-tighter">{currentUser?.fullname}</p>
            <p className="text-[9px] text-emerald-500 font-black uppercase mb-4">{currentUser?.role}</p>
            <button onClick={() => setIsLoggedIn(false)} className="w-full bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white py-3 rounded-2xl text-[9px] font-black transition-all uppercase tracking-widest border border-red-500/20">
              Quitter
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen bg-slate-100">
        <header className="bg-white/80 backdrop-blur-md border-b px-10 py-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{currentPage}</h2>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </header>
        <div className="p-12">
          {currentPage === 'dashboard' && <Dashboard user={currentUser!} />}
          {currentPage === 'saisie' && <SaisiePage user={currentUser!} onComplete={() => setCurrentPage('rejets')} />}
          {currentPage === 'rejets' && <RejetsPage user={currentUser!} />}
          {currentPage === 'validation' && <ValidationPage user={currentUser!} />}
          {currentPage === 'reports' && <ReportsPage />}
          {currentPage === 'admin' && <AdminPage user={currentUser!} />}
        </div>
      </main>

      {showPwdModal && (
        <ChangePasswordModal user={currentUser} onClose={() => setShowPwdModal(false)} />
      )}
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-500 ${
      active ? 'bg-emerald-600 text-white shadow-2xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/10'
    }`}
  >
    <i className={`fas ${icon} text-lg w-6`}></i>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default App;