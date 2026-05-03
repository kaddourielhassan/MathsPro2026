import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProfileStore = create(
  persist(
    (set, get) => ({
      profiles: [
        {
          id: 'admin-prof-id',
          prenomOuPseudo: 'ENSEIGNANT (Test)',
          classe: 'Personnel',
          avatar: 0,
          dateCreation: new Date().toISOString(),
          preferencesAffichage: { theme: 'clair', dyslexie: false, son: true },
          niveau: 1,
          xpTotal: 0,
          badges: [],
          historique: [],
          isTeacher: true, // Flag spécial
          pinHash: 'DYNAMIC', // Indicateur pour le code dynamique
          pinSalt: 'DYNAMIC'
        }
      ],
      activeProfileId: null,
      adminSettings: {
        codeHash: null,
        codeSalt: null,
        isInitialized: false
      },

      // Getters
      getActiveProfile: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find(p => p.id === activeProfileId) || null
      },

      getProfilesByClass: (className) => {
        const { profiles } = get()
        if (!className) return profiles
        return profiles.filter(p => p.classe === className)
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
          historique: [],
          pinHash: data.pinHash || null,
          pinSalt: data.pinSalt || null,
        }

        set((state) => {
          const updatedProfiles = [...state.profiles, newProfile]
          return {
            profiles: updatedProfiles,
            activeProfileId: newProfile.id,
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
      }),

      // Admin Actions
      initAdminCode: (hash, salt) => set({
        adminSettings: {
          codeHash: hash,
          codeSalt: salt,
          isInitialized: true
        }
      }),

      updateAdminCode: (hash, salt) => set({
        adminSettings: {
          codeHash: hash,
          codeSalt: salt,
          isInitialized: true
        }
      }),

      // Import/Export complet (Migration/Backup)
      importFullState: (newState) => set({
        profiles: newState.profiles || [],
        activeProfileId: newState.activeProfileId || null,
        adminSettings: newState.adminSettings || { isInitialized: false, codeHash: null, codeSalt: null }
      }),

      // Garantir la présence du profil enseignant
      ensureTeacherProfile: () => {
        const { profiles } = get()
        if (!profiles.some(p => p.isTeacher)) {
          set({
            profiles: [
              {
                id: 'admin-prof-id',
                prenomOuPseudo: 'ENSEIGNANT (Test)',
                classe: 'Personnel',
                avatar: 0,
                dateCreation: new Date().toISOString(),
                preferencesAffichage: { theme: 'clair', dyslexie: false, son: true },
                niveau: 1,
                xpTotal: 0,
                badges: [],
                historique: [],
                isTeacher: true,
                pinHash: 'DYNAMIC',
                pinSalt: 'DYNAMIC'
              },
              ...profiles
            ]
          })
        }
      }
    }),
    {
      name: 'mathspro-profile-storage',
      version: 3,
      migrate: (persistedState, version) => {
        if (version < 2 && persistedState && Array.isArray(persistedState.profiles)) {
          persistedState.profiles = persistedState.profiles.map(p => ({
            ...p,
            historique: Array.isArray(p.historique) ? p.historique : [],
          }))
        }
        if (version < 3 && persistedState) {
          if (Array.isArray(persistedState.profiles)) {
            persistedState.profiles = persistedState.profiles.map(p => ({
              ...p,
              pinHash: p.pinHash || null,
              pinSalt: p.pinSalt || null,
            }))
          }
          persistedState.adminSettings = persistedState.adminSettings || {
            codeHash: null,
            codeSalt: null,
            isInitialized: false
          }
        }
        return persistedState
      },
    }
  )
)
