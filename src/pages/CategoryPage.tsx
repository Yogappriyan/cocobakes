import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface CategoryPageProps {
  categorySlug: string;
  navigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, navigate }) => {
  const { categories, products } = useStore();

  const category = categories.find(
    (c) => c.slug === categorySlug || c.id === categorySlug
  );

  const categoryProducts = products.filter(
    (p) =>
      p.status === 'active' &&
      (p.categorySlug === categorySlug ||
        p.categoryId === categorySlug ||
        p.categoryId === category?.id)
  );

  if (!category) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4">
        <h2 className="font-serif text-3xl font-bold text-[#23120B]">Category Not Found</h2>
        <p className="text-sm text-[#3E2723]/70 mt-2 mb-6">
          The requested confectionery category does not exist or has been retired.
        </p>
        <button
          onClick={() => navigate('/shop')}
          className="px-6 py-2.5 bg-[#23120B] text-white rounded-full text-xs font-semibold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Back */}
      <button
        onClick={() => navigate('/shop')}
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#3E2723]/70 hover:text-[#C59B27] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Confectioneries</span>
      </button>

      {/* Category Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-12 border border-[#2D1810]/10 aspect-21/9 sm:aspect-3/1">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#23120B]/90 via-[#23120B]/60 to-transparent flex items-center p-6 sm:p-12">
          <div className="max-w-xl text-white space-y-2 sm:space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFB15B]/20 text-[#DFB15B] text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Specialty Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#EADBC8]/90 leading-relaxed max-w-md">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex justify-between items-center pb-3 border-b border-[#2D1810]/10">
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#23120B]">
            Available in {category.name} ({categoryProducts.length})
          </h2>
          <button
            onClick={() => navigate('/shop')}
            className="text-xs font-semibold text-[#C59B27] hover:underline"
          >
            Explore Other Categories &rarr;
          </button>
        </div>

        {categoryProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#2D1810]/10">
            <p className="text-sm text-[#3E2723]/70">
              No products are currently available in this category. Check back soon for fresh batches!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                navigate={navigate}
                index={idx}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
