import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { FRAMBOISE_IMAGE } from '../data/bakeryData';
import { BakeryImage } from './BakeryImage';
import { Gift, Check, Plus, Minus, ArrowRight, ShieldCheck, Sparkles, Clock } from 'lucide-react';

export const BookNowOrder: React.FC = () => {
  const { desserts, addToCart, setIsCartOpen, setActiveView } = useBakery();

  const [activeTab, setActiveTab] = useState<'box' | 'celebration'>('box');

  // Box Builder State
  const [boxSize, setBoxSize] = useState<number>(6); // 4, 6, 9
  const [selectedBoxPastries, setSelectedBoxPastries] = useState<Record<string, number>>({
    'rubis-framboise': 2,
    'opera-millesime': 2,
    'saint-honore-vanille': 2,
  });
  const [giftCardNote, setGiftCardNote] = useState('');

  // Celebration Cake State
  const [selectedCakeId, setSelectedCakeId] = useState<string>('rubis-framboise');
  const [cakeSize, setCakeSize] = useState<'6-8 portions' | '10-12 portions'>('6-8 portions');
  const [customPlaque, setCustomPlaque] = useState('');

  const currentBoxCount = Object.values(selectedBoxPastries).reduce((a, b) => a + b, 0);

  const boxPricing: Record<number, number> = {
    4: 58.0,
    6: 84.0,
    9: 122.0,
  };

  const handleUpdateBoxItem = (dessertId: string, delta: number) => {
    const current = selectedBoxPastries[dessertId] || 0;
    const next = Math.max(0, current + delta);

    if (delta > 0 && currentBoxCount >= boxSize) {
      return; // Box is full
    }

    const updated = { ...selectedBoxPastries, [dessertId]: next };
    if (next === 0) {
      delete updated[dessertId];
    }
    setSelectedBoxPastries(updated);
  };

  const handleAddBoxToCart = () => {
    const itemsList = Object.entries(selectedBoxPastries).map(([id, qty]) => {
      const d = desserts.find((item) => item.id === id);
      return { dessertId: id, name: d?.name || 'Artisanal Pastry', quantity: qty };
    });

    addToCart({
      id: `box-${Date.now()}`,
      type: 'curated-box',
      dessertName: `Coffret Couture (${boxSize} Pièces)`,
      unitPrice: boxPricing[boxSize],
      quantity: 1,
      boxItems: itemsList,
      boxSize,
      customInscription: giftCardNote.trim() || undefined,
      imageUrl: FRAMBOISE_IMAGE,
    });
    setIsCartOpen(true);
  };

  const handleAddCelebrationCake = () => {
    const cake = desserts.find((d) => d.id === selectedCakeId) || desserts[0];
    const price = cakeSize === '6-8 portions' ? 85.0 : 135.0;

    addToCart({
      id: `cake-${Date.now()}`,
      type: 'celebration-entremet',
      dessertId: cake.id,
      dessertName: `Grand ${cake.name} (${cakeSize})`,
      unitPrice: price,
      quantity: 1,
      cakeSize,
      customInscription: customPlaque.trim() || undefined,
      imageUrl: cake.imageUrl,
    });
    setIsCartOpen(true);
  };

  const selectedCake = desserts.find((d) => d.id === selectedCakeId) || desserts[0];

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
          Commande & Préréservation en Ligne
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight">
          Book Now: Luxury Pastry & Celebration Pre-Orders
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light">
          Reserve custom hand-packed coffrets or bespoke celebration gâteaux for your private dinner parties and events. Crafted fresh on the day of pickup.
        </p>

        {/* Tab switch */}
        <div className="pt-4 flex justify-center">
          <div className="inline-flex p-1 bg-stone-100 border border-[#E8E2D8]">
            <button
              onClick={() => setActiveTab('box')}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'box'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Curated Dessert Box Builder
            </button>
            <button
              onClick={() => setActiveTab('celebration')}
              className={`px-5 py-2 text-xs uppercase tracking-wider font-semibold transition-colors cursor-pointer ${
                activeTab === 'celebration'
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Grand Celebration Gâteaux
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'box' ? (
        /* Box Builder Flow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 8 Cols: Pastry Selection Grid */}
          <div className="lg:col-span-8 space-y-8">
            {/* Step 1: Box Size */}
            <div className="p-6 bg-white border border-[#E8E2D8] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl text-stone-900">
                  01. Choose Your Box Format
                </h3>
                <span className="text-xs text-stone-400">Embossed gold foil coffret</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { size: 4, label: 'Le Petit Coffret', price: 58, desc: 'Ideal for intimate couples' },
                  { size: 6, label: 'Le Coffret Signature', price: 84, desc: 'Most popular tasting selection' },
                  { size: 9, label: 'Le Grand Élysée', price: 122, desc: 'Dinner party centerpiece' },
                ].map((tier) => (
                  <button
                    key={tier.size}
                    type="button"
                    onClick={() => {
                      setBoxSize(tier.size);
                      // Clear excess items if shrinking
                      if (currentBoxCount > tier.size) {
                        setSelectedBoxPastries({});
                      }
                    }}
                    className={`p-4 text-left border transition-all cursor-pointer ${
                      boxSize === tier.size
                        ? 'border-[#C5A059] bg-[#FAF7F2] ring-1 ring-[#C5A059]'
                        : 'border-[#E8E2D8] bg-white hover:border-stone-400'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span>{tier.label}</span>
                      <span className="font-mono text-stone-900">${tier.price}</span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">{tier.size} artisanal pieces</p>
                    <p className="text-[11px] text-stone-400 mt-2">{tier.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Fill the Box */}
            <div className="p-6 bg-white border border-[#E8E2D8] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xl text-stone-900">
                    02. Hand-Pick Your Pastries
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Select exactly {boxSize} pastries to complete your bespoke box.
                  </p>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-semibold tabular-nums ${
                    currentBoxCount === boxSize ? 'text-emerald-700' : 'text-stone-900'
                  }`}>
                    {currentBoxCount} of {boxSize} Selected
                  </span>
                </div>
              </div>

              {/* Visual box slots progress */}
              <div className="w-full bg-stone-100 h-2 flex gap-1 p-0.5">
                {[...Array(boxSize)].map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-full flex-1 transition-colors ${
                      idx < currentBoxCount ? 'bg-[#9E7D3B]' : 'bg-stone-200'
                    }`}
                  />
                ))}
              </div>

              {/* Pastry Selector List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {desserts.map((dessert) => {
                  const qty = selectedBoxPastries[dessert.id] || 0;
                  return (
                    <div
                      key={dessert.id}
                      className="p-3.5 border border-[#E8E2D8] flex items-center justify-between gap-3 bg-[#FAF7F2]"
                    >
                      <div className="flex items-center gap-3">
                        <BakeryImage
                          src={dessert.imageUrl}
                          itemId={dessert.id}
                          alt={dessert.name}
                          className="w-12 h-12 object-cover border border-[#E8E2D8]"
                        />
                        <div>
                          <p className="font-medium text-xs text-stone-900 leading-tight">
                            {dessert.name}
                          </p>
                          <p className="text-[11px] text-stone-500 italic mt-0.5 font-serif">
                            {dessert.frenchName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center border border-[#E8E2D8] bg-white">
                        <button
                          type="button"
                          onClick={() => handleUpdateBoxItem(dessert.id, -1)}
                          disabled={qty === 0}
                          className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-semibold tabular-nums text-stone-900">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateBoxItem(dessert.id, 1)}
                          disabled={currentBoxCount >= boxSize}
                          className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Card Note */}
            <div className="p-6 bg-white border border-[#E8E2D8] space-y-3">
              <h3 className="font-serif text-xl text-stone-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-[#9E7D3B]" />
                <span>03. Handwritten Calligraphy Card (Complimentary)</span>
              </h3>
              <p className="text-xs text-stone-500">
                Our in-house calligrapher will handwrite your note on heavy deckled-edge cotton cardstock.
              </p>
              <textarea
                rows={2}
                placeholder="Enter personal note or greeting for the recipient..."
                value={giftCardNote}
                onChange={(e) => setGiftCardNote(e.target.value)}
                className="w-full p-3 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Right 4 Cols: Box Summary & Action */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 bg-white border border-[#E8E2D8] shadow-sm space-y-5">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#9E7D3B] block">
                Boutique Pre-Order Summary
              </span>
              <h3 className="font-serif text-2xl text-stone-900">
                Coffret Couture {boxSize} Pièces
              </h3>

              <div className="space-y-2 text-xs py-3 border-y border-[#E8E2D8]">
                <div className="flex justify-between text-stone-600">
                  <span>Selected Pieces:</span>
                  <span className="font-semibold text-stone-900 tabular-nums">
                    {currentBoxCount} / {boxSize}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Coffret Packaging:</span>
                  <span className="text-stone-900">Luxury Gold Debossed</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Preservation:</span>
                  <span className="text-stone-900">Best consumed within 48h</span>
                </div>
              </div>

              {/* Items Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <p className="font-medium text-stone-800 text-[11px] uppercase tracking-wider">
                  Box Contents:
                </p>
                {Object.keys(selectedBoxPastries).length === 0 ? (
                  <p className="italic text-stone-400 text-xs">No pastries added yet</p>
                ) : (
                  Object.entries(selectedBoxPastries).map(([id, qty]) => {
                    const d = desserts.find((item) => item.id === id);
                    return (
                      <div key={id} className="flex justify-between text-[11px]">
                        <span>{d?.name}</span>
                        <span className="font-mono tabular-nums">×{qty}</span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="pt-3 border-t border-[#E8E2D8] flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Box Price</span>
                <span className="font-serif text-3xl text-stone-900 tabular-nums">
                  ${boxPricing[boxSize].toFixed(2)}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddBoxToCart}
                disabled={currentBoxCount < boxSize}
                className="w-full py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] disabled:opacity-40 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                {currentBoxCount < boxSize ? (
                  `Select ${boxSize - currentBoxCount} More Pastries`
                ) : (
                  <>
                    <span>Add Box to Bag</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Prepared cold-packed for guaranteed pristine condition</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grand Celebration Cake Flow */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 bg-white border border-[#E8E2D8] space-y-4">
              <h3 className="font-serif text-xl text-stone-900">
                01. Select Your Signature Entremet
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {desserts.slice(0, 3).map((cake) => (
                  <button
                    key={cake.id}
                    type="button"
                    onClick={() => setSelectedCakeId(cake.id)}
                    className={`p-4 text-left border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedCakeId === cake.id
                        ? 'border-[#C5A059] bg-[#FAF7F2] ring-1 ring-[#C5A059]'
                        : 'border-[#E8E2D8] bg-white hover:border-stone-400'
                    }`}
                  >
                    <div>
                      <div className="aspect-[4/3] bg-stone-100 mb-3 overflow-hidden">
                        <BakeryImage
                          src={cake.imageUrl}
                          itemId={cake.id}
                          alt={cake.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h4 className="font-serif text-base text-stone-900 leading-tight">
                        {cake.name}
                      </h4>
                      <p className="text-[11px] text-[#9E7D3B] italic font-serif mt-0.5">
                        {cake.frenchName}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Size & Portions */}
            <div className="p-6 bg-white border border-[#E8E2D8] space-y-4">
              <h3 className="font-serif text-xl text-stone-900">
                02. Choose Serving Size
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setCakeSize('6-8 portions')}
                  className={`p-4 border text-left cursor-pointer transition-colors ${
                    cakeSize === '6-8 portions'
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-[#E8E2D8] bg-white text-stone-900 hover:border-stone-400'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span>6 to 8 Portions (20cm diameter)</span>
                    <span className="font-serif text-base">$85.00</span>
                  </div>
                  <p className={`text-xs mt-1 ${cakeSize === '6-8 portions' ? 'text-stone-300' : 'text-stone-500'}`}>
                    Ideal for intimate celebrations and family dinners.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setCakeSize('10-12 portions')}
                  className={`p-4 border text-left cursor-pointer transition-colors ${
                    cakeSize === '10-12 portions'
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-[#E8E2D8] bg-white text-stone-900 hover:border-stone-400'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span>10 to 12 Portions (26cm diameter)</span>
                    <span className="font-serif text-base">$135.00</span>
                  </div>
                  <p className={`text-xs mt-1 ${cakeSize === '10-12 portions' ? 'text-stone-300' : 'text-stone-500'}`}>
                    Grand presentation size for weddings, galas, and milestones.
                  </p>
                </button>
              </div>
            </div>

            {/* Custom Calligraphy Plaque */}
            <div className="p-6 bg-white border border-[#E8E2D8] space-y-3">
              <h3 className="font-serif text-xl text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#9E7D3B]" />
                <span>03. Valrhona Dark Chocolate Plaque Inscription</span>
              </h3>
              <p className="text-xs text-stone-500">
                Piped in pure white chocolate calligraphy on a dark grand cru chocolate plaque.
              </p>
              <input
                type="text"
                placeholder="e.g. Joyeux Anniversaire Madeleine"
                value={customPlaque}
                maxLength={45}
                onChange={(e) => setCustomPlaque(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
              />
              <span className="text-[11px] text-stone-400 block text-right">
                {45 - customPlaque.length} characters remaining
              </span>
            </div>
          </div>

          {/* Right 4 Cols: Cake Summary */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 bg-white border border-[#E8E2D8] shadow-sm space-y-5">
              <span className="text-[10px] font-semibold tracking-widest uppercase text-[#9E7D3B] block">
                Bespoke Cake Order
              </span>
              <h3 className="font-serif text-2xl text-stone-900 leading-snug">
                {selectedCake.name}
              </h3>
              <p className="text-xs text-stone-500 -mt-2 italic font-serif">
                {selectedCake.frenchName}
              </p>

              <div className="space-y-2 text-xs py-3 border-y border-[#E8E2D8]">
                <div className="flex justify-between text-stone-600">
                  <span>Selected Size:</span>
                  <span className="font-semibold text-stone-900">{cakeSize}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Plaque Inscription:</span>
                  <span className="text-stone-900 italic">
                    {customPlaque ? `"${customPlaque}"` : 'None requested'}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Advance Notice:</span>
                  <span className="text-stone-900">Requires 24h bake lead</span>
                </div>
              </div>

              <div className="pt-2 flex items-baseline justify-between">
                <span className="text-xs uppercase tracking-wider text-stone-500 font-medium">Price</span>
                <span className="font-serif text-3xl text-stone-900 tabular-nums">
                  ${cakeSize === '6-8 portions' ? '85.00' : '135.00'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleAddCelebrationCake}
                className="w-full py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>Add Cake to Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-stone-400 flex items-center justify-center gap-1.5 text-center">
                <Clock className="w-3.5 h-3.5 text-[#9E7D3B]" />
                <span>Includes insulated thermo-protective gold cake trunk</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
