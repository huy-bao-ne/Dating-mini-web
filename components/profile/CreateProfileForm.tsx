'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useProfileStore } from '@/stores/profileStore'
import { useRouter } from 'next/navigation'
import { UserIcon, EnvelopeIcon, HeartIcon, ShieldCheckIcon, CheckCircleIcon, MapPinIcon, BriefcaseIcon, AcademicCapIcon, LanguageIcon, SparklesIcon } from '@heroicons/react/24/outline'

const cities = ['Hà Nội', 'TP Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ', 'Nha Trang', 'Huế', 'Quảng Ninh', 'Hạ Long', 'Vinh']
const jobs = ['Software Engineer', 'Designer', 'Marketing Manager', 'Teacher', 'Doctor', 'Photographer', 'Accountant', 'Nurse', 'Freelancer', 'Business Owner', 'Student', 'Architect']
const hobbies = ['Du lịch', 'Chơi game', 'Đọc sách', 'Nấu ăn', 'Tập gym', 'Chơi nhạc', 'Chụp ảnh', 'Chơi thể thao', 'Xem phim', 'Vẽ tranh', 'Viết blog']
const languages = ['Tiếng Việt', 'Tiếng Anh', 'Tiếng Trung', 'Tiếng Hàn', 'Tiếng Tây Ban Nha', 'Tiếng Nhật', 'Tiếng Pháp']
const educationLevels = ['Cấp 3', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ']

export function CreateProfileForm() {
  const router = useRouter()
  const createProfile = useProfileStore((state) => state.createProfile)
  const currentProfile = useProfileStore((state) => state.currentProfile)

  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    age: currentProfile?.age || 20,
    gender: (currentProfile?.gender || 'female') as 'male' | 'female' | 'other',
    bio: currentProfile?.bio || '',
    email: currentProfile?.email || '',
    password: currentProfile?.password || '',
    passwordConfirm: '',
    height: currentProfile?.height || 165,
    city: currentProfile?.city || 'Hà Nội',
    customCity: '',
    job: currentProfile?.job || 'Student',
    customJob: '',
    hobbies: currentProfile?.hobbies || [],
    customHobby: '',
    languages: currentProfile?.languages || ['Tiếng Việt'],
    customLanguage: '',
    education: currentProfile?.education || 'Đại học',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)

  // =====KIE M TRA FORM CO HOP LE KHONG=====
  const validateForm = () => {
    // Khoi tao object luu tru loi
    const newErrors: Record<string, string> = {}
    // Kiem tra tung truong
    if (!formData.name.trim()) newErrors.name = 'Tên không được để trống'
    if (formData.age < 18 || formData.age > 100) newErrors.age = 'Tuổi phải từ 18-100'
    if (!formData.email.includes('@')) newErrors.email = 'Email không hợp lệ'
    if (!formData.bio.trim()) newErrors.bio = 'Bio không được để trống'
    if (formData.password.length < 6) newErrors.password = 'Mật khẩu phải ít nhất 6 ký tự'
    if (formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = 'Mật khẩu xác nhận không khớp'
    if (formData.height < 140 || formData.height > 220) newErrors.height = 'Chiều cao phải từ 140-220cm'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xu ly submit form va tao profile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Kiem tra form truoc khi gui
    if (!validateForm()) return
    setIsLoading(true)
    try {
      // Tao profile moi su dung Zustand store
      createProfile({
        name: formData.name,
        age: formData.age,
        gender: formData.gender,
        bio: formData.bio,
        email: formData.email,
        password: formData.password,
        height: formData.height,
        city: formData.customCity || formData.city,
        job: formData.customJob || formData.job,
        hobbies: formData.hobbies,
        languages: formData.languages,
        education: formData.education,
      })
      // Chuyen sang trang discover sau khi tao xong
      router.push('/discover')
    } catch (error) {
      console.error('Error creating profile:', error)
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : 0) : value,
    }))

    // Real-time validation for all fields
    const newErrors = { ...errors }
    
    if (name === 'name' && value.trim() === '') {
      newErrors.name = 'Tên không được để trống'
    } else if (name === 'name') {
      delete newErrors.name
    }
    
    if (name === 'email') {
      if (value && !value.includes('@')) {
        newErrors.email = 'Email không hợp lệ'
      } else if (value === '') {
        newErrors.email = 'Email không được để trống'
      } else {
        delete newErrors.email
      }
    }
    
    if (name === 'bio' && value.trim() === '') {
      newErrors.bio = 'Bio không được để trống'
    } else if (name === 'bio') {
      delete newErrors.bio
    }
    
    if (name === 'age') {
      const numValue = value ? parseInt(value) : 0
      if (numValue < 18 || numValue > 100) {
        newErrors.age = 'Tuổi phải từ 18-100'
      } else {
        delete newErrors.age
      }
    }
    
    if (name === 'height') {
      const numValue = value ? parseInt(value) : 0
      if (numValue < 140 || numValue > 220) {
        newErrors.height = 'Chiều cao phải từ 140-220cm'
      } else {
        delete newErrors.height
      }
    }
    
    if (name === 'password') {
      if (value.length < 6 && value.length > 0) {
        newErrors.password = 'Mật khẩu phải ít nhất 6 ký tự'
      } else {
        delete newErrors.password
      }
      // Also check password match
      if (formData.passwordConfirm && value !== formData.passwordConfirm) {
        newErrors.passwordConfirm = 'Mật khẩu xác nhân không khớp'
      } else if (formData.passwordConfirm && value === formData.passwordConfirm) {
        delete newErrors.passwordConfirm
      }
    }
    
    if (name === 'passwordConfirm') {
      if (value !== formData.password && value.length > 0) {
        newErrors.passwordConfirm = 'Mật khẩu xác nhân không khớp'
      } else {
        delete newErrors.passwordConfirm
      }
    }
    
    setErrors(newErrors)
  }

  const toggleHobby = (hobby: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.includes(hobby) ? prev.hobbies.filter((h) => h !== hobby) : [...prev.hobbies, hobby],
    }))
  }

  const toggleLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.includes(language) ? prev.languages.filter((l) => l !== language) : [...prev.languages, language],
    }))
  }

  const addCustomHobby = () => {
    if (formData.customHobby.trim() && !formData.hobbies.includes(formData.customHobby)) {
      setFormData((prev) => ({
        ...prev,
        hobbies: [...prev.hobbies, prev.customHobby.trim()],
        customHobby: '',
      }))
    }
  }

  const addCustomLanguage = () => {
    if (formData.customLanguage.trim() && !formData.languages.includes(formData.customLanguage)) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, prev.customLanguage.trim()],
        customLanguage: '',
      }))
    }
  }

  const removeHobby = (hobby: string) => {
    setFormData((prev) => ({
      ...prev,
      hobbies: prev.hobbies.filter((h) => h !== hobby),
    }))
  }

  const removeLanguage = (language: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== language),
    }))
  }

  const stepItems = [
    { number: 1, title: 'Thông tin cơ bản', icon: UserIcon },
    { number: 2, title: 'Chi tiết cá nhân', icon: MapPinIcon },
    { number: 3, title: 'Sở thích & Ngôn ngữ', icon: SparklesIcon },
  ]

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full">
      <div className="text-center mb-12">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }} className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
          <HeartIcon className="h-8 w-8 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-2">Tạo Profile</h1>
        <p className="text-gray-600">Bắt đầu hành trình tìm kiếm người đặc biệt ({step}/3)</p>
      </div>

      <div className="mb-8 flex justify-between items-center max-w-2xl mx-auto px-4">
        {stepItems.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={item.number} className="flex items-center flex-1">
              <motion.div
                className={`flex items-center justify-center w-12 h-12 rounded-full transition ${step >= item.number ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg' : 'bg-gray-200 text-gray-600'}`}
                whileHover={{ scale: 1.05 }}
              >
                {step === item.number ? <Icon className="h-6 w-6" /> : <span className="text-sm font-bold">{item.number}</span>}
              </motion.div>
              {index < stepItems.length - 1 && <div className={`flex-1 h-1 mx-2 ${step > item.number ? 'bg-gradient-to-r from-rose-500 to-pink-600' : 'bg-gray-200'}`} />}
            </div>
          )
        })}
      </div>

      <motion.form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <motion.div
          key="step1"
          initial={{ opacity: 0, x: step === 1 ? -20 : 20 }}
          animate={{ opacity: step === 1 ? 1 : 0, x: step === 1 ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className={step !== 1 ? 'hidden' : ''}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <UserIcon className="h-6 w-6 text-rose-600" />
              Thông tin cơ bản
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-2">Tên của bạn *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-rose-300'}`}
                placeholder="Nhập tên của bạn"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">✗ {errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tuổi *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.age ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-rose-300'}`}
                  min="18"
                  max="100"
                />
                {errors.age && <p className="text-red-500 text-xs mt-1">✗ {errors.age}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Giới tính *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                  <option value="female">Nữ</option>
                  <option value="male">Nam</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold mb-2">
                <EnvelopeIcon className="h-4 w-4 mr-2 text-rose-600" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-rose-300'}`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">✗ {errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Mật khẩu *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ít nhất 6 ký tự"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-rose-300'}`}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">✗ {errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Xác nhận mật khẩu *</label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleChange}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.passwordConfirm ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-rose-300'}`}
                />
                {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">✗ {errors.passwordConfirm}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Giới thiệu bản thân *</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Hãy nói gì đó về bạn... (sở thích, mơ ước, tính cách)"
                className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 h-24 resize-none ${errors.bio ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-rose-300'}`}
              />
              {errors.bio && <p className="text-red-500 text-sm mt-1">✗ {errors.bio}</p>}
            </div>
          </div>
        </motion.div>

        <motion.div
          key="step2"
          initial={{ opacity: 0, x: step === 2 ? -20 : 20 }}
          animate={{ opacity: step === 2 ? 1 : 0, x: step === 2 ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className={step !== 2 ? 'hidden' : ''}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <MapPinIcon className="h-6 w-6 text-rose-600" />
              Chi tiết cá nhân
            </h2>

            <div>
              <label className="flex items-center text-sm font-semibold mb-2">
                📏 Chiều cao (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${errors.height ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-rose-300'}`}
                min="140"
                max="220"
              />
              {errors.height && <p className="text-red-500 text-sm mt-1">✗ {errors.height}</p>}
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-semibold mb-2">
                  <MapPinIcon className="h-4 w-4 mr-2 text-rose-600" />
                  Thành phố
                </label>
                <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-2">
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.customCity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customCity: e.target.value }))}
                  placeholder="Hoặc nhập thành phố khác..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>
              <div>
                <label className="flex items-center text-sm font-semibold mb-2">
                  <BriefcaseIcon className="h-4 w-4 mr-2 text-rose-600" />
                  Công việc
                </label>
                <select name="job" value={formData.job} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 mb-2">
                  {jobs.map((job) => (
                    <option key={job} value={job}>
                      {job}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={formData.customJob}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customJob: e.target.value }))}
                  placeholder="Hoặc nhập công việc khác..."
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center text-sm font-semibold mb-2">
                <AcademicCapIcon className="h-4 w-4 mr-2 text-rose-600" />
                Trình độ học vấn
              </label>
              <select name="education" value={formData.education} onChange={handleChange} className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500">
                {educationLevels.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        <motion.div
          key="step3"
          initial={{ opacity: 0, x: step === 3 ? -20 : 20 }}
          animate={{ opacity: step === 3 ? 1 : 0, x: step === 3 ? 0 : 20 }}
          transition={{ duration: 0.3 }}
          className={step !== 3 ? 'hidden' : ''}
        >
          <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-rose-600" />
              Sở thích & Ngôn ngữ
            </h2>

            <div>
              <label className="block text-sm font-semibold mb-3">🎯 Sở thích</label>
              

              {formData.hobbies.length > 0 && (
                <div className="mb-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Đã chọn ({formData.hobbies.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.hobbies.map((hobby) => (
                      <motion.div
                        key={hobby}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-sm"
                      >
                        <span>{hobby}</span>
                        <button
                          type="button"
                          onClick={() => removeHobby(hobby)}
                          className="text-white hover:text-gray-200 font-bold"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.customHobby}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customHobby: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomHobby()}
                  placeholder="Thêm sở thích khác..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
                <motion.button
                  type="button"
                  onClick={addCustomHobby}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-medium text-sm"
                >
                  + Thêm
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {hobbies.map((hobby) => (
                  <motion.button
                    key={hobby}
                    type="button"
                    onClick={() => toggleHobby(hobby)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                      formData.hobbies.includes(hobby) ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formData.hobbies.includes(hobby) ? '✓' : '+'} {hobby}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-3 flex items-center gap-2">
                <LanguageIcon className="h-4 w-4 text-rose-600" />
                Ngôn ngữ
              </label>

              {formData.languages.length > 0 && (
                <div className="mb-3 p-3 bg-rose-50 rounded-lg border border-rose-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">Đã chọn ({formData.languages.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((language) => (
                      <motion.div
                        key={language}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-sm"
                      >
                        <span>{language}</span>
                        <button
                          type="button"
                          onClick={() => removeLanguage(language)}
                          className="text-white hover:text-gray-200 font-bold"
                        >
                          ✕
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={formData.customLanguage}
                  onChange={(e) => setFormData((prev) => ({ ...prev, customLanguage: e.target.value }))}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomLanguage()}
                  placeholder="Thêm ngôn ngữ khác..."
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
                />
                <motion.button
                  type="button"
                  onClick={addCustomLanguage}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg font-medium text-sm"
                >
                  + Thêm
                </motion.button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {languages.map((language) => (
                  <motion.button
                    key={language}
                    type="button"
                    onClick={() => toggleLanguage(language)}
                    whileTap={{ scale: 0.95 }}
                    className={`px-3 py-2 rounded-lg font-medium transition text-sm ${
                      formData.languages.includes(language) ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {formData.languages.includes(language) ? '✓' : '+'} {language}
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
              <div className="flex items-center mb-3">
                <ShieldCheckIcon className="h-5 w-5 text-rose-600 mr-2" />
                <h3 className="font-semibold text-gray-800">Bảo mật & Riêng tư</h3>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <CheckCircleIcon className="h-4 w-4 text-rose-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Dữ liệu được lưu an toàn trên thiết bị của bạn</span>
                </li>
                <li className="flex items-start">
                  <CheckCircleIcon className="h-4 w-4 text-rose-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span>Không chia sẻ thông tin với bên thứ ba</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4 max-w-2xl mx-auto px-4 mb-8">
          {step > 1 && (
            <motion.button
              type="button"
              onClick={() => setStep(step - 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition"
            >
              ← Quay lại
            </motion.button>
          )}

          {step < 3 ? (
            <motion.button
              type="button"
              onClick={() => setStep(step + 1)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-lg transition"
            >
              Tiếp tục →
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang xử lý...
                </>
              ) : Object.keys(errors).length > 0 ? (
                <>
                  ⚠️ Có lỗi cần sửa
                </>
              ) : (
                <>
                  <HeartIcon className="h-5 w-5" />
                  Bắt đầu tìm kiếm
                </>
              )}
            </motion.button>
          )}
        </div>

        {/* Success Message */}
        {currentProfile && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto px-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg">
            <p className="text-sm font-medium">
              <span className="text-green-700">✓ Chào mừng, <strong>{currentProfile.name}</strong>! 🎉</span>
            </p>
          </motion.div>
        )}
      </motion.form>
    </motion.div>
  )
}
