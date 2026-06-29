"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  FiSave,
  FiBell,
  FiLock,
  FiUser,
  FiGlobe,
  FiMoon,
  FiSun,
  FiCheckCircle,
  FiAlertCircle,
  FiShoppingBag,
  FiDollarSign,
  FiMail,
  FiPhone,
  FiMapPin,
  FiTrendingUp,
  FiShield,
  FiDatabase,
  FiRefreshCw,
  FiCreditCard,
  FiTruck,
  FiPackage,
  FiUsers,
  FiMessageSquare,
  FiLogOut,
  FiSettings,
  FiHelpCircle,
  FiFileText,
  FiImage,
  FiCode,
  FiServer,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
import Link from "next/link";

// Tab configuration
const tabs = [
  { id: "general", name: "General", icon: FiSettings },
  { id: "store", name: "Store", icon: FiShoppingBag },
  { id: "notifications", name: "Notifications", icon: FiBell },
  { id: "payment", name: "Payment", icon: FiCreditCard },
  { id: "shipping", name: "Shipping", icon: FiTruck },
  { id: "security", name: "Security", icon: FiShield },
  { id: "appearance", name: "Appearance", icon: FiSun },
  { id: "advanced", name: "Advanced", icon: FiCode },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // General Settings
  const [general, setGeneral] = useState({
    storeName: "Solid Bazzar",
    storeTagline: "Your One-Stop Shop",
    storeEmail: "info@solidbazzar.com",
    storePhone: "+880 1234 567890",
    storeAddress: "Dhaka, Bangladesh",
    timezone: "Asia/Dhaka",
    dateFormat: "DD/MM/YYYY",
  });

  // Store Settings
  const [store, setStore] = useState({
    currency: "BDT",
    currencySymbol: "৳",
    taxRate: 15,
    minimumOrderAmount: 0,
    enableReviews: true,
    enableWishlist: true,
    catalogMode: false,
    itemsPerPage: 12,
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    orderAlerts: true,
    lowStockAlerts: true,
    newUserAlerts: true,
    marketingEmails: false,
    weeklyReports: true,
    smsAlerts: false,
  });

  // Payment Settings
  const [payment, setPayment] = useState({
    codEnabled: true,
    bkashEnabled: true,
    nagadEnabled: false,
    rocketEnabled: false,
    stripeEnabled: false,
    sslcommerzEnabled: true,
  });

  // Shipping Settings
  const [shipping, setShipping] = useState({
    freeShipping: false,
    freeShippingMinimum: 1000,
    shippingCost: 60,
    insideDhaka: 50,
    outsideDhaka: 100,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 60,
    loginNotifications: true,
    ipWhitelist: "",
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: "dark",
    primaryColor: "#D98A2B",
    sidebarCollapsed: false,
    animations: true,
    compactMode: false,
  });

  useEffect(() => {
    // Load settings from API
    const loadSettings = async () => {
      try {
        const response = await fetch("/api/admin/settings");
        if (response.ok) {
          const data = await response.json();
          // Update states with data
        }
      } catch (err) {
        console.error("Error loading settings:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          general,
          store,
          notifications,
          payment,
          shipping,
          security,
          appearance,
        }),
      });

      if (response.ok) {
        setSuccess("All settings saved successfully!");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to save settings");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
        <p className="text-gray-400 text-sm mt-1">
          Manage your store configuration and preferences
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-xl flex items-center gap-2 text-green-400 animate-in slide-in-from-top-2">
          <FiCheckCircle className="shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl flex items-center gap-2 text-red-400">
          <FiAlertCircle className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-white/10 pb-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all text-sm font-medium whitespace-nowrap ${
              activeTab === tab.id
                ? "text-primary-gold border-b-2 border-primary-gold bg-primary-gold/10"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
        <div className="p-5 md:p-6">
          {/* General Settings Tab */}
          {activeTab === "general" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiGlobe className="text-primary-gold" />
                General Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={general.storeName}
                    onChange={(e) =>
                      setGeneral({ ...general, storeName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Store Tagline
                  </label>
                  <input
                    type="text"
                    value={general.storeTagline}
                    onChange={(e) =>
                      setGeneral({ ...general, storeTagline: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Store Email
                  </label>
                  <input
                    type="email"
                    value={general.storeEmail}
                    onChange={(e) =>
                      setGeneral({ ...general, storeEmail: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Store Phone
                  </label>
                  <input
                    type="text"
                    value={general.storePhone}
                    onChange={(e) =>
                      setGeneral({ ...general, storePhone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Store Address
                  </label>
                  <textarea
                    value={general.storeAddress}
                    onChange={(e) =>
                      setGeneral({ ...general, storeAddress: e.target.value })
                    }
                    rows={2}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Timezone
                  </label>
                  <select
                    value={general.timezone}
                    onChange={(e) =>
                      setGeneral({ ...general, timezone: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                    <option value="Asia/Kolkata">
                      Asia/Kolkata (GMT+5:30)
                    </option>
                    <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                    <option value="America/New_York">
                      America/New York (GMT-5)
                    </option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Date Format
                  </label>
                  <select
                    value={general.dateFormat}
                    onChange={(e) =>
                      setGeneral({ ...general, dateFormat: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Store Settings Tab */}
          {activeTab === "store" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiShoppingBag className="text-primary-gold" />
                Store Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Currency
                  </label>
                  <select
                    value={store.currency}
                    onChange={(e) =>
                      setStore({ ...store, currency: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  >
                    <option value="BDT">BDT - Bangladeshi Taka</option>
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                    <option value="INR">INR - Indian Rupee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    value={store.taxRate}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        taxRate: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Minimum Order Amount
                  </label>
                  <input
                    type="number"
                    value={store.minimumOrderAmount}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        minimumOrderAmount: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Items Per Page
                  </label>
                  <select
                    value={store.itemsPerPage}
                    onChange={(e) =>
                      setStore({
                        ...store,
                        itemsPerPage: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  >
                    <option value={12}>12 items</option>
                    <option value={24}>24 items</option>
                    <option value={36}>36 items</option>
                    <option value={48}>48 items</option>
                  </select>
                </div>
              </div>
              <div className="space-y-3 pt-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-300">Enable Product Reviews</span>
                  <button
                    onClick={() =>
                      setStore({
                        ...store,
                        enableReviews: !store.enableReviews,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      store.enableReviews ? "bg-primary-gold" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        store.enableReviews
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-300">Enable Wishlist</span>
                  <button
                    onClick={() =>
                      setStore({
                        ...store,
                        enableWishlist: !store.enableWishlist,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      store.enableWishlist ? "bg-primary-gold" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        store.enableWishlist
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          )}
          {/* Notifications Settings Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiBell className="text-primary-gold" />
                Notification Preferences
              </h3>
              <div className="space-y-3">
                {[
                  {
                    key: "emailNotifications",
                    label: "Email Notifications",
                    desc: "Receive email updates about your store",
                  },
                  {
                    key: "orderAlerts",
                    label: "Order Alerts",
                    desc: "Get notified when new orders are placed",
                  },
                  {
                    key: "lowStockAlerts",
                    label: "Low Stock Alerts",
                    desc: "Alert when products are running low",
                  },
                  {
                    key: "newUserAlerts",
                    label: "New User Alerts",
                    desc: "Get notified when new users register",
                  },
                  {
                    key: "marketingEmails",
                    label: "Marketing Emails",
                    desc: "Receive marketing and promotional emails",
                  },
                  {
                    key: "weeklyReports",
                    label: "Weekly Reports",
                    desc: "Get weekly store performance reports",
                  },
                  {
                    key: "smsAlerts",
                    label: "SMS Alerts",
                    desc: "Receive SMS notifications for important events",
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <span className="text-gray-300 block">{item.label}</span>
                      <span className="text-gray-500 text-xs">{item.desc}</span>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]:
                            !notifications[
                              item.key as keyof typeof notifications
                            ],
                        })
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications]
                          ? "bg-primary-gold"
                          : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof typeof notifications]
                            ? "translate-x-5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Payment Settings Tab */}
          {activeTab === "payment" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiCreditCard className="text-primary-gold" />
                Payment Methods
              </h3>
              <div className="space-y-3">
                {[
                  {
                    key: "codEnabled",
                    label: "Cash on Delivery (COD)",
                    icon: "💰",
                  },
                  { key: "bkashEnabled", label: "bKash", icon: "📱" },
                  { key: "nagadEnabled", label: "Nagad", icon: "📱" },
                  { key: "rocketEnabled", label: "Rocket", icon: "🚀" },
                  { key: "sslcommerzEnabled", label: "SSLCommerz", icon: "🔒" },
                  { key: "stripeEnabled", label: "Stripe", icon: "💳" },
                ].map((method) => (
                  <label
                    key={method.key}
                    className="flex items-center justify-between cursor-pointer p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="text-gray-300 flex items-center gap-2">
                      <span>{method.icon}</span>
                      {method.label}
                    </span>
                    <button
                      onClick={() =>
                        setPayment({
                          ...payment,
                          [method.key]:
                            !payment[method.key as keyof typeof payment],
                        })
                      }
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        payment[method.key as keyof typeof payment]
                          ? "bg-primary-gold"
                          : "bg-gray-600"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                          payment[method.key as keyof typeof payment]
                            ? "translate-x-5"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Shipping Settings Tab */}
          {activeTab === "shipping" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiTruck className="text-primary-gold" />
                Shipping Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Standard Shipping Cost
                  </label>
                  <input
                    type="number"
                    value={shipping.shippingCost}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        shippingCost: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Inside Dhaka
                  </label>
                  <input
                    type="number"
                    value={shipping.insideDhaka}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        insideDhaka: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Outside Dhaka
                  </label>
                  <input
                    type="number"
                    value={shipping.outsideDhaka}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        outsideDhaka: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Free Shipping Minimum (BDT)
                  </label>
                  <input
                    type="number"
                    value={shipping.freeShippingMinimum}
                    onChange={(e) =>
                      setShipping({
                        ...shipping,
                        freeShippingMinimum: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                </div>
              </div>
              <label className="flex items-center justify-between cursor-pointer pt-3">
                <span className="text-gray-300">Enable Free Shipping</span>
                <button
                  onClick={() =>
                    setShipping({
                      ...shipping,
                      freeShipping: !shipping.freeShipping,
                    })
                  }
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    shipping.freeShipping ? "bg-primary-gold" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      shipping.freeShipping
                        ? "translate-x-5"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </label>
            </div>
          )}
          {/* Security Settings Tab */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiShield className="text-primary-gold" />
                Security Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    value={security.sessionTimeout}
                    onChange={(e) =>
                      setSecurity({
                        ...security,
                        sessionTimeout: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Auto logout after inactivity
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    IP Whitelist (comma separated)
                  </label>
                  <input
                    type="text"
                    value={security.ipWhitelist}
                    onChange={(e) =>
                      setSecurity({ ...security, ipWhitelist: e.target.value })
                    }
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Only these IPs can access admin panel
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-3">
                <label className="flex items-center justify-between cursor-pointer p-3 bg-white/5 rounded-lg">
                  <div>
                    <span className="text-gray-300 block">
                      Two-Factor Authentication (2FA)
                    </span>
                    <span className="text-gray-500 text-xs">
                      Add an extra layer of security
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setSecurity({
                        ...security,
                        twoFactorAuth: !security.twoFactorAuth,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      security.twoFactorAuth ? "bg-primary-gold" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        security.twoFactorAuth
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer p-3 bg-white/5 rounded-lg">
                  <div>
                    <span className="text-gray-300 block">
                      Login Notifications
                    </span>
                    <span className="text-gray-500 text-xs">
                      Get email when someone logs into your account
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setSecurity({
                        ...security,
                        loginNotifications: !security.loginNotifications,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      security.loginNotifications
                        ? "bg-primary-gold"
                        : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        security.loginNotifications
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          )}

          {/* Appearance Settings Tab */}
          {activeTab === "appearance" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiMoon className="text-primary-gold" />
                Theme & Appearance
              </h3>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Theme Mode
                </label>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setAppearance({ ...appearance, theme: "light" })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      appearance.theme === "light"
                        ? "bg-primary-gold text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <FiSun size={18} />
                    <span>Light</span>
                  </button>
                  <button
                    onClick={() =>
                      setAppearance({ ...appearance, theme: "dark" })
                    }
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                      appearance.theme === "dark"
                        ? "bg-primary-gold text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10"
                    }`}
                  >
                    <FiMoon size={18} />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={appearance.primaryColor}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        primaryColor: e.target.value,
                      })
                    }
                    className="w-12 h-12 rounded-lg cursor-pointer border border-white/10"
                  />
                  <input
                    type="text"
                    value={appearance.primaryColor}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        primaryColor: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                  />
                </div>
              </div>
              <div className="space-y-3 pt-2">
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-300">Enable Animations</span>
                  <button
                    onClick={() =>
                      setAppearance({
                        ...appearance,
                        animations: !appearance.animations,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      appearance.animations ? "bg-primary-gold" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        appearance.animations
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-300">
                    Compact Mode (Smaller spacing)
                  </span>
                  <button
                    onClick={() =>
                      setAppearance({
                        ...appearance,
                        compactMode: !appearance.compactMode,
                      })
                    }
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      appearance.compactMode ? "bg-primary-gold" : "bg-gray-600"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        appearance.compactMode
                          ? "translate-x-5"
                          : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>
          )}
          {/* Advanced Settings Tab */}
          {activeTab === "advanced" && (
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FiCode className="text-primary-gold" />
                Advanced Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    API Rate Limit
                  </label>
                  <input
                    type="number"
                    defaultValue={100}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Requests per minute
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Cache Duration (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue={60}
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Backup Schedule
                  </label>
                  <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                    <option>Never</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Log Level
                  </label>
                  <select className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white">
                    <option>Debug</option>
                    <option>Info</option>
                    <option>Warning</option>
                    <option>Error</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm flex items-center gap-2">
                  <FiAlertCircle />
                  Warning: Changing advanced settings may affect store
                  performance
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 md:px-6 py-4 bg-white/5 border-t border-white/10 flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary-gold hover:bg-primary-gold/80 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Saving...
              </>
            ) : (
              <>
                <FiSave size={18} />
                Save All Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
