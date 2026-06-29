export interface Product {
  _id: string;
  id?: number;
  name: string;
  price: number;
  category: string;
  image?: string;
  images?: string[];
  stock?: number;
  status?: string;
  rating?: number;
  discount?: number;
  originalPrice?: number;
  inStock?: boolean;
  description?: string;
  reviewCount?: number;
  createdAt?: Date | string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  uid?: string;
  name: string;
  email: string;
  phone?: string;
  mobile?: string;
  address?: Address[];
  role: "user" | "admin";
  provider?: "email" | "google" | "mobile";
  photoURL?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  area?: string;
  postalCode?: string;
  isDefault: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  shippingAddress: Address;
  paymentMethod: "cod" | "bkash" | "nagad" | "rocket";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  parentId?: number;
  subCategories?: Category[];
}

export interface Review {
  id: number;
  productId: number;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  images?: string[];
  createdAt: string;
  helpful?: number;
}

export interface Wishlist {
  id: number;
  userId: string;
  productId: number;
  product: Product;
  createdAt: string;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string[];
  rating?: number;
  sortBy?: "price_asc" | "price_desc" | "rating" | "newest" | "popular";
  inStock?: boolean;
  searchQuery?: string;
}

// User Response Type
export interface UserResponse {
  success: boolean;
  user?: User;
  message?: string;
}

// Login Response Type
export interface LoginResponse {
  success: boolean;
  user: User;
  token?: string;
  message?: string;
}
