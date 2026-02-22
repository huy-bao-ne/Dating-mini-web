'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/stores/profileStore'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { EnvelopeIcon, ExclamationCircleIcon, ArrowLeftIcon, CheckCircleIcon, LockClosedIcon } from '@heroicons/react/24/outline'

export default function LoginPage() {
  const router = useRouter()
  const { allProfiles, setCurrentProfile } = useProfileStore()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Xu ly thay doi email va check validation real-time
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setEmail(value)
    setError('')
    
    // Kiem tra email co @ khong
    if (value && !value.includes('@')) {
      setEmailError('Email không hợp lệ')
    } else {
      setEmailError('')
    }
  }

  // Xu ly thay doi password va check validation real-time
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPassword(value)
    setError('')
    
    // Kiem tra password co du 6 ky tu khong
    if (value.length < 6 && value.length > 0) {
      setPasswordError('Mật khẩu phải ít nhất 6 ký tự')
    } else {
      setPasswordError('')
    }
  }

  // Xu ly dang nhap - kiem tra email va password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Tim profile voi email trung khop
      const foundProfile = allProfiles.find(
        (p) => p.email.toLowerCase() === email.toLowerCase()
      )

      if (!foundProfile) {
        setError('Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại hoặc đăng ký tài khoản mới.')
        setIsLoading(false)
        return
      }

      // Kiem tra password co khop khong
      if (foundProfile.password !== password) {
        setError('Mật khẩu không chính xác. Vui lòng thử lại.')
        setIsLoading(false)
        return
      }

      // Dang nhap thanh cong - set profile va chuyen trang
      setIsSuccess(true)
      setCurrentProfile(foundProfile)
      
      setTimeout(() => {
        router.push('/discover')
      }, 1500)
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span className="font-medium">Quay lại</span>
          </Link>
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            LoveMatch
          </h1>
          <div className="w-20" />
        </div>
      </motion.div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-8 sm:p-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 mb-4">
                <LockClosedIcon className="h-8 w-8 text-rose-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h2>
              <p className="text-gray-600">Nhập email và mật khẩu để truy cập tài khoản</p>
            </div>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3"
              >
                <CheckCircleIcon className="h-6 w-6 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-900">Đăng nhập thành công!</p>
                  <p className="text-sm text-green-800">Đang chuyển hướng...</p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="your@email.com"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    emailError || error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-rose-300'
                  }`}
                  disabled={isLoading || isSuccess}
                  required
                />
                {emailError && <p className="text-red-500 text-xs mt-1">✗ {emailError}</p>}
              </div>


              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border-2 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-rose-500 ${
                    passwordError || error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-rose-300'
                  }`}
                  disabled={isLoading || isSuccess}
                  required
                />
                {passwordError && <p className="text-red-500 text-xs mt-1">✗ {passwordError}</p>}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3"
                >
                  <ExclamationCircleIcon className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isLoading || isSuccess || emailError !== '' || passwordError !== '' || !email || !password}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-pink-600 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang đăng nhập...
                  </span>
                ) : isSuccess ? (
                  'Đã đăng nhập ✓'
                ) : (
                  'Đăng nhập'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-500 font-medium">HOẶC</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="text-center">
              <p className="text-gray-600 text-sm mb-3">
                Chưa có tài khoản?
              </p>
              <Link
                href="/profile/create"
                className="w-full py-3 px-4 border-2 border-rose-300 text-rose-600 hover:bg-rose-50 font-bold rounded-lg transition-all block"
              >
                Tạo tài khoản mới
              </Link>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg"
            >
              <p className="text-blue-900 text-sm">
                <span className="font-semibold">💡 Mẹo:</span> Sử dụng email và mật khẩu mà bạn đã đăng ký để đăng nhập.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
