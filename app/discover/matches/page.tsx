'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/stores/profileStore'
import { useMatchStore } from '@/stores/matchStore'
import Link from 'next/link'
import { ArrowLeftIcon, SparklesIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import LikedByMe from '@/components/discover/LikedByMe'
import LikedYou from '@/components/discover/Matches'
import MatchesPerfect from '@/components/discover/MatchesPerfect'

export default function MatchesPage() {
  const currentUserId = useProfileStore((state) => state.currentUserId)
  const getAllProfiles = useProfileStore((state) => state.getAllProfiles)
  const checkIfUserLiked = useMatchStore((state) => state.checkIfUserLiked)
  const addLike = useMatchStore((state) => state.addLike)
  const removeLike = useMatchStore((state) => state.removeLike)

  const [likedByMe, setLikedByMe] = useState<any[]>([])
  const [likedYou, setLikedYou] = useState<any[]>([])
  const [perfectMatches, setPerfectMatches] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'liked-me' | 'liked-you' | 'matches'>('liked-me')
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleMatchCreated = () => {
    setActiveTab('matches')
    setRefreshTrigger(prev => prev + 1)
  }

  useEffect(() => {
    if (!currentUserId) return

    const allProfiles = getAllProfiles()

    // Filter I liked
    const myLikes = allProfiles.filter((p) => 
      p.id !== currentUserId && checkIfUserLiked(currentUserId, p.id)
    )

    // Filter those who like me
    const peopleWhoLikeMe = allProfiles.filter((p) => 
      p.id !== currentUserId && checkIfUserLiked(p.id, currentUserId)
    )

    // Perfect matches (mutual)
    const perfectMatchList = myLikes.filter((p) => 
      checkIfUserLiked(p.id, currentUserId)
    )

    // "Được thích" - only show those who like me but I haven't liked back
    const oneWayLikesFromThem = peopleWhoLikeMe.filter((p) => 
      !checkIfUserLiked(currentUserId, p.id)
    )

    // "Thích" - only show those I like but they haven't liked back
    const myOneWayLikes = myLikes.filter((p) => 
      !checkIfUserLiked(p.id, currentUserId)
    )

    setLikedByMe(myOneWayLikes)
    setLikedYou(oneWayLikesFromThem)
    setPerfectMatches(perfectMatchList)
  }, [currentUserId, getAllProfiles, checkIfUserLiked, refreshTrigger])

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <SparklesIcon className="h-16 w-16 text-rose-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Vui lòng tạo profile trước
          </h1>
          <p className="text-gray-600 mb-6">Đăng ký để bắt đầu tìm kiếm những người đặc biệt</p>
          <Link
            href="/profile/create"
            className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Tạo Profile
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/discover"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="font-medium">Quay lại</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
                <SparklesIcon className="h-6 w-6 text-rose-600" />
                <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Lịch sử
                </span>
              </h1>
            </div>
            <div className="w-20" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('liked-me')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'liked-me'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-rose-300'
              }`}
            >
              ❤️ Được thích ({likedYou.length})
            </button>
            <button
              onClick={() => setActiveTab('liked-you')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'liked-you'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-rose-300'
              }`}
            >
              💕 Thích ({likedByMe.length})
            </button>
            <button
              onClick={() => setActiveTab('matches')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'matches'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-green-300'
              }`}
            >
              🎉 Matches ({perfectMatches.length})
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'liked-me' && (
          <LikedYou
            profiles={likedYou}
            currentUserId={currentUserId}
            onLike={(profileId) => addLike(currentUserId, profileId)}
            checkIfUserLiked={checkIfUserLiked}
            onMatchCreated={handleMatchCreated}
          />
        )}

        {activeTab === 'liked-you' && (
          <LikedByMe
            profiles={likedByMe}
            currentUserId={currentUserId}
            onUnlike={(profileId) => removeLike(currentUserId, profileId)}
            checkIfUserLiked={checkIfUserLiked}
            onMatchCreated={handleMatchCreated}
            onUnliked={() => setRefreshTrigger(prev => prev + 1)}
          />
        )}

        {activeTab === 'matches' && (
          <MatchesPerfect profiles={perfectMatches} currentUserId={currentUserId} />
        )}
      </div>
    </div>
  )
}
