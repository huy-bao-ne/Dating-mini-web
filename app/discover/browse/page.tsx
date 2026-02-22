'use client'

import { useState, useEffect, useRef } from 'react'
import { useProfileStore } from '@/stores/profileStore'
import { useMatchStore } from '@/stores/matchStore'
import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import LikedByMe from '@/components/discover/LikedByMe'
import LikedYou from '@/components/discover/Matches'
import MatchesPerfect from '@/components/discover/MatchesPerfect'
import Messages from '@/components/discover/Messages'

export default function DiscoverBrowsePage() {
  const currentUserId = useProfileStore((state) => state.currentUserId)
  const getAllProfiles = useProfileStore((state) => state.getAllProfiles)
  const checkIfUserLiked = useMatchStore((state) => state.checkIfUserLiked)
  const addLike = useMatchStore((state) => state.addLike)
  const removeLike = useMatchStore((state) => state.removeLike)
  const mockDataInitialized = useRef(false)

  const [activeTab, setActiveTab] = useState<'liked-me' | 'liked-you' | 'matches' | 'messages'>('liked-you')
  const [likedByMe, setLikedByMe] = useState<any[]>([])
  const [likedYou, setLikedYou] = useState<any[]>([])
  const [perfectMatches, setPerfectMatches] = useState<any[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [conversations, setConversations] = useState<Record<string, any>>({})
  const [selectedMessageProfile, setSelectedMessageProfile] = useState<string | null>(null)

  // Xu ly khi match duoc tao - chuyen sang tab matches va cap nhat
  const handleMatchCreated = () => {
    setActiveTab('matches')
    // Trigger lai tinh toan danh sach cac profile
    setRefreshTrigger(prev => prev + 1)
  }

  // Luu tru cuoc tro chuyen moi vao state conversations
  const handleSaveConversation = (profileId: string, profileName: string, messages: any[]) => {
    setConversations(prev => ({
      ...prev,
      [profileId]: {
        profileId,
        profileName,
        messages: messages,
        lastMessage: messages.length > 0 ? messages[messages.length - 1].text : '',
        lastMessageTime: new Date()
      }
    }))
  }

  // Xu ly tin nhan chat - them vao danh sach va gia lap phan hoi
  const handleSendChatMessage = (profileId: string, text: string) => {
    // Them tin nhan cua user vao cuoc tro chuyen
    setConversations(prev => {
      const conv = prev[profileId]
      if (!conv) return prev
      
      return {
        ...prev,
        [profileId]: {
          ...conv,
          messages: [...conv.messages, { sender: 'user', text, timestamp: new Date() }],
          lastMessage: text,
          lastMessageTime: new Date()
        }
      }
    })

    // Gia lap phan hoi tu doi phuong sau 1.5s
    setTimeout(() => {
      const responses = [
        '😊 Vâng, tôi cũng mong được gặp bạn!',
        '🎉 Hôm đó tôi rảnh, chúng ta gặp nhé!',
        '💪 Ok bạn, hẹn gặp lúc đó!',
        '👋 Tạm biệt, bạn cẩn thận trên đường nhé!',
        '✅ Được, hẹn gặp!'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setConversations(prev => {
        const conv = prev[profileId]
        if (!conv) return prev
        
        return {
          ...prev,
          [profileId]: {
            ...conv,
            messages: [...conv.messages, { sender: 'opponent', text: randomResponse, timestamp: new Date() }],
            lastMessage: randomResponse,
            lastMessageTime: new Date()
          }
        }
      })
    }, 800)
  }

  const handleNavigateToMessages = (profileId: string, profileName: string) => {
    setSelectedMessageProfile(profileId)
    setActiveTab('messages')
  }

  // Khoi tao du lieu test
  useEffect(() => {
    if (mockDataInitialized.current || !currentUserId) return
    
    const state = useProfileStore.getState()
    const allProfilesInStore = state.allProfiles
    
    if (allProfilesInStore.length > 3) {
      const mockLikes = useMatchStore.getState().likes
      if (mockLikes.length === 0) {
        mockDataInitialized.current = true
        const otherProfiles = allProfilesInStore.filter(p => p.id !== currentUserId)
        
        if (otherProfiles[0]) addLike(otherProfiles[0].id, currentUserId)
        if (otherProfiles[1]) addLike(otherProfiles[1].id, currentUserId)
        if (otherProfiles[2]) addLike(currentUserId, otherProfiles[2].id)
        if (otherProfiles[0]) addLike(currentUserId, otherProfiles[0].id)
      }
    }
  }, [currentUserId, addLike])

  // Tinh toan va phan loai cac profile
  useEffect(() => {
    const allProfiles = getAllProfiles()

    if (currentUserId) {
      const myLikes = allProfiles.filter((p) => 
        p.id !== currentUserId && checkIfUserLiked(currentUserId, p.id)
      )

      const peopleWhoLikeMe = allProfiles.filter((p) => 
        p.id !== currentUserId && checkIfUserLiked(p.id, currentUserId)
      )

      // Nhung nguoi thich ca hai phia (match)
      const perfectMatchList = myLikes.filter((p) => 
        checkIfUserLiked(p.id, currentUserId)
      )

      // "Duoc thich" - nhung nguoi thich toi ma toi chua thich lai
      const oneWayLikesFromThem = peopleWhoLikeMe.filter((p) => 
        !checkIfUserLiked(currentUserId, p.id)
      )

      // "Thich" - nhung nguoi toi thich ma ho chua thich lai
      const myOneWayLikes = myLikes.filter((p) => 
        !checkIfUserLiked(p.id, currentUserId)
      )

      setLikedByMe(myOneWayLikes)
      setLikedYou(oneWayLikesFromThem)
      setPerfectMatches(perfectMatchList)
    }
  }, [currentUserId, getAllProfiles, checkIfUserLiked, refreshTrigger])

  if (!currentUserId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md">
          <HeartIcon className="h-16 w-16 text-rose-600 mx-auto mb-4" />
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
              <span className="font-medium">← Quay lại Swipe</span>
            </Link>
            <div className="text-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                Lịch sử
              </h1>
              <p className="text-xs text-gray-500 mt-1">Các profile bạn tương tác</p>
            </div>
            <div className="w-32" />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setActiveTab('liked-you')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'liked-you'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-rose-300'
              }`}
            >
              ❤️ Được thích ({likedYou.length})
            </button>
            <button
              onClick={() => setActiveTab('liked-me')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'liked-me'
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
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition ${
                activeTab === 'messages'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-blue-300'
              }`}
            >
              💬 Tin nhắn ({Object.keys(conversations).length})
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {activeTab === 'liked-you' && (
          <LikedYou
            profiles={likedYou}
            currentUserId={currentUserId}
            onLike={(profileId) => addLike(currentUserId, profileId)}
            checkIfUserLiked={checkIfUserLiked}
            onMatchCreated={handleMatchCreated}
          />
        )}

        {activeTab === 'liked-me' && (
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
          <MatchesPerfect 
            profiles={perfectMatches} 
            currentUserId={currentUserId}
            onSaveConversation={handleSaveConversation}
            onNavigateToMessages={handleNavigateToMessages}
          />
        )}

        {activeTab === 'messages' && (
          <Messages 
            conversations={conversations}
            onSendMessage={handleSendChatMessage}
            initialSelectedProfile={selectedMessageProfile}
          />
        )}
      </div>
    </div>
  )
}
