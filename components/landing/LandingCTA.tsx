'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export function LandingCTA() {
  return (
    <section id="cta" className="py-20 sm:py-32 bg-white scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-pink-500 to-purple-600 p-12 sm:p-16 lg:p-20 shadow-2xl shadow-rose-200">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

          <div className="relative text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Sẵn Sàng Tìm Kiếm?
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto mb-10">
              Tham gia hơn 50,000 người dùng đang tìm kiếm người đặc biệt của mình. 
              Bắt đầu ngay hôm nay - hoàn toàn miễn phí!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/profile/create"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-rose-600 bg-white rounded-xl hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 shadow-lg active:translate-y-0"
              >
                Bắt đầu Ngay
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/discover"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-xl hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0"
              >
                Khám phá Profile
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-sm text-white/80 mb-4">Được tin tưởng bởi</p>
              <div className="flex flex-wrap gap-6 justify-center items-center">
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">🔒</span>
                  <span className="font-semibold">100% An toàn</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">⚡</span>
                  <span className="font-semibold">Nhanh & Dễ dàng</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <span className="text-2xl">💯</span>
                  <span className="font-semibold">Xác Minh</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
