import { jsPDF } from 'jspdf'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { bilanProfil } from '../lib/scoring'

/**
 * Génère une attestation de validation des compétences au format PDF.
 *
 * Le document est centré sur les modules dont l'élève a démontré la
 * maîtrise (statuts "Expert" et "Validé" en mode Test chronométré).
 * Les compétences fragiles sont mentionnées de façon constructive,
 * comme des objectifs de consolidation.
 *
 * Ce document n'est crédible que s'il est imprimé, signé manuellement
 * par un membre de l'équipe pédagogique ou de vie scolaire (cases à
 * cocher Enseignant / CPE / AED / Autre), et conservé au dossier de
 * l'élève ou transmis aux familles.
 */
export function generateAttestationPdf(profile) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const PAGE_W = 210
  const PAGE_H = 297
  const MARGIN = 20
  const CONTENT_W = PAGE_W - 2 * MARGIN

  // Helpers stylistiques
  const setBody = () => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(30, 41, 59)
  }
  const setBold = () => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(15, 23, 42)
  }
  const setMuted = () => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
  }
  const setSectionLabel = () => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
  }

  let y = 0;

  // Garde-fou : si on déborde du bas de page, on saute en page 2
  const ensureSpace = (needed) => {
    if (y + needed > PAGE_H - 25) {
      doc.addPage()
      y = MARGIN
    }
  }

  // ============================================================
  // EN-TÊTE INSTITUTIONNEL
  // ============================================================
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.setTextColor(15, 23, 42)
  doc.text('Lycée Alfred Sauvy', MARGIN, 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text('Académie de Montpellier', MARGIN, 28)

  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.4)
  doc.line(MARGIN, 33, PAGE_W - MARGIN, 33)

  // ============================================================
  // TITRE
  // ============================================================
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.setTextColor(15, 23, 42)
  doc.text('Attestation de validation', PAGE_W / 2, 48, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor(71, 85, 105)
  doc.text(
    'Compétences en calcul mental — Application MathsPro',
    PAGE_W / 2,
    55,
    { align: 'center' }
  )

  // ============================================================
  // BLOC ÉLÈVE
  // ============================================================
  y = 72

  setSectionLabel()
  doc.text('ÉLÈVE', MARGIN, y)
  y += 6

  setBold()
  doc.setFontSize(14)
  doc.text(profile.prenomOuPseudo || '—', MARGIN, y)
  y += 6

  if (profile.classe) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(71, 85, 105)
    doc.text(`Classe : ${profile.classe}`, MARGIN, y)
    y += 6
  }

  // ============================================================
  // BILAN GLOBAL
  // ============================================================
  const bilan = bilanProfil(profile, MODULES_CATALOG)
  y += 4

  setSectionLabel()
  doc.text('BILAN GLOBAL', MARGIN, y)
  y += 6

  const drawRow = (label, value) => {
    setBody()
    doc.text(label, MARGIN, y)
    setBold()
    doc.text(value, MARGIN + 95, y)
    y += 6
  }

  drawRow('Modules avec compétence acquise', `${bilan.acquis.length} / ${MODULES_CATALOG.length}`)
  drawRow('Modules en consolidation', String(bilan.consolidation.length))
  drawRow('Tests certifiants effectués', String(bilan.nbSessionsTest))
  drawRow('Durée totale de travail', formatDuree(bilan.dureeTotaleMs))

  // ============================================================
  // COMPÉTENCES VALIDÉES
  // ============================================================
  y += 4
  ensureSpace(20 + bilan.acquis.length * 7)

  if (bilan.acquis.length > 0) {
    setSectionLabel()
    doc.text('COMPÉTENCES VALIDÉES', MARGIN, y)
    y += 6

    const tableH = 8 + bilan.acquis.length * 7

    // Encart vert clair
    doc.setFillColor(240, 253, 244)
    doc.setDrawColor(187, 247, 208)
    doc.setLineWidth(0.4)
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, tableH, 2, 2, 'FD')

    // En-tête de colonnes
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(21, 128, 61)
    doc.text('Module', MARGIN + 3, y + 1)
    doc.text('Niveau testé', MARGIN + 80, y + 1)
    doc.text('Réussite', MARGIN + 125, y + 1)
    doc.text('Statut', MARGIN + 155, y + 1)
    y += 7

    // Lignes
    bilan.acquis.forEach(ligne => {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(30, 41, 59)
      doc.text(ligne.moduleTitle, MARGIN + 3, y + 1)
      doc.text(ligne.niveauLabel, MARGIN + 80, y + 1)
      doc.text(`${ligne.taux} %`, MARGIN + 125, y + 1)

      if (ligne.statut === 'expert') {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(21, 128, 61)
        doc.text('★ Expert', MARGIN + 155, y + 1)
      } else {
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(22, 101, 52)
        doc.text('Validé', MARGIN + 155, y + 1)
      }
      y += 7
    })

    y += 4
  } else {
    setBody()
    doc.setTextColor(100, 116, 139)
    doc.text(
      "Aucun module n'a encore fait l'objet d'une validation en mode Test.",
      MARGIN,
      y
    )
    y += 8
  }

  // ============================================================
  // COMPÉTENCES EN CONSOLIDATION
  // ============================================================
  if (bilan.consolidation.length > 0) {
    ensureSpace(20 + bilan.consolidation.length * 7)
    y += 2

    setSectionLabel()
    doc.text('COMPÉTENCES EN CONSOLIDATION', MARGIN, y)
    y += 6

    const tableH = 8 + bilan.consolidation.length * 7

    // Encart ambre clair (sobre, non punitif)
    doc.setFillColor(255, 251, 235) // amber-50
    doc.setDrawColor(253, 230, 138) // amber-200
    doc.setLineWidth(0.4)
    doc.roundedRect(MARGIN, y - 4, CONTENT_W, tableH, 2, 2, 'FD')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(146, 64, 14) // amber-800
    doc.text('Module', MARGIN + 3, y + 1)
    doc.text('Niveau testé', MARGIN + 80, y + 1)
    doc.text('Réussite', MARGIN + 125, y + 1)
    doc.text('À retravailler', MARGIN + 155, y + 1)
    y += 7

    bilan.consolidation.forEach(ligne => {
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(30, 41, 59)
      doc.text(ligne.moduleTitle, MARGIN + 3, y + 1)
      doc.text(ligne.niveauLabel, MARGIN + 80, y + 1)
      doc.text(`${ligne.taux} %`, MARGIN + 125, y + 1)

      doc.setTextColor(146, 64, 14)
      if (ligne.statut === 'fragile') {
        doc.text('Fragile', MARGIN + 155, y + 1)
      } else {
        doc.text('À reprendre', MARGIN + 155, y + 1)
      }
      y += 7
    })

    y += 4
  }

  // ============================================================
  // OBSERVATIONS
  // ============================================================
  ensureSpace(50)
  y += 4

  setSectionLabel()
  doc.text('OBSERVATIONS', MARGIN, y)
  y += 5

  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.3)
  doc.rect(MARGIN, y, CONTENT_W, 24)
  y += 30

  // ============================================================
  // FONCTION DU RESPONSABLE (cases à cocher)
  // ============================================================
  ensureSpace(50)

  setSectionLabel()
  doc.text('FONCTION DU RESPONSABLE', MARGIN, y)
  y += 6

  setBody()
  const cbY = y - 3
  const cbSize = 4

  const drawCheckbox = (x, label) => {
    doc.setDrawColor(71, 85, 105)
    doc.setLineWidth(0.3)
    doc.rect(x, cbY, cbSize, cbSize)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(30, 41, 59)
    doc.text(label, x + cbSize + 2, cbY + 3.2)
  }

  drawCheckbox(MARGIN, 'Enseignant')
  drawCheckbox(MARGIN + 45, 'CPE')
  drawCheckbox(MARGIN + 75, 'AED')
  drawCheckbox(MARGIN + 105, 'Autre :')

  // Ligne pour préciser "Autre"
  doc.setLineWidth(0.3)
  doc.line(MARGIN + 122, cbY + 4, MARGIN + 170, cbY + 4)

  y += 14

  // Nom du responsable
  setBody()
  doc.text('Nom et prénom du responsable :', MARGIN, y)
  doc.line(MARGIN + 65, y + 1, PAGE_W - MARGIN, y + 1)
  y += 14

  // ============================================================
  // SIGNATURES
  // ============================================================
  const sigBoxH = 26
  ensureSpace(sigBoxH + 18)

  doc.setLineWidth(0.3)
  doc.setDrawColor(71, 85, 105)

  // Signature responsable
  doc.rect(MARGIN, y, 75, sigBoxH)
  setMuted()
  doc.text('Signature du responsable', MARGIN + 2, y + sigBoxH + 4)

  // Signature élève
  doc.rect(PAGE_W - MARGIN - 75, y, 75, sigBoxH)
  doc.text("Signature de l'élève", PAGE_W - MARGIN - 73, y + sigBoxH + 4)

  y += sigBoxH + 12

  // Date
  setBody()
  doc.text(`Fait à _________________________, le ${formatDate(new Date())}`, MARGIN, y)

  // ============================================================
  // PIED DE PAGE (sur toutes les pages)
  // ============================================================
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(
      'Document généré par MathsPro — Lycée Alfred Sauvy, Académie de Montpellier',
      PAGE_W / 2,
      287,
      { align: 'center' }
    )
    if (pageCount > 1) {
      doc.text(`Page ${i} / ${pageCount}`, PAGE_W - MARGIN, 287, { align: 'right' })
    }
  }

  // ============================================================
  // SAUVEGARDE
  // ============================================================
  const dateStr = new Date().toISOString().slice(0, 10)
  const nom = (profile.prenomOuPseudo || 'eleve').replace(/[^a-zA-Z0-9_-]/g, '_')
  doc.save(`Attestation_MathsPro_${nom}_${dateStr}.pdf`)
}

// ============================================================
// HELPERS LOCAUX
// ============================================================

function formatDuree(ms) {
  if (!ms || ms <= 0) return '—'
  const totalSec = Math.round(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (min === 0) return `${sec} s`
  if (sec === 0) return `${min} min`
  return `${min} min ${sec.toString().padStart(2, '0')} s`
}

function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}
