const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    const response = await fetch(`${API_BASE_URL}/products.php`);
    const data = await response.json();
    return data.success ? data.products : [];
  },

  async getProduct(id: string): Promise<Product | null> {
    const response = await fetch(`${API_BASE_URL}/products.php?id=${id}`);
    const data = await response.json();
    return data.success ? data.product : null;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products.php?search=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.success ? data.products : [];
  },

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products.php?category=${categoryId}`);
    const data = await response.json();
    return data.success ? data.products : [];
  },

  async createProduct(productData: any) {
    const response = await fetch(`${API_BASE_URL}/products.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  async updateProduct(productData: any) {
    const response = await fetch(`${API_BASE_URL}/products.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(productData)
    });
    return response.json();
  },

  async deleteProduct(productId: string) {
    const response = await fetch(`${API_BASE_URL}/products.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ id: productId })
    });
    return response.json();
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const response = await fetch(`${API_BASE_URL}/categories.php`);
    const data = await response.json();
    return data.success ? data.categories : [];
  },

  // Cart
  async getCartItems(sessionId: string) {
    const response = await fetch(`${API_BASE_URL}/cart.php?session_id=${sessionId}`);
    const data = await response.json();
    return data.success ? data : { items: [], total: 0 };
  },

  async addToCart(sessionId: string, productId: string, quantity: number = 1) {
    const response = await fetch(`${API_BASE_URL}/cart.php`, {
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
    const response = await fetch(`${API_BASE_URL}/cart.php`, {
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
    const response = await fetch(`${API_BASE_URL}/cart.php`, {
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
    const response = await fetch(`${API_BASE_URL}/cart.php`, {
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
    const response = await fetch(`${API_BASE_URL}/orders.php`, {
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
    const response = await fetch(`${API_BASE_URL}/auth.php`, {
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

  async logout() {
    const response = await fetch(`${API_BASE_URL}/auth.php`, {
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
    const response = await fetch(`${API_BASE_URL}/auth.php?action=me`, {
      credentials: 'include'
    });
    return response.json();
  },

  async getAllUsers() {
    const response = await fetch(`${API_BASE_URL}/auth.php?action=users`, {
      credentials: 'include'
    });
    return response.json();
  },

  async createUser(userData: any) {
    const response = await fetch(`${API_BASE_URL}/auth.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        action: 'create_user',
        ...userData
      })
    });
    return response.json();
  },

  async deleteUser(id: string) {
    const response = await fetch(`${API_BASE_URL}/auth.php`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        id
      })
    });
    return response.json();
  }
};
