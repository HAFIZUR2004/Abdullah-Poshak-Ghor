"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth"; // 🔥 যোগ করতে হবে
import { useRouter } from "next/navigation"; // 🔥 যোগ করতে হবে
import Link from "next/link";
import {
  FiPlus,
  FiSearch,
  FiTrendingUp,
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiClock,
  FiStar,
  FiUser,
  FiHeart,
  FiShoppingBag,
} from "react-icons/fi";

export default function DashboardPage() {
  const { userRole, loading } = useAuth(); // 🔥 যোগ করতে হবে
  const router = useRouter(); // 🔥 যোগ করতে হবে
  const [activeTab, setActiveTab] = useState("overview");

  // 🔥 Role check - অ্যাডমিন না হলে হোমে পাঠান
  useEffect(() => {
    if (!loading && userRole !== "admin") {
      router.push("/");
    }
  }, [userRole, loading, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-gold"></div>
      </div>
    );
  }

  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className="p-6">
      {/* Top Navigation Bar */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/10 px-6 py-4 mb-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div className="relative w-64 hidden md:block">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="bg-gradient-to-r from-amber-500 to-yellow-500 rounded-lg text-white font-medium px-4 py-2 hover:shadow-lg transition-all">
              <FiPlus size={18} className="inline mr-1" />
              New Order
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={<FiDollarSign />}
            label="Total Revenue"
            value="$12,450"
            change="+12.5%"
            color="amber"
          />
          <StatCard
            icon={<FiPackage />}
            label="Total Orders"
            value="342"
            change="+8.2%"
            color="blue"
          />
          <StatCard
            icon={<FiUsers />}
            label="Total Customers"
            value="1,245"
            change="+23.4%"
            color="green"
          />
          <StatCard
            icon={<FiTrendingUp />}
            label="Growth Rate"
            value="18.7%"
            change="+4.1%"
            color="purple"
          />
        </div>

        {/* Charts and Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Orders Table */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Recent Orders</h3>
              <Link
                href="/dashboard/orders"
                className="text-amber-600 font-medium hover:underline text-sm"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <th className="pb-3 pr-4">Order ID</th>
                    <th className="pb-3 pr-4">Customer</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Date</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <OrderRow
                    id="#12345"
                    customer="John Doe"
                    amount="$125.00"
                    status="Completed"
                    date="2024-01-15"
                  />
                  <OrderRow
                    id="#12346"
                    customer="Jane Smith"
                    amount="$89.50"
                    status="Pending"
                    date="2024-01-15"
                  />
                  <OrderRow
                    id="#12347"
                    customer="Bob Johnson"
                    amount="$234.00"
                    status="Processing"
                    date="2024-01-14"
                  />
                  <OrderRow
                    id="#12348"
                    customer="Alice Brown"
                    amount="$67.25"
                    status="Completed"
                    date="2024-01-14"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-4">
              <ActivityItem
                icon={<FiUser />}
                text="New user registered"
                time="2 min ago"
                color="blue"
              />
              <ActivityItem
                icon={<FiShoppingBag />}
                text="New order #12345"
                time="15 min ago"
                color="green"
              />
              <ActivityItem
                icon={<FiHeart />}
                text="Product added to favorites"
                time="1 hour ago"
                color="red"
              />
              <ActivityItem
                icon={<FiStar />}
                text="New review posted"
                time="2 hours ago"
                color="yellow"
              />
              <ActivityItem
                icon={<FiClock />}
                text="Order #12342 delivered"
                time="3 hours ago"
                color="purple"
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <QuickAction
            title="Add New Product"
            description="Add a new product to your store"
            icon={<FiPlus />}
            color="amber"
          />
          <QuickAction
            title="View Analytics"
            description="Check your store performance"
            icon={<FiTrendingUp />}
            color="blue"
          />
          <QuickAction
            title="Manage Inventory"
            description="Update stock levels"
            icon={<FiPackage />}
            color="green"
          />
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StatCard({ icon, label, value, change, color }: { icon: React.ReactNode; label: string; value: string; change: string; color: 'amber' | 'blue' | 'green' | 'purple'; }) {
  const colorClasses = {
    amber: "bg-amber-100 text-amber-600",
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
        <span
          className={`text-xs font-semibold ${
            change.startsWith("+") ? "text-green-600" : "text-red-600"
          }`}
        >
          {change}
        </span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  );
}

function OrderRow({ id, customer, amount, status, date }: { id: string; customer: string; amount: string; status: 'Completed' | 'Pending' | 'Processing'; date: string; }) {
  const statusColors = {
    Completed: "bg-green-100 text-green-600",
    Pending: "bg-yellow-100 text-yellow-600",
    Processing: "bg-blue-100 text-blue-600",
  };

  return (
    <tr className="border-t border-gray-100 hover:bg-gray-50">
      <td className="py-3 pr-4 font-medium text-gray-800">{id}</td>
      <td className="py-3 pr-4 text-gray-600">{customer}</td>
      <td className="py-3 pr-4 font-medium text-gray-800">{amount}</td>
      <td className="py-3 pr-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
        >
          {status}
        </span>
      </td>
      <td className="py-3 text-gray-500">{date}</td>
    </tr>
  );
}

function ActivityItem({ icon, text, time, color }: { icon: React.ReactNode; text: string; time: string; color: 'blue' | 'green' | 'red' | 'yellow' | 'purple'; }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
    yellow: "bg-yellow-100 text-yellow-600",
    purple: "bg-purple-100 text-purple-600",
  };

  return (
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-800">{text}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

function QuickAction({ title, description, icon, color }: { title: string; description: string; icon: React.ReactNode; color: 'amber' | 'blue' | 'green'; }) {
  const colorClasses: Record<'amber' | 'blue' | 'green', string> = {
    amber: "bg-amber-500 hover:bg-amber-600",
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
  };

  return (
    <button
      className={`${colorClasses[color]} rounded-xl p-6 text-white text-left hover:shadow-lg transition-all`}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-white/20 rounded-lg">{icon}</div>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
}
