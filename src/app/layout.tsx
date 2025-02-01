import { Toaster } from 'react-hot-toast'
import ErrorBoundary from '@/components/ErrorBoundary'
import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nacho Kats Rarity Checker',
  description: 'Check the rarity of your Nacho Kats NFT',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
} 