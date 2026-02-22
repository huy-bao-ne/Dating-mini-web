import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Like {
  id: string
  fromUserId: string
  toUserId: string
  createdAt: string
}

export interface Match {
  id: string
  userIds: [string, string] // Always a pair
  createdAt: string
  matchedAt: string
}

interface MatchStore {
  likes: Like[]
  matches: Match[]
  addLike: (fromUserId: string, toUserId: string) => Like
  removeLike: (fromUserId: string, toUserId: string) => void
  getLikesFromUser: (userId: string) => Like[]
  getLikesToUser: (userId: string) => Like[]
  checkIfUserLiked: (fromUserId: string, toUserId: string) => boolean
  checkIfMatch: (userId1: string, userId2: string) => boolean
  getMatches: (userId: string) => Match[]
  getMatchPartner: (userId: string, matchId: string) => string | null
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      likes: [],
      matches: [],

      addLike: (fromUserId: string, toUserId: string) => {
        const newLike: Like = {
          id: `like_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          fromUserId,
          toUserId,
          createdAt: new Date().toISOString(),
        }

        set((state) => {
          const updatedState = {
            likes: [...state.likes, newLike],
            matches: [...state.matches],
          }

          // Check if this like creates a mutual match
          const reciprocalLike = state.likes.find(
            (like) => like.fromUserId === toUserId && like.toUserId === fromUserId
          )

          if (reciprocalLike) {
            // Create a match
            const match: Match = {
              id: `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              userIds: [fromUserId, toUserId].sort() as [string, string],
              createdAt: new Date().toISOString(),
              matchedAt: new Date().toISOString(),
            }
            updatedState.matches.push(match)
          }

          return updatedState
        })

        return newLike
      },

      removeLike: (fromUserId: string, toUserId: string) => {
        set((state) => ({
          likes: state.likes.filter(
            (like) => !(like.fromUserId === fromUserId && like.toUserId === toUserId)
          ),
        }))
      },

      getLikesFromUser: (userId: string) => {
        return get().likes.filter((like) => like.fromUserId === userId)
      },

      getLikesToUser: (userId: string) => {
        return get().likes.filter((like) => like.toUserId === userId)
      },

      checkIfUserLiked: (fromUserId: string, toUserId: string) => {
        return get().likes.some(
          (like) => like.fromUserId === fromUserId && like.toUserId === toUserId
        )
      },

      checkIfMatch: (userId1: string, userId2: string) => {
        const sortedIds = [userId1, userId2].sort() as [string, string]
        return get().matches.some(
          (match) =>
            match.userIds[0] === sortedIds[0] && match.userIds[1] === sortedIds[1]
        )
      },

      getMatches: (userId: string) => {
        return get().matches.filter((match) => match.userIds.includes(userId))
      },

      getMatchPartner: (userId: string, matchId: string) => {
        const match = get().matches.find((m) => m.id === matchId)
        if (!match || !match.userIds.includes(userId)) return null
        return match.userIds.find((id) => id !== userId) || null
      },
    }),
    {
      name: 'match-storage',
    }
  )
)
