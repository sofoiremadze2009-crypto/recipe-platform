'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { recipes } from '@/data/recipes';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Globe,
  CheckCircle2,
  Circle,
} from 'lucide-react';

export default function RecipePage() {
  const params = useParams();
  const router = useRouter();
  const [lang, setLang] = useState('ge');
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [completedSteps, setCompletedSteps] = useState({});

  const recipe = recipes.find((r) => r.id === params.id);

  if (!recipe) {
    return (
      <div className="min-h-screen bg-[#fdf6ec] flex items-center justify-center">
        <div className="text-center">
          <p className="font-display text-3xl text-[#7a6452]">Recipe not found</p>
          <Link href="/" className="mt-4 inline-block text-[#c1704a] font-body underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const toggleIngredient = (i) => {
    setCheckedIngredients((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const toggleStep = (i) => {
    setCompletedSteps((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const difficultyColors = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Medium: 'bg-amber-50 text-amber-700 border-amber-200',
    Hard: 'bg-rose-50 text-rose-700 border-rose-200',
    მარტივი: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    საშუალო: 'bg-amber-50 text-amber-700 border-amber-200',
    რთული: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  return (
    <div className="min-h-screen bg-[#fdf6ec]">
      <Navbar lang={lang} setLang={setLang} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Hero image */}
      <div className="relative h-[55vh] md:h-[65vh] overflow-hidden">
        <Image
          src={recipe.imageUrl}
          alt={recipe.title[lang]}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a120a]/70 via-[#1a120a]/20 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-4 md:left-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full px-4 py-2 text-sm font-body transition-all duration-200"
          >
            <ArrowLeft size={16} />
            {lang === 'ge' ? 'უკან' : 'Back'}
          </button>
        </div>

        {/* Hero text overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white rounded-full px-3 py-1 text-xs font-body">
                <Globe size={11} /> {recipe.country[lang]}
              </span>
              <span className={`rounded-full px-3 py-1 text-xs font-body font-medium border ${difficultyColors[recipe.difficulty[lang]] || 'bg-white/20 text-white border-white/30'}`}>
                {recipe.difficulty[lang]}
              </span>
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-white leading-tight mb-3">
              {recipe.title[lang]}
            </h1>
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-1.5 text-white/80 text-sm font-body">
                <Clock size={14} />
                <span>{recipe.prepTime} {lang === 'ge' ? 'წუთი' : 'minutes'}</span>
              </div>
              <div className="flex items-center gap-1.5 text-white/80 text-sm font-body">
                <ChefHat size={14} />
                <span>{recipe.ingredients[lang].length} {lang === 'ge' ? 'ინგრედიენტი' : 'ingredients'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-12">

        {/* Description */}
        <div className="bg-[#f5e6cc]/50 rounded-2xl p-6 md:p-8 mb-10 border border-[#edc87a]/30">
          <p className="font-display text-xl md:text-2xl text-[#1a120a] leading-relaxed italic">
            "{recipe.description[lang]}"
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-10">
          {/* Ingredients */}
          <div className="md:col-span-2">
            <div className="sticky top-24">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-[#1a120a] mb-5">
                {lang === 'ge' ? 'ინგრედიენტები' : 'Ingredients'}
              </h2>
              <ul className="space-y-2.5">
                {recipe.ingredients[lang].map((ing, i) => (
                  <li key={i}>
                    <button
                      onClick={() => toggleIngredient(i)}
                      className={`w-full flex items-start gap-3 text-left p-3 rounded-xl transition-all duration-200 ${
                        checkedIngredients[i]
                          ? 'bg-[#2d5a27]/10 text-[#2d5a27]'
                          : 'hover:bg-[#f5e6cc]/70 text-[#1a120a]'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {checkedIngredients[i] ? (
                          <CheckCircle2 size={17} className="text-[#2d5a27]" />
                        ) : (
                          <Circle size={17} className="text-[#c1704a]/50" />
                        )}
                      </div>
                      <span
                        className={`text-sm font-body leading-relaxed ${
                          checkedIngredients[i] ? 'line-through opacity-60' : ''
                        }`}
                      >
                        {ing}
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
            <ol className="space-y-4">
              {recipe.instructions[lang].map((step, i) => (
                <li key={i}>
                  <button
                    onClick={() => toggleStep(i)}
                    className={`w-full flex gap-4 text-left p-4 rounded-xl transition-all duration-200 ${
                      completedSteps[i]
                        ? 'bg-[#2d5a27]/8 border border-[#2d5a27]/20'
                        : 'hover:bg-[#f5e6cc]/50 border border-transparent'
                    }`}
                  >
                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-body font-semibold text-sm transition-all duration-200 ${
                      completedSteps[i]
                        ? 'bg-[#2d5a27] text-white'
                        : 'bg-[#c1704a] text-white'
                    }`}>
                      {completedSteps[i] ? <CheckCircle2 size={16} /> : i + 1}
                    </div>
                    <p className={`text-sm font-body leading-relaxed pt-1 ${
                      completedSteps[i] ? 'text-[#7a6452] line-through opacity-60' : 'text-[#1a120a]'
                    }`}>
                      {step}
                    </p>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Navigation to other recipes */}
        <div className="mt-16 pt-10 border-t border-[#f5e6cc]">
          <p className="font-display text-2xl text-[#1a120a] mb-6">
            {lang === 'ge' ? 'სხვა კერძები' : 'More Recipes'}
          </p>
          <div className="flex flex-wrap gap-3">
            {recipes
              .filter((r) => r.id !== recipe.id)
              .slice(0, 3)
              .map((r) => (
                <Link
                  key={r.id}
                  href={`/recipe/${r.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-[#f5e6cc] border border-[#f5e6cc] rounded-full text-sm font-body text-[#1a120a] transition-all duration-150 hover:border-[#c1704a]/30"
                >
                  <Globe size={12} className="text-[#c1704a]" />
                  {r.title[lang]}
                </Link>
              ))}
          </div>
        </div>
      </div>

      <Footer lang={lang} />
    </div>
  );
}
