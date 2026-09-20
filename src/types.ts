export interface ProductVariant {
  id: string;
  name: string; // e.g. "4 Pieces", "6 Pieces", "Box of 9", "12 Pieces"
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  inStock?: boolean;
  weight?: string; // e.g. "250g", "500g"
}

export interface ProductAddon {
  id: string;
  name: string;
  price: number;
  description?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  categorySlug?: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  stock: number;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  lowStockThreshold: number;
  weight: string;
  ingredients: string[];
  allergens: string[];
  prepTime: string; // e.g. "2-4 hours fresh baked"
  images: string[];
  thumbnail: string;
  badge?: 'bestseller' | 'new' | 'trending' | 'limited' | 'sale';
  variants: ProductVariant[];
  addons: ProductAddon[];
  flavours?: string[];
  status: 'active' | 'draft' | 'out_of_stock' | 'archived';
  active?: boolean;
  rating: number;
  reviewCount: number;
  seoTitle?: string;
  seoDescription?: string;
  tags: string[];
  featured?: boolean;
  eggless?: boolean;
  isEggless?: boolean;
  glutenFree?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  displayOrder: number;
  status: 'active' | 'inactive';
  productCount?: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  selectedFlavour?: string;
  selectedAddons: ProductAddon[];
  customMessage?: string;
  unitPrice: number;
  totalPrice: number;
}

export interface DeliveryAddress {
  id?: string;
  fullName: string;
  phone: string;
  email?: string;
  addressLine?: string;
  houseFlat?: string;
  street?: string;
  area?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'razorpay' | 'cod' | 'card' | 'upi' | 'netbanking';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  thumbnail: string;
  image?: string;
  variantName?: string;
  flavour?: string;
  selectedFlavour?: string;
  addons?: string[];
  selectedAddons?: string[];
  customMessage?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  customer?: {
    fullName: string;
    email: string;
    phone: string;
  };
  address?: DeliveryAddress;
  shippingAddress?: any;
  items: OrderItem[];
  subtotal?: number;
  discount?: number;
  couponCode?: string;
  deliveryType?: string;
  deliveryOption?: {
    id: string;
    name: string;
    price: number;
    estimatedDelivery: string;
  };
  deliveryFee?: number;
  tax?: number;
  total?: number;
  totalAmount?: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  internalNotes?: string;
  notes?: string;
  specialInstructions?: string;
  timeline: {
    status: OrderStatus;
    label: string;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  startDate?: string;
  expiryDate?: string;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  applicableCategories?: string[]; // category IDs or empty for all
  applicableProducts?: string[]; // product IDs or empty for all
  active: boolean;
}

export interface Review {
  id: string;
  productId: string;
  productName?: string;
  customerName: string;
  customerEmail?: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  verifiedPurchase?: boolean;
  verified?: boolean;
  status: 'approved' | 'pending' | 'rejected' | 'hidden';
  approved?: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  avatar: string;
  rating: number;
  comment: string;
  location?: string;
  active: boolean;
}

export interface Offer {
  id: string;
  title: string;
  subtitle: string;
  badgeText: string;
  badge?: string;
  discountCode?: string;
  couponCode?: string;
  discountText: string;
  bannerImage?: string;
  bgGradient?: string;
  link: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export type OfferBanner = Offer;

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  image: string;
  active: boolean;
  position: number;
}

export interface TrustItem {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  subject?: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface Customer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate?: string;
  addresses?: DeliveryAddress[];
  createdAt: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  description: string;
  logo: string;
  favicon?: string;
  primaryColor: string; // e.g. #23120B
  secondaryColor: string; // e.g. #C59B27
  accentColor: string;
  bgColor: string; // e.g. #FAF7F2
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  address: string;
  businessHours: string;
  instagramHandle: string;
  instagramUrl: string;
  facebookUrl?: string;
  currencySymbol: string;
  currencyCode: string;
  taxRatePercent: number;
  defaultDeliveryFee: number;
  freeDeliveryThreshold: number;
  expressDeliveryFee: number;
  sameDayDeliveryFee: number;
  enableCod: boolean;
  codAvailable?: boolean;
  enableRazorpay: boolean;
  razorpayKeyId: string;
  pincodesServiced: string[];
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  announcementBarText?: string;
  announcementBarActive: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'customer' | 'admin';
  savedAddresses: DeliveryAddress[];
}
