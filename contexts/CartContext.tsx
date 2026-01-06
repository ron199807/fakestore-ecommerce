import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { CartProduct } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';

interface CartContextType {
  cartItems: CartProduct[];
  addToCart: (product: CartProduct) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [loading, setLoading] = useState(true);

  // Load cart from localStorage
  useEffect(() => {
    const loadCart = () => {
      setLoading(true);
      try {
        if (user) {
          // Load user-specific cart
          const userCartKey = `cart_${user.id}`;
          const savedCart = localStorage.getItem(userCartKey);
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            // If no user cart exists, check for guest cart and migrate it
            const guestCart = localStorage.getItem('guest_cart');
            if (guestCart) {
              const guestCartItems = JSON.parse(guestCart);
              setCartItems(guestCartItems);
              localStorage.setItem(userCartKey, guestCart);
              localStorage.removeItem('guest_cart');
            } else {
              setCartItems([]);
            }
          }
        } else {
          // Load guest cart
          const savedCart = localStorage.getItem('guest_cart');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          } else {
            setCartItems([]);
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [user]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      const userCartKey = `cart_${user.id}`;
      localStorage.setItem(userCartKey, JSON.stringify(cartItems));
    } else {
      localStorage.setItem('guest_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = (product: CartProduct) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity || 1) }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity: product.quantity || 1 }];
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total: getCartTotal(),
    itemCount: getCartItemCount(),
    loading,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};