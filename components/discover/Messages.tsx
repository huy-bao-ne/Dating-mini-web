'use client'

import { motion } from 'framer-motion'
import { PaperAirplaneIcon, EnvelopeIcon } from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

interface Message {
  sender: 'user' | 'opponent'
  text: string
  timestamp?: Date
}

// Luu tru thong tin tung cuoc tro chuyen
interface Conversation {
  profileId: string
  profileName: string
  messages: Message[]
  lastMessage?: string
  lastMessageTime?: Date
}

interface MessagesProps {
  conversations: Record<string, Conversation>
  onSendMessage: (profileId: string, message: string) => void
  initialSelectedProfile?: string | null
}

export default function Messages({ conversations, onSendMessage, initialSelectedProfile }: MessagesProps) {
  // Theo doi profile da chon
  const [selectedProfile, setSelectedProfile] = useState<string | null>(initialSelectedProfile || null)
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    // Switch to selected profile neu gui tu component khac
    if (initialSelectedProfile) {
      setSelectedProfile(initialSelectedProfile)
    }
  }, [initialSelectedProfile])

  // Sap xep cuoc tro chuyen theo tin nhan gan nhat
  const conversationList = Object.values(conversations).sort((a, b) => {
    const timeA = a.lastMessageTime?.getTime() || 0
    const timeB = b.lastMessageTime?.getTime() || 0
    return timeB - timeA
  })

  // Lay cuoc tro chuyen dang chon
  const selectedConversation = selectedProfile ? conversations[selectedProfile] : null

  // Gui tin nhan va reset input
  const handleSendMessage = (profileId: string) => {
    // Kiem tra input co text khong
    if (!inputText.trim()) return
    // Goi callback de xu ly tin nhan o parent component
    onSendMessage(profileId, inputText)
    // Xoa input sau khi gui
    setInputText('')
  }

  if (conversationList.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <EnvelopeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-900">Chưa có tin nhắn nào</h3>
        <p className="text-gray-600 mt-1">Khi bạn có match và nhắn tin, nó sẽ hiển thị ở đây</p>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
      <div className="md:col-span-1 bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
          <h3 className="font-bold text-gray-900">💬 Conversations</h3>
          <p className="text-xs text-gray-600 mt-1">{conversationList.length} cuộc trò chuyện</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversationList.map((conv) => (
            <motion.button
              key={conv.profileId}
              whileHover={{ backgroundColor: '#f3f4f6' }}
              onClick={() => setSelectedProfile(conv.profileId)}
              className={`w-full p-4 border-b border-gray-100 text-left transition ${
                selectedProfile === conv.profileId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{conv.profileName}</p>
                  <p className="text-xs text-gray-600 truncate mt-1">{conv.lastMessage || 'Nhắn tin...'}</p>
                </div>
                {conv.lastMessageTime && (
                  <p className="text-xs text-gray-500 ml-2 flex-shrink-0">
                    {conv.lastMessageTime.toLocaleTimeString('vi-VN', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 flex flex-col overflow-hidden">
        {selectedConversation ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <h3 className="font-bold text-gray-900">{selectedConversation.profileName}</h3>
              <p className="text-xs text-gray-600 mt-1">Chat liên tục</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {selectedConversation.messages.map((msg, idx) => (
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
                    <p className="text-sm break-words">{msg.text}</p>
                    {msg.timestamp && (
                      <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                        {msg.timestamp.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && selectedProfile) {
                      handleSendMessage(selectedProfile)
                    }
                  }}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => selectedProfile && handleSendMessage(selectedProfile)}
                  disabled={!inputText.trim()}
                  className={`px-4 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${
                    inputText.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </motion.button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Chọn một cuộc trò chuyện để tiếp tục</p>
          </div>
        )}
      </div>
    </div>
  )
}
