import React, { useState, useEffect } from 'react';
import { User, Rejet } from '../types';
import { supabaseService } from '../services/supabase';

interface Props {
  user: User;
}

const ValidationPage: React.FC<Props> = ({ user }) => {
  const [rejets, setRejets] = useState<Rejet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await supabaseService.getRejets();
    if (user.role === 'superviseur') {
      setRejets(data.filter(r => r.statut === 'attente_validation' || r.statut === 'valide'));
    } else if (user.role === 'gestionnaire') {
      setRejets(data.filter(r => r.statut === 'transmis'));
    }
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user]);

  const handleAction = async (rejet: Rejet, nextStatut: Rejet['statut'], label: string) => {
    if (!confirm(`Confirmer ${label} pour ${rejet.reference} ?`)) return;
    const updated = {
      ...rejet,
      statut: nextStatut,
      historique: [...rejet.historique, { action: nextStatut, user: user.username, date: new Date().toISOString(), role: user.role }]
    };
    await supabaseService.saveRejet(updated);
    await supabaseService.addLog({ level: 'info', user: user.username, action: label, details: `Reference: ${rejet.reference}` });
    setRejets(prev => prev.filter(r => r.id !== rejet.id));
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl"><i className="fas fa-check-double"></i></div>
            <h3 className="text-xl font-black text-slate-800 tracking-tight">Dossiers en attente de traitement</h3>
        </div>
        <span className="bg-blue-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/20">{rejets.length} ACTIONS REQUISES</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead className="bg-white border-b">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Opération</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client / Montant</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Agent / Motif</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center"><i className="fas fa-spinner fa-spin text-blue-600 text-3xl"></i></td></tr>
              ) : rejets.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Aucun dossier à traiter pour le moment.</td></tr>
              ) : rejets.map(r => (
                <tr key={r.id} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="font-black text-slate-800 text-base">{r.reference}</div>
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">{r.type} • {r.date_saisie}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-bold text-slate-700 text-sm">{r.client_nom}</div>
                    <div className="font-black text-blue-600 text-base">{r.montant.toLocaleString()} <span className="text-[10px] text-slate-400">XAF</span></div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs font-bold text-slate-500 mb-1">Agent: <span className="text-slate-800">{r.agent_id}</span></div>
                    <div className="text-[11px] text-slate-400 italic font-medium">"{r.motif}"</div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                        {user.role === 'superviseur' && r.statut === 'attente_validation' && (
                            <button onClick={() => handleAction(r, 'valide', 'Validation')} className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-green-500/20 transition-all">Valider</button>
                        )}
                        {user.role === 'superviseur' && r.statut === 'valide' && (
                            <button onClick={() => handleAction(r, 'transmis', 'Transmission')} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all">Transmettre</button>
                        )}
                        {user.role === 'gestionnaire' && (
                            <button onClick={() => handleAction(r, 'recu', 'Réception')} className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all">Réceptionner</button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValidationPage;