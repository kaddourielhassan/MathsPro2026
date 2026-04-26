import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { useAppStore } from './store/useAppStore'
import './index.css'

// Initialiser le thème au premier chargement avant render
useAppStore.getState().initSettings()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
