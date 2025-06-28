import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AnimeHub - Portal Informasi Anime Terlengkap',
  description: 'Portal informasi anime terlengkap dengan berita terbaru, jadwal tayang, dan komunitas otaku Indonesia.',
  keywords: 'anime, manga, otaku, berita anime, jadwal anime, review anime',
  authors: [{ name: 'YuzakiNetwork' }],
  openGraph: {
    title: 'AnimeHub - Portal Informasi Anime Terlengkap',
    description: 'Portal informasi anime terlengkap dengan berita terbaru, jadwal tayang, dan komunitas otaku Indonesia.',
    type: 'website',
    locale: 'id_ID',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <body className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}

