"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiShoppingBag,
  FiLogOut,
  FiEdit2,
  FiLoader,
  FiTrash2,
} from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

interface Order {
  _id: string;
  orderId?: string;
  totalAmount: number;
  orderStatus: string;
  createdAt: string;
}

interface UserData {
  uid: string;
  name: string;
  email: string;
  mobile?: string;
  photoURL: string;
  createdAt: string;
  role: string;
}

export default function ProfilePage() {
  const { user: authUser, loading: authLoading, logout, userRole } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", mobile: "" });
  const [updating, setUpdating] = useState(false);

  const fetchOrders = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/orders?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Order fetch error:", err);
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      const userData: UserData = {
        uid: authUser.uid,
        name: authUser.displayName || "",
        email: authUser.email || "",
        mobile: authUser.phoneNumber || "",
        photoURL: authUser.photoURL || "",
        createdAt: new Date().toISOString(),
        role: userRole || "user",
      };
      setUser(userData);

      setEditForm({
        name: authUser.displayName || "",
        mobile: authUser.phoneNumber || "",
      });

      fetchOrders(authUser.uid);
    }
  }, [authUser, userRole, fetchOrders]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingOrder(orderId);

    try {
      const response = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, userId: user?.uid }),
      });

      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, orderStatus: "cancelled" }
              : order,
          ),
        );
        alert("Order cancelled successfully!");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Cancel error:", error);
      alert("An error occurred while cancelling the order");
    } finally {
      setCancellingOrder(null);
    }
  };

  const handleUpdateProfile = async () => {
    setUpdating(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user?.uid,
          name: editForm.name,
          phone: editForm.mobile,
        }),
      });

      if (response.ok) {
        setUser((prev) =>
          prev
            ? { ...prev, name: editForm.name, mobile: editForm.mobile }
            : null,
        );
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-6 md:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Profile Header */}
          <div className="bg-linear-to-r from-primary-gold to-glow-gold rounded-xl p-5 md:p-6 mb-6 md:mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center">
                  {user?.photoURL ? (
                    <Image
                      src={user.photoURL}
                      alt={user.name}
                      width={64}
                      height={64}
                      className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold">
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white">
                    {user?.name || "User"}
                  </h1>
                  <p className="text-white/80 text-sm">
                    {user?.email || "No email"}
                  </p>
                  {userRole === "admin" && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-xs text-white">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleLogout}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition flex items-center justify-center gap-2 text-sm"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 sm:flex-none px-4 py-2 bg-white text-primary-gold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 text-sm"
                >
                  <FiEdit2 size={16} />
                  Edit
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 md:gap-6">
            {/* Profile Info */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                Profile Information
              </h2>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.mobile}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mobile: e.target.value })
                      }
                      placeholder="Not provided"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-gold text-sm"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleUpdateProfile}
                      disabled={updating}
                      className="flex-1 bg-primary-gold text-white py-2 rounded-lg font-semibold hover:bg-highlight transition disabled:opacity-50 text-sm"
                    >
                      {updating ? (
                        <div className="flex items-center justify-center gap-2">
                          <FiLoader className="animate-spin" size={16} />
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Full Name
                    </p>
                    <p className="text-gray-800 text-sm md:text-base">
                      {user?.name || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Email
                    </p>
                    <p className="text-gray-800 text-sm md:text-base flex items-center gap-2 break-all">
                      <FiMail size={14} className="text-gray-400 shrink-0" />
                      {user?.email || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Phone
                    </p>
                    <p className="text-gray-800 text-sm md:text-base flex items-center gap-2">
                      <FiPhone size={14} className="text-gray-400" />
                      {user?.mobile || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">
                      Member Since
                    </p>
                    <p className="text-gray-800 text-sm md:text-base flex items-center gap-2">
                      <FiCalendar size={14} className="text-gray-400" />
                      {formatDate(user?.createdAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery Address */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiMapPin className="text-red-500" size={18} />
                Delivery Address
              </h2>
              <div className="space-y-2">
                <p className="text-gray-500 text-sm">No address saved yet</p>
                <p className="text-xs text-gray-400">
                  Add your delivery address for faster checkout
                </p>
              </div>
              <button className="mt-4 text-primary-gold font-medium text-sm hover:text-highlight transition">
                + Add New Address
              </button>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl p-5 md:p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiShoppingBag className="text-primary-gold" size={18} />
                Recent Orders
              </h2>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order._id}
                      className="border-b border-gray-100 pb-3 last:border-0"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {order.orderId || `Order #${order._id?.slice(-6)}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-800">
                            {formatAmount(order.totalAmount)}
                          </p>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                              order.orderStatus === "delivered"
                                ? "bg-green-100 text-green-600"
                                : order.orderStatus === "cancelled"
                                  ? "bg-red-100 text-red-600"
                                  : order.orderStatus === "approved"
                                    ? "bg-blue-100 text-blue-600"
                                    : "bg-yellow-100 text-yellow-600"
                            }`}
                          >
                            {order.orderStatus || "pending"}
                          </span>
                        </div>
                      </div>

                      {order.orderStatus === "pending" && (
                        <button
                          onClick={() =>
                            handleCancelOrder(order.orderId || order._id)
                          }
                          disabled={
                            cancellingOrder === (order.orderId || order._id)
                          }
                          className="mt-2 text-red-500 hover:text-red-600 text-xs font-medium flex items-center gap-1 disabled:opacity-50"
                        >
                          {cancellingOrder === (order.orderId || order._id) ? (
                            <>
                              <FiLoader className="animate-spin" size={12} />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <FiTrash2 size={12} />
                              Cancel Order
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FiShoppingBag className="text-gray-300 text-4xl mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No orders yet</p>
                  <Link
                    href="/shop"
                    className="inline-block mt-3 text-primary-gold text-sm hover:underline"
                  >
                    Start Shopping →
                  </Link>
                </div>
              )}
              {orders.length > 0 && (
                <Link
                  href="/orders"
                  className="inline-block mt-4 text-primary-gold font-medium text-sm hover:text-highlight transition"
                >
                  View All Orders →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </ProtectedRoute>
  );
}
