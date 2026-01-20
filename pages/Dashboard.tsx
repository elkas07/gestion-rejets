import React, { useState, useEffect } from 'react';
import { User, Rejet } from '../types';
import { supabaseService } from '../services/supabase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

interface Props {
  user: User;
}

const Dashboard: React.FC<Props> = ({ user }) => {
  const [rejets, setRejets] = useState<Rejet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseService.getRejets().then(data => {
      setRejets(data);
      setLoading(false);
    });
  }, []);

  const stats = {
    today: rejets.filter(r => r.date_saisie === new Date().toISOString().split('T')[0]).length,
    month: rejets.filter(r => r.date_saisie?.startsWith(new Date().toISOString().substring(0, 7))).length,
    pending: rejets.filter(r => r.statut === 'attente_validation' || r.statut === 'valide').length,
    total: rejets.length
  };

  const typeData = [
    { name: 'OV', value: rejets.filter(r => r.type === 'OV').length, color: '#2563eb' },
    { name: 'RC', value: rejets.filter(r => r.type === 'RC').length, color: '#9333ea' }
  ].filter(d => d.value > 0);

  const statusData = [
    { name: 'Enregistré', value: rejets.filter(r => r.statut === 'enregistre').length, color: '#3b82f6' },
    { name: 'En validation', value: rejets.filter(r => r.statut === 'attente_validation').length, color: '#f59e0b' },
    { name: 'Transmis', value: rejets.filter(r => r.statut === 'transmis').length, color: '#8b5cf6' },
    { name: 'Réceptionné', value: rejets.filter(r => r.statut === 'recu').length, color: '#10b981' }
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon="fa-calendar-day" label="Aujourd'hui" value={stats.today} color="blue" />
        <StatCard icon="fa-calendar-alt" label="Mois en cours" value={stats.month} color="indigo" />
        <StatCard icon="fa-clock" label="En attente" value={stats.pending} color="amber" />
        <StatCard icon="fa-database" label="Total Global" value={stats.total} color="slate" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center"><i className="fas fa-chart-bar"></i></div>
                Répartition OV / RC
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={50}>
                    {typeData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center"><i className="fas fa-chart-pie"></i></div>
                État de traitement
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={8} dataKey="value">
                    {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => {
    const colors: any = {
        blue: 'text-blue-600 bg-blue-50',
        indigo: 'text-indigo-600 bg-indigo-50',
        amber: 'text-amber-600 bg-amber-50',
        slate: 'text-slate-600 bg-slate-50'
    };
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 group hover:border-blue-300 transition-all">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colors[color]}`}>
                <i className={`fas ${icon} text-lg`}></i>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{value}</p>
        </div>
    );
};

export default Dashboard;