'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 text-white">
                <Heart className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white">LoveMatch</span>
            </div>
            <p className="text-sm text-gray-400">
              Nền tảng hẹn hò thông minh giúp bạn tìm kiếm người đặc biệt.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Sản phẩm</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/discover" className="text-gray-400 hover:text-white transition">
                  Khám phá
                </Link>
              </li>
              <li>
                <Link href="/profile/create" className="text-gray-400 hover:text-white transition">
                  Tạo Profile
                </Link>
              </li>
              <li>
                <Link href="/profile/edit" className="text-gray-400 hover:text-white transition">
                  Cài đặt
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Công ty</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Tin tức
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Tuyển dụng
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Pháp lý</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-gray-400">
              © {currentYear} LoveMatch. Tất cả quyền được bảo lưu.
            </p>

            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition text-lg">
                f
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-lg">
                𝕏
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition text-lg">
                in
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-8 sm:pt-12 border-t border-gray-800 bg-gradient-to-r from-rose-500/10 to-pink-500/10 rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">
            Tìm người thích hợp ngay hôm nay
          </h3>
          <p className="text-gray-400 mb-6">
            Miễn phí, an toàn, và dễ sử dụng
          </p>
          <Link
            href="/profile/create"
            className="inline-block px-8 py-3 text-white bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg hover:shadow-lg transition-shadow font-semibold"
          >
            Bắt đầu Ngay
          </Link>
        </div>
      </div>
    </footer>
  )
}
