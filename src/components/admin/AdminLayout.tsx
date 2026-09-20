import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Warehouse,
  Users,
  Star,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sparkles,
  Bell,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  navigate,
  children,
}) => {
  const { siteSettings, adminLogout, orders, contactMessages, products } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter(
    (o) => o && (o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing' || (o.status as any) === 'baking')
  ).length;

  const newMessagesCount = contactMessages.filter((m) => m && (m.status === 'unread' || (m.status as any) === 'new')).length;
  const lowStockCount = products.filter((p) => p.stock <= 5).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: Layers },
    { id: 'inventory', label: 'Inventory', icon: Warehouse, badge: lowStockCount > 0 ? lowStockCount : undefined },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'coupons', label: 'Coupons & Offers', icon: Tag },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: newMessagesCount > 0 ? newMessagesCount : undefined },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  const handleTabSelect = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5EFEB] flex flex-col lg:flex-row text-[#23120B]">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#23120B] text-[#FAF7F2] border-r border-[#C59B27]/20 shrink-0">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2 text-[#DFB15B]">
            <Sparkles className="w-5 h-5" />
            <span className="font-serif text-xl font-bold tracking-tight text-white">
              {siteSettings.brandName}
            </span>
          </div>
          <p className="text-[10px] text-[#EADBC8]/70 uppercase tracking-widest mt-1">
            Atelier Management Desk
          </p>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#C59B27] text-[#23120B] font-bold shadow-sm'
                    : 'text-[#EADBC8]/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#23120B] text-[#DFB15B]' : 'bg-[#C59B27] text-[#23120B]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#DFB15B]" />
            <span>Open Customer Storefront</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs font-semibold text-rose-300 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Body Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="bg-white border-b border-[#2D1810]/10 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-[#23120B] hover:bg-[#FAF7F2] rounded-lg"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="font-serif text-xl sm:text-2xl font-bold capitalize text-[#23120B]">
                {currentTab.replace('-', ' ')}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#EADBC8]/40 border border-[#2D1810]/15 rounded-full text-xs font-semibold text-[#23120B] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Live Website</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 text-[#3E2723]/70 hover:text-rose-600 rounded-lg transition-colors"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#23120B] text-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 p-5">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-serif text-lg font-bold text-white">
                {siteSettings.brandName} Admin
              </span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                      isActive ? 'bg-[#C59B27] text-[#23120B]' : 'text-[#EADBC8]/80'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#23120B] text-[#DFB15B]">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate('/');
                }}
                className="w-full py-2 bg-white/10 text-white rounded-xl text-xs font-semibold"
              >
                Open Storefront
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-2 bg-rose-900 text-white rounded-xl text-xs font-semibold"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
