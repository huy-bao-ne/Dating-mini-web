import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers/Providers'
import { ErrorBoundary } from '@/components/ui/ErrorBoundary'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Mini Dating App - Tìm kiếm người đặc biệt',
  description: 'Một ứng dụng hẹn hò đơn giản với tính năng tạo profile, like, matching, và đặt lịch hẹn.',
  keywords: 'dating, hẹn hò, matching, app, love',
  authors: [{ name: 'Dating App' }],
  openGraph: {
    title: 'Mini Dating App - Tìm kiếm người đặc biệt',
    description: 'Một ứng dụng hẹn hò đơn giản với tính năng tạo profile, like, matching, và đặt lịch hẹn.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mini Dating App',
    description: 'Ứng dụng hẹn hò đơn giản - Tìm kiếm người đặc biệt',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900`}>
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
