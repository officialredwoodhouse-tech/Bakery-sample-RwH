import React, { useState, useRef } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Dessert } from '../types/bakery';
import { BakeryImage } from './BakeryImage';
import { Star, Plus, Eye, Search, Sparkles, ChevronLeft, ChevronRight, LayoutGrid, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export const DessertShowcase: React.FC = () => {
  const { desserts, setSelectedDessertModal, addToCart, getDessertStats, setActiveView } = useBakery();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<string>('all');
  const [mobileViewMode, setMobileViewMode] = useState<'slider' | 'grid'>('slider');
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const sliderRef = useRef<HTMLDivElement>(null);

  const categories = [
    { id: 'all', label: 'All Collections' },
    { id: 'entremets', label: 'Entremets & Gâteaux' },
    { id: 'tartes', label: 'Tartes & Choux' },
    { id: 'viennoiserie', label: 'Viennoiserie' },
    { id: 'coffrets', label: 'Macarons & Coffrets' },
  ];

  const filteredDesserts = desserts.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.frenchName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tastingNotes.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesDietary =
      dietaryFilter === 'all' ||
      item.dietary.some((d) => d.toLowerCase().includes(dietaryFilter.toLowerCase()));

    return matchesCategory && matchesSearch && matchesDietary;
  });

  const handleSliderScroll = () => {
    if (sliderRef.current && sliderRef.current.firstElementChild) {
      const scrollPos = sliderRef.current.scrollLeft;
      const cardWidth = (sliderRef.current.firstElementChild as HTMLElement).offsetWidth + 20;
      const index = Math.round(scrollPos / cardWidth);
      setActiveSlideIndex(Math.min(Math.max(0, index), filteredDesserts.length - 1));
    }
  };

  const scrollSlider = (direction: 'left' | 'right') => {
    if (sliderRef.current && sliderRef.current.firstElementChild) {
      const cardWidth = (sliderRef.current.firstElementChild as HTMLElement).offsetWidth + 20;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -cardWidth : cardWidth,
        behavior: 'smooth',
      });
    }
  };

  const jumpToSlide = (index: number) => {
    if (sliderRef.current && sliderRef.current.children[index]) {
      const targetElement = sliderRef.current.children[index] as HTMLElement;
      sliderRef.current.scrollTo({
        left: targetElement.offsetLeft - 24,
        behavior: 'smooth',
      });
      setActiveSlideIndex(index);
    }
  };

  const handleQuickAdd = (dessert: Dessert, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      id: `cart-${dessert.id}-${Date.now()}`,
      type: 'single',
      dessertId: dessert.id,
      dessertName: dessert.name,
      unitPrice: dessert.price,
      quantity: 1,
      imageUrl: dessert.imageUrl,
    });
  };

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#E8E2D8]">
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
            Le Menu de la Saison
          </span>
          <h2 className="font-serif text-3xl md:text-4xl text-stone-900 mt-1">
            Handcrafted Architectural Desserts
          </h2>
          <p className="text-[13px] text-stone-500 mt-2 max-w-xl">
            Each creation is sculpted with millimeter precision, layering unexpected textural harmony and uncompromised French technique.
          </p>
        </div>

        {/* Search & Dietary Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search flavor or pastry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#E8E2D8] focus:border-stone-900 focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-1 p-0.5 bg-stone-100 border border-[#E8E2D8] text-xs">
            <button
              onClick={() => setDietaryFilter('all')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                dietaryFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              All Diet
            </button>
            <button
              onClick={() => setDietaryFilter('gluten')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${
                dietaryFilter === 'gluten'
                  ? 'bg-white text-stone-900 shadow-xs font-medium'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              Gluten-Conscious
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs (Segmented Button Controls) */}
      <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-stone-900 text-white'
                : 'bg-white text-stone-600 hover:text-stone-900 border border-[#E8E2D8]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Mobile Slider / Grid View Controller & Progress Strip */}
      <div className="md:hidden flex items-center justify-between pb-4 pt-1 text-xs">
        <div className="flex items-center gap-2 text-stone-600">
          <span className="font-semibold text-stone-900 font-mono tabular-nums">
            {activeSlideIndex + 1} / {filteredDesserts.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center border border-[#E8E2D8] bg-white p-0.5">
            <button
              onClick={() => setMobileViewMode('slider')}
              className={`p-1.5 transition-colors cursor-pointer ${
                mobileViewMode === 'slider' ? 'bg-stone-900 text-white' : 'text-stone-500'
              }`}
              title="Carousel Slider"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileViewMode('grid')}
              className={`p-1.5 transition-colors cursor-pointer ${
                mobileViewMode === 'grid' ? 'bg-stone-900 text-white' : 'text-stone-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Touch Arrow Controls */}
          {mobileViewMode === 'slider' && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => scrollSlider('left')}
                disabled={activeSlideIndex === 0}
                className="p-1.5 bg-white border border-[#E8E2D8] text-stone-700 hover:text-stone-900 disabled:opacity-30 cursor-pointer shadow-2xs"
                aria-label="Previous dessert"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollSlider('right')}
                disabled={activeSlideIndex >= filteredDesserts.length - 1}
                className="p-1.5 bg-white border border-[#E8E2D8] text-stone-700 hover:text-stone-900 disabled:opacity-30 cursor-pointer shadow-2xs"
                aria-label="Next dessert"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3-Column Dessert Grid on Desktop, Touch Slider on Mobile */}
      {filteredDesserts.length === 0 ? (
        <div className="py-20 text-center bg-white border border-[#E8E2D8] p-8">
          <p className="font-serif text-xl text-stone-800">No creations match your selection</p>
          <p className="text-xs text-stone-500 mt-2">Try clearing your search query or dietary filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setDietaryFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs uppercase tracking-wider bg-stone-900 text-white cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          <div
            ref={sliderRef}
            onScroll={handleSliderScroll}
            className={
              mobileViewMode === 'slider'
                ? "flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-none no-scrollbar pb-4 -mx-6 px-6 md:mx-0 md:px-0 touch-pan-x scroll-smooth"
                : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            }
          >
            {filteredDesserts.map((dessert, index) => {
              const stats = getDessertStats(dessert.id);
              return (
                <motion.div
                  key={dessert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.45, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setSelectedDessertModal(dessert)}
                  className={`group flex flex-col bg-white border border-[#E8E2D8] hover:border-stone-400 transition-all duration-300 cursor-pointer overflow-hidden shadow-xs hover:shadow-md ${
                    mobileViewMode === 'slider'
                      ? 'w-[84vw] sm:w-[320px] shrink-0 snap-center md:w-auto md:shrink'
                      : 'w-full'
                  }`}
                >
                  {/* Image Container: 65-70% visual focus */}
                  <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                    <BakeryImage
                      src={dessert.imageUrl}
                      itemId={dessert.id}
                      alt={dessert.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {dessert.featured && (
                      <div className="absolute top-3 left-3 bg-[#FAF7F2]/95 backdrop-blur-xs px-2.5 py-1 text-[11px] font-medium tracking-wider uppercase text-[#9E7D3B] border border-[#E8E2D8] flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        <span>Signature</span>
                      </div>
                    )}

                    {/* Hover action overlay */}
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <span className="px-3 py-1.5 bg-white text-stone-900 text-xs font-semibold tracking-wider uppercase shadow-md flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" />
                        <span>View & Reviews</span>
                      </span>
                    </div>
                  </div>

                  {/* Card Content & Metadata */}
                  <div className="p-6 flex flex-col flex-1 justify-between">
                    <div>
                      {/* Unboxed Metadata with · separator */}
                      <div className="flex items-center justify-between text-xs text-stone-500 mb-1.5">
                        <span className="capitalize">{dessert.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{dessert.servingSize}</span>
                      </div>

                      <h3 className="font-serif text-xl text-stone-900 group-hover:text-[#9E7D3B] transition-colors leading-snug">
                        {dessert.name}
                      </h3>
                      <p className="text-xs text-[#9E7D3B] italic font-serif mt-0.5">
                        {dessert.frenchName}
                      </p>

                      <p className="text-xs text-stone-600 line-clamp-2 mt-2.5 font-light leading-relaxed">
                        {dessert.description}
                      </p>

                      {/* Tasting notes as unboxed typographic line */}
                      <div className="mt-3 text-[11px] text-stone-500">
                        <span className="text-stone-400">Notes: </span>
                        {dessert.tastingNotes.slice(0, 2).join(' · ')}
                      </div>
                    </div>

                    {/* Rating + Price + Quick Add Row */}
                    <div className="mt-5 pt-4 border-t border-[#E8E2D8] flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 text-[#C5A059] fill-current" />
                          <span className="font-semibold text-stone-900 tabular-nums">
                            {stats.averageRating}
                          </span>
                          <span className="text-stone-400 text-[11px]">
                            ({stats.totalReviews})
                          </span>
                        </div>
                        <span className="font-serif text-lg text-stone-900 tabular-nums mt-0.5">
                          ${dessert.price.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={(e) => handleQuickAdd(dessert, e)}
                        className="px-3.5 py-2 bg-stone-900 text-white text-xs font-medium uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors flex items-center gap-1 cursor-pointer"
                        title="Add to order bag"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Pagination Indicator Dots */}
          {mobileViewMode === 'slider' && filteredDesserts.length > 1 && (
            <div className="md:hidden flex items-center justify-center gap-1.5 pt-2 pb-4">
              {filteredDesserts.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => jumpToSlide(dotIdx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    activeSlideIndex === dotIdx
                      ? 'w-6 h-1.5 bg-[#9E7D3B]'
                      : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
                  }`}
                  aria-label={`Jump to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Bottom Booking Encouragement with Scroll In View */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="mt-16 p-8 bg-[#F5EFE6] border border-[#E8E2D8] flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
            Salon de Thé Experience
          </span>
          <h3 className="font-serif text-2xl text-stone-900 mt-1">
            Experience our desserts fresh from the oven in our Paris salons
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Tables in The Glass Orangerie and Grand Salon feature bespoke tea pairings and plated service.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveView('table-booking')}
            className="px-6 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors cursor-pointer"
          >
            Reserve Your Table
          </button>
          <button
            onClick={() => setActiveView('order-now')}
            className="px-6 py-3 border border-stone-800 text-stone-900 text-[12px] font-semibold uppercase tracking-wider hover:bg-stone-900 hover:text-white transition-colors cursor-pointer"
          >
            Bespoke Cake Pre-Order
          </button>
        </div>
      </motion.div>
    </section>
  );
};
