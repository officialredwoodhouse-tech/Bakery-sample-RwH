export interface Dessert {
  id: string;
  name: string;
  frenchName: string;
  category: 'entremets' | 'viennoiserie' | 'tartes' | 'coffrets';
  price: number;
  description: string;
  longDescription: string;
  tastingNotes: string[];
  allergens: string[];
  dietary: string[];
  imageUrl: string;
  featured: boolean;
  servingSize: string;
  leadTimeHours: number;
}

export interface Review {
  id: string;
  dessertId: string;
  authorName: string;
  authorLocation?: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  helpfulVotes: number;
}

export interface SeatingZone {
  id: 'orangerie' | 'salon' | 'counter';
  title: string;
  frenchSubtitle: string;
  description: string;
  ambiance: string;
  capacityPerSlot: number;
  featuredFor: string;
}

export interface Reservation {
  id: string;
  code: string;
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
  createdAt: string;
  status: 'confirmed' | 'cancelled';
}

export interface CartItem {
  id: string;
  type: 'single' | 'curated-box' | 'celebration-entremet';
  dessertId?: string;
  dessertName: string;
  unitPrice: number;
  quantity: number;
  boxItems?: { dessertId: string; name: string; quantity: number }[];
  boxSize?: number;
  cakeSize?: '6-8 portions' | '10-12 portions';
  customInscription?: string;
  imageUrl: string;
}

export interface OrderReceipt {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  fulfillmentType: 'boutique-pickup' | 'chilled-courier';
  pickupDate: string;
  pickupTime: string;
  deliveryAddress?: string;
  giftMessage?: string;
  items: CartItem[];
  subtotal: number;
  packagingFee: number;
  tax: number;
  total: number;
  createdAt: string;
  status: 'received' | 'in-preparation' | 'ready';
}
