import { NextAuthProvider } from '@/components/providers/NextAuthProvider'
import { ReduxProvider } from '@/components/providers/ReduxProvider'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ScholarSphere - AI-Powered Research Paper Hub',
  description: 'Organize, annotate, and collaborate on research papers with AI assistance',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </NextAuthProvider>
      </body>
    </html>
  )
}
