'use client'

import { motion } from 'framer-motion'
import { HeartIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface Profile {
  id: string
  name: string
  age: number
  email: string
  bio?: string
  gender?: string
}

interface LikedByMeProps {
  profiles: Profile[]
  currentUserId: string
  onUnlike: (profileId: string) => void
  checkIfUserLiked: (userId: string, targetId: string) => boolean
  onMatchCreated: () => void
  onUnliked?: () => void
}

export default function LikedByMe({ profiles, currentUserId, onUnlike, checkIfUserLiked, onMatchCreated, onUnliked }: LikedByMeProps) {
  if (profiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Chưa thích ai</h3>
        <p className="text-gray-600 mt-1">Hãy bắt đầu tìm kiếm những người bạn thích nhé</p>
      </motion.div>
    )
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-3xl">❤️</span>
          <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            Những người bạn thích ({profiles.length})
          </span>
        </h2>
        <p className="text-gray-600 mt-2">Hồ sơ bạn đã yêu thích</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 border-rose-200"
          >
            <div className="h-24 bg-gradient-to-r from-rose-400 to-pink-500 relative flex items-center justify-center">
              <span className="text-4xl">💗</span>
            </div>

            <div className="relative px-4 pb-4">
              <div className="-mt-8 mb-2">
                <div className="w-16 h-16 rounded-2xl border-4 border-white bg-gradient-to-br from-rose-300 to-pink-400 flex items-center justify-center text-white text-xl font-bold mx-auto shadow-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center">
                {profile.name}, <span className="text-rose-600">{profile.age}</span>
              </h3>
              <p className="text-gray-600 text-sm mt-1 text-center line-clamp-2 min-h-[2.5rem]">{profile.bio}</p>

              <div className="mt-3 flex gap-2">
                <span
                  className={`flex-1 px-3 py-1 rounded-full text-xs font-semibold text-white text-center ${
                    profile.gender === 'male' ? 'bg-blue-500' : profile.gender === 'female' ? 'bg-pink-500' : 'bg-purple-500'
                  }`}
                >
                  {profile.gender === 'male' ? '👨 Nam' : profile.gender === 'female' ? '👩 Nữ' : '✨ Khác'}
                </span>
                <span className="px-3 py-1 bg-rose-500 text-white rounded-full text-xs font-semibold">
                  ♥ Yêu
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onUnlike(profile.id)
                  onUnliked?.()
                }}
                className="w-full mt-4 py-2 bg-white border-2 border-rose-500 text-rose-600 rounded-lg font-semibold hover:bg-rose-50 transition flex items-center justify-center gap-2"
              >
                <XMarkIcon className="h-5 w-5" />
                Bỏ thích
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
