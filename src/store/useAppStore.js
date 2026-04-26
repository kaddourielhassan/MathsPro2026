import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set) => ({
      theme: 'clair',
      dyslexie: false,
      
      setTheme: (theme) => {
        set({ theme })
        if (theme === 'sombre') document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      },
      
      toggleDyslexie: () => set((state) => {
        const next = !state.dyslexie
        if (next) document.documentElement.classList.add('dyslexia-mode')
        else document.documentElement.classList.remove('dyslexia-mode')
        return { dyslexie: next }
      }),

      initSettings: () => set((state) => {
        if (state.theme === 'sombre') document.documentElement.classList.add('dark')
        if (state.dyslexie) document.documentElement.classList.add('dyslexia-mode')
        return state
      })
    }),
    {
      name: 'mathspro-app-settings',
    }
  )
)
