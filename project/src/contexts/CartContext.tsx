import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Car, CartItem } from '../types';
import { differenceInDays, parseISO } from 'date-fns';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (car: Car, startDate: string, endDate: string) => void;
  removeFromCart: (carId: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getCartCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  const calculateTotalDays = (startDate: string, endDate: string): number => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    const days = differenceInDays(end, start);
    return days > 0 ? days : 1; // Minimum 1 day
  };
  
  const calculateTotalPrice = (pricePerDay: number, totalDays: number): number => {
    return pricePerDay * totalDays;
  };
  
  const addToCart = (car: Car, startDate: string, endDate: string) => {
    // Check if car already exists in cart
    const existingItemIndex = cartItems.findIndex(item => item.car.id === car.id);
    
    const totalDays = calculateTotalDays(startDate, endDate);
    const totalPrice = calculateTotalPrice(car.pricePerDay, totalDays);
    
    const newItem: CartItem = {
      car,
      startDate,
      endDate,
      totalDays,
      totalPrice
    };
    
    if (existingItemIndex !== -1) {
      // Replace the existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex] = newItem;
      setCartItems(updatedItems);
    } else {
      // Add new item
      setCartItems(prev => [...prev, newItem]);
    }
  };
  
  const removeFromCart = (carId: number) => {
    setCartItems(prev => prev.filter(item => item.car.id !== carId));
  };
  
  const clearCart = () => {
    setCartItems([]);
  };
  
  const getTotalPrice = (): number => {
    return cartItems.reduce((total, item) => total + item.totalPrice, 0);
  };
  
  const getCartCount = (): number => {
    return cartItems.length;
  };
  
  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        addToCart, 
        removeFromCart, 
        clearCart, 
        getTotalPrice, 
        getCartCount 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};