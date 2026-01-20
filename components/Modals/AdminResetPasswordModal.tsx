
import React, { useState } from 'react';
import { User } from '../../types';
import { PasswordStrengthIndicator } from '../PasswordStrengthIndicator';
import { supabaseService } from '../../services/supabase';

interface Props {
  targetUser: User;
  adminUser: User;
  onClose: () => void;
}

export const AdminResetPasswordModal: React.FC<Props> = ({ targetUser, adminUser, onClose }) => {
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [forceChange, setForceChange] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (newPwd.length < 8) return "Le mot de passe doit faire au moins 8 caractères.";
    if (!/[A-Z]/.test(newPwd)) return "Le mot de passe doit contenir une majuscule.";
    if (!/[a-z]/.test(newPwd)) return "Le mot de passe doit contenir une minuscule.";
    if (!/[0-9]/.test(newPwd)) return "Le mot de passe doit contenir un chiffre.";
    if (newPwd !== confirmPwd) return "Les mots de passe ne correspondent pas.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      await supabaseService.updateUser(targetUser.id, { 
        force_password_change: forceChange 
      });
      await supabaseService.addLog({
        level: 'security',
        user: adminUser.username,
        action: 'Réinitialisation admin',
        details: `Réinitialisation du mot de passe pour ${targetUser.username} (${targetUser.email})`
      });
      alert(`Mot de passe réinitialisé pour ${targetUser.fullname}`);
      onClose();
    } catch (e) {
      setError("Erreur technique lors de la réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-bold text-slate-800">Réinitialiser mot de passe</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg flex items-start gap-3">
            <i className="fas fa-user-shield text-blue-600 mt-1"></i>
            <div>
              <p className="text-xs text-blue-800 font-bold uppercase">Utilisateur cible</p>
              <p className="text-sm font-semibold text-slate-700">{targetUser.fullname}</p>
              <p className="text-xs text-slate-500">{targetUser.email}</p>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Nouveau mot de passe</label>
            <input 
              type="password" 
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={newPwd}
              onChange={e => setNewPwd(e.target.value)}
              required
            />
            <PasswordStrengthIndicator password={newPwd} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Confirmer le mot de passe</label>
            <input 
              type="password" 
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none" 
              value={confirmPwd}
              onChange={e => setConfirmPwd(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-2 py-2">
            <input 
              type="checkbox" 
              id="force-change" 
              checked={forceChange}
              onChange={e => setForceChange(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="force-change" className="text-sm text-slate-600 cursor-pointer">
              Forcer le changement au prochain login
            </label>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg font-semibold hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Réinitialiser
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
