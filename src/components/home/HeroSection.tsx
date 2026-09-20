import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles, Award, Clock, Star, Flame } from 'lucide-react';

interface HeroSectionProps {
  navigate: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ navigate }) => {
  const { siteSettings, banners } = useStore();
  const currentBanner = banners[0] || {
    title: 'Pure Belgian Couverture & Warm Molten Centers',
    subtitle: 'Handcrafted brownies, cakes, and gift hampers made fresh for life’s most cherished celebrations.',
    badge: 'Artisanal Patisserie & Chocolatier',
    ctaText: 'Shop the Collection',
    ctaLink: '/shop',
    secondaryCtaText: 'Explore Brownies',
    secondaryCtaLink: '/shop?category=brownies',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=1400&q=85',
  };

  return (
    <section className="relative overflow-hidden pt-6 sm:pt-12 pb-16 sm:pb-24">
      {/* Ambient warm chocolate and golden honey lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-[#EADBC8]/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-[#C59B27]/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="lg:col-span-6 space-y-6 sm:space-y-8 text-center lg:text-left"
          >
            {/* Curated Atelier Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#C59B27]/40 text-[#23120B] text-xs font-bold tracking-wide shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>{currentBanner.badge || 'Single-Origin Belgian Couverture'}</span>
            </motion.div>

            {/* Headline with Rich Display Font */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#23120B] leading-[1.12]">
              {siteSettings.heroHeadline || 'Made With Love. Baked To Perfection.'}
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-[#3E2723]/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              {siteSettings.heroSubheadline || currentBanner.subtitle}
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(currentBanner.ctaLink || '/shop')}
                className="w-full sm:w-auto px-8 py-4 bg-[#23120B] text-[#FAF7F2] hover:bg-[#C59B27] font-bold text-sm rounded-full transition-all duration-300 flex items-center justify-center gap-2.5 shadow-xl hover:shadow-2xl group border border-[#C59B27]/40"
              >
                <span>{siteSettings.heroPrimaryCta || currentBanner.ctaText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#DFB15B]" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(currentBanner.secondaryCtaLink || '/shop?category=brownies')}
                className="w-full sm:w-auto px-7 py-4 bg-white/90 hover:bg-white text-[#23120B] border border-[#2D1810]/20 font-bold text-sm rounded-full transition-all duration-300 shadow-sm hover:border-[#C59B27]"
              >
                {siteSettings.heroSecondaryCta || currentBanner.secondaryCtaText || 'Explore Brownies'}
              </motion.button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-[#2D1810]/12 grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0 text-left">
              <div className="bg-white/60 backdrop-blur-xs p-3 rounded-2xl border border-[#2D1810]/8">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B]">70%</div>
                <div className="text-[11px] text-[#3E2723]/70 font-medium leading-tight mt-0.5">
                  Callebaut Dark Cocoa
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xs p-3 rounded-2xl border border-[#2D1810]/8">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B]">100%</div>
                <div className="text-[11px] text-[#3E2723]/70 font-medium leading-tight mt-0.5">
                  Pure French Butter
                </div>
              </div>
              <div className="bg-white/60 backdrop-blur-xs p-3 rounded-2xl border border-[#2D1810]/8">
                <div className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B]">2-Hr</div>
                <div className="text-[11px] text-[#3E2723]/70 font-medium leading-tight mt-0.5">
                  City Fresh Delivery
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Hero Visual Stage with Floating Chocolatier Accents */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 relative"
          >
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              {/* Decorative Frame with Specular Sheen */}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-4/3 sm:aspect-5/4 group cursor-pointer animate-chocolate-sheen">
                <img
                  src={currentBanner.image}
                  alt="Artisanal Brownies & Desserts"
                  className="w-full h-full object-cover transform group-hover:scale-106 transition-transform duration-700 ease-out"
                />

                {/* Subtle gradient overlay at base */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 text-white z-20 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#DFB15B] flex items-center gap-1 mb-1">
                      <Star className="w-3 h-3 fill-[#DFB15B]" />
                      <span>Signature Chef Creation</span>
                    </span>
                    <h3 className="font-serif text-lg sm:text-xl font-bold">
                      Ferrero Rocher Molten Brownie
                    </h3>
                  </div>
                  <button
                    onClick={() => navigate('/product/ferrero-brownie-box')}
                    className="px-4 py-2 bg-white text-[#23120B] text-xs font-bold rounded-full shadow-lg hover:bg-[#C59B27] hover:text-white transition-all transform hover:scale-105"
                  >
                    Taste &rarr;
                  </button>
                </div>
              </div>

              {/* Floating Badge: Award Winning */}
              <div className="hidden sm:flex items-center gap-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#C59B27]/40 absolute -top-5 -left-5 z-20 animate-float-gentle">
                <div className="w-10 h-10 rounded-xl bg-[#23120B] text-[#DFB15B] flex items-center justify-center shadow-xs">
                  <Award className="w-5 h-5 text-[#DFB15B]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#23120B]">Artisanal Award</div>
                  <div className="text-[10px] text-[#3E2723]/70">Pure Single-Origin Cocoa</div>
                </div>
              </div>

              {/* Floating Badge: Freshly Baked Today */}
              <div
                className="hidden sm:flex items-center gap-3 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-[#2D1810]/10 absolute -bottom-5 -right-5 z-20 animate-float-gentle"
                style={{ animationDelay: '2s' }}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-xs">
                  <Clock className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#23120B]">Freshly Baked Daily</div>
                  <div className="text-[10px] text-[#3E2723]/70">Zero artificial essences</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
