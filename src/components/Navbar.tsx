import React, { useState, useEffect } from 'react';
import { useBakery } from '../context/BakeryContext';
import { ShoppingBag, Calendar, Star } from 'lucide-react';
import { motion } from 'motion/react';

export const Navbar: React.FC = () => {
  const { activeView, setActiveView, cart, setIsCartOpen } = useBakery();
  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`sticky top-0 z-40 bg-gradient-to-r from-[#FAF1DC]/95 via-[#F5E5C0]/95 to-[#FAF1DC]/95 backdrop-blur-md border-b border-[#D8BE8A] border-t border-[#C5A059]/30 transition-all duration-300 ${
        isScrolled
          ? 'shadow-[0_8px_30px_-6px_rgba(180,140,60,0.22)] py-0.5'
          : 'shadow-[0_4px_20px_-6px_rgba(180,140,60,0.12)]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveView('showcase')}
          className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C5A059] rounded"
        >
          <span className="font-serif font-bold text-2xl md:text-3xl tracking-tight text-stone-900 group-hover:text-[#9E7D3B] transition-colors whitespace-nowrap shrink-0">
            Maison Élysée
          </span>
        </button>

        {/* Zone 2: 4 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-stone-600">
          <button
            onClick={() => setActiveView('showcase')}
            className={`cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors relative ${
              activeView === 'showcase' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            Showcase
            {activeView === 'showcase' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059]" />
            )}
          </button>

          <button
            onClick={() => setActiveView('about-us')}
            className={`cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors relative ${
              activeView === 'about-us' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            About Us
            {activeView === 'about-us' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059]" />
            )}
          </button>

          <button
            onClick={() => setActiveView('reviews-hub')}
            className={`cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors relative flex items-center gap-1.5 ${
              activeView === 'reviews-hub' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            <Star className="w-3.5 h-3.5 text-[#C5A059]" fill="currentColor" />
            <span>Reviews</span>
            {activeView === 'reviews-hub' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059]" />
            )}
          </button>

          <button
            onClick={() => setActiveView('table-booking')}
            className={`cursor-pointer whitespace-nowrap shrink-0 py-1 transition-colors relative flex items-center gap-1.5 ${
              activeView === 'table-booking' ? 'text-stone-900 font-semibold' : 'hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>Book Table</span>
            {activeView === 'table-booking' && (
              <span className="absolute bottom-0 left-0 w-full h-[1.5px] bg-[#C5A059]" />
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + cart drawer trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2.5 text-stone-700 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            aria-label={`Shopping bag with ${totalCartCount} items`}
          >
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C5A059] text-white text-xs font-semibold rounded-full flex items-center justify-center tabular-nums shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveView('order-now')}
            className="px-5 py-2.5 text-[10px] font-semibold tracking-wider uppercase text-white bg-stone-900 hover:bg-[#9E7D3B] rounded-none transition-colors duration-200 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.header>
  );
};
