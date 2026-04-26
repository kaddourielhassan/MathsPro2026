import React from 'react'
import { Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { generatePDF } from '../utils/pdfGenerator'
import { Download } from 'lucide-react'

export default function DashboardEleve() {
  const activeProfile = useProfileStore(state => state.getActiveProfile())

  if (!activeProfile) {
     return (
       <div className="text-center py-12">
         <p className="mb-4">Veuillez sélectionner un profil d'abord.</p>
         <Link to="/profils" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold">Aller aux profils</Link>
       </div>
    )
  }

  // 500 XP = 1 niveau
  const calcLevel = Math.max(1, Math.floor(activeProfile.xpTotal / 500) + 1)
  
  const history = activeProfile.historique || []
  const precision = history.length ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / (history.length * 10) * 100) : 0

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Tableau de bord de {activeProfile.prenomOuPseudo}</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-indigo-500">
           <div className="flex items-center gap-6 mb-6">
              <div className="h-20 w-20 bg-white/20 rounded-full flex items-center justify-center text-4xl font-bold shadow-inner">
                 {activeProfile.prenomOuPseudo[0].toUpperCase()}
              </div>
              <div>
                 <h2 className="text-3xl font-bold mb-1">{activeProfile.prenomOuPseudo}</h2>
                 <p className="text-indigo-200 font-medium text-lg">Niveau {calcLevel} • {activeProfile.xpTotal} XP</p>
              </div>
           </div>
           
           <div className="border-t border-indigo-400/30 pt-6 mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-4">Badges débloqués</h3>
              <div className="flex flex-wrap gap-2">
                 {(activeProfile.badges || []).length > 0 ? activeProfile.badges.map((b, i) => {
                    const modTitle = MODULES_CATALOG.find(m => `${m.id}_valide` === b)?.title || b;
                    return <span key={i} className="px-3 py-1.5 bg-indigo-900/40 border border-indigo-400/30 rounded-lg text-sm font-bold shadow-sm backdrop-blur-sm">🏆 {modTitle}</span>
                 }) : <span className="text-sm opacity-80 italic bg-white/10 px-4 py-2 rounded-lg">Aucun badge. Lance un test chronométré pour en débloquer !</span>}
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
           <div className="space-y-6">
              <div>
                 <p className="text-xs text-slate-500 font-bold uppercase mb-1 tracking-wider">Précision globale</p>
                 <p className="text-5xl font-black text-slate-900 dark:text-white">{precision}%</p>
              </div>
              <div>
                 <p className="text-xs text-slate-500 font-bold uppercase mb-1 tracking-wider">Modules Validés</p>
                 <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">{(activeProfile.badges || []).length} <span className="text-lg opacity-50">/ 10</span></p>
              </div>
           </div>
           
           <button onClick={() => generatePDF(activeProfile, precision)} className="mt-8 w-full py-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors flex items-center justify-center gap-2">
              <Download className="h-5 w-5" />
              Exporter Bilan PDF
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
         <div>
            <h2 className="text-xl font-bold mb-4">Dernières activités</h2>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden min-h-[300px]">
               {history.length > 0 ? (
                 <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                   {history.slice(0, 5).map((session, i) => {
                     const modTitle = MODULES_CATALOG.find(m=>m.id===session.moduleId)?.title || session.moduleId
                     return (
                     <li key={i} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={`h-10 w-10 flex flex-shrink-0 items-center justify-center rounded-xl font-bold text-xs ${session.mode === 'test' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'}`}>
                             {session.mode === 'test' ? 'TST' : 'ENT'}
                           </div>
                           <div>
                              <p className="font-bold text-sm text-slate-900 dark:text-slate-200">{modTitle}</p>
                              <p className="text-xs text-slate-500 font-medium">{new Date(session.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg leading-none">{session.score}/10</p>
                           {session.mode === 'test' && (
                             <p className={`text-[10px] uppercase font-bold mt-1 ${session.validation ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                               {session.validation ? 'Validé' : 'Échoué'}
                             </p>
                           )}
                        </div>
                     </li>
                     )
                   })}
                 </ul>
               ) : (
                 <div className="h-full flex items-center justify-center p-6 text-center text-slate-500">
                    <p>Aucun historique récent. L'historique s'affichera ici après tes premières sessions.</p>
                 </div>
               )}
            </div>
         </div>
         
         <div>
            <h2 className="text-xl font-bold mb-4">Progression par module</h2>
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 space-y-5 min-h-[300px]">
               {MODULES_CATALOG.slice(0, 5).map(mod => {
                 const modHistory = history.filter(h => h.moduleId === mod.id);
                 const valid = modHistory.some(h => h.validation);
                 const modAcc = modHistory.length ? Math.round(modHistory.reduce((a,b)=>a+b.score,0)/(modHistory.length*10)*100) : 0;
                 return (
                 <div key={mod.id}>
                    <div className="flex justify-between text-sm mb-2">
                       <span className={`font-bold ${valid ? 'text-green-700 dark:text-green-400' : 'text-slate-700 dark:text-slate-300'}`}>
                         {mod.title}
                       </span>
                       <span className="font-mono text-slate-500 font-bold">{modAcc}% {valid && '✅'}</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                       <div className={`h-2 rounded-full transition-all duration-1000 ${valid ? 'bg-green-500' : 'bg-indigo-500'}`} style={{width: `${modAcc}%`}}></div>
                    </div>
                 </div>
                 )
               })}
               <div className="text-center pt-4 border-t border-slate-100 dark:border-slate-700">
                 <Link to="/modules" className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center">
                    Voir tous les modules 
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                 </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  )
}
