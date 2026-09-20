import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { TrustSection } from '../components/home/TrustSection';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { OfferBanner } from '../components/home/OfferBanner';
import { StorySection } from '../components/home/StorySection';
import { TestimonialSection } from '../components/home/TestimonialSection';
import { InstagramSection } from '../components/home/InstagramSection';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  return (
    <div className="space-y-4">
      <HeroSection navigate={navigate} />
      <TrustSection />
      <CategorySection navigate={navigate} />
      <FeaturedSection navigate={navigate} />
      <OfferBanner navigate={navigate} />
      <StorySection navigate={navigate} />
      <TestimonialSection />
      <InstagramSection />
    </div>
  );
};
