import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Lightbulb, Target, AlertTriangle, BookOpen } from 'lucide-react'
import { MODULES_CATALOG, MODULES_TIPS } from '../data/modules/catalog'

export default function FicheMethode() {
  const { id } = useParams()
  const moduleInfo = MODULES_CATALOG.find(m => m.id === id) || MODULES_CATALOG[0]
  const tipData = MODULES_TIPS[id] || MODULES_TIPS.default

  // Compatibilité avec l'ancien format tableau (au cas où)
  const isLegacy = Array.isArray(tipData)

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 px-4 sm:px-0">
      <Link to={`/modules/${moduleInfo.id}`} className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors bg-white px-5 py-2.5 rounded-xl shadow-sm border border-slate-100 mb-2">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour au module
      </Link>
      
      <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        {/* En-tête Fiche */}
        <div className="bg-gradient-to-r from-[#5a48e7] to-purple-600 p-8 md:p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Lightbulb className="w-40 h-40" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-white/10">
              <BookOpen className="w-4 h-4" /> Fiche méthode
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">{moduleInfo.title}</h1>
            <p className="text-indigo-100 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
              {isLegacy ? moduleInfo.desc : tipData.intro}
            </p>
          </div>
        </div>

        {/* Contenu */}
        <div className="p-8 md:p-12 space-y-12">
          
          {isLegacy ? (
            <div className="space-y-4">
               <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2 mb-6">
                 <Target className="text-[#5a48e7] w-7 h-7" /> Conseils pratiques
               </h3>
               {tipData.map((tip, i) => (
                 <div key={i} className="flex gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <span className="font-black text-xl text-indigo-200">{i + 1}.</span>
                    <p className="text-slate-700 font-medium pt-0.5">{tip}</p>
                 </div>
               ))}
            </div>
          ) : (
            <>
              {/* Règles / Stratégies */}
              {tipData.rules && tipData.rules.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-6">
                    <Target className="text-[#5a48e7] w-7 h-7" /> Stratégies clés
                  </h3>
                  <div className="grid gap-4">
                    {tipData.rules.map((rule, i) => (
                      <div key={i} className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-indigo-100 transition-colors shadow-sm">
                        <h4 className="font-black text-slate-900 text-lg mb-3 flex items-start gap-3">
                          <span className="bg-indigo-100 text-[#5a48e7] w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">{i+1}</span>
                          {rule.title}
                        </h4>
                        <p className="text-slate-600 font-medium pl-10 text-[15px] leading-relaxed">{rule.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Exemples */}
              {tipData.examples && tipData.examples.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-6">
                    <Lightbulb className="text-amber-500 w-7 h-7" /> Exemples illustrés
                  </h3>
                  <div className="space-y-4">
                    {tipData.examples.map((ex, i) => (
                      <div key={i} className="flex flex-col md:flex-row gap-5 md:items-center bg-amber-50/50 p-6 rounded-2xl border border-amber-100/60 shadow-sm">
                        <div className="bg-white px-5 py-3 rounded-xl shadow-sm border border-amber-200/60 font-mono text-xl font-bold text-slate-800 whitespace-nowrap text-center">
                          {ex.eq}
                        </div>
                        <div className="text-slate-700 font-medium text-[15px] leading-relaxed">
                          {ex.desc}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pièges */}
              {tipData.pitfalls && tipData.pitfalls.length > 0 && (
                <div>
                  <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 mb-6">
                    <AlertTriangle className="text-rose-500 w-7 h-7" /> Pièges à éviter
                  </h3>
                  <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-6 md:p-8 shadow-sm">
                    <ul className="space-y-4">
                      {tipData.pitfalls.map((pitfall, i) => (
                        <li key={i} className="flex items-start gap-3 text-rose-900 font-medium text-[15px] leading-relaxed">
                          <span className="text-rose-500 font-bold mt-0.5 text-lg">•</span>
                          {pitfall}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Call to action */}
          <div className="pt-10 flex justify-center border-t border-slate-100">
            <Link to={`/modules/${moduleInfo.id}/entrainement`} className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-lg hover:bg-[#5a48e7] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3">
              J'ai compris, je m'entraîne !
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
