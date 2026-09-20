import React from 'react';
import { useStore } from '../context/StoreContext';
import { Sparkles, Heart, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface AboutPageProps {
  navigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate }) => {
  const { siteSettings } = useStore();

  return (
    <div className="py-12 sm:py-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADBC8]/50 text-[#C59B27] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Heritage</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#23120B]">
          The Art of Pure Couverture
        </h1>
        <p className="text-sm sm:text-base text-[#3E2723]/80 leading-relaxed">
          Born out of an intense obsession with single-origin cocoa, French cultured butter, and the pursuit of the ultimate gooey chocolate brownie.
        </p>
      </div>

      {/* Narrative Section 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="rounded-3xl overflow-hidden aspect-4/3 shadow-xl border-4 border-white">
          <img
            src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80"
            alt="Tempering Callebaut chocolate"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27]">
            The Atelier Origin
          </span>
          <h2 className="font-serif text-3xl font-bold text-[#23120B]">
            Why We Never Use Compound Chocolate
          </h2>
          <p className="text-xs sm:text-sm text-[#3E2723]/80 leading-relaxed">
            Most commercial bakeries replace pure cocoa butter with palm oil and hydrogenated fats to cut costs and extend shelf life. At {siteSettings.brandName}, we believe that robs chocolate of its soul.
          </p>
          <p className="text-xs sm:text-sm text-[#3E2723]/80 leading-relaxed">
            True couverture melts at body temperature (34°C - 36°C), releasing delicate notes of roasted hazelnut, red berries, and earthy bourbon vanilla on your tongue. When you bite into our brownies, you taste authentic Belgian craft, not artificial sugar.
          </p>
        </div>
      </div>

      {/* 3 Core Commitments */}
      <div className="bg-[#FAF7F2] rounded-3xl p-8 sm:p-12 border border-[#2D1810]/10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#23120B] text-[#DFB15B] flex items-center justify-center font-bold">
            01
          </div>
          <h3 className="font-serif text-lg font-bold text-[#23120B]">Micro-Batch Precision</h3>
          <p className="text-xs text-[#3E2723]/70 leading-relaxed">
            We bake in small pans rather than industrial trays. This gives every piece an even crust and a moist, fudgy center.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#23120B] text-[#DFB15B] flex items-center justify-center font-bold">
            02
          </div>
          <h3 className="font-serif text-lg font-bold text-[#23120B]">Zero Preservatives</h3>
          <p className="text-xs text-[#3E2723]/70 leading-relaxed">
            No chemical humectants, artificial stabilizers, or dough conditioners. Just pure eggs, real cream, and cocoa.
          </p>
        </div>

        <div className="space-y-2">
          <div className="w-10 h-10 rounded-xl bg-[#23120B] text-[#DFB15B] flex items-center justify-center font-bold">
            03
          </div>
          <h3 className="font-serif text-lg font-bold text-[#23120B]">Same-Day Baking</h3>
          <p className="text-xs text-[#3E2723]/70 leading-relaxed">
            Orders are baked fresh on the day of dispatch so you experience the intoxicating aroma of warm chocolate.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-6">
        <button
          onClick={() => navigate('/shop')}
          className="px-8 py-4 bg-[#23120B] hover:bg-[#C59B27] text-white font-bold text-sm rounded-full shadow-lg transition-colors"
        >
          Taste the Craftsmanship &rarr;
        </button>
      </div>
    </div>
  );
};
