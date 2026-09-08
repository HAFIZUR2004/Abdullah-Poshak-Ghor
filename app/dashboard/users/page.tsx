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
  FiUserPlus,
  FiChevronDown,
  FiClock,
} from "react-icons/fi";
import Link from "next/link";
import { toast } from "react-hot-toast";
import Image from "next/image";
import Swal from "sweetalert2";

type UserRole = "user" | "admin" | "super_admin";
type UserStatus = "pending" | "active" | "suspended";

interface User {
  _id: string;
  uid: string;
  name: string;
  email: string;
  mobile: string;
  provider: string;
  photoURL: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  lastLogin?: string;
  address?: {
    division?: string;
    district?: string;
    thana?: string;
    address?: string;
  };
}

/* =========================================================
   ROLE BADGE
========================================================= */

const RoleBadge = ({ role }: { role: UserRole }) => {
  const config: Record<
    UserRole,
    { label: string; className: string }
  > = {
    user: {
      label: "User",
      className:
        "bg-slate-500/10 text-slate-300 border-slate-500/20",
    },
    admin: {
      label: "Admin",
      className:
        "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    super_admin: {
      label: "Super Admin",
      className:
        "bg-purple-500/10 text-purple-400 border-purple-500/20",
    },
  };

  const item = config[role];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.className}`}
    >
      <FiShield size={12} />
      {item.label}
    </span>
  );
};

/* =========================================================
   STATUS BADGE
========================================================= */

const StatusBadge = ({ status }: { status: UserStatus }) => {
  const config: Record<
    UserStatus,
    { label: string; className: string }
  > = {
    active: {
      label: "Active",
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    },
    pending: {
      label: "Pending",
      className:
        "bg-amber-500/10 text-amber-400 border-amber-500/20",
    },
    suspended: {
      label: "Suspended",
      className:
        "bg-red-500/10 text-red-400 border-red-500/20",
    },
  };

  const item = config[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.className}`}
    >
      {status === "active" ? (
        <FiCheck size={12} />
      ) : status === "pending" ? (
        <FiClock size={12} />
      ) : (
        <FiX size={12} />
      )}

      {item.label}
    </span>
  );
};

/* =========================================================
   VIEW USER MODAL
========================================================= */

