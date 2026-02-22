'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProfileStore } from '@/stores/profileStore'
import { useMatchStore } from '@/stores/matchStore'
import { mockProfiles } from '@/lib/mockData'
import Link from 'next/link'
import {
  HeartIcon,
  XMarkIcon,
  SparklesIcon,
  ArrowLeftIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

export default function SwiperPage() {
  const currentUserId = useProfileStore((state) => state.currentUserId)
  const getAllProfiles = useProfileStore((state) => state.getAllProfiles)
  const seedProfiles = useProfileStore((state) => state.seedProfiles)
  const addLike = useMatchStore((state) => state.addLike)
  const removeLike = useMatchStore((state) => state.removeLike)
  const checkIfUserLiked = useMatchStore((state) => state.checkIfUserLiked)

  const [profiles, setProfiles] = useState<any[]>([])
  // Theo doi profile hien tai dang xem
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  // Ensure mock profiles are loaded
  useEffect(() => {
    // Force clear old data and reload fresh mock profiles
    const stored = localStorage.getItem('profile-storage')
    let allProfiles = getAllProfiles()
    
    // If stored data is very old or doesn't have enough profiles, reset
    if (!stored || allProfiles.length < 100) {
      seedProfiles(mockProfiles)
      allProfiles = mockProfiles
    }
    
    setProfiles(allProfiles.filter((p) => p.id !== currentUserId))
  }, [currentUserId, seedProfiles, getAllProfiles])

  const currentProfile = profiles[currentIndex]

  // Xu ly like profile - swiped phai
  const handleLike = () => {
    // Neu dang animation hoac chua co user thi ko lam gi
    if (isAnimating || !currentUserId) return
    setIsAnimating(true)
    setAnimationDirection('right')

    // Them vao danh sach like sau animation
    setTimeout(() => {
      if (currentProfile) {
        addLike(currentUserId, currentProfile.id)
      }
      nextCard()
    }, 300)
  }

  // Xu ly pass profile - swiped trai
  const handlePass = () => {
    // Neu dang animation thi ko lam gi
    if (isAnimating) return
    setIsAnimating(true)
    setAnimationDirection('left')

    // Chuyen sang card tiep theo sau animation
    setTimeout(() => {
      nextCard()
    }, 300)
  }

  // Chuyen sang profile tiep theo
  const nextCard = () => {
    // Neu con profile khac thi se sang, sau do reset animation flag
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
        </div>
        <div className="flex gap-2">
          <Link
            href="/discover/matches"
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border border-green-600 rounded-lg hover:from-green-600 hover:to-emerald-700 transition text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>Lịch sử</span>
          </Link>
        </div>
      </motion.div>

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
            <div className="h-64 sm:h-80 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-600 relative">
              <div className="absolute inset-0 opacity-40" />
            </div>

            <div className="relative px-6 sm:px-8 pb-6 sm:pb-8">
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

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentProfile.name}, <span className="text-rose-600">{currentProfile.age}</span>
                </h2>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-500 text-sm mt-1">📧 {currentProfile.email}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-gray-600 mt-4 leading-relaxed">
                  {currentProfile.bio || 'No bio provided'}
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="mt-4 flex gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                    currentProfile.gender === 'male' 
                      ? 'bg-blue-500' 
                      : currentProfile.gender === 'female'
                      ? 'bg-pink-500'
                      : 'bg-purple-500'
                  }`}>
                    {currentProfile.gender === 'male' ? '👨 Nam' : currentProfile.gender === 'female' ? '👩 Nữ' : '✨ Khác'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

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
          onClick={() => setShowDetailModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-purple-300 text-purple-600 rounded-2xl hover:border-purple-500 hover:bg-purple-50 transition-all font-bold text-lg"
        >
          <InformationCircleIcon className="h-6 w-6" />
          Chi tiết
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

      <AnimatePresence>
        {showDetailModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetailModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-br from-rose-400 via-pink-400 to-rose-600 p-6 rounded-t-3xl">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Chi tiết Profile</h2>
                  <button
                    onClick={() => setShowDetailModal(false)}
                    className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition"
                  >
                    <XMarkIcon className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
                    {currentProfile.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900">
                      {currentProfile.name}, <span className="text-rose-600">{currentProfile.age}</span>
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">📧 {currentProfile.email}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className={`px-4 py-2 rounded-full text-sm font-semibold text-white ${
                    currentProfile.gender === 'male' 
                      ? 'bg-blue-500' 
                      : currentProfile.gender === 'female'
                      ? 'bg-pink-500'
                      : 'bg-purple-500'
                  }`}>
                    {currentProfile.gender === 'male' ? '👨 Nam' : currentProfile.gender === 'female' ? '👩 Nữ' : '✨ Khác'}
                  </span>
                  {isLiked && (
                    <span className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-red-500 to-pink-500 text-white">
                      ❤️ Đã thích
                    </span>
                  )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">📝 Giới thiệu</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {currentProfile.bio || 'Chưa có giới thiệu'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {currentProfile.height && (
                    <div className="bg-blue-50 rounded-2xl p-4">
                      <div className="text-2xl mb-1">📏</div>
                      <div className="text-xs text-gray-600">Chiều cao</div>
                      <div className="text-lg font-bold text-gray-900">{currentProfile.height} cm</div>
                    </div>
                  )}
                  {currentProfile.city && (
                    <div className="bg-green-50 rounded-2xl p-4">
                      <div className="text-2xl mb-1">📍</div>
                      <div className="text-xs text-gray-600">Thành phố</div>
                      <div className="text-lg font-bold text-gray-900">{currentProfile.city}</div>
                    </div>
                  )}
                  {currentProfile.job && (
                    <div className="bg-purple-50 rounded-2xl p-4">
                      <div className="text-2xl mb-1">💼</div>
                      <div className="text-xs text-gray-600">Nghề nghiệp</div>
                      <div className="text-lg font-bold text-gray-900">{currentProfile.job}</div>
                    </div>
                  )}
                  {currentProfile.education && (
                    <div className="bg-yellow-50 rounded-2xl p-4">
                      <div className="text-2xl mb-1">🎓</div>
                      <div className="text-xs text-gray-600">Học vấn</div>
                      <div className="text-lg font-bold text-gray-900">{currentProfile.education}</div>
                    </div>
                  )}
                </div>

                {currentProfile.hobbies && currentProfile.hobbies.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">🎯 Sở thích</h4>
                    <div className="flex flex-wrap gap-2">
                      {(currentProfile.hobbies as string[]).map((hobby: string) => (
                        <span key={hobby} className="px-4 py-2 bg-rose-100 text-rose-700 rounded-full text-sm font-medium">
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {currentProfile.languages && currentProfile.languages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">🗣️ Ngôn ngữ</h4>
                    <div className="flex flex-wrap gap-2">
                      {(currentProfile.languages as string[]).map((language: string) => (
                        <span key={language} className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      handlePass()
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-600 rounded-xl hover:border-red-400 hover:text-red-600 hover:bg-red-50 transition-all font-bold"
                  >
                    <XMarkIcon className="h-5 w-5" />
                    Không
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailModal(false)
                      handleLike()
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-xl transition-all font-bold shadow-lg"
                  >
                    <HeartIcon className="h-5 w-5" />
                    Thích
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
