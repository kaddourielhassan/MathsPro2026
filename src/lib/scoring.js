/**
 * Logique de validation et de scoring pour MathsPro.
 *
 * Statuts d'acquisition par module (à un niveau de difficulté donné) :
 *   - "expert"    : score ≥ 80 %
 *   - "valide"    : 60 % ≤ score < 80 %
 *   - "fragile"   : 40 % ≤ score < 60 %
 *   - "non_acquis": score < 40 %
 *
 * La validation ne peut être obtenue qu'en mode Test (chronométré).
 * Les sessions d'entraînement sont enregistrées pour la durée totale
 * de travail mais n'entrent pas dans le calcul de validation.
 */

export const NIVEAU_LABELS = {
  debutant: 'Débutant',
  confirme: 'Confirmé',
  expert: 'Expert',
}

export const NIVEAU_RANK = {
  debutant: 1,
  confirme: 2,
  expert: 3,
}

/**
 * À partir d'un pourcentage de réussite (0-100), retourne le statut.
 */
export function statutFromTaux(tauxReussite) {
  if (tauxReussite >= 80) return 'expert'
  if (tauxReussite >= 60) return 'valide'
  if (tauxReussite >= 40) return 'fragile'
  return 'non_acquis'
}

export const STATUT_LABELS = {
  expert: 'Maîtrise experte',
  valide: 'Compétence validée',
  fragile: 'Compétence fragile',
  non_acquis: 'Non acquis',
}

/**
 * Pour un module donné, parmi toutes les sessions de Test enregistrées,
 * retourne la "meilleure" session :
 *   - on privilégie le niveau de difficulté le plus élevé
 *   - puis, à niveau égal, le meilleur taux de réussite
 *
 * Retourne null si aucune session de test n'a été jouée pour ce module.
 */
export function meilleureSessionDeTest(historique, moduleId) {
  const sessionsTest = (historique || []).filter(
    s => s.moduleId === moduleId && s.mode === 'test'
  )
  if (sessionsTest.length === 0) return null

  return sessionsTest.reduce((meilleure, s) => {
    if (!meilleure) return s
    const rangCourant = NIVEAU_RANK[s.niveau] || 0
    const rangMeilleur = NIVEAU_RANK[meilleure.niveau] || 0
    if (rangCourant > rangMeilleur) return s
    if (rangCourant < rangMeilleur) return meilleure
    // Même niveau : on prend le meilleur score
    const tauxCourant = (s.score / s.totalQuestions) * 100
    const tauxMeilleur = (meilleure.score / meilleure.totalQuestions) * 100
    return tauxCourant > tauxMeilleur ? s : meilleure
  }, null)
}

/**
 * Bilan complet d'un profil pour l'attestation.
 * Sépare les modules acquis (expert + validé) des modules en consolidation
 * (fragile + non acquis). Ne liste pas les modules jamais testés.
 */
export function bilanProfil(profile, modulesCatalog) {
  const historique = profile.historique || []
  const acquis = []
  const consolidation = []

  modulesCatalog.forEach(mod => {
    const meilleure = meilleureSessionDeTest(historique, mod.id)
    if (!meilleure) return

    const taux = Math.round((meilleure.score / meilleure.totalQuestions) * 100)
    const statut = statutFromTaux(taux)

    const ligne = {
      moduleId: mod.id,
      moduleTitle: mod.title,
      niveau: meilleure.niveau,
      niveauLabel: NIVEAU_LABELS[meilleure.niveau] || meilleure.niveau,
      taux,
      statut,
      statutLabel: STATUT_LABELS[statut],
      date: meilleure.date,
    }

    if (statut === 'expert' || statut === 'valide') {
      acquis.push(ligne)
    } else {
      consolidation.push(ligne)
    }
  })

  // Tri : experts d'abord, puis validés, puis par taux décroissant
  acquis.sort((a, b) => {
    if (a.statut !== b.statut) return a.statut === 'expert' ? -1 : 1
    return b.taux - a.taux
  })
  consolidation.sort((a, b) => b.taux - a.taux)

  // Statistiques globales (sur toutes les sessions, test + entraînement)
  const dureeTotaleMs = historique.reduce((s, h) => s + (h.dureeMs || 0), 0)
  const nbSessions = historique.length
  const nbSessionsTest = historique.filter(h => h.mode === 'test').length

  return {
    acquis,
    consolidation,
    dureeTotaleMs,
    nbSessions,
    nbSessionsTest,
  }
}
