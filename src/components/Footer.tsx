import React, { useState } from 'react';
import { useBakery } from '../context/BakeryContext';
import { MapPin, Phone, Mail, Check, Copy, ExternalLink, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useBakery();
  const [newsletterJoined, setNewsletterJoined] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [copiedSocial, setCopiedSocial] = useState<string | null>(null);

  const socialLinks = [
    { name: 'Instagram', handle: '@maisonelysee.paris', url: 'https://instagram.com' },
    { name: 'TikTok', handle: '@maisonelysee_atelier', url: 'https://tiktok.com' },
    { name: 'Pinterest', handle: 'Maison Élysée Pâtisserie', url: 'https://pinterest.com' },
    { name: 'WhatsApp', handle: '+33 6 12 34 56 78', url: 'https://whatsapp.com' },
    { name: 'YouTube', handle: 'Maison Élysée Masterclass', url: 'https://youtube.com' },
  ];

  const handleCopyHandle = (handle: string, name: string) => {
    navigator.clipboard.writeText(handle);
    setCopiedSocial(name);
    setTimeout(() => setCopiedSocial(null), 2000);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterJoined(true);
      setNewsletterEmail('');
      setTimeout(() => setNewsletterJoined(false), 4000);
    }
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
        {/* Brand & Address */}
        <div className="md:col-span-4 space-y-4">
          <h3 className="font-serif text-2xl text-white tracking-wide">
            Maison Élysée
          </h3>
          <p className="text-stone-400 font-light leading-relaxed max-w-sm">
            Haute Pâtisserie & Salon de Thé. Handcrafted artisanal French entremets, viennoiserie, and table service since 1924.
          </p>
          <div className="space-y-2 pt-2 text-stone-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>12 Place Vendôme, 75001 Paris, France</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>+33 (0)1 42 68 88 00</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>concierge@maison-elysee.fr</span>
            </p>
          </div>
        </div>

        {/* Salon Hours */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-serif text-base text-white tracking-wider uppercase text-[11px] font-semibold">
            Salon & Boutique Hours
          </h4>
          <div className="space-y-2 text-stone-400">
            <div>
              <p className="font-medium text-stone-200">Monday — Friday</p>
              <p>Boutique: 07:30 – 19:30</p>
              <p>Salon de Thé: 09:00 – 18:30</p>
            </div>
            <div className="pt-1">
              <p className="font-medium text-stone-200">Saturday & Sunday</p>
              <p>Boutique: 08:00 – 20:00</p>
              <p>Salon de Thé: 09:30 – 22:00 (Evening Pairing)</p>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-2 space-y-3">
          <h4 className="font-serif text-base text-white tracking-wider uppercase text-[11px] font-semibold">
            Experiences
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => setActiveView('showcase')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Seasonal Desserts
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('table-booking')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Book Your Table
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('order-now')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Book Now / Pre-Order
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('about-us')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                About Our Heritage
              </button>
            </li>
            <li>
              <button
                onClick={() => setActiveView('reviews-hub')}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Patron Reviews
              </button>
            </li>
          </ul>
        </div>

        {/* Gazette Newsletter */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-serif text-base text-white tracking-wider uppercase text-[11px] font-semibold">
            La Gazette Élysée
          </h4>
          <p className="text-stone-400 font-light">
            Receive private invitations to seasonal pastry collections and salon tasting flights.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="space-y-2 pt-1">
            <div className="flex gap-2">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address..."
                className="px-3 py-2 bg-stone-800 border border-stone-700 text-stone-100 placeholder:text-stone-500 text-xs flex-1 focus:outline-none focus:border-[#C5A059]"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#C5A059] text-stone-900 font-semibold text-xs uppercase tracking-wider hover:bg-[#d6b26c] transition-colors cursor-pointer"
              >
                Join
              </button>
            </div>
            {newsletterJoined && (
              <p className="text-emerald-400 text-[11px] flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Merci! You are now subscribed to our private gazette.</span>
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Connect on Social Apps Banner */}
      <div className="max-w-7xl mx-auto px-6 py-6 border-b border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#C5A059] block">
            Suivez Notre Atelier
          </span>
          <p className="text-xs text-stone-400">
            Connect with us on social apps for daily bake timelapses, VIP concierge drops, and recipes:
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {socialLinks.map((s) => (
            <div
              key={s.name}
              className="flex items-center border border-stone-700 bg-stone-800/80 rounded-xs text-[11px] text-stone-300 overflow-hidden"
            >
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="px-2.5 py-1.5 hover:text-white hover:bg-stone-700 transition-colors flex items-center gap-1"
              >
                <span>{s.name}</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </a>
              <button
                onClick={() => handleCopyHandle(s.handle, s.name)}
                className="px-2 py-1.5 border-l border-stone-700 hover:text-white hover:bg-stone-700 transition-colors cursor-pointer"
                title={`Copy ${s.handle}`}
              >
                {copiedSocial === s.name ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 text-stone-400" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Sub-strip */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
        <p>© 2026 Maison Élysée Pâtisserie Parisienne. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <span>Allergens & Dietary Transparency</span>
          <span>Terms of Salon Reservation</span>
          <span>Privacy Policy</span>
        </div>
      </div>
    </footer>
  );
};
