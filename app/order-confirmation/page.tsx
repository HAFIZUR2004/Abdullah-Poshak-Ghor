"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, Package, Truck, Clock, MapPin, Phone, User, ArrowLeft } from "lucide-react";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<any>(null);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    // Generate order ID
    setOrderId(`ORD-${Date.now().toString().slice(-8)}`);
    
    // Get order data from localStorage
    const data = localStorage.getItem('orderData');
    if (data) {
      setOrderData(JSON.parse(data));
    }
    setLoading(false);
  }, []);

  // Save order to MongoDB when data is loaded
  useEffect(() => {
    const saveOrderToDatabase = async () => {
      if (!orderData || !orderId) return;

      setSaving(true);
      setSaveError(null);

      try {
        const response = await fetch('/api/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...orderData,
            orderId,
            orderStatus: "pending",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to save order');
        }

        console.log('Order saved to database successfully');
        
        // Clear checkout data after successful save
        localStorage.removeItem('orderData');
      } catch (error) {
        console.error('Error saving order to database:', error);
        setSaveError('Failed to save order. Please contact support.');
      } finally {
        setSaving(false);
      }
    };

    if (orderData && orderId) {
      saveOrderToDatabase();
    }
  }, [orderData, orderId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-700">No order found</h2>
          <button 
            onClick={() => router.push('/shop')}
            className="mt-4 bg-pink-500 text-white px-6 py-2 rounded-lg"
          >
            Go to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4">
        {/* Back Button */}
        <button 
          onClick={() => router.push('/shop')}
          className="flex items-center gap-2 text-gray-500 hover:text-pink-500 transition mb-4 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </button>

        {/* Success Icon */}
        <div className="text-center mb-6">
          <div className="bg-green-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🎉 Order Placed!</h1>
          <p className="text-gray-600">Thank you for your order!</p>
        </div>

        {/* Save Status */}
        {saving && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
              <p className="text-blue-600 text-sm">Saving your order to database...</p>
            </div>
          </div>
        )}

        {saveError && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-center">
            <p className="text-red-600 text-sm">{saveError}</p>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Order Details</h2>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs font-semibold">
              {orderData.paymentMethod === "cash" ? "COD" : "Online"}
            </span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID</span>
              <span className="font-semibold text-gray-800">{orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Amount</span>
              <span className="font-bold text-pink-600">৳{orderData.totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-800">
                {orderData.paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Delivery Charge</span>
              <span className="font-semibold text-gray-800">৳{orderData.deliveryCharge}</span>
            </div>
          </div>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Delivery Information</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{orderData.formData.name}</p>
                <p className="text-gray-600">{orderData.formData.phone}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-800">{orderData.formData.address}</p>
                <p className="text-gray-600">
                  {orderData.formData.division}, {orderData.formData.district}, {orderData.formData.thana}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Order Items ({orderData.cartItems.length})</h2>
          <div className="space-y-3">
            {orderData.cartItems.map((item: any, index: number) => (
              <div key={index} className="flex items-start justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  {item.images?.[0] ? (
                    <img 
                      src={item.images[0]} 
                      alt={item.name} 
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => router.push('/shop')}
            className="flex-1 bg-pink-500 text-white py-3 rounded-lg font-semibold hover:bg-pink-600 transition"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => router.push('/track-order')}
            className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Track Order
          </button>
        </div>
      </div>
    </div>
  );
}