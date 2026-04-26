import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { generateQuestion } from '../engine/generator'
import { Swords, Trophy, User } from 'lucide-react'

export default function Duel() {
  const activeProfile = useProfileStore(state => state.getActiveProfile())
  const profiles = useProfileStore(state => state.profiles)
  const updateProfile = useProfileStore(state => state.updateProfile)

  const [opponent, setOpponent] = useState(null)
  const [selectedModule, setSelectedModule] = useState(MODULES_CATALOG[0].id)
  const [matchState, setMatchState] = useState('config') // config, playing, finished

  const [turn, setTurn] = useState(1)
  const [scores, setScores] = useState({ p1: 0, p2: 0 })
  const [questionData, setQuestionData] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const startGame = () => {
    if (!activeProfile || !opponent || !selectedModule) return
    setMatchState('playing')
    setTurn(1)
    setScores({ p1: 0, p2: 0 })
    setQuestionData(generateQuestion(selectedModule, 2))
    setFeedback(null)
  }

  const handleSelect = (opt) => {
    if (feedback) return
    const isP1Turn = turn % 2 !== 0
    const isCorrect = opt === questionData.answer
    
    setFeedback({ isCorrect, correctAns: questionData.answer })
    
    if (isCorrect) {
       setScores(prev => ({ ...prev, [isP1Turn ? 'p1' : 'p2']: prev[isP1Turn ? 'p1' : 'p2'] + 1 }))
    }
    
    setTimeout(() => {
      if (turn >= 10) {
         setMatchState('finished')
         handleEndGame(isCorrect, isP1Turn)
      } else {
         setTurn(t => t + 1)
         setQuestionData(generateQuestion(selectedModule, 2))
         setFeedback(null)
      }
    }, 1500)
  }

  const handleEndGame = (lastAnswerCorrect, isP1Turn) => {
     let finalP1 = scores.p1 + (isP1Turn && lastAnswerCorrect ? 1 : 0)
     let finalP2 = scores.p2 + (!isP1Turn && lastAnswerCorrect ? 1 : 0)
     
     if (finalP1 > finalP2 && activeProfile) {
        updateProfile(activeProfile.id, { xpTotal: activeProfile.xpTotal + 50 })
     } else if (finalP2 > finalP1 && opponent.id !== 'guest') {
        updateProfile(opponent.id, { xpTotal: opponent.xpTotal + 50 })
     }
  }

  if (!activeProfile) {
    return <div className="text-center py-12 px-4 shadow-sm border border-slate-200 mt-12 bg-white rounded-xl max-w-lg mx-auto">Veuillez sélectionner votre profil principal dans la barre de navigation avant de lancer un duel.</div>
  }

  if (matchState === 'config') {
    return (
      <div className="max-w-2xl mx-auto space-y-8">
         <div className="flex items-center gap-3">
            <div className="p-3 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-xl">
                <Swords className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold">Mode Duel Local</h1>
         </div>

         <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
            <p className="text-slate-600 dark:text-slate-400 font-medium">Affrontement tour par tour sur le même appareil (hot-seat) ! 5 questions par joueur.</p>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-xl">
               <label className="block font-extrabold mb-3 text-lg">1. Choisissez un module</label>
               <select className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-800 font-bold text-slate-800 dark:text-slate-200 focus:ring-red-500 focus:border-red-500" value={selectedModule} onChange={e => setSelectedModule(e.target.value)}>
                 {MODULES_CATALOG.map(mod => <option key={mod.id} value={mod.id}>{mod.title}</option>)}
               </select>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 rounded-xl">
               <label className="block font-extrabold mb-3 text-lg">2. Choisissez un adversaire local</label>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {profiles.filter(p => p.id !== activeProfile.id).map(p => (
                     <button key={p.id} onClick={() => setOpponent(p)} className={`p-4 border-2 rounded-xl text-left bg-white dark:bg-slate-800 transition-all ${opponent?.id === p.id ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                        <div className="font-bold flex items-center gap-2 text-lg"><User className="h-5 w-5 text-red-500"/> {p.prenomOuPseudo}</div>
                        <div className="text-xs text-slate-500 font-medium mt-1">Niveau {Math.max(1, Math.floor(p.xpTotal/500)+1)}</div>
                     </button>
                  ))}
                  <button onClick={() => setOpponent({id:'guest', prenomOuPseudo:'Invité'})} className={`p-4 border-2 rounded-xl text-left bg-white dark:bg-slate-800 transition-all ${opponent?.id === 'guest' ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50 dark:bg-red-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                     <div className="font-bold flex items-center gap-2 text-lg"><User className="h-5 w-5 text-slate-400"/> Invité</div>
                     <div className="text-xs text-slate-500 font-medium mt-1">Alerte : pas de gain d'XP possible</div>
                  </button>
               </div>
            </div>

            <button onClick={startGame} disabled={!opponent} className="w-full py-4 text-xl font-bold bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-xl hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all shadow-md">
               Que le meilleur gagne !
            </button>
         </div>
      </div>
    )
  }

  if (matchState === 'finished') {
    const isTie = scores.p1 === scores.p2
    const p1Wins = scores.p1 > scores.p2

    return (
       <div className="max-w-xl mx-auto space-y-6 text-center">
         <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden relative">
           <Trophy className={`h-24 w-24 mx-auto mb-6 ${isTie ? 'text-slate-300' : 'text-amber-400 drop-shadow-md'}`} />
           <h2 className="text-4xl font-extrabold mb-8 tracking-tight">{isTie ? 'Égalité parfaite !' : `Victoire de ${p1Wins ? activeProfile.prenomOuPseudo : opponent.prenomOuPseudo} !`}</h2>
           
           <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
              <div className={`p-8 rounded-2xl border-4 transition-transform ${p1Wins && !isTie ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 scale-105 shadow-xl' : 'border-transparent bg-slate-50 dark:bg-slate-900'}`}>
                 <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">{activeProfile.prenomOuPseudo}</p>
                 <p className="text-6xl font-black">{scores.p1}</p>
                 {p1Wins && !isTie && <p className="text-xs font-bold text-amber-500 mt-2 uppercase">Vainqueur</p>}
              </div>
              <div className={`p-8 rounded-2xl border-4 transition-transform ${!p1Wins && !isTie ? 'border-amber-400 bg-amber-50 dark:bg-amber-900/20 scale-105 shadow-xl' : 'border-transparent bg-slate-50 dark:bg-slate-900'}`}>
                 <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-wide">{opponent.prenomOuPseudo}</p>
                 <p className="text-6xl font-black">{scores.p2}</p>
                 {!p1Wins && !isTie && <p className="text-xs font-bold text-amber-500 mt-2 uppercase">Vainqueur</p>}
              </div>
           </div>

           {!isTie && (
              <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 p-4 rounded-xl font-bold mb-8 shadow-sm">
                🔥 +50 XP pour {p1Wins ? activeProfile.prenomOuPseudo : opponent.prenomOuPseudo} !
              </div>
           )}

           <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <button onClick={() => setMatchState('config')} className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition shadow-md">Prendre sa revanche</button>
              <Link to="/dashboard" className="px-6 py-3 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition">Quitter</Link>
           </div>
         </div>
       </div>
    )
  }

  const isP1Turn = turn % 2 !== 0
  const currentPlayer = isP1Turn ? activeProfile.prenomOuPseudo : opponent.prenomOuPseudo

  return (
    <div className="max-w-2xl mx-auto space-y-6">
       <div className="flex justify-between items-center text-sm font-bold pb-4 border-b border-slate-200 dark:border-slate-700 pt-2">
          <div className={`px-5 py-2 rounded-full transition-colors ${isP1Turn ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <span className="uppercase text-xs opacity-80 mr-2">J1</span> {activeProfile.prenomOuPseudo} : <span className="text-lg ml-1">{scores.p1}</span>
          </div>
          <div className="text-xl font-black text-slate-300 dark:text-slate-600 outline-text">
            {turn}/10
          </div>
          <div className={`px-5 py-2 rounded-full transition-colors ${!isP1Turn ? 'bg-red-500 text-white shadow-md' : 'text-slate-500 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
            <span className="uppercase text-xs opacity-80 mr-2">J2</span> {opponent.prenomOuPseudo} : <span className="text-lg ml-1">{scores.p2}</span>
          </div>
       </div>

       <div className="text-center mt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-3">Au tour de l'adversaire</p>
          <h2 className={`text-5xl font-extrabold ${isP1Turn ? 'text-indigo-600 dark:text-indigo-400' : 'text-red-500 dark:text-red-400'} animate-in fade-in zoom-in duration-300 drop-shadow-sm`}>
             {currentPlayer}
          </h2>
       </div>

      {questionData && (
        <div className="bg-white dark:bg-slate-800 p-8 sm:p-12 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-700 mt-10 relative overflow-hidden">
          {feedback && (
             <div className={`absolute inset-0 z-10 flex flex-col items-center justify-center backdrop-blur-md animate-in fade-in zoom-in duration-200 ${feedback.isCorrect ? 'bg-green-500/90 dark:bg-green-900/90' : 'bg-red-500/90 dark:bg-red-900/90'}`}>
                <div className="text-6xl sm:text-8xl font-black text-white drop-shadow-xl text-center px-4">
                   {feedback.isCorrect ? 'BOUM !' : 'AÏE !'}
                </div>
                {!feedback.isCorrect && (
                   <p className="text-white text-2xl font-bold mt-4 bg-black/20 px-6 py-2 rounded-full">Réponse : {feedback.correctAns}</p>
                )}
             </div>
          )}

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-center mb-16 mt-4 text-slate-800 dark:text-slate-100 tracking-tighter mix-blend-luminosity">
            {questionData.question}
          </h3>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {questionData.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleSelect(opt)}
                className={`p-6 sm:p-10 text-3xl font-extrabold rounded-2xl transition-all border-4 shadow-sm hover:scale-105 hover:shadow-lg focus:outline-none ${isP1Turn ? 'border-indigo-100 hover:border-indigo-500 hover:bg-indigo-50 dark:border-slate-700 dark:hover:border-indigo-500 text-indigo-900 dark:text-white' : 'border-red-100 hover:border-red-500 hover:bg-red-50 dark:border-slate-700 dark:hover:border-red-500 text-red-900 dark:text-white'}`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
