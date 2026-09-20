import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, CheckCircle2, XCircle, Trash2, ShieldCheck } from 'lucide-react';

export const AdminReviews: React.FC = () => {
  const { reviews, approveReview, deleteReview, products, showToast } = useStore();

  const handleApprove = (id: string, name: string) => {
    approveReview(id);
    showToast('Review Approved', `Patron review by ${name} is now publicly visible`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this customer review?')) {
      deleteReview(id);
      showToast('Review Removed', 'Review was deleted from store');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-[#2D1810]/10 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#23120B]">
            Patron Reviews &amp; Testimonials ({reviews.length})
          </h3>
          <p className="text-xs text-[#3E2723]/60">
            Moderate feedback from real dessert lovers before publishing.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reviews.map((rev) => {
          const product = products.find((p) => p.id === rev.productId);
          return (
            <div
              key={rev.id}
              className="bg-white rounded-3xl p-6 border border-[#2D1810]/10 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#C59B27]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating ? 'fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      rev.approved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {rev.approved ? 'Approved & Public' : 'Pending Approval'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#3E2723] italic leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-[#2D1810]/5 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-[#23120B] flex items-center gap-1">
                      <span>{rev.customerName}</span>
                      {rev.verified && (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      )}
                    </p>
                    {product && (
                      <p className="text-[11px] text-[#C59B27] mt-0.5">
                        For: {product.name}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-[#3E2723]/60">
                    {new Date(rev.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#2D1810]/10 flex items-center justify-end gap-2">
                {!rev.approved && (
                  <button
                    onClick={() => handleApprove(rev.id, rev.customerName)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                <button
                  onClick={() => handleDelete(rev.id)}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
