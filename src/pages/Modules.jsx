import React from 'react'
import { Link } from 'react-router-dom'
import { Target, Trophy, Swords, Zap, GraduationCap } from 'lucide-react'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { useProfileStore } from '../store/useProfileStore'

// Mapping des couleurs pour le rendu exact des cartes
const getModuleStyle = (id) => {
  const styles = {
    additions: { color: 'text-[#10b981]', bg: 'bg-[#10b981]', bgLight: 'bg-[#ecfdf5]', border: 'border-[#10b981]', icon: '+' },
    soustractions: { color: 'text-[#f43f5e]', bg: 'bg-[#f43f5e]', bgLight: 'bg-[#fff1f2]', border: 'border-[#f43f5e]', icon: '-' },
    multiplications: { color: 'text-[#f97316]', bg: 'bg-[#f97316]', bgLight: 'bg-[#fff7ed]', border: 'border-[#f97316]', icon: 'x' },
    divisions: { color: 'text-[#0ea5e9]', bg: 'bg-[#0ea5e9]', bgLight: 'bg-[#f0f9ff]', border: 'border-[#0ea5e9]', icon: '÷' },
    fractions: { color: 'text-[#d946ef]', bg: 'bg-[#d946ef]', bgLight: 'bg-[#fdf4ff]', border: 'border-[#d946ef]', icon: '1/2' },
    decimaux: { color: 'text-[#6366f1]', bg: 'bg-[#6366f1]', bgLight: 'bg-[#eef2ff]', border: 'border-[#6366f1]', icon: '%' },
    arrondis: { color: 'text-[#8b5cf6]', bg: 'bg-[#8b5cf6]', bgLight: 'bg-[#f5f3ff]', border: 'border-[#8b5cf6]', icon: '≈' },
    conversions: { color: 'text-[#14b8a6]', bg: 'bg-[#14b8a6]', bgLight: 'bg-[#f0fdfa]', border: 'border-[#14b8a6]', icon: 'm' },
    mult10: { color: 'text-[#eab308]', bg: 'bg-[#eab308]', bgLight: 'bg-[#fefce8]', border: 'border-[#eab308]', icon: 'x10' },
    div10: { color: 'text-[#06b6d4]', bg: 'bg-[#06b6d4]', bgLight: 'bg-[#ecfeff]', border: 'border-[#06b6d4]', icon: '÷10' },
  }
  return styles[id] || { color: 'text-slate-500', bg: 'bg-slate-500', bgLight: 'bg-slate-50', border: 'border-slate-500', icon: '•' }
}

export default function Modules() {
  const activeProfile = useProfileStore(state => state.getActiveProfile())

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Banner Principal */}
      <div className="bg-[#5a48e7] rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border-[6px] border-white dark:border-slate-800 relative overflow-hidden">
        {/* Cercles déco en fond */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-purple-500/20 rounded-full blur-xl"></div>
        
        <div className="relative z-10 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">
            Prêt à t'entraîner, {activeProfile?.prenomOuPseudo || 'Champion'} ? 🔥
          </h1>
          <p className="text-[#e2e8f0] font-medium text-lg">
            Choisis une catégorie ci-dessous ou relève le défi du jour.
          </p>
        </div>
        
        <div className="flex gap-4 relative z-10">
          <Link to="/dashboard" className="flex flex-col items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-2xl p-4 transition-colors shrink-0 w-28">
            <Trophy className="h-6 w-6 mb-1 text-amber-300" />
            <span className="font-bold text-sm">0 Badges</span>
          </Link>
          <Link to="/duel" className="flex flex-col items-center justify-center bg-white hover:bg-slate-50 text-[#5a48e7] rounded-2xl p-4 shadow-sm transition-transform hover:scale-105 shrink-0 w-28">
            <Swords className="h-6 w-6 mb-1" />
            <span className="font-bold text-sm text-center leading-tight">Mode Duel<br/>(Local)</span>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white flex items-center gap-2 mb-6 tracking-tight">
          <Target className="h-6 w-6 text-[#5a48e7]" />
          Catégories d'entraînement
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MODULES_CATALOG.map((mod) => {
            const style = getModuleStyle(mod.id)
            
            return (
              <div 
                key={mod.id} 
                className={`bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden transition-all hover:shadow-md group`}
              >
                {/* Ligne de couleur sur le bord supérieur */}
                <div className={`absolute top-0 left-0 w-full h-1.5 ${style.bg} opacity-80`}></div>
                
                <div className="flex justify-between items-start mb-6 mt-1">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl font-black text-white ${style.bg} shadow-sm group-hover:scale-110 transition-transform`}>
                    {style.icon}
                  </div>
                  {/* Icon favori / star placeholder (purement visuel pour la maquette) */}
                  <button className="text-slate-300 hover:text-amber-400 mt-2 transition-colors">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                  </button>
                </div>

                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6 tracking-tight">{mod.title}</h3>
                
                <div className="space-y-3 mb-6">
                  <Link 
                    to={`/modules/${mod.id}/entrainement`}
                    className="flex items-center justify-center w-full py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors gap-2"
                  >
                    <GraduationCap className="h-5 w-5" />
                    Entraînement
                  </Link>
                  <Link 
                    to={`/modules/${mod.id}/test`}
                    className={`flex items-center justify-center w-full py-3 rounded-xl text-white font-bold transition-all hover:scale-[1.02] gap-2 bg-[#5a48e7] hover:bg-[#4b3aca]`}
                  >
                     <Zap className="h-5 w-5" fill="currentColor" />
                     Se Tester
                  </Link>
                </div>

                <div className="text-xs font-semibold text-slate-400 tracking-wide uppercase border-t border-slate-100 dark:border-slate-700 pt-4 flex gap-4">
                  <span>0 XP</span>
                  <span>•</span>
                  <span>0% réussite</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
