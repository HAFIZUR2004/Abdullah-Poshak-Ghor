"use client";

import { useState } from "react";
import {
  FiTruck,
  FiPackage,
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPhone,
  FiMail,
  FiSearch,
  FiAlertCircle,
} from "react-icons/fi";
import { BiHeadphone } from "react-icons/bi";
import { FaBox } from "react-icons/fa";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

interface OrderData {
  _id?: string;
  orderId: string;
  cartItems: any[];
  formData: {
    name: string;
    phone: string;
    division: string;
    district: string;
    thana: string;
    address: string;
  };
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: string;
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [isTracking, setIsTracking] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState("");

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !phone) {
      setError("Please enter both Order ID and Phone Number");
      return;
    }

    setIsTracking(true);
    setError("");

    try {
      // API কল করে অর্ডার খুঁজুন
      const res = await fetch(`/api/orders/track?orderId=${orderId}&phone=${phone}`);
      const data = await res.json();

      if (res.ok) {
        setOrder(data);
      } else {
        setOrder(null);
        setError(data.error || "No order found. Please check your Order ID and Phone Number.");
      }
    } catch (err) {
      console.error("Track order error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <FiCheckCircle className="text-green-500 text-2xl" />;
      case "shipped":
        return <FiTruck className="text-blue-500 text-2xl" />;
      case "processing":
        return <FiPackage className="text-yellow-500 text-2xl" />;
      case "cancelled":
        return <FiAlertCircle className="text-red-500 text-2xl" />;
      default:
        return <FiClock className="text-gray-500 text-2xl" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "delivered":
        return "Delivered";
      case "shipped":
        return "Shipped";
      case "processing":
        return "Processing";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-BD', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mt-4 bg-linear-to-r from-primary-blue to-primary-gold text-white pt-10 pb-12 md:py-16 rounded-3xl">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="bg-white/20 rounded-full p-3">
            <FaBox size={32} />
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Track Order</h1>
            <p className="text-sm text-white/80 max-w-md mx-auto">
              Track your order status and delivery information
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        {/* Track Order Form */}
        <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
              <FiSearch className="text-primary-gold text-xl" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Track Your Order
            </h2>
          </div>

          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div>
              <label
                htmlFor="orderId"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Order ID *
              </label>
              <input
                type="text"
                id="orderId"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g., ORD-12345678"
                className="w-full text-gray-500 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-gold text-sm"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g., 01797312699"
                className="w-full text-gray-500 px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-gold text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isTracking}
              className="w-full bg-primary-gold text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-highlight transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isTracking ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Tracking...
                </>
              ) : (
                <>
                  <FiTruck size={16} />
                  Track Order
                </>
              )}
            </button>
          </form>
        </div>

        {/* Order Status Display */}
        {order && (
          <div className="mt-8 space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="text-lg font-bold text-gray-800">{order.orderId}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {formatDate(order.createdAt)}
                  </p>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center text-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "pending" ||
                        order.orderStatus === "processing" ||
                        order.orderStatus === "shipped" ||
                        order.orderStatus === "delivered"
                          ? "bg-primary-gold text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <FiPackage size={18} />
                    </div>
                    <p className="text-xs font-medium mt-2">Order Placed</p>
                  </div>
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      order.orderStatus === "processing" ||
                      order.orderStatus === "shipped" ||
                      order.orderStatus === "delivered"
                        ? "bg-primary-gold"
                        : "bg-gray-200"
                    }`}
                  />
                  <div className="flex flex-col items-center text-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "processing" ||
                        order.orderStatus === "shipped" ||
                        order.orderStatus === "delivered"
                          ? "bg-primary-gold text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <FiClock size={18} />
                    </div>
                    <p className="text-xs font-medium mt-2">Processing</p>
                  </div>
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      order.orderStatus === "shipped" || order.orderStatus === "delivered"
                        ? "bg-primary-gold"
                        : "bg-gray-200"
                    }`}
                  />
                  <div className="flex flex-col items-center text-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "shipped" ||
                        order.orderStatus === "delivered"
                          ? "bg-primary-gold text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <FiTruck size={18} />
                    </div>
                    <p className="text-xs font-medium mt-2">Shipped</p>
                  </div>
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      order.orderStatus === "delivered"
                        ? "bg-primary-gold"
                        : "bg-gray-200"
                    }`}
                  />
                  <div className="flex flex-col items-center text-center flex-1">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        order.orderStatus === "delivered"
                          ? "bg-primary-gold text-white"
                          : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <FiCheckCircle size={18} />
                    </div>
                    <p className="text-xs font-medium mt-2">Delivered</p>
                  </div>
                </div>
              </div>

              {/* Status Details */}
              <div className="bg-gradient-to-r from-primary-blue/5 to-primary-gold/5 rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.orderStatus)}
                    <div>
                      <p className="text-xs text-gray-500">Current Status</p>
                      <p
                        className={`font-semibold text-sm ${
                          order.orderStatus === "delivered"
                            ? "text-green-600"
                            : order.orderStatus === "shipped"
                              ? "text-blue-600"
                              : order.orderStatus === "cancelled"
                                ? "text-red-600"
                                : "text-yellow-600"
                        }`}
                      >
                        {getStatusText(order.orderStatus)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated Delivery</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString())}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Items</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {order.cartItems.length} products
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-sm font-semibold text-primary-gold">
                    ৳{order.totalAmount}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payment Method</span>
                  <span className="text-sm font-semibold text-gray-800">
                    {order.paymentMethod === "cash" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-5 md:p-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Delivery Address
              </h3>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-gray-800">{order.formData.name}</p>
                <p className="text-gray-600">{order.formData.phone}</p>
                <p className="text-gray-600">{order.formData.address}</p>
                <p className="text-gray-600">
                  {order.formData.division}, {order.formData.district}, {order.formData.thana}
                </p>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="bg-gradient-to-r from-primary-blue/10 to-primary-gold/10 rounded-2xl p-5 border border-primary-gold/30">
              <div className="flex flex-col items-center text-center gap-3">
                <FiPhone className="text-primary-gold text-2xl" />
                <h3 className="text-base font-bold text-gray-800">
                  Need Help?
                </h3>
                <p className="text-xs text-gray-600">
                  Call us at{" "}
                  <span className="font-semibold text-primary-gold">
                    +880 1797312699
                  </span>{" "}
                  or email us at{" "}
                  <span className="font-semibold text-primary-gold">
                    support@solidbazzar.com
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}