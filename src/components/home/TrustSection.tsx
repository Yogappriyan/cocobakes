import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Sparkles, ShieldCheck, Leaf, Truck, CreditCard, HeartHandshake } from 'lucide-react';

export const TrustSection: React.FC = () => {
  const { trustItems } = useStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#C59B27]" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-[#C59B27]" />;
      case 'Leaf':
        return <Leaf className="w-5 h-5 text-[#C59B27]" />;
      case 'Truck':
        return <Truck className="w-5 h-5 text-[#C59B27]" />;
      case 'CreditCard':
        return <CreditCard className="w-5 h-5 text-[#C59B27]" />;
      default:
        return <HeartHandshake className="w-5 h-5 text-[#C59B27]" />;
    }
  };

  return (
    <section className="border-y border-[#2D1810]/10 bg-[#FAF7F2]/60 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {trustItems.map((item) => (
            <div key={item.id} className="flex items-start gap-3">
              <div className="p-2 rounded-xl bg-[#EADBC8]/40 shrink-0">
                {getIcon(item.icon)}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#23120B] leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-[#3E2723]/70 mt-0.5 leading-snug">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
