
import React, { useState } from 'react';
import { User } from '../../types';
import { supabaseService } from '../../services/supabase';

interface Props {
  user: User | null;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<Props> = ({ user, onClose }) => {
  const [email, setEmail] = useState(user?.email || '');
  const [newPwd, setNewPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const users = await supabaseService.getUsers();
      const target = users.find(u => u.email === email);
      if (target) {
        await supabaseService.updateUser(target.id, { force_password_change: false });
        alert("Succès !");
        onClose();
      }
    } catch (e) { alert("Erreur."); } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
        <h3 className="font-bold mb-4 tracking-tight uppercase text-xs text-slate-400">Sécurité du compte</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded-lg" required />
          <input type="password" placeholder="Nouveau mot de passe" onChange={e => setNewPwd(e.target.value)} className="w-full border p-2 rounded-lg" required />
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border p-2 rounded-lg text-xs font-bold uppercase">Fermer</button>
            <button type="submit" className="flex-1 bg-blue-600 text-white p-2 rounded-lg text-xs font-bold uppercase">{loading ? '...' : 'Valider'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
