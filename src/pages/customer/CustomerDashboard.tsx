import React, { useState, useRef } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Upload, Image as ImageIcon, CreditCard, Mail, Phone, Instagram, MessageCircle, X } from 'lucide-react';
import toast from 'react-hot-toast';

const SIZES = [
  { id: '4x6', name: '4x6 inch', price: 50 },
  { id: '5x7', name: '5x7 inch', price: 80 },
  { id: '8x10', name: '8x10 inch', price: 150 },
  { id: '12x18', name: '12x18 inch', price: 300 },
  { id: 'A4', name: 'A4 (8.3x11.7)', price: 200 },
  { id: 'A3', name: 'A3 (11.7x16.5)', price: 400 },
];

const FRAMES = [
  { id: 'none', name: 'No Frame', price: 0 },
  { id: 'standard', name: 'Standard Black', price: 150 },
  { id: 'premium', name: 'Premium Wood', price: 300 },
  { id: 'metal', name: 'Metal Frame', price: 400 },
];

export default function CustomerDashboard() {
  const { user, addOrder, adminEmail, adminPhone, adminInsta } = useAppContext();
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState(SIZES[0].id);
  const [selectedFrame, setSelectedFrame] = useState(FRAMES[0].id);
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [showPayment, setShowPayment] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setFileUrl(url);
  };

  const currentSize = SIZES.find(s => s.id === selectedSize)!;
  const currentFrame = FRAMES.find(f => f.id === selectedFrame)!;
  const totalPrice = currentSize.price + currentFrame.price;

  const handleCheckout = () => {
    if (!file) {
      toast.error('Please upload a photo first');
      return;
    }
    if (!customerPhone || customerPhone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    setShowPayment(true);
  };

  const handlePaymentSuccess = () => {
    addOrder({
      customerId: user!.id,
      customerName: user!.name,
      customerPhone,
      fileName: file!.name,
      fileUrl, // In real app, we upload to S3/Cloudinary and save the remote URL
      size: currentSize.name,
      frame: currentFrame.name,
      totalPrice,
    });
    
    // Reset form
    setFile(null);
    setFileUrl('');
    setSelectedSize(SIZES[0].id);
    setSelectedFrame(FRAMES[0].id);
    setShowPayment(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Ordering Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Prints & Frames</h2>
            
            {/* Upload Area */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo (Max 10MB)</label>
              <div 
                className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-colors ${file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}
                onClick={() => !file && fileInputRef.current?.click()}
              >
                <div className="space-y-1 text-center">
                  {fileUrl ? (
                    <div className="relative inline-block">
                      <img src={fileUrl} alt="Preview" className="max-h-64 rounded-lg mx-auto shadow-sm" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); setFile(null); setFileUrl(''); if(fileInputRef.current) fileInputRef.current.value=''; }}
                        className="absolute -top-3 -right-3 bg-red-100 text-red-600 rounded-full p-1 hover:bg-red-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 justify-center">
                        <label className="relative cursor-pointer bg-transparent rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                          <span>Upload a file</span>
                          <input ref={fileInputRef} type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Size</label>
                <div className="space-y-2">
                  {SIZES.map(size => (
                    <label key={size.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedSize === size.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="size" value={size.id} checked={selectedSize === size.id} onChange={(e) => setSelectedSize(e.target.value)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <span className="ml-3 block text-sm font-medium text-gray-900">{size.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">₹{size.price}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Frame Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Select Frame</label>
                <div className="space-y-2">
                  {FRAMES.map(frame => (
                    <label key={frame.id} className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${selectedFrame === frame.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'}`}>
                      <div className="flex items-center">
                        <input type="radio" name="frame" value={frame.id} checked={selectedFrame === frame.id} onChange={(e) => setSelectedFrame(e.target.value)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                        <span className="ml-3 block text-sm font-medium text-gray-900">{frame.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">₹{frame.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your WhatsApp/Phone Number</label>
              <input 
                type="tel" 
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Enter 10 digit number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="border-t pt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900">₹{totalPrice}</p>
              </div>
              <button 
                onClick={handleCheckout}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Pay
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar / Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Studio</h3>
            <div className="space-y-4">
              <a href={`mailto:${adminEmail}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-full"><Mail className="w-5 h-5" /></div>
                <span className="text-sm font-medium">{adminEmail}</span>
              </a>
              <a href={`tel:${adminPhone}`} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors">
                <div className="p-2 bg-green-50 text-green-600 rounded-full"><Phone className="w-5 h-5" /></div>
                <span className="text-sm font-medium">+{adminPhone}</span>
              </a>
              <a href={`https://instagram.com/${adminInsta.replace('@', '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-pink-600 transition-colors">
                <div className="p-2 bg-pink-50 text-pink-600 rounded-full"><Instagram className="w-5 h-5" /></div>
                <span className="text-sm font-medium">{adminInsta}</span>
              </a>
              <a href={`https://wa.me/${adminPhone}?text=Hi Venky Digital Studio, I need help with my order.`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-600 hover:text-green-600 transition-colors mt-6 p-4 border rounded-xl hover:border-green-200 hover:bg-green-50">
                <MessageCircle className="w-6 h-6 text-green-500" />
                <div>
                  <p className="font-semibold text-gray-900">Chat on WhatsApp</p>
                  <p className="text-xs text-gray-500">Fastest response</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Mock Modal */}
      {showPayment && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded text-white flex items-center justify-center text-xs font-bold">R</div>
                <span className="font-semibold text-gray-700">Razorpay Demo</span>
              </div>
              <button onClick={() => setShowPayment(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-2">Venky Digital Studio</p>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">₹{totalPrice}</h3>
              
              <div className="space-y-3">
                <button onClick={handlePaymentSuccess} className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition">
                  Success (Demo Pay)
                </button>
                <button onClick={() => { toast.error('Payment Failed'); setShowPayment(false); }} className="w-full bg-gray-100 text-gray-700 font-medium py-3 rounded-lg hover:bg-gray-200 transition">
                  Simulate Failure
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-4">This is a mock payment gateway for demonstration purposes.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