const ViewUserModal = ({
  user,
  onClose,
  onDelete,
  formatDate,
}: {
  user: User;
  onClose: () => void;
  onDelete: (uid: string, name: string) => void;
  formatDate: (date?: string) => string;
}) => {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#111827] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#111827]/95 px-5 py-4 backdrop-blur md:px-6">
          <div>
            <h2 className="text-lg font-bold text-white">
              User Details
            </h2>
            <p className="mt-0.5 text-xs text-gray-500">
              Account information
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/10 hover:text-white"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-5 md:p-6">
          {/* Profile */}
          <div className="mb-6 flex items-center gap-4 border-b border-white/10 pb-6">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-primary-gold/30 bg-primary-gold/10">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={user.name || "User"}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FiUser
                  className="text-primary-gold"
                  size={34}
                />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-xl font-bold text-white">
                {user.name || "N/A"}
              </h3>

              <p className="mt-1 truncate text-xs text-gray-500">
                UID: {user.uid}
              </p>

              <div className="mt-2 flex flex-wrap gap-2">
                <RoleBadge role={user.role} />
                <StatusBadge status={user.status} />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="mb-6">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
              Contact Information
            </h4>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <FiMail className="shrink-0 text-primary-gold" />
                <div className="min-w-0">
                  <p className="text-[11px] text-gray-500">Email</p>
                  <p className="truncate text-sm text-gray-200">
                    {user.email || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <FiPhone className="shrink-0 text-primary-gold" />
                <div>
                  <p className="text-[11px] text-gray-500">Mobile</p>
                  <p className="text-sm text-gray-200">
                    {user.mobile || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <FiCalendar className="shrink-0 text-primary-gold" />
                <div>
                  <p className="text-[11px] text-gray-500">Joined</p>
                  <p className="text-sm text-gray-200">
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3">
                <FiCalendar className="shrink-0 text-primary-gold" />
                <div>
                  <p className="text-[11px] text-gray-500">
                    Last Login
                  </p>
                  <p className="text-sm text-gray-200">
                    {formatDate(user.lastLogin)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-3 md:col-span-2">
                <FiShield className="shrink-0 text-primary-gold" />
                <div>
                  <p className="text-[11px] text-gray-500">
                    Login Provider
                  </p>
                  <p className="text-sm capitalize text-gray-200">
                    {user.provider || "email"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {user.address &&
            (user.address.address ||
              user.address.division ||
              user.address.district) && (
              <div className="mb-6">
                <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">
                  Address Information
                </h4>

                <div className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-4">
                  <FiMapPin className="mt-0.5 shrink-0 text-primary-gold" />

                  <div className="text-sm leading-6 text-gray-300">
                    {user.address.address && (
                      <p>{user.address.address}</p>
                    )}

                    <p>
                      {user.address.thana &&
                        `${user.address.thana}, `}
                      {user.address.district &&
                        `${user.address.district}, `}
                      {user.address.division || ""}
                    </p>
                  </div>
                </div>
              </div>
            )}

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row">
            <Link
              href={`/dashboard/users/${user.uid}/edit`}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              <FiEdit2 size={16} />
              Edit User
            </Link>

            <button
              onClick={() => {
                onClose();
                onDelete(
                  user.uid,
                  user.name || user.email || "this user",
                );
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 transition hover:bg-red-500/20"
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

/* =========================================================
   MAIN PAGE
========================================================= */

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [updating, setUpdating] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] =
    useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] =
    useState<UserStatus | "all">("all");

  const [selectedUser, setSelectedUser] =
    useState<User | null>(null);

  const [showViewModal, setShowViewModal] =
    useState(false);

  /* =======================================================
     FETCH USERS
  ======================================================= */

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/users", {
        method: "GET",
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            data?.code ||
            "Failed to fetch users",
        );
      }

      const userList = Array.isArray(data)
        ? data
        : Array.isArray(data.users)
          ? data.users
          : [];

      setUsers(userList);
    } catch (err) {
      console.error("Fetch users error:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to load users";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* =======================================================
     FILTER USERS
  ======================================================= */

  const filteredUsersData = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !search ||
        user.name?.toLowerCase().includes(search) ||
        user.email?.toLowerCase().includes(search) ||
        user.mobile?.toLowerCase().includes(search) ||
        user.uid?.toLowerCase().includes(search);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [
    users,
    searchTerm,
    roleFilter,
    statusFilter,
  ]);

  /* =======================================================
     UPDATE USER
  ======================================================= */

  const updateUser = async ({
    uid,
    role,
    status,
  }: {
    uid: string;
    role?: UserRole;
    status?: UserStatus;
  }) => {
    if (!uid) return;

    const currentUser = users.find(
      (user) => user.uid === uid,
    );

    if (!currentUser) return;

    const previousUsers = [...users];

    // Instant UI update
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.uid === uid
          ? {
              ...user,
              ...(role ? { role } : {}),
              ...(status ? { status } : {}),
            }
          : user,
      ),
    );

    setUpdating(uid);

    try {
      const params = new URLSearchParams();
      params.set("uid", uid);

      const response = await fetch(
        `/api/users?${params.toString()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...(role ? { role } : {}),
            ...(status ? { status } : {}),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            data?.code ||
            "Failed to update user",
        );
      }

      toast.success(
        role
          ? `${currentUser.name || "User"} role changed to ${
              role === "super_admin"
                ? "Super Admin"
                : role === "admin"
                  ? "Admin"
                  : "User"
            }`
          : `${currentUser.name || "User"} status changed to ${
              status
            }`,
        {
          duration: 2500,
        },
      );
    } catch (err) {
      console.error("Update user error:", err);

      // Rollback if API failed
      setUsers(previousUsers);

      toast.error(
        err instanceof Error
          ? err.message
          : "Failed to update user",
      );
    } finally {
      setUpdating(null);
    }
  };

  /* =======================================================
     DELETE USER
  ======================================================= */

  const deleteUser = async (
    uid: string,
    name: string,
  ) => {
    const result = await Swal.fire({
      title: "Delete user?",
      text: `You are about to permanently delete "${name}".`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      background: "#111827",
      color: "#fff",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const params = new URLSearchParams();
      params.set("uid", uid);

      const response = await fetch(
        `/api/users?${params.toString()}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            data?.code ||
            "Failed to delete user",
        );
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.uid !== uid,
        ),
      );

      if (selectedUser?.uid === uid) {
        setSelectedUser(null);
        setShowViewModal(false);
      }

      await Swal.fire({
        title: "Deleted!",
        text: `${name} has been deleted successfully.`,
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        background: "#111827",
        color: "#fff",
      });
    } catch (err) {
      console.error("Delete user error:", err);

      Swal.fire({
        title: "Error",
        text:
          err instanceof Error
            ? err.message
            : "Failed to delete user.",
        icon: "error",
        confirmButtonColor: "#dc2626",
        background: "#111827",
        color: "#fff",
      });
    }
  };

  /* =======================================================
     FORMAT DATE
  ======================================================= */

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "N/A";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  /* =======================================================
     STATS
  ======================================================= */

  const stats = useMemo(
    () => ({
      total: users.length,
      active: users.filter(
        (user) => user.status === "active",
      ).length,
      admins: users.filter(
        (user) => user.role === "admin",
      ).length,
      superAdmins: users.filter(
        (user) => user.role === "super_admin",
      ).length,
      suspended: users.filter(
        (user) => user.status === "suspended",
      ).length,
    }),
    [users],
  );

  /* =======================================================
     LOADING
  ======================================================= */

  if (loading && users.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-primary-gold" />

          <p className="mt-4 text-sm text-gray-500">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 p-4 md:p-6">
      {/* View Modal */}
      {showViewModal && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setShowViewModal(false)}
          onDelete={deleteUser}
          formatDate={formatDate}
        />
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-gold/20 bg-primary-gold/10">
              <FiUsers
                className="text-primary-gold"
                size={21}
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                User Management
              </h1>

              <p className="mt-0.5 text-sm text-gray-500">
                Manage users, roles and account status
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-gray-200 transition hover:border-primary-gold/30 hover:bg-primary-gold/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiRefreshCw
            size={16}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {/* Total */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Total Users
              </p>

              <p className="mt-1 text-2xl font-bold text-white">
                {stats.total}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-gold/10">
              <FiUser
                className="text-primary-gold"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Active */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Active
              </p>

              <p className="mt-1 text-2xl font-bold text-emerald-400">
                {stats.active}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10">
              <FiCheck
                className="text-emerald-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Admin */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Admins
              </p>

              <p className="mt-1 text-2xl font-bold text-blue-400">
                {stats.admins}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10">
              <FiShield
                className="text-blue-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Super Admin */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Super Admins
              </p>

              <p className="mt-1 text-2xl font-bold text-purple-400">
                {stats.superAdmins}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-500/10">
              <FiShield
                className="text-purple-400"
                size={18}
              />
            </div>
          </div>
        </div>

        {/* Suspended */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4 transition hover:-translate-y-0.5 hover:bg-white/[0.05]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">
                Suspended
              </p>

              <p className="mt-1 text-2xl font-bold text-red-400">
                {stats.suspended}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10">
              <FiX
                className="text-red-400"
                size={18}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.035] p-3 md:p-4">
        <div className="flex flex-col gap-3 lg:flex-row">
          {/* Search */}
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={17}
            />

            <input
              type="text"
              placeholder="Search by name, email, phone or UID..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full rounded-xl border border-white/10 bg-black/10 py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-primary-gold/50 focus:bg-black/20"
            />
          </div>

          {/* Role */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(
                  e.target.value as
                    | UserRole
                    | "all",
                )
              }
              className="w-full appearance-none rounded-xl border border-white/10 bg-gray-900 py-2.5 pl-4 pr-10 text-sm text-gray-200 outline-none transition focus:border-primary-gold/50 lg:w-44"
            >
              <option value="all">
                All Roles
              </option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="super_admin">
                Super Admin
              </option>
            </select>

            <FiChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={15}
            />
          </div>

          {/* Status */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | UserStatus
                    | "all",
                )
              }
              className="w-full appearance-none rounded-xl border border-white/10 bg-gray-900 py-2.5 pl-4 pr-10 text-sm text-gray-200 outline-none transition focus:border-primary-gold/50 lg:w-44"
            >
              <option value="all">
                All Status
              </option>
              <option value="active">
                Active
              </option>
              <option value="pending">
                Pending
              </option>
              <option value="suspended">
                Suspended
              </option>
            </select>

            <FiChevronDown
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={15}
            />
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <FiAlertCircle
              className="shrink-0 text-red-400"
              size={20}
            />

            <div>
              <p className="text-sm font-semibold text-red-300">
                Unable to load users
              </p>

              <p className="mt-0.5 text-xs text-red-400/70">
                {error}
              </p>
            </div>
          </div>

          <button
            onClick={fetchUsers}
            className="rounded-lg px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-500/10"
          >
            Try again
          </button>
        </div>
      )}

      {/* Result count */}
      {!error && (
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-300">
              {filteredUsersData.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-300">
              {users.length}
            </span>{" "}
            users
          </p>
        </div>
      )}

      {/* Table */}
      {!error &&
        filteredUsersData.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025] shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead className="border-b border-white/10 bg-white/[0.035]">
                  <tr className="text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4">
                      User
                    </th>

                    <th className="px-5 py-4">
                      Contact
                    </th>

                    <th className="px-5 py-4">
                      Provider
                    </th>

                    <th className="px-5 py-4">
                      Role
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                    <th className="px-5 py-4">
                      Joined
                    </th>

                    <th className="px-5 py-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredUsersData.map(
                    (user) => (
                      <tr
                        key={user.uid}
                        className="group transition hover:bg-white/[0.035]"
                      >
                        {/* User */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-primary-gold/10">
                              {user.photoURL ? (
                                <Image
                                  src={
                                    user.photoURL
                                  }
                                  alt={
                                    user.name ||
                                    "User"
                                  }
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <FiUser
                                  className="text-primary-gold"
                                  size={18}
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[180px] truncate text-sm font-semibold text-white">
                                {user.name ||
                                  "N/A"}
                              </p>

                              <p className="mt-0.5 text-[11px] text-gray-600">
                                {user.uid?.slice(
                                  0,
                                  12,
                                )}
                                ...
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-5 py-4">
                          <div className="space-y-1">
                            <p className="flex max-w-[220px] items-center gap-2 truncate text-xs text-gray-300">
                              <FiMail
                                size={12}
                                className="shrink-0 text-gray-600"
                              />
                              <span className="truncate">
                                {user.email ||
                                  "N/A"}
                              </span>
                            </p>

                            <p className="flex items-center gap-2 text-xs text-gray-500">
                              <FiPhone
                                size={12}
                                className="shrink-0 text-gray-600"
                              />
                              {user.mobile ||
                                "N/A"}
                            </p>
                          </div>
                        </td>

                        {/* Provider */}
                        <td className="px-5 py-4">
                          <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium capitalize text-gray-400">
                            {user.provider ||
                              "email"}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4">
                          <div className="relative inline-block">
                            <select
                              value={user.role}
                              onChange={(e) =>
                                updateUser({
                                  uid: user.uid,
                                  role: e.target
                                    .value as UserRole,
                                })
                              }
                              disabled={
                                updating ===
                                user.uid
                              }
                              className="cursor-pointer appearance-none rounded-lg border border-white/10 bg-gray-900 py-2 pl-3 pr-8 text-xs font-medium text-gray-200 outline-none transition hover:border-primary-gold/30 focus:border-primary-gold/50 disabled:cursor-wait disabled:opacity-50"
                            >
                              <option value="user">
                                User
                              </option>

                              <option value="admin">
                                Admin
                              </option>

                              <option value="super_admin">
                                Super Admin
                              </option>
                            </select>

                            <FiChevronDown
                              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                              size={13}
                            />
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <div className="relative inline-block">
                            <select
                              value={user.status}
                              onChange={(e) =>
                                updateUser({
                                  uid: user.uid,
                                  status:
                                    e.target
                                      .value as UserStatus,
                                })
                              }
                              disabled={
                                updating ===
                                user.uid
                              }
                              className="cursor-pointer appearance-none rounded-lg border border-white/10 bg-gray-900 py-2 pl-3 pr-8 text-xs font-medium text-gray-200 outline-none transition hover:border-primary-gold/30 focus:border-primary-gold/50 disabled:cursor-wait disabled:opacity-50"
                            >
                              <option value="active">
                                Active
                              </option>

                              <option value="pending">
                                Pending
                              </option>

                              <option value="suspended">
                                Suspended
                              </option>
                            </select>

                            <FiChevronDown
                              className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                              size={13}
                            />
                          </div>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-4 text-xs text-gray-500">
                          {formatDate(
                            user.createdAt,
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setSelectedUser(
                                  user,
                                );
                                setShowViewModal(
                                  true,
                                );
                              }}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-primary-gold/10 bg-primary-gold/5 text-primary-gold transition hover:bg-primary-gold/15"
                              title="View Details"
                            >
                              <FiEye
                                size={14}
                              />
                            </button>

                            <Link
                              href={`/dashboard/users/${user.uid}/edit`}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-500/10 bg-blue-500/5 text-blue-400 transition hover:bg-blue-500/15"
                              title="Edit User"
                            >
                              <FiEdit2
                                size={14}
                              />
                            </Link>

                            <button
                              onClick={() =>
                                deleteUser(
                                  user.uid,
                                  user.name ||
                                    user.email ||
                                    "this user",
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/10 bg-red-500/5 text-red-400 transition hover:bg-red-500/15"
                              title="Delete User"
                            >
                              <FiTrash2
                                size={14}
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Empty */}
      {!loading &&
        !error &&
        filteredUsersData.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary-gold/10 bg-primary-gold/5">
              {searchTerm ||
              roleFilter !== "all" ||
              statusFilter !== "all" ? (
                <FiSearch
                  size={27}
                  className="text-primary-gold"
                />
              ) : (
                <FiUserPlus
                  size={27}
                  className="text-primary-gold"
                />
              )}
            </div>

            <h3 className="text-lg font-semibold text-white">
              No users found
            </h3>

            <p className="mx-auto mt-1 max-w-sm text-sm text-gray-500">
              {searchTerm ||
              roleFilter !== "all" ||
              statusFilter !== "all"
                ? "Try changing your search or filters."
                : "Registered users will appear here."}
            </p>

            {(searchTerm ||
              roleFilter !== "all" ||
              statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-5 rounded-lg bg-primary-gold/10 px-4 py-2 text-xs font-semibold text-primary-gold transition hover:bg-primary-gold/20"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
    </div>
  );
}