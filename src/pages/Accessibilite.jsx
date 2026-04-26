import React from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import { Glasses } from 'lucide-react'

export default function Accessibilite() {
  const { theme, setTheme, dyslexie, toggleDyslexie } = useAppStore()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 rounded-xl">
             <Glasses className="h-8 w-8" />
         </div>
         <h1 className="text-3xl font-bold">Accessibilité</h1>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-8">
        <div>
           <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Thème visuel</h2>
           <div className="flex gap-4">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-600 rounded-xl flex-1 hover:border-indigo-500 transition-colors">
                <input type="radio" checked={theme === 'clair'} onChange={() => setTheme('clair')} className="h-5 w-5 text-indigo-600 focus:ring-indigo-500" />
                <span className="font-bold">Clair</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 dark:border-slate-600 rounded-xl flex-1 hover:border-indigo-500 transition-colors">
                <input type="radio" checked={theme === 'sombre'} onChange={() => setTheme('sombre')} className="h-5 w-5 text-indigo-600 focus:ring-indigo-500" />
                <span className="font-bold">Sombre</span>
              </label>
           </div>
        </div>
        
        <div>
           <h2 className="text-xl font-bold mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">Mode Dyslexie</h2>
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
               <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
                 Active un lettrage espacé, augmente l'interligne et modifie la police pour faciliter le processus de lecture.
               </p>
               <button onClick={toggleDyslexie} className={`px-6 py-2.5 rounded-xl font-bold transition-all shadow-sm ${dyslexie ? 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-none' : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600'}`}>
                 {dyslexie ? 'Activé' : 'Activer'}
               </button>
           </div>
        </div>
      </div>
    </div>
  )
}
