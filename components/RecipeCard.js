'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, ChefHat, Globe } from 'lucide-react';

const difficultyColor = {
  Easy: 'bg-emerald-100 text-emerald-700',
  Medium: 'bg-amber-100 text-amber-700',
  Hard: 'bg-rose-100 text-rose-700',
  მარტივი: 'bg-emerald-100 text-emerald-700',
  საშუალო: 'bg-amber-100 text-amber-700',
  რთული: 'bg-rose-100 text-rose-700',
};

export default function RecipeCard({ recipe, lang, index = 0 }) {
  const staggerClass = `stagger-${Math.min(index + 1, 6)}`;

  return (
    <Link href={`/recipe/${recipe.id}`} className="block">
      <article
        className={`recipe-card bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(26,18,10,0.07)] cursor-pointer opacity-0 animate-fade-in-up ${staggerClass}`}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title[lang]}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Country badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-body font-medium text-[#1a120a]">
            <Globe size={11} className="text-[#c1704a]" />
            {recipe.country[lang]}
          </div>

          {/* Difficulty */}
          <div className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-body font-medium ${difficultyColor[recipe.difficulty[lang]] || 'bg-gray-100 text-gray-600'}`}>
            {recipe.difficulty[lang]}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-display text-xl font-semibold text-[#1a120a] mb-2 leading-tight">
            {recipe.title[lang]}
          </h3>
          <p className="text-sm text-[#7a6452] font-body leading-relaxed line-clamp-2 mb-4">
            {recipe.description[lang]}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-4 pt-3 border-t border-[#f5e6cc]">
            <div className="flex items-center gap-1.5 text-xs text-[#7a6452] font-body">
              <Clock size={13} className="text-[#c1704a]" />
              <span>{recipe.prepTime} {lang === 'ge' ? 'წთ' : 'min'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#7a6452] font-body">
              <ChefHat size={13} className="text-[#2d5a27]" />
              <span>{recipe.ingredients[lang].length} {lang === 'ge' ? 'ინგრ.' : 'ingr.'}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
