
import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { supabaseService } from '../services/supabase';
import { Rejet } from '../types';

const ReportsPage: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [rejets, setRejets] = useState<Rejet[]>([]);

  useEffect(() => {
    supabaseService.getRejets().then(setRejets);
  }, []);

  const generateProfessionalPDF = async () => {
    if (rejets.length === 0) {
        alert("Aucune donnée disponible pour générer le rapport.");
        return;
    }
    
    setIsGenerating(true);
    
    try {
      const doc = new jsPDF();
      const now = new Date();
      const dateStr = now.toLocaleDateString('fr-FR');
      const timeStr = now.toLocaleTimeString('fr-FR');

      // --- HEADER ---
      doc.setFillColor(0, 90, 156); // Bleu EcoBank
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('ECOBANK SGR', 15, 25);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('SYSTEME DE GESTION DES REJETS', 15, 32);
      doc.text(`Généré le: ${dateStr} à ${timeStr}`, 140, 25);

      // --- TITRE ---
      doc.setTextColor(40, 40, 40);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('RAPPORT DE SYNTHÈSE DES OPÉRATIONS', 15, 55);
      doc.setDrawColor(0, 90, 156);
      doc.line(15, 58, 100, 58);

      // --- RÉSUMÉ STATISTIQUE ---
      const totalAmount = rejets.reduce((sum, r) => sum + (Number(r.montant) || 0), 0);
      const validatedCount = rejets.filter(r => r.statut === 'valide' || r.statut === 'recu').length;

      doc.setFontSize(11);
      doc.text('Statistiques consolidées :', 15, 70);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`- Dossiers enregistrés : ${rejets.length}`, 20, 78);
      doc.text(`- Dossiers finalisés : ${validatedCount}`, 20, 84);
      doc.text(`- Montant total : ${totalAmount.toLocaleString()} XAF`, 20, 90);

      // --- TABLEAU DE DONNÉES ---
      doc.setFillColor(240, 240, 240);
      doc.rect(15, 110, 180, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('TYPE', 20, 115);
      doc.text('RÉFÉRENCE', 40, 115);
      doc.text('CLIENT', 85, 115);
      doc.text('MONTANT', 145, 115);
      doc.text('STATUT', 180, 115);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      let y = 125;
      
      rejets.slice(0, 20).forEach(r => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(r.type || 'OV', 20, y);
        doc.text(r.reference || 'N/A', 40, y);
        doc.text(r.client_nom?.substring(0, 25) || 'N/A', 85, y);
        doc.text(`${(Number(r.montant) || 0).toLocaleString()}`, 145, y);
        doc.text(r.statut || 'N/A', 180, y);
        y += 8;
      });

      // --- PIED DE PAGE ---
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text('EcoBank Operations - Document confidentiel généré par SGR v3.6', 105, 285, { align: 'center' });

      doc.save(`Rapport_EcoBank_SGR_${now.getTime()}.pdf`);
      
      await supabaseService.addLog({
        level: 'info',
        user: 'Système',
        action: 'Génération PDF',
        details: `Extraction de ${rejets.length} dossiers pour rapport officiel.`
      });

    } catch (error) {
      console.error(error);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner">
          <i className="fas fa-file-pdf"></i>
        </div>
        <h2 className="text-3xl font-black text-slate-800 mb-3 tracking-tighter">Reporting Officiel</h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto leading-relaxed">
          Générez instantanément des rapports de synthèse incluant la ventilation par type d'opération (OV/RC) et le suivi des montants.
        </p>

        <button 
          onClick={generateProfessionalPDF}
          disabled={isGenerating}
          className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-blue-500/30 transition-all inline-flex items-center gap-4 ${isGenerating ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        >
          {isGenerating ? <i className="fas fa-circle-notch fa-spin text-xl"></i> : <i className="fas fa-download text-xl"></i>}
          <span>{isGenerating ? 'Préparation du document...' : 'Télécharger le Rapport de Synthèse'}</span>
        </button>
      </div>
    </div>
  );
};

export default ReportsPage;
