import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPassword = localStorage.getItem('admin_password') || 'password';
    
    if (currentPassword !== storedPassword) {
      toast.error('Current password is incorrect');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    localStorage.setItem('admin_password', newPassword);
    toast.success('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-500">Manage your portal preferences and security.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Change Password</h2>
        </div>
        
        <form onSubmit={handlePasswordChange} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <input 
              type="password" 
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input 
              type="password" 
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button 
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
