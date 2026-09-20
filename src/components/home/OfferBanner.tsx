import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

interface OfferBannerProps {
  navigate: (path: string) => void;
}

export const OfferBanner: React.FC<OfferBannerProps> = ({ navigate }) => {
  const { offers } = useStore();
  const activeOffer = offers.find((o) => o.active);

  if (!activeOffer) return null;

  return (
    <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-r from-[#23120B] via-[#3E2723] to-[#23120B] p-6 sm:p-10 overflow-hidden shadow-xl border border-[#C59B27]/40 text-[#FAF7F2]">
        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-[#C59B27]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DFB15B]/20 border border-[#DFB15B]/30 text-[#DFB15B] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{activeOffer.badgeText || 'Special Celebration'}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FDFBF7]">
              {activeOffer.title}
            </h3>

            <p className="text-xs sm:text-sm text-[#EADBC8]/90">
              {activeOffer.subtitle}
            </p>

            {activeOffer.discountCode && (
              <div className="inline-block mt-2 px-3.5 py-1.5 bg-[#FAF7F2]/10 border border-[#FAF7F2]/20 rounded-lg text-xs font-mono font-bold tracking-widest text-[#DFB15B]">
                USE CODE: {activeOffer.discountCode}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(activeOffer.link || '/shop')}
            className="shrink-0 px-7 py-3.5 bg-[#C59B27] hover:bg-[#DFB15B] text-[#23120B] font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all duration-300 flex items-center gap-2 group"
          >
            <span>Claim Offer</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
