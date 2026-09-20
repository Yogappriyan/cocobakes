import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../../context/StoreContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  Heart,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Tag,
  Check,
} from 'lucide-react';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTax,
    cartTotal,
    cartCount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    siteSettings,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponSuccess(res.message);
      setCouponInput('');
    } else {
      setCouponError(res.message);
    }
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return;
    const itemsText = cart
      .map(
        (i) =>
          `• ${i.quantity}x ${i.product.name} (${i.variant?.name || 'Standard'}${
            i.selectedFlavour ? ` | ${i.selectedFlavour}` : ''
          }) - ${siteSettings.currencySymbol}${i.totalPrice}`
      )
      .join('\n');

    const message = `Hello ${siteSettings.brandName} Atelier! 🍰\nI would like to place an order:\n\n${itemsText}\n\nSubtotal: ${siteSettings.currencySymbol}${cartSubtotal}\nDelivery: ${
      cartDeliveryFee === 0 ? 'FREE' : `${siteSettings.currencySymbol}${cartDeliveryFee}`
    }\nTotal Amount: ${siteSettings.currencySymbol}${cartTotal}\n\nPlease confirm availability and payment details. Thank you!`;

    const encoded = encodeURIComponent(message);
    const phone = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const freeDeliveryThreshold = siteSettings.freeDeliveryThreshold;
  const progressToFree = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);
  const remainingForFree = Math.max(0, freeDeliveryThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer content */}
      <div className="relative w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#2D1810]/10 flex items-center justify-between bg-[#FDFBF7]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#C59B27]" />
            <h2 className="font-serif text-xl font-bold text-[#23120B]">
              Your Tasting Bag ({cartCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#2D1810]/70 hover:text-[#23120B] hover:bg-[#EADBC8]/40 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free delivery tracker */}
        <div className="bg-[#EADBC8]/30 px-5 py-2.5 border-b border-[#2D1810]/5 text-xs text-[#23120B]">
          {cartSubtotal >= freeDeliveryThreshold ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Sparkles className="w-4 h-4 text-[#C59B27]" />
              <span>Congratulations! You qualify for complimentary fresh delivery!</span>
            </div>
          ) : (
            <div>
              <p className="font-medium text-[#2D1810]">
                Add <span className="font-bold text-[#C59B27]">{siteSettings.currencySymbol}{remainingForFree}</span> more to unlock <span className="font-bold">FREE Delivery</span>!
              </p>
              <div className="w-full bg-[#EADBC8] h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="bg-[#C59B27] h-full transition-all duration-300 rounded-full"
                  style={{ width: `${progressToFree}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-[#EADBC8]/40 flex items-center justify-center text-3xl">
                🍪
              </div>
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#23120B]">Your bag is empty</h3>
                <p className="text-sm text-[#3E2723]/70 mt-1 max-w-xs">
                  Discover our freshly baked artisanal brownies, luxury truffles, and celebration cakes.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="px-6 py-2.5 bg-[#23120B] text-[#FAF7F2] text-sm font-semibold rounded-full hover:bg-[#C59B27] transition-colors shadow-xs"
              >
                Explore Atelier Bakes
              </button>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {cart.map((item, index) => (
                <motion.div
                  key={`${item.productId}-${item.variant?.id}-${item.selectedFlavour}-${index}`}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="flex gap-3 sm:gap-4 p-3.5 bg-white rounded-2xl border border-[#2D1810]/8 shadow-2xs hover:border-[#C59B27]/40 transition-all"
                >
                  {/* Product thumbnail */}
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl shrink-0 bg-[#FAF7F2] border border-[#2D1810]/5"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#23120B] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(index)}
                          className="text-[#3E2723]/40 hover:text-rose-600 transition-colors p-1 -mr-1"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Variant & options */}
                      <div className="text-[11px] text-[#3E2723]/70 mt-0.5 space-y-0.5">
                        {item.variant && <p className="font-medium">Size: {item.variant.name}</p>}
                        {item.selectedFlavour && <p>Flavour: {item.selectedFlavour}</p>}
                        {item.selectedAddons && item.selectedAddons.length > 0 && (
                          <p className="text-[#C59B27] font-semibold">
                            + {item.selectedAddons.map((a) => a.name).join(', ')}
                          </p>
                        )}
                        {item.customMessage && (
                          <p className="italic text-gray-500">"{item.customMessage}"</p>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#2D1810]/5">
                      <div className="flex items-center border border-[#2D1810]/15 rounded-lg overflow-hidden bg-[#FAF7F2]">
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity - 1)}
                          className="p-1.5 hover:bg-[#EADBC8]/50 text-[#23120B] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#23120B]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(index, item.quantity + 1)}
                          className="p-1.5 hover:bg-[#EADBC8]/50 text-[#23120B] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => toggleWishlist(item.productId)}
                          className={`p-1 transition-colors ${
                            isInWishlist(item.productId)
                              ? 'text-rose-500'
                              : 'text-[#3E2723]/40 hover:text-rose-500'
                          }`}
                          aria-label="Save to favorites"
                          title="Save to Wishlist"
                        >
                          <Heart className="w-3.5 h-3.5 fill-current" />
                        </button>
                        <span className="text-sm font-bold text-[#23120B]">
                          {siteSettings.currencySymbol}
                          {item.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer with totals and action buttons */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#2D1810]/10 bg-[#FDFBF7] space-y-3">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="font-semibold">{appliedCoupon.code}</span>
                    <span>applied (-{siteSettings.currencySymbol}{cartDiscount})</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-rose-600 font-bold ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo code (e.g. WELCOME10)"
                      className="w-full px-3 py-2 text-xs bg-white border border-[#2D1810]/15 rounded-lg focus:outline-hidden focus:border-[#C59B27] uppercase tracking-wider"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 text-xs font-semibold bg-[#23120B] text-[#FAF7F2] hover:bg-[#C59B27] rounded-lg transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-600 mt-1">{couponSuccess}</p>}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#3E2723]/80 border-t border-[#2D1810]/5 pt-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#2D1810]">
                  {siteSettings.currencySymbol}{cartSubtotal}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount</span>
                  <span>-{siteSettings.currencySymbol}{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>
                  {cartDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase">Free</span>
                  ) : (
                    `${siteSettings.currencySymbol}${cartDeliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Taxes (5% GST)</span>
                <span>{siteSettings.currencySymbol}{cartTax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#23120B] pt-1 border-t border-[#2D1810]/10">
                <span>Grand Total</span>
                <span className="text-[#C59B27]">
                  {siteSettings.currencySymbol}{cartTotal}
                </span>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={handleCheckout}
                className="w-full py-3 px-4 bg-[#23120B] text-[#FAF7F2] font-semibold text-sm rounded-xl hover:bg-[#C59B27] transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* WhatsApp Ordering Option */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-2.5 px-4 bg-[#25D366]/10 text-[#1E7E34] border border-[#25D366]/30 font-semibold text-xs rounded-xl hover:bg-[#25D366]/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Quick Order via WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
