import React, { useState } from 'react'
import { useProfileStore } from '../store/useProfileStore'
import { generateCSV } from '../utils/csvGenerator'
import { generateAttestationPdf } from '../utils/pdfGenerator'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { CLASSES_LYCEE } from '../data/classes'
import { hashString, generateSalt, verifyHash } from '../lib/crypto'
import { 
  FileDown, Download, Trash2, AlertTriangle, Lock, Key, 
  Filter, CheckCircle2, UserPlus, Sparkles, ShieldCheck, LogOut, Upload 
} from 'lucide-react'

export default function DashboardEnseignant() {
  const profiles = useProfileStore(state => state.profiles) || []
  const adminSettings = useProfileStore(state => state.adminSettings)
  const initAdminCode = useProfileStore(state => state.initAdminCode)
  const deleteAllProfiles = useProfileStore(state => state.deleteAllProfiles)
  const deleteProfile = useProfileStore(state => state.deleteProfile)
  const updateProfile = useProfileStore(state => state.updateProfile)
  const importFullState = useProfileStore(state => state.importFullState)

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminInput, setAdminInput] = useState('')
  const [error, setError] = useState('')
  
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [filterClasse, setFilterClasse] = useState('')

  // Filtrage sécurisé
  const filteredProfiles = profiles.filter(p => {
    if (!p) return false
    return !filterClasse || p.classe === filterClasse
  })

  // -- LOGIQUE ADMIN --

  const handleAdminInit = async () => {
    try {
      if (adminInput.length !== 6) {
        setError("Le code doit comporter 6 chiffres.")
        return
      }
      const salt = generateSalt()
      const hash = await hashString(adminInput, salt)
      initAdminCode(hash, salt)
      setIsAdminLoggedIn(true)
      setAdminInput('')
      setError('')
    } catch (err) {
      console.error(err)
      setError("Erreur technique lors de l'initialisation.")
    }
  }

  const handleAdminLogin = async () => {
    try {
      if (!adminSettings?.codeHash || !adminSettings?.codeSalt) {
        setError("Données admin corrompues.")
        return
      }
      const isValid = await verifyHash(adminInput, adminSettings.codeSalt, adminSettings.codeHash)
      if (isValid) {
        setIsAdminLoggedIn(true)
        setAdminInput('')
        setError('')
      } else {
        setError("Code incorrect.")
      }
    } catch (err) {
      console.error(err)
      setError("Erreur technique lors de la vérification.")
    }
  }

  const handleGlobalReset = async () => {
    if (window.confirm("⚠️ ATTENTION : Voulez-vous vraiment supprimer TOUS les profils ? Cette action est irréversible.")) {
       deleteAllProfiles()
       setSelectedProfile(null)
       alert("Tous les profils ont été supprimés.")
    }
  }

  const handleDeleteIndividual = () => {
    if (!selectedProfile) return
    if (window.confirm(`Voulez-vous vraiment supprimer le profil de ${selectedProfile.prenomOuPseudo} ?`)) {
      deleteProfile(selectedProfile.id)
      setSelectedProfile(null)
    }
  }

  const handleResetPin = () => {
    if (!selectedProfile) return
    if (window.confirm(`Réinitialiser le PIN de ${selectedProfile.prenomOuPseudo} ? L'élève pourra en définir un nouveau.`)) {
      updateProfile(selectedProfile.id, { pinHash: null, pinSalt: null })
      alert("PIN réinitialisé.")
    }
  }

  const handleExportBackup = () => {
    const data = {
      profiles,
      adminSettings,
      version: 3,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `MathsPro_Backup_${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  const handleImportBackup = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result)
        if (!data.profiles || !data.adminSettings) {
          throw new Error("Format de fichier invalide.")
        }
        if (window.confirm("⚠️ ATTENTION : L'importation remplacera TOUTES les données actuelles de cet ordinateur. Continuer ?")) {
          importFullState(data)
          alert("Sauvegarde restaurée avec succès !")
          window.location.reload() // Recharger pour rafraîchir tout le store
        }
      } catch (err) {
        alert("Erreur lors de l'importation : " + err.message)
      }
    }
    reader.readAsText(file)
  }

  // Sécurité anti-crash : Si adminSettings est absent (problème store)
  if (!adminSettings) {
    return <div className="p-20 text-center font-bold text-red-500">Erreur critique : Paramètres d'administration introuvables.</div>
  }

  // Ecran d'initialisation (Premier lancement)
  if (!adminSettings.isInitialized) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-indigo-100 text-center space-y-6 shadow-xl">
          <div className="h-20 w-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Initialisation Admin</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            C'est la première fois que vous accédez à cet espace. Choisissez un <strong className="text-indigo-600">code à 6 chiffres</strong>.
          </p>
          <div className="space-y-4">
            <input 
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value.replace(/\D/g, ''))}
              placeholder="Code à 6 chiffres"
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 outline-none text-center font-black tracking-[1em] text-2xl bg-slate-50"
            />
            {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
            <button 
              onClick={handleAdminInit}
              className="w-full py-4 bg-indigo-600 text-white font-black text-lg rounded-xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
            >
              Définir le code maître
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Ecran de connexion
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-20 px-4">
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-200 text-center space-y-6 shadow-xl">
          <div className="h-16 w-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mx-auto">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Espace Sécurisé</h1>
          <p className="text-slate-500 font-medium">Entrez le code maître à 6 chiffres.</p>
          <div className="space-y-4">
            <input 
              type="password"
              inputMode="numeric"
              maxLength={6}
              value={adminInput}
              onChange={(e) => setAdminInput(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              autoFocus
              className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-slate-500 outline-none text-center font-black tracking-[1em] text-2xl bg-slate-50"
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            />
            {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
            <button 
              onClick={handleAdminLogin}
              className="w-full py-4 bg-slate-800 text-white font-black text-lg rounded-xl shadow-lg hover:bg-slate-900 transition-all active:scale-95"
            >
              Déverrouiller
            </button>
          </div>
        </div>
      </div>
    )
  }

  // -- TABLEAU DE BORD ADMIN --
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-8 gap-4 px-2">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <span className="bg-indigo-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-widest">Admin</span>
             <h1 className="text-4xl font-black text-slate-900 tracking-tight">Espace Pédagogique</h1>
           </div>
           <p className="text-slate-500 font-medium">Gestion des élèves — Lycée Alfred Sauvy</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button onClick={handleExportBackup} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-700 hover:border-indigo-500 rounded-2xl font-black shadow-sm transition-all active:scale-95" title="Télécharger une sauvegarde complète (JSON)">
             <Download className="h-5 w-5" />
             Backup JSON
          </button>
          
          <label className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 hover:border-slate-400 rounded-2xl font-black shadow-sm transition-all cursor-pointer active:scale-95" title="Restaurer une sauvegarde depuis un fichier">
             <Upload className="h-5 w-5" />
             Restaurer
             <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button onClick={() => generateCSV(profiles)} className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-indigo-100 text-indigo-700 hover:border-indigo-500 rounded-2xl font-black shadow-sm transition-all active:scale-95">
             <Download className="h-5 w-5" />
             CSV Global
          </button>
          <button onClick={handleGlobalReset} className="flex items-center justify-center gap-2 px-6 py-3 bg-red-50 border-2 border-red-100 text-red-600 hover:bg-red-100 rounded-2xl font-black shadow-sm transition-all active:scale-95">
             <AlertTriangle className="h-5 w-5" />
             Purger Tout
          </button>
          <button onClick={() => setIsAdminLoggedIn(false)} className="p-3 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200 transition-colors" title="Se déconnecter">
             <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border-2 border-amber-200 p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 animate-in slide-in-from-top-4">
        <div className="h-14 w-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-amber-900 font-black text-lg">Attention : Persistance des données</h3>
          <p className="text-amber-800 text-sm font-medium leading-relaxed">
            Les profils sont stockés <strong>uniquement sur cet ordinateur</strong>. 
            Vider le cache du navigateur ou effacer les données de site <strong>supprimera définitivement</strong> tous les comptes élèves. 
            Pensez à exporter régulièrement vos résultats en CSV.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         {/* Colonne Gauche : Liste des Profils */}
         <div className="lg:col-span-4 bg-white rounded-[2rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[700px]">
            <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4">
               <h2 className="font-black text-slate-900 flex items-center justify-between text-xl">
                 Profils Élèves
                 <span className="text-sm bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">{filteredProfiles.length}</span>
               </h2>

               <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
                  <Filter className="h-4 w-4 text-slate-400" />
                  <select 
                    value={filterClasse}
                    onChange={(e) => setFilterClasse(e.target.value)}
                    className="bg-transparent border-none outline-none text-sm font-bold text-slate-700 w-full cursor-pointer"
                  >
                    <option value="">Toutes les classes</option>
                    {CLASSES_LYCEE.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
               </div>
            </div>

            <ul className="divide-y divide-slate-100 overflow-y-auto custom-scrollbar">
               {filteredProfiles.length > 0 ? filteredProfiles.map(p => {
                 const initial = p.prenomOuPseudo ? p.prenomOuPseudo[0].toUpperCase() : '?'
                 return (
                   <li 
                    key={p.id} 
                    className={`p-5 cursor-pointer hover:bg-indigo-50/30 transition-colors flex items-center gap-4 ${selectedProfile?.id === p.id ? 'bg-indigo-50/50 border-l-4 border-indigo-500 pl-4' : 'border-l-4 border-transparent'}`} 
                    onClick={() => setSelectedProfile(p)}
                   >
                      <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {initial}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-slate-900">{p.prenomOuPseudo || 'Sans nom'}</h3>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{p.classe || 'Classe inconnue'}</p>
                      </div>
                      {p.pinHash && <Lock className="h-3.5 w-3.5 text-slate-300" />}
                   </li>
                 )
               }) : (
                 <li className="p-12 text-center text-slate-400 font-medium italic">
                    {filterClasse ? "Aucun élève trouvé dans cette classe." : "Aucun profil enregistré."}
                 </li>
               )}
            </ul>
         </div>

         {/* Colonne Droite : Détail du Profil */}
         <div className="lg:col-span-8">
            {selectedProfile ? (
               <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-200 p-8 sm:p-10 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className="h-20 w-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex flex-shrink-0 items-center justify-center text-4xl font-black text-white shadow-lg">
                          {(selectedProfile.prenomOuPseudo || '?')[0].toUpperCase()}
                       </div>
                       <div>
                          <div className="flex items-center gap-3">
                            <h2 className="text-3xl font-black text-slate-900">{selectedProfile.prenomOuPseudo || 'Élève'}</h2>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-black uppercase tracking-widest">{selectedProfile.classe}</span>
                          </div>
                          <p className="text-slate-500 text-sm font-medium mt-1">
                            Dernière activité : {(selectedProfile.historique && selectedProfile.historique.length > 0) 
                              ? new Date(selectedProfile.historique[selectedProfile.historique.length - 1].date).toLocaleDateString() 
                              : 'Aucune session'}
                          </p>
                       </div>
                    </div>

                    <div className="flex gap-2">
                      <button onClick={handleDeleteIndividual} className="p-4 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors">
                        <Trash2 className="h-6 w-6" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4">
                        <p className="text-xs text-slate-400 font-black uppercase tracking-[0.2em]">Actions</p>
                        <div className="flex flex-col gap-3">
                           <button onClick={() => generateAttestationPdf(selectedProfile)} className="w-full py-3.5 bg-amber-500 text-white font-black rounded-xl hover:bg-amber-600 shadow-md flex items-center justify-center gap-2 transition-transform active:scale-95">
                              <FileDown className="h-5 w-5" />
                              Bilan Pédagogique (PDF)
                           </button>
                           {selectedProfile.pinHash && (
                             <button onClick={handleResetPin} className="w-full py-3 border-2 border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 flex items-center justify-center gap-2 transition-all">
                                <Key className="h-4 w-4" />
                                Réinitialiser le PIN
                             </button>
                           )}
                        </div>
                     </div>
                     <div className="p-6 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl shadow-indigo-200 relative overflow-hidden">
                        <Sparkles className="absolute -top-4 -right-4 h-24 w-24 text-white/10 rotate-12" />
                        <p className="text-xs text-white/70 font-black uppercase tracking-[0.2em] mb-1">Score Global</p>
                        <p className="text-5xl font-black">{selectedProfile.xpTotal || 0} <span className="text-xl font-medium text-white/60">XP</span></p>
                        <p className="mt-4 text-sm font-bold bg-white/20 inline-block px-3 py-1 rounded-full">Niveau {Math.max(1, Math.floor((selectedProfile.xpTotal || 0)/500)+1)}</p>
                     </div>
                  </div>

                  <div>
                     <h3 className="font-black text-xl mb-6 flex items-center gap-3">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        Maîtrise des Modules
                     </h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {MODULES_CATALOG.map(mod => {
                           const hist = (selectedProfile.historique || []).filter(h => h && h.moduleId === mod.id)
                           const tries = hist.length
                           const valid = hist.some(h => h && h.validation)
                           
                           if (tries === 0) return null

                           return (
                             <div key={mod.id} className="flex justify-between items-center p-4 bg-white border border-slate-100 shadow-sm rounded-2xl hover:border-indigo-200 transition-colors">
                                <div>
                                  <p className="font-bold text-slate-800 leading-tight">{mod.title}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{tries} session(s)</p>
                                </div>
                                <div className={`flex items-center gap-2 font-black px-3 py-1 rounded-lg ${valid ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-500'}`}>
                                   {valid ? 'ACQUIS' : 'EN COURS'}
                                </div>
                             </div>
                           )
                        })}
                        {(!selectedProfile.historique || selectedProfile.historique.length === 0) && (
                           <div className="col-span-2 text-slate-400 italic py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                             Aucun travail enregistré pour le moment.
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            ) : (
               <div className="h-full min-h-[500px] border-2 border-dashed border-slate-200 bg-white/50 rounded-[3rem] flex items-center justify-center p-12 text-center text-slate-400">
                  <div className="max-w-sm space-y-4">
                    <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                       <UserPlus className="h-10 w-10 text-slate-200" />
                    </div>
                    <p className="text-lg font-bold text-slate-600">Sélectionnez un profil pour agir</p>
                    <p className="text-sm font-medium">Visualisation des scores, exports PDF et gestion des comptes.</p>
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  )
}
