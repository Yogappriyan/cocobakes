import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Users,
  Clock,
  ArrowUpRight,
  Package,
  Plus,
  Settings,
  Sparkles,
  ChefHat,
} from 'lucide-react';

interface AdminDashboardProps {
  setCurrentTab: (tab: string) => void;
  onViewOrder: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setCurrentTab,
  onViewOrder,
}) => {
  const { orders, products, siteSettings, updateOrderStatus, updateProductStock } = useStore();

  // Metrics
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + (o.total ?? (o as any).totalAmount ?? 0), 0);

  const pendingOrders = orders.filter(
    (o) =>
      o.status === 'pending' ||
      o.status === 'confirmed' ||
      o.status === 'preparing' ||
      (o.status as any) === 'baking'
  );

  const lowStockProducts = products.filter((p) => p.stock <= 5);

  const uniqueCustomersCount = new Set(
    orders.map(
      (o) =>
        o.customer?.phone ||
        o.customer?.fullName ||
        (o as any).customerPhone ||
        (o as any).customerName ||
        o.id
    )
  ).size;

  const quickRestock = (productId: string, currentStock: number) => {
    updateProductStock(productId, currentStock + 10);
  };

  return (
    <div className="space-y-8">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-2xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#3E2723]/60 font-bold uppercase tracking-wider">
              Total Revenue
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B] mt-1">
              {siteSettings.currencySymbol}{totalRevenue.toLocaleString('en-IN')}
            </h3>
            <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Realtime store intake</span>
            </span>
          </div>
          <div className="p-3 bg-[#EADBC8]/40 text-[#C59B27] rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-2xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#3E2723]/60 font-bold uppercase tracking-wider">
              Total Orders
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#23120B] mt-1">
              {orders.length}
            </h3>
            <span className="text-[11px] text-[#3E2723]/70 font-semibold flex items-center gap-1 mt-1">
              <span>{orders.filter((o) => o.status === 'delivered').length} delivered</span>
            </span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-800 rounded-xl">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* In-Kitchen Active Baking */}
        <div className="bg-white p-6 rounded-2xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#3E2723]/60 font-bold uppercase tracking-wider">
              Baking / In-Flight
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-amber-700 mt-1">
              {pendingOrders.length}
            </h3>
            <button
              onClick={() => setCurrentTab('orders')}
              className="text-[11px] text-[#C59B27] hover:underline font-semibold flex items-center gap-1 mt-1"
            >
              <span>Manage kitchen queue &rarr;</span>
            </button>
          </div>
          <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
            <ChefHat className="w-6 h-6" />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-2xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs text-[#3E2723]/60 font-bold uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <h3
              className={`font-serif text-2xl sm:text-3xl font-bold mt-1 ${
                lowStockProducts.length > 0 ? 'text-rose-600' : 'text-[#23120B]'
              }`}
            >
              {lowStockProducts.length}
            </h3>
            <button
              onClick={() => setCurrentTab('inventory')}
              className="text-[11px] text-[#C59B27] hover:underline font-semibold flex items-center gap-1 mt-1"
            >
              <span>Replenish batches &rarr;</span>
            </button>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-[#23120B] rounded-2xl p-5 text-white flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-[#DFB15B]" />
          <div>
            <h4 className="font-bold text-sm text-white">Atelier Quick Controls</h4>
            <p className="text-[11px] text-[#EADBC8]/70">
              Manage inventory batches, update active discounts, or tweak site branding.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setCurrentTab('products')}
            className="px-3.5 py-2 bg-[#C59B27] hover:bg-[#DFB15B] text-[#23120B] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Product</span>
          </button>
          <button
            onClick={() => setCurrentTab('orders')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-[#DFB15B]" />
            <span>View All Orders</span>
          </button>
          <button
            onClick={() => setCurrentTab('coupons')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <span>Create Coupon</span>
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Site Settings</span>
          </button>
        </div>
      </div>

      {/* Two-Column: Recent Orders + Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders (Col 8) */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-[#2D1810]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2D1810]/10">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#23120B]">Recent Orders</h3>
              <p className="text-xs text-[#3E2723]/60">Incoming customer orders requiring fulfillment</p>
            </div>
            <button
              onClick={() => setCurrentTab('orders')}
              className="text-xs font-bold text-[#C59B27] hover:underline"
            >
              View All ({orders.length}) &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[#3E2723]/60 border-b border-[#2D1810]/10 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Items</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2D1810]/5">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 font-bold text-[#23120B]">
                      #{order.orderNumber}
                    </td>
                    <td className="py-3">
                      <p className="font-semibold text-[#23120B]">
                        {order.customer?.fullName || (order as any).customerName || 'Customer'}
                      </p>
                      <p className="text-[10px] text-[#3E2723]/60">
                        {order.customer?.phone || (order as any).customerPhone || ''}
                      </p>
                    </td>
                    <td className="py-3">
                      {(order.items || []).length} item{(order.items || []).length !== 1 ? 's' : ''}
                    </td>
                    <td className="py-3 font-bold text-[#23120B]">
                      {siteSettings.currencySymbol}{order.total ?? (order as any).totalAmount ?? 0}
                    </td>
                    <td className="py-3">
                      <select
                        value={order.status === 'preparing' ? 'preparing' : (order.status as any) === 'baking' ? 'preparing' : order.status}
                        onChange={(e) =>
                          updateOrderStatus(order.id, e.target.value as Order['status'])
                        }
                        className="bg-[#FAF7F2] border border-[#2D1810]/15 rounded-lg text-[11px] font-semibold px-2 py-1 focus:outline-hidden"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">In Kitchen (Preparing)</option>
                        <option value="ready">Packed & Ready</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onViewOrder(order)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#C59B27] hover:underline"
                      >
                        View &rarr;
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (Col 4) */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#2D1810]/10 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#2D1810]/10">
            <h3 className="font-serif text-xl font-bold text-[#23120B]">Low Inventory</h3>
            <button
              onClick={() => setCurrentTab('inventory')}
              className="text-xs font-bold text-[#C59B27] hover:underline"
            >
              All &rarr;
            </button>
          </div>

          {lowStockProducts.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-10 h-10 text-emerald-600 mx-auto mb-2 opacity-75" />
              <p className="text-xs font-semibold text-emerald-900">
                All confectionery stocks healthy!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#FAF7F2] border border-[#2D1810]/5 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={p.thumbnail || p.images?.[0] || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=200&q=80'}
                      alt={p.name}
                      className="w-9 h-9 rounded-lg object-cover bg-white shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#23120B] truncate">{p.name}</p>
                      <span className="text-rose-600 font-bold text-[10px]">
                        {p.stock} left in stock
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => quickRestock(p.id, p.stock)}
                    className="px-2.5 py-1 bg-[#23120B] text-white hover:bg-[#C59B27] text-[11px] font-bold rounded-lg transition-colors shrink-0"
                  >
                    +10
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
