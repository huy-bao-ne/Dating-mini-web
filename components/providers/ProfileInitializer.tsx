'use client'

import { useEffect, useState } from 'react'
import { useProfileStore } from '@/stores/profileStore'
import { mockProfiles } from '@/lib/mockData'

export function ProfileInitializer() {
  const [isHydrated, setIsHydrated] = useState(false)
  const seedProfiles = useProfileStore((state) => state.seedProfiles)
  const setCurrentUserId = useProfileStore((state) => state.setCurrentUserId)
  const allProfiles = useProfileStore((state) => state.allProfiles)
  const currentUserId = useProfileStore((state) => state.currentUserId)

  useEffect(() => {
    // Wait for Zustand to hydrate first
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated && allProfiles.length === 0) {
      seedProfiles(mockProfiles)
    }
  }, [isHydrated, allProfiles.length, seedProfiles])

  // Auto-set currentUserId to first profile if not set
  useEffect(() => {
    if (isHydrated && allProfiles.length > 0 && !currentUserId) {
      setCurrentUserId(allProfiles[0].id)
    }
  }, [isHydrated, allProfiles.length, currentUserId, setCurrentUserId])

  return null
}
