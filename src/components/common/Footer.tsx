import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Heart,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Send,
  ShoppingBag,
  Home,
  Compass,
  Search,
} from 'lucide-react';

interface FooterProps {
  currentPath?: string;
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentPath = '/', navigate }) => {
  const {
    siteSettings,
    cartCount,
    wishlistIds,
    setIsCartOpen,
    setIsSearchOpen,
    showToast,
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Invalid Email', 'Please enter a valid email address', 'warning');
      return;
    }
    showToast('Subscribed 🎉', `Welcome to the ${siteSettings.brandName} tasting club! 10% coupon emailed.`);
    setNewsletterEmail('');
  };

  const navTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="bg-[#23120B] text-[#FAF7F2] pt-16 pb-24 sm:pb-12 border-t border-[#C59B27]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <span className="font-serif text-3xl font-bold tracking-tight text-[#FDFBF7]">
                  {siteSettings.brandName}
                </span>
                <p className="text-[11px] tracking-[0.2em] uppercase text-[#DFB15B] font-semibold mt-1">
                  {siteSettings.tagline}
                </p>
              </div>

              <p className="text-xs sm:text-sm text-[#EADBC8]/80 max-w-sm leading-relaxed">
                {siteSettings.description}
              </p>

              {/* Newsletter */}
              <div className="pt-2">
                <p className="text-xs font-bold uppercase tracking-wider text-[#DFB15B] mb-2">
                  Join The Tasting Club
                </p>
                <form onSubmit={handleNewsletterSubmit} className="flex max-w-sm gap-2">
                  <input
                    type="email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Your email address"
                    className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs text-[#FAF7F2] placeholder:text-[#FAF7F2]/40 focus:outline-hidden focus:border-[#C59B27]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#C59B27] hover:bg-[#DFB15B] text-[#23120B] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
                <p className="text-[10px] text-[#EADBC8]/60 mt-1.5">
                  Receive secret tasting batch releases &amp; seasonal privileges.
                </p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B] mb-4">
                Patisserie
              </h4>
              <ul className="space-y-2 text-xs text-[#EADBC8]/80 font-medium">
                <li>
                  <button onClick={() => navTo('/shop?category=brownies')} className="hover:text-white transition-colors">
                    Artisanal Brownies
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/shop?category=cakes')} className="hover:text-white transition-colors">
                    Signature Cakes
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/shop?category=cookies')} className="hover:text-white transition-colors">
                    Gourmet NYC Cookies
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/shop?category=chocolates')} className="hover:text-white transition-colors">
                    Handcrafted Truffles
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/shop?category=gift-hampers')} className="hover:text-white transition-colors">
                    Luxury Gift Hampers
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/offers')} className="hover:text-white transition-colors">
                    Promotions &amp; Offers
                  </button>
                </li>
              </ul>
            </div>

            {/* Support & Policies */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B] mb-4">
                Customer Care
              </h4>
              <ul className="space-y-2 text-xs text-[#EADBC8]/80 font-medium">
                <li>
                  <button onClick={() => navTo('/track-order')} className="hover:text-white transition-colors">
                    Track Your Order
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/about')} className="hover:text-white transition-colors">
                    About Our Brand
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/contact')} className="hover:text-white transition-colors">
                    Contact Concierge
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/shipping-policy')} className="hover:text-white transition-colors">
                    Shipping &amp; Freshness Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/refund-policy')} className="hover:text-white transition-colors">
                    Refund &amp; Cancellation
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/privacy-policy')} className="hover:text-white transition-colors">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => navTo('/terms')} className="hover:text-white transition-colors">
                    Terms &amp; Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Atelier Contact */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#DFB15B] mb-4">
                The Atelier
              </h4>
              <ul className="space-y-3 text-xs text-[#EADBC8]/80">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#C59B27] shrink-0 mt-0.5" />
                  <span className="leading-snug">{siteSettings.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{siteSettings.contactNumber}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#C59B27] shrink-0" />
                  <span>{siteSettings.email}</span>
                </li>
              </ul>

              <div className="pt-4 flex items-center gap-3">
                <a
                  href={siteSettings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-white/10 hover:bg-[#C59B27] text-white rounded-lg transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <button
                  onClick={() => navTo('/contact')}
                  className="p-2 bg-white/10 hover:bg-[#C59B27] text-white rounded-lg transition-colors"
                  aria-label="Email Concierge"
                >
                  <Mail className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EADBC8]/60">
            <p>
              &copy; {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved. Handcrafted with passion.
            </p>
            <div className="flex items-center gap-4 text-[11px]">
              <span>100% Belgian Couverture</span>
              <span>•</span>
              <span>FSSAI Certified Bakery</span>
              <span>•</span>
              <button
                onClick={() => navTo('/admin')}
                className="hover:text-[#DFB15B] transition-colors"
              >
                Staff Portal
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Bottom Navigation */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-0 inset-x-0 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#2D1810]/10 z-30 lg:hidden px-3 py-2 flex items-center justify-around shadow-lg"
      >
        <button
          onClick={() => navTo('/')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            (currentPath || '/') === '/' ? 'text-[#C59B27]' : 'text-[#3E2723]/70 hover:text-[#23120B]'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => navTo('/shop')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors ${
            (currentPath || '').startsWith('/shop') ? 'text-[#C59B27]' : 'text-[#3E2723]/70 hover:text-[#23120B]'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span>Shop</span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-[#3E2723]/70 hover:text-[#23120B] transition-colors"
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button
          onClick={() => navTo('/wishlist')}
          className={`flex flex-col items-center gap-1 p-1 text-[10px] font-semibold transition-colors relative ${
            (currentPath || '') === '/wishlist' ? 'text-[#C59B27]' : 'text-[#3E2723]/70 hover:text-[#23120B]'
          }`}
        >
          <Heart className="w-5 h-5" />
          <span>Saved</span>
          {wishlistIds.length > 0 && (
            <span className="absolute top-0 right-1 w-3.5 h-3.5 bg-[#C59B27] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {wishlistIds.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center gap-1 p-1 text-[10px] font-semibold text-[#23120B] hover:text-[#C59B27] transition-colors relative"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 w-4 h-4 bg-[#23120B] text-[#DFB15B] text-[9px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span>Bag</span>
        </button>
      </nav>
    </>
  );
};
