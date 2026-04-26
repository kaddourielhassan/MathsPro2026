import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, UserPlus, Trash2 } from 'lucide-react'
import { useProfileStore } from '../store/useProfileStore'

export default function Profils() {
  const navigate = useNavigate()
  const profiles = useProfileStore((state) => state.profiles)
  const activeProfileId = useProfileStore((state) => state.activeProfileId)
  const createProfile = useProfileStore((state) => state.createProfile)
  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)
  const deleteProfile = useProfileStore((state) => state.deleteProfile)

  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    if (newName.trim() === '') return
    createProfile({ prenomOuPseudo: newName.trim(), avatar: 1 })
    setNewName('')
    navigate('/')
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le profil "${name}" et toutes ses données locales ?`)) {
      deleteProfile(id)
    }
  }

  const handleSelect = (id) => {
    setActiveProfile(id)
    navigate('/')
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link to="/" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Link>
        <h1 className="text-3xl font-bold">Choisir un profil</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Sélectionnez un profil existant sur cet appareil ou créez-en un nouveau.
        </p>
      </div>

      {profiles.length > 0 ? (
        <div className="grid gap-4">
          {profiles.map((profile) => (
            <div 
              key={profile.id} 
              className={`flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border shadow-sm transition-colors ${
                activeProfileId === profile.id 
                  ? 'border-indigo-500 ring-1 ring-indigo-500' 
                  : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl uppercase">
                  {profile.prenomOuPseudo[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    {profile.prenomOuPseudo}
                    {activeProfileId === profile.id && (
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Actif</span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Niveau {profile.niveau} • {profile.xpTotal} XP
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDelete(profile.id, profile.prenomOuPseudo)}
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Supprimer ce profil"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => handleSelect(profile.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeProfileId === profile.id
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/60'
                  }`}
                >
                  {activeProfileId === profile.id ? 'Sélectionné' : 'Ouvrir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
          <p className="text-slate-500 dark:text-slate-400">Aucun profil local trouvé sur cet appareil.</p>
        </div>
      )}

      <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-xl font-bold mb-4">Créer un profil</h2>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="w-full">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Prénom / Pseudo
              </label>
              <input 
                type="text" 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                placeholder="Ex: Lina..."
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <button 
              onClick={handleCreate}
              disabled={newName.trim() === ''}
              className="w-full sm:w-auto px-6 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-lg font-medium hover:bg-slate-800 dark:hover:bg-indigo-700 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <UserPlus className="h-4 w-4" />
              Créer le profil
            </button>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 flex items-center gap-1">
            <span className="block h-2 w-2 rounded-full bg-amber-500"></span>
            Données stockées uniquement sur cet appareil
          </p>
        </div>
      </div>
    </div>
  )
}
