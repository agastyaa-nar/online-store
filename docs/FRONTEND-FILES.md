# 🎨 Frontend Files Documentation

## 📁 Configuration Files

### 📄 `package.json`
**Purpose**: Node.js dependencies dan project configuration
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-router-dom": "^6.8.0",
    "@tanstack/react-query": "^4.0.0",
    "lucide-react": "^0.263.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```
**Functions**:
- React 18 dengan TypeScript support
- React Router untuk navigation
- TanStack Query untuk state management
- Lucide React untuk icons
- Vite untuk build tool

### 📄 `vite.config.ts`
**Purpose**: Vite build configuration
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```
**Functions**:
- React plugin untuk JSX support
- Path aliases (@ untuk src folder)
- Development server configuration
- Build optimization

---

## 🏗️ Core Architecture

### 📄 `src/main.tsx`
**Purpose**: React application entry point
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
**Functions**:
- React 18 createRoot API
- Strict mode untuk development
- CSS import untuk global styles
- DOM mounting

### 📄 `src/App.tsx`
**Purpose**: Main app component dengan routing
```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import ProtectedRoute from "@/components/ProtectedRoute";

const App = () => (
  <AuthProvider>
    <CartProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireAuth={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  </AuthProvider>
);
```
**Functions**:
- React Router setup dengan BrowserRouter
- Context providers (Auth, Cart)
- Route definitions untuk semua pages
- Protected routes untuk admin pages

---

## 🌐 API Integration

### 📄 `src/services/api.ts`
**Purpose**: API service layer untuk komunikasi dengan backend
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

  // Auth
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth?action=login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  // Cart
  async getCart(): Promise<CartItem[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/cart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    return data.success ? data.items : [];
  }
};
```
**Functions**:
- **Products**: getProducts(), getProduct(), createProduct(), updateProduct(), deleteProduct()
- **Auth**: login(), register(), getCurrentUser(), getAllUsers(), deleteUser()
- **Cart**: getCart(), addToCart(), updateCart(), removeFromCart(), clearCart()
- **Orders**: createOrder(), getOrders()
- **Categories**: getCategories()
- Environment variable configuration
- JWT token handling
- Error handling

---

## 📄 Pages Implementation

### 📄 `src/pages/Index.tsx` → **GET /products**
**Purpose**: Homepage dengan featured products
```typescript
const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await api.getProducts();
        setProducts(data.slice(0, 20)); // Show first 20 products
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  return (
    <div>
      <Navbar cartItemsCount={cartCount} />
      <section className="hero-section">
        <Button asChild>
          <Link to="/collection">Shop Now</Link>
        </Button>
      </section>
      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
```
**API Endpoints Used**:
- `GET /products` - Load featured products untuk homepage
- `POST /cart` - Add to cart functionality

### 📄 `src/pages/ProductDetail.tsx` → **GET /products?id={id}**
**Purpose**: Product detail page dengan related products
```typescript
const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadProduct = async () => {
      if (id) {
        try {
          const productData = await api.getProduct(id);
          setProduct(productData);
          // Load related products from same category
          if (productData?.category_id) {
            const related = await api.getProductsByCategory(productData.category_id);
            setRelatedProducts(related.filter(p => p.id !== id).slice(0, 4));
          }
        } catch (error) {
          console.error('Error loading product:', error);
        }
      }
    };
    loadProduct();
  }, [id]);

  const handleAddToCart = async () => {
    await addToCart(product);
    toast({ title: "Added to cart" });
  };

  return (
    <div>
      <Navbar cartItemsCount={cartCount} />
      <div className="product-detail">
        <img src={product?.image_url} alt={product?.name} />
        <div className="product-info">
          <h1>{product?.name}</h1>
          <p className="price">${formatPrice(product?.price)}</p>
          <p>{product?.description}</p>
          <Button onClick={handleAddToCart}>Add to Cart</Button>
        </div>
      </div>
      <section className="related-products">
        <h2>You May Also Like</h2>
        {relatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
};
```
**API Endpoints Used**:
- `GET /products?id={id}` - Load specific product
- `GET /products?category={categoryId}` - Load related products
- `POST /cart` - Add to cart

### 📄 `src/pages/CollectionPage.tsx` → **GET /products**
**Purpose**: All products page dengan search dan filtering
```typescript
const CollectionPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          api.getProducts(),
          api.getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      const results = await api.searchProducts(query);
      setProducts(results);
    } else {
      const allProducts = await api.getProducts();
      setProducts(allProducts);
    }
  };

  return (
    <div>
      <Navbar cartItemsCount={cartCount} />
      <div className="collection-page">
        <div className="filters">
          <input 
            type="text" 
            placeholder="Search products..."
            onChange={(e) => handleSearch(e.target.value)}
          />
          <select onChange={(e) => handleCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="products-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
```
**API Endpoints Used**:
- `GET /products` - Load all products
- `GET /products?search={query}` - Search products
- `GET /products?category={categoryId}` - Filter by category
- `GET /categories` - Load categories untuk filter

### 📄 `src/pages/Cart.tsx` → **GET /cart, PUT /cart, DELETE /cart**
**Purpose**: Shopping cart page
```typescript
const Cart = () => {
  const { cartItems, cartCount, updateQuantity, removeFromCart, getTotalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with checkout",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await api.removeFromCart(productId);
      removeFromCart(productId);
    } else {
      await api.updateCart(productId, newQuantity);
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div>
      <Navbar cartItemsCount={cartCount} />
      <div className="cart-page">
        <h1>Shopping Cart</h1>
        {cartItems.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Button asChild>
              <Link to="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.image_url} alt={item.name} />
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p>${formatPrice(item.price)}</p>
                  <div className="quantity-controls">
                    <Button onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>-</Button>
                    <span>{item.quantity}</span>
                    <Button onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>+</Button>
                  </div>
                  <Button variant="destructive" onClick={() => handleRemoveItem(item.id)}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="cart-summary">
          <p>Total: ${formatPrice(getTotalPrice())}</p>
          <Button onClick={handleCheckout}>Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
};
```
**API Endpoints Used**:
- `GET /cart` - Load cart items
- `PUT /cart` - Update item quantity
- `DELETE /cart` - Remove item from cart

### 📄 `src/pages/Checkout.tsx` → **POST /orders**
**Purpose**: Checkout page untuk process orders
```typescript
const Checkout = () => {
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please login to access checkout",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate, toast]);

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      const orderData = {
        items: cartItems,
        total_amount: getTotalPrice(),
        shipping_address: formData
      };
      
      const result = await api.createOrder(orderData);
      if (result.success) {
        toast({
          title: "Order placed successfully",
          description: `Order ID: ${result.order_id}`,
        });
        clearCart();
        navigate("/");
      } else {
        toast({
          title: "Order failed",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Navbar cartItemsCount={cartCount} />
      <div className="checkout-page">
        <h1>Checkout</h1>
        <div className="checkout-form">
          {/* Shipping information form */}
          <div className="shipping-info">
            <h2>Shipping Information</h2>
            <input placeholder="Full Name" />
            <input placeholder="Address" />
            <input placeholder="City" />
            <input placeholder="ZIP Code" />
          </div>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            {cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <span>{item.name}</span>
                <span>${formatPrice(item.price)} x {item.quantity}</span>
              </div>
            ))}
            <div className="total">
              <strong>Total: ${formatPrice(getTotalPrice())}</strong>
            </div>
            <Button onClick={handlePlaceOrder} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
```
**API Endpoints Used**:
- `POST /orders` - Create new order
- Authentication check untuk access control

### 📄 `src/pages/UserLogin.tsx` → **POST /auth?action=login**
**Purpose**: User login page
```typescript
const UserLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      if (success) {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        
        // Check if admin tries to login here, logout and show error
        if (currentUser.role === 'admin' || currentUser.role === 'superadmin') {
          await logout();
          toast({
            title: "Access denied",
            description: "Admin users must use the admin login page",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Login successful",
            description: "Redirecting...",
          });
          navigate("/");
        }
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="login-page">
        <Card>
          <h1>Login</h1>
          <form onSubmit={handleLogin}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <Link to="/register">Don't have an account? Register</Link>
        </Card>
      </div>
      <Footer />
    </div>
  );
};
```
**API Endpoints Used**:
- `POST /auth?action=login` - User authentication

### 📄 `src/pages/AdminDashboard.tsx` → **Multiple Admin Endpoints**
**Purpose**: Admin dashboard untuk manage products dan users
```typescript
const AdminDashboard = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [productsData, usersData, categoriesData] = await Promise.all([
        api.getProducts(),
        api.getAllUsers(),
        api.getCategories()
      ]);
      setProducts(productsData);
      setUsers(usersData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (productData: any) => {
    try {
      const result = await api.createProduct(productData);
      if (result.success) {
        toast({ title: "Product created successfully" });
        loadData(); // Reload data
      }
    } catch (error) {
      toast({ title: "Error creating product", variant: "destructive" });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const result = await api.deleteProduct(productId);
      if (result.success) {
        toast({ title: "Product deleted successfully" });
        loadData(); // Reload data
      }
    } catch (error) {
      toast({ title: "Error deleting product", variant: "destructive" });
    }
  };

  return (
    <div>
      <Navbar />
      <div className="admin-dashboard">
        <h1>Admin Dashboard</h1>
        
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <div className="products-management">
              <Button onClick={() => setShowProductForm(true)}>
                Add New Product
              </Button>
              <div className="products-table">
                {products.map((product) => (
                  <div key={product.id} className="product-row">
                    <span>{product.name}</span>
                    <span>${formatPrice(product.price)}</span>
                    <div className="actions">
                      <Button onClick={() => handleEditProduct(product)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="users">
            <div className="users-management">
              <Button onClick={() => setShowUserForm(true)}>
                Add New User
              </Button>
              <div className="users-table">
                {users.map((user) => (
                  <div key={user.id} className="user-row">
                    <span>{user.username}</span>
                    <span>{user.email}</span>
                    <span>{user.role}</span>
                    <Button variant="destructive" onClick={() => handleDeleteUser(user.id)}>
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
```
**API Endpoints Used**:
- `GET /products` - Load all products
- `POST /products` - Create new product
- `PUT /products` - Update product
- `DELETE /products` - Delete product
- `GET /auth?action=getUsers` - Get all users
- `POST /auth?action=createUser` - Create new user
- `DELETE /auth?action=deleteUser` - Delete user
- `GET /categories` - Load categories

---

## 🔄 Context Management

### 📄 `src/contexts/AuthContext.tsx`
**Purpose**: Authentication state management
```typescript
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(username, password);
      if (response.success) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        setUser(response.user);
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };
};
```
**Functions**:
- Authentication state management
- JWT token handling
- User session persistence
- Login/logout functionality

### 📄 `src/contexts/CartContext.tsx`
**Purpose**: Shopping cart state management
```typescript
const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (product: Product) => {
    try {
      await api.addToCart(product.id, 1);
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        setCartItems(items => 
          items.map(item => 
            item.id === product.id 
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setCartItems(items => [...items, { ...product, quantity: 1 }]);
      }
      
      setCartCount(prev => prev + 1);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
};
```
**Functions**:
- Cart state management
- Add/remove/update cart items
- Cart count tracking
- API synchronization

---

## 🛡️ Route Protection

### 📄 `src/components/ProtectedRoute.tsx`
**Purpose**: Route protection untuk authenticated pages
```typescript
const ProtectedRoute = ({ 
  children, 
  requireAuth = false 
}: { 
  children: React.ReactNode;
  requireAuth?: boolean;
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && requireAuth && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, requireAuth, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
```
**Functions**:
- Authentication check
- Redirect to login jika tidak authenticated
- Loading state handling
- Admin role verification

---

## 📊 API Endpoints Summary

### 🔐 Authentication Endpoints
- `POST /auth?action=login` - User login
- `POST /auth?action=register` - User registration
- `GET /auth?action=getCurrentUser` - Get current user
- `GET /auth?action=getUsers` - Get all users (admin)
- `POST /auth?action=createUser` - Create user (admin)
- `DELETE /auth?action=deleteUser` - Delete user (admin)

### 🛒 Product Endpoints
- `GET /products` - Get all products
- `GET /products?id={id}` - Get single product
- `GET /products?search={query}` - Search products
- `GET /products?category={categoryId}` - Get products by category
- `POST /products` - Create product (admin)
- `PUT /products` - Update product (admin)
- `DELETE /products` - Delete product (admin)

### 🛍️ Cart Endpoints
- `GET /cart` - Get cart items
- `POST /cart` - Add to cart
- `PUT /cart` - Update cart item
- `DELETE /cart` - Remove from cart

### 📦 Order Endpoints
- `POST /orders` - Create order
- `GET /orders` - Get user orders
- `PUT /orders` - Update order status (admin)

### 📂 Category Endpoints
- `GET /categories` - Get all categories
- `POST /categories` - Create category (admin)
- `PUT /categories` - Update category (admin)
- `DELETE /categories` - Delete category (admin)

---

*Dokumentasi ini fokus pada implementasi pages dan endpoints yang membangun website e-commerce.*
