import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'

export default function Donnees() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
         <div className="p-3 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400 rounded-xl">
             <ShieldCheck className="h-8 w-8" />
         </div>
         <h1 className="text-3xl font-bold">Informations sur vos données</h1>
      </div>
      
      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
        
        <div className="bg-green-50 border border-green-200 dark:bg-green-900/10 dark:border-green-800 p-5 rounded-xl text-green-900 dark:text-green-100 mb-8">
           <h2 className="font-extrabold text-lg mb-2">Conformité RGPD "Offline-First"</h2>
           <p className="text-sm font-medium opacity-90">
             MathsPro garantit la protection stricte de vos données en appliquant un principe de minimisation. 
             Absolument <span className="underline font-bold">aucune</span> donnée utilisateur ne transite vers un serveur externe. Vous n'avez pas besoin d'e-mail ou de mot de passe pour utiliser l'outil.
           </p>
        </div>

        <div>
           <h3 className="font-bold text-lg mb-2">Quelles données sont stockées ?</h3>
           <ul className="list-inside list-disc pl-2 space-y-2 text-slate-700 dark:text-slate-300 text-sm font-medium">
              <li>Prénom / pseudonyme (saisi manuellement).</li>
              <li>Historique local de vos scores et temps de tests.</li>
              <li>XP totaux, niveau global et liste des badges débloqués.</li>
              <li>Vos préférences d'affichage (Accessibilité).</li>
           </ul>
        </div>

        <div>
           <h3 className="font-bold text-lg mb-2 border-t border-slate-200 dark:border-slate-700 pt-6">Comment les supprimer ?</h3>
           <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
             Puisque tout est enregistré dans la mémoire locale de votre navigateur Web sur cet ordinateur exact, il vous suffit de supprimer le profil via le menu dédié pour tout effacer définitivement.
           </p>
           <Link to="/profils" className="inline-flex px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors shadow-sm">
              Accompagner vers l'écran de suppression
           </Link>
        </div>
      </div>
    </div>
  )
}
