import React, { useState } from 'react'
import { useProfileStore } from '../store/useProfileStore'
import { generateCSV } from '../utils/csvGenerator'
import { generateAttestationPdf } from '../utils/pdfGenerator'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { FileDown, Download, Trash2, AlertTriangle } from 'lucide-react'

export default function DashboardEnseignant() {
  const profiles = useProfileStore(state => state.profiles)
  const deleteAllProfiles = useProfileStore(state => state.deleteAllProfiles)
  const deleteProfile = useProfileStore(state => state.deleteProfile)
  const [selectedProfile, setSelectedProfile] = useState(null)

  const handleGlobalReset = () => {
    const currentYear = new Date().getFullYear().toString();
    if (window.confirm("⚠️ ATTENTION : Voulez-vous vraiment supprimer TOUS les profils ?")) {
      const code = window.prompt("Entrez le code d'accès prof à 4 chiffres (contactez le référent numérique de l'établissement pour l'obtenir) :");
      if (code === currentYear) {
        deleteAllProfiles()
        setSelectedProfile(null)
        alert("Tous les profils ont été supprimés avec succès.");
      } else if (code !== null) {
        alert("Code incorrect. Opération annulée.");
      }
    }
  }

  const handleDeleteIndividual = () => {
    const currentYear = new Date().getFullYear().toString();
    if (!selectedProfile) return
    if (window.confirm(`Voulez-vous vraiment supprimer le profil de ${selectedProfile.prenomOuPseudo} ?`)) {
      const code = window.prompt("Entrez le code d'accès prof à 4 chiffres (contactez le référent numérique de l'établissement pour l'obtenir) :");
      if (code === currentYear) {
        deleteProfile(selectedProfile.id)
        setSelectedProfile(null)
      } else if (code !== null) {
        alert("Code incorrect. Opération annulée.");
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Espace Enseignant / Moodle</h1>
        <div className="flex items-center gap-3">
          <button onClick={() => generateCSV(profiles)} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl font-bold shadow-sm dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300 transition-colors">
             <Download className="h-4 w-4" />
             Exporter CSV (Global)
          </button>
          <button onClick={handleGlobalReset} className="flex items-center justify-center gap-2 px-5 py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 rounded-xl font-bold shadow-sm dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 transition-colors">
             <AlertTriangle className="h-4 w-4" />
             Tout Purger
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {/* List */}
         <div className="md:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[600px]">
            <div className="p-5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
               <h2 className="font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                 Profils locaux
                 <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-300">{profiles.length}</span>
               </h2>
            </div>
            <ul className="divide-y divide-slate-100 dark:divide-slate-700 overflow-y-auto">
               {profiles.length > 0 ? profiles.map(p => {
                 return (
                   <li key={p.id} className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${selectedProfile?.id === p.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 pl-3' : 'border-l-4 border-transparent'}`} onClick={() => setSelectedProfile(p)}>
                      <h3 className="font-bold font-lg text-slate-900 dark:text-slate-100">{p.prenomOuPseudo}</h3>
                      <p className="text-xs text-slate-500 font-medium">Niv {Math.max(1, Math.floor(p.xpTotal/500)+1)} • {p.xpTotal} XP</p>
                   </li>
                 )
               }) : (
                 <li className="p-6 text-center text-sm text-slate-500 italic">Aucun profil enregistré sur cette machine.</li>
               )}
            </ul>
         </div>

         {/* Detail */}
         <div className="md:col-span-2">
            {selectedProfile ? (
               <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-5">
                     <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex flex-shrink-0 items-center justify-center text-3xl font-bold text-white shadow-inner">
                        {selectedProfile.prenomOuPseudo[0].toUpperCase()}
                     </div>
                     <div>
                        <h2 className="text-2xl font-bold">{selectedProfile.prenomOuPseudo}</h2>
                        <p className="text-slate-500 text-sm font-medium">Dernière activité : {(selectedProfile.historique && selectedProfile.historique.length > 0) ? new Date(selectedProfile.historique[0].date).toLocaleDateString() : 'Aucune session complétée'}</p>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Bilan Moodle / VS</p>
                        <div className="flex flex-col gap-2 mt-auto">
                           <button onClick={() => generateAttestationPdf(selectedProfile)} className="w-full py-2.5 bg-amber-500 text-white font-bold rounded-lg hover:bg-amber-600 shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95">
                              <FileDown className="h-4 w-4" />
                              Attestation Vie Scolaire
                           </button>
                           <button onClick={handleDeleteIndividual} className="w-full py-2 border-2 border-red-500 text-red-500 font-bold rounded-lg hover:bg-red-50 hover:text-red-600 shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95">
                              <Trash2 className="h-4 w-4" />
                              Supprimer le Profil
                           </button>
                        </div>
                     </div>
                     <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Modules</p>
                        <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{(selectedProfile.badges || []).length} <span className="text-lg font-medium text-slate-400">Validés</span></p>
                     </div>
                  </div>

                  <div>
                     <h3 className="font-bold text-lg mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Suivi par module</h3>
                     <div className="space-y-3">
                        {MODULES_CATALOG.filter(mod => selectedProfile.historique?.some(h=>h.moduleId === mod.id)).map(mod => {
                           const hist = selectedProfile.historique.filter(h=>h.moduleId === mod.id)
                           const tries = hist.length
                           const valid = hist.some(h=>h.validation)
                           const acc = Math.round(hist.reduce((a,b)=>a+b.score,0)/(tries*10)*100)
                           return (
                             <div key={mod.id} className="flex justify-between items-center text-sm p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg">
                                <span className={`font-bold ${valid ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>{mod.title}</span>
                                <span className="font-mono bg-slate-100 dark:bg-slate-900 px-3 py-1 rounded-md font-bold text-slate-700 dark:text-slate-300">{acc}% {valid && '✅'}</span>
                             </div>
                           )
                        })}
                        {(selectedProfile.historique?.length === 0 || !selectedProfile.historique) && (
                           <p className="text-slate-500 italic flex items-center justify-center p-8 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">Aucun travail enregistré.</p>
                        )}
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full min-h-[300px] border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-2xl flex items-center justify-center p-8 text-center text-slate-500">
                  <p className="max-w-sm">Sélectionnez un profil à gauche pour visualiser son dossier et générer une attestation pour Moodle ou la Vie Scolaire.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
