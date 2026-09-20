import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Coupon, OfferBanner } from '../../types';
import { Plus, Tag, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';

export const AdminCoupons: React.FC = () => {
  const {
    coupons,
    addCoupon,
    deleteCoupon,
    offers,
    setOffers,
    siteSettings,
    showToast,
  } = useStore();

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  // Coupon form state
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(499);
  const [maxDiscount, setMaxDiscount] = useState<number>(200);

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    addCoupon({
      code: code.trim().toUpperCase(),
      description: description.trim(),
      discountType,
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount),
      maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
      active: true,
    });

    showToast('Promo Code Added', `Coupon "${code.toUpperCase()}" is now active`);
    setIsCouponModalOpen(false);
    setCode('');
    setDescription('');
  };

  const handleDeleteCoupon = (id: string, couponCode: string) => {
    if (window.confirm(`Delete coupon "${couponCode}"?`)) {
      deleteCoupon(id);
      showToast('Coupon Deleted', `Removed ${couponCode}`);
    }
  };

  const toggleOfferActive = (id: string) => {
    setOffers(
      offers.map((o) => (o.id === id ? { ...o, active: !o.active } : o))
    );
    showToast('Offer Updated', 'Homepage banner state toggled');
  };

  return (
    <div className="space-y-10">
      {/* Coupons Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#23120B]">
              Discount Coupons &amp; Vouchers ({coupons.length})
            </h3>
            <p className="text-xs text-[#3E2723]/60">
              Create and manage promotional discount codes redeemed at checkout.
            </p>
          </div>

          <button
            onClick={() => setIsCouponModalOpen(true)}
            className="px-4 py-2 bg-[#23120B] hover:bg-[#C59B27] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#DFB15B]" />
            <span>Create Promo Code</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="bg-white rounded-3xl p-6 border-2 border-dashed border-[#C59B27]/40 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-[#23120B] text-[#DFB15B] font-mono font-bold text-xs rounded-lg tracking-wider">
                    {coupon.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-700">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF`
                      : `${siteSettings.currencySymbol}${coupon.discountValue} OFF`}
                  </span>
                </div>

                <h4 className="font-serif text-base font-bold text-[#23120B] mt-3">
                  {coupon.description}
                </h4>

                <p className="text-xs text-[#3E2723]/70 mt-1">
                  Min. Order: {siteSettings.currencySymbol}{coupon.minOrderAmount}
                  {coupon.maxDiscount &&
                    ` • Max Discount: ${siteSettings.currencySymbol}${coupon.maxDiscount}`}
                </p>
              </div>

              <div className="pt-3 border-t border-[#2D1810]/5 flex items-center justify-between text-xs">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Active
                </span>

                <button
                  onClick={() => handleDeleteCoupon(coupon.id, coupon.code)}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="Delete Coupon"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Promotional Banners Section */}
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs">
          <h3 className="font-serif text-xl font-bold text-[#23120B]">
            Promotional Hero Banners ({offers.length})
          </h3>
          <p className="text-xs text-[#3E2723]/60">
            Control the highlighted celebration deals shown on the homepage and offers page.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-3xl p-6 border border-[#2D1810]/10 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#C59B27] text-white">
                    {offer.badge}
                  </span>
                  <button
                    onClick={() => toggleOfferActive(offer.id)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      offer.active
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {offer.active ? 'Active on Homepage' : 'Hidden'}
                  </button>
                </div>

                <h4 className="font-serif text-lg font-bold text-[#23120B] mt-3">
                  {offer.title}
                </h4>
                <p className="text-xs text-[#3E2723]/70 mt-1">{offer.subtitle}</p>
                {offer.couponCode && (
                  <p className="text-xs text-[#C59B27] font-mono font-bold mt-2">
                    Code: {offer.couponCode}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#2D1810]/15 overflow-hidden animate-in zoom-in-95">
            <div className="p-5 bg-[#23120B] text-white flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold">New Atelier Promo Code</h3>
              <button onClick={() => setIsCouponModalOpen(false)}>
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#23120B] mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. CHOCO20"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl uppercase font-mono tracking-wider focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#23120B] mb-1">Headline Description *</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 20% off on all dessert boxes"
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23120B] mb-1">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ({siteSettings.currencySymbol})</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#23120B] mb-1">Discount Value *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23120B] mb-1">
                    Min Order ({siteSettings.currencySymbol})
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={minOrderAmount}
                    onChange={(e) => setMinOrderAmount(Number(e.target.value))}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>

                {discountType === 'percentage' && (
                  <div>
                    <label className="block font-bold text-[#23120B] mb-1">
                      Max Cap ({siteSettings.currencySymbol})
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={maxDiscount}
                      onChange={(e) => setMaxDiscount(Number(e.target.value))}
                      className="w-full p-2.5 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                    />
                  </div>
                )}
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#23120B] hover:bg-[#C59B27] text-white font-bold rounded-xl"
                >
                  Publish Promo Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
