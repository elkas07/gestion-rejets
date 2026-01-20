import React, { useState, useEffect } from 'react';
import { User, Rejet } from '../types';
import { supabaseService } from '../services/supabase';
import { ViewRejetModal } from '../components/Modals/ViewRejetModal';

interface Props {
  user: User;
}

const RejetsPage: React.FC<Props> = ({ user }) => {
  const [rejets, setRejets] = useState<Rejet[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedRejet, setSelectedRejet] = useState<Rejet | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await supabaseService.getRejets();
    if (user.role === 'agent' && !user.permissions.includes('view_all')) {
        setRejets(data.filter(r => r.agent_id === user.username));
    } else {
        setRejets(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const filtered = rejets.filter(r => 
    r.reference?.toLowerCase().includes(filter.toLowerCase()) ||
    r.client_nom?.toLowerCase().includes(filter.toLowerCase()) ||
    r.type?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-2xl border border-slate-200">
        <div className="relative w-full md:w-96">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input 
            type="text" 
            placeholder="Référence, client, ou type (OV, RC)..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button onClick={loadData} className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-blue-600 bg-slate-50 border rounded-xl transition-colors">
            <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Référence / Date</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Client / Compte</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Montant</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Statut</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                    <tr><td colSpan={6} className="p-20 text-center"><i className="fas fa-spinner fa-spin text-blue-600 text-3xl"></i></td></tr>
                ) : filtered.length === 0 ? (
                    <tr><td colSpan={6} className="p-20 text-center text-slate-400 font-bold">Aucun dossier trouvé.</td></tr>
                ) : filtered.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <TypeBadge type={r.type} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{r.reference}</div>
                      <div className="text-[10px] text-slate-400 font-black">{r.date_saisie}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-700 truncate max-w-[200px]">{r.client_nom}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold tracking-tight">{r.client_compte}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-blue-600">{r.montant?.toLocaleString()}</span>
                      <span className="ml-1 text-[10px] text-slate-400 font-bold uppercase">Xaf</span>
                    </td>
                    <td className="px-6 py-4">
                        <StatusBadge status={r.statut} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => setSelectedRejet(r)} 
                        className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center border border-transparent hover:border-blue-100"
                      >
                        <i className="fas fa-eye text-sm"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>

      {selectedRejet && <ViewRejetModal rejet={selectedRejet} onClose={() => setSelectedRejet(null)} />}
    </div>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const colors: any = {
    OV: 'bg-blue-600 text-white',
    RC: 'bg-purple-600 text-white'
  };
  return (
    <span className={`px-2 py-1 rounded-lg text-[10px] font-black tracking-widest shadow-sm ${colors[type] || 'bg-slate-600 text-white'}`}>
      {type}
    </span>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    enregistre: 'bg-blue-50 text-blue-600 border-blue-100',
    attente_validation: 'bg-amber-50 text-amber-600 border-amber-100',
    valide: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    transmis: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    recu: 'bg-slate-100 text-slate-600 border-slate-200'
  };
  const labels: any = {
      enregistre: 'Saisie',
      attente_validation: 'Validation',
      valide: 'Validé',
      transmis: 'Transmis',
      recu: 'Terminé'
  }
  return (
    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase border tracking-widest ${styles[status] || styles.enregistre}`}>
      {labels[status] || status}
    </span>
  );
};

export default RejetsPage;