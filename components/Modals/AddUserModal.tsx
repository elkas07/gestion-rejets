
import React, { useState } from 'react';
import { UserRole } from '../../types';
import { supabaseService } from '../../services/supabase';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export const AddUserModal: React.FC<Props> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    role: 'agent' as UserRole,
    departement: 'operations'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email.endsWith('@ecobank.com')) {
      setError("Email @ecobank.com requis.");
      return;
    }

    setLoading(true);
    try {
      await supabaseService.addUser({
        ...formData,
        permissions: formData.role === 'superviseur' ? ['export', 'view_all'] : [],
        force_password_change: true
      });
      alert(`Utilisateur créé !`);
      onSuccess();
    } catch (err) {
      setError("Erreur technique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h3 className="text-lg font-bold mb-4">Nouvel Utilisateur EcoBank</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Nom Complet" className="w-full border p-2 rounded-lg" onChange={e => setFormData({...formData, fullname: e.target.value})} required />
          <input type="email" placeholder="nom@ecobank.com" className="w-full border p-2 rounded-lg" onChange={e => setFormData({...formData, email: e.target.value})} required />
          <input type="text" placeholder="Username" className="w-full border p-2 rounded-lg" onChange={e => setFormData({...formData, username: e.target.value})} required />
          <select className="w-full border p-2 rounded-lg" onChange={e => setFormData({...formData, role: e.target.value as any})}>
            <option value="agent">Agent OPS</option>
            <option value="superviseur">Superviseur</option>
            <option value="gestionnaire">Gestionnaire</option>
          </select>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="flex-1 border p-2 rounded-lg">Annuler</button>
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white p-2 rounded-lg">{loading ? '...' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};
