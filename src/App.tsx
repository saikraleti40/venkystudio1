import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './context/AppContext';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminSettings from './pages/admin/AdminSettings';

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'customer' | 'admin' }) => {
  const { user } = useAppContext();
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/customer'} replace />;
  }

  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAppContext();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={
            user ? <Navigate to={user.role === 'admin' ? '/admin' : '/customer'} replace /> : <Login />
          } />
          
          {/* Customer Routes */}
          <Route path="/customer" element={
            <ProtectedRoute allowedRole="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
        <Toaster position="top-right" />
      </Router>
    </AppProvider>
  );
}
