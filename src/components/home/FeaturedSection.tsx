import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../product/ProductCard';
import { ArrowRight, Sparkles, Award } from 'lucide-react';

interface FeaturedSectionProps {
  navigate: (path: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ navigate }) => {
  const { products } = useStore();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const filterTabs = [
    { id: 'all', label: 'All Delights', icon: '✨' },
    { id: 'cat-brownies', label: 'Molten Brownies', icon: '🍫' },
    { id: 'cat-cakes', label: 'Artisanal Cakes', icon: '🎂' },
    { id: 'cat-cookies', label: 'Stuffed Cookies', icon: '🍪' },
    { id: 'cat-hampers', label: 'Luxury Hampers', icon: '🎁' },
  ];

  const activeProducts = products.filter((p) => p.status === 'active');
  const filteredProducts =
    selectedFilter === 'all'
      ? activeProducts
      : activeProducts.filter((p) => p.categoryId === selectedFilter);

  return (
    <section className="py-16 sm:py-24 bg-[#FDFBF7] border-y border-[#2D1810]/10 relative overflow-hidden">
      {/* Decorative Warm Chocolate Blur Accents */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#2D1810]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#EADBC8]/60 border border-[#C59B27]/30 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Master Chocolatier Selection</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#23120B] tracking-tight"
          >
            Bespoke Bakes &amp; Chocoholic Obsessions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xs sm:text-sm text-[#3E2723]/75 mt-3 leading-relaxed"
          >
            Hand-tempered with single-origin Belgian couverture, pure churned butter, and slow-baked to achieve that signature silky crackle on top and rich molten interior.
          </motion.p>

          {/* Filter Tabs with Fluid Motion Indicator */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 bg-[#FAF7F2] rounded-full border border-[#2D1810]/10 max-w-xl mx-auto shadow-2xs">
            {filterTabs.map((tab) => {
              const isActive = selectedFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedFilter(tab.id)}
                  className={`relative px-4 py-2 text-xs font-bold rounded-full transition-colors flex items-center gap-1.5 ${
                    isActive ? 'text-[#FAF7F2]' : 'text-[#2D1810]/80 hover:text-[#23120B]'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeFeaturedTab"
                      className="absolute inset-0 bg-[#23120B] rounded-full shadow-md"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 text-xs">{tab.icon}</span>
                  <span className="relative z-10">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Grid with Smooth AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedFilter}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
          >
            {filteredProducts.slice(0, 8).map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
                index={idx}
              />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* View All CTA with Gold Accents */}
        <div className="mt-14 text-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/shop')}
            className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2] text-xs sm:text-sm font-bold rounded-full shadow-lg transition-all duration-300 group border border-[#C59B27]/40"
          >
            <span>Explore Entire Patisserie Menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#DFB15B]" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};
