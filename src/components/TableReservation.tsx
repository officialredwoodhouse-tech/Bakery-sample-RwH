import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { SEATING_ZONES } from '../data/bakeryData';
import { Reservation } from '../types/bakery';
import { Calendar, Users, Clock, CheckCircle2, AlertCircle, Copy, Check, Sparkles, X } from 'lucide-react';

export const TableReservation: React.FC = () => {
  const { createReservation, reservations, cancelReservation, setActiveView } = useBakery();

  // Form states
  const [selectedZone, setSelectedZone] = useState<'orangerie' | 'salon' | 'counter'>('orangerie');
  const [experienceType, setExperienceType] = useState<'afternoon-tea' | 'tasting-flight' | 'salon-a-la-carte'>('afternoon-tea');
  const [partySize, setPartySize] = useState(2);
  const [reservationDate, setReservationDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('14:15');
  const [guestName, setGuestName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');

  // Confirmation state
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [viewHistory, setViewHistory] = useState(false);

  const timeSlots = [
    { time: '09:30', period: 'Morning Viennoiserie' },
    { time: '10:30', period: 'Morning Viennoiserie' },
    { time: '11:30', period: 'Brunch Pâtisserie' },
    { time: '13:00', period: 'Afternoon Tea' },
    { time: '14:15', period: 'Afternoon Tea' },
    { time: '15:30', period: 'Afternoon Tea' },
    { time: '16:45', period: 'Afternoon Tea' },
    { time: '18:30', period: 'Dessert & Champagne' },
    { time: '19:45', period: 'Dessert & Champagne' },
    { time: '21:00', period: 'Late Tasting Flight' },
  ];

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !email || !phone) return;

    const res = createReservation({
      guestName,
      email,
      phone,
      partySize,
      date: reservationDate,
      timeSlot,
      seatingZone: selectedZone,
      experienceType,
      dietaryNotes,
      specialRequests,
    });

    setConfirmedReservation(res);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activeReservations = reservations.filter((r) => r.status === 'confirmed');

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
        <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
          Réservation de Table · Place Vendôme
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-tight">
          Reserve Your Table at the Salon
        </h1>
        <p className="text-sm sm:text-base text-stone-600 font-light">
          Immerse yourself in Parisian salon hospitality. Savor fresh morning viennoiserie, multi-course afternoon high tea, or our signature evening dessert pairing flights.
        </p>

        {activeReservations.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setViewHistory(!viewHistory)}
              className="text-xs font-medium text-[#9E7D3B] hover:text-stone-900 underline underline-offset-4 cursor-pointer"
            >
              {viewHistory ? 'Hide My Existing Bookings' : `View Your Bookings (${activeReservations.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Existing Bookings List (if toggled) */}
      {viewHistory && activeReservations.length > 0 && (
        <div className="mb-12 p-6 bg-white border border-[#E8E2D8] shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#E8E2D8]">
            <h3 className="font-serif text-xl text-stone-900">Your Active Salon Reservations</h3>
            <button
              onClick={() => setViewHistory(false)}
              className="text-stone-400 hover:text-stone-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeReservations.map((res) => (
              <div
                key={res.id}
                className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-semibold text-stone-900">{res.code}</span>
                  <span className="text-emerald-700 font-medium">✓ Confirmed</span>
                </div>
                <p className="font-serif text-base text-stone-900">{res.guestName}</p>
                <div className="text-stone-600 space-y-0.5">
                  <p>
                    <span className="text-stone-400">Date:</span> {res.date} at {res.timeSlot}
                  </p>
                  <p>
                    <span className="text-stone-400">Party:</span> {res.partySize} Guests ·{' '}
                    <span className="capitalize">{res.seatingZone}</span>
                  </p>
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => cancelReservation(res.id)}
                    className="text-stone-500 hover:text-red-700 transition-colors text-[11px] underline cursor-pointer"
                  >
                    Cancel Booking
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Confirmation View */}
      {confirmedReservation ? (
        <div className="max-w-2xl mx-auto bg-white border border-[#C5A059] p-8 md:p-10 shadow-lg text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#FAF7F2] border border-[#C5A059] flex items-center justify-center text-[#9E7D3B]">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
              Confirmation de Réservation
            </span>
            <h2 className="font-serif text-3xl text-stone-900">
              Your Table Has Been Secured
            </h2>
            <p className="text-xs text-stone-500">
              A formal confirmation card has been dispatched to {confirmedReservation.email}.
            </p>
          </div>

          {/* Ticket Card */}
          <div className="bg-[#FAF7F2] border border-[#E8E2D8] p-6 text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-400">Booking Reference</p>
                <p className="font-mono text-lg font-bold text-stone-900">{confirmedReservation.code}</p>
              </div>
              <button
                onClick={() => handleCopyCode(confirmedReservation.code)}
                className="px-3 py-1.5 bg-white border border-[#E8E2D8] text-xs font-medium text-stone-700 hover:text-stone-900 flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block">Primary Guest</span>
                <span className="font-medium text-stone-900">{confirmedReservation.guestName}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Party Size</span>
                <span className="font-medium text-stone-900 tabular-nums">{confirmedReservation.partySize} Guests</span>
              </div>
              <div>
                <span className="text-stone-400 block">Date & Time</span>
                <span className="font-medium text-stone-900">{confirmedReservation.date} · {confirmedReservation.timeSlot}</span>
              </div>
              <div>
                <span className="text-stone-400 block">Salon Ambience</span>
                <span className="font-medium text-stone-900 capitalize">{confirmedReservation.seatingZone}</span>
              </div>
            </div>

            {confirmedReservation.dietaryNotes && (
              <div className="pt-2 border-t border-[#E8E2D8] text-xs">
                <span className="text-stone-400 block">Dietary & Allergies</span>
                <span className="text-stone-700 italic">{confirmedReservation.dietaryNotes}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setConfirmedReservation(null)}
              className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors cursor-pointer"
            >
              Book Another Table
            </button>
            <button
              onClick={() => setActiveView('showcase')}
              className="w-full sm:w-auto px-6 py-2.5 border border-stone-800 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-colors cursor-pointer"
            >
              Explore Dessert Menu
            </button>
          </div>
        </div>
      ) : (
        /* Reservation Form */
        <form onSubmit={handleBookingSubmit} className="space-y-10">
          {/* Step 1: Seating Zone Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-xl text-stone-900">
                01. Choose Your Salon Ambiance
              </h3>
              <span className="text-xs text-stone-400">Select one venue space</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SEATING_ZONES.map((zone) => (
                <div
                  key={zone.id}
                  onClick={() => setSelectedZone(zone.id)}
                  className={`p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                    selectedZone === zone.id
                      ? 'border-[#C5A059] bg-[#FAF7F2] shadow-sm ring-1 ring-[#C5A059]'
                      : 'border-[#E8E2D8] bg-white hover:border-stone-400'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#9E7D3B] tracking-wider block">
                      {zone.frenchSubtitle}
                    </span>
                    <h4 className="font-serif text-xl text-stone-900 mt-1">
                      {zone.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-2 font-light leading-relaxed">
                      {zone.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#E8E2D8] text-[11px] text-stone-500 space-y-1">
                    <p><span className="text-stone-400">Ambiance:</span> {zone.ambiance}</p>
                    <p><span className="text-stone-400">Recommended for:</span> {zone.featuredFor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Experience Selection */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-stone-900">
              02. Select Tasting Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                onClick={() => setExperienceType('afternoon-tea')}
                className={`p-4 border transition-colors cursor-pointer ${
                  experienceType === 'afternoon-tea'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-[#E8E2D8] bg-white text-stone-900 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider">Afternoon High Tea</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <p className={`text-xs mt-1.5 ${experienceType === 'afternoon-tea' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Scones, 3 mini entremets, macarons & rare single-estate tea.
                </p>
                <span className="font-serif text-base font-semibold block mt-3 tabular-nums">
                  $48 / person
                </span>
              </div>

              <div
                onClick={() => setExperienceType('tasting-flight')}
                className={`p-4 border transition-colors cursor-pointer ${
                  experienceType === 'tasting-flight'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-[#E8E2D8] bg-white text-stone-900 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider">Haute Tasting Flight</span>
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                </div>
                <p className={`text-xs mt-1.5 ${experienceType === 'tasting-flight' ? 'text-stone-300' : 'text-stone-500'}`}>
                  4 plated dessert courses curated by Chef Aurélien Boniface.
                </p>
                <span className="font-serif text-base font-semibold block mt-3 tabular-nums">
                  $68 / person
                </span>
              </div>

              <div
                onClick={() => setExperienceType('salon-a-la-carte')}
                className={`p-4 border transition-colors cursor-pointer ${
                  experienceType === 'salon-a-la-carte'
                    ? 'border-stone-900 bg-stone-900 text-white'
                    : 'border-[#E8E2D8] bg-white text-stone-900 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold uppercase tracking-wider">À la Carte Salon</span>
                </div>
                <p className={`text-xs mt-1.5 ${experienceType === 'salon-a-la-carte' ? 'text-stone-300' : 'text-stone-500'}`}>
                  Order freely from the daily cloche display upon your arrival.
                </p>
                <span className="font-serif text-base font-semibold block mt-3">
                  No minimum order
                </span>
              </div>
            </div>
          </div>

          {/* Step 3: Date, Time & Guests */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-stone-900">
              03. Date, Time & Party Size
            </h3>

            <div className="p-6 bg-white border border-[#E8E2D8] grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#9E7D3B]" />
                  <span>Reservation Date</span>
                </label>
                <input
                  type="date"
                  required
                  value={reservationDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setReservationDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                />
              </div>

              {/* Party Size */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#9E7D3B]" />
                  <span>Number of Guests</span>
                </label>
                <div className="flex items-center border border-[#E8E2D8] bg-[#FAF7F2]">
                  {[1, 2, 3, 4, 5, 6, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPartySize(num)}
                      className={`flex-1 py-2 text-xs font-semibold tabular-nums transition-colors cursor-pointer ${
                        partySize === num
                          ? 'bg-stone-900 text-white'
                          : 'text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#9E7D3B]" />
                  <span>Seating Time</span>
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                >
                  {timeSlots.map((slot) => (
                    <option key={slot.time} value={slot.time}>
                      {slot.time} — {slot.period}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 4: Contact & Requests */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-stone-900">
              04. Guest Details & Special Arrangements
            </h3>

            <div className="p-6 bg-white border border-[#E8E2D8] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Éléonore de V."
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="eleonore@elysee.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Mobile Telephone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+33 1 42 68 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Allergies or Dietary Restrictions</label>
                  <input
                    type="text"
                    placeholder="e.g. Tree nut allergy, vegetarian, gluten sensitivity"
                    value={dietaryNotes}
                    onChange={(e) => setDietaryNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Celebration Occasion / Special Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. 10th Wedding Anniversary, Birthday greeting"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#FAF7F2] border border-[#E8E2D8] focus:border-stone-900 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="p-6 bg-[#FAF7F2] border border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <AlertCircle className="w-4 h-4 text-[#9E7D3B]" />
              <span>Tables held for 15 minutes past reservation slot. Complimentary cancellation up to 6h prior.</span>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors cursor-pointer shadow-sm"
            >
              Confirm Salon Reservation
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
