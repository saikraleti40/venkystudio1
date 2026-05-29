import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  fileName: string;
  fileUrl: string; // Object URL for session or base64
  size: string;
  frame: string;
  totalPrice: number;
  status: 'pending' | 'processing' | 'completed';
  date: string;
}

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  orders: Order[];
  addOrder: (order: Omit<Order, 'id' | 'date' | 'status'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  adminPhone: string;
  adminEmail: string;
  adminInsta: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('venky_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user");
      }
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('venky_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('venky_user');
  };

  const addOrder = (orderData: Omit<Order, 'id' | 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: 'pending'
    };
    // In a real app, this goes to a DB. Here we keep it in memory state for the session
    // so admin can see it if they log in without hard refreshing.
    setOrders(prev => [newOrder, ...prev]);
    toast.success('Order placed successfully!');
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    toast.success('Order status updated!');
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      orders,
      addOrder,
      updateOrderStatus,
      adminPhone: '919876543210',
      adminEmail: 'admin@venkydigital.com',
      adminInsta: '@venkydigitalstudio'
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
