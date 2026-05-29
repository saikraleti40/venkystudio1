import React from 'react';
import { useAppContext } from '../../context/AppContext';
import { MessageCircle, Image as ImageIcon, Clock, CheckCircle, Package } from 'lucide-react';

export default function AdminDashboard() {
  const { orders, updateOrderStatus } = useAppContext();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Manage your orders and customer requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-800">Recent Orders</h2>
        </div>
        
        {orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No orders yet.</p>
          </div>
        ) : (
          <div className="divide-y">
            {orders.map(order => (
              <div key={order.id} className="p-6 flex flex-col md:flex-row gap-6 items-start md:items-center">
                {/* Photo Preview */}
                <div className="w-32 h-32 bg-gray-100 rounded-lg border overflow-hidden flex-shrink-0 relative group">
                  {order.fileUrl ? (
                    <img src={order.fileUrl} alt={order.fileName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <a href={order.fileUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm font-medium transition-opacity">
                    View Full
                  </a>
                </div>

                {/* Order Details */}
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{order.customerName}</h3>
                      <p className="text-sm text-gray-500">Order ID: #{order.id}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200' :
                      order.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-orange-50 text-orange-700 border-orange-200'
                    }`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="font-medium text-gray-900">{order.size}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Frame</p>
                      <p className="font-medium text-gray-900">{order.frame}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Amount Paid</p>
                      <p className="font-medium text-green-600">₹{order.totalPrice}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date</p>
                      <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 min-w-[140px]">
                  <a 
                    href={`https://wa.me/91${order.customerPhone}?text=Hi ${order.customerName}, regarding your order #${order.id} at Venky Digital Studio...`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                  >
                    <MessageCircle className="w-4 h-4" />
                    WhatsApp
                  </a>
                  
                  <select 
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
