import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const TestimonialSection: React.FC = () => {
  const { testimonials } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeTestimonials = testimonials.filter((t) => t.active);

  if (activeTestimonials.length === 0) return null;

  const prev = () => {
    setCurrentIndex((i) => (i === 0 ? activeTestimonials.length - 1 : i - 1));
  };

  const next = () => {
    setCurrentIndex((i) => (i === activeTestimonials.length - 1 ? 0 : i + 1));
  };

  const current = activeTestimonials[currentIndex];

  return (
    <section className="py-16 sm:py-24 bg-[#F5EFEB] border-y border-[#2D1810]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[#EADBC8] text-[#C59B27] flex items-center justify-center mx-auto mb-6">
          <Quote className="w-6 h-6 fill-[#C59B27]" />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-[#C59B27] mb-2 block">
          Patron Praise
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B] mb-8">
          Words from Fellow Chocolate Devotees
        </h2>

        {/* Carousel card */}
        <div className="relative bg-white rounded-3xl p-8 sm:p-12 shadow-xl border border-[#2D1810]/5 transition-all duration-300">
          {/* Star rating */}
          <div className="flex justify-center gap-1 mb-6">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#C59B27] text-[#C59B27]" />
            ))}
          </div>

          <p className="font-serif text-lg sm:text-2xl text-[#23120B] italic leading-relaxed mb-8">
            "{current.comment}"
          </p>

          <div className="flex items-center justify-center gap-4">
            <img
              src={current.avatar}
              alt={current.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-[#C59B27]"
            />
            <div className="text-left">
              <h4 className="font-bold text-sm text-[#23120B]">{current.name}</h4>
              <p className="text-xs text-[#3E2723]/60">
                {current.role ? `${current.role} • ` : ''}{current.location || 'Bangalore'}
              </p>
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex items-center justify-center gap-3 mt-8 pt-4 border-t border-[#2D1810]/5">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-[#2D1810]/20 hover:bg-[#23120B] hover:text-white transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-1.5">
              {activeTestimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    idx === currentIndex ? 'w-6 bg-[#C59B27]' : 'w-2 bg-[#D8C4B6]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full border border-[#2D1810]/20 hover:bg-[#23120B] hover:text-white transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
