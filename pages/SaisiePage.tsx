import React, { useState } from 'react';
import { User } from '../types';
import { supabaseService } from '../services/supabase';

interface Props {
  user: User;
  onComplete: () => void;
}

const SaisiePage: React.FC<Props> = ({ user, onComplete }) => {
  const [formData, setFormData] = useState({
    type: 'OV',
    departement: user.departement || 'Operations', 
    charge: 'MHT NOUR',
    client_nom: '',
    client_compte: '',
    montant: 0,
    date_operation: new Date().toISOString().split('T')[0],
    motif: 'Provision insuffisante',
    commentaire: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const reference = 'REJ-' + formData.type + '-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const newRejet = {
      ...formData,
      reference,
      agent_id: user.username,
      date_saisie: new Date().toISOString().split('T')[0],
      statut: 'attente_validation',
      historique: [{ action: 'enregistre', user: user.username, date: new Date().toISOString(), role: user.role }]
    };

    try {
      await supabaseService.saveRejet(newRejet);
      alert('Rejet enregistré !');
      onComplete();
    } catch (err) { alert('Erreur technique.'); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-2xl mx-auto text-slate-900">
      <h3 className="text-xl font-bold mb-6">Nouveau rejet (OV / RC)</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Type d''opération</label>
          <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl px-4 py-3 font-bold">
            <option value="OV">OV - Ordre de Virement</option>
            <option value="RC">RC - Remise Chèque</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Nom Client" className="border-2 border-slate-100 p-3 rounded-xl font-bold" onChange={e => setFormData({...formData, client_nom: e.target.value.toUpperCase()})} required />
          <input type="text" placeholder="Numéro Compte" className="border-2 border-slate-100 p-3 rounded-xl font-mono font-bold" onChange={e => setFormData({...formData, client_compte: e.target.value})} required />
        </div>
        <input type="number" placeholder="Montant XAF" className="w-full border-2 border-slate-100 p-4 rounded-xl font-black text-blue-600 text-xl" onChange={e => setFormData({...formData, montant: parseFloat(e.target.value)})} required />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl shadow-xl transition-all uppercase tracking-widest mt-4">Enregistrer le dossier</button>
      </form>
    </div>
  );
};
export default SaisiePage;
