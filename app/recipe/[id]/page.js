'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { ArrowLeft, Clock, ChefHat, Globe, CheckCircle2, Circle } from 'lucide-react';

const supabase = createClient(
  'https://bprjjnhsejfudktgpwmt.supabase.co',
  'sb_publishable_Xn68wkiqRhq0fJ7Ajud_rQ_JtjhHwQa'
);

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const [lang, setLang] = useState('ge');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data } = await supabase
        .from('recipes')
        .select('*, ingredients(*), instructions(*)')
        .eq('slug', params.id)
        .single();
      if (data) setRecipe(data);
      setLoading(false);
    };
    fetchRecipe();
  }, [params.id]);

  const toggleIngredient = (i) => setCheckedIngredients((prev) => ({ ...prev, [i]: !prev[i] }));
  const toggleStep = (i) => setCompletedSteps((prev) => ({ ...prev, [i]: !prev[i] }));

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#c1704a] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#7a6452] font-body">იტვირთება...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-[#7a6452]">რეცეპტი ვერ მოიძებნა</p>
          <Link href="/" className="mt-4 inline-block text-[#c1704a] font-body underline">მთავარზე დაბრუნება</Link>
        </div>
      </div>
    );
  }

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200',
    მარტივი: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    საშუალო: 'bg-amber-50 text-amber-700 border-amber-200',
    რთული: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  const sortedIngredients = [...(recipe.ingredients || [])].sort((a, b) => a.order_index - b.order_index);
  const sortedInstructions = [...(recipe.instructions || [])].sort((a, b) => a.step_number - b.step_number);

  const title = lang === 'ge' ? recipe.title_ge : recipe.title_en;
  const description = lang === 'ge' ? recipe.description_ge : recipe.description_en;
  const country = lang === 'ge' ? recipe.country_ge : recipe.country_en;
  const difficulty = lang === 'ge' ? recipe.difficulty_ge : recipe.difficulty_en;

  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      <Navbar lang={lang} setLang={setLang} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Hero image */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        {recipe.image_url ? (
          <img src={recipe.image_url} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#f5e6cc]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120a]/70 via-[#1a120a]/20 to-transparent" />
        <div className="absolute top-20 left-4 md:left-8">
          <button onClick={() => router.back()} className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full px-4 py-2 text-sm transition-all">
            <ArrowLeft size={16} />
            {lang === 'ge' ? 'უკან' : 'Back'}
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1 text-xs">
                <Globe size={11} /> {country}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-medium border ${difficultyColors[difficulty] || 'bg-white/20 text-white border-white/30'}`}>
                {difficulty}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-3">{title}</h1>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <Clock size={14} />
                <span>{recipe.prep_time} {lang === 'ge' ? 'წუთი' : 'minutes'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-sm">
                <ChefHat size={14} />
                <span>{sortedIngredients.length} {lang === 'ge' ? 'ინგრედიენტი' : 'ingredients'}</span>
              </div>
              {recipe.calories && (
                <div className="flex items-center gap-1.5 text-white/80 text-sm">
                  <span>🔥</span>
                  <span>{recipe.calories} kcal</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">
        {/* Description */}
        <div className="bg-[#f5e6cc]/50 rounded-2xl p-6 md:p-8 mb-10 border border-[#edc87a]/30">
          <p className="font-display text-xl md:text-2xl text-[#1a120a] leading-relaxed italic">"{description}"</p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Ingredients */}
          <div className="md:col-span-2">
            <div className="sticky top-24">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#1a120a] mb-5">
                {lang === 'ge' ? 'ინგრედიენტები' : 'Ingredients'}
              </h2>
              <ul className="space-y-2.5">
                {sortedIngredients.map((ing, i) => (
                  <li key={i}>
                    <button onClick={() => toggleIngredient(i)} className={`w-full flex items-start gap-3 text-left p-3 rounded-xl transition-all duration-200 ${checkedIngredients[i] ? 'bg-[#2d5a27]/10 text-[#2d5a27]' : 'hover:bg-[#f5e6cc]/70 text-[#1a120a]'}`}>
                      <div className="mt-0.5 shrink-0">
                        {checkedIngredients[i] ? <CheckCircle2 size={17} className="text-[#2d5a27]" /> : <Circle size={17} className="text-[#c1704a]/50" />}
                      </div>
                      <span className={`text-sm leading-relaxed ${checkedIngredients[i] ? 'line-through opacity-60' : ''}`}>
                        {lang === 'ge' ? ing.text_ge : ing.text_en}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Instructions */}
          <div className="md:col-span-3">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#1a120a] mb-5">
              {lang === 'ge' ? 'მომზადება' : 'Instructions'}
            </h2>
            <ol className="space-y-5">
              {sortedInstructions.map((step, i) => (
                <li key={i}>
                  <button onClick={() => toggleStep(i)} className={`w-full flex gap-4 text-left p-4 rounded-xl transition-all duration-200 ${completedSteps[i] ? 'bg-[#2d5a27]/8 border border-[#2d5a27]/20' : 'hover:bg-[#f5e6cc]/50 border border-transparent'}`}>
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${completedSteps[i] ? 'bg-[#2d5a27] text-white' : 'bg-[#c1704a] text-white'}`}>
                      {completedSteps[i] ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm leading-relaxed pt-1 ${completedSteps[i] ? 'text-[#7a6452] line-through opacity-60' : 'text-[#1a120a]'}`}>
                        {lang === 'ge' ? step.text_ge : step.text_en}
                      </p>
                      {/* Step image */}
                      {step.image_url && (
                        <div className="mt-3 rounded-xl overflow-hidden">
                          <img
                            src={step.image_url}
                            alt={`ნაბიჯი ${i + 1}`}
                            className="w-full h-52 object-cover rounded-xl"
                          />
                        </div>
                      )}
                    </div>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-16 pt-10 border-t border-[#f5e6cc]">
          <Link href="/" className="flex items-center gap-2 text-[#c1704a] hover:text-[#9a4f2a] transition-colors font-body text-sm">
            <ArrowLeft size={16} />
            {lang === 'ge' ? 'ყველა რეცეპტი' : 'All Recipes'}
          </Link>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}