import React, { useState, useEffect, useRef } from 'react'
import { Link, useParams } from 'react-router-dom'
import { XCircle } from 'lucide-react'
import { MODULES_CATALOG } from '../data/modules/catalog'
import { generateQuestion } from '../engine/generator'
import { useProfileStore } from '../store/useProfileStore'

const LEVELS = {
  debutant: { label: 'Débutant', time: 20 },
  confirme: { label: 'Confirmé', time: 15 },
  expert: { label: 'Expert', time: 10 }
}

export default function Test() {
  const { id } = useParams()
  const moduleInfo = MODULES_CATALOG.find(m => m.id === id) || MODULES_CATALOG[0]
  const updateProfile = useProfileStore(state => state.updateProfile)
  const activeProfile = useProfileStore(state => state.getActiveProfile())
  
  const [level, setLevel] = useState(null)
  
  const [currentQ, setCurrentQ] = useState(1)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [questionData, setQuestionData] = useState(null)
  const [totalTimeMs, setTotalTimeMs] = useState(0)
  
  const timerRef = useRef()
  const startTimeRef = useRef()

  const startGame = (lvlKey) => {
    setLevel(lvlKey)
    setCurrentQ(1)
    setScore(0)
    setIsFinished(false)
    setTotalTimeMs(0)
    setQuestionData(generateQuestion(moduleInfo.id, lvlKey === 'expert' ? 3 : lvlKey === 'confirme' ? 2 : 1))
    setTimeLeft(LEVELS[lvlKey].time)
    startTimeRef.current = Date.now()
  }

  useEffect(() => {
    if (level && !isFinished && questionData) {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            handleTimeout()
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(timerRef.current)
  }, [level, isFinished, questionData])

  const handleTimeout = () => {
    clearInterval(timerRef.current)
    goToNext(false)
  }

  const handleSelect = (opt) => {
    clearInterval(timerRef.current)
    goToNext(opt === questionData.answer)
  }

  const goToNext = (isCorrect) => {
    let finalScore = score;
    if (isCorrect) {
       setScore(s => s + 1);
       finalScore += 1;
    }
    
    if (currentQ >= 10) {
      const timeElapsed = Date.now() - startTimeRef.current
      setTotalTimeMs(timeElapsed)
      setIsFinished(true)
      saveResults(finalScore, timeElapsed)
    } else {
      setCurrentQ(q => q + 1)
      setQuestionData(generateQuestion(moduleInfo.id, level === 'expert' ? 3 : level === 'confirme' ? 2 : 1))
      setTimeLeft(LEVELS[level].time)
    }
  }

  const saveResults = (finalScore, timeElapsed) => {
    if (!activeProfile) return;

    const accuracy = finalScore / 10
    const isValidated = accuracy >= 0.6 // Règle 60%
    const xpGained = finalScore * 12 + (isValidated ? 50 : 0) // Règle XP test
    
    const session = {
      date: new Date().toISOString(),
      moduleId: moduleInfo.id,
      mode: 'test',
      score: finalScore,
      validation: isValidated
    }
    
    const currentHistory = activeProfile.historique || []
    const newBadges = [...(activeProfile.badges || [])]
    if (isValidated && !newBadges.includes(`${moduleInfo.id}_valide`)) {
        newBadges.push(`${moduleInfo.id}_valide`)
    }

    updateProfile(activeProfile.id, {
      xpTotal: activeProfile.xpTotal + xpGained,
      badges: newBadges,
      historique: [session, ...currentHistory].slice(0, 50) 
    })
  }

  if (!level) {
    return (
      <div className="max-w-xl mx-auto space-y-8 text-center pt-8">
        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Lancer un test chronométré</h2>
        <p className="text-lg text-slate-500">Module : {moduleInfo.title}</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          {Object.entries(LEVELS).map(([key, val]) => (
            <button key={key} onClick={() => startGame(key)} className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group">
              <h3 className="font-bold text-xl mb-3">{val.label}</h3>
              <p className="inline-block px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300 font-mono font-bold rounded-lg group-hover:scale-105 transition-transform">{val.time} s / q</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (isFinished) {
    const accuracy = Math.round((score / 10) * 100)
    const isValidated = accuracy >= 60
    const avgTime = (totalTimeMs / 1000 / 10).toFixed(1)

    return (
      <div className="max-w-xl mx-auto space-y-6 text-center">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
           <h2 className="text-2xl font-bold mb-6">Résultat du test</h2>
           
           <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 <p className="text-sm text-slate-500">Score</p>
                 <p className="text-2xl font-bold">{score}/10</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 <p className="text-sm text-slate-500">Précision</p>
                 <p className="text-2xl font-bold">{accuracy}%</p>
              </div>
              <div className="col-span-2 sm:col-span-1 p-4 bg-slate-50 dark:bg-slate-900 rounded-xl">
                 <p className="text-sm text-slate-500">Temps moyen</p>
                 <p className="text-xl font-bold">{avgTime} s/q</p>
              </div>
              <div className={`col-span-2 sm:col-span-1 p-4 rounded-xl flex items-center justify-center border-2 ${isValidated ? 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400' : 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'}`}>
                 <p className="text-lg font-extrabold uppercase tracking-wide">{isValidated ? 'Validé ✅' : 'Non Validé ❌'}</p>
              </div>
           </div>
           
           <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 p-4 rounded-lg font-bold mb-8 text-lg border border-amber-200 dark:border-amber-800/50">
             🔥 +{score * 12 + (isValidated ? 50 : 0)} XP gagnés
           </div>

           <div className="flex flex-col sm:flex-row justify-center gap-3">
             <button onClick={() => setLevel(null)} className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 shadow-md transition-colors">
               Recommencer
             </button>
             <Link to={`/modules/${moduleInfo.id}`} className="px-6 py-2.5 bg-slate-200 dark:bg-slate-700 font-bold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
               Retour module
             </Link>
             <Link to="/dashboard" className="px-6 py-2.5 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors">
               Tableau de bord
             </Link>
           </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex justify-between items-center text-sm font-bold text-slate-500">
         <span className="uppercase tracking-wider">Test chronométré</span>
         <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-400 px-3 py-1 rounded-full">Niveau: {LEVELS[level].label}</span>
      </div>
      
      <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/50 px-6 py-2 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-sm animate-pulse my-4">
         <XCircle className="h-5 w-5" />
         Calculatrice strictement interdite
      </div>
      
      <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-700 pb-2">
        <div className="flex flex-col">
          <span className="text-xs uppercase font-bold text-slate-400">Temps restant</span>
          <span className={`text-3xl font-black font-mono tracking-tighter ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
             {String(timeLeft).padStart(2,'0')}<span className="text-lg opacity-50">s</span>
          </span>
        </div>
        <div className="text-right">
          <span className="block text-xl font-bold">Score : <span className="text-indigo-600 dark:text-indigo-400">{score}</span> / {currentQ-1 > 0 ? currentQ-1 : 0}</span>
          <span className="text-sm font-bold text-slate-500">Q. {currentQ}/10</span>
        </div>
      </div>

      <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
         <div className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 5 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${(timeLeft / LEVELS[level].time) * 100}%` }}></div>
      </div>

      {questionData && (
        <div className="bg-white dark:bg-slate-800 p-6 sm:p-10 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-700 pb-12 mt-8">
          <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-12 mt-4 text-slate-800 dark:text-slate-100 tracking-tight">
            {questionData.question}
          </h2>

          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {questionData.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => handleSelect(opt)}
                className="p-6 md:p-8 text-2xl md:text-3xl font-bold rounded-2xl transition-all border-2 border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 shadow-sm hover:shadow"
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
