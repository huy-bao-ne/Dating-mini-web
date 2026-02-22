'use client'

export function LandingHowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Tạo Tài Khoản',
      description: 'Tạo profile với thông tin cá nhân của bạn - tên, tuổi, giới tính, bio và email.'
    },
    {
      number: '02',
      title: 'Khám Phá & Like',
      description: 'Duyệt các profile khác, thích những người bạn quan tâm. Tự động phát hiện match khi cả hai thích nhau.'
    },
    {
      number: '03',
      title: 'Chọn Khung Giờ',
      description: 'Cả hai chỉ định khung giờ rảnh. Hệ thống tự động tìm slot hẹn trùng nhau.'
    },
    {
      number: '04',
      title: 'Gặp Gỡ',
      description: 'Kết nối qua video call, chat, và xây dựng mối quan hệ có ý nghĩa.'
    }
  ]

  return (
    <section id="how" className="py-20 sm:py-32 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 sm:mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Quy Trình Đơn Giản
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Từ tạo profile đến gặp gỡ trong vài phút
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-20 left-1/2 w-full h-1 bg-gradient-to-r from-rose-200 to-transparent translate-x-1/2"></div>
              )}

              <div className="relative bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white text-2xl font-bold mb-6 shadow-lg shadow-rose-200">
                  {step.number}
                </div>

                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
