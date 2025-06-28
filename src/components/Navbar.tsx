'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold gradient-text">AnimeHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className={isActive('/')}>
              Beranda
            </Link>
            <Link href="/schedule" className={isActive('/schedule')}>
              Jadwal
            </Link>
            <Link href="/news" className={isActive('/news')}>
              Berita
            </Link>
            <Link href="/search" className={isActive('/search')}>
              Pencarian
            </Link>
            <Link href="/admin" className="btn-primary">
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Beranda
              </Link>
              <Link
                href="/schedule"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/schedule')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Jadwal
              </Link>
              <Link
                href="/news"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/news')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Berita
              </Link>
              <Link
                href="/search"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/search')}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Pencarian
              </Link>
              <Link
                href="/admin"
                className="block px-3 py-2 rounded-md text-base font-medium btn-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

