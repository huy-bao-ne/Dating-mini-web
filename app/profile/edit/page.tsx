'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/stores/profileStore'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function EditProfilePage() {
  const router = useRouter()
  const currentProfile = useProfileStore((state) => state.currentProfile)
  const updateProfile = useProfileStore((state) => state.updateProfile)

  const [formData, setFormData] = useState({
    name: currentProfile?.name || '',
    age: currentProfile?.age || 20,
    gender: (currentProfile?.gender || 'female') as 'male' | 'female' | 'other',
    bio: currentProfile?.bio || '',
    email: currentProfile?.email || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (!currentProfile) {
      router.push('/profile/create')
    }
  }, [currentProfile, router])

  // Kiem tra form co hop le khong truoc khi submit
  const validateForm = () => {
    // Khoi tao object luu tru loi
    const newErrors: Record<string, string> = {}

    // Kiem tra tung truong
    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống'
    }

    if (formData.age < 18 || formData.age > 100) {
      newErrors.age = 'Tuổi phải từ 18-100'
    }

    if (!formData.email.includes('@')) {
      newErrors.email = 'Email không hợp lệ'
    }

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio không được để trống'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xu ly cap nhat profile
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Kiem tra form truoc khi cap nhat
    if (!validateForm()) return

    try {
      if (currentProfile) {
        // Update profile trong Zustand store
        updateProfile(currentProfile.id, {
          name: formData.name,
          age: formData.age,
          gender: formData.gender,
          bio: formData.bio,
          email: formData.email,
        })

        // Hien thi success message va chuyen trang
        setSuccessMessage('✓ Profile đã được cập nhật thành công!')
        setTimeout(() => {
          router.push('/discover')
        }, 2000)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value,
    }))
    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  if (!currentProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-rose-100 p-4">
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Chỉnh sửa Profile</h1>

          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">Tên</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-1">Tuổi</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                min="18"
                max="100"
              />
              {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-1">Giới tính</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="female">Nữ</option>
                <option value="male">Nam</option>
                <option value="other">Khác</option>
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium mb-1">Giới thiệu bản thân</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 h-24"
              />
              {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Cập nhật
              </button>
              <Link
                href="/discover"
                className="flex-1 text-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Hủy
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
