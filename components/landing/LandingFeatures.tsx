'use client'

import { Heart, Zap, Calendar } from 'lucide-react'

export function LandingFeatures() {
  const features = [
    {
      icon: Heart,
      title: 'Phần A: Tạo Profile',
      description: 'Tạo hồ sơ người xinh đẹp với thông tin cá nhân: Tên, Tuổi, Giới tính, Bio và Email. Dữ liệu được lưu an toàn trên local storage.',
      highlight: '✓ Bắt buộc: Tên, Tuổi, Giới tính, Bio, Email',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Zap,
      title: 'Phần B: Hiển thị & Like',
      description: 'Duyệt qua các profile khác, thích những người bạn quan tâm. Nếu hai người cùng thích nhau, sẽ thấy "It\'s a Match!" ngay lập tức.',
      highlight: '✓ Auto-detect matches khi cả hai thích',
      color: 'from-orange-500 to-rose-500'
    },
    {
      icon: Calendar,
      title: 'Phần C: Đặt Lịch Hẹn',
      description: 'Sau khi match, cả hai chọn khung giờ rảnh trong 3 tuần tới. Hệ thống tự động tìm slot trùng nhau và tạo lịch hẹn.',
      highlight: '✓ AI tự động tìm giờ trùng',
      color: 'from-purple-500 to-pink-500'
    }
  ]

  return (
    <section id="features" className="py-20 sm:py-32 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Cách Thức Hoạt Động
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ba bước đơn giản để tìm được người đặc biệt của bạn
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 border border-gray-200 hover:border-gray-300 shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className={`absolute top-0 left-0 w-20 h-20 bg-gradient-to-br ${feature.color} rounded-full opacity-10 group-hover:opacity-15 transition-opacity duration-300 blur-2xl`}></div>

                <div className={`relative inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} text-white mb-6`}>
                  <Icon className="w-7 h-7" />
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Highlight */}
                <div className="pt-6 border-t border-gray-200">
                  <p className="text-sm font-semibold text-rose-600">
                    {feature.highlight}
                  </p>
                </div>

                {/* Hover Line */}
                <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 w-full"></div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
