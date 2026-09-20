import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, RotateCcw, FileText } from 'lucide-react';

interface PolicyPageProps {
  type: 'privacy' | 'terms' | 'refund' | 'shipping';
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ type }) => {
  const { siteSettings } = useStore();

  const contentMap = {
    privacy: {
      title: 'Privacy Policy',
      icon: ShieldCheck,
      updated: 'September 2026',
      sections: [
        {
          heading: '1. Information We Collect',
          body: 'We collect your name, delivery address, phone number, and email address strictly to bake, dispatch, and fulfill your dessert orders. We do not store full credit card or banking credentials; all online transactions are processed through PCI-DSS certified gateways (Razorpay).',
        },
        {
          heading: '2. How Your Data is Protected',
          body: 'Your personal information is encrypted and never sold or traded to third-party advertisers. Delivery personnel receive only the necessary contact details required to hand over your parcel.',
        },
        {
          heading: '3. Order Communications',
          body: 'We may send transactional SMS, WhatsApp status updates, and email invoices related to your active order.',
        },
      ],
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      updated: 'September 2026',
      sections: [
        {
          heading: '1. Artisanal Nature of Products',
          body: 'All brownies, celebration cakes, and truffles are handcrafted in artisanal micro-batches. Slight natural variations in crust cracking, drizzle patterns, and decoration may occur.',
        },
        {
          heading: '2. Pricing & Payments',
          body: 'All prices are listed in Indian Rupees (INR) and include applicable taxes (GST). Prices may be adjusted without prior notice.',
        },
        {
          heading: '3. Fresh Delivery Protocol',
          body: 'Customers must ensure a recipient is available at the provided delivery address to receive refrigerated items. If unreachable, couriers will wait a maximum of 15 minutes before re-routing.',
        },
      ],
    },
    refund: {
      title: 'Refund & Cancellation Policy',
      icon: RotateCcw,
      updated: 'September 2026',
      sections: [
        {
          heading: '1. Perishable Goods Cancellation',
          body: 'Because our confectioneries are freshly baked upon order, cancellations must be requested within 30 minutes of placing the order before baking begins.',
        },
        {
          heading: '2. Damaged or Incorrect Deliveries',
          body: 'If your parcel arrives damaged in transit or differs from your order, please notify our concierge via WhatsApp with clear photographs within 2 hours of delivery for an immediate fresh bake replacement or full refund.',
        },
        {
          heading: '3. Refund Turnaround',
          body: 'Approved refunds are credited back to the original payment source within 3-5 business days.',
        },
      ],
    },
    shipping: {
      title: 'Shipping & Freshness Policy',
      icon: Truck,
      updated: 'September 2026',
      sections: [
        {
          heading: '1. Temperature Controlled Packaging',
          body: 'All desserts are packed in insulated food-grade containers with chill packs to preserve moisture and ganache consistency during transit.',
        },
        {
          heading: '2. Express & Same-Day Slots',
          body: 'Orders placed before 5:00 PM are eligible for same-day delivery. Priority 2-Hour delivery is dispatched immediately from the central atelier kitchen.',
        },
        {
          heading: '3. Free Delivery Threshold',
          body: `Orders above ${siteSettings.currencySymbol}${siteSettings.freeDeliveryThreshold} receive complimentary delivery within city limits.`,
        },
      ],
    },
  };

  const current = contentMap[type] || contentMap.privacy;
  const Icon = current.icon;

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-[#EADBC8]/40 text-[#C59B27] flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#23120B]">
          {current.title}
        </h1>
        <p className="text-xs text-[#3E2723]/60 mt-1">
          Last updated: {current.updated} • {siteSettings.brandName}
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#2D1810]/10 shadow-xs space-y-8 text-xs sm:text-sm text-[#3E2723]/80 leading-relaxed">
        {current.sections.map((section, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="font-serif text-lg font-bold text-[#23120B]">
              {section.heading}
            </h3>
            <p>{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
