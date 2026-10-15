import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dessert, Review, Reservation, CartItem, OrderReceipt } from '../types/bakery';
import { INITIAL_DESSERTS, INITIAL_REVIEWS } from '../data/bakeryData';

interface BakeryContextType {
  desserts: Dessert[];
  reviews: Review[];
  reservations: Reservation[];
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeView: 'showcase' | 'table-booking' | 'order-now' | 'about-us' | 'reviews-hub' | '3d-atelier';
  setActiveView: (view: 'showcase' | 'table-booking' | 'order-now' | 'about-us' | 'reviews-hub' | '3d-atelier') => void;
  selectedDessertModal: Dessert | null;
  setSelectedDessertModal: (dessert: Dessert | null) => void;
  getDessertStats: (dessertId: string) => { averageRating: number; totalReviews: number; distribution: Record<number, number> };
  addReview: (reviewData: {
    dessertId: string;
    authorName: string;
    authorLocation?: string;
    rating: number;
    title: string;
    comment: string;
  }) => void;
  voteHelpful: (reviewId: string) => void;
  createReservation: (data: {
    guestName: string;
    email: string;
    phone: string;
    partySize: number;
    date: string;
    timeSlot: string;
    seatingZone: 'orangerie' | 'salon' | 'counter';
    experienceType: 'afternoon-tea' | 'tasting-flight' | 'salon-a-la-carte';
    dietaryNotes?: string;
    specialRequests?: string;
  }) => Reservation;
  cancelReservation: (id: string) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  completeOrder: (customerData: {
    customerName: string;
    email: string;
    phone: string;
    fulfillmentType: 'boutique-pickup' | 'chilled-courier';
    pickupDate: string;
    pickupTime: string;
    deliveryAddress?: string;
    giftMessage?: string;
  }) => OrderReceipt;
  lastOrderReceipt: OrderReceipt | null;
  setLastOrderReceipt: (receipt: OrderReceipt | null) => void;
}

const BakeryContext = createContext<BakeryContextType | undefined>(undefined);

export const BakeryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [desserts] = useState<Dessert[]>(INITIAL_DESSERTS);

  // Reviews with LocalStorage persistence
  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('maison_elysee_reviews');
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('maison_elysee_reviews', JSON.stringify(reviews));
    } catch (e) {
      console.error('Failed to save reviews', e);
    }
  }, [reviews]);

  // Reservations with LocalStorage persistence
  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const saved = localStorage.getItem('maison_elysee_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('maison_elysee_reservations', JSON.stringify(reservations));
    } catch (e) {
      console.error('Failed to save reservations', e);
    }
  }, [reservations]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('maison_elysee_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('maison_elysee_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart', e);
    }
  }, [cart]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeView, setActiveViewState] = useState<'showcase' | 'table-booking' | 'order-now' | 'about-us' | 'reviews-hub' | '3d-atelier'>('showcase');
  const [selectedDessertModal, setSelectedDessertModal] = useState<Dessert | null>(null);
  const [lastOrderReceipt, setLastOrderReceipt] = useState<OrderReceipt | null>(null);

  const setActiveView = (view: 'showcase' | 'table-booking' | 'order-now' | 'about-us' | 'reviews-hub' | '3d-atelier') => {
    setActiveViewState(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to compute average rating and breakdown
  const getDessertStats = (dessertId: string) => {
    const itemReviews = reviews.filter((r) => r.dessertId === dessertId);
    if (itemReviews.length === 0) {
      return { averageRating: 5.0, totalReviews: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    }
    const sum = itemReviews.reduce((acc, curr) => acc + curr.rating, 0);
    const avg = Number((sum / itemReviews.length).toFixed(1));
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    itemReviews.forEach((r) => {
      distribution[r.rating] = (distribution[r.rating] || 0) + 1;
    });
    return { averageRating: avg, totalReviews: itemReviews.length, distribution };
  };

  const addReview = (reviewData: {
    dessertId: string;
    authorName: string;
    authorLocation?: string;
    rating: number;
    title: string;
    comment: string;
  }) => {
    const newRev: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      dessertId: reviewData.dessertId,
      authorName: reviewData.authorName.trim() || 'Guest Gourmand',
      authorLocation: reviewData.authorLocation?.trim() || 'Paris, France',
      rating: reviewData.rating,
      title: reviewData.title.trim(),
      comment: reviewData.comment.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verifiedBuyer: true,
      helpfulVotes: 0,
    };
    setReviews((prev) => [newRev, ...prev]);
  };

  const voteHelpful = (reviewId: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
  };

  const createReservation = (data: {
    guestName: string;
    email: string;
    phone: string;
    partySize: number;
    date: string;
    timeSlot: string;
    seatingZone: 'orangerie' | 'salon' | 'counter';
    experienceType: 'afternoon-tea' | 'tasting-flight' | 'salon-a-la-carte';
    dietaryNotes?: string;
    specialRequests?: string;
  }): Reservation => {
    const randomHex = Math.floor(1000 + Math.random() * 9000);
    const newReservation: Reservation = {
      id: `res-${Date.now()}`,
      code: `ELYSEE-${randomHex}`,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'confirmed',
    };
    setReservations((prev) => [newReservation, ...prev]);
    return newReservation;
  };

  const cancelReservation = (id: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );
  };

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // If single item already in cart, increment quantity
      if (newItem.type === 'single' && newItem.dessertId) {
        const existingIndex = prev.findIndex(
          (i) => i.type === 'single' && i.dessertId === newItem.dessertId
        );
        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += newItem.quantity;
          return updated;
        }
      }
      return [...prev, newItem];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity: qty } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const completeOrder = (customerData: {
    customerName: string;
    email: string;
    phone: string;
    fulfillmentType: 'boutique-pickup' | 'chilled-courier';
    pickupDate: string;
    pickupTime: string;
    deliveryAddress?: string;
    giftMessage?: string;
  }): OrderReceipt => {
    const subtotal = cart.reduce((acc, curr) => acc + curr.unitPrice * curr.quantity, 0);
    const packagingFee = subtotal > 0 ? 3.50 : 0;
    const tax = Number((subtotal * 0.085).toFixed(2));
    const total = Number((subtotal + packagingFee + tax).toFixed(2));
    const orderNum = `ME-${Math.floor(100000 + Math.random() * 900000)}`;

    const receipt: OrderReceipt = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      ...customerData,
      items: [...cart],
      subtotal,
      packagingFee,
      tax,
      total,
      createdAt: new Date().toISOString(),
      status: 'received',
    };

    setLastOrderReceipt(receipt);
    clearCart();
    return receipt;
  };

  return (
    <BakeryContext.Provider
      value={{
        desserts,
        reviews,
        reservations,
        cart,
        isCartOpen,
        setIsCartOpen,
        activeView,
        setActiveView,
        selectedDessertModal,
        setSelectedDessertModal,
        getDessertStats,
        addReview,
        voteHelpful,
        createReservation,
        cancelReservation,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        completeOrder,
        lastOrderReceipt,
        setLastOrderReceipt,
      }}
    >
      {children}
    </BakeryContext.Provider>
  );
};

export const useBakery = () => {
  const context = useContext(BakeryContext);
  if (!context) {
    throw new Error('useBakery must be used within a BakeryProvider');
  }
  return context;
};
