"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  FiBell,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo,
  FiShoppingBag,
  FiUsers,
  FiTruck,
  FiPackage,
  FiDollarSign,
  FiTrash2,
  FiCheck,
  FiSettings,
  FiMail,
  FiMessageSquare,
  FiStar,
  FiHeart,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Notification types
type NotificationType =
  | "order"
  | "user"
  | "product"
  | "payment"
  | "shipping"
  | "system"
  | "promotion";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  link?: string;
  image?: string;
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order #ORD-12345",
    message: "A new order has been placed by John Doe. Total: ৳2,450",
    type: "order",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60000), // 5 minutes ago
    link: "/dashboard/orders/12345",
  },
  {
    id: "2",
    title: "Low Stock Alert",
    message: "Product 'Smart Watch Pro' is running low on stock (Only 5 left)",
    type: "product",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60000), // 30 minutes ago
    link: "/dashboard/products",
  },
  {
    id: "3",
    title: "New User Registered",
    message: "Sarah Ahmed has created a new account",
    type: "user",
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600000), // 2 hours ago
    link: "/dashboard/users",
  },
  {
    id: "4",
    title: "Payment Received",
    message: "Payment of ৳5,600 has been received for Order #ORD-12340",
    type: "payment",
    read: true,
    createdAt: new Date(Date.now() - 1 * 86400000), // 1 day ago
    link: "/dashboard/orders/12340",
  },
  {
    id: "5",
    title: "Order Shipped",
    message: "Order #ORD-12338 has been shipped via Sundarban Courier",
    type: "shipping",
    read: true,
    createdAt: new Date(Date.now() - 2 * 86400000), // 2 days ago
    link: "/dashboard/orders/12338",
  },
  {
    id: "6",
    title: "Product Review",
    message: "New 5-star review on 'Wireless Headphones' by Mike Ross",
    type: "product",
    read: false,
    createdAt: new Date(Date.now() - 3 * 3600000), // 3 hours ago
    link: "/dashboard/products",
  },
  {
    id: "7",
    title: "System Update",
    message: "System will undergo maintenance on June 10, 2026 at 2:00 AM",
    type: "system",
    read: false,
    createdAt: new Date(Date.now() - 12 * 3600000), // 12 hours ago
    link: "/dashboard/settings",
  },
  {
    id: "8",
    title: "Flash Sale Alert",
    message: "Summer Flash Sale starts tomorrow! Get up to 50% off",
    type: "promotion",
    read: true,
    createdAt: new Date(Date.now() - 3 * 86400000), // 3 days ago
    link: "/dashboard/promotions",
  },
];

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "order":
      return <FiShoppingBag className="text-blue-400" />;
    case "user":
      return <FiUsers className="text-green-400" />;
    case "product":
      return <FiPackage className="text-purple-400" />;
    case "payment":
      return <FiDollarSign className="text-emerald-400" />;
    case "shipping":
      return <FiTruck className="text-orange-400" />;
    case "system":
      return <FiSettings className="text-gray-400" />;
    case "promotion":
      return <FiStar className="text-yellow-400" />;
    default:
      return <FiBell className="text-primary-gold" />;
  }
};

const getNotificationBgColor = (read: boolean) => {
  return read
    ? "bg-white/5"
    : "bg-primary-gold/10 border-l-4 border-primary-gold";
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");
  const [loading, setLoading] = useState(false);

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (filter === "unread" && notif.read) return false;
    if (filter === "read" && !notif.read) return false;
    if (typeFilter !== "all" && notif.type !== typeFilter) return false;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Mark as read
  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif,
      ),
    );
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <FiBell className="text-primary-gold" />
            Notifications
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Stay updated with your store activities
          </p>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-gray-300 transition-all"
            >
              <FiCheck size={16} />
              Mark all as read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all"
            >
              <FiTrash2 size={16} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Notifications</p>
              <p className="text-2xl font-bold text-white">
                {notifications.length}
              </p>
            </div>
            <div className="p-3 bg-primary-gold/20 rounded-full">
              <FiBell className="text-primary-gold" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Unread</p>
              <p className="text-2xl font-bold text-primary-gold">
                {unreadCount}
              </p>
            </div>
            <div className="p-3 bg-blue-500/20 rounded-full">
              <FiMail className="text-blue-400" size={24} />
            </div>
          </div>
        </div>
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Read</p>
              <p className="text-2xl font-bold text-green-400">
                {notifications.length - unreadCount}
              </p>
            </div>
            <div className="p-3 bg-green-500/20 rounded-full">
              <FiCheckCircle className="text-green-400" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {/* Read status filters */}
        <div className="flex gap-1 bg-white/5 rounded-lg p-1">
          {[
            { value: "all", label: "All", count: notifications.length },
            { value: "unread", label: "Unread", count: unreadCount },
            {
              value: "read",
              label: "Read",
              count: notifications.length - unreadCount,
            },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value as any)}
              className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                filter === f.value
                  ? "bg-primary-gold text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>

        {/* Type filters */}
        <div className="flex flex-wrap gap-1 ml-auto">
          {[
            { value: "all", label: "All Types", icon: null },
            {
              value: "order",
              label: "Orders",
              icon: <FiShoppingBag size={12} />,
            },
            {
              value: "payment",
              label: "Payments",
              icon: <FiDollarSign size={12} />,
            },
            {
              value: "shipping",
              label: "Shipping",
              icon: <FiTruck size={12} />,
            },
            { value: "user", label: "Users", icon: <FiUsers size={12} /> },
            {
              value: "product",
              label: "Products",
              icon: <FiPackage size={12} />,
            },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setTypeFilter(f.value as any)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all ${
                typeFilter === f.value
                  ? "bg-white/20 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10"
              }`}
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <div className="bg-white/5 rounded-xl p-12 text-center border border-white/10">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-white/10 rounded-full">
              <FiBell size={48} className="text-gray-500" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No notifications
          </h3>
          <p className="text-gray-400 text-sm">
            {filter === "unread"
              ? "You have no unread notifications"
              : filter === "read"
                ? "You have no read notifications"
                : "No notifications to display"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`rounded-xl p-4 transition-all hover:scale-[1.01] cursor-pointer ${getNotificationBgColor(
                notification.read,
              )} border border-white/10`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="p-2 bg-white/10 rounded-full">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-white">
                        {notification.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {notification.message}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <FiClock size={12} />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-red-400"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Link button */}
                  {notification.link && (
                    <Link
                      href={notification.link}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 mt-3 text-xs text-primary-gold hover:underline"
                    >
                      View Details →
                    </Link>
                  )}
                </div>

                {/* Unread dot */}
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
