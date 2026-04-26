import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Accueil from './pages/Accueil'
import Profils from './pages/Profils'
import Modules from './pages/Modules'
import ModuleDetail from './pages/ModuleDetail'
import FicheMethode from './pages/FicheMethode'
import Entrainement from './pages/Entrainement'
import Test from './pages/Test'
import DashboardEleve from './pages/DashboardEleve'
import DashboardEnseignant from './pages/DashboardEnseignant'
import Donnees from './pages/Donnees'
import Accessibilite from './pages/Accessibilite'
import Duel from './pages/Duel'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Accueil />} />
          <Route path="profils" element={<Profils />} />
          <Route path="modules" element={<Modules />} />
          <Route path="modules/:id" element={<ModuleDetail />} />
          <Route path="modules/:id/methode" element={<FicheMethode />} />
          <Route path="modules/:id/entrainement" element={<Entrainement />} />
          <Route path="modules/:id/test" element={<Test />} />
          <Route path="dashboard" element={<DashboardEleve />} />
          <Route path="enseignant" element={<DashboardEnseignant />} />
          <Route path="duel" element={<Duel />} />
          <Route path="donnees" element={<Donnees />} />
          <Route path="accessibilite" element={<Accessibilite />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
