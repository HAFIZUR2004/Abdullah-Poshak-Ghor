"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCheck,
  FiX,
  FiShield,
  FiTrash2,
  FiEdit2,
  FiEye,
  FiAlertCircle,
  FiSearch,
  FiRefreshCw,
  FiUsers,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Swal from "sweetalert2";

interface User {
  _id: string;
  uid: string;
  name: string;
  email: string;
  mobile: string;
  provider: string;
  photoURL: string;
  role: "user" | "admin" | "moderator";
  status: "active" | "blocked" | "suspended";
  createdAt: string;
  lastLogin: string;
  address?: {
    division: string;
    district: string;
    thana: string;
    address: string;
  };
}

// ViewUserModal (ডার্ক থিম)
const ViewUserModal = ({
  user,
  onClose,
  onDelete,
  formatDate,
}: {
  user: User;
  onClose: () => void;
  onDelete: (uid: string, name: string) => void;
  formatDate: (date: string) => string;
}) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">User Details</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-lg transition text-gray-400"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-700">
            <div className="w-20 h-20 bg-primary-gold/20 rounded-full flex items-center justify-center">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.name}
                  width={80}
                  height={80}
                  className="rounded-full object-cover"
                />
              ) : (
                <FiUser className="text-primary-gold" size={40} />
              )}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">
                {user.name || "N/A"}
              </h3>
              <p className="text-gray-400">UID: {user.uid}</p>
              <div className="flex gap-2 mt-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-purple-500/20 text-purple-400"
                      : user.role === "moderator"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {user.role}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : user.status === "blocked"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-3">
              Contact Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-gray-300">
                <FiMail className="text-primary-gold" />
                <span>{user.email || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <FiPhone className="text-primary-gold" />
                <span>{user.mobile || "N/A"}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <FiCalendar className="text-primary-gold" />
                <span>Joined: {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <FiCalendar className="text-primary-gold" />
                <span>Last Login: {formatDate(user.lastLogin)}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-300">
                <FiShield className="text-primary-gold" />
                <span>Provider: {user.provider || "email"}</span>
              </div>
            </div>
          </div>

          {user.address && (user.address.address || user.address.division) && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-white mb-3">
                Address Information
              </h4>
              <div className="flex items-start gap-2 text-gray-300">
                <FiMapPin className="text-primary-gold mt-0.5" />
                <div>
                  {user.address.address && <p>{user.address.address}</p>}
                  {user.address.thana && <span>{user.address.thana}, </span>}
                  {user.address.district && (
                    <span>{user.address.district}, </span>
                  )}
                  {user.address.division && (
                    <span>{user.address.division}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <Link
              href={`/dashboard/users/${user.uid}/edit`}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FiEdit2 size={16} />
              Edit User
            </Link>
            <button
              onClick={() => {
                onClose();
                onDelete(user.uid, user.name || user.email);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              <FiTrash2 size={16} />
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/users");

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      const userList = data.users || data;
      setUsers(userList);
    } catch (err) {
      console.error("Fetch users error:", err);
      setError("Failed to load users");
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredUsersData = useMemo(() => {
    let filtered = [...users];

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.mobile?.includes(searchTerm) ||
          user.uid?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (roleFilter !== "all") {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter]);

  useEffect(() => {
    const loadUsers = async () => {
      await fetchUsers();
    };
    loadUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (
    userId: string,
    role?: string,
    status?: string,
  ) => {
    if (!userId) return;

    setUpdating(userId);
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, status }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      await fetchUsers();
      toast.success(
        `User ${status ? `status updated to ${status}` : `role updated to ${role}`}`,
      );
    } catch (err) {
      console.error("Update user error:", err);
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setUpdating(null);
    }
  };

  const deleteUser = async (uid: string, name: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You want to delete "${name}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#D98A2B",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#1a1a2e",
      color: "#fff",
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/users/${uid}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchUsers();

      Swal.fire({
        title: "Deleted!",
        text: `${name} has been deleted successfully.`,
        icon: "success",
        confirmButtonColor: "#D98A2B",
        background: "#1a1a2e",
        color: "#fff",
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Delete user error:", err);
      Swal.fire({
        title: "Error!",
        text: "Failed to delete user. Please try again.",
        icon: "error",
        confirmButtonColor: "#D98A2B",
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    admin: users.filter((u) => u.role === "admin").length,
    blocked: users.filter((u) => u.status === "blocked").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-gold"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen">
      {showViewModal && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
          onDelete={deleteUser}
          formatDate={formatDate}
        />
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <FiUsers className="text-primary-gold" />
            User Management
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage all registered users, roles and permissions
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-primary-gold hover:bg-primary-gold/80 text-white rounded-lg transition-all"
        >
          <FiRefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
            </div>
            <div className="p-2 bg-primary-gold/20 rounded-full">
              <FiUser className="text-primary-gold" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Users</p>
              <p className="text-2xl font-bold text-green-400">
                {stats.active}
              </p>
            </div>
            <div className="p-2 bg-green-500/20 rounded-full">
              <FiCheck className="text-green-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Admins</p>
              <p className="text-2xl font-bold text-purple-400">
                {stats.admin}
              </p>
            </div>
            <div className="p-2 bg-purple-500/20 rounded-full">
              <FiShield className="text-purple-400" size={20} />
            </div>
          </div>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Blocked</p>
              <p className="text-2xl font-bold text-red-400">{stats.blocked}</p>
            </div>
            <div className="p-2 bg-red-500/20 rounded-full">
              <FiX className="text-red-400" size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-primary-gold"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-gold"
        >
          <option value="all">All Roles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-primary-gold"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-red-400">
            <FiAlertCircle size={20} />
            <p>{error}</p>
          </div>
          <button
            onClick={fetchUsers}
            className="mt-2 text-red-400 hover:text-red-300 underline text-sm"
          >
            Try again
          </button>
        </div>
      )}

      {/* Users Table */}
      {!error && filteredUsersData.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredUsersData.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-800/50 transition"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-gold/20 rounded-full flex items-center justify-center">
                          {user.photoURL ? (
                            <Image
                              src={user.photoURL}
                              alt={user.name || "User"}
                              width={40}
                              height={40}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <FiUser className="text-primary-gold" size={20} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.uid?.slice(0, 10)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <p className="text-gray-300 flex items-center gap-1 text-sm">
                          <FiMail size={12} className="text-gray-500" />
                          {user.email || "N/A"}
                        </p>
                        <p className="text-gray-300 flex items-center gap-1 text-sm">
                          <FiPhone size={12} className="text-gray-500" />
                          {user.mobile || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.provider === "google"
                            ? "bg-blue-500/20 text-blue-400"
                            : user.provider === "mobile"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                        }`}
                      >
                        {user.provider || "email"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateUserStatus(user.uid, e.target.value, undefined)
                        }
                        disabled={updating === user.uid}
                        className="px-2 py-1 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:border-primary-gold"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          updateUserStatus(user.uid, undefined, e.target.value)
                        }
                        disabled={updating === user.uid}
                        className={`px-2 py-1 bg-gray-800 border border-gray-600 rounded-lg text-sm focus:outline-none focus:border-primary-gold ${
                          user.status === "active"
                            ? "text-green-400"
                            : user.status === "blocked"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }`}
                      >
                        <option value="active" className="text-green-400">
                          Active
                        </option>
                        <option value="blocked" className="text-red-400">
                          Blocked
                        </option>
                        <option value="suspended" className="text-yellow-400">
                          Suspended
                        </option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-sm">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                          className="p-1.5 rounded-lg bg-primary-gold/20 text-primary-gold hover:bg-primary-gold/30 transition"
                          title="View Details"
                        >
                          <FiEye size={14} />
                        </button>
                        <Link
                          href={`/dashboard/users/${user.uid}/edit`}
                          className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                          title="Edit User"
                        >
                          <FiEdit2 size={14} />
                        </Link>
                        <button
                          onClick={() =>
                            deleteUser(user.uid, user.name || user.email)
                          }
                          className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
                          title="Delete User"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!loading && !error && filteredUsersData.length === 0 && (
        <div className="bg-gray-800/30 rounded-xl p-12 text-center border border-gray-700">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary-gold/20 rounded-full">
              <FiUser size={48} className="text-primary-gold" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            No users found
          </h3>
          <p className="text-gray-400 text-sm">
            {searchTerm || roleFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "Users will appear here when you register"}
          </p>
        </div>
      )}
    </div>
  );
}
