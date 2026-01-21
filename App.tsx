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
    console.log("%c 👑 SGR GOLD v4.0.0 CHARGÉ 👑 ", "background: #facc15; color: black; font-size: 26px; font-weight: bold; padding: 20px; border: 4px solid black;");
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
          details: `Session v4.0.0 GOLD démarrée`
        });
        
        if (user.force_password_change) {
          setShowPwdModal(true);
        }
      } else {
        setError("Accès refusé (Build v4.0)");
      }
    } catch (err) {
      setError("Erreur de connexion Supabase");
    }
  };

  const clearCache = () => {
    window.location.reload();
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#010307] p-6 pt-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400"></div>
        
        <div className="w-full max-w-md relative z-10">
          <div className="mb-12 text-center">
            <div className="inline-block px-5 py-1.5 bg-yellow-400 text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-10 shadow-[0_0_30px_rgba(250,204,21,0.3)]">
              GOLD EDITION v4.0.0
            </div>
            
            <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-[3rem] mx-auto flex items-center justify-center text-black text-5xl shadow-2xl mb-8 transform rotate-6">
              <i className="fas fa-university"></i>
            </div>
            <h1 className="text-6xl font-black text-white uppercase italic tracking-tighter leading-none">EcoBank</h1>
            <p className="text-yellow-500 text-[11px] font-black uppercase tracking-[0.6em] mt-3">Rejection Control Center</p>
          </div>

          <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[4rem] border border-yellow-500/20 p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,1)]">
            <form onSubmit={handleLogin} className="space-y-8">
              {error && <div className="p-5 bg-red-600/20 border border-red-600/40 text-red-400 text-[11px] font-bold rounded-3xl text-center uppercase tracking-widest">{error}</div>}
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-5">Compte Pro</label>
                <input type="email" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} className="w-full bg-black border border-white/10 rounded-3xl px-8 py-5 focus:border-yellow-400 outline-none transition-all font-bold text-white shadow-inner text-lg" placeholder="Email EcoBank" required />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-5">Sécurité</label>
                <input type="password" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="w-full bg-black border border-white/10 rounded-3xl px-8 py-5 focus:border-yellow-400 outline-none transition-all font-bold text-white shadow-inner text-lg" placeholder="••••••••" required />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-5">Niveau d'accès</label>
                <select value={loginData.role} onChange={e => setLoginData({...loginData, role: e.target.value as any})} className="w-full bg-black border border-white/10 rounded-3xl px-8 py-5 focus:border-yellow-400 outline-none text-white font-black appearance-none cursor-pointer text-sm">
                  <option value="agent">AGENT DES OPERATIONS</option>
                  <option value="superviseur">SUPERVISEUR</option>
                  <option value="gestionnaire">GESTIONNAIRE</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-black py-6 rounded-3xl shadow-2xl transition-all transform hover:scale-[1.02] active:scale-95 text-[12px] uppercase tracking-[0.5em] mt-10">
                Lancer Session Gold <i className="fas fa-crown ml-2"></i>
              </button>
            </form>
          </div>
          
          <div className="mt-16 flex flex-col items-center gap-4">
             <button onClick={clearCache} className="text-[9px] text-slate-600 font-black uppercase tracking-[0.3em] hover:text-yellow-500 transition-colors">
                <i className="fas fa-sync-alt mr-2"></i> Forcer rafraîchissement
             </button>
             <p className="text-white/10 text-[8px] font-black uppercase tracking-[1.5em]">ECOBANK PLATINUM v4.0.0 GOLD</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100">
      <aside className="w-full md:w-64 bg-[#010307] text-white flex-shrink-0 flex flex-col h-screen border-r border-yellow-500/10">
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <div className="w-12 h-12 bg-yellow-400 text-black rounded-2xl flex items-center justify-center shadow-lg transform -rotate-3"><i className="fas fa-university text-2xl"></i></div>
          <div>
            <h1 className="font-black text-sm tracking-tighter">EcoBank SGR</h1>
            <p className="text-[9px] text-yellow-500 font-black uppercase tracking-widest mt-1">GOLD v4.0.0</p>
          </div>
        </div>
        <nav className="p-5 space-y-3 mt-4 flex-1">
          <NavItem active={currentPage === 'dashboard'} icon="fa-tachometer-alt" label="Dashboard" onClick={() => setCurrentPage('dashboard')} />
          <NavItem active={currentPage === 'saisie'} icon="fa-plus-circle" label="Saisie Dossier" onClick={() => setCurrentPage('saisie')} />
          <NavItem active={currentPage === 'rejets'} icon="fa-list" label="Base Globale" onClick={() => setCurrentPage('rejets')} />
          {currentUser?.role !== 'agent' && <NavItem active={currentPage === 'validation'} icon="fa-check-double" label="Workflows" onClick={() => setCurrentPage('validation')} />}
          <NavItem active={currentPage === 'reports'} icon="fa-file-pdf" label="Reporting" onClick={() => setCurrentPage('reports')} />
          {currentUser?.role === 'superviseur' && <NavItem active={currentPage === 'admin'} icon="fa-user-lock" label="Admin Center" onClick={() => setCurrentPage('admin')} />}
        </nav>
        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/5">
            <p className="text-[11px] font-black truncate text-white uppercase tracking-tighter">{currentUser?.fullname}</p>
            <p className="text-[9px] text-yellow-500 font-black uppercase mb-4">{currentUser?.role}</p>
            <button onClick={() => setIsLoggedIn(false)} className="w-full bg-yellow-400 py-3 rounded-2xl text-[10px] font-black text-black uppercase tracking-widest transition-all hover:bg-yellow-300 shadow-lg">Déconnexion</button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto h-screen relative">
        <header className="bg-white/90 backdrop-blur-md border-b px-10 py-6 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">{currentPage}</h2>
          <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
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
      {showPwdModal && <ChangePasswordModal user={currentUser} onClose={() => setShowPwdModal(false)} />}
    </div>
  );
};

const NavItem = ({ active, icon, label, onClick }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-5 px-6 py-5 rounded-3xl transition-all duration-300 ${active ? 'bg-yellow-400 text-black shadow-2xl scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    <i className={`fas ${icon} text-lg w-6`}></i>
    <span className="text-[11px] font-black uppercase tracking-[0.2em]">{label}</span>
  </button>
);

export default App;