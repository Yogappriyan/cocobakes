import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Star,
  Plus,
  Minus,
  ShoppingBag,
  Heart,
  ExternalLink,
  ShieldCheck,
  Check,
  Sparkles,
  Leaf,
  Flame,
} from 'lucide-react';
import { ProductVariant, ProductAddon } from '../../types';

interface QuickViewModalProps {
  navigate: (path: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ navigate }) => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    siteSettings,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const product = quickViewProduct;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedFlavour, setSelectedFlavour] = useState<string | undefined>(
    product?.flavours && product.flavours.length > 0 ? product.flavours[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  if (!product) return null;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : [product.thumbnail || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'];

  const handleToggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  const currentPrice = selectedVariant ? selectedVariant.price : product.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = currentPrice + addonsTotal;
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    setIsAdding(true);
    addToCart(product, {
      quantity,
      variant: selectedVariant,
      selectedFlavour,
      selectedAddons,
    });
    setTimeout(() => {
      setIsAdding(false);
      setQuickViewProduct(null);
    }, 600);
  };

  const handleViewFullDetails = () => {
    setQuickViewProduct(null);
    navigate(`/product/${product.slug}`);
  };

  const hasEggless = product.eggless || product.tags?.some((t) => t.toLowerCase().includes('eggless'));
  const isFavorited = isInWishlist(product.id);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm"
          onClick={() => setQuickViewProduct(null)}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-3xl bg-[#FAF7F2] rounded-3xl shadow-2xl border border-[#C59B27]/30 z-10 overflow-hidden my-auto"
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-30 p-2.5 bg-white/90 hover:bg-white text-[#23120B] rounded-full shadow-lg transition-transform hover:scale-105"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Gallery Column */}
            <div className="relative bg-[#23120B]/5 flex flex-col justify-between p-4 sm:p-5 border-b md:border-b-0 md:border-r border-[#2D1810]/10">
              {/* Main Preview Image */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-inner bg-[#FAF7F2] animate-chocolate-sheen">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0.4, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  src={images[activeImageIndex] || images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Badge */}
                {product.badge && (
                  <span className="absolute top-3 left-3 bg-[#23120B] text-[#DFB15B] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md border border-[#C59B27]/30">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Multi-Image Thumbnail Selector */}
              {images.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-14 h-14 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        activeImageIndex === idx
                          ? 'border-[#C59B27] ring-2 ring-[#C59B27]/30 scale-105'
                          : 'border-[#2D1810]/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Sensory Highlights Bar */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-[#3E2723]/80 px-1">
                <span className="flex items-center gap-1 font-semibold text-[#C59B27]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Belgian Couverture</span>
                </span>
                {hasEggless && (
                  <span className="flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Leaf className="w-3 h-3 text-emerald-600" />
                    <span>100% Eggless</span>
                  </span>
                )}
              </div>
            </div>

            {/* Customization Details Column */}
            <div className="p-6 sm:p-7 flex flex-col justify-between max-h-[82vh] overflow-y-auto">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between text-xs text-[#C59B27] font-bold uppercase tracking-wider mb-1">
                  <span>{product.categoryName}</span>
                  <div className="flex items-center gap-1 text-[#23120B]">
                    <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                    <span className="font-bold">{product.rating}</span>
                    <span className="text-[10px] text-[#3E2723]/50">({product.reviewCount})</span>
                  </div>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B] leading-snug">
                  {product.name}
                </h3>

                {/* Price Bar */}
                <div className="flex items-baseline gap-2.5 mt-2 mb-3">
                  <span className="text-2xl font-bold font-serif text-[#23120B]">
                    {siteSettings.currencySymbol}{unitPrice}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {siteSettings.currencySymbol}{product.originalPrice}
                    </span>
                  )}
                  {product.discountPercentage && (
                    <span className="text-[11px] font-bold text-[#23120B] bg-[#C59B27] px-2 py-0.5 rounded-md">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#3E2723]/80 leading-relaxed line-clamp-3 mb-4">
                  {product.shortDescription || product.description}
                </p>

                {/* Variants Box Size */}
                {product.variants && product.variants.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-[#23120B] uppercase tracking-wider mb-2">
                      Portion / Box Selection:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => setSelectedVariant(v)}
                          className={`px-3 py-2 text-xs rounded-xl border text-left transition-all ${
                            selectedVariant?.id === v.id
                              ? 'border-[#23120B] bg-[#23120B] text-[#FAF7F2] shadow-sm'
                              : 'border-[#2D1810]/15 bg-white text-[#2D1810] hover:border-[#C59B27]'
                          }`}
                        >
                          <div className="font-bold">{v.name}</div>
                          <div className="text-[10px] opacity-80 mt-0.5">
                            {siteSettings.currencySymbol}{v.price} {v.weight ? `• ${v.weight}` : ''}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Flavour Options */}
                {product.flavours && product.flavours.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-[#23120B] uppercase tracking-wider mb-2">
                      Flavour Profile:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {product.flavours.map((flavour) => (
                        <button
                          key={flavour}
                          type="button"
                          onClick={() => setSelectedFlavour(flavour)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                            selectedFlavour === flavour
                              ? 'border-[#C59B27] bg-[#C59B27] text-white font-bold shadow-xs'
                              : 'border-[#2D1810]/15 bg-white text-[#2D1810] hover:border-[#C59B27]'
                          }`}
                        >
                          {flavour}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optional Gifting Add-ons */}
                {product.addons && product.addons.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-xs font-bold text-[#23120B] uppercase tracking-wider mb-2">
                      Artisanal Add-ons:
                    </label>
                    <div className="space-y-1.5">
                      {product.addons.map((addon) => {
                        const isSelected = selectedAddons.some((a) => a.id === addon.id);
                        return (
                          <button
                            key={addon.id}
                            type="button"
                            onClick={() => handleToggleAddon(addon)}
                            className={`w-full flex items-center justify-between p-2.5 text-xs rounded-xl border transition-all ${
                              isSelected
                                ? 'border-[#C59B27] bg-[#EADBC8]/35 text-[#23120B] font-bold'
                                : 'border-[#2D1810]/15 bg-white text-[#3E2723]/80 hover:border-[#C59B27]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-4 h-4 rounded-md flex items-center justify-center border transition-colors ${
                                  isSelected
                                    ? 'bg-[#C59B27] border-[#C59B27] text-white'
                                    : 'border-[#2D1810]/30'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3" />}
                              </div>
                              <span>{addon.name}</span>
                            </div>
                            <span>+{siteSettings.currencySymbol}{addon.price}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions Stage */}
              <div className="pt-4 border-t border-[#2D1810]/10 space-y-3">
                <div className="flex items-center gap-2.5">
                  {/* Quantity Counter */}
                  <div className="flex items-center border border-[#2D1810]/20 rounded-xl bg-white overflow-hidden shadow-2xs">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-2.5 hover:bg-[#EADBC8]/40 text-[#23120B] transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3.5 font-bold text-xs sm:text-sm text-[#23120B]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-2.5 hover:bg-[#EADBC8]/40 text-[#23120B] transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add to Bag Button */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleAddToCart}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                      isAdding
                        ? 'bg-emerald-700 text-white'
                        : 'bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2]'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-200" />
                        <span>Added to Bag!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#DFB15B]" />
                        <span>Add to Bag • {siteSettings.currencySymbol}{totalPrice}</span>
                      </>
                    )}
                  </motion.button>

                  {/* Wishlist button */}
                  <motion.button
                    whileTap={{ scale: 0.85 }}
                    onClick={() => toggleWishlist(product.id)}
                    className={`p-3 rounded-xl border border-[#2D1810]/15 transition-colors ${
                      isFavorited
                        ? 'text-rose-600 bg-rose-50 border-rose-200'
                        : 'text-[#23120B] hover:bg-white'
                    }`}
                    aria-label="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </motion.button>
                </div>

                {/* View Full Tasting Page */}
                <button
                  onClick={handleViewFullDetails}
                  className="w-full text-center text-xs font-bold text-[#C59B27] hover:underline flex items-center justify-center gap-1.5 pt-1"
                >
                  <span>Explore Full Tasting Profile, Nutrition &amp; Reviews</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
