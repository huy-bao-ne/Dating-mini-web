'use client'

import { motion } from 'framer-motion'
import { CheckCircleIcon, ChatBubbleLeftIcon, CalendarIcon, XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface Profile {
  id: string
  name: string
  age: number
  email: string
  bio?: string
  gender?: string
}

interface MatchesPerfectProps {
  profiles: Profile[]
  currentUserId: string
  onSaveConversation?: (profileId: string, profileName: string, messages: any[]) => void
  onNavigateToMessages?: (profileId: string, profileName: string) => void
}

const TIME_SLOTS = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
]

export default function MatchesPerfect({ profiles, currentUserId, onSaveConversation, onNavigateToMessages }: MatchesPerfectProps) {
  // ===== STATES =====
  // Luu tru id cua profile dang mo modal de scheduling
  const [schedulingModal, setSchedulingModal] = useState<string | null>(null)
  // Ngay da chon de scheduled call
  const [selectedDate, setSelectedDate] = useState<string>('')
  // Khoanh gio da chon (vi du: "09:00 - 10:00")
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  // Luu thong tin thoi gian da chon cho tung profile (key: profileId)
  const [userTimeSelection, setUserTimeSelection] = useState<Record<string, { date: string; time: string }>>({})
  // Luu tru tin nhan trong cuoc tro chuyen (key: profileId)
  const [messages, setMessages] = useState<Record<string, Array<{ sender: 'user' | 'opponent'; text: string }>>>({})
  // Kiem tra xem user dang o che do chat hay dang o man hinh scheduling
  const [chatMode, setChatMode] = useState<Record<string, boolean>>({})
  // Luu input text tin nhan cua user (key: profileId)
  const [chatInput, setChatInput] = useState<Record<string, string>>({})

  // Mo modal de chon thoi gian hen gap
  const openSchedulingModal = (profileId: string) => {
    setSchedulingModal(profileId)
    setSelectedDate('')
    setSelectedTime(null)
  }

  // Dong modal va reset form
  const closeSchedulingModal = () => {
    setSchedulingModal(null)
    setSelectedDate('')
    setSelectedTime(null)
  }

  // Xac nhan lua chon thoi gian va gui de xuat
  const confirmTimeSelection = () => {
    if (schedulingModal && selectedDate && selectedTime) {
      setUserTimeSelection(prev => ({
        ...prev,
        [schedulingModal]: { date: selectedDate, time: selectedTime }
      }))

      // Gui de xuat thoi gian cho doi phuong
      const profile = profiles.find(p => p.id === schedulingModal)
      const dateObj = new Date(selectedDate)
      const formattedDate = dateObj.toLocaleDateString('vi-VN', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
      const message = `📅 Đã đề xuất thời gian hẹn gặp: ${formattedDate} lúc ${selectedTime}`

      const newMessages: Array<{ sender: 'user' | 'opponent'; text: string }> = [...(messages[schedulingModal] || []), { sender: 'user' as const, text: message }]

      setMessages(prev => ({
        ...prev,
        [schedulingModal]: newMessages
      }))

      if (onSaveConversation && profile) {
        onSaveConversation(schedulingModal, profile.name, newMessages)
      }

      // Chuyen sang che do chat
      setChatMode(prev => ({
        ...prev,
        [schedulingModal]: true
      }))

      // Gia lap phan hoi tu doi phuong
      setTimeout(() => {
        if (schedulingModal) {
          setMessages(prev => ({
            ...prev,
            [schedulingModal]: [...(prev[schedulingModal] || []), { sender: 'opponent' as const, text: '👍 Ok! Mình chốt thời gian này luôn' }]
          }))


          if (onSaveConversation) {
            const profile = profiles.find(p => p.id === schedulingModal)
            const updatedMessages = [...newMessages, { sender: 'opponent' as const, text: '👍 Ok! Mình chốt thời gian này luôn' }]
            if (profile) {
              onSaveConversation(schedulingModal, profile.name, updatedMessages)
            }
          }
        }
      }, 1500)
    }
  }

  // Gui tin nhan trong cuoc tro chuyen voi user duoc chon
  const sendChatMessage = (profileId: string) => {
    // Lay text va loai khoang trang
    const text = chatInput[profileId]?.trim()
    if (!text) return

    // Tao tin nhan moi trong danh sach
    const newMessages: Array<{ sender: 'user' | 'opponent'; text: string }> = [...(messages[profileId] || []), { sender: 'user' as const, text }]

    setMessages(prev => ({
      ...prev,
      [profileId]: newMessages
    }))

    setChatInput(prev => ({
      ...prev,
      [profileId]: ''
    }))

    if (onSaveConversation) {
      const profile = profiles.find(p => p.id === profileId)
      if (profile) {
        onSaveConversation(profileId, profile.name, newMessages)
      }
    }

    // Gia lap phan hoi cua doi phuong
    setTimeout(() => {
      const responses = [
        '😊 Vâng, tôi cũng mong được gặp bạn!',
        '🎉 Hôm đó tôi rảnh, chúng ta gặp nhé!',
        '💪 Ok bạn, hẹn gặp lúc đó!',
        '👋 Tạm biệt, bạn cẩn thận trên đường nhé!'
      ]
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      
      setMessages(prev => ({
        ...prev,
        [profileId]: [...(prev[profileId] || []), { sender: 'opponent' as const, text: randomResponse }]
      }))


      const finalMessages: Array<{ sender: 'user' | 'opponent'; text: string }> = [...newMessages, { sender: 'opponent' as const, text: randomResponse }]
      if (onSaveConversation) {
        const profile = profiles.find(p => p.id === profileId)
        if (profile) {
          onSaveConversation(profileId, profile.name, finalMessages)
        }
      }
    }, 800)
  }

  const formatDisplayDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (profiles.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <CheckCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Chưa có match nào</h3>
        <p className="text-gray-600 mt-1">Hãy thích những người thích bạn để tạo match</p>
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
          <span className="text-3xl">💫</span>
          <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
            Matches Perfect ({profiles.length})
          </span>
        </h2>
        <p className="text-gray-600 mt-2">Những người mà cả 2 đều thích nhau! Hãy liên hệ ngay nào</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border-2 border-amber-200"
          >
            <div className="h-24 bg-gradient-to-r from-amber-400 to-yellow-500 relative flex items-center justify-center">
              <span className="text-4xl animate-bounce">✨</span>
            </div>

            <div className="relative px-4 pb-4">
              <div className="-mt-8 mb-2">
                <div className="w-16 h-16 rounded-2xl border-4 border-white bg-gradient-to-br from-amber-300 to-yellow-400 flex items-center justify-center text-white text-xl font-bold mx-auto shadow-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 text-center">
                {profile.name}, <span className="text-amber-600">{profile.age}</span>
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
                <span className="px-3 py-1 bg-amber-500 text-white rounded-full text-xs font-semibold">
                  ⭐ Perfect
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => openSchedulingModal(profile.id)}
                  className="w-full py-2 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-yellow-700 transition flex items-center justify-center gap-2"
                >
                  <CalendarIcon className="h-5 w-5" />
                  Đặt lịch hẹn
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    if (!messages[profile.id] || messages[profile.id].length === 0) {
                      const initialMessage = `Xin chào ${profile.name}! 👋`
                      if (onSaveConversation) {
                        onSaveConversation(profile.id, profile.name, [{ sender: 'user' as const, text: initialMessage }])
                      }
                    }
                    if (onNavigateToMessages) {
                      onNavigateToMessages(profile.id, profile.name)
                    }
                  }}
                  className="w-full py-2 bg-white border-2 border-amber-500 text-amber-600 rounded-lg font-semibold hover:bg-amber-50 transition flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  Nhắn tin
                </motion.button>
              </div>

              {userTimeSelection[profile.id] && (
                <div className="mt-3 p-2 bg-amber-100 rounded-lg text-center">
                  <p className="text-xs text-amber-700 font-semibold">
                    📅 Bạn chọn: {formatDisplayDate(userTimeSelection[profile.id].date)} lúc {userTimeSelection[profile.id].time}
                  </p>
                </div>
              )}

              <div className="mt-3 text-center">
                <p className="text-xs text-gray-600">
                  <span className="animate-pulse bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                    💝 Perfect Match!
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {schedulingModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={closeSchedulingModal}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {chatMode[schedulingModal || ''] ? (
                  <>
                    <ChatBubbleLeftIcon className="h-6 w-6 text-blue-500" />
                    Chat
                  </>
                ) : (
                  <>
                    <CalendarIcon className="h-6 w-6 text-amber-500" />
                    Chọn thời gian
                  </>
                )}
              </h3>
              <button
                onClick={closeSchedulingModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mb-4 p-3 bg-amber-50 rounded-lg flex-shrink-0">
              <p className="text-sm text-gray-700">
                Với: <span className="font-semibold text-amber-600">
                  {profiles.find(p => p.id === schedulingModal)?.name}
                </span>
              </p>
            </div>

            {chatMode[schedulingModal || ''] && userTimeSelection[schedulingModal || ''] && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border-2 border-green-300 flex-shrink-0">
                <p className="text-xs font-semibold text-green-700 mb-1">📅 Thời gian hẹn gặp:</p>
                <p className="text-sm text-green-700 font-bold">
                  {formatDisplayDate(userTimeSelection[schedulingModal || '']?.date)} lúc {userTimeSelection[schedulingModal || '']?.time}
                </p>
              </div>
            )}

            {!chatMode[schedulingModal || ''] ? (
              <div className="overflow-y-auto flex-1">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chọn ngày</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Chon khoang gio</label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto mb-3">
                    {TIME_SLOTS.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 px-3 rounded-lg font-semibold transition text-sm ${
                          selectedTime === time
                            ? 'bg-amber-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-600 font-semibold mb-2">📝 Hoặc nhập giờ tùy ý:</p>
                    <div className="flex gap-2">
                      <input
                        type="time"
                        onChange={(e) => {
                          if (e.target.value) {
                            setSelectedTime(e.target.value)
                          }
                        }}
                        className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
                        placeholder="HH:MM"
                      />
                    </div>
                    {selectedTime && !TIME_SLOTS.includes(selectedTime) && (
                      <p className="text-xs text-amber-600 mt-1 font-semibold">✓ Bạn chọn: {selectedTime}</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto mb-4 bg-gray-50 rounded-lg p-4 space-y-3">
                {messages[schedulingModal || '']?.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 10 : -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        msg.sender === 'user'
                          ? 'bg-blue-500 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-900 rounded-bl-none'
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            <div className="flex gap-3 flex-shrink-0">
              {!chatMode[schedulingModal || ''] ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmTimeSelection}
                  disabled={!selectedDate || !selectedTime}
                  className={`flex-1 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                    selectedDate && selectedTime
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white hover:from-amber-600 hover:to-yellow-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                  Gửi đề xuất
                </motion.button>
              ) : (
                <>
                  <input
                    type="text"
                    value={chatInput[schedulingModal || ''] || ''}
                    onChange={(e) => setChatInput(prev => ({
                      ...prev,
                      [schedulingModal || '']: e.target.value
                    }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        sendChatMessage(schedulingModal || '')
                      }
                    }}
                    placeholder="Nhập tin nhắn..."
                    className="flex-1 px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => sendChatMessage(schedulingModal || '')}
                    disabled={!chatInput[schedulingModal || '']?.trim()}
                    className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                      chatInput[schedulingModal || '']?.trim()
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
