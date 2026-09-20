import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/product/ProductCard';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';

interface WishlistPageProps {
  navigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ navigate }) => {
  const { wishlistIds, products } = useStore();

  const favoriteProducts = products.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-md mx-auto mb-10">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6 fill-current" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B]">
          Your Tasting Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-[#3E2723]/70 mt-1">
          Saved delicacies for future celebrations, birthdays, and dessert cravings.
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#2D1810]/10 max-w-md mx-auto shadow-xs">
          <div className="w-16 h-16 rounded-full bg-[#EADBC8]/40 flex items-center justify-center mx-auto text-2xl mb-4">
            🍫
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#23120B]">No Saved Items Yet</h3>
          <p className="text-xs sm:text-sm text-[#3E2723]/70 mt-2 mb-6">
            Tap the heart icon on any brownie or cake to save it to your personal wishlist.
          </p>
          <button
            onClick={() => navigate('/shop')}
            className="px-6 py-3 bg-[#23120B] hover:bg-[#C59B27] text-white rounded-full text-xs font-bold transition-colors shadow-xs"
          >
            Explore Atelier Delights
          </button>
        </div>
      ) : (
        <div>
          <p className="text-xs text-[#3E2723]/70 mb-6">
            Showing <span className="font-bold text-[#23120B]">{favoriteProducts.length}</span> saved item{favoriteProducts.length > 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {favoriteProducts.map((p, idx) => (
              <ProductCard key={p.id} product={p} navigate={navigate} index={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
