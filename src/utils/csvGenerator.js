import { MODULES_CATALOG } from '../data/modules/catalog'

export const generateCSV = (profiles) => {
  const headers = ['Identifiant', 'Niveau', 'XP', 'Module', 'Sessions', 'Précision Globale', 'Validé']
  let csvContent = headers.join(',') + '\n'

  profiles.forEach(profile => {
    MODULES_CATALOG.forEach(mod => {
      const hist = profile.historique?.filter(h => h.moduleId === mod.id) || []
      const tries = hist.length
      if (tries > 0) {
        const scoreGlob = Math.round(hist.reduce((a,b)=>a+b.score,0)/(tries*10)*100) + "%"
        const validations = hist.filter(h => h.validation).length > 0 ? 'Oui' : 'Non'
        const level = Math.max(1, Math.floor(profile.xpTotal/500)+1).toString()
        const row = [
          profile.prenomOuPseudo,
          level,
          profile.xpTotal,
          mod.title,
          tries,
          scoreGlob,
          validations
        ]
        csvContent += row.join(',') + '\n'
      }
    })
  });

  if (csvContent.split('\n').length <= 1) {
    alert("Aucune donnée d'historique disponible pour l'export.");
    return;
  }

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `MathsPro_Export_Local_${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
