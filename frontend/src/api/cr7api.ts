// src/api/cr7api.ts

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ============================================
// TYPES
// ============================================
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  created_at?: string;
  is_active?: boolean;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number | string;
  image: string;
  tagline: string;
  description?: string;
  in_stock: boolean;
  stock_quantity: number;
  sizes?: string[];
  rating: number;
  review_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  product_id: number;
  quantity: number;
  size?: string;
  added_at?: string;
  product?: Product;
}

export interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  postal_code?: string;
}

export interface Order {
  order_id: string;
  user_id: string;
  items: any[];
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  status: string;
  shipping_address: ShippingAddress;
  payment_method: string;
  payment_status: string;
  tracking_number?: string;
  created_at: string;
}

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  errors?: any;
}

// ============================================
// TOKEN MANAGEMENT
// ============================================
const getToken = (): string | null => localStorage.getItem('cr7_token');
const setToken = (token: string): void => localStorage.setItem('cr7_token', token);
const removeToken = (): void => localStorage.removeItem('cr7_token');

// ============================================
// API REQUEST HELPER
// ============================================
const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('API Error:', data);
      throw new Error(data.message || 'API request failed');
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  register: async (name: string, email: string, password: string) => {
    const response = await apiRequest<{ user: User; token: string }>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    
    if (response.data?.token) {
      setToken(response.data.token);
      localStorage.setItem('cr7_user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await apiRequest<{ user: User; token: string }>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.data?.token) {
      setToken(response.data.token);
      localStorage.setItem('cr7_user', JSON.stringify(response.data.user));
    }
    
    return response;
  },

  logout: () => {
    removeToken();
    localStorage.removeItem('cr7_user');
  },

  getProfile: () => apiRequest<User>('/auth/profile/'),

  updateProfile: (data: Partial<User>) =>
    apiRequest<User>('/auth/profile/', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  changePassword: (oldPassword: string, newPassword: string) =>
    apiRequest('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    }),
};

// ============================================
// PRODUCTS API
// ============================================
export const productsAPI = {
  getAll: async (category?: string) => {
    const params = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest<{ products: Product[]; count: number }>(`/products/${params}`);
  },

  getById: (id: number) => apiRequest<Product>(`/products/${id}/`),

  search: (query: string) =>
    apiRequest<{ products: Product[]; count: number }>(`/products/?search=${encodeURIComponent(query)}`),

  getCategories: () => 
    apiRequest<Array<{ name: string; icon: string }>>('/products/categories/'),

  getReviews: (productId: number) => apiRequest(`/products/${productId}/reviews/`),

  addReview: (productId: number, rating: number, title?: string, comment?: string) =>
    apiRequest(`/products/${productId}/reviews/`, {
      method: 'POST',
      body: JSON.stringify({ rating, title, comment }),
    }),
};

// ============================================
// CART API
// ============================================
export const cartAPI = {
  get: () => apiRequest<{
    items: CartItem[];
    item_count: number;
    subtotal: string;
  }>('/cart/'),

  addItem: (productId: number, quantity: number = 1, size?: string) =>
    apiRequest('/cart/add/', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
        size,
      }),
    }),

  updateItem: (productId: number, quantity: number) =>
    apiRequest(`/cart/items/${productId}/`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    }),

  removeItem: (productId: number) =>
    apiRequest(`/cart/items/${productId}/`, {
      method: 'DELETE',
    }),

  clear: () => apiRequest('/cart/clear/', { method: 'DELETE' }),
};

// ============================================
// ORDERS API
// ============================================
export const ordersAPI = {
  getAll: () => apiRequest<{ orders: Order[]; count: number }>('/orders/'),

  getById: (orderId: string) => apiRequest<Order>(`/orders/${orderId}/`),

  create: (shippingAddress: ShippingAddress, paymentMethod: string = 'card', notes?: string) =>
    apiRequest<{ order_id: string; total: string; status: string }>('/orders/create/', {
      method: 'POST',
      body: JSON.stringify({
        shipping_address: shippingAddress,
        payment_method: paymentMethod,
        notes,
      }),
    }),
};

// ============================================
// WISHLIST API
// ============================================
export const wishlistAPI = {
  get: () => apiRequest<{ items: any[]; count: number }>('/wishlist/'),

  addItem: (productId: number) =>
    apiRequest('/wishlist/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    }),

  removeItem: (productId: number) =>
    apiRequest(`/wishlist/${productId}/`, {
      method: 'DELETE',
    }),
};

// ============================================
// NEWSLETTER API
// ============================================
export const newsletterAPI = {
  subscribe: (email: string) =>
    apiRequest('/newsletter/', {
      method: 'POST',
      body: JSON.stringify({ email, source: 'website' }),
    }),
};

// ============================================
// CR7 STATS API
// ============================================
export const statsAPI = {
  getCR7Stats: () => apiRequest('/stats/'),
};

// ============================================
// HEALTH CHECK
// ============================================
export const healthAPI = {
  check: () => apiRequest('/health/'),
};

// ============================================
// EXPORT DEFAULT
// ============================================
export default {
  auth: authAPI,
  products: productsAPI,
  cart: cartAPI,
  orders: ordersAPI,
  wishlist: wishlistAPI,
  newsletter: newsletterAPI,
  stats: statsAPI,
  health: healthAPI,
};