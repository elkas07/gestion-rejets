
import React from 'react';
import { Rejet } from '../../types';

interface Props {
  rejet: Rejet;
  onClose: () => void;
}

export const ViewRejetModal: React.FC<Props> = ({ rejet, onClose }) => {
  const statusStyles: Record<string, string> = {
    enregistre: 'bg-blue-100 text-blue-700 border-blue-200',
    attente_validation: 'bg-amber-100 text-amber-700 border-amber-200',
    valide: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    transmis: 'bg-purple-100 text-purple-700 border-purple-200',
    recu: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  const statusLabels: Record<string, string> = {
    enregistre: 'Enregistré',
    attente_validation: 'En attente de validation',
    valide: 'Validé par Superviseur',
    transmis: 'Transmis au Gestionnaire',
    recu: 'Réceptionné / Finalisé'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-50 border-b flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <i className="fas fa-file-invoice text-lg"></i>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800 leading-none">{rejet.reference}</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Détails du dossier</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${statusStyles[rejet.statut]}`}>
              {statusLabels[rejet.statut]}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-all">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Section: Client & Montant */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Information Client</p>
              <p className="text-base font-bold text-slate-800">{rejet.client_nom}</p>
              <p className="text-xs text-blue-600 font-mono font-bold bg-blue-50 px-2 py-0.5 rounded inline-block">Compte: {rejet.client_compte}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Montant de l'opération</p>
              <p className="text-2xl font-black text-slate-900">{rejet.montant.toLocaleString()} <span className="text-sm font-bold text-slate-400">XAF</span></p>
            </div>
          </div>

          {/* Section: Détails Opération */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Type de pièce</p>
              <p className="text-sm font-bold text-slate-700">{rejet.type}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Département</p>
              <p className="text-sm font-bold text-slate-700">{rejet.departement}</p>
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Chargé de dossier</p>
              <p className="text-sm font-bold text-slate-700">{rejet.charge}</p>
            </div>
          </div>

          {/* Section: Motif & Commentaire */}
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Motif du rejet</p>
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm font-semibold flex items-start gap-3">
                <i className="fas fa-exclamation-triangle mt-0.5"></i>
                <span>{rejet.motif}</span>
              </div>
            </div>
            {rejet.commentaire && (
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Commentaires additionnels</p>
                <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-dashed">
                  "{rejet.commentaire}"
                </p>
              </div>
            )}
          </div>

          {/* Section: Historique / Timeline */}
          <div className="pt-4 border-t">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-4">Parcours du dossier (Workflow)</p>
            <div className="relative space-y-4 before:absolute before:inset-0 before:ml-4 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-500 before:via-slate-200 before:to-transparent">
              {rejet.historique.map((step, idx) => (
                <div key={idx} className="relative flex items-center gap-6">
                  <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ring-4 ring-white shadow-sm z-10 ${idx === rejet.historique.length - 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <i className={`fas ${idx === 0 ? 'fa-plus' : 'fa-check'} text-[10px]`}></i>
                  </div>
                  <div className="ml-10">
                    <p className="text-xs font-bold text-slate-700 capitalize">
                      {step.action.replace('_', ' ')}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] text-slate-400 font-medium">Par <span className="font-bold">{step.user}</span> ({step.role})</span>
                      <span className="text-[10px] text-slate-300">•</span>
                      <span className="text-[10px] text-slate-400">{new Date(step.date).toLocaleString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-sm font-bold transition-all"
          >
            Fermer la vue
          </button>
        </div>
      </div>
    </div>
  );
};
