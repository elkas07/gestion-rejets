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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0f1d] p-6 relative overflow-hidden">
        {/* Cercles de lumière en arrière-plan */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]"></div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl text-white mb-6 shadow-[0_20px_50px_rgba(37,99,235,0.3)] transform -rotate-3 hover:rotate-0 transition-all duration-500">
              <i className="fas fa-university text-3xl"></i>
            </div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-1">EcoBank <span className="text-blue-500">SGR</span></h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Système de traçabilité PLATINUM</p>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-10 shadow-2xl">
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold rounded-2xl flex items-center gap-3 animate-pulse">
                  <i className="fas fa-exclamation-triangle"></i>
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Identifiant Pro</label>
                <div className="relative">
                  <i className="fas fa-envelope absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                  <input 
                    type="email" 
                    value={loginData.email}
                    onChange={e => setLoginData({...loginData, email: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 focus:border-blue-500 outline-none transition-all font-bold text-white placeholder:text-slate-700" 
                    placeholder="nom@ecobank.com"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Clé d'accès</label>
                <div className="relative">
                  <i className="fas fa-lock absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm"></i>
                  <input 
                    type="password" 
                    value={loginData.password}
                    onChange={e => setLoginData({...loginData, password: e.target.value})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 focus:border-blue-500 outline-none transition-all font-bold text-white placeholder:text-slate-700" 
                    placeholder="••••••••"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Rôle Session</label>
                <div className="relative">
                  <i className="fas fa-user-shield absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none"></i>
                  <select 
                    value={loginData.role}
                    onChange={e => setLoginData({...loginData, role: e.target.value as any})}
                    className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-6 py-4 focus:border-blue-500 outline-none transition-all font-black text-white appearance-none cursor-pointer"
                  >
                    <option value="agent" className="bg-slate-900">AGENT OPS</option>
                    <option value="superviseur" className="bg-slate-900">SUPERVISEUR</option>
                    <option value="gestionnaire" className="bg-slate-900">GESTIONNAIRE</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] mt-4">
                <i className="fas fa-sign-in-alt"></i> Connexion Sécurisée
              </button>
            </form>
          </div>
          
          <div className="mt-8 text-center">
             <div className="inline-block px-4 py-1.5 bg-white/5 rounded-full border border-white/5">
                <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">Build v3.6.0-PLATINUM • Stable</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 text-slate-900">
      <aside className="w-full md:w-64 bg-slate-950 text-white flex-shrink-0 flex flex-col h-screen overflow-y-auto border-r border-white/5">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
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
          <div className="bg-white/5 p-5 rounded-3xl backdrop-blur-sm border border-white/5 shadow-inner">
            <p className="text-sm font-black truncate text-white">{currentUser?.fullname}</p>
            <p className="text-[10px] text-cyan-400 uppercase font-black mb-4 tracking-widest">{currentUser?.role}</p>
            <button onClick={handleLogout} className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest border border-white/10">
              Déconnexion
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
    className={`w-full flex items-center gap-4 px-5 py-4 rounded-[1.25rem] transition-all duration-300 ${
      active ? 'bg-blue-600 text-white shadow-[0_15px_30px_rgba(37,99,235,0.4)] scale-105' : 'text-slate-500 hover:text-white hover:bg-white/10'
    }`}
  >
    <i className={`fas ${icon} text-lg w-6`}></i>
    <span className="text-sm font-black tracking-tight">{label}</span>
  </button>
);

export default App;