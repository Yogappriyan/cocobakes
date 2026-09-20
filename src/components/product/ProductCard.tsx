import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, Star, ShoppingBag, Eye, Sparkles, Check, Flame, Leaf } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
  layout?: 'grid' | 'horizontal';
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  navigate,
  layout = 'grid',
  index = 0,
}) => {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct, siteSettings } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);

  // Determine second image for hover reveal
  const primaryImage = product.thumbnail || product.images[0] || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80';
  const secondaryImage = product.images && product.images.length > 1 ? product.images[1] : null;

  const badgeColorMap: Record<string, { bg: string; text: string; border: string }> = {
    bestseller: {
      bg: 'bg-gradient-to-r from-[#23120B] to-[#3E2723]',
      text: 'text-[#DFB15B]',
      border: 'border-[#C59B27]/40',
    },
    new: {
      bg: 'bg-gradient-to-r from-emerald-950 to-emerald-800',
      text: 'text-emerald-200',
      border: 'border-emerald-600/40',
    },
    trending: {
      bg: 'bg-gradient-to-r from-amber-950 to-amber-800',
      text: 'text-amber-200',
      border: 'border-amber-600/40',
    },
    limited: {
      bg: 'bg-gradient-to-r from-rose-950 to-rose-900',
      text: 'text-rose-200',
      border: 'border-rose-600/40',
    },
    sale: {
      bg: 'bg-gradient-to-r from-[#C59B27] to-[#DFB15B]',
      text: 'text-[#1A0F0A]',
      border: 'border-[#E5C378]',
    },
  };

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Detect cocoa cues or special ingredients
  const hasEggless = product.eggless || product.tags?.some((t) => t.toLowerCase().includes('eggless'));
  const hasDarkCocoa = product.tags?.some((t) => t.toLowerCase().includes('dark') || t.toLowerCase().includes('belgian') || t.toLowerCase().includes('couverture'));
  const isLowStock = product.stock > 0 && product.stock <= (product.lowStockThreshold || 5);

  // ================= HORIZONTAL LIST PRESENTATION =================
  if (layout === 'horizontal') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
        onClick={handleCardClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white/95 rounded-2xl border border-[#2D1810]/12 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#C59B27]/50 transition-all duration-300 flex flex-col sm:flex-row cursor-pointer"
      >
        {/* Horizontal Image Column */}
        <div className="relative sm:w-64 aspect-4/3 sm:aspect-square overflow-hidden bg-[#FAF7F2] shrink-0">
          <img
            src={isHovered && secondaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.badge && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border ${
                  badgeColorMap[product.badge]?.bg || 'bg-[#23120B]'
                } ${badgeColorMap[product.badge]?.text || 'text-white'} ${
                  badgeColorMap[product.badge]?.border || 'border-transparent'
                }`}
              >
                {product.badge}
              </span>
            )}
            {product.discountPercentage && (
              <span className="bg-[#C59B27] text-[#1A0F0A] text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlistToggle}
            className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors shadow-sm backdrop-blur-md ${
              isFavorited
                ? 'bg-rose-50 text-rose-600'
                : 'bg-white/85 text-[#23120B] hover:bg-white hover:text-rose-600'
            }`}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </motion.button>
        </div>

        {/* Details & Actions */}
        <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-[#C59B27]">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1 text-[#23120B] text-xs font-semibold bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#2D1810]/10">
                <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                <span>{product.rating}</span>
                <span className="text-[11px] text-[#3E2723]/50">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#23120B] group-hover:text-[#C59B27] transition-colors leading-snug">
              {product.name}
            </h3>

            <p className="text-xs sm:text-sm text-[#3E2723]/75 mt-2 line-clamp-2 leading-relaxed">
              {product.shortDescription || product.description}
            </p>

            {/* Special Highlights Bar */}
            <div className="flex flex-wrap items-center gap-2 mt-3 text-[11px]">
              {hasEggless && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  <span>100% Eggless</span>
                </span>
              )}
              {hasDarkCocoa && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EADBC8]/40 text-[#23120B] border border-[#2D1810]/10 font-semibold">
                  <span>🍫 Single Origin</span>
                </span>
              )}
              {isLowStock && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-semibold animate-pulse">
                  <Flame className="w-3 h-3 text-amber-600" />
                  <span>Only {product.stock} left</span>
                </span>
              )}
              {product.weight && (
                <span className="text-[#3E2723]/60 font-medium">
                  Weight: {product.weight}
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Actions */}
          <div className="mt-5 pt-4 border-t border-[#2D1810]/10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-2">
              <span className="text-xl sm:text-2xl font-bold font-serif text-[#23120B]">
                {siteSettings.currencySymbol}{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs sm:text-sm text-gray-400 line-through">
                  {siteSettings.currencySymbol}{product.originalPrice}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handleQuickView}
                className="px-4 py-2 bg-[#FAF7F2] hover:bg-white text-[#23120B] text-xs font-semibold rounded-xl border border-[#2D1810]/15 transition-all flex items-center gap-1.5 shadow-2xs hover:border-[#C59B27]"
              >
                <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Quick View</span>
              </button>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleQuickAdd}
                className={`px-5 py-2 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                  justAdded
                    ? 'bg-emerald-700 text-white'
                    : 'bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2]'
                }`}
              >
                {justAdded ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-200" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#DFB15B]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ================= STANDARD GRID PRESENTATION =================
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      whileHover={{ y: -6, transition: { duration: 0.25, ease: 'easeOut' } }}
      onClick={handleCardClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-white/95 rounded-2xl border border-[#2D1810]/12 overflow-hidden shadow-xs hover:shadow-2xl hover:border-[#C59B27]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      {/* Top Image Stage */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#FAF7F2] animate-chocolate-sheen">
        {/* Main Image with smooth crossfade to second image on hover */}
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108 ${
            isHovered && secondaryImage ? 'opacity-0 scale-95' : 'opacity-100'
          }`}
        />

        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} - view`}
            loading="lazy"
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-108 ${
              isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          />
        )}

        {/* Ambient Darkened Bottom Gradient for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Badges Stack */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border ${
                badgeColorMap[product.badge]?.bg || 'bg-[#23120B]'
              } ${badgeColorMap[product.badge]?.text || 'text-white'} ${
                badgeColorMap[product.badge]?.border || 'border-transparent'
              }`}
            >
              {product.badge}
            </span>
          )}
          {product.discountPercentage && (
            <span className="bg-[#C59B27] text-[#1A0F0A] text-[10px] font-black px-2 py-0.5 rounded-md shadow-xs">
              {product.discountPercentage}% OFF
            </span>
          )}
        </div>

        {/* Wishlist Button with Heart Spring Pop */}
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.85 }}
          onClick={handleWishlistToggle}
          className={`absolute top-3 right-3 z-10 p-2 rounded-full transition-colors shadow-sm backdrop-blur-md ${
            isFavorited
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/85 text-[#23120B] hover:bg-white hover:text-rose-600'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </motion.button>

        {/* Dietary / Special Indicator Pill */}
        <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1 pointer-events-none opacity-90 group-hover:opacity-0 transition-opacity duration-200">
          {hasEggless && (
            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-xs text-emerald-800 text-[10px] font-bold rounded-md shadow-2xs border border-emerald-200 flex items-center gap-0.5">
              <Leaf className="w-2.5 h-2.5 text-emerald-600" />
              <span>Eggless</span>
            </span>
          )}
          {product.weight && (
            <span className="px-2 py-0.5 bg-white/90 backdrop-blur-xs text-[#3E2723] text-[10px] font-semibold rounded-md shadow-2xs">
              {product.weight}
            </span>
          )}
        </div>

        {/* Floating Quick Action Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 z-20">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickView}
            className="flex-1 py-2 px-3 bg-white/95 hover:bg-white text-[#23120B] text-xs font-bold rounded-xl shadow-lg transition-colors flex items-center justify-center gap-1.5 backdrop-blur-xs border border-[#2D1810]/10"
          >
            <Eye className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Quick View</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleQuickAdd}
            className={`p-2.5 rounded-xl shadow-lg transition-colors flex items-center justify-center ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2]'
            }`}
            title="Quick Add to Bag"
          >
            {justAdded ? (
              <Check className="w-4 h-4 text-emerald-200" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#C59B27]">
              {product.categoryName}
            </span>
            <div className="flex items-center gap-1 text-[#2D1810]">
              <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
              <span className="text-xs font-bold">{product.rating}</span>
              <span className="text-[10px] text-[#3E2723]/50">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-base sm:text-lg font-bold text-[#23120B] group-hover:text-[#C59B27] transition-colors line-clamp-1 leading-snug">
            {product.name}
          </h3>

          {/* Short description */}
          <p className="text-xs text-[#3E2723]/70 line-clamp-2 mt-1.5 leading-relaxed">
            {product.shortDescription || product.description}
          </p>

          {/* Freshness Urgency / Dietary Tag */}
          <div className="mt-2.5 flex items-center gap-1.5">
            {isLowStock ? (
              <span className="text-[10px] text-amber-800 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-ping"></span>
                <span>Only {product.stock} left in atelier</span>
              </span>
            ) : (
              <span className="text-[10px] text-[#3E2723]/60 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" />
                <span>Handcrafted fresh daily</span>
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Action Bar */}
        <div className="mt-4 pt-3 border-t border-[#2D1810]/10 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base sm:text-lg font-bold font-serif text-[#23120B]">
                {siteSettings.currencySymbol}{product.price}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-gray-400 line-through">
                  {siteSettings.currencySymbol}{product.originalPrice}
                </span>
              )}
            </div>
            {product.weight && (
              <span className="text-[10px] text-[#3E2723]/60 font-medium sm:hidden">
                {product.weight}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={handleQuickAdd}
            className={`sm:hidden px-3.5 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1 shadow-xs transition-colors ${
              justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-[#23120B] text-[#FAF7F2] hover:bg-[#C59B27]'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </motion.button>

          <span className="hidden sm:inline-flex items-center text-xs font-semibold text-[#C59B27] group-hover:translate-x-1 transition-transform">
            Taste &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
};
