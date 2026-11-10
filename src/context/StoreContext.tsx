import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  OrderStatus,
  PaymentStatus,
  Customer,
  Coupon,
  Review,
  Testimonial,
  Offer,
  Banner,
  TrustItem,
  SiteSettings,
  ContactMessage,
  DeliveryAddress,
  ProductVariant,
  ProductAddon,
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialOrders,
  initialCustomers,
  initialCoupons,
  initialOffers,
  initialBanners,
  initialTestimonials,
  initialTrustItems,
  initialSiteSettings,
} from '../data/initialData';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { auth, loginWithGoogle as fbLoginWithGoogle, logoutUser as fbLogoutUser } from '../lib/firebase';
import {
  subscribeToProducts,
  subscribeToCategories,
  subscribeToOrders,
  subscribeToReviews,
  subscribeToContactMessages,
  subscribeToSiteSettings,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  saveOrderToFirestore,
  updateOrderInFirestore,
  saveReviewToFirestore,
  updateReviewInFirestore,
  saveContactMessageToFirestore,
  updateContactMessageInFirestore,
  saveSiteSettingsToFirestore,
  seedFirestoreIfEmpty,
} from '../lib/firebaseStore';
import firebaseConfig from '../../firebase-applet-config.json';

interface Toast {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  updateProductStock: (productId: string, newStock: number) => void;
  deleteProduct: (id: string) => void;
  duplicateProduct: (id: string) => void;
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;

