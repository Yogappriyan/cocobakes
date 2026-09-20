import React from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, Sparkles, Copy, CheckCircle2, ArrowRight } from 'lucide-react';

interface OffersPageProps {
  navigate: (path: string) => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ navigate }) => {
  const { coupons, offers, siteSettings, showToast } = useStore();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Promo Code Copied!', `Code "${code}" copied to clipboard`);
  };

  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADBC8]/50 text-[#C59B27] text-xs font-bold uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" />
          <span>Exclusive Privileges</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#23120B]">
          Current Atelier Offers &amp; Promo Codes
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2723]/70">
          Apply these handcrafted discount coupons at checkout to enjoy savings on your orders.
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons
          .filter((c) => c.active)
          .map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#C59B27]/40 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#23120B] text-[#DFB15B] text-xs font-bold rounded-lg font-mono tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `FLAT ${siteSettings.currencySymbol}${coupon.discountValue} OFF`}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#23120B] mt-3">
                  {coupon.description}
                </h3>

                <p className="text-xs text-[#3E2723]/70 mt-1">
                  Valid on minimum purchase of {siteSettings.currencySymbol}
                  {coupon.minOrderAmount}.
                  {coupon.maxDiscount &&
                    ` Maximum discount of ${siteSettings.currencySymbol}${coupon.maxDiscount}.`}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2D1810]/5 flex items-center justify-between">
                <button
                  onClick={() => handleCopyCode(coupon.code)}
                  className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EADBC8]/40 border border-[#2D1810]/15 rounded-xl text-xs font-bold text-[#23120B] transition-colors flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Copy Code</span>
                </button>

                <button
                  onClick={() => navigate('/shop')}
                  className="text-xs font-bold text-[#C59B27] hover:underline flex items-center gap-1"
                >
                  <span>Redeem Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Free delivery banner */}
      <div className="bg-[#23120B] rounded-3xl p-8 text-center text-white space-y-2 border border-[#C59B27]/30">
        <Sparkles className="w-6 h-6 text-[#DFB15B] mx-auto" />
        <h3 className="font-serif text-2xl font-bold text-white">
          Complimentary Fresh Delivery
        </h3>
        <p className="text-xs text-[#EADBC8]/90 max-w-md mx-auto">
          Every order above {siteSettings.currencySymbol}{siteSettings.freeDeliveryThreshold} automatically qualifies for zero delivery fees. No promo code needed.
        </p>
      </div>
    </div>
  );
};
