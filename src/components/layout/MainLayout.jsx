import React, { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { Shield, Brain, Moon, Type, LogOut, GraduationCap, Hexagon } from 'lucide-react'
import { useProfileStore } from '../../store/useProfileStore'

export default function MainLayout() {
  const activeProfile = useProfileStore((state) => state.getActiveProfile())
  const setActiveProfile = useProfileStore((state) => state.setActiveProfile)
  const navigate = useNavigate()
  
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isDysMode, setIsDysMode] = useState(false)

  // Gestion basique du Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  // Gestion du mode Dyslexie
  const toggleDysMode = () => {
    setIsDysMode(!isDysMode)
    if (!isDysMode) document.body.classList.add('dyslexia-mode')
    else document.body.classList.remove('dyslexia-mode')
  }

  const handleLogout = () => {
    setActiveProfile(null)
    navigate('/')
  }

  // Header quand l'utilisateur est connecté (Match exact avec la Maquette 2)
  const renderConnectedHeader = () => (
    <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
      {/* Bouton Home / Logo (Hexagone de l'image) */}
      <Link to="/modules" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="bg-[#5a48e7] text-white p-2 rounded-xl">
           <Hexagon className="h-6 w-6" fill="currentColor" />
        </div>
      </Link>
      
      <div className="flex items-center gap-6">
        {/* Bouton Espace Prof */}
        <Link to="/enseignant" className="flex items-center gap-2 px-3 py-1.5 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors" title="Espace Enseignant (Exports de classe)">
          <GraduationCap className="h-4 w-4" />
          <span className="hidden sm:inline">Espace Prof/AED/Vie scolaire</span>
        </Link>
        
        {/* Pilule Tableau de bord */}
        <Link to="/dashboard" className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-100 transition-colors">
          <Brain className="h-4 w-4" />
          <span className="hidden sm:inline">Tableau de Bord</span>
        </Link>
        
        {/* Toggle Theme / Accessibilité */}
        <div className="flex items-center gap-1">
          <button onClick={toggleDarkMode} className="p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-lg">
            <Moon className="h-5 w-5" />
          </button>
          <button onClick={toggleDysMode} className="p-2 text-slate-500 hover:text-slate-800 transition-colors rounded-lg font-serif">
            <Type className="h-5 w-5" />
          </button>
        </div>

        {/* Profil & Déconnexion */}
        <div className="flex items-center gap-4 pl-4 border-l border-slate-200">
           <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">
                 {activeProfile.prenomOuPseudo} <span className="ml-1">🎓</span>
              </p>
              <p className="text-xs font-semibold text-slate-500">
                 Niv. {Math.max(1, Math.floor(activeProfile.xpTotal/500)+1)} • {activeProfile.xpTotal} XP
              </p>
           </div>
           <button onClick={handleLogout} className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
             Changer de profil <LogOut className="h-4 w-4 ml-1" />
           </button>
        </div>
      </div>
    </div>
  )

  // Header quand aucun utilisateur n'est connecté (plus simple)
  const renderDisconnectedHeader = () => (
    <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="bg-[#5a48e7] text-white p-2 rounded-xl">
           <Hexagon className="h-6 w-6" fill="currentColor" />
        </div>
        <span className="font-black text-xl text-slate-900 hidden sm:inline-block">MathsPro</span>
      </Link>
      <div className="flex items-center gap-4">
        {/* Accès discret mode prof */}
        <Link to="/enseignant" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
          <GraduationCap className="h-4 w-4" />
          Espace Prof/AED/Vie scolaire
        </Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 font-sans transition-colors duration-300">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-slate-100">
        {activeProfile ? renderConnectedHeader() : renderDisconnectedHeader()}
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
        <Outlet />
      </main>

      <footer className="py-8 mt-auto text-center border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-bold text-slate-400 flex items-center justify-center gap-2">
             <Shield className="h-4 w-4" /> 100% Hors-ligne. Conçu par M. EL KADDOURI - 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
