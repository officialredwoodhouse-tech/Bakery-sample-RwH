import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { Dessert } from '../types/bakery';
import { X, Star, ThumbsUp, Check, ShieldCheck, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';

interface Props {
  dessert: Dessert;
  onClose: () => void;
}

export const DessertDetailModal: React.FC<Props> = ({ dessert, onClose }) => {
  const { reviews, addReview, voteHelpful, getDessertStats, addToCart, setActiveView } = useBakery();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  // Review Form State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const stats = getDessertStats(dessert.id);
  const dessertReviews = reviews.filter((r) => r.dessertId === dessert.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    addReview({
      dessertId: dessert.id,
      authorName: authorName.trim() || 'Verified Patissier Enthusiast',
      authorLocation: authorLocation.trim() || 'Paris, France',
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    });

    setReviewSubmitted(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setReviewSubmitted(false);
      setReviewTitle('');
      setReviewComment('');
      setActiveTab('reviews');
    }, 1200);
  };

  const handleAddToCart = () => {
    addToCart({
      id: `cart-${dessert.id}-${Date.now()}`,
      type: 'single',
      dessertId: dessert.id,
      dessertName: dessert.name,
      unitPrice: dessert.price,
      quantity,
      imageUrl: dessert.imageUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-white border border-[#E8E2D8] shadow-2xl my-8 overflow-hidden text-stone-900 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-full transition-colors cursor-pointer border border-[#E8E2D8]"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Visual Artwork */}
          <div className="md:col-span-5 bg-stone-100 relative min-h-[280px] md:min-h-full">
            <img
              src={dessert.imageUrl}
              alt={dessert.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/40 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
              <span className="font-serif text-sm block">{dessert.frenchName}</span>
              <span className="text-stone-300 text-[11px]">Freshly crafted daily · Lead time {dessert.leadTimeHours}h</span>
            </div>
          </div>

          {/* Right Column: Details & Reviews */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Status */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="uppercase tracking-wider text-[#9E7D3B] font-semibold">{dessert.category}</span>
                <span className="font-mono tabular-nums">{dessert.servingSize}</span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-stone-900">
                {dessert.name}
              </h2>
              <p className="font-serif italic text-sm text-[#9E7D3B]">
                {dessert.frenchName}
              </p>

              {/* Price & Rating Summary */}
              <div className="mt-4 flex items-center justify-between pb-4 border-b border-[#E8E2D8]">
                <div className="font-serif text-2xl text-stone-900 tabular-nums">
                  ${dessert.price.toFixed(2)}
                </div>

                <div 
                  onClick={() => setActiveTab('reviews')}
                  className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex text-[#C5A059]">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(stats.averageRating) ? 'fill-current' : 'text-stone-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-xs tabular-nums text-stone-900">
                    {stats.averageRating}
                  </span>
                  <span className="text-xs text-stone-500">
                    ({stats.totalReviews} reviews)
                  </span>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-[#E8E2D8] mt-4">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-2.5 px-4 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer relative ${
                    activeTab === 'details' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Tasting & Craft
                  {activeTab === 'details' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900" />
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`pb-2.5 px-4 text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer relative ${
                    activeTab === 'reviews' ? 'text-stone-900' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  Customer Reviews ({dessertReviews.length})
                  {activeTab === 'reviews' && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-stone-900" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' ? (
                <div className="py-4 space-y-4 text-xs text-stone-600 leading-relaxed">
                  <p className="font-light">{dessert.longDescription}</p>

                  <div>
                    <h4 className="font-semibold text-stone-900 mb-1 tracking-wider uppercase text-[11px]">
                      Flavor Profile & Notes
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dessert.tastingNotes.map((note, idx) => (
                        <span key={idx} className="text-stone-700">
                          {idx > 0 && <span className="text-stone-400 mr-2">·</span>}
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#E8E2D8] grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1 tracking-wider uppercase text-[11px]">
                        Allergen Information
                      </h4>
                      <p className="text-stone-500">{dessert.allergens.join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-stone-900 mb-1 tracking-wider uppercase text-[11px]">
                        Dietary Profile
                      </h4>
                      <p className="text-stone-500">{dessert.dietary.join(', ')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-4 space-y-6">
                  {/* Reviews Summary Header */}
                  <div className="bg-[#FAF7F2] p-4 border border-[#E8E2D8] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif text-3xl font-medium text-stone-900 tabular-nums">
                          {stats.averageRating}
                        </span>
                        <div className="text-[#C5A059] flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < Math.round(stats.averageRating) ? 'fill-current' : 'text-stone-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Based on {stats.totalReviews} verified patron reviews
                      </p>
                    </div>

                    <button
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      className="px-4 py-2 bg-stone-900 text-white text-xs uppercase tracking-wider font-medium hover:bg-[#9E7D3B] transition-colors cursor-pointer"
                    >
                      {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                    </button>
                  </div>

                  {/* Review Submission Form */}
                  {showReviewForm && (
                    <form
                      onSubmit={handleReviewSubmit}
                      className="p-5 bg-white border border-[#C5A059] shadow-sm space-y-4"
                    >
                      <h4 className="font-serif text-lg text-stone-900">
                        Share Your Tasting Feedback
                      </h4>

                      {/* Interactive Star Picker */}
                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">
                          Your Rating
                        </label>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 cursor-pointer focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  (hoverRating || reviewRating) >= star
                                    ? 'text-[#C5A059] fill-current'
                                    : 'text-stone-300'
                                }`}
                              />
                            </button>
                          ))}
                          <span className="ml-2 text-xs font-semibold text-stone-800">
                            {reviewRating} of 5 Stars
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs text-stone-600 mb-1">Your Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Jean-Luc V."
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-stone-600 mb-1">Location (optional)</label>
                          <input
                            type="text"
                            placeholder="e.g. Paris, France"
                            value={authorLocation}
                            onChange={(e) => setAuthorLocation(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-stone-600 mb-1">Headline Summary</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Sublime raspberry acidity and velvet texture"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-stone-600 mb-1">Detailed Review & Tasting Notes</label>
                        <textarea
                          rows={3}
                          required
                          placeholder="Describe the layers, aroma, texture, and your pairing experience..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="w-full px-3 py-1.5 text-xs border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[11px] text-stone-500 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Publishes immediately to verified reviews</span>
                        </span>

                        <button
                          type="submit"
                          disabled={reviewSubmitted}
                          className="px-5 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {reviewSubmitted ? (
                            <span className="flex items-center gap-1">
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Review Posted!</span>
                            </span>
                          ) : (
                            'Submit Review'
                          )}
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Reviews List */}
                  <div className="space-y-4 max-h-[260px] overflow-y-auto pr-2">
                    {dessertReviews.length === 0 ? (
                      <p className="text-xs text-stone-500 italic py-4">
                        Be the first connoisseur to review this dessert!
                      </p>
                    ) : (
                      dessertReviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-3.5 bg-white border border-[#E8E2D8] space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-stone-900">
                                {rev.authorName}
                              </span>
                              {rev.authorLocation && (
                                <span className="text-stone-400 text-[11px]">
                                  · {rev.authorLocation}
                                </span>
                              )}
                              {rev.verifiedBuyer && (
                                <span className="text-emerald-700 text-[10px] font-medium tracking-tight">
                                  ✓ Verified Patron
                                </span>
                              )}
                            </div>
                            <span className="text-stone-400 text-[11px] font-mono tabular-nums">
                              {rev.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-[#C5A059]">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating ? 'fill-current' : 'text-stone-200'
                                }`}
                              />
                            ))}
                            <span className="ml-1 font-semibold text-stone-900 text-[11px]">
                              {rev.title}
                            </span>
                          </div>

                          <p className="text-stone-600 font-light leading-relaxed">
                            {rev.comment}
                          </p>

                          <div className="pt-1 flex items-center justify-end">
                            <button
                              onClick={() => voteHelpful(rev.id)}
                              className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-[11px] cursor-pointer"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Helpful ({rev.helpfulVotes})</span>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions: Quantity + Add to Bag */}
            <div className="pt-4 border-t border-[#E8E2D8] flex items-center justify-between gap-4">
              <div className="flex items-center border border-[#E8E2D8]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-3 text-xs font-semibold tabular-nums text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={() => {
                  onClose();
                  setActiveView('3d-atelier');
                }}
                className="py-3 px-3.5 border border-[#C5A059] bg-[#FAF7F2] text-[#9E7D3B] hover:bg-[#C5A059] hover:text-stone-900 text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs shrink-0"
                title="Inspect in 3D interactive atelier"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="hidden sm:inline">3D View</span>
              </button>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>
                  Add {quantity} to Bag · ${(dessert.price * quantity).toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
