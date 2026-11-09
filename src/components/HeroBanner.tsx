import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Sparkles } from 'lucide-react';
import { Banner } from '../types';

interface Props {
  banners: Banner[];
  onSelectCategorySlug?: (slug?: string) => void;
}

export const HeroBanner: React.FC<Props> = ({ banners, onSelectCategorySlug }) => {
  const activeBanners = banners.filter((b) => b.isActive).sort((a, b) => a.order - b.order);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const current = activeBanners[currentIndex];

  return (
    <section className="relative overflow-hidden bg-stone-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl">
      {/* Background image with subtle gradient overlay */}
      <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center">
        <img
          src={current.image}
          alt={current.title}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-40 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-transparent" />

        {/* Banner Content */}
        <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10">
          {current.badgeText && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold tracking-wider uppercase mb-4 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.badgeText}</span>
            </div>
          )}

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {current.title}
          </h1>

          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl">
            {current.subtitle}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <button
              onClick={() => onSelectCategorySlug?.(current.linkCategory)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-lg shadow-emerald-950/30 transition group"
            >
              <span>{current.buttonText || 'Conhecer Coleção'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Garantia de 100% vedação hermética</span>
            </div>
          </div>
        </div>

        {/* Carousel controls */}
        {activeBanners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition"
              aria-label="Banner anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-sm text-white flex items-center justify-center transition"
              aria-label="Próximo banner"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {activeBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentIndex ? 'w-8 bg-emerald-400' : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para banner ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
};
