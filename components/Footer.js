'use client';

import { Mail, Heart, Globe } from 'lucide-react';

export default function Footer({ lang }) {
  const t = {
    ge: {
      tagline: 'სიყვარულით მომზადებული, სიყვარულით გაზიარებული',
      contact: 'დაგვიკავშირდით',
      rights: 'ყველა უფლება დაცულია',
      madeWith: 'გაკეთდა',
    },
    en: {
      tagline: 'Cooked with love, shared with the world',
      contact: 'Contact Us',
      rights: 'All rights reserved',
      madeWith: 'Made with',
    },
  }[lang];

  return (
    <footer className="relative mt-24 overflow-hidden">
      {/* Top wave */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg viewBox="0 0 1440 64" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0 64 C360 0 1080 0 1440 64 L1440 64 L0 64Z"
            fill="#2d5a27"
          />
        </svg>
      </div>

      <div className="bg-[#2d5a27] pt-20 pb-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            {/* Logo mark */}
            <div className="flex justify-center mb-5">
              <svg width="52" height="52" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="21" cy="21" r="19" stroke="#d4924a" strokeWidth="1.5" fill="none" />
                <ellipse cx="21" cy="21" rx="10" ry="19" stroke="#d4924a" strokeWidth="1" fill="none" opacity="0.5" />
                <line x1="2" y1="21" x2="40" y2="21" stroke="#d4924a" strokeWidth="1" opacity="0.4" />
                <line x1="16" y1="11" x2="16" y2="31" stroke="#fdf6ec" strokeWidth="2" strokeLinecap="round" />
                <line x1="14" y1="11" x2="14" y2="17" stroke="#fdf6ec" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="18" y1="11" x2="18" y2="17" stroke="#fdf6ec" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M26 11 C29 11 29 17 26 17 L26 31" stroke="#fdf6ec" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </div>

            <p className="font-display text-[#f5e6cc] text-lg italic mb-2">
              {t.tagline}
            </p>
            <p className="text-[#a8c5a0] text-sm font-body tracking-widest uppercase">
              tradiciulireceptebi@gmail.com
            </p>
          </div>

          {/* Contact */}
          <div className="flex justify-center mb-10">
            <a
              href="mailto:tradiciulireceptebi@gmail.com"
              className="flex items-center gap-2.5 px-6 py-3 bg-[#c1704a] hover:bg-[#d4924a] text-white rounded-full font-body text-sm font-medium transition-all duration-200 hover:shadow-[0_4px_20px_rgba(193,112,74,0.4)]"
            >
              <Mail size={15} />
              {t.contact}
            </a>
          </div>

          {/* Divider */}
          <div className="h-px bg-[#1a3a16] mb-8" />

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[#6b9e63] text-xs font-body">
            <p>© 2024 ტრადიციული კერძები. {t.rights}.</p>
            <p className="flex items-center gap-1">
              {t.madeWith} <Heart size={11} fill="currentColor" className="text-[#c1704a] mx-0.5" /> & <Globe size={11} className="mx-0.5" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
