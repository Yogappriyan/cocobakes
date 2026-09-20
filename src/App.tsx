import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ToastContainer } from './components/common/ToastContainer';

// Customer Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { AccountPage } from './pages/AccountPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { OffersPage } from './pages/OffersPage';
import { PolicyPage } from './pages/PolicyPage';

// Admin Components
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminCategories } from './pages/admin/AdminCategories';
import { AdminInventory } from './pages/admin/AdminInventory';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminReviews } from './pages/admin/AdminReviews';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminMessages } from './pages/admin/AdminMessages';
import { AdminSettings } from './pages/admin/AdminSettings';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Order } from './types';

const AppContent: React.FC = () => {
  const { isAdminAuthenticated } = useStore();
  const [currentPath, setCurrentPath] = useState<string>(window.location.pathname || '/');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [selectedAdminOrder, setSelectedAdminOrder] = useState<Order | null>(null);

  // Sync with browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentPath(path);
      if (path.startsWith('/admin')) {
        const tab = path.split('/')[2];
        if (tab) setAdminTab(tab);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    if (path.startsWith('/admin')) {
      const tab = path.split('/')[2];
      if (tab) setAdminTab(tab);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminTabSelect = (tab: string) => {
    setAdminTab(tab);
    const newPath = tab === 'dashboard' ? '/admin' : `/admin/${tab}`;
    window.history.pushState({}, '', newPath);
    setCurrentPath(newPath);
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  // Handle Admin Routing
  if (isAdminRoute) {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onSuccess={() => {
            setAdminTab('dashboard');
            navigate('/admin');
          }}
          onBackToStore={() => navigate('/')}
        />
      );
    }

    return (
      <AdminLayout
        currentTab={adminTab}
        setCurrentTab={handleAdminTabSelect}
        navigate={navigate}
      >
        <ErrorBoundary
          fallbackTitle="Admin View Error"
          fallbackMessage="An unexpected issue occurred displaying this section. Your orders and inventory data remain completely safe."
        >
          {adminTab === 'dashboard' && (
            <AdminDashboard
              setCurrentTab={handleAdminTabSelect}
              onViewOrder={(order) => {
                setSelectedAdminOrder(order);
                handleAdminTabSelect('orders');
              }}
            />
          )}
          {adminTab === 'orders' && <AdminOrders initialOrder={selectedAdminOrder} />}
          {adminTab === 'products' && <AdminProducts />}
          {adminTab === 'categories' && <AdminCategories />}
          {adminTab === 'inventory' && <AdminInventory />}
          {adminTab === 'customers' && <AdminCustomers />}
          {adminTab === 'reviews' && <AdminReviews />}
          {adminTab === 'coupons' && <AdminCoupons />}
          {adminTab === 'messages' && <AdminMessages />}
          {adminTab === 'settings' && <AdminSettings />}
        </ErrorBoundary>
      </AdminLayout>
    );
  }

  // Handle Customer Route Resolution
  const renderCustomerPage = () => {
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }

    if (currentPath === '/shop') {
      return <ShopPage navigate={navigate} />;
    }

    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '');
      return <CategoryPage categorySlug={slug} navigate={navigate} />;
    }

    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetailPage productSlug={slug} navigate={navigate} />;
    }

    if (currentPath === '/checkout') {
      return <CheckoutPage navigate={navigate} />;
    }

    if (currentPath === '/order-success') {
      return <OrderSuccessPage navigate={navigate} />;
    }

    if (currentPath === '/track-order') {
      return <TrackOrderPage navigate={navigate} />;
    }

    if (currentPath === '/wishlist') {
      return <WishlistPage navigate={navigate} />;
    }

    if (currentPath === '/account') {
      return <AccountPage navigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage />;
    }

    if (currentPath === '/offers') {
      return <OffersPage navigate={navigate} />;
    }

    if (currentPath === '/privacy-policy') {
      return <PolicyPage type="privacy" />;
    }

    if (currentPath === '/terms') {
      return <PolicyPage type="terms" />;
    }

    if (currentPath === '/refund-policy') {
      return <PolicyPage type="refund" />;
    }

    if (currentPath === '/shipping-policy') {
      return <PolicyPage type="shipping" />;
    }

    // Default Fallback
    return <HomePage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#23120B] flex flex-col font-sans selection:bg-[#C59B27] selection:text-white">
      {/* Top Navbar */}
      <Navbar navigate={navigate} currentPath={currentPath} />

      {/* Main Page Body */}
      <main className="flex-1 min-w-0">
        {renderCustomerPage()}
      </main>

      {/* Luxury Footer */}
      <Footer navigate={navigate} currentPath={currentPath} />

      {/* Global Modals & Drawers */}
      <CartDrawer navigate={navigate} />
      <SearchModal navigate={navigate} />
      <QuickViewModal navigate={navigate} />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
