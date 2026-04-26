import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BookOpen, Clock, Play, Target, CheckCircle2, TrendingUp } from 'lucide-react'
import { MODULES_CATALOG } from '../data/modules/catalog'

export default function ModuleDetail() {
  const { id } = useParams()
  const moduleInfo = MODULES_CATALOG.find(m => m.id === id) || MODULES_CATALOG[0]

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12 relative">
      
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full mix-blend-multiply blur-[120px] pointer-events-none z-[-1]"></div>

      <div>
        <Link to="/modules" className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors">
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Retour au catalogue
        </Link>
        <div className="flex items-center gap-5">
           <div className="h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
             <BookOpen className="h-8 w-8 text-white" />
           </div>
           <div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                {moduleInfo.title}
              </h1>
              <p className="text-lg text-slate-500 font-medium">{moduleInfo.desc}</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-3xl flex items-center justify-between group hover:border-indigo-300 tracking-tight transition-colors">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400 rounded-2xl group-hover:scale-110 transition-transform">
               <CheckCircle2 className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Statut</p>
               <p className="text-2xl font-black text-slate-800 dark:text-slate-100">Confirmé</p>
             </div>
          </div>
          <div className="bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-1.5 rounded-full text-sm font-bold border border-green-500/20">
            Validé
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl flex items-center justify-between group hover:border-indigo-300 transition-colors">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
               <TrendingUp className="h-6 w-6" />
             </div>
             <div>
               <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">XP Cumulée</p>
               <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">320 XP</p>
             </div>
          </div>
          <div className="text-right">
             <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Précision Max</p>
             <p className="text-xl font-bold text-slate-800 dark:text-slate-200">82%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to={`/modules/${moduleInfo.id}/entrainement`} className="group relative bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all transform hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center border border-indigo-400/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-md">
            <Play className="h-8 w-8 text-white fill-current" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Entraînement</h3>
          <p className="text-indigo-100 font-medium text-sm leading-relaxed">Pratique sans stress avec corrections et astuces.</p>
        </Link>
        
        <Link to={`/modules/${moduleInfo.id}/test`} className="group relative bg-gradient-to-br from-amber-500 to-orange-600 text-white p-8 rounded-3xl shadow-lg hover:shadow-xl hover:shadow-amber-500/30 transition-all transform hover:-translate-y-2 overflow-hidden flex flex-col items-center text-center border border-amber-400/30">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform backdrop-blur-md">
            <Clock className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Test Chrono</h3>
          <p className="text-amber-100 font-medium text-sm leading-relaxed">Valide le module dans le temps imparti.</p>
        </Link>

        <div className="flex flex-col gap-4">
           <Link to={`/modules/${moduleInfo.id}/methode`} className="glass-card flex-1 flex items-center justify-center gap-3 p-6 rounded-3xl font-bold text-lg hover:border-indigo-400 text-indigo-700 dark:text-indigo-300 hover:bg-white/50 transition-colors group">
             <BookOpen className="h-6 w-6 group-hover:scale-110 transition-transform" />
             Fiche Méthode
           </Link>
           <button className="glass-card flex-1 flex items-center justify-center gap-3 p-6 rounded-3xl font-bold text-lg hover:border-amber-400 text-slate-600 dark:text-slate-300 hover:bg-white/50 transition-colors group border-dashed border-2">
             <Target className="h-6 w-6 text-slate-400 group-hover:text-amber-500 group-hover:scale-110 transition-all" />
             Définir Focus
           </button>
        </div>
      </div>

      <div className="glass-card p-8 rounded-3xl mt-8">
         <h2 className="text-2xl font-bold mb-6 tracking-tight flex items-center gap-2">
           <span className="w-2 h-8 bg-indigo-500 rounded-full inline-block"></span>
           Dernières Sessions
         </h2>
         <ul className="space-y-4">
           <li className="group flex flex-wrap items-center gap-4 text-slate-700 dark:text-slate-300 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm">
             <div className="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
               <Play className="h-5 w-5 text-indigo-500" fill="currentColor" />
             </div>
             <span className="font-bold text-lg w-32">Entraînement</span>
             <div className="flex-1 min-w-[200px] h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
               <div className="h-full bg-indigo-500 w-[80%] rounded-full"></div>
             </div>
             <span className="font-black text-lg text-indigo-600 dark:text-indigo-400">80%</span>
             <span className="text-sm font-medium text-slate-400 ml-auto bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">aujourd'hui</span>
           </li>
           
           <li className="group flex flex-wrap items-center gap-4 text-slate-700 dark:text-slate-300 p-4 rounded-2xl bg-white/50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 shadow-sm">
             <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
               <Clock className="h-5 w-5 text-amber-500" />
             </div>
             <span className="font-bold text-lg w-32">Test Rapide</span>
             <div className="flex-1 min-w-[200px] h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 w-[60%] rounded-full"></div>
             </div>
             <span className="font-black text-lg text-amber-600 dark:text-amber-400">60%</span>
             <span className="text-sm font-medium text-slate-400 ml-auto bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">hier</span>
           </li>
         </ul>
      </div>
    </div>
  )
}
