import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { MODULES_CATALOG } from '../data/modules/catalog';

export const generatePDF = (profile, precisionGlobale) => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(22);
  doc.setTextColor(79, 70, 229); // Indigo-600
  doc.text("MathsPro - Bilan Élève", 20, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`Identité locale : ${profile.prenomOuPseudo}`, 20, 35);
  doc.text(`Date d'export : ${new Date().toLocaleDateString()}`, 140, 35);
  doc.text(`Niveau : ${Math.max(1, Math.floor(profile.xpTotal/500)+1)}`, 20, 45);
  doc.text(`XP Total : ${profile.xpTotal} XP`, 70, 45);
  doc.text(`Précision globale : ${precisionGlobale}%`, 140, 45);

  doc.text(`Badges obtenus : ${(profile.badges||[]).length > 0 ? profile.badges.map(b=>b.replace('_valide','')).join(', ') : 'Aucun'}`, 20, 55);

  // Table
  const tableData = [];
  MODULES_CATALOG.forEach(mod => {
    const hist = profile.historique?.filter(h => h.moduleId === mod.id) || [];
    const tries = hist.length;
    const validations = hist.filter(h => h.validation).length;
    let acc = "N/A";
    if (tries > 0) acc = Math.round(hist.reduce((a,b)=>a+b.score,0)/(tries*10)*100) + "%";
    
    tableData.push([
      mod.title,
      tries.toString(),
      acc,
      validations > 0 ? "Validé" : "En cours"
    ]);
  });

  doc.autoTable({
    startY: 65,
    head: [['Module', 'Sessions', 'Précision', 'Statut']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] }
  });

  // Footer (Obligatoire V1)
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("100% Hors-ligne. Conçu par M. EL KADDOURI à l'aide de l'IA - 2026", 20, pageHeight - 10);

  doc.save(`MathsPro_Bilan_${profile.prenomOuPseudo}_${new Date().toISOString().split('T')[0]}.pdf`);
}

export const generateAttestationPdf = (profile) => {
  const doc = new jsPDF();
  
  doc.setFontSize(22);
  doc.setTextColor(217, 119, 6); // Amber-600
  doc.text("Attestation de Travail - MathsPro", 20, 20);
  
  doc.setFontSize(12);
  doc.setTextColor(50, 50, 50);
  doc.text(`Élève : ${profile.prenomOuPseudo}`, 20, 35);
  doc.text(`Date : ${new Date().toLocaleDateString()}`, 140, 35);
  doc.text(`Classe : ${profile.classe ? profile.classe : 'Non spécifiée'}`, 20, 42);
  doc.text(`L'élève justifie avoir travaillé sur l'application MathsPro et obtenu les résultats suivants :`, 20, 52, { maxWidth: 170 });

  const tableData = [];
  MODULES_CATALOG.forEach(mod => {
    const hist = profile.historique?.filter(h => h.moduleId === mod.id) || [];
    const tries = hist.length;
    if (tries > 0) {
      const valid = hist.filter(h => h.validation).length > 0;
      let acc = Math.round(hist.reduce((a,b)=>a+b.score,0)/(tries*10)*100) + "%";
      tableData.push([mod.title, acc, valid ? "Validé" : "En cours d'acquisition"]);
    }
  });

  if (tableData.length === 0) {
    tableData.push(["Aucun module travaillé", "-", "-"]);
  }

  doc.autoTable({
    startY: 62,
    head: [['Module Pédagogique', 'Réussite (%)', 'Statut']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [217, 119, 6] }
  });

  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text(`Niveau global certifié : ${Math.max(1, Math.floor(profile.xpTotal/500)+1)}`, 20, doc.previousAutoTable.finalY + 15);

  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text("100% Hors-ligne. Conçu par M. EL KADDOURI à l'aide de l'IA - 2026", 20, pageHeight - 10);

  doc.save(`MathsPro_Attestation_${profile.prenomOuPseudo}_${new Date().toISOString().split('T')[0]}.pdf`);
}
