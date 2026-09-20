import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import {
  CheckCircle2,
  Sparkles,
  Printer,
  ArrowRight,
  MessageCircle,
  Truck,
  ShoppingBag,
} from 'lucide-react';

interface OrderSuccessPageProps {
  navigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ navigate }) => {
  const { orders, siteSettings } = useStore();
  const [showInvoice, setShowInvoice] = useState(false);

  // Extract orderId from URL query or use the latest order in state
  const urlParams = new URLSearchParams(window.location.search);
  const orderIdFromUrl = urlParams.get('orderId');

  const currentOrder =
    orders.find((o) => o.orderNumber === orderIdFromUrl) || orders[0];

  if (!currentOrder) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-[#23120B]">No Recent Order</h2>
        <p className="text-sm text-[#3E2723]/70 mt-2 mb-6">
          You haven't placed an order yet in this session.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-[#23120B] text-white rounded-full text-xs font-semibold"
        >
          Explore Bakery
        </button>
      </div>
    );
  }

  const handleWhatsAppUpdate = () => {
    const message = `Hello ${siteSettings.brandName}! 🍰\nI just placed order #${currentOrder.orderNumber} for ${currentOrder.customerName}.\nPlease share live baking and dispatch status updates. Thank you!`;
    const encoded = encodeURIComponent(message);
    const phone = siteSettings.whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  return (
    <div className="py-12 sm:py-16 max-w-3xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#2D1810]/10 shadow-xl text-center space-y-6">
        {/* Celebration icon */}
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <Sparkles className="w-6 h-6 text-[#C59B27] absolute -top-1 -right-1 animate-pulse" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            Order Confirmed &amp; Queued For Baking
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B] mt-1">
            Thank You, {currentOrder.customerName}!
          </h1>
          <p className="text-xs sm:text-sm text-[#3E2723]/80 mt-2 max-w-md mx-auto">
            Your delicacies are being prepared by our master pâtissiers using fresh Belgian couverture.
          </p>
        </div>

        {/* Order Meta Card */}
        <div className="bg-[#FAF7F2] rounded-2xl p-5 border border-[#2D1810]/10 text-left grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-[#3E2723]/60 font-semibold block">Order Reference:</span>
            <span className="text-sm font-bold text-[#23120B]">#{currentOrder.orderNumber}</span>
          </div>
          <div>
            <span className="text-[#3E2723]/60 font-semibold block">Estimated Delivery:</span>
            <span className="text-sm font-bold text-[#23120B]">
              {currentOrder.deliveryType === 'express' ? 'Today within 2 Hours' : 'Today by 7:30 PM'}
            </span>
          </div>
          <div>
            <span className="text-[#3E2723]/60 font-semibold block">Amount Paid:</span>
            <span className="text-sm font-bold text-[#C59B27]">
              {siteSettings.currencySymbol}{currentOrder.totalAmount}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(`/track-order?orderId=${currentOrder.orderNumber}`)}
            className="w-full sm:w-auto px-6 py-3 bg-[#23120B] hover:bg-[#C59B27] text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-[#DFB15B]" />
            <span>Track Live Order Status</span>
          </button>

          <button
            onClick={() => setShowInvoice(true)}
            className="w-full sm:w-auto px-6 py-3 bg-white border border-[#2D1810]/15 hover:bg-[#FAF7F2] text-[#23120B] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#C59B27]" />
            <span>View &amp; Print Tax Invoice</span>
          </button>

          <button
            onClick={handleWhatsAppUpdate}
            className="w-full sm:w-auto px-6 py-3 bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#1E7E34] border border-[#25D366]/30 text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
            <span>WhatsApp Status</span>
          </button>
        </div>

        <div className="pt-4 border-t border-[#2D1810]/10">
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-semibold text-[#C59B27] hover:underline inline-flex items-center gap-1"
          >
            <span>Continue Shopping Delicacies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Printable Invoice Modal */}
      {showInvoice && (
        <InvoiceModal order={currentOrder} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};
