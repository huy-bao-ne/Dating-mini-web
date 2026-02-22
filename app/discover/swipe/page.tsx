'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useProfileStore } from '@/stores/profileStore'
import { useMatchStore } from '@/stores/matchStore'
import Link from 'next/link'
import {
  HeartIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowLeftIcon,
} from '@heroicons/react/24/outline'

export default function SwiperPage() {
  const currentUserId = useProfileStore((state) => state.currentUserId)
  const getAllProfiles = useProfileStore((state) => state.getAllProfiles)
  const addLike = useMatchStore((state) => state.addLike)
  const removeLike = useMatchStore((state) => state.removeLike)
  const checkIfUserLiked = useMatchStore((state) => state.checkIfUserLiked)

  const [profiles, setProfiles] = useState<any[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)

  useEffect(() => {
    const allProfiles = getAllProfiles().filter((p) => p.id !== currentUserId)
    setProfiles(allProfiles)
  }, [currentUserId, getAllProfiles])

  const currentProfile = profiles[currentIndex]

  const handleLike = () => {
    if (isAnimating || !currentUserId) return
    setIsAnimating(true)
    setAnimationDirection('right')

    setTimeout(() => {
      if (currentProfile) {
        addLike(currentUserId, currentProfile.id)
      }
      nextCard()
    }, 300)
  }

  const handlePass = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setAnimationDirection('left')

    setTimeout(() => {
      nextCard()
    }, 300)
  }

  const nextCard = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsAnimating(false)
      setAnimationDirection(null)
    } else {
      setAnimationDirection(null)
    }
  }

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

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4">
        <div className="text-center max-w-md">
          <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không có profile nào</h2>
          <p className="text-gray-600 mb-6">Hãy hoàn thiện profile hoặc quay lại sau</p>
          <Link
            href="/profile/edit"
            className="inline-block bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Chỉnh sửa Profile
          </Link>
        </div>
      </div>
    )
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4">
        <div className="text-center max-w-md">
          <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Hết profile rồi!</h2>
          <p className="text-gray-600 mb-6">Bạn đã xem hết tất cả profile. Quay lại sau nhé!</p>
          <Link
            href="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Về Trang Chủ
          </Link>
        </div>
      </div>
    )
  }

  const isLiked = checkIfUserLiked(currentUserId, currentProfile.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-pink-50 p-4 flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto w-full flex items-center justify-between mb-8 mt-4"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span className="font-medium">Quay lại</span>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <SparklesIcon className="h-6 w-6 text-rose-600" />
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Khám Phá
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {currentIndex + 1} / {profiles.length}
          </p>
        </div>
        <Link
          href="/discover/browse"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-rose-300 hover:bg-rose-50 transition text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <span>Duyệt</span>
        </Link>
      </motion.div>

      {/* Card Stack */}
      <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto w-full mb-8">
        <motion.div
          key={currentProfile.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            x: isAnimating ? (animationDirection === 'right' ? 300 : -300) : 0,
            rotate: isAnimating ? (animationDirection === 'right' ? 15 : -15) : 0,
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Cover Photo */}
            <div className="h-64 sm:h-80 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-600 relative">
              <div className="absolute inset-0 opacity-40" />
            </div>

            {/* Profile Content */}
            <div className="relative px-6 sm:px-8 pb-6 sm:pb-8">
              {/* Avatar - Overlap */}
              <div className="flex items-end gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="-mt-20"
                >
                  <div className="w-32 h-32 rounded-3xl border-4 border-white bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {currentProfile.name.charAt(0).toUpperCase()}
                  </div>
                </motion.div>
                {isLiked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mb-4"
                  >
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      ❤️ Thích rồi
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Name & Age */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentProfile.name}, <span className="text-rose-600">{currentProfile.age}</span>
                </h2>
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-500 text-sm mt-1">📧 {currentProfile.email}</p>
              </motion.div>

              {/* Bio */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {currentProfile.bio || 'No bio provided'}
                </p>
              </motion.div>

              {/* Gender Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mt-4 flex gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                    currentProfile.gender === 'Male' 
                      ? 'bg-blue-500' 
                      : currentProfile.gender === 'Female'
                      ? 'bg-pink-500'
                      : 'bg-purple-500'
                  }`}>
                    {currentProfile.gender === 'Male' ? '👨 Nam' : currentProfile.gender === 'Female' ? '👩 Nữ' : '✨ Khác'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-2xl mx-auto w-full flex gap-4 justify-center mb-8"
      >
        <button
          onClick={handlePass}
          disabled={isAnimating}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-600 rounded-2xl hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg"
        >
          <XMarkIcon className="h-6 w-6" />
          Không
        </button>
        <button
          onClick={handleLike}
          disabled={isAnimating}
          className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg"
        >
          <HeartIcon className="h-6 w-6" />
          Thích
        </button>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-2xl mx-auto w-full mb-4"
      >
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-rose-500 to-pink-600"
            transition={{ duration: 0.3 }}
          />
        </div>
      </motion.div>
    </div>
  )
}
