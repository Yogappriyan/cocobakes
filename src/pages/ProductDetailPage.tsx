import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ProductVariant, ProductAddon } from '../types';
import {
  Star,
  Heart,
  Share2,
  ShoppingBag,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Truck,
  Check,
  Clock,
  AlertCircle,
  Award,
  ArrowLeft,
  MessageCircle,
  Leaf,
  Flame,
} from 'lucide-react';

interface ProductDetailPageProps {
  productSlug: string;
  navigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productSlug,
  navigate,
}) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isInWishlist,
    siteSettings,
    addReview,
    showToast,
  } = useStore();

  const product = products.find(
    (p) => p.slug === productSlug || p.id === productSlug
  );

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Customization state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product?.variants && product.variants.length > 0 ? product.variants[0] : undefined
  );
  const [selectedFlavour, setSelectedFlavour] = useState<string | undefined>(
    product?.flavours && product.flavours.length > 0 ? product.flavours[0] : undefined
  );
  const [selectedAddons, setSelectedAddons] = useState<ProductAddon[]>([]);
  const [customMessage, setCustomMessage] = useState('');
  const [quantity, setQuantity] = useState(1);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'details' | 'ingredients' | 'allergens' | 'storage'>('details');

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-[#23120B]">Dessert Not Found</h2>
        <p className="text-sm text-[#3E2723]/70 mt-2 mb-6">
          This creation might be out of season or currently sold out.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-[#23120B] text-white rounded-full text-xs font-semibold"
        >
          Explore Available Bakes
        </button>
      </div>
    );
  }

  // Addon handler
  const handleToggleAddon = (addon: ProductAddon) => {
    setSelectedAddons((prev) =>
      prev.some((a) => a.id === addon.id)
        ? prev.filter((a) => a.id !== addon.id)
        : [...prev, addon]
    );
  };

  // Price calculations
  const basePrice = selectedVariant ? selectedVariant.price : product.price;
  const addonsTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const unitPrice = basePrice + addonsTotal;
  const grandTotal = unitPrice * quantity;

  // Add to Bag
  const handleAddToCart = () => {
    addToCart(product, {
      quantity,
      variant: selectedVariant,
      selectedFlavour,
      selectedAddons,
      customMessage: customMessage.trim() || undefined,
    });
  };

  // Buy Now
  const handleBuyNow = () => {
    addToCart(product, {
      quantity,
      variant: selectedVariant,
      selectedFlavour,
      selectedAddons,
      customMessage: customMessage.trim() || undefined,
    });
    navigate('/checkout');
  };

  // Share
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Look at this delicious bake from ${siteSettings.brandName}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', 'Product URL copied to clipboard', 'info');
    }
  };

  // Submit review
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim() || !reviewComment.trim()) {
      showToast('Incomplete Review', 'Please enter your name and comments', 'warning');
      return;
    }

    addReview({
      productId: product.id,
      customerName: reviewAuthor.trim(),
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewAuthor('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  // Related products (same category or featured)
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  const images = product.images.length > 0 ? product.images : [product.thumbnail];
  const isFavorited = isInWishlist(product.id);

  return (
    <div className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#3E2723]/60 mb-6">
        <button onClick={() => navigate('/')} className="hover:text-[#23120B]">Home</button>
        <span>/</span>
        <button onClick={() => navigate('/shop')} className="hover:text-[#23120B]">Shop</button>
        <span>/</span>
        <button
          onClick={() => navigate(`/category/${product.categorySlug}`)}
          className="hover:text-[#23120B]"
        >
          {product.categoryName}
        </button>
        <span>/</span>
        <span className="text-[#23120B] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="relative rounded-3xl overflow-hidden aspect-square bg-[#FAF7F2] border border-[#2D1810]/10 shadow-xl group animate-chocolate-sheen">
            <motion.img
              key={selectedImageIndex}
              initial={{ opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              src={images[selectedImageIndex] || images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
              {product.badge && (
                <span className="bg-[#23120B] text-[#DFB15B] text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md border border-[#C59B27]/40">
                  {product.badge}
                </span>
              )}
              {product.discountPercentage && (
                <span className="bg-[#C59B27] text-[#1A0F0A] text-xs font-black px-2.5 py-1 rounded-md shadow-sm">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Floating actions: Wishlist & Share */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 rounded-full shadow-md backdrop-blur-md transition-all ${
                  isFavorited
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-white/85 text-[#23120B] hover:bg-white hover:text-rose-600'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                onClick={handleShare}
                className="p-3 bg-white/85 hover:bg-white text-[#23120B] rounded-full shadow-md backdrop-blur-md transition-all"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Thumbnail list if multiple */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-[#C59B27] ring-2 ring-[#C59B27]/30 scale-102'
                      : 'border-[#2D1810]/15 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Atelier Commitments */}
          <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#2D1810]/10 grid grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <Sparkles className="w-5 h-5 text-[#C59B27] mb-1" />
              <span className="text-xs font-bold text-[#23120B]">70% Couverture</span>
              <span className="text-[10px] text-[#3E2723]/60">Pure Cocoa Butter</span>
            </div>
            <div className="flex flex-col items-center">
              <Clock className="w-5 h-5 text-[#C59B27] mb-1" />
              <span className="text-xs font-bold text-[#23120B]">Baked To Order</span>
              <span className="text-[10px] text-[#3E2723]/60">Zero Preservatives</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-5 h-5 text-[#C59B27] mb-1" />
              <span className="text-xs font-bold text-[#23120B]">Fresh Delivery</span>
              <span className="text-[10px] text-[#3E2723]/60">Insulated Box</span>
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Purchase */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            {/* Category tag & reviews */}
            <div className="flex items-center justify-between gap-2 text-xs mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
                {product.categoryName}
              </span>
              <div className="flex items-center gap-1.5 bg-[#EADBC8]/40 px-3 py-1 rounded-full text-xs font-semibold text-[#23120B]">
                <Star className="w-3.5 h-3.5 fill-[#C59B27] text-[#C59B27]" />
                <span>{product.rating}</span>
                <span className="text-[#3E2723]/60">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B] leading-tight">
              {product.name}
            </h1>

            {/* Stock status */}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  product.stock > 5 ? 'bg-emerald-500' : product.stock > 0 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
              />
              <span className="text-xs font-semibold text-[#3E2723]/80">
                {product.stock > 5
                  ? 'Fresh batch ready for baking'
                  : product.stock > 0
                  ? `Only ${product.stock} boxes remaining today`
                  : 'Sold out for today'}
              </span>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-bold text-[#23120B]">
                {siteSettings.currencySymbol}{grandTotal}
              </span>
              {product.originalPrice && (
                <span className="text-base text-gray-400 line-through">
                  {siteSettings.currencySymbol}{product.originalPrice * quantity}
                </span>
              )}
              {unitPrice !== product.price && (
                <span className="text-xs text-[#3E2723]/60">
                  ({siteSettings.currencySymbol}{unitPrice} per box)
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#3E2723]/80 mt-3 leading-relaxed">
              {product.description}
            </p>

            {/* Sensory Tasting Meter */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FAF7F2] border border-[#2D1810]/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#23120B]">
                <span className="flex items-center gap-1.5 text-[#C59B27]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cacao Profile &amp; Sensory Notes</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider text-[#3E2723]/60">Hand-tempered</span>
              </div>

              {/* Progress bars */}
              <div className="space-y-2 text-[11px]">
                <div>
                  <div className="flex justify-between text-[#3E2723]/80 font-semibold mb-1">
                    <span>Cocoa Intensity</span>
                    <span className="text-[#23120B] font-bold">70% Callebaut Couverture</span>
                  </div>
                  <div className="w-full h-2 bg-[#EADBC8]/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#3E2723] to-[#23120B] rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[#3E2723]/80 font-semibold mb-1">
                    <span>Molten Center / Fudginess</span>
                    <span className="text-[#23120B] font-bold">Silky &amp; Dense</span>
                  </div>
                  <div className="w-full h-2 bg-[#EADBC8]/50 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#DFB15B] to-[#C59B27] rounded-full" style={{ width: '92%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Variants (Box sizes) */}
          {product.variants && product.variants.length > 0 && (
            <div className="border-t border-[#2D1810]/10 pt-4">
              <label className="block text-xs font-bold text-[#23120B] uppercase tracking-wider mb-2.5">
                Choose Box Size &amp; Quantity:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedVariant?.id === variant.id
                        ? 'border-[#23120B] bg-[#23120B] text-white shadow-md'
                        : 'border-[#2D1810]/15 bg-white text-[#2D1810] hover:border-[#C59B27]'
                    }`}
                  >
                    <div className="font-bold text-xs">{variant.name}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">
                      {siteSettings.currencySymbol}{variant.price} {variant.weight ? `• ${variant.weight}` : ''}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Flavour Options */}
          {product.flavours && product.flavours.length > 0 && (
            <div className="border-t border-[#2D1810]/10 pt-4">
              <label className="block text-xs font-bold text-[#23120B] uppercase tracking-wider mb-2.5">
                Flavour Choice:
              </label>
              <div className="flex flex-wrap gap-2">
                {product.flavours.map((flavour) => (
                  <button
                    key={flavour}
                    type="button"
                    onClick={() => setSelectedFlavour(flavour)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                      selectedFlavour === flavour
                        ? 'border-[#C59B27] bg-[#C59B27] text-white shadow-sm'
                        : 'border-[#2D1810]/15 bg-white text-[#2D1810] hover:border-[#C59B27]'
                    }`}
                  >
                    {flavour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gifting Add-ons */}
          {product.addons && product.addons.length > 0 && (
            <div className="border-t border-[#2D1810]/10 pt-4">
              <label className="block text-xs font-bold text-[#23120B] uppercase tracking-wider mb-2.5">
                Luxury Add-ons &amp; Gifting:
              </label>
              <div className="space-y-2">
                {product.addons.map((addon) => {
                  const isSelected = selectedAddons.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => handleToggleAddon(addon)}
                      className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs transition-all ${
                        isSelected
                          ? 'border-[#C59B27] bg-[#EADBC8]/30 font-semibold text-[#23120B]'
                          : 'border-[#2D1810]/15 bg-white text-[#3E2723]/80 hover:border-[#C59B27]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-sm flex items-center justify-center border ${
                            isSelected
                              ? 'bg-[#C59B27] border-[#C59B27] text-white'
                              : 'border-[#2D1810]/30'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span>{addon.name}</span>
                      </div>
                      <span className="font-bold">+{siteSettings.currencySymbol}{addon.price}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Custom Greeting Note */}
          <div className="border-t border-[#2D1810]/10 pt-4">
            <label className="block text-xs font-bold text-[#23120B] uppercase tracking-wider mb-2">
              Complimentary Gift Card Message (Optional):
            </label>
            <textarea
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="e.g. Happy 30th Birthday Rahul! Enjoy the rich dark chocolate feast."
              maxLength={150}
              rows={2}
              className="w-full p-3 text-xs bg-white border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27] placeholder:text-[#3E2723]/40"
            />
            <div className="text-[10px] text-right text-[#3E2723]/50 mt-1">
              {customMessage.length}/150 characters
            </div>
          </div>

          {/* Quantity & CTA Buttons */}
          <div className="border-t border-[#2D1810]/10 pt-6 space-y-3">
            <div className="flex items-center gap-3">
              {/* Quantity selector */}
              <div className="flex items-center border border-[#2D1810]/20 rounded-xl bg-white overflow-hidden shadow-2xs">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-3 hover:bg-[#EADBC8]/40 text-[#23120B] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 font-bold text-sm text-[#23120B]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-3 hover:bg-[#EADBC8]/40 text-[#23120B] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3.5 px-5 bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2] font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group"
              >
                <ShoppingBag className="w-4 h-4 text-[#DFB15B] group-hover:text-white" />
                <span>Add to Bag • {siteSettings.currencySymbol}{grandTotal}</span>
              </button>
            </div>

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-5 bg-[#C59B27] hover:bg-[#DFB15B] text-[#23120B] font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Instant Buy Now &rarr;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs: Details, Ingredients, Allergens, Storage */}
      <div className="mt-16 bg-white rounded-3xl p-6 sm:p-10 border border-[#2D1810]/10 shadow-xs">
        {/* Tab Headers */}
        <div className="flex flex-wrap gap-2 border-b border-[#2D1810]/10 pb-4">
          {[
            { id: 'details', label: 'Tasting & Craft Notes' },
            { id: 'ingredients', label: 'Pure Ingredients' },
            { id: 'allergens', label: 'Allergen Advisory' },
            { id: 'storage', label: 'Storage & Warming Guide' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#23120B] text-[#FAF7F2] shadow-xs'
                  : 'text-[#3E2723]/70 hover:text-[#23120B] hover:bg-[#FAF7F2]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="pt-6">
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl text-xs sm:text-sm text-[#3E2723]/80 leading-relaxed">
              <p>{product.description}</p>
              <p>
                Our confectioners prepare each batch in temperature-controlled ateliers using genuine Callebaut single-origin dark chocolate callets. The batter is aerated to perfection, developing our signature glossy paper-thin crust while holding a dense, fudgy center that warms gently on the tongue.
              </p>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div className="space-y-3 max-w-3xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
                Ingredients List:
              </h4>
              <p className="text-xs sm:text-sm text-[#3E2723]/80 leading-relaxed">
                {product.ingredients ||
                  'Callebaut 70.5% Dark Belgian Chocolate, Fresh Creamery Butter, Farm Eggs, Raw Muscovado Sugar, Dutch Processed Cocoa Powder, Premium Wheat Flour, Pure Bourbon Vanilla Bean, Flaky Sea Salt.'}
              </p>
            </div>
          )}

          {activeTab === 'allergens' && (
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Contains {product.allergens || 'Milk (Butter/Dairy), Eggs, Wheat (Gluten), Tree Nuts (Hazelnuts). May contain traces of soy.'}
                </span>
              </div>
              <p className="text-xs text-[#3E2723]/70">
                Our kitchen also handles pistachio, almonds, and peanuts. Please let our concierge know of severe allergies prior to dispatch.
              </p>
            </div>
          )}

          {activeTab === 'storage' && (
            <div className="space-y-3 max-w-3xl text-xs sm:text-sm text-[#3E2723]/80 leading-relaxed">
              <ul className="list-disc pl-5 space-y-1.5">
                <li>Best enjoyed within 5 days from delivery date when stored refrigerated in an airtight box.</li>
                <li><strong>Pro Warming Tip:</strong> Microwave individual slice for 10-15 seconds at 50% power for an intoxicating molten ganache flow.</li>
                <li>Can be frozen for up to 30 days without loss of texture or aroma.</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="mt-16 bg-[#FDFBF7] rounded-3xl p-6 sm:p-10 border border-[#2D1810]/10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-[#2D1810]/10">
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B]">
              Customer Reviews ({product.reviewCount})
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-[#C59B27]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating) ? 'fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-[#23120B]">{product.rating} out of 5</span>
            </div>
          </div>

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-6 py-2.5 bg-[#23120B] text-white rounded-full text-xs font-semibold hover:bg-[#C59B27] transition-colors self-start md:self-auto"
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form Modal/Drawer */}
        {showReviewForm && (
          <form onSubmit={handleReviewSubmit} className="mt-6 bg-white p-6 rounded-2xl border border-[#C59B27]/30 shadow-sm space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#23120B]">Share Your Tasting Notes</h4>

            <div>
              <label className="block text-xs font-bold text-[#23120B] mb-1">Your Rating:</label>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-[#C59B27]"
                  >
                    <Star
                      className={`w-6 h-6 ${star <= reviewRating ? 'fill-[#C59B27]' : 'text-gray-300'}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#23120B] mb-1">Your Name:</label>
                <input
                  type="text"
                  required
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  placeholder="e.g. Ananya M."
                  className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#23120B] mb-1">Your Review:</label>
              <textarea
                required
                rows={3}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you love about the texture, chocolate intensity, and packaging?"
                className="w-full p-3 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#C59B27] text-white text-xs font-bold rounded-xl hover:bg-[#DFB15B] transition-colors"
            >
              Submit Review
            </button>
          </form>
        )}

        {/* Existing Reviews List */}
        <div className="pt-6 space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-[#2D1810]/5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-xs text-[#23120B]">Priya Sharma</span>
                <span className="text-[10px] text-[#3E2723]/50 ml-2">Verified Patron</span>
              </div>
              <div className="flex text-[#C59B27]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#3E2723]/80 leading-relaxed">
              "The crunch of the roasted hazelnuts paired with the gooey center is heavenly. Best brownies I have tasted in India by far. The packaging felt like a luxury jewelry box!"
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-[#2D1810]/5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-xs text-[#23120B]">Vikram Nair</span>
                <span className="text-[10px] text-[#3E2723]/50 ml-2">Verified Patron</span>
              </div>
              <div className="flex text-[#C59B27]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-[#3E2723]/80 leading-relaxed">
              "Delivered on time for my anniversary. Heated it for 12 seconds in the microwave as recommended and the dark chocolate molten aroma filled the entire room."
            </p>
          </div>
        </div>
      </section>

      {/* Related Products Recommendation */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-8 border-t border-[#2D1810]/10">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B] mb-6">
            Fellow Chocolate Lovers Also Ordered
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
