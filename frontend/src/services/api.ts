// Get API base URL from environment or use fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://online-store-1-lhxk.onrender.com';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: string;
  category_name?: string;
  stock_quantity: number;
  is_active: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export const api = {
  // Products
  async getProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    return data.success ? data.products : [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const response = await fetch(`${API_BASE_URL}/products?id=${id}`);
    const data = await response.json();
    return data.success ? data.product : null;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.success ? data.products : [];
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products?category=${categoryId}`);
    const data = await response.json();
    return data.success ? data.products : [];
  },

  async createProduct(productData: any) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use query parameter instead of Authorization header for CORS compatibility
    const url = token 
      ? `${API_BASE_URL}/products?token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  async updateProduct(productData: any) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use query parameter instead of Authorization header for CORS compatibility
    const url = token 
      ? `${API_BASE_URL}/products?token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  async deleteProduct(productId: string) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use query parameter instead of Authorization header for CORS compatibility
    const url = token 
      ? `${API_BASE_URL}/products?token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/products`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      body: JSON.stringify({ id: productId })
    });
    return response.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data = await response.json();
    return data.success ? data.categories : [];
  },

  // Cart
  async getCartItems(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/cart?session_id=${sessionId}`);
    const data = await response.json();
    return data.success ? data : { items: [], total: 0 };
  },

  async addToCart(sessionId: string, productId: string, quantity: number = 1) {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        product_id: productId,
        quantity
      })
    });
    return response.json();
  },

  async updateCartItem(sessionId: string, productId: string, quantity: number) {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        product_id: productId,
        quantity
      })
    });
    return response.json();
  },

  async removeFromCart(sessionId: string, productId: string) {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        product_id: productId
      })
    });
    return response.json();
  },

  async clearCart(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        clear_all: true
      })
    });
    return response.json();
  },

  // Orders
  async createOrder(sessionId: string, customerData: any, cartItems: any[]) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        customer: customerData,
        cart_items: cartItems
      })
    });
    return response.json();
  },

  // Auth
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        action: 'login',
        username,
        password
      })
    });
    return response.json();
  },

  async register(username: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth?action=register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        username,
        email,
        password
      })
    });
    return response.json();
  },

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        action: 'logout'
      })
    });
    return response.json();
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use query parameter instead of Authorization header for CORS compatibility
    const url = token 
      ? `${API_BASE_URL}/auth?action=me&token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/auth?action=me`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers,
        credentials: 'include'
      });
      return response.json();
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return { success: false, message: 'Network error' };
    }
  },

  async getAllUsers() {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use query parameter instead of Authorization header for CORS compatibility
    const url = token 
      ? `${API_BASE_URL}/auth?action=users&token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/auth?action=users`;
    
    const response = await fetch(url, {
      headers,
      credentials: 'include'
    });
    return response.json();
  },

  async createUser(userData: any) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use query parameter instead of Authorization header for CORS compatibility
    const url = token 
      ? `${API_BASE_URL}/auth?action=create_user&token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/auth?action=create_user`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  async deleteUser(id: string) {
    const token = localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Use query parameter instead of Authorization header for CORS compatibility
    const url = token 
      ? `${API_BASE_URL}/auth?token=${encodeURIComponent(token)}`
      : `${API_BASE_URL}/auth`;
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      credentials: 'include',
      body: JSON.stringify({
        id
      })
    });
    return response.json();
  }
};
