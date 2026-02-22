'use client'

import Link from 'next/link'
import { useProfileStore } from '@/stores/profileStore'
import { Heart, LogOut } from 'lucide-react'

export function LandingHeader() {
  const currentProfile = useProfileStore((state) => state.currentProfile)
  const clearCurrentProfile = useProfileStore((state) => state.clearCurrentProfile)

  const handleLogout = () => {
    clearCurrentProfile()
  }

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
            <Heart className="w-6 h-6" />
          </div>
          <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent hidden sm:inline">
            LoveMatch
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-rose-600 font-medium transition scroll-smooth">
            Tính năng
          </a>
          <a href="#how" className="text-gray-600 hover:text-rose-600 font-medium transition scroll-smooth">
            Cách hoạt động
          </a>
          <a href="#cta" className="text-gray-600 hover:text-rose-600 font-medium transition scroll-smooth">
            Liên hệ
          </a>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {currentProfile ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:inline">
                👋 {currentProfile.name}
              </span>
              <Link
                href="/discover"
                className="px-4 py-2 sm:px-6 sm:py-2.5 text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg hover:shadow-lg transition-shadow text-sm sm:text-base font-semibold"
              >
                Khám phá
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Đăng xuất"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:block px-6 py-2.5 text-gray-700 hover:text-gray-900 font-semibold"
              >
                Đăng nhập
              </Link>
              <Link
                href="/profile/create"
                className="px-4 py-2 sm:px-6 sm:py-2.5 text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg hover:shadow-lg transition-shadow text-sm sm:text-base font-semibold"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
