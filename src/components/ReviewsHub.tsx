import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { BakeryImage } from './BakeryImage';
import { Star, ThumbsUp, ShieldCheck, Filter, Plus, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

export const ReviewsHub: React.FC = () => {
  const { reviews, desserts, voteHelpful, setSelectedDessertModal, addReview } = useBakery();

  const [filterDessert, setFilterDessert] = useState<string>('all');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  // Form State
  const [targetDessertId, setTargetDessertId] = useState(desserts[0]?.id || 'rubis-framboise');
  const [authorName, setAuthorName] = useState('');
  const [authorLocation, setAuthorLocation] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [formSuccess, setFormSuccess] = useState(false);

  // Compute Overall Stats
  const totalReviews = reviews.length;
  const overallAvg = (reviews.reduce((acc, r) => acc + r.rating, 0) / (totalReviews || 1)).toFixed(1);
  const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    starCounts[r.rating] = (starCounts[r.rating] || 0) + 1;
  });

  const filteredReviews = reviews.filter((r) => {
    const matchesDessert = filterDessert === 'all' || r.dessertId === filterDessert;
    const matchesRating = filterRating === 'all' || r.rating === filterRating;
    return matchesDessert && matchesRating;
  });

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !comment.trim()) return;

    addReview({
      dessertId: targetDessertId,
      authorName: authorName.trim() || 'Valued Gourmand',
      authorLocation: authorLocation.trim() || 'Paris, France',
      rating,
      title: title.trim(),
      comment: comment.trim(),
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setShowSubmitModal(false);
      setTitle('');
      setComment('');
    }, 1200);
  };

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
          Avis et Témoignages des Connaisseurs
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 leading-tight">
          Customer Reviews & Tasting Notes
        </h1>
        <p className="text-stone-600 font-light text-sm sm:text-base">
          Read candid evaluations from guests who have experienced our desserts in the salon or at celebratory dinner tables.
        </p>
      </div>

      {/* Aggregate Rating Dashboard with Scroll In View */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="p-8 bg-white border border-[#E8E2D8] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
      >
        {/* Left: Overall score */}
        <div className="md:col-span-4 text-center md:text-left space-y-2 border-b md:border-b-0 md:border-r border-[#E8E2D8] pb-6 md:pb-0 md:pr-6">
          <div className="flex items-baseline justify-center md:justify-start gap-2">
            <span className="font-serif text-5xl font-medium text-stone-900 tabular-nums">
              {overallAvg}
            </span>
            <span className="text-stone-400 text-sm">/ 5.0</span>
          </div>

          <div className="flex justify-center md:justify-start text-[#C5A059] py-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.round(Number(overallAvg)) ? 'fill-current' : 'text-stone-200'
                }`}
              />
            ))}
          </div>

          <p className="text-xs text-stone-500">
            Based on <span className="font-semibold text-stone-800 tabular-nums">{totalReviews}</span> verified customer reviews
          </p>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-4 px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Rate a Dessert</span>
          </button>
        </div>

        {/* Center: Rating Distribution Bar Chart */}
        <div className="md:col-span-8 space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = starCounts[stars] || 0;
            const pct = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <span className="w-12 text-stone-600 font-medium text-right shrink-0">
                  {stars} Stars
                </span>
                <div className="flex-1 bg-stone-100 h-2.5 overflow-hidden rounded-xs border border-[#E8E2D8]">
                  <div
                    className="h-full bg-[#C5A059] transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-12 text-stone-400 font-mono text-right tabular-nums shrink-0">
                  {pct}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-700">
          <Filter className="w-3.5 h-3.5 text-[#9E7D3B]" />
          <span>Filter Reviews:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Dessert Filter */}
          <select
            value={filterDessert}
            onChange={(e) => setFilterDessert(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
          >
            <option value="all">All Desserts & Pâtisserie</option>
            {desserts.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          {/* Rating Filter */}
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="px-3 py-1.5 text-xs bg-white border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
          >
            <option value="all">All Star Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars & Below</option>
          </select>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReviews.length === 0 ? (
          <div className="col-span-2 p-12 bg-white border border-[#E8E2D8] text-center">
            <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
            <p className="font-serif text-lg text-stone-800">No reviews found matching these filters</p>
            <button
              onClick={() => {
                setFilterDessert('all');
                setFilterRating('all');
              }}
              className="mt-3 px-4 py-1.5 text-xs bg-stone-900 text-white cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredReviews.map((rev, index) => {
            const dessert = desserts.find((d) => d.id === rev.dessertId);
            return (
              <motion.div
                key={rev.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: (index % 2) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 bg-white border border-[#E8E2D8] shadow-xs flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top: Reviewed Dessert Link */}
                  {dessert && (
                    <div
                      onClick={() => setSelectedDessertModal(dessert)}
                      className="flex items-center gap-2 cursor-pointer group pb-2 border-b border-[#E8E2D8]"
                    >
                      <BakeryImage
                        src={dessert.imageUrl}
                        itemId={dessert.id}
                        alt={dessert.name}
                        className="w-8 h-8 object-cover border border-[#E8E2D8]"
                      />
                      <div>
                        <span className="font-serif text-sm text-stone-900 group-hover:text-[#9E7D3B] transition-colors leading-tight block">
                          {dessert.name}
                        </span>
                        <span className="text-[10px] text-stone-400 capitalize">
                          {dessert.category} · ${dessert.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Rating Stars & Title */}
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex text-[#C5A059]">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-current' : 'text-stone-200'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-stone-400 text-[11px] font-mono tabular-nums">
                        {rev.date}
                      </span>
                    </div>
                    <h3 className="font-serif text-base font-semibold text-stone-900 mt-1">
                      {rev.title}
                    </h3>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Footer: Author & Helpful Votes */}
                <div className="pt-3 border-t border-[#E8E2D8] flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-stone-800">{rev.authorName}</span>
                    {rev.authorLocation && (
                      <span className="text-stone-400 text-[11px]">· {rev.authorLocation}</span>
                    )}
                    {rev.verifiedBuyer && (
                      <span className="text-emerald-700 text-[10px] flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Verified</span>
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => voteHelpful(rev.id)}
                    className="hover:text-stone-900 flex items-center gap-1 text-[11px] cursor-pointer transition-colors"
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="tabular-nums">Helpful ({rev.helpfulVotes})</span>
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Submit Review Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D8] max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-4">
            <h3 className="font-serif text-2xl text-stone-900">
              Submit a Customer Review
            </h3>
            <p className="text-xs text-stone-500">
              Your feedback is published directly to our tasting notes and dessert average ratings.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Select Dessert
                </label>
                <select
                  value={targetDessertId}
                  onChange={(e) => setTargetDessertId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                >
                  {desserts.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.frenchName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Star rating selector */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => setRating(s)}
                      onMouseEnter={() => setHoverRating(s)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          (hoverRating || rating) >= s
                            ? 'text-[#C5A059] fill-current'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-semibold text-stone-800">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sebastien M."
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">City / Region</label>
                  <input
                    type="text"
                    placeholder="e.g. Paris, France"
                    value={authorLocation}
                    onChange={(e) => setAuthorLocation(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">Review Headline</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Crisp choux, delicate caramel, perfection"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-600 mb-1">Detailed Tasting Review</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Share details about the texture, balance of sweetness, aroma..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2 border border-[#E8E2D8] text-xs font-semibold uppercase hover:bg-stone-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSuccess}
                  className="px-6 py-2 bg-stone-900 text-white text-xs font-semibold uppercase hover:bg-[#9E7D3B] transition-colors cursor-pointer"
                >
                  {formSuccess ? 'Review Published!' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
