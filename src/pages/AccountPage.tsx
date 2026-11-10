import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { InvoiceModal } from '../components/common/InvoiceModal';
import { Order } from '../types';
import {
  User,
  ShoppingBag,
  Clock,
  Printer,
  Truck,
  ArrowRight,
  Package,
} from 'lucide-react';

interface AccountPageProps {
  navigate: (path: string) => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({ navigate }) => {
  const { orders, siteSettings, addToCart } = useStore();
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const statusBadge = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'out_for_delivery':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'preparing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#2D1810]/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#23120B] text-[#DFB15B] flex items-center justify-center font-serif text-xl font-bold">
            HCT
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#23120B]">Patron Member</h1>
            <p className="text-xs text-[#3E2723]/70 mt-0.5">
              {siteSettings.brandName} Connoisseur • Premium Tier
            </p>
          </div>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-[#23120B] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#C59B27]" />
            <span>Order History ({orders.length})</span>
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-bold text-[#C59B27] hover:underline"
          >
            Order More Delicacies &rarr;
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-[#2D1810]/10">
            <ShoppingBag className="w-12 h-12 text-[#C59B27] mx-auto mb-3 opacity-60" />
            <h3 className="font-serif text-xl font-bold text-[#23120B]">No orders placed yet</h3>
            <p className="text-xs text-[#3E2723]/70 mt-1 max-w-xs mx-auto mb-6">
              When you order brownies, cookies, or cakes, your order receipts and live status will appear here.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="px-6 py-2.5 bg-[#23120B] text-white rounded-full text-xs font-semibold"
            >
              Start Tasting
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl p-5 border border-[#2D1810]/10 shadow-xs hover:border-[#C59B27]/40 transition-all space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2D1810]/5 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-[#23120B]">
                      Order #{order.orderNumber}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-[#3E2723]/60">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                {/* Items preview */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                  <div className="sm:col-span-8 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=150&q=80'}
                          alt={item.productName}
                          className="w-10 h-10 object-cover rounded-lg bg-[#FAF7F2]"
                        />
                        <div>
                          <p className="font-bold text-[#23120B]">
                            {item.quantity}x {item.productName}
                          </p>
                          <p className="text-[11px] text-[#3E2723]/60">
                            {item.variantName || 'Standard'}{' '}
                            {item.selectedFlavour ? `• ${item.selectedFlavour}` : ''}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sm:col-span-4 flex flex-col sm:items-end justify-between gap-3 text-right">
                    <div>
                      <span className="text-[11px] text-[#3E2723]/60 block">Total Amount</span>
                      <span className="text-base font-bold text-[#C59B27]">
                        {siteSettings.currencySymbol}{order.totalAmount}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/track-order?orderId=${order.orderNumber}`)}
                        className="px-3 py-1.5 bg-[#23120B] hover:bg-[#C59B27] text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Track</span>
                      </button>

                      <button
                        onClick={() => setSelectedInvoiceOrder(order)}
                        className="px-3 py-1.5 bg-white border border-[#2D1810]/15 hover:bg-[#FAF7F2] text-[#23120B] rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#C59B27]" />
                        <span>Invoice</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
