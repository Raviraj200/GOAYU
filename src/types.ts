export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  verified: boolean;
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images?: string[];
  category: string;
  subCategory?: string;
  stock: number;
  benefits: string[];
  ingredients: string[];
  usage: string;
  usagePoints?: string[];
  reviews: Review[];
  featured?: boolean;
  bestSeller?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
  slug?: string;
  excerpt?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface TrackingStep {
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  label: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  zipCode: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentStatus: 'paid' | 'unpaid';
  paymentMethod: string;
  date: string;
  trackingTimeline: TrackingStep[];
  trackingId?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase: number;
  active: boolean;
  productId?: string;
  productName?: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  bgImage: string;
  ctaText: string;
  link: string;
  cardImage?: string;
  cardLabel?: string;
  cardName?: string;
  cardCtaText?: string;
  cardLink?: string;
  showTraditionalWisdom?: boolean;
}

export interface Reel {
  id: string;
  title: string;
  url: string;
  tagline?: string;
  likes?: number;
  productId?: string;
}

export interface DashboardStats {
  totalSales: number;
  orderCount: number;
  customerCount: number;
  averageOrderValue: number;
  salesByDay: { date: string; amount: number }[];
  salesByCategory: { category: string; amount: number }[];
  recentOrders: Order[];
}

export function formatINR(val: number): string {
  return `₹${Math.round(val * 80).toLocaleString('en-IN')}`;
}
