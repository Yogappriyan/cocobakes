import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  SlidersHorizontal,
  Search,
  X,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
  LayoutGrid,
  List,
  Leaf,
} from 'lucide-react';

interface ShopPageProps {
  navigate: (path: string) => void;
  initialCategory?: string;
  initialFilter?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  navigate,
  initialCategory,
  initialFilter,
}) => {
  const { products, categories, siteSettings } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedBadge, setSelectedBadge] = useState<string>(initialFilter || 'all');
  const [quickFilter, setQuickFilter] = useState<'all' | 'eggless' | 'couverture' | 'under500' | 'bestseller'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
    if (initialFilter) setSelectedBadge(initialFilter);
  }, [initialCategory, initialFilter]);

  // Max product price calculation
  const maxAvailablePrice = useMemo(() => {
    const prices = products.map((p) => p.price);
    return Math.max(...prices, 2500);
  }, [products]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.status === 'active');

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(
        (p) =>
          p.categoryId === selectedCategory ||
          p.categorySlug === selectedCategory
      );
    }

    // Badge filter
    if (selectedBadge !== 'all') {
      list = list.filter((p) => p.badge === selectedBadge);
    }

    // Special Quick Filter
    if (quickFilter === 'eggless') {
      list = list.filter((p) => p.eggless || p.tags?.some((t) => t.toLowerCase().includes('eggless')));
    } else if (quickFilter === 'couverture') {
      list = list.filter((p) => p.tags?.some((t) => t.toLowerCase().includes('belgian') || t.toLowerCase().includes('dark') || t.toLowerCase().includes('couverture')));
    } else if (quickFilter === 'under500') {
      list = list.filter((p) => p.price <= 500);
    } else if (quickFilter === 'bestseller') {
      list = list.filter((p) => p.badge === 'bestseller');
    }

    // Price filter
    list = list.filter((p) => p.price <= priceRange);

    // In Stock filter
    if (inStockOnly) {
      list = list.filter((p) => p.stock > 0 && p.stockStatus !== 'out_of_stock');
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price_low_high':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'featured':
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    return list;
  }, [
    products,
    selectedCategory,
    selectedBadge,
    quickFilter,
    priceRange,
    inStockOnly,
    searchQuery,
    sortBy,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedBadge('all');
    setQuickFilter('all');
    setSearchQuery('');
    setPriceRange(maxAvailablePrice);
    setSortBy('featured');
    setInStockOnly(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBadge !== 'all' ||
    quickFilter !== 'all' ||
    searchQuery !== '' ||
    priceRange < maxAvailablePrice ||
    inStockOnly;

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADBC8]/50 text-[#C59B27] text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Atelier Collection</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#23120B]">
          Artisanal Bakery &amp; Chocolates
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2723]/80 mt-2">
          Select from freshly baked single-origin brownies, soft melt-in-mouth cookies, handcrafted celebration cakes, and gift boxes.
        </p>
      </div>

      {/* Control Bar (Mobile toggle, live search, sort dropdown) */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#2D1810]/10 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-[#3E2723]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search within bakes..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#FAF7F2] border border-[#2D1810]/10 rounded-xl focus:outline-hidden focus:border-[#C59B27]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#3E2723]/50 hover:text-[#23120B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl text-xs font-semibold text-[#23120B]"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#C59B27]" />
            <span>Filters {hasActiveFilters && '•'}</span>
          </button>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#3E2723]/70 font-medium hidden sm:inline">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-[#FAF7F2] border border-[#2D1810]/15 rounded-xl px-4 py-2 pr-8 text-xs font-semibold text-[#23120B] focus:outline-hidden focus:border-[#C59B27] cursor-pointer"
              >
                <option value="featured">Featured Picks</option>
                <option value="price_low_high">Price: Low to High</option>
                <option value="price_high_low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newly Baked</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-[#3E2723]/60 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-3 space-y-6 bg-white p-6 rounded-2xl border border-[#2D1810]/10 shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-[#2D1810]/10">
            <h3 className="font-bold text-sm text-[#23120B] flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#C59B27]" />
              <span>Refine Tasting</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-semibold text-[#C59B27] hover:underline flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3E2723]/70 mb-2.5">
              Categories
            </label>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-[#23120B] text-[#FAF7F2] font-semibold'
                    : 'text-[#2D1810] hover:bg-[#FAF7F2]'
                }`}
              >
                <span>All Confectioneries</span>
                <span>{products.filter((p) => p.status === 'active').length}</span>
              </button>

              {categories
                .filter((c) => c.status === 'active')
                .map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors flex justify-between ${
                      selectedCategory === cat.slug || selectedCategory === cat.id
                        ? 'bg-[#23120B] text-[#FAF7F2] font-semibold'
                        : 'text-[#2D1810] hover:bg-[#FAF7F2]'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[11px] opacity-70">
                      {products.filter((p) => p.categoryId === cat.id).length}
                    </span>
                  </button>
                ))}
            </div>
          </div>

          {/* Special Badges */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3E2723]/70 mb-2.5">
              Curated Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'all', label: 'All' },
                { id: 'bestseller', label: 'Bestseller' },
                { id: 'new', label: 'New Arrival' },
                { id: 'trending', label: 'Trending' },
                { id: 'sale', label: 'On Sale' },
              ].map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadge(badge.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
                    selectedBadge === badge.id
                      ? 'border-[#C59B27] bg-[#C59B27] text-[#FAF7F2] font-semibold shadow-xs'
                      : 'border-[#2D1810]/15 bg-[#FAF7F2] text-[#2D1810] hover:border-[#C59B27]'
                  }`}
                >
                  {badge.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="font-bold uppercase tracking-wider text-[#3E2723]/70">
                Max Price
              </span>
              <span className="font-bold text-[#23120B]">
                {siteSettings.currencySymbol}{priceRange}
              </span>
            </div>
            <input
              type="range"
              min={200}
              max={maxAvailablePrice}
              step={50}
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full accent-[#C59B27] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#3E2723]/60 mt-1">
              <span>{siteSettings.currencySymbol}200</span>
              <span>{siteSettings.currencySymbol}{maxAvailablePrice}</span>
            </div>
          </div>

          {/* Availability */}
          <div className="pt-2 border-t border-[#2D1810]/10">
            <label className="flex items-center gap-2 text-xs font-semibold text-[#2D1810] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-4 h-4 rounded-sm accent-[#C59B27] text-[#C59B27]"
              />
              <span>In Stock for Immediate Baking</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="md:col-span-9">
          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs text-[#3E2723]/60 font-medium">Active Filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EADBC8]/40 text-[#23120B] text-xs font-semibold rounded-full">
                  <span>Category: {selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedBadge !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EADBC8]/40 text-[#23120B] text-xs font-semibold rounded-full">
                  <span>Tag: {selectedBadge}</span>
                  <button onClick={() => setSelectedBadge('all')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EADBC8]/40 text-[#23120B] text-xs font-semibold rounded-full">
                  <span>Keyword: "{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs font-bold text-[#C59B27] hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Quick Tasting Filter Pills & Presentation Controls */}
          <div className="space-y-4 mb-6">
            {/* Quick Tasting Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {[
                { id: 'all', label: 'All Confections', icon: '✨' },
                { id: 'eggless', label: '100% Eggless', icon: '🌱' },
                { id: 'couverture', label: 'Belgian Couverture', icon: '🍫' },
                { id: 'bestseller', label: 'Bestsellers', icon: '⭐' },
                { id: 'under500', label: 'Under ₹500', icon: '🏷️' },
              ].map((pill) => {
                const isActive = quickFilter === pill.id;
                return (
                  <button
                    key={pill.id}
                    onClick={() => setQuickFilter(pill.id as any)}
                    className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 border ${
                      isActive
                        ? 'bg-[#23120B] text-[#DFB15B] border-[#C59B27] shadow-xs'
                        : 'bg-white text-[#2D1810] border-[#2D1810]/15 hover:border-[#C59B27]'
                    }`}
                  >
                    <span>{pill.icon}</span>
                    <span>{pill.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Results count & Layout Switcher */}
            <div className="flex items-center justify-between pt-2 border-t border-[#2D1810]/10">
              <p className="text-xs sm:text-sm text-[#3E2723]/75">
                Showing <span className="font-bold text-[#23120B]">{filteredProducts.length}</span> handcrafted delicacies
              </p>

              {/* Grid / List Mode Switcher */}
              <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#2D1810]/15 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-[#23120B] text-[#FAF7F2]'
                      : 'text-[#3E2723]/60 hover:text-[#23120B]'
                  }`}
                  title="Grid View (Visual Showcase)"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-[#23120B] text-[#FAF7F2]'
                      : 'text-[#3E2723]/60 hover:text-[#23120B]'
                  }`}
                  title="Tasting List View (Detailed Profiles)"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Products Presentation Stage */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#2D1810]/10 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-[#EADBC8]/50 flex items-center justify-center mx-auto text-2xl mb-4">
                🍫
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#23120B]">
                No delicious bakes match your criteria
              </h3>
              <p className="text-xs sm:text-sm text-[#3E2723]/70 mt-2 max-w-md mx-auto">
                Try widening your price range or clearing selected category filters to view our full patisserie menu.
              </p>
              <button
                onClick={resetFilters}
                className="mt-6 px-6 py-2.5 bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2] text-xs font-semibold rounded-full transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${viewMode}-${selectedCategory}-${selectedBadge}-${quickFilter}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
                    : 'flex flex-col gap-4 sm:gap-5'
                }
              >
                {filteredProducts.map((product, idx) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    navigate={navigate}
                    layout={viewMode === 'list' ? 'horizontal' : 'grid'}
                    index={idx}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FAF7F2] h-full shadow-2xl flex flex-col z-10 p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#2D1810]/10">
              <h3 className="font-serif text-xl font-bold text-[#23120B]">Filter Delights</h3>
              <button onClick={() => setMobileFiltersOpen(false)}>
                <X className="w-5 h-5 text-[#23120B]" />
              </button>
            </div>

            <div className="space-y-6 py-6 flex-1">
              {/* Category */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#3E2723]/70 mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                      selectedCategory === 'all'
                        ? 'bg-[#23120B] text-[#FAF7F2]'
                        : 'text-[#2D1810]'
                    }`}
                  >
                    All Confectioneries
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium ${
                        selectedCategory === c.slug
                          ? 'bg-[#23120B] text-[#FAF7F2]'
                          : 'text-[#2D1810]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-2">
                  <span>Max Price:</span>
                  <span>{siteSettings.currencySymbol}{priceRange}</span>
                </div>
                <input
                  type="range"
                  min={200}
                  max={maxAvailablePrice}
                  step={50}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#C59B27]"
                />
              </div>

              {/* Stock */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-[#2D1810]">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="w-4 h-4 accent-[#C59B27]"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-[#2D1810]/10 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 border border-[#2D1810]/20 rounded-xl text-xs font-semibold text-[#23120B]"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 py-2.5 bg-[#23120B] text-white rounded-xl text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
