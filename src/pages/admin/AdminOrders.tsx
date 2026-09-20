import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { InvoiceModal } from '../../components/common/InvoiceModal';
import {
  Search,
  Printer,
  X,
  Eye,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  ShoppingBag,
  PlusCircle,
} from 'lucide-react';

interface AdminOrdersProps {
  initialOrder?: Order | null;
}

// Safe date formatter supporting ISO strings, epoch numbers, or Firestore Timestamps
function formatSafeDate(val: any, detailed: boolean = false): string {
  if (!val) return 'Recently';
  try {
    let date: Date;
    if (typeof val?.toDate === 'function') {
      date = val.toDate();
    } else if (typeof val?.seconds === 'number') {
      date = new Date(val.seconds * 1000);
    } else if (typeof val === 'number') {
      date = new Date(val);
    } else {
      date = new Date(String(val));
    }

    if (isNaN(date.getTime())) return 'Recently';

    if (detailed) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ initialOrder }) => {
  const { orders = [], siteSettings, updateOrderStatus, updatePaymentStatus, createOrder } = useStore();

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(initialOrder || null);
  const [showInvoiceModal, setShowInvoiceModal] = useState<Order | null>(null);

  const safeOrders: Order[] = Array.isArray(orders) ? orders.filter(Boolean) : [];

  const filterTabs = [
    { id: 'all', label: 'All Orders' },
    { id: 'pending', label: 'Pending' },
    { id: 'confirmed', label: 'Confirmed' },
    { id: 'preparing', label: 'In Kitchen' },
    { id: 'ready', label: 'Packed & Ready' },
    { id: 'out_for_delivery', label: 'Out for Delivery' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const filteredOrders = safeOrders.filter((o) => {
    if (!o) return false;

    const normalizedStatus =
      o.status === 'preparing' || (o.status as any) === 'baking'
        ? 'preparing'
        : o.status === 'ready' || (o.status as any) === 'ready_for_dispatch'
        ? 'ready'
        : o.status;

    const isStatusMatch =
      statusFilter === 'all' ||
      o.status === statusFilter ||
      normalizedStatus === statusFilter;

    const q = searchQuery.toLowerCase().trim();
    const customerName = String(o.customer?.fullName || (o as any).customerName || '').toLowerCase();
    const customerPhone = String(o.customer?.phone || (o as any).customerPhone || '');
    const orderNum = String(o.orderNumber || o.id || '').toLowerCase();

    const matchesQuery =
      !q ||
      orderNum.includes(q) ||
      customerName.includes(q) ||
      customerPhone.includes(q);

    return isStatusMatch && matchesQuery;
  });

  // Quick action to seed a sample order if empty
  const handleGenerateSampleOrder = () => {
    const sampleOrder = createOrder({
      customer: {
        fullName: 'Tara D’Souza',
        email: 'tara.dsouza@example.com',
        phone: '+91 98200 44556',
      },
      address: {
        fullName: 'Tara D’Souza',
        phone: '+91 98200 44556',
        email: 'tara.dsouza@example.com',
        houseFlat: 'Apt 402, Sea Crest Towers',
        street: 'Carter Road, Bandra West',
        area: 'Bandra',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050',
      },
      deliveryOption: {
        id: 'del-express',
        name: 'Express Delivery (2 Hours)',
        price: 120,
        estimatedDelivery: 'Today within 2 hours',
      },
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
    });
    if (sampleOrder) {
      setSelectedOrder(sampleOrder);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Tabs */}
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#3E2723]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order #, Customer, Phone..."
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
            />
          </div>

          <div className="flex items-center gap-3 text-xs text-[#3E2723]/70 self-end sm:self-auto">
            <span>
              Showing <strong>{filteredOrders.length}</strong> of {safeOrders.length} orders
            </span>
            <button
              onClick={handleGenerateSampleOrder}
              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#EADBC8]/40 border border-[#2D1810]/15 rounded-xl text-[11px] font-semibold text-[#23120B] transition-colors flex items-center gap-1.5"
              title="Create a sample order for testing"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>New Sample Order</span>
            </button>
          </div>
        </div>

        {/* Status Pills */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#2D1810]/10">
          {filterTabs.map((tab) => {
            const count =
              tab.id === 'all'
                ? safeOrders.length
                : safeOrders.filter((o) => {
                    if (!o) return false;
                    const norm =
                      o.status === 'preparing' || (o.status as any) === 'baking'
                        ? 'preparing'
                        : o.status === 'ready' || (o.status as any) === 'ready_for_dispatch'
                        ? 'ready'
                        : o.status;
                    return o.status === tab.id || norm === tab.id;
                  }).length;

            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all ${
                  statusFilter === tab.id
                    ? 'bg-[#23120B] text-white shadow-xs'
                    : 'bg-[#FAF7F2] text-[#2D1810] hover:bg-[#EADBC8]/50'
                }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-[#2D1810]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#3E2723]/70 uppercase text-[10px] tracking-wider border-b border-[#2D1810]/10">
                <th className="p-4">Order Reference</th>
                <th className="p-4">Customer &amp; Destination</th>
                <th className="p-4">Items Summary</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Order Status</th>
                <th className="p-4">Payment</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D1810]/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-xs text-[#3E2723]/60">
                    <ShoppingBag className="w-8 h-8 text-[#C59B27]/40 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-[#23120B]">No orders found</p>
                    <p className="text-[11px] text-[#3E2723]/60 mt-1">
                      {searchQuery
                        ? 'Try modifying your search or filter criteria.'
                        : 'No orders placed yet in this view.'}
                    </p>
                    <button
                      onClick={handleGenerateSampleOrder}
                      className="mt-3 px-4 py-2 bg-[#23120B] hover:bg-[#C59B27] text-white rounded-xl text-xs font-semibold transition-colors inline-flex items-center gap-1.5"
                    >
                      <PlusCircle className="w-4 h-4 text-[#DFB15B]" />
                      <span>Generate Sample Order</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderItems = Array.isArray(order.items) ? order.items : [];
                  const rawStatus = (order.status as any) || 'pending';
                  const mappedStatus =
                    rawStatus === 'baking'
                      ? 'preparing'
                      : rawStatus === 'ready_for_dispatch'
                      ? 'ready'
                      : rawStatus;

                  const customerName = order.customer?.fullName || (order as any).customerName || 'Patron';
                  const customerPhone = order.customer?.phone || (order as any).customerPhone || '';
                  const city = order.address?.city || (order as any).shippingAddress?.city || 'Local Delivery';

                  const orderTotal = Number(order.total ?? (order as any).totalAmount ?? 0);

                  return (
                    <tr key={order.id || Math.random()} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-sm text-[#23120B]">
                          #{order.orderNumber || order.id}
                        </p>
                        <p className="text-[10px] text-[#3E2723]/60 mt-0.5">
                          {formatSafeDate(order.createdAt)}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-[#23120B]">{customerName}</p>
                        {customerPhone && (
                          <p className="text-[11px] text-[#3E2723]/70">{customerPhone}</p>
                        )}
                        <p className="text-[10px] text-[#3E2723]/50 truncate max-w-xs">
                          {order.address
                            ? `${order.address.houseFlat ? order.address.houseFlat + ', ' : ''}${order.address.city || ''}`
                            : (order as any).shippingAddress?.addressLine || city}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-[#23120B]">
                          {orderItems.length} item{orderItems.length !== 1 ? 's' : ''}
                        </p>
                        <p className="text-[10px] text-[#3E2723]/60 truncate max-w-[180px]">
                          {orderItems
                            .map((i) => `${i.quantity || 1}x ${i.productName || (i as any).name || 'Item'}`)
                            .join(', ') || 'Item'}
                        </p>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-sm text-[#C59B27]">
                          {siteSettings.currencySymbol}{orderTotal}
                        </span>
                        <span className="block text-[10px] text-[#3E2723]/50 uppercase">
                          {order.paymentMethod || 'Online'}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={mappedStatus}
                          onChange={(e) =>
                            updateOrderStatus(order.id, e.target.value as OrderStatus)
                          }
                          className="bg-[#FAF7F2] border border-[#2D1810]/15 rounded-lg text-xs font-semibold px-2 py-1.5 focus:outline-hidden focus:border-[#C59B27] cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">In Kitchen (Preparing)</option>
                          <option value="ready">Packed &amp; Sealed</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>

                      <td className="p-4">
                        <select
                          value={order.paymentStatus || 'pending'}
                          onChange={(e) =>
                            updatePaymentStatus(
                              order.id,
                              e.target.value as PaymentStatus
                            )
                          }
                          className={`border rounded-lg text-xs font-semibold px-2 py-1.5 focus:outline-hidden cursor-pointer ${
                            order.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="failed">Failed</option>
                          <option value="refunded">Refunded</option>
                        </select>
                      </td>

                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 text-[#23120B] hover:bg-[#FAF7F2] rounded-lg transition-colors inline-block"
                          title="View Full Details"
                        >
                          <Eye className="w-4 h-4 text-[#C59B27]" />
                        </button>
                        <button
                          onClick={() => setShowInvoiceModal(order)}
                          className="p-1.5 text-[#23120B] hover:bg-[#FAF7F2] rounded-lg transition-colors inline-block"
                          title="Print Invoice"
                        >
                          <Printer className="w-4 h-4 text-[#23120B]" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Drawer */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#2D1810]/10">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#23120B]">
                  Order #{selectedOrder.orderNumber || selectedOrder.id}
                </h3>
                <p className="text-xs text-[#3E2723]/60">
                  {formatSafeDate(selectedOrder.createdAt, true)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-[#2D1810] hover:bg-[#FAF7F2] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Details */}
            <div className="py-6 space-y-6 flex-1 text-xs">
              {/* Customer & Address */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#2D1810]/10 space-y-2">
                <h4 className="font-bold uppercase tracking-wider text-[#C59B27]">
                  Delivery Address &amp; Patron
                </h4>
                <p className="font-bold text-sm text-[#23120B]">
                  {selectedOrder.customer?.fullName || (selectedOrder as any).customerName || 'Customer'}
                </p>
                <p className="text-[#3E2723]/80 leading-relaxed">
                  {selectedOrder.address
                    ? `${selectedOrder.address.houseFlat ? selectedOrder.address.houseFlat + ', ' : ''}${selectedOrder.address.street || ''}${selectedOrder.address.area ? ', ' + selectedOrder.address.area : ''}`
                    : (selectedOrder as any).shippingAddress?.addressLine || 'Boutique Collection'}
                  <br />
                  {selectedOrder.address
                    ? `${selectedOrder.address.city || ''}, ${selectedOrder.address.state || ''} - ${selectedOrder.address.pincode || ''}`
                    : (selectedOrder as any).shippingAddress
                    ? `${(selectedOrder as any).shippingAddress.city || ''}, ${(selectedOrder as any).shippingAddress.state || ''} - ${(selectedOrder as any).shippingAddress.pincode || ''}`
                    : ''}
                </p>
                <p>Phone: {selectedOrder.customer?.phone || (selectedOrder as any).customerPhone || 'N/A'}</p>
                {(selectedOrder.customer?.email || (selectedOrder as any).customerEmail) && (
                  <p>Email: {selectedOrder.customer?.email || (selectedOrder as any).customerEmail}</p>
                )}
                {(selectedOrder.notes || (selectedOrder as any).specialInstructions) && (
                  <p className="mt-2 text-[#C59B27] italic">
                    Special Notes: "{selectedOrder.notes || (selectedOrder as any).specialInstructions}"
                  </p>
                )}
              </div>

              {/* Items Table */}
              <div>
                <h4 className="font-bold uppercase tracking-wider text-[#3E2723]/60 mb-2">
                  Items Ordered ({(selectedOrder.items || []).length})
                </h4>
                <div className="divide-y divide-[#2D1810]/10 border border-[#2D1810]/10 rounded-2xl overflow-hidden">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image || item.thumbnail || 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=150&q=80'}
                          alt={item.productName || 'Item'}
                          className="w-10 h-10 object-cover rounded-lg bg-[#FAF7F2]"
                        />
                        <div>
                          <p className="font-bold text-[#23120B]">{item.productName || (item as any).name || 'Product'}</p>
                          <p className="text-[11px] text-[#3E2723]/70">
                            {item.variantName ? `Size: ${item.variantName}` : ''}{' '}
                            {(item.flavour || (item as any).selectedFlavour) ? `• Flavour: ${item.flavour || (item as any).selectedFlavour}` : ''}
                          </p>
                          {((item.addons && item.addons.length > 0) || ((item as any).selectedAddons && (item as any).selectedAddons.length > 0)) && (
                            <p className="text-[10px] text-[#C59B27]">
                              + {(item.addons || (item as any).selectedAddons).join(', ')}
                            </p>
                          )}
                          {item.customMessage && (
                            <p className="text-[10px] italic text-gray-500">
                              Gift message: "{item.customMessage}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#23120B]">
                          {siteSettings.currencySymbol}{item.totalPrice ?? (item.unitPrice ? item.unitPrice * (item.quantity || 1) : 0)}
                        </span>
                        <span className="block text-[10px] text-[#3E2723]/60">
                          Qty: {item.quantity || 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#2D1810]/10 space-y-1.5">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{siteSettings.currencySymbol}{selectedOrder.subtotal ?? (selectedOrder.total ?? (selectedOrder as any).totalAmount ?? 0)}</span>
                </div>
                {(selectedOrder.discount ?? 0) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount</span>
                    <span>-{siteSettings.currencySymbol}{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span>{siteSettings.currencySymbol}{selectedOrder.deliveryFee ?? (selectedOrder.deliveryOption?.price ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST Tax</span>
                  <span>{siteSettings.currencySymbol}{selectedOrder.tax ?? 0}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[#23120B] pt-2 border-t border-[#2D1810]/10">
                  <span>Total Amount</span>
                  <span className="text-[#C59B27]">
                    {siteSettings.currencySymbol}{selectedOrder.total ?? (selectedOrder as any).totalAmount ?? 0}
                  </span>
                </div>
              </div>
            </div>

            {/* Drawer footer actions */}
            <div className="pt-4 border-t border-[#2D1810]/10 flex gap-2">
              <button
                onClick={() => setShowInvoiceModal(selectedOrder)}
                className="flex-1 py-3 bg-[#23120B] hover:bg-[#C59B27] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-[#DFB15B]" />
                <span>Print Tax Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal
          order={showInvoiceModal}
          onClose={() => setShowInvoiceModal(null)}
        />
      )}
    </div>
  );
};
