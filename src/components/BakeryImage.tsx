import React, { useState } from 'react';

// Fallback high-resolution culinary photography for every category & key item
export const DESSERT_FALLBACK_IMAGES: Record<string, string> = {
  'rubis-framboise': 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
  'opera-millesime': 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
  'saint-honore-vanille': 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
  'paris-brest-noisette': 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?auto=format&fit=crop&w=800&q=80',
  'croissant-pur-beurre': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=800&q=80',
  'tarte-citron-meringuee': 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
  'coffret-macarons-couture': 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=800&q=80',
  'pain-au-chocolat-gianduja': 'https://images.unsplash.com/photo-1623334044303-241021148842?auto=format&fit=crop&w=800&q=80',
  'hero': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
  'atelier': 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=1200&q=80',
  'default': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
};

interface BakeryImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  itemId?: string;
}

export const BakeryImage: React.FC<BakeryImageProps> = ({
  src,
  fallbackSrc,
  itemId,
  alt = 'Artisanal French pastry',
  className = '',
  style,
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(src);
  const [errorStage, setErrorStage] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // If src prop changes, reset
  React.useEffect(() => {
    setCurrentSrc(src);
    setErrorStage(0);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    if (errorStage === 0) {
      // Stage 1: Try fallbackSrc if provided
      if (fallbackSrc && fallbackSrc !== currentSrc) {
        setErrorStage(1);
        setCurrentSrc(fallbackSrc);
        return;
      }
      // If no fallbackSrc, try itemId or default CDN
      const cdnFallback = (itemId && DESSERT_FALLBACK_IMAGES[itemId]) || DESSERT_FALLBACK_IMAGES.default;
      if (cdnFallback !== currentSrc) {
        setErrorStage(2);
        setCurrentSrc(cdnFallback);
        return;
      }
      setErrorStage(3);
    } else if (errorStage === 1) {
      // Stage 2: Try CDN fallback
      const cdnFallback = (itemId && DESSERT_FALLBACK_IMAGES[itemId]) || DESSERT_FALLBACK_IMAGES.default;
      if (cdnFallback !== currentSrc) {
        setErrorStage(2);
        setCurrentSrc(cdnFallback);
        return;
      }
      setErrorStage(3);
    } else {
      // Stage 3: All network attempts failed
      setErrorStage(3);
    }
  };

  if (errorStage >= 3 || !currentSrc) {
    // Elegant SVG fallback with gold trim
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#FAF7F2] border border-[#E8E2D8] text-stone-500 p-4 text-center ${className}`}
        style={style}
        role="img"
        aria-label={alt}
      >
        <svg
          className="w-10 h-10 text-[#C5A059] mb-2 opacity-80"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2a3 3 0 0 0-3 3c0 .8.3 1.5.8 2H5a3 3 0 0 0-3 3v2h20v-2a3 3 0 0 0-3-3h-4.8c.5-.5.8-1.2.8-2a3 3 0 0 0-3-3z" />
          <path d="M4 12v6a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-6" />
          <line x1="12" y1="12" x2="12" y2="22" />
        </svg>
        <span className="font-serif text-xs text-stone-800 tracking-wide">{alt}</span>
        <span className="text-[10px] text-[#9E7D3B] uppercase tracking-widest mt-0.5">Maison Élysée</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      loading="lazy"
      decoding="async"
      className={`${className} ${!isLoaded ? 'opacity-90' : 'opacity-100'} transition-opacity duration-300`}
      style={style}
      {...props}
    />
  );
};
