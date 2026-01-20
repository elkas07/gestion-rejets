
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-tr from-slate-950 via-blue-900 to-slate-900 p-6">
        {/* Badge Flottant pour confirmer le déploiement */}
        <div className="mb-8 animate-bounce">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-[0_10px_40px_rgba(6,182,212,0.5)] border-2 border-white/20">
               <i className="fas fa-gem mr-2"></i> VERSION PLATINUM 3.6
            </div>
        </div>

        <div className="bg-white rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.5)] w-full max-w-md p-12 border border-white/20 relative overflow-hidden group">
          {/* Décoration de fond */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
          
          <div className="relative z-10 text-center mb-10">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2rem] text-white mb-6 shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <i className="fas fa-university text-4xl"></i>
            </div>
            <h1 className="text-5xl font-black text-slate-950 uppercase tracking-tighter leading-none mb-3">EcoBank</h1>
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Gestion des Rejets OV/RC</p>
          </div>

          <form onSubmit={handleLogin} className="relative z-10 space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-2xl flex items-center gap-3 animate-shake">
                <i className="fas fa-exclamation-circle text-lg"></i>
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Email Professionnel</label>
              <input 
                type="email" 
                value={loginData.email}
                onChange={e => setLoginData({...loginData, email: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                placeholder="nom@ecobank.com"
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Mot de passe</label>
              <input 
                type="password" 
                value={loginData.password}
                onChange={e => setLoginData({...loginData, password: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 focus:bg-white outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300" 
                placeholder="••••••••"
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Rôle d'accès</label>
              <div className="relative">
                <select 
                  value={loginData.role}
                  onChange={e => setLoginData({...loginData, role: e.target.value as any})}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-blue-600 outline-none transition-all font-black text-slate-800 appearance-none cursor-pointer"
                >
                  <option value="agent">AGENT OPS</option>
                  <option value="superviseur">SUPERVISEUR</option>
                  <option value="gestionnaire">GESTIONNAIRE</option>
                </select>
                <i className="fas fa-chevron-down absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none"></i>
              </div>
            </div>

            <button type="submit" className="w-full bg-slate-950 hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-2xl shadow-slate-950/20 transition-all hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-3 text-sm uppercase tracking-[0.2em] mt-4">
              <i className="fas fa-lock"></i> Accéder au SGR
            </button>
          </form>

          <div className="relative z-10 mt-12 pt-8 border-t border-slate-100 text-center">
            <button 
              onClick={() => { setIsPublicPwdChange(true); setShowPwdModal(true); }}
              className="text-slate-400 text-[10px] font-black hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Besoin d'aide pour votre accès ?
            </button>
          </div>
        </div>
        
        <p className="mt-8 text-white/30 text-[9px] font-bold uppercase tracking-[0.5em]">EcoBank Internal Application Security</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
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
