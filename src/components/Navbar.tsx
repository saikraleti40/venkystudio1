import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Camera, LogOut, Settings, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to={user?.role === 'admin' ? '/admin' : '/customer'} className="flex items-center gap-2">
            <img src="/uploads/upload_1.webp" alt="Venky Digital Studio" className="h-10 w-10 object-cover rounded-md" onError={(e) => { e.currentTarget.style.display='none'; }} />
            <span className="font-bold text-xl text-gray-900 tracking-tight">Venky Digital Studio</span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, <span className="font-medium">{user.name}</span>
                </span>
                
                {user.role === 'admin' && (
                  <>
                    <Link to="/admin" className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors" title="Dashboard">
                      <LayoutDashboard className="w-5 h-5" />
                    </Link>
                    <Link to="/admin/settings" className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors" title="Settings">
                      <Settings className="w-5 h-5" />
                    </Link>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2">Login</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
