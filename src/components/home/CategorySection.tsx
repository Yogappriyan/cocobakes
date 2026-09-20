import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';

interface CategorySectionProps {
  navigate: (path: string) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ navigate }) => {
  const { categories } = useStore();

  const activeCategories = categories.filter((c) => c.status === 'active');

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      {/* Ambient warm glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-12 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#C59B27] mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Master Pâtisserie Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#23120B]">
            Explore by Confectionery
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2723]/75 mt-2 max-w-lg leading-relaxed">
            From single-origin Belgian chocolate fudge brownies to celebration drip cakes, stuffed cookies, and bespoke velvet gift hampers.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#2D1810]/15 rounded-full text-xs font-bold text-[#23120B] hover:border-[#C59B27] hover:text-[#C59B27] transition-all shadow-2xs group self-start md:self-auto"
        >
          <span>View All Delicacies</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#C59B27]" />
        </motion.button>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {activeCategories.map((category, idx) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            onClick={() => navigate(`/category/${category.slug}`)}
            className="group relative rounded-3xl overflow-hidden aspect-4/3 sm:aspect-5/4 cursor-pointer shadow-md hover:shadow-2xl transition-all duration-500 border border-[#2D1810]/12 animate-chocolate-sheen"
          >
            {/* Background Image */}
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            />

            {/* Dark cocoa gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0C06] via-[#23120B]/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content info */}
            <div className="absolute inset-0 p-6 sm:p-7 flex flex-col justify-between text-[#FAF7F2] z-10">
              <div className="flex justify-between items-start">
                <span className="px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[11px] font-bold text-[#FAF7F2] border border-white/25 shadow-xs">
                  {category.productCount ? `${category.productCount} Delights` : 'Artisanal Selection'}
                </span>
                <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#DFB15B] opacity-0 group-hover:opacity-100 transition-opacity transform -translate-y-1 group-hover:translate-y-0">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white group-hover:text-[#DFB15B] transition-colors leading-tight">
                  {category.name}
                </h3>
                <p className="text-xs text-[#EADBC8]/90 mt-1.5 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#DFB15B] group-hover:text-white transition-colors">
                  <span>Explore Collection</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
