import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Users, Phone, Mail, MapPin, ShoppingBag, Award } from 'lucide-react';

function formatCustomerDate(val: any): string {
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

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Recently';
  }
}

export const AdminCustomers: React.FC = () => {
  const { orders = [], customers: storeCustomers = [], siteSettings } = useStore();
  const [searchQuery, setSearchQuery] = useState('');

  // Merge registered customers with customer data aggregated from orders
  const customerMap = new Map<
    string,
    {
      id: string;
      name: string;
      phone: string;
      email: string;
      city: string;
      orderCount: number;
      totalSpent: number;
      lastOrderDate: any;
      isRegistered: boolean;
    }
  >();

  // 1. Seed with registered store customers
  (Array.isArray(storeCustomers) ? storeCustomers : []).forEach((c) => {
    if (!c) return;
    const key = String(c.email || c.phone || c.id || Math.random()).toLowerCase();
    customerMap.set(key, {
      id: c.id,
      name: c.fullName || 'Patron',
      phone: String(c.phone || 'N/A'),
      email: c.email || '',
      city: 'Registered Member',
      orderCount: Number(c.totalOrders ?? 0),
      totalSpent: Number(c.totalSpent ?? 0),
      lastOrderDate: c.lastOrderDate || c.createdAt || new Date().toISOString(),
      isRegistered: true,
    });
  });

  // 2. Aggregate from placed orders
  (Array.isArray(orders) ? orders : []).forEach((order) => {
    if (!order) return;

    const name = String(order.customer?.fullName || (order as any).customerName || 'Patron');
    const phone = String(order.customer?.phone || (order as any).customerPhone || 'N/A');
    const email = String(order.customer?.email || (order as any).customerEmail || '');
    const city = String(order.address?.city || (order as any).shippingAddress?.city || 'Local Delivery');
    const orderTotal = Number(order.total ?? (order as any).totalAmount ?? 0);

    const emailKey = email.trim().toLowerCase();
    const phoneKey = phone.trim() !== 'N/A' ? phone.trim() : '';
    const key = emailKey || phoneKey || name.toLowerCase() || String(order.id);

    const existing = customerMap.get(key) || (emailKey ? customerMap.get(emailKey) : null);

    if (!existing) {
      customerMap.set(key, {
        id: `cust-${Math.random().toString(36).substring(2, 8)}`,
        name,
        phone,
        email,
        city,
        orderCount: 1,
        totalSpent: orderTotal,
        lastOrderDate: order.createdAt,
        isRegistered: false,
      });
    } else {
      // If found, update with richer details
      existing.orderCount = Math.max(existing.orderCount, existing.orderCount + 1);
      existing.totalSpent += orderTotal;
      if (city !== 'Local Delivery' && city !== 'Registered Member') {
        existing.city = city;
      }
      if (phone !== 'N/A' && existing.phone === 'N/A') {
        existing.phone = phone;
      }
      if (email && !existing.email) {
        existing.email = email;
      }
      existing.lastOrderDate = order.createdAt || existing.lastOrderDate;
    }
  });

  const allCustomers = Array.from(customerMap.values()).filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;

    const nameMatch = String(c.name || '').toLowerCase().includes(q);
    const phoneMatch = String(c.phone || '').toLowerCase().includes(q);
    const emailMatch = String(c.email || '').toLowerCase().includes(q);
    const cityMatch = String(c.city || '').toLowerCase().includes(q);

    return nameMatch || phoneMatch || emailMatch || cityMatch;
  });

  const totalPatronSpend = allCustomers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-serif text-xl font-bold text-[#23120B]">
              Patron Connoisseurs ({allCustomers.length})
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EADBC8]/40 text-[#23120B]">
              Total Lifetime: {siteSettings.currencySymbol}{totalPatronSpend.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-[#3E2723]/60 mt-0.5">
            Registered customer accounts, repeat buyers, and lifetime order histories.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#3E2723]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search patron by name, phone, email..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#2D1810]/10 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-[#FAF7F2] text-[#3E2723]/70 uppercase text-[10px] tracking-wider border-b border-[#2D1810]/10">
                <th className="p-4">Customer Name</th>
                <th className="p-4">Contact Information</th>
                <th className="p-4">Location / Tag</th>
                <th className="p-4">Orders Placed</th>
                <th className="p-4">Lifetime Spend</th>
                <th className="p-4 text-right">Most Recent Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D1810]/5">
              {allCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-xs text-[#3E2723]/60">
                    <Users className="w-8 h-8 text-[#C59B27]/40 mx-auto mb-2" />
                    <p className="font-semibold text-sm text-[#23120B]">No patrons found</p>
                    <p className="text-[11px] text-[#3E2723]/60 mt-1">
                      {searchQuery ? 'Try matching another name, phone, or email.' : 'No customer records available.'}
                    </p>
                  </td>
                </tr>
              ) : (
                allCustomers.map((c, i) => {
                  const initial = (c.name || 'P').trim().charAt(0).toUpperCase();
                  return (
                    <tr key={c.id || i} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#23120B] text-[#DFB15B] flex items-center justify-center font-bold text-xs shrink-0">
                            {initial}
                          </div>
                          <div>
                            <span className="font-bold text-sm text-[#23120B] block">{c.name}</span>
                            {c.isRegistered && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[#C59B27] font-semibold">
                                <Award className="w-3 h-3" />
                                <span>VIP Member</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <p className="flex items-center gap-1.5 text-[#23120B] font-medium">
                          <Phone className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                          <span>{c.phone}</span>
                        </p>
                        {c.email && (
                          <p className="flex items-center gap-1.5 text-[#3E2723]/60 text-[11px]">
                            <Mail className="w-3.5 h-3.5 shrink-0" />
                            <span>{c.email}</span>
                          </p>
                        )}
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 text-[#3E2723]/80">
                          <MapPin className="w-3.5 h-3.5 text-[#C59B27] shrink-0" />
                          <span>{c.city}</span>
                        </span>
                      </td>

                      <td className="p-4 font-semibold text-[#23120B]">
                        <span className="px-2.5 py-1 bg-[#FAF7F2] border border-[#2D1810]/10 rounded-lg text-xs">
                          {c.orderCount} order{c.orderCount !== 1 ? 's' : ''}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="font-bold text-sm text-[#C59B27]">
                          {siteSettings.currencySymbol}{Math.round(c.totalSpent).toLocaleString('en-IN')}
                        </span>
                      </td>

                      <td className="p-4 text-right text-[#3E2723]/60">
                        {formatCustomerDate(c.lastOrderDate)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
