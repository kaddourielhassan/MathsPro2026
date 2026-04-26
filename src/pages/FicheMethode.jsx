import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Lightbulb } from 'lucide-react'
import { MODULES_CATALOG, MODULES_TIPS } from '../data/modules/catalog'

export default function FicheMethode() {
  const { id } = useParams()
  const moduleInfo = MODULES_CATALOG.find(m => m.id === id) || MODULES_CATALOG[0]
  const tips = MODULES_TIPS[id] || MODULES_TIPS.default

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link to={`/modules/${moduleInfo.id}`} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 border px-3 py-1 rounded bg-white">
        <ArrowLeft className="h-4 w-4 mr-1" />
        Retour
      </Link>
      
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-6 md:p-8 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
           <Lightbulb className="h-8 w-8 text-amber-500" />
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Fiche méthode</h1>
        </div>
        <h2 className="text-xl font-medium mb-6 text-amber-800 dark:text-amber-400">Module : {moduleInfo.title}</h2>
        
        <div className="space-y-4">
          {tips.map((tip, i) => (
            <div key={i} className="flex gap-3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm">
               <span className="font-bold text-amber-500">{i + 1}.</span>
               <p className="text-slate-800 dark:text-slate-200">{tip}</p>
            </div>
          ))}
        </div>

        {id === 'fractions' && (
          <div className="mt-8 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <h3 className="font-bold mb-2">Exemple illustré :</h3>
            <p className="font-mono text-lg p-2 bg-slate-50 dark:bg-slate-900 rounded">
              12/18 <span className="text-slate-400">→ on simplifie par 2 →</span> 6/9 <span className="text-slate-400">→ puis par 3 →</span> 2/3
            </p>
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <Link to={`/modules/${moduleInfo.id}/entrainement`} className="px-6 py-2 bg-indigo-600 text-white rounded font-bold hover:bg-indigo-700 shadow-md">
            Commencer l'entraînement
          </Link>
        </div>
      </div>
    </div>
  )
}
