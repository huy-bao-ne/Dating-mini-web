import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Profile {
  id: string
  firstName?: string
  lastName?: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  bio: string
  email: string
  password: string // Mật khẩu (hash hoặc plain text tạm thời)
  createdAt: string
  avatar?: string
  height?: number
  city?: string
  job?: string
  hobbies?: string[]
  languages?: string[]
  education?: string
}

interface ProfileStore {
  currentUserId: string | null
  currentProfile: Profile | null
  allProfiles: Profile[]
  setCurrentUserId: (userId: string) => void
  setCurrentProfile: (profile: Profile) => void
  clearCurrentProfile: () => void
  createProfile: (profile: Omit<Profile, 'id' | 'createdAt'>) => Profile
  getAllProfiles: () => Profile[]
  getProfileById: (id: string) => Profile | undefined
  updateProfile: (id: string, updates: Partial<Profile>) => void
  deleteProfile: (id: string) => void
  seedProfiles: (profiles: Profile[]) => void
}

export const useProfileStore = create<ProfileStore>()(
  persist(
    (set, get) => ({
      currentUserId: null,
      currentProfile: null,
      allProfiles: [],

      setCurrentUserId: (userId: string) => {
        set({ currentUserId: userId })
      },

      setCurrentProfile: (profile: Profile) => {
        set({ currentProfile: profile })
      },

      clearCurrentProfile: () => {
        set({ currentProfile: null, currentUserId: null })
      },

      createProfile: (profileData) => {
        const newProfile: Profile = {
          ...profileData,
          id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          allProfiles: [...state.allProfiles, newProfile],
          currentUserId: newProfile.id,
          currentProfile: newProfile,
        }))
        return newProfile
      },

      getAllProfiles: () => {
        const { allProfiles, currentUserId } = get()
        // Return all profiles except current user
        return allProfiles.filter((p) => p.id !== currentUserId)
      },

      getProfileById: (id: string) => {
        return get().allProfiles.find((p) => p.id === id)
      },

      updateProfile: (id: string, updates: Partial<Profile>) => {
        set((state) => ({
          allProfiles: state.allProfiles.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
          currentProfile:
            state.currentProfile?.id === id
              ? { ...state.currentProfile, ...updates }
              : state.currentProfile,
        }))
      },

      deleteProfile: (id: string) => {
        set((state) => ({
          allProfiles: state.allProfiles.filter((p) => p.id !== id),
          currentProfile:
            state.currentProfile?.id === id ? null : state.currentProfile,
        }))
      },

      seedProfiles: (profiles: Profile[]) => {
        set((state) => ({
          allProfiles: Array.from(new Map([...state.allProfiles, ...profiles].map((p) => [p.id, p])).values()),
        }))
      },
    }),
    {
      name: 'profile-storage',
    }
  )
)
