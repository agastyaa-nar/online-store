import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  cartCount: number;
  addToCart: (product: any) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user, isAuthenticated } = useAuth();

  // Generate a session ID for cart persistence based on user
  const getSessionId = () => {
    if (isAuthenticated && user) {
      // For authenticated users, use user ID as session
      return `user_${user.id}`;
    } else {
      // For anonymous users, use browser session
      let sessionId = localStorage.getItem('anonymous_session_id');
      if (!sessionId) {
        sessionId = 'anonymous_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('anonymous_session_id', sessionId);
      }
      return sessionId;
    }
  };

  const addToCart = async (product: any) => {
    const sessionId = getSessionId();
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          product_id: product.id,
          quantity: 1
        })
      });

      if (response.ok) {
        // Update local state
        setCartItems(prev => {
          const existingItem = prev.find(item => item.id === product.id);
          if (existingItem) {
            return prev.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            return [...prev, {
              id: product.id,
              name: product.name,
              price: product.price,
              image_url: product.image_url,
              quantity: 1
            }];
          }
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const removeFromCart = async (productId: string) => {
    const sessionId = getSessionId();
    
    try {
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

      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    const sessionId = getSessionId();
    
    try {
      const response = await fetch(`${API_BASE_URL}/cart`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          product_id: productId,
          quantity: quantity
        })
      });

      if (response.ok) {
        if (quantity <= 0) {
          setCartItems(prev => prev.filter(item => item.id !== productId));
        } else {
          setCartItems(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
          ));
        }
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    const sessionId = getSessionId();
    
    try {
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

      if (response.ok) {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  // Load cart items on mount
  useEffect(() => {
    const loadCartItems = async () => {
      const sessionId = getSessionId();
      
      try {
        const response = await fetch(`${API_BASE_URL}/cart?session_id=${sessionId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setCartItems(data.items || []);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    };

    loadCartItems();
  }, [user, isAuthenticated]); // Reload cart when user changes

  return (
    <CartContext.Provider value={{
      cartItems,
      cartCount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
};
