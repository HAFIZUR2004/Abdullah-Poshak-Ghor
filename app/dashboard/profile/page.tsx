"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiEdit2,
  FiSave,
  FiX,
  FiShield,
  FiGlobe,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiCamera,
  FiLogOut,
} from "react-icons/fi";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";

interface AdminProfileData {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  photoURL: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
  address: {
    division: string;
    district: string;
    thana: string;
    address: string;
  };
  preferences: {
    language: string;
    timezone: string;
    emailNotifications: boolean;
    twoFactorAuth: boolean;
  };
}

export default function DashboardProfilePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const [profile, setProfile] = useState<AdminProfileData>({
    uid: "",
    name: "",
    email: "",
    mobile: "",
    photoURL: "",
    role: "admin",
    status: "active",
    createdAt: "",
    lastLogin: "",
    address: {
      division: "",
      district: "",
      thana: "",
      address: "",
    },
    preferences: {
      language: "bn",
      timezone: "Asia/Dhaka",
      emailNotifications: true,
      twoFactorAuth: false,
    },
  });

  const [editForm, setEditForm] = useState({
    name: "",
    mobile: "",
    address: "",
    division: "",
    district: "",
    thana: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/users?uid=${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          const userData = data.user || data;
          if (userData) {
            setProfile((prev) => ({
              ...prev,
              uid: userData.uid || "",
              name: userData.name || user?.displayName || "",
              email: userData.email || user?.email || "",
              mobile: userData.mobile || "",
              photoURL: userData.photoURL || user?.photoURL || "",
              role: userData.role || "admin",
              status: userData.status || "active",
              createdAt: userData.createdAt || new Date().toISOString(),
              lastLogin: userData.lastLogin || new Date().toISOString(),
              address: userData.address || {
                division: "",
                district: "",
                thana: "",
                address: "",
              },
            }));

            setEditForm({
              name: userData.name || user?.displayName || "",
              mobile: userData.mobile || "",
              address: userData.address?.address || "",
              division: userData.address?.division || "",
              district: userData.address?.district || "",
              thana: userData.address?.thana || "",
            });
          }
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [user]);

  const handleUpdateProfile = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: profile.uid,
          name: editForm.name,
          mobile: editForm.mobile,
          address: {
            division: editForm.division,
            district: editForm.district,
            thana: editForm.thana,
            address: editForm.address,
          },
        }),
      });

      if (response.ok) {
        if (auth.currentUser) {
          await updateProfile(auth.currentUser, {
            displayName: editForm.name,
          });
        }

        setProfile((prev) => ({
          ...prev,
          name: editForm.name,
          mobile: editForm.mobile,
          address: {
            division: editForm.division,
            district: editForm.district,
            thana: editForm.thana,
            address: editForm.address,
          },
        }));

        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError("Failed to update profile");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to logout?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#D98A2B",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
      background: "#1a1a2e",
      color: "#fff",
    });

    if (result.isConfirmed) {
      await logout();
      router.push("/login");

      await Swal.fire({
        title: "Logged Out!",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "#1a1a2e",
        color: "#fff",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <FiUser className="text-primary-gold" />
            Admin Profile
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-gold hover:bg-primary-gold/80 rounded-lg text-white transition-all"
            >
              <FiEdit2 size={16} />
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleUpdateProfile}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white transition-all disabled:opacity-50"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <FiSave size={16} />
                )}
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white transition-all"
              >
                <FiX size={16} />
                Cancel
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-xl flex items-center gap-2 text-green-400">
          <FiCheckCircle />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-xl flex items-center gap-2 text-red-400">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-6 border-b border-white/10 pb-0">
        {[
          { id: "profile", name: "Profile", icon: FiUser },
          { id: "security", name: "Security", icon: FiShield },
          { id: "preferences", name: "Preferences", icon: FiGlobe },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all ${
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

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
              <div className="relative inline-block">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-primary-gold/20 border-4 border-primary-gold">
                  {profile.photoURL ? (
                    <Image
                      src={profile.photoURL}
                      alt={profile.name}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-primary-gold">
                      {profile.name?.charAt(0)?.toUpperCase() || "A"}
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-4 p-2 bg-primary-gold rounded-full text-white hover:bg-primary-gold/80 transition-all">
                  <FiCamera size={14} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-white mt-4">
                {profile.name}
              </h2>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="px-2 py-0.5 bg-primary-gold/20 text-primary-gold rounded-full text-xs font-medium">
                  {profile.role}
                </span>
                <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                  {profile.status}
                </span>
              </div>

              <div className="mt-6 space-y-3 text-left">
                <div className="flex items-center gap-3 text-gray-300">
                  <FiMail className="text-primary-gold" />
                  <span className="text-sm">{profile.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FiPhone className="text-primary-gold" />
                  <span className="text-sm">
                    {profile.mobile || "Not provided"}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FiCalendar className="text-primary-gold" />
                  <span className="text-sm">
                    Joined {formatDate(profile.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FiClock className="text-primary-gold" />
                  <span className="text-sm">
                    Last login {formatDate(profile.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <FiUser className="text-primary-gold" />
                Personal Information
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={editForm.mobile}
                      onChange={(e) =>
                        setEditForm({ ...editForm, mobile: e.target.value })
                      }
                      placeholder="Enter mobile number"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Division
                    </label>
                    <select
                      value={editForm.division}
                      onChange={(e) =>
                        setEditForm({ ...editForm, division: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                    >
                      <option value="">Select Division</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      District
                    </label>
                    <input
                      type="text"
                      value={editForm.district}
                      onChange={(e) =>
                        setEditForm({ ...editForm, district: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Thana/Upazila
                    </label>
                    <input
                      type="text"
                      value={editForm.thana}
                      onChange={(e) =>
                        setEditForm({ ...editForm, thana: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">
                      Full Address
                    </label>
                    <textarea
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      rows={3}
                      placeholder="House #, Road #, Area"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-500 text-sm">Full Name</p>
                    <p className="text-white">{profile.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Mobile Number</p>
                    <p className="text-white">
                      {profile.mobile || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Division</p>
                    <p className="text-white">
                      {profile.address?.division || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">District</p>
                    <p className="text-white">
                      {profile.address?.district || "Not set"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Thana/Upazila</p>
                    <p className="text-white">
                      {profile.address?.thana || "Not set"}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-gray-500 text-sm">Full Address</p>
                    <p className="text-white">
                      {profile.address?.address || "Not set"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === "security" && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiShield className="text-primary-gold" />
            Security Settings
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">
                  Two-Factor Authentication (2FA)
                </p>
                <p className="text-gray-400 text-sm">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      twoFactorAuth: !profile.preferences.twoFactorAuth,
                    },
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  profile.preferences.twoFactorAuth
                    ? "bg-primary-gold"
                    : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    profile.preferences.twoFactorAuth
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Change Password</p>
                <p className="text-gray-400 text-sm">
                  Update your account password
                </p>
              </div>
              <button className="px-4 py-2 bg-primary-gold/20 text-primary-gold rounded-lg hover:bg-primary-gold/30 transition-all">
                Change
              </button>
            </div>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-white font-medium">Email Notifications</p>
                <p className="text-gray-400 text-sm">
                  Receive security alerts via email
                </p>
              </div>
              <button
                onClick={() =>
                  setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      emailNotifications:
                        !profile.preferences.emailNotifications,
                    },
                  })
                }
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  profile.preferences.emailNotifications
                    ? "bg-primary-gold"
                    : "bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                    profile.preferences.emailNotifications
                      ? "translate-x-5"
                      : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FiGlobe className="text-primary-gold" />
            Preferences
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Language
              </label>
              <select
                value={profile.preferences.language}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      language: e.target.value,
                    },
                  })
                }
                className="w-full md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
              >
                <option value="bn">বাংলা (Bangla)</option>
                <option value="en">English</option>
                <option value="ar">العربية (Arabic)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Timezone
              </label>
              <select
                value={profile.preferences.timezone}
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    preferences: {
                      ...profile.preferences,
                      timezone: e.target.value,
                    },
                  })
                }
                className="w-full md:w-64 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-primary-gold"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="America/New_York">
                  America/New York (GMT-5)
                </option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
