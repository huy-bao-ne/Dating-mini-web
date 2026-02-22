'use client'

import Link from 'next/link'
import { useProfileStore } from '@/stores/profileStore'
import { Heart, Sparkles, Zap } from 'lucide-react'

export function LandingHero() {
  const currentProfile = useProfileStore((state) => state.currentProfile)

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-pink-200 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      <div className="absolute -bottom-32 right-0 w-96 h-96 bg-gradient-to-br from-purple-200 to-transparent rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-100 to-rose-100 text-pink-700 px-4 py-2 rounded-full mb-8 border border-pink-200">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-semibold">💕 Nền tảng hẹn hò thông minh</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight gradient-text mb-6">
            Tìm Kiếm<br />
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-pink-700 bg-clip-text text-transparent">
              Người Đặc Biệt
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Kết nối với những người phù hợp, tìm hiểu qua video call, và xây dựng những mối quan hệ có ý nghĩa.
            Tất cả được xử lý thông minh bằng AI.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {!currentProfile ? (
              <>
                <Link
                  href="/profile/create"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-300 hover:from-rose-600 hover:to-pink-700 hover:shadow-xl hover:shadow-rose-400 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                >
                  <span className="flex items-center gap-2">
                    🚀 Bắt đầu Ngay
                  </span>
                </Link>
                <Link
                  href="/discover"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-rose-600 bg-white border-2 border-rose-200 rounded-xl hover:bg-rose-50 hover:border-rose-400 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
                >
                  <span className="flex items-center gap-2">
                    👀 Khám phá
                  </span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/discover"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-xl shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 transition-all duration-300 transform hover:-translate-y-1"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Khám phá Profile
                  </span>
                </Link>
                <Link
                  href="/profile/edit"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-gray-700 bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300"
                >
                  <span className="flex items-center gap-2">
                    ✏️ Chỉnh sửa Profile
                  </span>
                </Link>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-rose-600">100%</div>
              <p className="text-sm text-gray-600">An toàn & bảo mật</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-600">+50K</div>
              <p className="text-sm text-gray-600">Người dùng hoạt động</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-rose-600">85%</div>
              <p className="text-sm text-gray-600">Tỷ lệ match thành công</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
