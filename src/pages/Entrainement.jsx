import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { CheckCircle2, XCircle, Flame, ArrowRight, Zap, Target } from 'lucide-react'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { generateQuestion } from '../engine/generator'
import { useProfileStore } from '../store/useProfileStore'

export default function Entrainement() {
  const { id } = useParams()
  const moduleInfo = MODULES_CATALOG.find(m => m.id === id) || MODULES_CATALOG[0]
  const updateProfile = useProfileStore(state => state.updateProfile)
  const activeProfile = useProfileStore(state => state.getActiveProfile())
  
  const [currentQ, setCurrentQ] = useState(1)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [sessionXP, setSessionXP] = useState(0)
  
  const [questionData, setQuestionData] = useState(null)
  const [selectedOption, setSelectedOption] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    if(!questionData && !isFinished) {
      setQuestionData(generateQuestion(moduleInfo.id, activeProfile?.niveau || 1))
    }
  }, [id, activeProfile, questionData, isFinished])

  const handleSelect = (opt) => {
    if (showFeedback || isFinished) return
    setSelectedOption(opt)
    setShowFeedback(true)

    const isCorrect = opt === questionData.answer
    if (isCorrect) {
      setScore(s => s + 1)
      setStreak(s => s + 1)
      setSessionXP(xp => xp + 10 + Math.floor(streak/3)*5) // Bonus XP for streaks
    } else {
      setStreak(0)
    }
  }

  const handleNext = () => {
    if (currentQ >= 10) { 
      setIsFinished(true)
      if (activeProfile) {
        updateProfile(activeProfile.id, {
          xpTotal: activeProfile.xpTotal + sessionXP
        })
      }
    } else {
      setCurrentQ(q => q + 1)
      setSelectedOption(null)
      setShowFeedback(false)
      setQuestionData(generateQuestion(moduleInfo.id, activeProfile?.niveau || 1))
    }
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in duration-500">
        <div className="glass-card w-full p-12 rounded-[3rem] text-center relative overflow-hidden border border-indigo-200 dark:border-indigo-800">
           {/* Confetti / Glow effects */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/20 to-transparent blur-3xl pointer-events-none"></div>

           <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.5)] mb-8 animate-bounce">
             <Target className="h-12 w-12 text-white" />
           </div>

           <h2 className="text-4xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">Fin de l'entraînement</h2>
           <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
             {score} / 10
           </div>
           <p className="text-xl font-bold text-slate-500 mb-8 border-b border-slate-200 dark:border-slate-800 pb-8">Précision : <span className="text-indigo-600">{Math.round((score/10)*100)}%</span></p>
           
           <div className="inline-flex items-center gap-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 px-6 py-3 rounded-2xl font-black text-2xl mb-10 shadow-sm">
             <Zap className="h-6 w-6" fill="currentColor" />
             +{sessionXP} XP gagnés
           </div>

           <div className="flex flex-col sm:flex-row justify-center gap-4">
             <Link to={`/modules/${moduleInfo.id}`} className="px-8 py-4 bg-white dark:bg-slate-800 font-bold text-lg rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-lg transition-all border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200">
               Retour au module
             </Link>
             <button onClick={() => {
                setScore(0); setCurrentQ(1); setStreak(0); setSessionXP(0); setIsFinished(false); setQuestionData(null); setShowFeedback(false); setSelectedOption(null);
             }} className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-2xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 transition-all">
               Rejouer la session
             </button>
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300 relative">
      
      {/* Background Ambience */}
      <div className="fixed top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full mix-blend-multiply blur-[100px] pointer-events-none z-[-1]" />
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full mix-blend-multiply blur-[100px] pointer-events-none z-[-1]" />

      <div className="flex justify-between items-center bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-6 py-3 rounded-t-2xl border-x border-t border-slate-200 dark:border-slate-700/50 shadow-sm mt-4">
         <span className="font-bold text-slate-700 dark:text-slate-200">{moduleInfo.title}</span>
         <span className={`flex items-center gap-2 font-black transition-colors ${streak >= 3 ? 'text-orange-500 animate-pulse' : 'text-slate-400'}`}>
           <Flame className="h-5 w-5" fill={streak >= 3 ? "currentColor" : "none"} /> 
           Streak : {streak}
         </span>
      </div>
      
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 px-6 py-2 rounded-b-2xl flex items-center justify-center gap-3 font-bold shadow-sm animate-pulse mb-6">
         <XCircle className="h-5 w-5" />
         Calculatrice strictement interdite
      </div>
      
      <div className="flex justify-between items-end border-b-2 border-slate-200 dark:border-slate-700/50 pb-4">
        <div>
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{score} <span className="text-lg text-slate-400">/ {currentQ-1 > 0 ? currentQ-1 : 0}</span></div>
        </div>
        <div className="text-center flex-1">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Question</p>
          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{currentQ}/10</div>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Gains</p>
          <div className="text-2xl font-black text-amber-500">+{sessionXP} XP</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
        <div className="bg-indigo-500 h-full transition-all duration-300 ease-out" style={{ width: `${(currentQ/10)*100}%` }}></div>
      </div>

      {questionData && (
        <div className="glass-card p-6 sm:p-10 rounded-[2.5rem] mt-8 relative">
          <h2 className="text-5xl sm:text-7xl font-black text-center mb-12 py-10 bg-white/50 dark:bg-slate-900/50 rounded-[2rem] shadow-inner text-slate-900 dark:text-white tracking-tighter">
            {questionData.question}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {questionData.options.map((opt, i) => {
              let btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(79,70,229,0.2)] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
              
              if (showFeedback) {
                if (opt === questionData.answer) 
                  btnClass = "bg-green-50 dark:bg-green-900/30 border-2 border-green-500 text-green-700 dark:text-green-400 shadow-[0_0_30px_rgba(34,197,94,0.3)] scale-[1.02]"
                else if (opt === selectedOption) 
                  btnClass = "bg-red-50 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400 scale-[0.98] opacity-80"
                else 
                  btnClass = "bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 opacity-40 cursor-not-allowed text-slate-400"
              }

              return (
                <button 
                  key={i}
                  disabled={showFeedback}
                  onClick={() => handleSelect(opt)}
                  className={`p-6 sm:p-8 text-3xl font-black rounded-3xl transition-all duration-300 transform active:scale-95 ${btnClass}`}
                >
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {showFeedback && questionData && (
        <div className={`mt-6 p-8 rounded-3xl shadow-lg animate-in slide-in-from-bottom-5 duration-500 flex flex-col sm:flex-row items-center gap-6 ${selectedOption === questionData.answer ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-r from-red-500 to-rose-600 text-white'}`}>
           <div className="h-16 w-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
             {selectedOption === questionData.answer ? <CheckCircle2 className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
           </div>
           
           <div className="flex-1 text-center sm:text-left">
             <h3 className="font-black text-2xl mb-2 tracking-tight">
               {selectedOption === questionData.answer ? 'Excellent !' : `Faux, la réponse était : ${questionData.answer}`}
             </h3>
             <p className="text-white/80 font-medium text-lg">
               Astuce : {questionData.astuce}
             </p>
           </div>
           
           <button onClick={handleNext} className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 font-black text-xl rounded-2xl hover:bg-slate-100 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2 flex-shrink-0">
             Suivant <ArrowRight className="h-6 w-6" />
           </button>
        </div>
      )}

      <div className="text-center pt-8 pb-12">
         <Link to={`/modules/${moduleInfo.id}`} className="inline-block px-6 py-2 rounded-full border border-slate-300 dark:border-slate-600 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors font-bold">
           Quitter l'entraînement
         </Link>
      </div>
    </div>
  )
}
