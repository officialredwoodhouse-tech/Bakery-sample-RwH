import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Copy, ExternalLink, Sparkles, MessageCircle } from 'lucide-react';

interface SocialChannel {
  id: string;
  name: string;
  handle: string;
  platform: string;
  description: string;
  followers: string;
  actionText: string;
  badge: string;
  url: string;
  color: string;
  previewNote: string;
}

export const SocialConnect: React.FC = () => {
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);
  const [activePreview, setActivePreview] = useState<SocialChannel | null>(null);

  const socialChannels: SocialChannel[] = [
    {
      id: 'instagram',
      name: 'Instagram Atelier',
      handle: '@maisonelysee.paris',
      platform: 'Instagram',
      description: 'Daily morning bake reveals, mirror glaze pours, and haute couture dessert collections.',
      followers: '185K Patrons',
      actionText: 'Follow @maisonelysee.paris',
      badge: 'Daily Stories',
      url: 'https://instagram.com',
      color: '#E1306C',
      previewNote: 'Watch Chef Aurélien Boniface flame Saint-Honoré caramel halos daily at 08:00 CET.',
    },
    {
      id: 'tiktok',
      name: 'TikTok Backstage',
      handle: '@maisonelysee_atelier',
      platform: 'TikTok',
      description: 'ASMR honeycomb croissant slicing, 72-hour lamination timelapses, and chef techniques.',
      followers: '320K Foodies',
      actionText: 'Watch Pâtisserie Reels',
      badge: 'Viral ASMR',
      url: 'https://tiktok.com',
      color: '#000000',
      previewNote: 'Experience the crisp crackle sound of 27-layer cultured butter puff pastry.',
    },
    {
      id: 'pinterest',
      name: 'Pinterest Moodboards',
      handle: 'Maison Élysée Pâtisserie',
      platform: 'Pinterest',
      description: 'Wedding dessert tables, Parisian salon high-tea aesthetics, and bespoke celebration cakes.',
      followers: '45K Monthly Views',
      actionText: 'Explore Wedding Boards',
      badge: 'Visual Inspo',
      url: 'https://pinterest.com',
      color: '#BD081C',
      previewNote: 'Curated color palettes and dessert tiers for luxury celebrations and galas.',
    },
    {
      id: 'whatsapp',
      name: 'Salon VIP Concierge',
      handle: '+33 6 12 34 56 78',
      platform: 'WhatsApp Concierge',
      description: 'Direct messaging for private salon hire, bespoke tiered cakes, and corporate gift hampers.',
      followers: 'Instant Response',
      actionText: 'Chat with Concierge',
      badge: 'Personal Service',
      url: 'https://whatsapp.com',
      color: '#25D366',
      previewNote: 'Dedicated salon host responds within 15 minutes during boutique hours.',
    },
  ];

  const handleCopy = (handle: string, id: string) => {
    navigator.clipboard.writeText(handle);
    setCopiedHandle(id);
    setTimeout(() => setCopiedHandle(null), 2200);
  };

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto border-t border-[#E8E2D8]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="text-center max-w-2xl mx-auto space-y-3 mb-10"
      >
        <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
          Rejoignez Notre Communauté Gourmande
        </span>
        <h2 className="font-serif text-3xl md:text-4xl text-stone-900">
          Connect With Us on Social
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
          Step inside our Place Vendôme flour room. Follow our master chefs backstage, discover daily secret bakes, or message our salon concierge directly.
        </p>
      </motion.div>

      {/* Social Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {socialChannels.map((channel, index) => (
          <motion.div
            key={channel.id}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.45, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 bg-white border border-[#E8E2D8] hover:border-[#C5A059] transition-all duration-300 shadow-xs hover:shadow-md flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-semibold text-[#9E7D3B] tracking-wider">
                  {channel.badge}
                </span>
                <span className="text-[11px] text-stone-400 font-mono tabular-nums">
                  {channel.followers}
                </span>
              </div>

              <div>
                <h3 className="font-serif text-xl text-stone-900 group-hover:text-[#9E7D3B] transition-colors flex items-center gap-1.5">
                  <span>{channel.name}</span>
                </h3>
                <p className="font-mono text-xs text-stone-600 font-medium mt-0.5">
                  {channel.handle}
                </p>
              </div>

              <p className="text-xs text-stone-600 font-light leading-relaxed">
                {channel.description}
              </p>

              <div className="p-3 bg-[#FAF7F2] border border-[#E8E2D8] text-[11px] text-stone-600 italic">
                <Sparkles className="w-3 h-3 text-[#9E7D3B] inline mr-1" />
                <span>{channel.previewNote}</span>
              </div>
            </div>

            <div className="pt-5 mt-4 border-t border-[#E8E2D8] flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(channel.handle, channel.id)}
                className="flex-1 py-2 px-3 bg-stone-900 text-white text-[11px] uppercase tracking-wider font-semibold hover:bg-[#9E7D3B] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copiedHandle === channel.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Handle</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActivePreview(channel)}
                className="p-2 border border-[#E8E2D8] text-stone-700 hover:text-stone-900 hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                title={`Open details for ${channel.name}`}
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Social Channel Detail Modal */}
      {activePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="bg-white border border-[#E8E2D8] max-w-md w-full p-6 sm:p-8 shadow-2xl relative space-y-5 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-[#E8E2D8]">
              <div>
                <span className="text-[10px] uppercase font-semibold text-[#9E7D3B] tracking-wider block">
                  {activePreview.platform}
                </span>
                <h3 className="font-serif text-2xl text-stone-900">
                  {activePreview.name}
                </h3>
              </div>
              <button
                onClick={() => setActivePreview(null)}
                className="text-stone-400 hover:text-stone-900 p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed font-light">
              {activePreview.description}
            </p>

            <div className="p-4 bg-[#FAF7F2] border border-[#E8E2D8] space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Account Identifier:</span>
                <span className="font-mono font-semibold text-stone-900">{activePreview.handle}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Community Audience:</span>
                <span className="font-semibold text-stone-900">{activePreview.followers}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Featured Focus:</span>
                <span className="text-stone-900">{activePreview.badge}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleCopy(activePreview.handle, activePreview.id)}
                className="flex-1 py-2.5 border border-stone-800 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-stone-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                {copiedHandle === activePreview.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Handle Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy {activePreview.platform} Handle</span>
                  </>
                )}
              </button>

              <a
                href={activePreview.url}
                target="_blank"
                rel="noreferrer noopener"
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors flex items-center gap-1.5"
              >
                <span>Visit App</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
