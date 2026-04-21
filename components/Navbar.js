'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, X, Globe } from 'lucide-react';

export default function Navbar({ lang, setLang, searchQuery, setSearchQuery }) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#fdf6ec]/95 backdrop-blur-md shadow-[0_2px_30px_rgba(26,18,10,0.08)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="transition-transform duration-300 group-hover:rotate-12"
            >
              {/* Globe circle */}
              <circle cx="21" cy="21" r="19" stroke="#c1704a" strokeWidth="1.5" fill="none" />
              {/* Latitude lines */}
              <ellipse cx="21" cy="21" rx="10" ry="19" stroke="#c1704a" strokeWidth="1" fill="none" opacity="0.5" />
              <line x1="2" y1="21" x2="40" y2="21" stroke="#c1704a" strokeWidth="1" opacity="0.4" />
              <line x1="4" y1="14" x2="38" y2="14" stroke="#c1704a" strokeWidth="0.8" opacity="0.3" />
              <line x1="4" y1="28" x2="38" y2="28" stroke="#c1704a" strokeWidth="0.8" opacity="0.3" />
              {/* Fork and spoon */}
              <line x1="16" y1="11" x2="16" y2="31" stroke="#2d5a27" strokeWidth="2" strokeLinecap="round" />
              <line x1="14" y1="11" x2="14" y2="17" stroke="#2d5a27" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="18" y1="11" x2="18" y2="17" stroke="#2d5a27" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M26 11 C29 11 29 17 26 17 L26 31" stroke="#2d5a27" strokeWidth="2" strokeLinecap="round" fill="none" />
            </svg>
            <div className="hidden sm:block">
              <div className="font-display text-[#1a120a] leading-tight">
                <div className="text-[11px] tracking-[0.15em] uppercase font-body text-[#c1704a] font-medium">
                  {lang === 'ge' ? 'მსოფლიო' : 'World'}
                </div>
                <div className="text-lg font-semibold leading-none">
                  {lang === 'ge' ? 'რეცეპტები' : 'Recipes'}
                </div>
              </div>
            </div>
          </Link>

          {/* Right controls */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search */}
            <div className={`flex items-center transition-all duration-300 ${searchOpen ? 'w-48 md:w-64' : 'w-9'}`}>
              {searchOpen ? (
                <div className="flex items-center w-full bg-[#f5e6cc] rounded-full px-4 py-2 gap-2">
                  <Search size={14} className="text-[#7a6452] shrink-0" />
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'ge' ? 'ძებნა...' : 'Search...'}
                    className="flex-1 bg-transparent text-sm text-[#1a120a] outline-none font-body placeholder:text-[#7a6452]"
                  />
                  <button
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="text-[#7a6452] hover:text-[#c1704a] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#f5e6cc] transition-colors text-[#7a6452] hover:text-[#c1704a]"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === 'ge' ? 'en' : 'ge')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#c1704a]/30 hover:border-[#c1704a] hover:bg-[#c1704a] hover:text-white transition-all duration-200 text-[#c1704a] text-sm font-body font-medium group"
            >
              <Globe size={13} className="group-hover:rotate-12 transition-transform duration-200" />
              <span className="hidden sm:inline">{lang === 'ge' ? 'GE' : 'EN'}</span>
              <span className="text-[#7a6452] group-hover:text-white/70 hidden sm:inline">|</span>
              <span className="hidden sm:inline">{lang === 'ge' ? 'EN' : 'GE'}</span>
              <span className="sm:hidden">{lang === 'ge' ? 'EN' : 'GE'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
