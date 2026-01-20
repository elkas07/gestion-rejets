import React, { useState, useEffect } from 'react';
import { User, Rejet } from '../types';
import { supabaseService } from '../services/supabase';
import { ViewRejetModal } from '../components/Modals/ViewRejetModal';

const RejetsPage: React.FC<{ user: User }> = ({ user }) => {
  const [rejets, setRejets] = useState<Rejet[]>([]);
  const [filter, setFilter] = useState('');
  const [selectedRejet, setSelectedRejet] = useState<Rejet | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const data = await supabaseService.getRejets();
    setRejets(user.role === 'agent' ? data.filter(r => r.agent_id === user.username) : data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, [user]);

  const handleExportCSV = () => {
    const headers = ["Date", "Type", "Ref", "Client", "Compte", "Montant", "Statut"];
    const rows = rejets.map(r => [r.date_saisie, r.type, r.reference, `"${r.client_nom}"`, `'${r.client_compte}`, r.montant, r.statut].join(';'));
    const csv = "\ufeff" + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Export_Rejets_${new Date().getTime()}.csv`;
    link.click();
  };

  const filtered = rejets.filter(r => 
    r.reference?.toLowerCase().includes(filter.toLowerCase()) ||
    r.client_nom?.toLowerCase().includes(filter.toLowerCase()) ||
    r.type?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border">
        <input type="text" placeholder="Rechercher par référence, client ou type (OV, RC, PC)..." className="w-full md:w-96 pl-4 pr-4 py-2 bg-slate-50 border rounded-lg outline-none" value={filter} onChange={e => setFilter(e.target.value)} />
        <button onClick={handleExportCSV} className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><i className="fas fa-file-csv"></i> Exporter CSV</button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b font-black text-[10px] text-slate-500 uppercase">
            <tr><th className="px-6 py-4">Type</th><th className="px-6 py-4">Référence</th><th className="px-6 py-4">Client</th><th className="px-6 py-4">Montant</th><th className="px-6 py-4">Statut</th><th className="px-6 py-4 text-right">Action</th></tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map(r => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="px-6 py-4"><TypeBadge type={r.type} /></td>
                <td className="px-6 py-4 font-bold text-slate-800">{r.reference}</td>
                <td className="px-6 py-4 text-sm font-bold text-slate-700">{r.client_nom}</td>
                <td className="px-6 py-4 font-black text-blue-600">{r.montant?.toLocaleString()} XAF</td>
                <td className="px-6 py-4 text-[10px] uppercase font-bold">{r.statut}</td>
                <td className="px-6 py-4 text-right"><button onClick={() => setSelectedRejet(r)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg"><i className="fas fa-eye"></i></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedRejet && <ViewRejetModal rejet={selectedRejet} onClose={() => setSelectedRejet(null)} />}
    </div>
  );
};

const TypeBadge = ({ type }: { type: string }) => {
  const colors: any = { OV: 'bg-blue-600', RC: 'bg-purple-600', PC: 'bg-orange-600' };
  return <span className={`px-2 py-1 rounded text-[10px] font-black text-white ${colors[type] || 'bg-slate-600'}`}>{type || 'OV'}</span>;
};

export default RejetsPage;
