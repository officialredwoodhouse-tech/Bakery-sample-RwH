import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { HERO_IMAGE } from '../data/bakeryData';
import { BakeryImage } from './BakeryImage';
import { ArrowRight, Calendar, Star, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const HeroSection: React.FC = () => {
  const { setActiveView, reviews } = useBakery();
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)).toFixed(1);

  return (
    <section className="relative overflow-hidden border-b border-[#E8E2D8] bg-[#FAF7F2]">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline & Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
              <span className="text-[11px]" style={{ fontSize: '11px' }}>Haute Pâtisserie Parisienne</span>
              <span aria-hidden="true">·</span>
              <span>Fondée en 1924</span>
              <span aria-hidden="true">·</span>
              <span>Salon de Thé</span>
            </div>

            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-stone-900 leading-[1.08] tracking-tight text-balance">
              Where French pastry architecture meets sensory indulgence.
            </h1>

            <p className="text-[13px] text-stone-600 font-light max-w-2xl leading-relaxed">
              Every creation at Maison Élysée is a delicate balance of slow-fermented heritage doughs, single-origin grand cru chocolates, and seasonal Rhône fruits—handcrafted daily for our salons and private celebrations.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => setActiveView('order-now')}
                className="px-7 py-3.5 bg-stone-900 text-white text-xs font-semibold tracking-wider uppercase hover:bg-[#9E7D3B] transition-colors duration-200 flex items-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Book Now / Order Boxes</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('table-booking')}
                className="px-6 py-3.5 border border-stone-800 text-stone-900 text-xs font-semibold tracking-wider uppercase hover:bg-stone-900 hover:text-white transition-colors duration-200 flex items-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Your Table</span>
              </button>
            </div>

            {/* Social Proof & Trust Strip */}
            <div className="pt-6 border-t border-[#E8E2D8] flex flex-wrap items-center gap-6 text-xs text-stone-600">
              <div
                onClick={() => setActiveView('reviews-hub')}
                className="flex items-center gap-2 cursor-pointer group"
              >
                <div className="flex text-[#C5A059]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="font-semibold text-stone-900 group-hover:text-[#9E7D3B] transition-colors tabular-nums">
                  {avgRating} / 5.0
                </span>
                <span className="text-stone-500">· {reviews.length} Verified Reviews</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-stone-500">
                <Clock className="w-3.5 h-3.5 text-[#9E7D3B]" />
                <span>Daily Bake from 06:30</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 text-stone-500">
                <Sparkles className="w-3.5 h-3.5 text-[#9E7D3B]" />
                <span>3-Day Lamination</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Visual Artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/3] lg:aspect-[5/4] overflow-hidden rounded-sm shadow-md bg-stone-200 border border-[#E8E2D8] flex items-center justify-center">
              <BakeryImage
                src={HERO_IMAGE}
                fallbackSrc="/images/hero.jpg"
                itemId="hero"
                alt="Maison Élysée boutique interior showcasing dessert cloches and marble display"
                style={{ height: '226.201px', width: '311.442px' }}
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-stone-950/10 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 text-white p-3 backdrop-blur-sm bg-stone-900/40 rounded-sm border border-white/10">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-serif text-sm tracking-wide">Le Salon Principal · Place Vendôme</span>
                  <span
                    className="text-[#C5A059] font-medium"
                    style={{ fontSize: '12px', lineHeight: '15px' }}
                  >
                    Tasting Room Open
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* 4-Column Artisanal Pillar Bar with Scroll In View */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="border-t border-[#E8E2D8] bg-[#F5EFE6]"
      >
        <div className="max-w-7xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-[#E8E2D8]">
          <div className="px-2 pt-2 md:pt-0">
            <p className="font-serif text-lg text-stone-900">AOP Charentes</p>
            <p className="text-xs text-stone-500 mt-0.5">84% churned cultured butter</p>
          </div>
          <div className="px-2 pt-2 md:pt-0">
            <p className="font-serif text-lg text-stone-900">Valrhona Grand Cru</p>
            <p className="text-xs text-stone-500 mt-0.5">Single-origin sustainable cacao</p>
          </div>
          <div className="px-2 pt-2 md:pt-0">
            <p className="font-serif text-lg text-stone-900">72-Hour Ferment</p>
            <p className="text-xs text-stone-500 mt-0.5">Slow cold dough development</p>
          </div>
          <div className="px-2 pt-2 md:pt-0">
            <p className="font-serif text-lg text-stone-900">Zero Artificial Additives</p>
            <p className="text-xs text-stone-500 mt-0.5">100% natural fruit glazes</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
