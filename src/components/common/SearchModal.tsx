import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, X, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';

interface SearchModalProps {
  navigate: (path: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ navigate }) => {
  const { isSearchOpen, setIsSearchOpen, products, addToCart, siteSettings } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();
  const filteredProducts = cleanQuery
    ? products.filter((p) => {
        return (
          p.name.toLowerCase().includes(cleanQuery) ||
          p.categoryName.toLowerCase().includes(cleanQuery) ||
          p.description.toLowerCase().includes(cleanQuery) ||
          p.shortDescription.toLowerCase().includes(cleanQuery) ||
          (p.sku && p.sku.toLowerCase().includes(cleanQuery)) ||
          p.tags.some((tag) => tag.toLowerCase().includes(cleanQuery))
        );
      })
    : [];

  const handleProductSelect = (product: Product) => {
    setIsSearchOpen(false);
    navigate(`/product/${product.slug}`);
  };

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-start justify-center pt-16 sm:pt-24 px-4 pb-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-[#FAF7F2] rounded-2xl shadow-2xl border border-[#C59B27]/20 z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-[#2D1810]/10 flex items-center gap-3 bg-[#FDFBF7]">
          <Search className="w-5 h-5 text-[#C59B27] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brownies, truffle cakes, cookies, gift hampers..."
            className="flex-1 bg-transparent text-[#23120B] text-base sm:text-lg focus:outline-hidden placeholder:text-[#3E2723]/40"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-xs text-[#3E2723]/50 hover:text-[#23120B]"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 text-[#3E2723]/70 hover:text-[#23120B] hover:bg-[#EADBC8]/40 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 sm:p-5">
          {!cleanQuery ? (
            <div className="py-6 text-center">
              <p className="text-xs uppercase font-bold tracking-widest text-[#3E2723]/50 mb-3">
                Trending Searches
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Ferrero Brownie', 'NYC Sea Salt Cookies', 'Belgian Truffle Cake', 'Gift Hamper', 'Nutella'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-3 py-1.5 bg-[#EADBC8]/40 hover:bg-[#C59B27] hover:text-[#FAF7F2] text-xs text-[#2D1810] font-medium rounded-full transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#EADBC8]/40 flex items-center justify-center mx-auto text-xl">
                🔍
              </div>
              <h3 className="font-serif text-lg font-bold text-[#23120B]">
                No matching confectionary found
              </h3>
              <p className="text-xs text-[#3E2723]/70 max-w-sm mx-auto">
                We couldn't find anything matching "{query}". Try checking for spelling or explore our bestselling brownie categories.
              </p>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  navigate('/shop');
                }}
                className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-[#C59B27] hover:underline"
              >
                <span>Browse Complete Shop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <div className="flex justify-between items-center px-1 text-xs text-[#3E2723]/60 font-medium">
                <span>{filteredProducts.length} results found</span>
                <span>Click item for details</span>
              </div>

              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="flex items-center justify-between p-3 bg-white hover:bg-[#FDFBF7] rounded-xl border border-[#2D1810]/5 hover:border-[#C59B27]/40 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={product.thumbnail || product.images[0]}
                      alt={product.name}
                      className="w-14 h-14 object-cover rounded-lg bg-[#FAF7F2] shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C59B27]">
                        {product.categoryName}
                      </span>
                      <h4 className="text-sm font-semibold text-[#23120B] truncate group-hover:text-[#C59B27] transition-colors">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#23120B]">
                          {siteSettings.currencySymbol}{product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-[11px] text-gray-400 line-through">
                            {siteSettings.currencySymbol}{product.originalPrice}
                          </span>
                        )}
                        <span className="text-[10px] text-emerald-700 font-semibold">
                          ★ {product.rating} ({product.reviewCount})
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleQuickAdd(e, product)}
                    className="shrink-0 p-2 text-[#23120B] hover:text-[#FAF7F2] hover:bg-[#23120B] rounded-lg transition-colors border border-[#2D1810]/15 ml-2"
                    title="Quick Add to Bag"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#EADBC8]/20 border-t border-[#2D1810]/10 text-center text-[11px] text-[#3E2723]/60 flex justify-between px-5">
          <span>Freshly baked upon order</span>
          <span>Same-day delivery available</span>
        </div>
      </div>
    </div>
  );
};
