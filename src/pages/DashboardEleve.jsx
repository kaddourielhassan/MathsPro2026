import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { generateAttestationPdf } from '../utils/pdfGenerator'
import { verifyHash } from '../lib/crypto'
import { Download, Lock, Key, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react'

export default function DashboardEleve() {
  const activeProfile = useProfileStore(state => state.getActiveProfile())
  const [pinInput, setPinInput] = useState('')
  const [showPinModal, setShowPinModal] = useState(false)
  const [error, setError] = useState('')

  if (!activeProfile) {
     return (
       <div className="text-center py-20">
         <div className="h-20 w-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock className="h-10 w-10 text-slate-300" />
         </div>
         <p className="text-xl font-bold text-slate-500 mb-8">Veuillez sélectionner un profil d'abord.</p>
         <Link to="/" className="px-8 py-4 bg-[#5a48e7] text-white rounded-2xl font-black shadow-lg">Retour à l'accueil</Link>
       </div>
    )
  }

  const calcLevel = Math.max(1, Math.floor(activeProfile.xpTotal / 500) + 1)
  const history = activeProfile.historique || []
  const precision = history.length ? Math.round(history.reduce((acc, h) => acc + h.score, 0) / (history.length * 10) * 100) : 0

  const handlePrintRequest = () => {
    if (activeProfile.pinHash) {
      setShowPinModal(true)
    } else {
      generateAttestationPdf(activeProfile)
    }
  }

  const handleVerifyPin = async () => {
    let isValid = false
    if (activeProfile.isTeacher) {
      const currentYear = new Date().getFullYear().toString()
      isValid = pinInput === currentYear
    } else {
      isValid = await verifyHash(pinInput, activeProfile.pinSalt, activeProfile.pinHash)
    }

    if (isValid) {
      generateAttestationPdf(activeProfile)
      setShowPinModal(false)
      setPinInput('')
      setError('')
    } else {
      setError("PIN incorrect.")
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Ton Tableau de Bord</h1>
        <div className="bg-white/50 backdrop-blur-sm border border-slate-200 px-4 py-2 rounded-2xl text-sm font-bold text-slate-500">
           {activeProfile.classe}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gradient-to-br from-[#5a48e7] to-[#8b5cf6] text-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl relative overflow-hidden">
           {/* Abstract shapes for premium look */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
           
           <div className="flex items-center gap-8 mb-10 relative z-10">
              <div className="h-24 w-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center text-5xl font-black shadow-inner border border-white/30">
                 {activeProfile.prenomOuPseudo[0].toUpperCase()}
              </div>
              <div>
                 <h2 className="text-4xl font-black mb-2 tracking-tight">{activeProfile.prenomOuPseudo}</h2>
                 <div className="flex items-center gap-3">
                   <span className="bg-white/20 px-4 py-1.5 rounded-full font-black text-sm uppercase tracking-widest">Niveau {calcLevel}</span>
                   <span className="font-bold text-indigo-100">{activeProfile.xpTotal} XP cumulés</span>
                 </div>
              </div>
           </div>
           
           <div className="border-t border-white/20 pt-8 mt-4 relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-100 mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Badges de Maîtrise
              </h3>
              <div className="flex flex-wrap gap-3">
                 {(activeProfile.badges || []).length > 0 ? activeProfile.badges.map((b, i) => {
                    const modTitle = MODULES_CATALOG.find(m => `${m.id}_valide` === b)?.title || b;
                    return <span key={i} className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-sm font-black shadow-sm backdrop-blur-md">🏆 {modTitle}</span>
                 }) : <span className="text-sm opacity-80 font-medium bg-black/10 px-6 py-4 rounded-2xl border border-white/10 italic">Lance un test chronométré pour valider tes premiers modules !</span>}
              </div>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col justify-between">
           <div className="space-y-8">
              <div>
                 <p className="text-xs text-slate-400 font-black uppercase mb-1 tracking-[0.2em]">Précision Globale</p>
                 <p className="text-6xl font-black text-slate-900 dark:text-white leading-none">{precision}<span className="text-2xl text-slate-300 ml-1">%</span></p>
              </div>
              <div>
                 <p className="text-xs text-slate-400 font-black uppercase mb-1 tracking-[0.2em]">Validation du Socle</p>
                 <div className="flex items-end gap-2">
                   <p className="text-4xl font-black text-slate-800 dark:text-slate-200">{(activeProfile.badges || []).length}</p>
                   <p className="text-lg font-bold text-slate-300 mb-1.5">/ {MODULES_CATALOG.length} modules</p>
                 </div>
              </div>
           </div>
           
           <button 
            onClick={handlePrintRequest} 
            className="mt-10 w-full py-4 bg-amber-500 text-white font-black rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-200 dark:shadow-none flex items-center justify-center gap-3 active:scale-95"
           >
              <Download className="h-6 w-6" />
              Obtenir mon Attestation
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-6">
         <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 px-2">Dernières sessions</h2>
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
               {history.length > 0 ? (
                 <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                   {history.slice(0, 6).map((session, i) => {
                     const modTitle = MODULES_CATALOG.find(m=>m.id===session.moduleId)?.title || session.moduleId
                     return (
                     <li key={i} className="p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                        <div className="flex items-center gap-5">
                           <div className={`h-12 w-12 flex flex-shrink-0 items-center justify-center rounded-2xl font-black text-xs ${session.mode === 'test' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-100 text-indigo-600'}`}>
                             {session.mode === 'test' ? 'TEST' : 'ENT'}
                           </div>
                           <div>
                              <p className="font-bold text-slate-900 dark:text-slate-200">{modTitle}</p>
                              <p className="text-xs text-slate-400 font-bold uppercase">{new Date(session.date).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-black text-2xl leading-none text-slate-800 dark:text-white">{session.score}/10</p>
                           {session.mode === 'test' && (
                             <p className={`text-[10px] uppercase font-black mt-1.5 px-2 py-0.5 rounded ${session.validation ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                               {session.validation ? 'Validé' : 'Échoué'}
                             </p>
                           )}
                        </div>
                     </li>
                     )
                   })}
                 </ul>
               ) : (
                 <div className="py-20 text-center text-slate-400 font-medium italic">
                    <p>Aucun historique. Commence une session pour voir ton suivi !</p>
                 </div>
               )}
            </div>
         </div>
         
         <div className="space-y-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-slate-200 px-2">Progression par module</h2>
            <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-100 dark:border-slate-700 p-8 space-y-6">
               {MODULES_CATALOG.slice(0, 5).map(mod => {
                 const modHistory = history.filter(h => h.moduleId === mod.id);
                 const valid = modHistory.some(h => h.validation);
                 const modAcc = modHistory.length ? Math.round(modHistory.reduce((a,b)=>a+b.score,0)/(modHistory.length*10)*100) : 0;
                 return (
                 <div key={mod.id} className="space-y-2">
                    <div className="flex justify-between items-end">
                       <span className={`font-bold text-sm ${valid ? 'text-green-600' : 'text-slate-700 dark:text-slate-300'}`}>
                         {mod.title}
                       </span>
                       <span className="font-black text-xs text-slate-400">{modAcc}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                       <div className={`h-full transition-all duration-1000 ${valid ? 'bg-green-500' : 'bg-indigo-500'}`} style={{width: `${modAcc}%`}}></div>
                    </div>
                 </div>
                 )
               })}
               <div className="text-center pt-6 border-t border-slate-100 dark:border-slate-700">
                 <Link to="/modules" className="text-sm font-black text-[#5a48e7] hover:bg-indigo-50 px-4 py-2 rounded-xl transition-all inline-flex items-center gap-2">
                    Voir tous les modules <ChevronRight className="h-4 w-4" />
                 </Link>
               </div>
            </div>
         </div>
      </div>

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center space-y-6 border-2 border-indigo-100">
              <div className="h-16 w-16 bg-indigo-50 text-[#5a48e7] rounded-2xl flex items-center justify-center mx-auto">
                 <Lock className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900">Zone Protégée</h3>
                <p className="text-slate-500 font-medium mt-1">Saisis ton PIN à 4 chiffres pour obtenir ton attestation.</p>
              </div>
              <div className="space-y-4">
                <input 
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  autoFocus
                  className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-[#5a48e7] outline-none text-center font-black tracking-[1em] text-3xl bg-slate-50"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyPin()}
                />
                {error && <p className="text-red-500 font-bold text-sm animate-bounce">{error}</p>}
                
                <div className="flex gap-2">
                   <button onClick={() => { setShowPinModal(false); setPinInput(''); setError(''); }} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">Annuler</button>
                   <button onClick={handleVerifyPin} className="flex-1 py-4 font-black text-white bg-[#5a48e7] rounded-xl hover:bg-[#4b3aca] transition-all shadow-lg">Valider</button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
