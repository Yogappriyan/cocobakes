import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { processRazorpayPayment } from '../lib/razorpay';
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  Truck,
  ArrowRight,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { Order } from '../types';

interface CheckoutPageProps {
  navigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ navigate }) => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    cartDeliveryFee,
    cartTax,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    siteSettings,
    createOrder,
    clearCart,
    showToast,
  } = useStore();

  // Form states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Bangalore');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560001');

  // Delivery slot
  const [deliveryType, setDeliveryType] = useState<'standard' | 'express'>('standard');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Delivery fee calculation based on type
  const actualDeliveryFee =
    deliveryType === 'express'
      ? cartDeliveryFee + siteSettings.expressDeliveryFee
      : cartDeliveryFee;
  const finalGrandTotal = cartSubtotal - cartDiscount + actualDeliveryFee + cartTax;

  if (cart.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-full bg-[#EADBC8]/40 flex items-center justify-center mx-auto text-2xl mb-4">
          🛍️
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#23120B]">Your bag is empty</h2>
        <p className="text-sm text-[#3E2723]/70 mt-2 mb-6">
          Add some decadent brownies or desserts before proceeding to checkout.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-[#23120B] text-white rounded-full text-xs font-semibold"
        >
          Return to Atelier
        </button>
      </div>
    );
  }

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !phone.trim() || !addressLine.trim() || !pincode.trim()) {
      showToast('Missing Details', 'Please complete the required customer and address fields', 'warning');
      return;
    }

    setIsProcessing(true);

    const orderId = `VC-${Math.floor(1000 + Math.random() * 9000)}`;

    const orderPayload = {
      customer: {
        fullName: fullName.trim(),
        phone: phone.trim(),
        email: email.trim(),
      },
      address: {
        id: `addr-${Date.now()}`,
        fullName: fullName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        isDefault: true,
      },
      deliveryOption: {
        id: deliveryType,
        name: deliveryType === 'express' ? 'Express 2-Hour Delivery' : 'Standard Same-Day Delivery',
        price: deliveryType === 'express' ? siteSettings.expressDeliveryFee : siteSettings.defaultDeliveryFee,
        estimatedDelivery: deliveryType === 'express' ? 'Within 2 Hours' : 'Today by 8 PM',
      },
      paymentMethod: paymentMethod === 'razorpay' ? ('razorpay' as const) : ('cod' as const),
    };

    if (paymentMethod === 'razorpay') {
      try {
        const paymentResult = await processRazorpayPayment({
          orderId,
          amount: finalGrandTotal,
          currency: siteSettings.currencyCode,
          customer: {
            fullName,
            email,
            phone,
          },
          keyId: siteSettings.razorpayKeyId,
        });

        if (paymentResult.success) {
          const created = createOrder({
            ...orderPayload,
            paymentStatus: 'paid',
            paymentId: paymentResult.paymentId,
          });

          clearCart();
          setIsProcessing(false);
          showToast('Order Confirmed 🎉', `Your order #${created.orderNumber} has been placed!`);
          navigate(`/order-success?orderId=${created.orderNumber}`);
        } else {
          setIsProcessing(false);
          showToast('Payment Failed', paymentResult.error || 'Payment was not completed', 'error');
        }
      } catch (err: any) {
        setIsProcessing(false);
        showToast('Payment Error', err.message || 'Unable to start payment gateway', 'error');
      }
    } else {
      // Cash on Delivery
      setTimeout(() => {
        const created = createOrder({
          ...orderPayload,
          paymentStatus: 'pending',
        });

        clearCart();
        setIsProcessing(false);
        showToast('Order Confirmed 🎉', `Your order #${created.orderNumber} has been placed!`);
        navigate(`/order-success?orderId=${created.orderNumber}`);
      }, 700);
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B]">
          Artisanal Checkout
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2723]/70 mt-1">
          Complete your delivery details for freshly baked temperature-controlled dispatch.
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Patron Information */}
          <div className="bg-white rounded-2xl p-6 border border-[#2D1810]/10 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#23120B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#23120B] text-[#DFB15B] text-xs flex items-center justify-center">
                1
              </span>
              <span>Patron Information</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#23120B] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Meera Kapoor"
                  className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23120B] mb-1">
                  Phone Number * (for Delivery Updates)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23120B] mb-1">
                  Email Address (for Invoice)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. meera@gmail.com"
                  className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>
            </div>
          </div>

          {/* 2. Destination Address */}
          <div className="bg-white rounded-2xl p-6 border border-[#2D1810]/10 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#23120B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#23120B] text-[#DFB15B] text-xs flex items-center justify-center">
                2
              </span>
              <span>Delivery Address</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#23120B] mb-1">
                  Apartment, House No., Street, Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  placeholder="e.g. Flat 402, Oakwood Manor, 12th Main Road, Indiranagar"
                  className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#23120B] mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23120B] mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#23120B] mb-1">Pincode *</label>
                  <input
                    type="text"
                    required
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#23120B] mb-1">
                  Delivery Instructions (Optional)
                </label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={(e) => setDeliveryNotes(e.target.value)}
                  placeholder="e.g. Ring doorbell, leave with concierge, or call on arrival"
                  className="w-full p-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
                />
              </div>
            </div>
          </div>

          {/* 3. Delivery Speed Selection */}
          <div className="bg-white rounded-2xl p-6 border border-[#2D1810]/10 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#23120B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#23120B] text-[#DFB15B] text-xs flex items-center justify-center">
                3
              </span>
              <span>Delivery Slot</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                onClick={() => setDeliveryType('standard')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryType === 'standard'
                    ? 'border-[#23120B] bg-[#EADBC8]/20 shadow-xs'
                    : 'border-[#2D1810]/15 hover:border-[#C59B27]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C59B27]" />
                    <span className="font-bold text-xs text-[#23120B]">Standard Fresh Delivery</span>
                  </div>
                  <span className="text-xs font-semibold">
                    {cartDeliveryFee === 0 ? 'FREE' : `${siteSettings.currencySymbol}${cartDeliveryFee}`}
                  </span>
                </div>
                <p className="text-[11px] text-[#3E2723]/70 mt-1">
                  Delivered fresh today between 4 PM - 8 PM in insulated bakery carrier.
                </p>
              </div>

              <div
                onClick={() => setDeliveryType('express')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  deliveryType === 'express'
                    ? 'border-[#23120B] bg-[#EADBC8]/20 shadow-xs'
                    : 'border-[#2D1810]/15 hover:border-[#C59B27]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#C59B27]" />
                    <span className="font-bold text-xs text-[#23120B]">Priority 2-Hour Express</span>
                  </div>
                  <span className="text-xs font-semibold text-[#C59B27]">
                    +{siteSettings.currencySymbol}{siteSettings.expressDeliveryFee}
                  </span>
                </div>
                <p className="text-[11px] text-[#3E2723]/70 mt-1">
                  Immediate dispatch from the atelier via temperature-controlled courier.
                </p>
              </div>
            </div>
          </div>

          {/* 4. Payment Method */}
          <div className="bg-white rounded-2xl p-6 border border-[#2D1810]/10 shadow-xs space-y-4">
            <h2 className="font-serif text-lg font-bold text-[#23120B] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#23120B] text-[#DFB15B] text-xs flex items-center justify-center">
                4
              </span>
              <span>Payment Preference</span>
            </h2>

            <div className="space-y-3">
              <label
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#C59B27] bg-[#EADBC8]/20'
                    : 'border-[#2D1810]/15'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="mt-0.5 accent-[#C59B27]"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#23120B] flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#C59B27]" />
                      <span>Razorpay Online (UPI / Cards / NetBanking)</span>
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm font-semibold">
                      Instant &amp; Contactless
                    </span>
                  </div>
                  <p className="text-[11px] text-[#3E2723]/70 mt-1">
                    Pay securely using Google Pay, PhonePe, Paytm, all Credit/Debit cards or NetBanking.
                  </p>
                </div>
              </label>

              {siteSettings.codAvailable && (
                <label
                  className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#C59B27] bg-[#EADBC8]/20'
                      : 'border-[#2D1810]/15'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-0.5 accent-[#C59B27]"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#23120B] flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-[#C59B27]" />
                        <span>Pay on Delivery (Cash / Handover UPI)</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-[#3E2723]/70 mt-1">
                      Pay via cash or UPI scan when your confectionery box reaches your doorstep.
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="bg-[#FAF7F2] rounded-3xl p-6 border border-[#2D1810]/10 shadow-sm space-y-4">
            <h2 className="font-serif text-xl font-bold text-[#23120B] pb-3 border-b border-[#2D1810]/10">
              Order Summary ({cart.length} item{cart.length > 1 ? 's' : ''})
            </h2>

            {/* Items review */}
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex gap-3 text-xs py-1 border-b border-[#2D1810]/5">
                  <img
                    src={item.product.thumbnail || item.product.images[0]}
                    alt={item.product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between font-semibold text-[#23120B]">
                      <span className="truncate">{item.product.name}</span>
                      <span>{siteSettings.currencySymbol}{item.totalPrice}</span>
                    </div>
                    <p className="text-[11px] text-[#3E2723]/70">
                      Qty: {item.quantity} {item.variant ? `• ${item.variant.name}` : ''}
                      {item.selectedFlavour ? ` • ${item.selectedFlavour}` : ''}
                    </p>
                    {item.selectedAddons && item.selectedAddons.length > 0 && (
                      <p className="text-[10px] text-[#C59B27]">
                        + {item.selectedAddons.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon field */}
            <div className="pt-2">
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2 text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.code} applied (-{siteSettings.currencySymbol}{cartDiscount})</span>
                  </div>
                  <button onClick={removeCoupon} className="font-bold hover:text-rose-600">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Promo Code (e.g. WELCOME10)"
                    className="flex-1 px-3 py-2 text-xs bg-white border border-[#2D1810]/15 rounded-xl uppercase tracking-wider focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-[#23120B] text-white text-xs font-semibold rounded-xl hover:bg-[#C59B27] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}
              {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 text-xs text-[#3E2723]/80 pt-3 border-t border-[#2D1810]/10">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-[#23120B]">
                  {siteSettings.currencySymbol}{cartSubtotal}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Coupon Discount</span>
                  <span>-{siteSettings.currencySymbol}{cartDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {actualDeliveryFee === 0 ? (
                    <span className="text-emerald-700 font-semibold uppercase">Free</span>
                  ) : (
                    `${siteSettings.currencySymbol}${actualDeliveryFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>{siteSettings.currencySymbol}{cartTax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#23120B] pt-2 border-t border-[#2D1810]/10">
                <span>Grand Total</span>
                <span className="text-xl text-[#C59B27]">
                  {siteSettings.currencySymbol}{finalGrandTotal}
                </span>
              </div>
            </div>

            {/* Submit Place Order Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2] font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Securing Reservation...</span>
                </div>
              ) : (
                <>
                  <span>
                    Confirm &amp; Place Order • {siteSettings.currencySymbol}{finalGrandTotal}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Security Assurance */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#3E2723]/60 pt-2">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>256-Bit Encrypted &amp; Safe Payment Processing</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
