'use client';

import { useState, useMemo, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import Navbar from '@/components/Navbar';
import RecipeCard from '@/components/RecipeCard';
import Footer from '@/components/Footer';
import { recipes as localRecipes, categories, countries } from '@/data/recipes';
import { ChevronDown, UtensilsCrossed } from 'lucide-react';

const supabase = createClient(
  'https://bprjjnhsejfudktgpwmt.supabase.co',
  'sb_publishable_Xn68wkiqRhq0fJ7Ajud_rQ_JtjhHwQa'
);

export default function HomePage() {
  const [lang, setLang] = useState('ge');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeCountry, setActiveCountry] = useState('all');
  const [dbRecipes, setDbRecipes] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*, ingredients(*), instructions(*)');
      if (data && data.length > 0) setDbRecipes(data);
    };
    fetchRecipes();
  }, []);

  const allRecipes = dbRecipes.length > 0 ? dbRecipes.map(r => ({
    id: r.slug,
    country: { ge: r.country_ge, en: r.country_en },
    countryCode: r.country_code,
    category: r.category,
    difficulty: { ge: r.difficulty_ge, en: r.difficulty_en },
    prepTime: r.prep_time,
    imageUrl: r.image_url,
    title: { ge: r.title_ge, en: r.title_en },
    description: { ge: r.description_ge, en: r.description_en },
    ingredients: {
      ge: (r.ingredients || []).sort((a,b) => a.order_index - b.order_index).map(i => i.text_ge),
      en: (r.ingredients || []).sort((a,b) => a.order_index - b.order_index).map(i => i.text_en),
    },
    instructions: {
      ge: (r.instructions || []).sort((a,b) => a.step_number - b.step_number).map(i => i.text_ge),
      en: (r.instructions || []).sort((a,b) => a.step_number - b.step_number).map(i => i.text_en),
    },
  })) : localRecipes;

  const t = {
    ge: {
      heroTitle: 'ტრადიციული კერძების',
      heroSubtitle: 'რეცეპტები მსოფლიოდან',
      heroDesc: 'მსოფლიოს კუთხეებიდან შეგროვებული ავთენტური კერძები — ოჯახური სიმხიარულის, კულინარიის ხელოვნებისა და ტრადიციის საუნჯე.',
      exploreBtn: 'რეცეპტების ნახვა',
      byCountry: 'ქვეყნის მიხედვით',
      byCategory: 'კატეგორიის მიხედვით',
      recipesFound: 'კერძი ნაპოვნია',
      noResults: 'კერძი ვერ მოიძებნა',
      noResultsDesc: 'სხვა საძიებო სიტყვა სცადეთ.',
    },
    en: {
      heroTitle: 'Traditional Recipes',
      heroSubtitle: 'From Around the World',
      heroDesc: 'Authentic dishes gathered from every corner of the globe — a treasury of family warmth, culinary artistry, and timeless tradition.',
      exploreBtn: 'Explore Recipes',
      byCountry: 'By Country',
      byCategory: 'By Category',
      recipesFound: 'recipes found',
      noResults: 'No recipes found',
      noResultsDesc: 'Try a different search term.',
    },
  }[lang];

  const filtered = useMemo(() => {
    return allRecipes.filter((r) => {
      const matchSearch = !searchQuery ||
        r.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.country[lang].toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory = activeCategory === 'all' || r.category === activeCategory;
      const matchCountry = activeCountry === 'all' || r.countryCode === activeCountry;
      return matchSearch && matchCategory && matchCountry;
    });
  }, [searchQuery, activeCategory, activeCountry, lang, allRecipes]);

  const scrollToRecipes = () => {
    document.getElementById('recipes')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      <Navbar lang={lang} setLang={setLang} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#c1704a]/8 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#2d5a27]/8 rounded-full blur-3xl" />
          <div className="absolute top-32 left-12 text-6xl opacity-10 rotate-12">🫕</div>
          <div className="absolute top-48 right-16 text-5xl opacity-10 -rotate-12">🍝</div>
          <div className="absolute bottom-48 left-20 text-5xl opacity-10 rotate-6">🍜</div>
          <div className="absolute bottom-32 right-12 text-6xl opacity-10 -rotate-6">🥘</div>
        </div>
        <div className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up stagger-1">
          <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#c1704a]/50" />
          <span className="text-[#c1704a] text-xs tracking-[0.3em] uppercase font-body font-medium">
            {lang === 'ge' ? 'ავთენტური კერძები' : 'Authentic Dishes'}
          </span>
          <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#c1704a]/50" />
        </div>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold text-[#1a120a] leading-[1.05] mb-4 opacity-0 animate-fade-in-up stagger-2">
          {t.heroTitle}
          <span className="block text-[#c1704a] italic">{t.heroSubtitle}</span>
        </h1>
        <p className="max-w-xl text-[#7a6452] font-body text-base md:text-lg leading-relaxed mt-6 mb-10 opacity-0 animate-fade-in-up stagger-3">
          {t.heroDesc}
        </p>
        <button onClick={scrollToRecipes} className="group flex items-center gap-2 px-8 py-4 bg-[#c1704a] hover:bg-[#9a4f2a] text-white rounded-full font-body font-medium text-base transition-all duration-300 hover:shadow-[0_8px_30px_rgba(193,112,74,0.35)] opacity-0 animate-fade-in-up stagger-4">
          {t.exploreBtn}
          <ChevronDown size={18} className="group-hover:translate-y-1 transition-transform duration-200" />
        </button>
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 md:gap-5 opacity-0 animate-fade-in-up stagger-5">
          {['🇬🇪', '🇮🇹', '🇯🇵', '🇲🇽', '🇫🇷', '🇮🇳'].map((flag, i) => (
            <span key={i} className="text-2xl md:text-3xl hover:scale-125 transition-transform duration-200 cursor-default">{flag}</span>
          ))}
        </div>
      </section>
      <section id="recipes" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="ornamental-divider mb-6">
              <span className="font-display text-3xl md:text-4xl font-semibold text-[#1a120a]">
                {lang === 'ge' ? 'ყველა რეცეპტი' : 'All Recipes'}
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mb-10 p-4 bg-white rounded-2xl shadow-[0_2px_15px_rgba(26,18,10,0.06)]">
            <div className="flex-1">
              <p className="text-xs text-[#7a6452] font-body mb-2 uppercase tracking-wider">{t.byCountry}</p>
              <div className="flex flex-wrap gap-2">
                {countries.map((c) => (
                  <button key={c.id} onClick={() => setActiveCountry(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all duration-150 ${activeCountry === c.id ? 'bg-[#c1704a] text-white' : 'bg-[#f5e6cc] text-[#7a6452] hover:bg-[#edc87a]/40'}`}>
                    {c[lang]}
                  </button>
                ))}
              </div>
            </div>
            <div className="w-px bg-[#f5e6cc] hidden sm:block" />
            <div className="flex-1">
              <p className="text-xs text-[#7a6452] font-body mb-2 uppercase tracking-wider">{t.byCategory}</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button key={c.id} onClick={() => setActiveCategory(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all duration-150 ${activeCategory === c.id ? 'bg-[#2d5a27] text-white' : 'bg-[#f5e6cc] text-[#7a6452] hover:bg-[#a8c5a0]/30'}`}>
                    {c[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm text-[#7a6452] font-body mb-6">
            <span className="font-medium text-[#c1704a]">{filtered.length}</span> {t.recipesFound}
          </p>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((recipe, i) => (
                <RecipeCard key={recipe.id} recipe={recipe} lang={lang} index={i} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <UtensilsCrossed size={48} className="text-[#c1704a]/30 mb-4" />
              <p className="font-display text-2xl text-[#7a6452] mb-2">{t.noResults}</p>
              <p className="text-sm text-[#7a6452]/70 font-body">{t.noResultsDesc}</p>
            </div>
          )}
        </div>
      </section>
      <Footer lang={lang} />
    </div>
  );
}