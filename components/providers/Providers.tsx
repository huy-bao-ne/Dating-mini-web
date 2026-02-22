'use client'

import { ReactNode } from 'react'
import { Toaster } from 'react-hot-toast'
import { ProfileInitializer } from './ProfileInitializer'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <>
      <ProfileInitializer />
      {children}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          },
          success: {
            style: {
              background: '#ecfdf5',
              color: '#065f46',
              border: '1px solid #d1fae5',
            },
          },
          error: {
            style: {
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fee2e2',
            },
          },
        }}
      />
    </>
  )
}

// Simple auth context for demo (not used for now)
export const useAuth = () => ({
  user: null,
  loading: false,
  signOut: async () => {},
  signUp: async () => {},
  signIn: async () => {},
  signInWithGoogle: async () => {},
})
