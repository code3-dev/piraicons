import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'PiraIcons - Modern Icon Library | 25,380+ Open Source Icons',
  description: 'Discover and download 25,380+ modern, high-quality SVG icons. Free and open source icon library with rounded and sharp styles for your next project.',
  keywords: 'icons, svg, react, nextjs, open source, ui, design, free icons, icon library',
  authors: [{ name: 'Hossein Pira' }],
  openGraph: {
    title: 'PiraIcons - Modern Icon Library',
    description: '25,380+ modern, high-quality SVG icons for your projects',
    type: 'website',
  },
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
        <div className="min-h-screen">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '12px',
            },
          }}
        />
      </body>
    </html>
  )
}
