import React from 'react';
import { useBakery } from '../context/BakeryContext';
import { HERO_IMAGE, ATELIER_IMAGE } from '../data/bakeryData';
import { BakeryImage } from './BakeryImage';
import { Feather, Clock, Heart } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutUs: React.FC = () => {
  const { setActiveView } = useBakery();

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto space-y-20">
      {/* Chapter 01: The Founding & Heritage */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-6"
      >
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
            Notre Histoire · Depuis 1924
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl text-stone-900 leading-tight">
            A Century of Parisian Pâtisserie Elegance
          </h1>
          <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
            Founded along the stone arcades of Rue Saint-Honoré in the winter of 1924, Maison Élysée began with a singular vow: to honor the sacred patience of French baking without compromise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center pt-8">
          <div className="space-y-4 text-sm text-stone-600 font-light leading-relaxed">
            <h2 className="font-serif text-2xl text-stone-900 font-normal">
              From a Small Floured Hearth to Place Vendôme
            </h2>
            <p>
              Master Baker Auguste Élysée first started by mixing heritage sourdough loaves before dawn, relying only on natural leaven and ambient yeasts from the Seine valley. By 1938, his bakery attracted the great poets, couturiers, and culinary critics of Paris, who came for both his crisp brioche and his revolutionary layered entremets.
            </p>
            <p>
              Over generations, our atelier has remained steadfastly independent. While modern commercial bakeries turned to rapid proofing yeasts and synthetic glazing compounds, Maison Élysée doubled down on artisanal craftsmanship, preserving centuries-old copper mixing kettles and marble cooling slabs.
            </p>
            <div className="pt-2 flex items-center gap-6 text-xs text-stone-500 font-mono">
              <div>
                <span className="font-serif text-2xl text-stone-900 block tabular-nums">1924</span>
                <span>Atelier Founded</span>
              </div>
              <div className="h-8 w-px bg-[#E8E2D8]" />
              <div>
                <span className="font-serif text-2xl text-stone-900 block tabular-nums">4</span>
                <span>Generations of Master Chefs</span>
              </div>
              <div className="h-8 w-px bg-[#E8E2D8]" />
              <div>
                <span className="font-serif text-2xl text-stone-900 block tabular-nums">100%</span>
                <span>Scratch-Crafted Daily</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden border border-[#E8E2D8] shadow-sm">
            <BakeryImage
              src={HERO_IMAGE}
              fallbackSrc="/images/hero.jpg"
              itemId="hero"
              alt="Historical salon atmosphere of Maison Élysée"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-950/20" />
            <div className="absolute bottom-4 left-4 right-4 text-white text-xs p-3 bg-stone-900/60 backdrop-blur-xs">
              <p className="font-serif text-sm">Le Salon Historique</p>
              <p className="text-stone-300 text-[11px]">Where Auguste Élysée first baked his legendary brioche feuilletée.</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Chapter 02: The Bakers' Philosophy */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="p-8 sm:p-12 bg-white border border-[#E8E2D8] shadow-sm space-y-8"
      >
        <div className="max-w-2xl">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
            La Philosophie des Pâtissiers
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 mt-1">
            Le Temps, Le Terroir, Le Geste
          </h2>
          <p className="text-sm text-stone-600 mt-2 font-light">
            Our daily work in the flour room is governed by three unbendable convictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#9E7D3B]">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">
              01. The Sanctity of Time (Le Temps)
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              We never rush fermentation. Our puff pastry and croissant doughs undergo a 72-hour cold retard process. This allows native enzymes to unlock floral aromas and deep caramelized notes that simply cannot exist in expedited baking.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#9E7D3B]">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">
              02. Uncompromised Terroir (Le Terroir)
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              We source raw ingredients exclusively from small family cooperatives: churned cultured AOP butter from Charentes-Poitou, whole Bourbon vanilla pods pollinated by hand in Madagascar, and Grand Cru cacao harvested sustainably in Ecuador.
            </p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF7F2] border border-[#E8E2D8] flex items-center justify-center text-[#9E7D3B]">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-xl text-stone-900">
              03. The Human Hand (Le Geste)
            </h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              No robotic nozzles or automated industrial injectors. Every choux is piped by eye, every caramel halo is spun by hand, and every mirror glaze is poured at precisely 32°C by our team of certified companion pâtissiers.
            </p>
          </div>
        </div>
      </motion.section>

      {/* Chapter 03: The Inspiration Behind The Desserts */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 relative aspect-[16/10] overflow-hidden rounded-sm border border-[#E8E2D8] shadow-md">
            <BakeryImage
              src={ATELIER_IMAGE}
              fallbackSrc="/images/atelier.jpg"
              itemId="atelier"
              alt="Master chef piping fruit tarts in the atelier"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-stone-950/15" />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
              L'Architecture du Goût
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-900 leading-snug">
              The Sculptural Inspiration Behind Our Desserts
            </h2>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              When Head Pâtissier Aurélien Boniface sketches a new dessert, he begins with architectural elevations rather than recipes. Drawing inspiration from Parisian neoclassical domes, Haussmannian limestone façades, and the crystalline facet cuts of Place Vendôme jewelry.
            </p>
            <p className="text-sm text-stone-600 font-light leading-relaxed">
              Every entremet is engineered as a sensory progression:
            </p>

            <ul className="space-y-2 text-xs text-stone-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D3B] mt-1.5 shrink-0" />
                <span><strong className="font-semibold text-stone-900">Visual Silhouette:</strong> Clean geometric planes, high-gloss organic glazes, and restrained 24k gold leaf accents.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D3B] mt-1.5 shrink-0" />
                <span><strong className="font-semibold text-stone-900">Tactile Contrast:</strong> Alternating gossamer mousses with dense almond Joconde and crackling sablé foundations.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#9E7D3B] mt-1.5 shrink-0" />
                <span><strong className="font-semibold text-stone-900">Palate Acidity:</strong> Incorporating wild Rhône raspberries and Menton yuzu to cleanse the palate between rich ganaches.</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Chapter 04: The Master Pâtissiers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="border-t border-[#E8E2D8] pt-12 space-y-8"
      >
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#9E7D3B]">
            Les Maîtres Artisans
          </span>
          <h2 className="font-serif text-3xl text-stone-900">
            Meet the Masters of Maison Élysée
          </h2>
          <p className="text-xs text-stone-500">
            Combining Michelin-starred pedigree with generational pastry mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-6 bg-white border border-[#E8E2D8] space-y-3">
            <span className="text-[11px] font-semibold text-[#9E7D3B] uppercase tracking-wider block">
              Chef Pâtissier Exécutif
            </span>
            <h3 className="font-serif text-2xl text-stone-900">Aurélien Boniface</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Trained under Paris’s legendary grand palaces for over 18 years. Chef Aurélien is revered for his obsessive mastery of cocoa crystallization and architectural entremets that test the physical limits of gelatin-free fruit compotes.
            </p>
            <p className="text-[11px] text-stone-400 italic">Signature Creation: Le Rubis Framboise</p>
          </div>

          <div className="p-6 bg-white border border-[#E8E2D8] space-y-3">
            <span className="text-[11px] font-semibold text-[#9E7D3B] uppercase tracking-wider block">
              Maître Chocolatière & Viennoisière
            </span>
            <h3 className="font-serif text-2xl text-stone-900">Émilie Laurent</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              A native of Normandy, Chef Émilie spent a decade perfecting butter laminations and sourdough starters. Her croissants have been praised by Parisian broadsheets as "the benchmark against which all French morning pastries must be judged."
            </p>
            <p className="text-[11px] text-stone-400 italic">Signature Creation: Croissant Feuilleté Pur Beurre AOP</p>
          </div>
        </div>

        {/* Action Banner */}
        <div className="p-8 bg-[#F5EFE6] border border-[#E8E2D8] text-center space-y-4">
          <h3 className="font-serif text-2xl text-stone-900">
            Experience Our Philosophy in Person
          </h3>
          <p className="text-xs text-stone-600 max-w-xl mx-auto">
            Join us in our Grand Salon or Glass Orangerie for an unforgettable afternoon of tasting.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setActiveView('table-booking')}
              className="px-6 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider hover:bg-[#9E7D3B] transition-colors cursor-pointer"
            >
              Book Your Salon Table
            </button>
            <button
              onClick={() => setActiveView('showcase')}
              className="px-6 py-3 border border-stone-800 text-stone-900 text-xs font-semibold uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
            >
              Explore Our Creations
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};
