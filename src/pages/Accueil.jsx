import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { Zap, UserPlus, Gamepad2, Ghost, Flame, Crosshair, Bot, Headphones, Sparkles, Rocket, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

// Avatars ciblés "Ados/Gamers" 12-16 ans (plus "cool" que de simples emojis)
const ADO_AVATARS = [
  { icon: Gamepad2, color: 'text-indigo-500', bg: 'bg-indigo-100' },
  { icon: Ghost, color: 'text-slate-700', bg: 'bg-slate-200' },
  { icon: Flame, color: 'text-orange-500', bg: 'bg-orange-100' },
  { icon: Crosshair, color: 'text-red-500', bg: 'bg-red-100' },
  { icon: Bot, color: 'text-teal-500', bg: 'bg-teal-100' },
  { icon: Headphones, color: 'text-blue-500', bg: 'bg-blue-100' },
  { icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-100' },
  { icon: Rocket, color: 'text-pink-500', bg: 'bg-pink-100' },
]

export default function Accueil() {
  const activeProfile = useProfileStore(state => state.getActiveProfile())
  const profiles = useProfileStore(state => state.profiles)
  const createProfile = useProfileStore(state => state.createProfile)
  const setActiveProfile = useProfileStore(state => state.setActiveProfile)
  const navigate = useNavigate()

  const [isCreating, setIsCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newClasse, setNewClasse] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [isQrExpanded, setIsQrExpanded] = useState(false)

  useEffect(() => {
    setCurrentUrl(window.location.origin + window.location.pathname)
  }, [])

  const handleCreate = () => {
    if (newName.trim() === '') return
    const avatarIndex = Math.floor(Math.random() * ADO_AVATARS.length)
    const id = createProfile({ 
      prenomOuPseudo: newName.trim(), 
      classe: newClasse.trim(),
      avatar: avatarIndex 
    })
    setActiveProfile(id)
    navigate('/modules')
  }

  const handleSelect = (id) => {
    setActiveProfile(id)
    navigate('/modules')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center px-4">
        
        {/* Colonne gauche : Présentation */}
        <div className="space-y-6">
          <div>
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight leading-none mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#5a48e7] to-[#c026d3]">
              MathsPro
            </h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">
              calcul mental
            </p>
          </div>

          <div className="inline-block bg-[#e5f5eb] text-[#166534] shadow-sm px-5 py-2 rounded-full font-bold text-sm tracking-wide">
            LE CERVEAU EST UN MUSCLE 💪
          </div>

          <p className="text-xl text-slate-700 leading-relaxed max-w-lg font-medium">
            Prêt(e) à booster tes capacités ? Ici, pas de stress : que tu sois là pour <strong className="text-slate-900 font-bold">t'entraîner à ton rythme</strong> ou <strong className="text-slate-900 font-bold">relever des défis</strong>, tu vas progresser efficacement.
          </p>

          <div className="bg-white p-5 rounded-2xl border border-red-100 flex items-start gap-4 shadow-sm max-w-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-red-400"></div>
            <div className="h-10 w-10 flex-shrink-0 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
              <Zap className="h-5 w-5" fill="currentColor" />
            </div>
            <div>
              <h4 className="font-bold text-red-500 mb-1">Sans calculatrice !</h4>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Ton cerveau est ton seul outil. Développe des stratégies de calcul naturel.</p>
            </div>
          </div>

          <ul className="space-y-4 max-w-lg font-medium text-slate-700">
            <li className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#5a48e7]"></div>
              Précision et rapidité de calcul
            </li>
            <li className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#e840a1]"></div>
              Maîtriser les bases (table, fractions, etc.)
            </li>
            <li className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#10b981]"></div>
              Gagner de l'XP et Collectionner des badges
            </li>
          </ul>

          <div className="flex flex-col xl:flex-row items-start xl:items-center gap-6 pt-8">
             <div className="bg-[#f1f5f9] px-6 py-4 rounded-xl text-sm max-w-[280px]">
                <strong className="text-slate-800 block mb-1">🔒 Mode Hors-ligne</strong>
                <span className="text-slate-500 font-medium">Toutes les données restent sauvegardées localement.</span>
             </div>

             {currentUrl && (
               <div 
                 className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 hover:shadow-md hover:border-[#5a48e7]/50 transition-all cursor-pointer"
                 onClick={() => setIsQrExpanded(true)}
                 title="Cliquez pour agrandir le QR Code"
               >
                 <div className="bg-white p-1 rounded-lg border border-slate-50">
                   <QRCodeSVG value={currentUrl} size={72} level="L" />
                 </div>
                 <div>
                   <strong className="text-slate-800 flex items-center gap-1.5 text-sm mb-0.5">
                     <QrCode className="w-4 h-4 text-[#5a48e7]" /> 
                     Flashe-moi !
                   </strong>
                   <span className="text-slate-500 font-medium text-xs max-w-[140px] block leading-tight">
                     Connecte-toi depuis ton smartphone ou ta tablette
                   </span>
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Colonne droite : Profils */}
        <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] card-shadow border border-slate-100/50 w-full max-w-md mx-auto lg:mr-0 relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 mb-2">Qui es-tu ?</h2>
            <p className="text-slate-500 font-medium text-sm">Choisis ton profil (ton pseudo / prénom) pour continuer</p>
          </div>

          <div className="space-y-3 mb-6 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
            {profiles.map(p => {
              const avatarObj = ADO_AVATARS[p.avatar % ADO_AVATARS.length] || ADO_AVATARS[0]
              const Icon = avatarObj.icon
              const isActive = activeProfile?.id === p.id

              return (
                <button 
                  key={p.id}
                  onClick={() => handleSelect(p.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${isActive ? 'border-[#5a48e7] bg-indigo-50/50 shadow-sm' : 'border-slate-200 hover:border-[#5a48e7] hover:shadow-md bg-white'}`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform ${avatarObj.bg} ${avatarObj.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-800 text-lg flex justify-between items-center">
                      {p.prenomOuPseudo}
                      {isActive && <span className="text-[10px] uppercase tracking-widest bg-[#5a48e7] text-white px-2 py-0.5 rounded-full">Actif</span>}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">Niv. {p.niveau} • {p.classe ? p.classe : 'Élève'}</p>
                  </div>
                </button>
              )
            })}
            
            {profiles.length === 0 && !isCreating && (
               <div className="text-center py-8 text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-2xl">
                 Aucun profil trouvé
               </div>
            )}
          </div>

          {isCreating ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && newName.trim() && document.getElementById('input-classe').focus()}
                placeholder="Ton pseudo ou prénom"
                autoFocus
                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-[#5a48e7] outline-none font-bold bg-white focus:shadow-sm"
              />
              <input 
                id="input-classe"
                type="text" 
                value={newClasse}
                onChange={(e) => setNewClasse(e.target.value)}
                placeholder="Ta classe (optionnel, ex: 3ème A)"
                onKeyDown={(e) => {
                   if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreate()
                   }
                }}
                className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-[#5a48e7] outline-none font-bold bg-white focus:shadow-sm"
              />
              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => { setIsCreating(false); setNewName(''); setNewClasse(''); }}
                  className="flex-1 p-3 rounded-xl font-bold text-slate-500 bg-slate-200 hover:bg-slate-300 transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="flex-1 p-3 rounded-xl font-bold text-white bg-[#5a48e7] hover:bg-[#4b3aca] disabled:opacity-50 transition-colors"
                >
                  Créer
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setIsCreating(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-[#5a48e7]/30 text-[#5a48e7] font-bold hover:bg-[#5a48e7]/5 hover:border-[#5a48e7] transition-all"
            >
              <UserPlus className="h-5 w-5" />
              Nouveau Profil
            </button>
          )}
        </div>

      </div>

      {/* QR Code Expanded Modal */}
      {isQrExpanded && currentUrl && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4 animate-in fade-in"
          onClick={() => setIsQrExpanded(false)}
        >
          <div 
            className="bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center flex flex-col items-center transform transition-transform animate-in zoom-in-95"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-3xl font-black text-slate-800 mb-2 flex items-center gap-3 justify-center">
              <QrCode className="w-8 h-8 text-[#5a48e7]" />
              Flashez pour rejoindre
            </h3>
            <p className="text-slate-500 font-medium text-base mb-8">
              Scannez ce QR Code depuis votre tablette ou smartphone.
            </p>
            <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-slate-100 inline-block mb-8">
              <QRCodeSVG value={currentUrl} size={350} level="M" />
            </div>
            <button 
              onClick={() => setIsQrExpanded(false)}
              className="w-full py-4 rounded-xl font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors text-lg"
            >
              Fermer
            </button>
          </div>
        </div>
      )}

    </div>
  )
}
