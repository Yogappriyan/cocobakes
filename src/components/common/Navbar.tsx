import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface NavbarProps {
  currentPath?: string;
  navigate: (path: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath = '/', navigate }) => {
  const {
    siteSettings,
    cartCount,
    wishlistIds,
    setIsCartOpen,
    setIsSearchOpen,
    categories,
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories', hasDropdown: true },
    { label: 'Best Sellers', path: '/shop?filter=bestseller' },
    { label: 'Offers', path: '/offers' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
    setCategoriesDropdownOpen(false);
  };

  return (
    <>
      {/* Announcement Bar */}
      {siteSettings.announcementBarActive && (
        <aside
          aria-label="Announcement"
          className="bg-[#23120B] text-[#EADBC8] text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-[#C59B27]/20"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#DFB15B] shrink-0" />
          <span>{siteSettings.announcementBarText}</span>
          <button
            onClick={() => handleNavClick('/shop')}
            className="underline underline-offset-2 text-[#DFB15B] font-semibold hover:text-[#FAF7F2] ml-1 transition-colors"
          >
            Order Now
          </button>
        </aside>
      )}

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FAF7F2]/95 backdrop-blur-md shadow-sm border-b border-[#2D1810]/10 py-3'
            : 'bg-[#FAF7F2] py-4 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Mobile menu trigger & brand */}
          <div className="flex items-center gap-3 lg:gap-8">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-[#2D1810] hover:text-[#C59B27] rounded-lg lg:hidden transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Brand Logo */}
            <button
              onClick={() => handleNavClick('/')}
              className="text-left group flex flex-col justify-center"
            >
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#23120B] group-hover:text-[#C59B27] transition-colors leading-none">
                {siteSettings.brandName}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#3E2723]/70 font-semibold mt-1">
                {siteSettings.tagline}
              </span>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => {
              const safePath = currentPath || '/';
              const isActive =
                link.path === '/'
                  ? safePath === '/'
                  : safePath.startsWith(link.path);

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setCategoriesDropdownOpen(true)}
                    onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  >
                    <button
                      onClick={() => handleNavClick('/shop')}
                      className={`text-sm font-medium transition-colors py-1 flex items-center gap-1 ${
                        safePath.includes('category')
                          ? 'text-[#C59B27] font-semibold'
                          : 'text-[#2D1810] hover:text-[#C59B27]'
                      }`}
                    >
                      {link.label}
                    </button>

                    {/* Categories Dropdown */}
                    {categoriesDropdownOpen && (
                      <div className="absolute top-full left-0 w-64 bg-[#FAF7F2] rounded-xl shadow-xl border border-[#2D1810]/10 p-2 mt-1 z-50 animate-in fade-in slide-in-from-top-2">
                        <div className="py-1">
                          {categories
                            .filter((c) => c.status === 'active')
                            .map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => handleNavClick(`/category/${cat.slug}`)}
                                className="w-full text-left px-3 py-2 text-sm text-[#2D1810] hover:bg-[#EADBC8]/40 hover:text-[#23120B] rounded-lg transition-colors flex items-center justify-between group"
                              >
                                <span>{cat.name}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-[#C59B27] opacity-0 group-hover:opacity-100 transition-opacity" />
                              </button>
                            ))}
                          <div className="border-t border-[#2D1810]/10 my-1 pt-1">
                            <button
                              onClick={() => handleNavClick('/shop')}
                              className="w-full text-left px-3 py-1.5 text-xs font-semibold text-[#C59B27] hover:underline"
                            >
                              View All Categories &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path)}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    isActive
                      ? 'text-[#C59B27] font-semibold'
                      : 'text-[#2D1810] hover:text-[#C59B27]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#C59B27] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#2D1810] hover:text-[#C59B27] hover:bg-[#EADBC8]/30 rounded-full transition-colors"
              aria-label="Search bakery items"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('/wishlist')}
              className="p-2 text-[#2D1810] hover:text-[#C59B27] hover:bg-[#EADBC8]/30 rounded-full transition-colors relative"
              aria-label="View Wishlist"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C59B27] text-[#FAF7F2] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#2D1810] hover:text-[#C59B27] hover:bg-[#EADBC8]/30 rounded-full transition-colors relative"
              aria-label="View shopping bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#23120B] text-[#DFB15B] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#FAF7F2]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Track Order */}
            <button
              onClick={() => handleNavClick('/account')}
              className="p-2 text-[#2D1810] hover:text-[#C59B27] hover:bg-[#EADBC8]/30 rounded-full transition-colors"
              aria-label="Customer Account & Orders"
              title="My Account"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-300">
            <div className="p-5 border-b border-[#2D1810]/10 flex items-center justify-between">
              <div>
                <span className="font-serif text-2xl font-bold text-[#23120B]">
                  {siteSettings.brandName}
                </span>
                <p className="text-[10px] tracking-wider uppercase text-[#3E2723]/70 font-medium">
                  {siteSettings.tagline}
                </p>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-[#2D1810] hover:text-[#C59B27] rounded-lg"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.path)}
                    className="w-full text-left py-2.5 px-3 text-base font-medium text-[#2D1810] hover:bg-[#EADBC8]/40 hover:text-[#C59B27] rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-[#C59B27]/50" />
                  </button>
                ))}
              </div>

              <div className="border-t border-[#2D1810]/10 pt-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#3E2723]/60 mb-2 px-3">
                  Categories
                </p>
                <div className="space-y-1">
                  {categories
                    .filter((c) => c.status === 'active')
                    .map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleNavClick(`/category/${cat.slug}`)}
                        className="w-full text-left py-2 px-3 text-sm text-[#2D1810] hover:text-[#C59B27] rounded-lg flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                        <span className="text-xs text-[#3E2723]/50">
                          {cat.productCount ? `${cat.productCount} items` : ''}
                        </span>
                      </button>
                    ))}
                </div>
              </div>

              <div className="border-t border-[#2D1810]/10 pt-4 space-y-2">
                <button
                  onClick={() => handleNavClick('/track-order')}
                  className="w-full py-2.5 px-3 text-sm font-medium text-[#2D1810] bg-[#EADBC8]/30 rounded-lg text-left"
                >
                  🚚 Track Your Order
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-[#2D1810]/10 bg-[#EADBC8]/20 text-xs text-[#3E2723]/80 text-center">
              Concierge: {siteSettings.contactNumber}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
