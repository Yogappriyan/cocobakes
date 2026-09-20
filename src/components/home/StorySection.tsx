import React from 'react';
import { Sparkles, Heart, CheckCircle2 } from 'lucide-react';

interface StorySectionProps {
  navigate: (path: string) => void;
}

export const StorySection: React.FC<StorySectionProps> = ({ navigate }) => {
  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Visual collage */}
        <div className="lg:col-span-6 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none">
            <div className="relative rounded-3xl overflow-hidden aspect-4/3 shadow-2xl border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1000&q=80"
                alt="Chocolatier crafting molten ganache"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Inset Secondary Image */}
            <div className="hidden sm:block absolute -bottom-8 -right-6 w-56 h-56 rounded-2xl overflow-hidden shadow-xl border-4 border-[#FAF7F2]">
              <img
                src="https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=600&q=80"
                alt="Raw cocoa and pure butter"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Experience Tag */}
            <div className="absolute top-6 -left-4 bg-[#23120B] text-[#DFB15B] p-4 rounded-2xl shadow-xl border border-[#C59B27]/30 max-w-[160px]">
              <div className="font-serif text-3xl font-bold">100%</div>
              <div className="text-[11px] text-[#FAF7F2]/80 leading-tight mt-0.5">
                Single-origin traceable cocoa bean butter
              </div>
            </div>
          </div>
        </div>

        {/* Right Story Content */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EADBC8]/50 text-[#C59B27] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Atelier Story</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#23120B] leading-tight">
            Obsessively Handcrafted. Zero Compromises.
          </h2>

          <p className="text-sm sm:text-base text-[#3E2723]/80 leading-relaxed font-normal">
            Velvet Cocoa was founded on a simple, unapologetic principle: real chocolate desserts should taste intensely decadent, buttery, and memorable. We don’t use compound chocolates, palm oils, or artificial emulsifiers.
          </p>

          <p className="text-sm sm:text-base text-[#3E2723]/80 leading-relaxed font-normal">
            Every morning before dawn, our master pâtissiers melt pure Belgian Callebaut couverture with Normandy-style cultured butter. The batter is folded gently in micro-batches to preserve the silky air pockets that give our brownies their signature paper-thin crackle and gooey molten core.
          </p>

          {/* Pillars List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
            {[
              'Slow-baked small batch production',
              'Pure French unsalted creamery butter',
              'Traceable single-origin dark cocoa',
              'Bespoke gift packaging with satin ribbons',
            ].map((pillar) => (
              <div key={pillar} className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C59B27] shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-[#23120B]">{pillar}</span>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => navigate('/about')}
              className="px-7 py-3 bg-[#23120B] hover:bg-[#C59B27] text-[#FAF7F2] text-xs sm:text-sm font-semibold rounded-full shadow-md transition-all duration-300"
            >
              Read Our Full Journey &rarr;
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
