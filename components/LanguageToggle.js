'use client';

export default function LanguageToggle({ lang, setLang }) {
  return (
    <div className="flex items-center bg-[#f5e6cc] rounded-full p-0.5">
      <button
        onClick={() => setLang('ge')}
        className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
          lang === 'ge'
            ? 'bg-[#c1704a] text-white shadow-sm'
            : 'text-[#7a6452] hover:text-[#c1704a]'
        }`}
      >
        GE
      </button>
      <button
        onClick={() => setLang('en')}
        className={`px-4 py-1.5 rounded-full text-sm font-body font-medium transition-all duration-200 ${
          lang === 'en'
            ? 'bg-[#c1704a] text-white shadow-sm'
            : 'text-[#7a6452] hover:text-[#c1704a]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
