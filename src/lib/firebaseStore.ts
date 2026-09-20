import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import {
  Product,
  Category,
  Order,
  Coupon,
  Review,
  ContactMessage,
  SiteSettings,
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialCoupons,
  initialSiteSettings,
} from '../data/initialData';

export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  COUPONS: 'coupons',
  REVIEWS: 'reviews',
  MESSAGES: 'contact_messages',
  SETTINGS: 'site_settings',
  ADMINS: 'admins',
  USERS: 'users',
} as const;

// Auto-seed initial catalog to Firestore if empty
export async function seedFirestoreIfEmpty(): Promise<{ seeded: boolean; message: string }> {
  try {
    const productsSnap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
    if (productsSnap.empty) {
      console.log('Seeding initial products and categories to Firebase Firestore...');

      // Seed categories
      for (const cat of initialCategories) {
        await setDoc(doc(db, COLLECTIONS.CATEGORIES, cat.id), cat);
      }

      // Seed products
      for (const prod of initialProducts) {
        await setDoc(doc(db, COLLECTIONS.PRODUCTS, prod.id), prod);
      }

      // Seed coupons
      for (const c of initialCoupons) {
        await setDoc(doc(db, COLLECTIONS.COUPONS, c.id), c);
      }

      // Seed default site settings
      await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), initialSiteSettings);

      return { seeded: true, message: 'Initial bakery catalogue seeded to Firestore' };
    }
    return { seeded: false, message: 'Firestore already contains catalog data' };
  } catch (error) {
    console.warn('Seed error (may require rules approval or offline state):', error);
    return { seeded: false, message: 'Could not auto-seed: ' + String(error) };
  }
}

// ---------------- PRODUCTS ----------------
export function subscribeToProducts(
  onUpdate: (products: Product[]) => void,
  onError?: (err: any) => void
) {
  const path = COLLECTIONS.PRODUCTS;
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items: Product[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Product);
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

export async function saveProductToFirestore(product: Product): Promise<void> {
  const path = `${COLLECTIONS.PRODUCTS}/${product.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.PRODUCTS, product.id), product);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteProductFromFirestore(productId: string): Promise<void> {
  const path = `${COLLECTIONS.PRODUCTS}/${productId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- CATEGORIES ----------------
export function subscribeToCategories(
  onUpdate: (categories: Category[]) => void,
  onError?: (err: any) => void
) {
  const path = COLLECTIONS.CATEGORIES;
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items: Category[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Category);
        });
        if (items.length > 0) {
          onUpdate(items);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

export async function saveCategoryToFirestore(category: Category): Promise<void> {
  const path = `${COLLECTIONS.CATEGORIES}/${category.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.CATEGORIES, category.id), category);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function deleteCategoryFromFirestore(categoryId: string): Promise<void> {
  const path = `${COLLECTIONS.CATEGORIES}/${categoryId}`;
  try {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, categoryId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// ---------------- ORDERS ----------------
export function subscribeToOrders(
  onUpdate: (orders: Order[]) => void,
  onError?: (err: any) => void
) {
  const path = COLLECTIONS.ORDERS;
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items: Order[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Order);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

export async function saveOrderToFirestore(order: Order): Promise<void> {
  const path = `${COLLECTIONS.ORDERS}/${order.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.ORDERS, order.id), order);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateOrderInFirestore(orderId: string, updates: Partial<Order>): Promise<void> {
  const path = `${COLLECTIONS.ORDERS}/${orderId}`;
  try {
    await updateDoc(doc(db, COLLECTIONS.ORDERS, orderId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ---------------- REVIEWS ----------------
export function subscribeToReviews(
  onUpdate: (reviews: Review[]) => void,
  onError?: (err: any) => void
) {
  const path = COLLECTIONS.REVIEWS;
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items: Review[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as Review);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

export async function saveReviewToFirestore(review: Review): Promise<void> {
  const path = `${COLLECTIONS.REVIEWS}/${review.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.REVIEWS, review.id), review);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateReviewInFirestore(reviewId: string, updates: Partial<Review>): Promise<void> {
  const path = `${COLLECTIONS.REVIEWS}/${reviewId}`;
  try {
    await updateDoc(doc(db, COLLECTIONS.REVIEWS, reviewId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ---------------- CONTACT MESSAGES ----------------
export function subscribeToContactMessages(
  onUpdate: (messages: ContactMessage[]) => void,
  onError?: (err: any) => void
) {
  const path = COLLECTIONS.MESSAGES;
  try {
    return onSnapshot(
      collection(db, path),
      (snapshot) => {
        const items: ContactMessage[] = [];
        snapshot.forEach((docSnap) => {
          items.push(docSnap.data() as ContactMessage);
        });
        onUpdate(items);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    return () => {};
  }
}

export async function saveContactMessageToFirestore(message: ContactMessage): Promise<void> {
  const path = `${COLLECTIONS.MESSAGES}/${message.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.MESSAGES, message.id), message);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function updateContactMessageInFirestore(
  messageId: string,
  updates: Partial<ContactMessage>
): Promise<void> {
  const path = `${COLLECTIONS.MESSAGES}/${messageId}`;
  try {
    await updateDoc(doc(db, COLLECTIONS.MESSAGES, messageId), updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

// ---------------- SITE SETTINGS ----------------
export function subscribeToSiteSettings(
  onUpdate: (settings: SiteSettings) => void,
  onError?: (err: any) => void
) {
  const path = `${COLLECTIONS.SETTINGS}/general`;
  try {
    return onSnapshot(
      doc(db, COLLECTIONS.SETTINGS, 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as SiteSettings);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, path);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return () => {};
  }
}

export async function saveSiteSettingsToFirestore(settings: SiteSettings): Promise<void> {
  const path = `${COLLECTIONS.SETTINGS}/general`;
  try {
    await setDoc(doc(db, COLLECTIONS.SETTINGS, 'general'), settings);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
