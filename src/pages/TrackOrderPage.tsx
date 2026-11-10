import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import {
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ChefHat,
  PackageCheck,
  MapPin,
  Printer,
  MessageCircle,
  AlertCircle,
} from 'lucide-react';

interface TrackOrderPageProps {
  navigate: (path: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ navigate }) => {
  const { orders, siteSettings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedOrderNumber, setSearchedOrderNumber] = useState<string>('');
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    if (orderId) {
      setSearchQuery(orderId);
      setSearchedOrderNumber(orderId);
    } else if (orders.length > 0) {
      setSearchQuery(orders[0].orderNumber);
      setSearchedOrderNumber(orders[0].orderNumber);
    }
  }, [orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchedOrderNumber(searchQuery.trim().toUpperCase());
  };

  const currentOrder = orders.find(
    (o) =>
      o.orderNumber.toUpperCase() === searchedOrderNumber.toUpperCase() ||
      o.id === searchedOrderNumber
  );

  const trackingSteps = [
    { key: 'placed', label: 'Order Placed', icon: Clock },
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle2 },
    { key: 'baking', label: 'Baking in Atelier', icon: ChefHat },
    { key: 'ready_for_dispatch', label: 'Packed & Quality Sealed', icon: PackageCheck },
    { key: 'out_for_delivery', label: 'Out for Fresh Delivery', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: MapPin },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending':
        return 0;
      case 'confirmed':
        return 1;
      case 'baking':
        return 2;
      case 'ready_for_dispatch':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      case 'cancelled':
        return -1;
      default:
        return 1;
    }
  };

  const activeStepIdx = currentOrder ? getStepIndex(currentOrder.status) : 0;

  return (
    <div className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B]">
          Track Your Fresh Order
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2723]/70 mt-1">
          Follow your bakes in real-time from oven extraction to your doorstep.
        </p>
      </div>

      {/* Search Order Bar */}
      <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2 mb-10">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
            placeholder="Enter Order ID (e.g. HCT-8921)"
            className="w-full px-4 py-3 text-xs sm:text-sm bg-white border border-[#2D1810]/15 rounded-xl uppercase tracking-wider font-semibold focus:outline-hidden focus:border-[#C59B27] shadow-2xs"
          />
        </div>
        <button
          type="submit"
          className="px-5 py-3 bg-[#23120B] hover:bg-[#C59B27] text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
        >
          <Search className="w-4 h-4" />
          <span>Track</span>
        </button>
      </form>

      {/* Order Status Display */}
      {!currentOrder ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2D1810]/10 shadow-xs">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-serif text-xl font-bold text-[#23120B]">Order Reference Not Found</h3>
          <p className="text-xs text-[#3E2723]/70 mt-1 max-w-xs mx-auto">
            We couldn't locate an order with ID "{searchedOrderNumber}". Please double-check the order ID from your confirmation email or invoice.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#2D1810]/10 shadow-md space-y-8">
          {/* Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2D1810]/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C59B27]">
                Live Atelier Tracking
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#23120B] mt-0.5">
                Order #{currentOrder.orderNumber}
              </h2>
              <p className="text-xs text-[#3E2723]/70">
                Placed on{' '}
                {new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'short',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInvoice(true)}
                className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#EADBC8]/40 border border-[#2D1810]/15 rounded-xl text-xs font-bold text-[#23120B] transition-colors flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Tax Invoice</span>
              </button>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="py-4">
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
              {trackingSteps.map((step, idx) => {
                const Icon = step.icon;
                const isPassed = activeStepIdx >= idx;
                const isCurrent = activeStepIdx === idx;

                return (
                  <div key={step.key} className="flex flex-col items-center text-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isCurrent
                          ? 'bg-[#23120B] text-[#DFB15B] ring-4 ring-[#C59B27]/20 shadow-md'
                          : isPassed
                          ? 'bg-emerald-800 text-white'
                          : 'bg-[#EADBC8]/30 text-[#3E2723]/40'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className={`text-xs mt-2 font-bold ${
                        isCurrent
                          ? 'text-[#23120B]'
                          : isPassed
                          ? 'text-emerald-800'
                          : 'text-[#3E2723]/50'
                      }`}
                    >
                      {step.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] text-[#C59B27] font-semibold animate-pulse">
                        In Progress
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & Destination Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#2D1810]/10 text-xs">
            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#2D1810]/10">
              <h4 className="font-bold text-[#23120B] uppercase tracking-wider mb-2">
                Delivering To:
              </h4>
              <p className="font-semibold text-[#23120B]">{currentOrder.customerName}</p>
              <p className="text-[#3E2723]/80 mt-0.5 leading-relaxed">
                {currentOrder.shippingAddress.addressLine}, {currentOrder.shippingAddress.city},{' '}
                {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
              </p>
              <p className="text-[#3E2723]/70 mt-1">Phone: {currentOrder.customerPhone}</p>
              {currentOrder.specialInstructions && (
                <p className="mt-2 text-[#C59B27] italic">
                  Note: "{currentOrder.specialInstructions}"
                </p>
              )}
            </div>

            <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#2D1810]/10">
              <h4 className="font-bold text-[#23120B] uppercase tracking-wider mb-2">
                Order Package Contents:
              </h4>
              <div className="space-y-2">
                {currentOrder.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-semibold text-[#23120B]">
                        {item.quantity}x {item.productName}
                      </span>
                      <span className="text-[10px] text-[#3E2723]/60 ml-1">
                        ({item.variantName || 'Standard'})
                      </span>
                    </div>
                    <span className="font-bold text-[#23120B]">
                      {siteSettings.currencySymbol}{item.totalPrice}
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-3 border-t border-[#2D1810]/10 flex justify-between font-bold text-sm text-[#23120B]">
                <span>Total Amount</span>
                <span className="text-[#C59B27]">
                  {siteSettings.currencySymbol}{currentOrder.totalAmount}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {showInvoice && currentOrder && (
        <InvoiceModal order={currentOrder} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};
