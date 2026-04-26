import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      // Getters
      getActiveProfile: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find(p => p.id === activeProfileId) || null
      },

      // Actions
      createProfile: (data) => {
        const newProfile = {
          id: crypto.randomUUID(),
          prenomOuPseudo: data.prenomOuPseudo,
          classe: data.classe || '',
          avatar: data.avatar || 1,
          dateCreation: new Date().toISOString(),
          preferencesAffichage: { theme: 'clair', dyslexie: false, son: true },
          niveau: 1,
          xpTotal: 0,
          badges: [],
          moduleFocus: null,
        }
        
        set((state) => {
          const updatedProfiles = [...state.profiles, newProfile]
          return {
            profiles: updatedProfiles,
            activeProfileId: newProfile.id // Active automatiquement le profil créé
          }
        })
        
        return newProfile.id
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      updateProfile: (id, data) => set((state) => ({
        profiles: state.profiles.map(p => 
          p.id === id ? { ...p, ...data } : p
        )
      })),

      deleteProfile: (id) => set((state) => {
        const updatedProfiles = state.profiles.filter(p => p.id !== id)
        return {
          profiles: updatedProfiles,
          activeProfileId: state.activeProfileId === id ? null : state.activeProfileId
        }
      }),

      deleteAllProfiles: () => set({
        profiles: [],
        activeProfileId: null
      })
    }),
    {
      name: 'mathspro-profile-storage',
    }
  )
)
