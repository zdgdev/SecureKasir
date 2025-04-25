import React, { createContext, useContext, useState } from 'react';
import { CartItem, Transaction } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId } from '../utils/formatter';

interface CartContextProps {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'subtotal'>) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  discount: number;
  setDiscount: (discount: number) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  calculateTotal: () => { subtotal: number; total: number };
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use localStorage hooks to persist cart and transactions
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('pos-transactions', []);

  // Add item to cart, update quantity if it already exists
  const addToCart = (item: Omit<CartItem, 'subtotal'>) => {
    const existingItem = cart.find(cartItem => cartItem.productId === item.productId);
    
    if (existingItem) {
      updateQuantity(item.productId, existingItem.quantity + item.quantity);
    } else {
      const newItem = {
        ...item,
        subtotal: item.price * item.quantity
      };
      setCart(prev => [...prev, newItem]);
    }
  };

  // Update quantity of an item in cart
  const updateQuantity = (productId: string, quantity: number) => {
    setCart(prev => 
      prev.map(item => 
        item.productId === productId 
          ? { ...item, quantity, subtotal: item.price * quantity } 
          : item
      )
    );
  };

  // Remove an item from cart
  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
  };

  // Clear the cart
  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
    const total = subtotal - discount;
    return { subtotal, total: total < 0 ? 0 : total };
  };

  // Add a new transaction
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: generateId(),
    };
    setTransactions(prev => [...prev, newTransaction]);
    clearCart();
  };

  const value = {
    cart,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    discount,
    setDiscount,
    transactions,
    addTransaction,
    calculateTotal
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};