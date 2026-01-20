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
          details: `Connecté sur v3.6 Platinum - Synchro Totale`
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-6">
        <div className="mb-8 flex flex-col items-center animate-bounce">
            <div className="bg-cyan-500 text-slate-950 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.5)] border-2 border-cyan-300">
               <i className="fas fa-sync mr-2"></i> v3.6 PLATINUM - SYNCHRO OK
            </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 transform transition-all">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-50 rounded-3xl text-blue-600 mb-6 shadow-inner">
              <i className="fas fa-university text-4xl"></i>
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-2">EcoBank</h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Gestion des Rejets OV / RC</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 text-red-700 text-xs font-bold rounded-xl flex items-center gap-3">
                <i className="fas fa-exclamation-circle text-lg"></i>
                {error}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Email professionnel</label>
              <input 
                type="email" 
                value={loginData.email}
                onChange={e => setLoginData({...loginData, email: e.target.value})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all font-medium text-slate-900" 
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
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all font-medium text-slate-900" 
                placeholder="••••••••"
                required 
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Rôle assigné</label>
              <select 
                value={loginData.role}
                onChange={e => setLoginData({...loginData, role: e.target.value as any})}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 focus:border-blue-500 outline-none transition-all font-bold text-slate-700 appearance-none"
              >
                <option value="agent">Agent OPS</option>
                <option value="superviseur">Superviseur</option>
                <option value="gestionnaire">Gestionnaire</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-500/30 transition-all flex items-center justify-center gap-3 text-sm uppercase tracking-widest mt-4">
              <i className="fas fa-lock"></i> Se connecter
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <button 
              onClick={() => { setIsPublicPwdChange(true); setShowPwdModal(true); }}
              className="text-slate-400 text-xs font-bold hover:text-blue-600 transition-colors uppercase tracking-widest"
            >
              Modifier mon mot de passe
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen overflow-y-auto">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <i className="fas fa-university text-xl"></i>
          </div>
          <div>
            <h1 className="font-bold text-sm tracking-tight">EcoBank SGR</h1>
            <p className="text-[10px] text-cyan-400 uppercase tracking-widest font-black">v3.6 PLATINUM</p>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem active={currentPage === 'dashboard'} icon="fa-tachometer-alt" label="Tableau de bord" onClick={() => setCurrentPage('dashboard')} />
          <NavItem active={currentPage === 'saisie'} icon="fa-plus-circle" label="Saisir un rejet" onClick={() => setCurrentPage('saisie')} />
          <NavItem active={currentPage === 'rejets'} icon="fa-list-ul" label="Liste des rejets" onClick={() => setCurrentPage('rejets')} />
          {(currentUser?.role === 'superviseur' || currentUser?.role === 'gestionnaire') && (
            <NavItem active={currentPage === 'validation'} icon="fa-check-double" label="Validation" onClick={() => setCurrentPage('validation')} />
          )}
          <NavItem active={currentPage === 'reports'} icon="fa-chart-pie" label="Rapports" onClick={() => setCurrentPage('reports')} />
          {currentUser?.role === 'superviseur' && (
            <NavItem active={currentPage === 'admin'} icon="fa-cogs" label="Administration" onClick={() => setCurrentPage('admin')} />
          )}
        </nav>

        <div className="mt-auto p-4 border-t border-white/10">
          <div className="bg-white/5 p-4 rounded-xl">
            <p className="text-sm font-bold truncate">{currentUser?.fullname}</p>
            <p className="text-[10px] text-slate-400 uppercase font-black mb-3">{currentUser?.role}</p>
            <button onClick={handleLogout} className="w-full bg-white/10 hover:bg-red-500 text-slate-300 hover:text-white py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-widest">
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto h-screen">
        <header className="bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-800 capitalize">{currentPage}</h2>
          <div className="text-xs text-slate-400 font-mono">
            {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        <div className="p-8">
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
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    <i className={`fas ${icon} w-5`}></i>
    <span className="text-sm font-semibold">{label}</span>
  </button>
);

export default App;
