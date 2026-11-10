import React from 'react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Printer, Download, CheckCircle2 } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const { siteSettings } = useStore();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-[#2D1810]/15 overflow-hidden my-8 animate-in zoom-in-95">
        {/* Modal Toolbar (hidden on print) */}
        <div className="p-4 bg-[#23120B] text-[#FAF7F2] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>Tax Invoice #{order.orderNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#C59B27] hover:bg-[#DFB15B] text-[#23120B] rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-white/70 hover:text-white rounded-lg"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Body */}
        <div id="printable-invoice" className="p-8 sm:p-10 space-y-6 text-[#23120B]">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-[#2D1810]/10 pb-6">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#23120B]">
                {siteSettings.brandName}
              </h2>
              <p className="text-[11px] text-[#3E2723]/70 uppercase tracking-widest font-semibold">
                {siteSettings.tagline}
              </p>
              <p className="text-xs text-[#3E2723]/80 mt-2 max-w-xs leading-relaxed">
                {siteSettings.address}
                <br />
                Concierge: {siteSettings.contactNumber}
                <br />
                Email: {siteSettings.email}
              </p>
            </div>

            <div className="text-right">
              <span className="px-3 py-1 bg-[#EADBC8]/40 text-[#23120B] rounded-full text-xs font-bold uppercase tracking-wider">
                Original Tax Invoice
              </span>
              <div className="mt-3 text-xs space-y-0.5">
                <p>
                  <strong>Invoice No:</strong> INV-{order.orderNumber}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p>
                  <strong>Payment Status:</strong>{' '}
                  <span className="uppercase text-emerald-700 font-bold">
                    {order.paymentStatus}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Billed To / Shipped To */}
          <div className="grid grid-cols-2 gap-6 text-xs border-b border-[#2D1810]/10 pb-6">
            <div>
              <p className="font-bold uppercase tracking-wider text-[#3E2723]/60 mb-1">
                Billed / Shipped To:
              </p>
              <p className="font-bold text-sm text-[#23120B]">
                {order.customer?.fullName || (order as any).customerName || 'Customer'}
              </p>
              <p className="text-[#3E2723]/80 mt-1 leading-relaxed">
                {order.address
                  ? `${order.address.houseFlat ? order.address.houseFlat + ', ' : ''}${order.address.street || ''}${order.address.area ? ', ' + order.address.area : ''}`
                  : (order as any).shippingAddress?.addressLine || 'Boutique Collection'}
                <br />
                {order.address
                  ? `${order.address.city}, ${order.address.state} - ${order.address.pincode}`
                  : (order as any).shippingAddress
                  ? `${(order as any).shippingAddress.city}, ${(order as any).shippingAddress.state} - ${(order as any).shippingAddress.pincode}`
                  : ''}
                <br />
                Phone: {order.customer?.phone || (order as any).customerPhone || 'N/A'}
                {(order.customer?.email || (order as any).customerEmail) && (
                  <>
                    <br />
                    Email: {order.customer?.email || (order as any).customerEmail}
                  </>
                )}
              </p>
            </div>

            <div className="text-right">
              <p className="font-bold uppercase tracking-wider text-[#3E2723]/60 mb-1">
                Fulfillment Type:
              </p>
              <p className="font-semibold capitalize text-[#23120B]">
                {order.deliveryOption?.name || ((order as any).deliveryType === 'express' ? 'Priority 2-Hour Express' : 'Standard Fresh Delivery')}
              </p>
              <p className="text-[#3E2723]/80 mt-1">
                Payment Method:{' '}
                <span className="uppercase font-semibold">
                  {(order.paymentMethod as string) === 'online' || order.paymentMethod === 'razorpay' ? 'Razorpay (Prepaid)' : 'Cash on Delivery'}
                </span>
              </p>
              {(order.notes || (order as any).specialInstructions) && (
                <p className="mt-2 text-[11px] italic bg-[#FAF7F2] p-2 rounded-lg border border-[#2D1810]/10">
                  Note: "{order.notes || (order as any).specialInstructions}"
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-[#2D1810]/20 text-[#3E2723]/70 uppercase tracking-wider text-[10px]">
                  <th className="py-2 font-bold">Item Description</th>
                  <th className="py-2 text-center font-bold">Qty</th>
                  <th className="py-2 text-right font-bold">Rate</th>
                  <th className="py-2 text-right font-bold">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1810]/5">
                {(order.items || []).map((item, i) => (
                  <tr key={i}>
                    <td className="py-2.5 pr-2">
                      <p className="font-bold text-[#23120B]">{item.productName}</p>
                      <p className="text-[11px] text-[#3E2723]/70">
                        {item.variantName ? `Size: ${item.variantName}` : ''}
                        {(item.flavour || (item as any).selectedFlavour) ? ` • Flavour: ${item.flavour || (item as any).selectedFlavour}` : ''}
                      </p>
                      {((item.addons && item.addons.length > 0) || ((item as any).selectedAddons && (item as any).selectedAddons.length > 0)) && (
                        <p className="text-[10px] text-[#C59B27]">
                          + {(item.addons || (item as any).selectedAddons).join(', ')}
                        </p>
                      )}
                      {item.customMessage && (
                        <p className="text-[10px] italic text-gray-500">
                          Card: "{item.customMessage}"
                        </p>
                      )}
                    </td>
                    <td className="py-2.5 text-center font-semibold">{item.quantity}</td>
                    <td className="py-2.5 text-right font-medium">
                      {siteSettings.currencySymbol}{item.unitPrice}
                    </td>
                    <td className="py-2.5 text-right font-bold text-[#23120B]">
                      {siteSettings.currencySymbol}{item.totalPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Breakdown */}
          <div className="border-t border-[#2D1810]/15 pt-4 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-[#3E2723]/80">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{siteSettings.currencySymbol}{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Coupon Discount ({order.couponCode})</span>
                  <span>-{siteSettings.currencySymbol}{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charge</span>
                <span>
                  {order.deliveryFee === 0 ? 'FREE' : `${siteSettings.currencySymbol}${order.deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>GST Tax (5%)</span>
                <span>{siteSettings.currencySymbol}{order.tax}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#23120B] pt-2 border-t border-[#2D1810]/20">
                <span>Total Paid</span>
                <span className="text-[#C59B27]">
                  {siteSettings.currencySymbol}{order.total ?? (order as any).totalAmount ?? 0}
                </span>
              </div>
            </div>
          </div>

          {/* Legal / Thank you note */}
          <div className="pt-6 border-t border-[#2D1810]/10 text-center text-[11px] text-[#3E2723]/70 space-y-1">
            <p className="font-serif italic text-sm text-[#23120B]">
              Thank you for celebrating with {siteSettings.brandName}!
            </p>
            <p>
              This is a computer-generated tax invoice and requires no physical signature.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