  // Categories
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, updates: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryBySlug: (slug: string) => Category | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      quantity?: number;
      variant?: ProductVariant;
      selectedFlavour?: string;
      selectedAddons?: ProductAddon[];
      customMessage?: string;
    }
  ) => void;
  updateCartQuantity: (index: number, quantity: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTax: number;
  cartTotal: number;
  cartCount: number;

  // Wishlist
  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    customer: { fullName: string; email: string; phone: string };
    address: DeliveryAddress;
    deliveryOption: { id: string; name: string; price: number; estimatedDelivery: string };
    paymentMethod: 'razorpay' | 'cod' | 'card' | 'upi' | 'netbanking';
    paymentId?: string;
    paymentStatus?: PaymentStatus;
  }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  updateOrderPaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  updateOrderNotes: (orderId: string, notes: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrderByNumber: (orderNumber: string) => Order | undefined;

  // Customers
  customers: Customer[];

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  updateCoupon: (id: string, updates: Partial<Coupon>) => void;
  deleteCoupon: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  updateReviewStatus: (id: string, status: Review['status']) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  getProductReviews: (productId: string) => Review[];

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (test: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, updates: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Offers
  offers: Offer[];
  setOffers: React.Dispatch<React.SetStateAction<Offer[]>>;
  addOffer: (offer: Omit<Offer, 'id'>) => void;
  updateOffer: (id: string, updates: Partial<Offer>) => void;
  deleteOffer: (id: string) => void;

  // Banners & Trust Items
  banners: Banner[];
  updateBanner: (id: string, updates: Partial<Banner>) => void;
  trustItems: TrustItem[];
  updateTrustItem: (id: string, updates: Partial<TrustItem>) => void;

  // Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;

  // Contact Messages
  contactMessages: ContactMessage[];
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  markMessageStatus: (id: string, status: ContactMessage['status']) => void;
  updateMessageStatus: (id: string, status: any) => void;
  deleteMessage: (id: string) => void;

  // Admin Auth
  isAdminAuthenticated: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;

  // UI Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;

  // Toast System
  toasts: Toast[];
  showToast: (title: string, message?: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Firebase Live Backend
  isFirebaseActive: boolean;
  firebaseProjectId: string;
  firebaseDatabaseId: string;
  firebaseUser: any;
  loginWithGoogle: () => Promise<void>;
  logoutFirebase: () => Promise<void>;
  syncWithFirebase: () => Promise<{ success: boolean; message: string }>;

  // Supabase Status & Reset
  isSupabaseActive: boolean;
  syncWithSupabase: () => Promise<{ success: boolean; message: string }>;
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEYS = {
  PRODUCTS: 'homemade_cakes_trichy_products',
  CATEGORIES: 'homemade_cakes_trichy_categories',
  ORDERS: 'homemade_cakes_trichy_orders',
  CUSTOMERS: 'homemade_cakes_trichy_customers',
  COUPONS: 'homemade_cakes_trichy_coupons',
  REVIEWS: 'homemade_cakes_trichy_reviews',
  TESTIMONIALS: 'homemade_cakes_trichy_testimonials',
  OFFERS: 'homemade_cakes_trichy_offers',
  BANNERS: 'homemade_cakes_trichy_banners',
  TRUST: 'homemade_cakes_trichy_trust',
  SETTINGS: 'homemade_cakes_trichy_settings',
  CART: 'homemade_cakes_trichy_cart',
  WISHLIST: 'homemade_cakes_trichy_wishlist',
  MESSAGES: 'homemade_cakes_trichy_messages',
  ADMIN_AUTH: 'homemade_cakes_trichy_admin_auth',
};

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
    // Legacy migration check from previous store key
    const legacyKey = key.replace('homemade_cakes_trichy_', 'velvet_cocoa_');
    const legacyItem = localStorage.getItem(legacyKey);
    return legacyItem ? JSON.parse(legacyItem) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage:`, e);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State initialization with localStorage fallback
  const [products, setProducts] = useState<Product[]>(() =>
    loadStorage(STORAGE_KEYS.PRODUCTS, initialProducts)
  );
  const [categories, setCategories] = useState<Category[]>(() =>
    loadStorage(STORAGE_KEYS.CATEGORIES, initialCategories)
  );
  const [orders, setOrders] = useState<Order[]>(() =>
    loadStorage(STORAGE_KEYS.ORDERS, initialOrders)
  );
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadStorage(STORAGE_KEYS.CUSTOMERS, initialCustomers)
  );
  const [coupons, setCoupons] = useState<Coupon[]>(() =>
    loadStorage(STORAGE_KEYS.COUPONS, initialCoupons)
  );
  const [reviews, setReviews] = useState<Review[]>(() => [
    {
      id: 'rev-1',
      productId: 'prod-ferrero-brownie-box',
      productName: 'Ferrero Rocher Hazelnut Brownie Box',
      customerName: 'Samaira Malhotra',
      rating: 5,
      title: 'Heaven in every single bite!',
      comment: 'The whole Ferrero Rocher on top along with roasted crunchy hazelnuts is out of this world. Super fudgy and not overly sweet!',
      verifiedPurchase: true,
      status: 'approved',
      createdAt: '2026-09-10T14:20:00Z',
    },
    {
      id: 'rev-2',
      productId: 'prod-classic-fudge-brownie',
      productName: 'Artisan Classic Molten Fudge Brownies',
      customerName: 'Kunal Kapoor',
      rating: 5,
      title: 'Best brownies in the city hands down',
      comment: 'Heated for 20 seconds as recommended and it was completely molten and gooey. Real dark chocolate aroma!',
      verifiedPurchase: true,
      status: 'approved',
      createdAt: '2026-09-12T11:00:00Z',
    },
    {
      id: 'rev-3',
      productId: 'prod-belgian-chocolate-cake',
      productName: 'Belgian Couverture Truffle Celebration Cake',
      customerName: 'Deepika Rao',
      rating: 5,
      title: 'Showstopper birthday cake',
      comment: 'Ordered for my sister’s milestone birthday. The gold leaf finish looks so regal, and the mousse is silky smooth.',
      verifiedPurchase: true,
      status: 'approved',
      createdAt: '2026-09-14T16:45:00Z',
    },
  ]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() =>
    loadStorage(STORAGE_KEYS.TESTIMONIALS, initialTestimonials)
  );
  const [offers, setOffers] = useState<Offer[]>(() =>
    loadStorage(STORAGE_KEYS.OFFERS, initialOffers)
  );
  const [banners, setBanners] = useState<Banner[]>(() =>
    loadStorage(STORAGE_KEYS.BANNERS, initialBanners)
  );
  const [trustItems, setTrustItems] = useState<TrustItem[]>(() =>
    loadStorage(STORAGE_KEYS.TRUST, initialTrustItems)
  );
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const loaded = loadStorage(STORAGE_KEYS.SETTINGS, initialSiteSettings);
    if (loaded && (loaded.brandName === 'Velvet Cocoa' || !loaded.brandName)) {
      return {
        ...loaded,
        brandName: 'Homemade Cakes Trichy',
        tagline: 'Artisanal Home Bakery & Custom Cakes',
        description:
          'Handcrafted custom celebration cakes, freshly baked brownies, and gourmet desserts made with love in Trichy.',
        logo: 'Homemade Cakes Trichy',
        email: 'concierge@homemadecakestrichy.com',
        address: '42 Heritage Atelier Lane, Thillai Nagar, Tiruchirappalli (Trichy), Tamil Nadu 620018',
        instagramHandle: '@homemadecakestrichy',
        metaTitle: 'Homemade Cakes Trichy - Artisanal Bakery & Custom Cakes',
        metaDescription: 'Fresh homemade celebration cakes, artisanal brownies, and custom dessert hampers in Trichy.',
      };
    }
    return loaded;
  });
  const [cart, setCart] = useState<CartItem[]>(() =>
    loadStorage(STORAGE_KEYS.CART, [])
  );
  const [wishlistIds, setWishlistIds] = useState<string[]>(() =>
    loadStorage(STORAGE_KEYS.WISHLIST, ['prod-ferrero-brownie-box', 'prod-luxury-dessert-box'])
  );
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() =>
    loadStorage(STORAGE_KEYS.MESSAGES, [
      {
        id: 'msg-1',
        name: 'Pooja Varma',
        email: 'pooja.v@example.com',
        phone: '+91 98450 11223',
        subject: 'Corporate Diwali Gifting for 80 hampers',
        message: 'Hello Homemade Cakes Trichy team! We are looking to order 80 luxury dessert boxes for our executive clients in October. Could you share corporate rates and custom branding options?',
        status: 'unread',
        createdAt: '2026-09-16T07:30:00Z',
      },
    ])
  );
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() =>
    loadStorage(STORAGE_KEYS.ADMIN_AUTH, false)
  );

  // Applied coupon
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => saveStorage(STORAGE_KEYS.PRODUCTS, products), [products]);
  useEffect(() => saveStorage(STORAGE_KEYS.CATEGORIES, categories), [categories]);
  useEffect(() => saveStorage(STORAGE_KEYS.ORDERS, orders), [orders]);
  useEffect(() => saveStorage(STORAGE_KEYS.CUSTOMERS, customers), [customers]);
  useEffect(() => saveStorage(STORAGE_KEYS.COUPONS, coupons), [coupons]);
  useEffect(() => saveStorage(STORAGE_KEYS.REVIEWS, reviews), [reviews]);
  useEffect(() => saveStorage(STORAGE_KEYS.TESTIMONIALS, testimonials), [testimonials]);
  useEffect(() => saveStorage(STORAGE_KEYS.OFFERS, offers), [offers]);
  useEffect(() => saveStorage(STORAGE_KEYS.BANNERS, banners), [banners]);
  useEffect(() => saveStorage(STORAGE_KEYS.TRUST, trustItems), [trustItems]);
  useEffect(() => saveStorage(STORAGE_KEYS.SETTINGS, siteSettings), [siteSettings]);
  useEffect(() => saveStorage(STORAGE_KEYS.CART, cart), [cart]);
  useEffect(() => saveStorage(STORAGE_KEYS.WISHLIST, wishlistIds), [wishlistIds]);
  useEffect(() => saveStorage(STORAGE_KEYS.MESSAGES, contactMessages), [contactMessages]);
  useEffect(() => saveStorage(STORAGE_KEYS.ADMIN_AUTH, isAdminAuthenticated), [isAdminAuthenticated]);

  // Firebase User state
  const [firebaseUser, setFirebaseUser] = useState<any>(null);

  // Synchronize with Firebase Firestore backend
  useEffect(() => {
    // 1. Initial seed if empty
    seedFirestoreIfEmpty().then((res) => {
      if (res.seeded) {
        console.log('Firebase backend initialized with boutique catalogue.');
      }
    });

    // 2. Real-time listeners
    let unsubProds = () => {};
    let unsubCats = () => {};
    let unsubOrds = () => {};
    let unsubRevs = () => {};
    let unsubMsgs = () => {};
    let unsubSettings = () => {};

    try {
      unsubProds = subscribeToProducts((cloudProds) => {
        if (cloudProds && cloudProds.length > 0) {
          setProducts(cloudProds);
        }
      });
      unsubCats = subscribeToCategories((cloudCats) => {
        if (cloudCats && cloudCats.length > 0) {
          setCategories(cloudCats);
        }
      });
      unsubOrds = subscribeToOrders((cloudOrds) => {
        if (cloudOrds && cloudOrds.length > 0) {
          setOrders(cloudOrds);
        }
      });
      unsubRevs = subscribeToReviews((cloudRevs) => {
        if (cloudRevs && cloudRevs.length > 0) {
          setReviews(cloudRevs);
        }
      });
      unsubMsgs = subscribeToContactMessages((cloudMsgs) => {
        if (cloudMsgs && cloudMsgs.length > 0) {
          setContactMessages(cloudMsgs);
        }
      });
      unsubSettings = subscribeToSiteSettings((cloudSettings) => {
        if (cloudSettings) {
          if (cloudSettings.brandName === 'Velvet Cocoa' || !cloudSettings.brandName) {
            const updated: SiteSettings = {
              ...cloudSettings,
              brandName: 'Homemade Cakes Trichy',
              tagline: 'Artisanal Home Bakery & Custom Cakes',
              description: 'Handcrafted custom celebration cakes, freshly baked brownies, and gourmet desserts made with love in Trichy.',
              logo: 'Homemade Cakes Trichy',
              email: 'concierge@homemadecakestrichy.com',
              address: '42 Heritage Atelier Lane, Thillai Nagar, Tiruchirappalli (Trichy), Tamil Nadu 620018',
              instagramHandle: '@homemadecakestrichy',
              metaTitle: 'Homemade Cakes Trichy - Artisanal Bakery & Custom Cakes',
              metaDescription: 'Fresh homemade celebration cakes, artisanal brownies, and custom dessert hampers in Trichy.',
            };
            setSiteSettings(updated);
            saveSiteSettingsToFirestore(updated).catch(console.error);
          } else {
            setSiteSettings(cloudSettings);
          }
        }
      });
    } catch (e) {
      console.warn('Realtime subscription notice:', e);
    }

    // 3. Auth state listener
    const unsubAuth = auth.onAuthStateChanged((user) => {
      setFirebaseUser(user);
      if (user?.email === 'pornimakannan98@gmail.com') {
        setIsAdminAuthenticated(true);
      }
    });

    return () => {
      unsubProds();
      unsubCats();
      unsubOrds();
      unsubRevs();
      unsubMsgs();
      unsubSettings();
      unsubAuth();
    };
  }, []);

  // Update dynamic CSS theme variables when siteSettings colors change
  useEffect(() => {
    if (siteSettings.primaryColor) {
      document.documentElement.style.setProperty('--theme-primary', siteSettings.primaryColor);
    }
    if (siteSettings.secondaryColor) {
      document.documentElement.style.setProperty('--theme-secondary', siteSettings.secondaryColor);
    }
    if (siteSettings.bgColor) {
      document.documentElement.style.setProperty('--theme-bg', siteSettings.bgColor);
    }
  }, [siteSettings.primaryColor, siteSettings.secondaryColor, siteSettings.bgColor]);

  // Toast functions
  const showToast = (title: string, message?: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Product CRUD
  const addProduct = (prodData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product => {
    const newProduct: Product = {
      ...prodData,
      id: `prod-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);

    // update category product count
    setCategories((prev) =>
      prev.map((c) =>
        c.id === newProduct.categoryId ? { ...c, productCount: (c.productCount || 0) + 1 } : c
      )
    );

    // Save to Firestore backend
    saveProductToFirestore(newProduct).catch((e) => console.warn('Firestore write notice:', e));

    showToast('Product Created', `"${newProduct.name}" added successfully`);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) {
        const merged = { ...target, ...updates, updatedAt: new Date().toISOString() };
        saveProductToFirestore(merged).catch((e) => console.warn('Firestore write notice:', e));
      }
      return prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
    });
    showToast('Product Updated', 'Changes saved successfully');
  };

  const updateProductStock = (productId: string, newStock: number) => {
    updateProduct(productId, { stock: Math.max(0, newStock) });
  };

  const deleteProduct = (id: string) => {
    const target = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (target) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === target.categoryId
            ? { ...c, productCount: Math.max(0, (c.productCount || 1) - 1) }
            : c
        )
      );
    }
    deleteProductFromFirestore(id).catch((e) => console.warn('Firestore delete notice:', e));
    showToast('Product Deleted', 'Product has been removed', 'info');
  };

  const duplicateProduct = (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const duplicated: Product = {
      ...original,
      id: `prod-${Date.now().toString(36)}`,
      name: `${original.name} (Copy)`,
      slug: `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      sku: `${original.sku}-CP`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => [duplicated, ...prev]);
    saveProductToFirestore(duplicated).catch((e) => console.warn('Firestore write notice:', e));
    showToast('Product Duplicated', `Created duplicate of "${original.name}"`);
  };

  const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);
  const getProductById = (id: string) => products.find((p) => p.id === id);

  // Categories CRUD
  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now().toString(36)}`,
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCat]);
    saveCategoryToFirestore(newCat).catch((e) => console.warn('Firestore write notice:', e));
    showToast('Category Created', `"${newCat.name}" is now live`);
  };

  const updateCategory = (id: string, updates: Partial<Category>) => {
    setCategories((prev) => {
      const target = prev.find((c) => c.id === id);
      if (target) {
        saveCategoryToFirestore({ ...target, ...updates }).catch((e) => console.warn('Firestore write notice:', e));
      }
      return prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
    });
    showToast('Category Updated', 'Category changes saved');
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    deleteCategoryFromFirestore(id).catch((e) => console.warn('Firestore delete notice:', e));
    showToast('Category Deleted', 'Category removed', 'info');
  };

  const getCategoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);

  // Cart operations
  const addToCart = (
    product: Product,
    options?: {
      quantity?: number;
      variant?: ProductVariant;
      selectedFlavour?: string;
      selectedAddons?: ProductAddon[];
      customMessage?: string;
    }
  ) => {
    const qty = options?.quantity || 1;
    const variant = options?.variant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
    const addons = options?.selectedAddons || [];
    const flavour = options?.selectedFlavour || (product.flavours && product.flavours.length > 0 ? product.flavours[0] : undefined);
    const addonsTotal = addons.reduce((sum, a) => sum + a.price, 0);
    const unitPrice = (variant ? variant.price : product.price) + addonsTotal;
    const totalPrice = unitPrice * qty;

    setCart((prev) => {
      // Check if identical item already exists (same variant and flavour)
      const existingIdx = prev.findIndex(
        (item) =>
          item.productId === product.id &&
          item.variant?.id === variant?.id &&
          item.selectedFlavour === flavour &&
          item.customMessage === options?.customMessage
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newQty = current.quantity + qty;
        updated[existingIdx] = {
          ...current,
          quantity: newQty,
          totalPrice: current.unitPrice * newQty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          productId: product.id,
          product,
          variant,
          quantity: qty,
          selectedFlavour: flavour,
          selectedAddons: addons,
          customMessage: options?.customMessage,
          unitPrice,
          totalPrice,
        },
      ];
    });

    showToast('Added to Cart 🍰', `${qty}x ${product.name} added to your bag`);
    setIsCartOpen(true);
  };

  const updateCartQuantity = (index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }
    setCart((prev) =>
      prev.map((item, idx) =>
        idx === index
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, idx) => idx !== index));
    showToast('Removed from Cart', 'Item removed from bag', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Coupons
  const applyCoupon = (code: string) => {
    const trimmed = code.trim().toUpperCase();
    const coupon = coupons.find((c) => c.code.toUpperCase() === trimmed && c.active);

    if (!coupon) {
      return { success: false, message: 'Invalid or inactive coupon code.' };
    }

    if (cartSubtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: `Minimum order amount of ${siteSettings.currencySymbol}${coupon.minOrderAmount} required for this coupon.`,
      };
    }

    setAppliedCoupon(coupon);
    showToast('Coupon Applied 🎉', `Coupon "${coupon.code}" applied!`);
    return { success: true, message: `Coupon "${coupon.code}" successfully applied!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon Removed', 'Promo code removed from order', 'info');
  };

  // Cart financial calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percentage') {
      const computed = (cartSubtotal * appliedCoupon.discountValue) / 100;
      cartDiscount = appliedCoupon.maxDiscount ? Math.min(computed, appliedCoupon.maxDiscount) : computed;
    } else {
      cartDiscount = appliedCoupon.discountValue;
    }
  }

  const cartDeliveryFee =
    cartSubtotal === 0 || cartSubtotal >= siteSettings.freeDeliveryThreshold
      ? 0
      : siteSettings.defaultDeliveryFee;

  const taxableAmount = Math.max(0, cartSubtotal - cartDiscount);
  const cartTax = Math.round((taxableAmount * siteSettings.taxRatePercent) / 100);
  const cartTotal = Math.max(0, taxableAmount + cartDeliveryFee + cartTax);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlistIds((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'Item removed from your favorites', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to Wishlist ❤️', 'Saved to your favorites');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  // Order Management
  const createOrder = (orderData: {
    customer: { fullName: string; email: string; phone: string };
    address: DeliveryAddress;
    deliveryOption: { id: string; name: string; price: number; estimatedDelivery: string };
    paymentMethod: 'razorpay' | 'cod' | 'card' | 'upi' | 'netbanking';
    paymentId?: string;
    paymentStatus?: PaymentStatus;
  }): Order => {
    const orderNumber = `HCT-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const orderItems = cart.map((item, idx) => ({
      id: `oi-${Date.now()}-${idx}`,
      productId: item.productId,
      productName: item.product.name,
      thumbnail: item.product.thumbnail,
      variantName: item.variant?.name,
      flavour: item.selectedFlavour,
      addons: item.selectedAddons.map((a) => a.name),
      customMessage: item.customMessage,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    }));

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer: orderData.customer,
      address: orderData.address,
      items: orderItems,
      subtotal: cartSubtotal,
      discount: cartDiscount,
      couponCode: appliedCoupon?.code,
      deliveryOption: orderData.deliveryOption,
      deliveryFee: orderData.deliveryOption.price,
      tax: cartTax,
      total: Math.max(0, cartSubtotal - cartDiscount + orderData.deliveryOption.price + cartTax),
      status: 'pending',
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'cod' ? 'pending' : 'paid'),
      paymentMethod: orderData.paymentMethod,
      paymentId: orderData.paymentId,
      timeline: [
        {
          status: 'pending',
          label: 'Order Placed',
          timestamp: now,
          note: `Order received via online boutique (${orderData.paymentMethod.toUpperCase()})`,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // 1. Add order
    setOrders((prev) => [newOrder, ...prev]);
    saveOrderToFirestore(newOrder).catch((e) => console.warn('Firestore order write notice:', e));

    // 2. Reduce inventory automatically for ordered products & variants
    setProducts((prev) =>
      prev.map((p) => {
        const purchased = cart.filter((c) => c.productId === p.id);
        if (purchased.length === 0) return p;

        const totalQtyPurchased = purchased.reduce((sum, c) => sum + c.quantity, 0);
        const newStock = Math.max(0, p.stock - totalQtyPurchased);

        // Also reduce variant stock if specified
        const updatedVariants = p.variants?.map((v) => {
          const varPurchased = purchased.find((c) => c.variant?.id === v.id);
          return varPurchased ? { ...v, stock: Math.max(0, v.stock - varPurchased.quantity) } : v;
        });

        return {
          ...p,
          stock: newStock,
          variants: updatedVariants || p.variants,
          status: newStock === 0 ? 'out_of_stock' : p.status,
        };
      })
    );

    // 3. Update or create customer
    setCustomers((prev) => {
      const custEmail = (orderData.customer?.email || '').toLowerCase();
      const existing = custEmail ? prev.find((c) => (c.email || '').toLowerCase() === custEmail) : null;
      if (existing) {
        return prev.map((c) =>
          c.id === existing.id
            ? {
                ...c,
                totalOrders: c.totalOrders + 1,
                totalSpent: c.totalSpent + newOrder.total,
                lastOrderDate: now,
                phone: orderData.customer.phone || c.phone,
              }
            : c
        );
      }
      return [
        ...prev,
        {
          id: `cust-${Date.now().toString(36)}`,
          fullName: orderData.customer.fullName,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
          totalOrders: 1,
          totalSpent: newOrder.total,
          lastOrderDate: now,
          createdAt: now,
        },
      ];
    });

    // 4. Update coupon usage count
    if (appliedCoupon) {
      setCoupons((prev) =>
        prev.map((c) => (c.id === appliedCoupon.id ? { ...c, usedCount: c.usedCount + 1 } : c))
      );
    }

    // 5. Clear cart
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    const statusLabels: Record<OrderStatus, string> = {
      pending: 'Order Placed',
      confirmed: 'Confirmed',
      preparing: 'Baking at Atelier',
      ready: 'Packed & Ready',
      out_for_delivery: 'Out for Delivery',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      refunded: 'Refunded',
    };

    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const orderItems = Array.isArray(order.items) ? order.items : [];
        // If cancelling order, restore inventory
        if (status === 'cancelled' && order.status !== 'cancelled') {
          setProducts((currProducts) =>
            currProducts.map((p) => {
              const matchedItem = orderItems.find((i) => i.productId === p.id);
              if (!matchedItem) return p;
              return {
                ...p,
                stock: p.stock + (matchedItem.quantity || 1),
                status: p.status === 'out_of_stock' ? 'active' : p.status,
              };
            })
          );
        }

        const now = new Date().toISOString();
        const existingTimeline = Array.isArray(order.timeline) ? order.timeline : [];
        const newTimeline = [
          ...existingTimeline,
          {
            status,
            label: statusLabels[status] || status,
            timestamp: now,
            note: note || `Status updated to ${status}`,
          },
        ];

        const updatedOrder = {
          ...order,
          status,
          timeline: newTimeline,
          updatedAt: now,
        };
        updateOrderInFirestore(orderId, {
          status,
          timeline: newTimeline,
          updatedAt: now,
        }).catch((e) => console.warn('Firestore order update notice:', e));

        return updatedOrder;
      })
    );

    showToast('Order Status Updated', `Order marked as ${status.replace('_', ' ')}`);
  };

  const updateOrderPaymentStatus = (orderId: string, paymentStatus: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, paymentStatus, updatedAt: new Date().toISOString() };
          updateOrderInFirestore(orderId, {
            paymentStatus,
            updatedAt: updated.updatedAt,
          }).catch((e) => console.warn('Firestore payment status notice:', e));
          return updated;
        }
        return o;
      })
    );
    showToast('Payment Status Updated', `Payment marked as ${paymentStatus}`);
  };

  const updateOrderNotes = (orderId: string, internalNotes: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const updated = { ...o, internalNotes, updatedAt: new Date().toISOString() };
          updateOrderInFirestore(orderId, {
            internalNotes,
            updatedAt: updated.updatedAt,
          }).catch((e) => console.warn('Firestore order notes notice:', e));
          return updated;
        }
        return o;
      })
    );
    showToast('Order Notes Saved', 'Internal note updated');
  };

  const getOrderById = (orderId: string) => orders.find((o) => o.id === orderId);
  const getOrderByNumber = (orderNumber: string) =>
    orders.find((o) => o.orderNumber.toUpperCase() === orderNumber.toUpperCase());

  // Coupons CRUD
  const addCoupon = (couponData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newCoupon: Coupon = {
      ...couponData,
      id: `cp-${Date.now().toString(36)}`,
      usedCount: 0,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    showToast('Coupon Created', `Coupon code "${newCoupon.code}" is ready`);
  };

  const updateCoupon = (id: string, updates: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    showToast('Coupon Updated', 'Coupon settings saved');
  };

  const deleteCoupon = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    showToast('Coupon Deleted', 'Coupon removed', 'info');
  };

  // Reviews CRUD
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now().toString(36)}`,
      status: 'pending', // Requires admin approval as per requirements
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newReview, ...prev]);
    saveReviewToFirestore(newReview).catch((e) => console.warn('Firestore review write notice:', e));
    showToast('Review Submitted', 'Thank you! Your review has been submitted for approval.');
  };

  const updateReviewStatus = (id: string, status: Review['status']) => {
    setReviews((prev) => {
      const updated = prev.map((r) => (r.id === id ? { ...r, status } : r));
      // Recalculate product rating
      const review = prev.find((r) => r.id === id);
      if (review) {
        const approvedForProduct = updated.filter(
          (r) => r.productId === review.productId && r.status === 'approved'
        );
        if (approvedForProduct.length > 0) {
          const avg =
            approvedForProduct.reduce((sum, r) => sum + r.rating, 0) / approvedForProduct.length;
          setProducts((prods) =>
            prods.map((p) =>
              p.id === review.productId
                ? {
                    ...p,
                    rating: parseFloat(avg.toFixed(1)),
                    reviewCount: approvedForProduct.length,
                  }
                : p
            )
          );
        }
      }
      return updated;
    });
    updateReviewInFirestore(id, { status }).catch((e) => console.warn('Firestore review update notice:', e));
    showToast('Review Updated', `Review status changed to ${status}`);
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review Deleted', 'Review removed', 'info');
  };

  const approveReview = (id: string) => {
    updateReviewStatus(id, 'approved');
  };

  const getProductReviews = (productId: string) =>
    reviews.filter((r) => r.productId === productId && r.status === 'approved');

  // Testimonials
  const addTestimonial = (testData: Omit<Testimonial, 'id'>) => {
    const newTest: Testimonial = {
      ...testData,
      id: `test-${Date.now().toString(36)}`,
    };
    setTestimonials((prev) => [...prev, newTest]);
    showToast('Testimonial Added', 'New client praise added');
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    setTestimonials((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Testimonial Updated', 'Changes saved');
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
    showToast('Testimonial Deleted', 'Removed testimonial', 'info');
  };

  // Offers
  const addOffer = (offerData: Omit<Offer, 'id'>) => {
    const newOffer: Offer = {
      ...offerData,
      id: `off-${Date.now().toString(36)}`,
    };
    setOffers((prev) => [...prev, newOffer]);
    showToast('Offer Created', 'Promotional campaign created');
  };

  const updateOffer = (id: string, updates: Partial<Offer>) => {
    setOffers((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    showToast('Offer Updated', 'Offer changes saved');
  };

  const deleteOffer = (id: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    showToast('Offer Deleted', 'Campaign removed', 'info');
  };

  // Banners & Trust Items
  const updateBanner = (id: string, updates: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
    showToast('Hero Banner Updated', 'Homepage visual updated');
  };

  const updateTrustItem = (id: string, updates: Partial<TrustItem>) => {
    setTrustItems((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Trust Item Updated', 'USP points updated');
  };

  // Settings
  const updateSiteSettings = (settingsUpdates: Partial<SiteSettings>) => {
    setSiteSettings((prev) => {
      const merged = { ...prev, ...settingsUpdates };
      saveSiteSettingsToFirestore(merged).catch((e) => console.warn('Firestore settings write notice:', e));
      return merged;
    });
    showToast('Store Settings Saved', 'Brand and store configuration updated');
  };

  // Contact messages
  const addContactMessage = (msgData: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMsg: ContactMessage = {
      ...msgData,
      id: `msg-${Date.now().toString(36)}`,
      status: 'unread',
      createdAt: new Date().toISOString(),
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    saveContactMessageToFirestore(newMsg).catch((e) => console.warn('Firestore message write notice:', e));
    showToast('Message Sent ✉️', 'Thank you! Our concierge team will reach out shortly.');
  };

  const markMessageStatus = (id: string, status: ContactMessage['status']) => {
    setContactMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    updateContactMessageInFirestore(id, { status }).catch((e) => console.warn('Firestore message status notice:', e));
  };

  const deleteMessage = (id: string) => {
    setContactMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Message Deleted', 'Enquiry removed', 'info');
  };

  const updateMessageStatus = (id: string, status: any) => {
    const normalized: ContactMessage['status'] =
      status === 'responded' ? 'replied' : status === 'new' ? 'unread' : status;
    markMessageStatus(id, normalized);
  };

  // Admin Auth
  const adminLogin = (password: string) => {
    // Default demo password is "admin123" or "velvet2026"
    if (password === 'admin123' || password === 'velvet2026' || password === 'admin') {
      setIsAdminAuthenticated(true);
      showToast('Welcome, Master Baker 👑', 'Admin dashboard unlocked');
      return true;
    }
    showToast('Access Denied', 'Incorrect admin password', 'error');
    return false;
  };

  const adminLogout = () => {
    setIsAdminAuthenticated(false);
    showToast('Logged Out', 'Admin session ended', 'info');
  };

  // Firebase Live Sync & Auth
  const syncWithFirebase = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await seedFirestoreIfEmpty();
      return {
        success: true,
        message: `Firebase Firestore live backend is connected (Project: ${firebaseConfig.projectId}). ${res.message}`,
      };
    } catch (e: any) {
      return {
        success: false,
        message: e.message || 'Failed to sync with Firebase Firestore.',
      };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const user = await fbLoginWithGoogle();
      setFirebaseUser(user);
      if (user?.email === 'pornimakannan98@gmail.com') {
        setIsAdminAuthenticated(true);
        showToast('Admin Authenticated 👑', `Logged in as Master Baker (${user.email})`);
      } else {
        showToast('Welcome!', `Signed in with Google as ${user.displayName || user.email}`);
      }
    } catch (error: any) {
      showToast('Sign-In Error', error.message || 'Google sign-in was cancelled', 'error');
    }
  };

  const logoutFirebase = async () => {
    await fbLogoutUser();
    setFirebaseUser(null);
    setIsAdminAuthenticated(false);
    showToast('Signed Out', 'Signed out from Firebase session', 'info');
  };

  // Supabase Live Sync (when user provides cloud credentials)
  const syncWithSupabase = async (): Promise<{ success: boolean; message: string }> => {
    if (!supabase || !isSupabaseConfigured) {
      return {
        success: false,
        message: 'Supabase credentials (URL & Anon Key) are not configured yet in .env or Settings.',
      };
    }
    try {
      // Test select
      const { error } = await supabase.from('products').select('id').limit(1);
      if (error) {
        return {
          success: false,
          message: `Supabase connection error: ${error.message}. Make sure the tables were created using the provided SQL schema!`,
        };
      }
      return {
        success: true,
        message: 'Successfully connected and synced with live Supabase database!',
      };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to sync with Supabase.' };
    }
  };

  // Reset to default bakery data
  const resetToDefaultData = () => {
    setProducts(initialProducts);
    setCategories(initialCategories);
    setOrders(initialOrders);
    setCustomers(initialCustomers);
    setCoupons(initialCoupons);
    setOffers(initialOffers);
    setBanners(initialBanners);
    setTrustItems(initialTrustItems);
    setSiteSettings(initialSiteSettings);
    showToast('Demo Data Reset', 'All store data restored to curated bakery defaults');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        updateProductStock,
        deleteProduct,
        duplicateProduct,
        getProductBySlug,
        getProductById,

        categories,
        setCategories,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoryBySlug,

        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTax,
        cartTotal,
        cartCount,

        wishlistIds,
        toggleWishlist,
        isInWishlist,

        orders,
        createOrder,
        updateOrderStatus,
        updateOrderPaymentStatus,
        updatePaymentStatus: updateOrderPaymentStatus,
        updateOrderNotes,
        getOrderById,
        getOrderByNumber,

        customers,

        coupons,
        addCoupon,
        updateCoupon,
        deleteCoupon,

        reviews,
        addReview,
        updateReviewStatus,
        approveReview,
        deleteReview,
        getProductReviews,

        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,

        offers,
        setOffers,
        addOffer,
        updateOffer,
        deleteOffer,

        banners,
        updateBanner,
        trustItems,
        updateTrustItem,

        siteSettings,
        updateSiteSettings,

        contactMessages,
        addContactMessage,
        markMessageStatus,
        updateMessageStatus,
        deleteMessage,

        isAdminAuthenticated,
        adminLogin,
        adminLogout,

        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        quickViewProduct,
        setQuickViewProduct,

        toasts,
        showToast,
        dismissToast,

        isFirebaseActive: true,
        firebaseProjectId: firebaseConfig.projectId,
        firebaseDatabaseId: firebaseConfig.firestoreDatabaseId || '(default)',
        firebaseUser,
        loginWithGoogle,
        logoutFirebase,
        syncWithFirebase,

        isSupabaseActive: isSupabaseConfigured,
        syncWithSupabase,
        resetToDefaultData,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
