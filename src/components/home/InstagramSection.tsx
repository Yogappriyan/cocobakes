import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Instagram, ExternalLink } from 'lucide-react';

export const InstagramSection: React.FC = () => {
  const { siteSettings } = useStore();

  const instaPhotos = [
    {
      url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80',
      caption: 'Warm Ferrero Rocher Brownie straight from the oven #VelvetCocoa',
    },
    {
      url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80',
      caption: 'Mirror ganache finish on our Belgian dark truffle cake #Patisserie',
    },
    {
      url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=500&q=80',
      caption: 'Molten chocolate pools and Maldon sea salt flakes #NYCCookies',
    },
    {
      url: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=500&q=80',
      caption: 'Hand-rolled Valrhona truffles dusted in pure cocoa #Chocolatier',
    },
    {
      url: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&q=80',
      caption: 'Satin gold ribbons ready for luxury gifting hampers #Celebration',
    },
  ];

  return (
    <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#C59B27] mb-2">
          <Instagram className="w-4 h-4" />
          <span>Follow Our Sweet Journey</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B]">
          Fresh From Our Atelier Kitchen
        </h2>
        <p className="text-xs sm:text-sm text-[#3E2723]/70 mt-1">
          Tag <span className="font-bold text-[#23120B]">{siteSettings.instagramHandle}</span> on your dessert stories to be featured.
        </p>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {instaPhotos.map((photo, index) => (
          <a
            key={index}
            href={siteSettings.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative rounded-xl overflow-hidden aspect-square shadow-2xs border border-[#2D1810]/10 cursor-pointer"
          >
            <img
              src={photo.url}
              alt="Bakery moment"
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
            />
            {/* Scrim on hover */}
            <div className="absolute inset-0 bg-[#23120B]/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-white text-center">
              <Instagram className="w-6 h-6 text-[#DFB15B] mb-2" />
              <p className="text-[11px] leading-tight line-clamp-2 text-white/90">{photo.caption}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 text-center">
        <a
          href={siteSettings.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-[#2D1810]/15 text-xs font-semibold text-[#23120B] hover:bg-[#23120B] hover:text-white transition-colors shadow-2xs"
        >
          <Instagram className="w-4 h-4 text-[#C59B27]" />
          <span>Follow {siteSettings.instagramHandle}</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-60" />
        </a>
      </div>
    </section>
  );
};
