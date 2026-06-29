"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiUser,
  FiLock,
  FiMail,
  FiPhone,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
} from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";

interface FormData {
  name: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FirebaseError {
  code: string;
  message: string;
}

interface UserData {
  uid: string;
  name: string;
  email: string;
  mobile: string;
  provider: string;
  photoURL?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [regMethod, setRegMethod] = useState<"email" | "mobile">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Redirect Result Handle করার জন্য useEffect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("✅ Redirect registration successful:", result.user.uid);
          
          const role = await saveUserToDatabase({
            uid: result.user.uid,
            name: result.user.displayName || "",
            email: result.user.email || "",
            mobile: "",
            provider: "google",
            photoURL: result.user.photoURL || "",
          });

          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: result.user.uid,
              name: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL,
              role: role,
            })
          );

          if (role === "admin") {
            router.push("/dashboard");
          } else {
            router.push(redirectUrl);
          }
        }
      } catch (error) {
        console.error("Redirect registration error:", error);
        setError("Google registration failed. Please try again.");
      }
    };

    handleRedirectResult();
  }, [router, redirectUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const saveUserToDatabase = async (userData: UserData): Promise<string> => {
    try {
      console.log("📤 Sending data to database:", userData);
      
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("📥 Server response:", data);

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to save user");
      }

      return data.user?.role || "user";
    } catch (error) {
      console.error("❌ Save user error:", error);
      throw error;
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validation
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      setLoading(false);
      return;
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      const role = await saveUserToDatabase({
        uid: userCredential.user.uid,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile || "",
        provider: "email",
        photoURL: userCredential.user.photoURL || "",
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: userCredential.user.uid,
          name: formData.name,
          email: formData.email,
          role: role,
        })
      );

      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push(redirectUrl);
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const firebaseError = err as FirebaseError;

      if (firebaseError.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please login instead.");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (firebaseError.code === "auth/weak-password") {
        setError("Password is too weak. Use at least 6 characters");
      } else {
        setError(firebaseError.message || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google Register - Popup + Redirect Fallback
  const handleGoogleRegister = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      
      // প্রথমে Popup চেষ্টা করুন
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Popup registration successful:", result.user.uid);
        
        const role = await saveUserToDatabase({
          uid: result.user.uid,
          name: result.user.displayName || "",
          email: result.user.email || "",
          mobile: "",
          provider: "google",
          photoURL: result.user.photoURL || "",
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            uid: result.user.uid,
            name: result.user.displayName,
            email: result.user.email,
            photoURL: result.user.photoURL,
            role: role,
          })
        );

        if (role === "admin") {
          router.push("/dashboard");
        } else {
          router.push(redirectUrl);
        }
      } catch (popupError) {
        const firebaseError = popupError as FirebaseError;
        
        // 🔥 যদি Popup Blocked হয়, তাহলে Redirect ব্যবহার করুন
        if (firebaseError.code === "auth/popup-blocked") {
          console.log("⚠️ Popup blocked, using redirect method...");
          setError("Popup blocked! Redirecting to Google...");
          await signInWithRedirect(auth, provider);
        } else {
          throw popupError;
        }
      }
    } catch (err: unknown) {
      console.error("Google registration error:", err);
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message || "Google registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMobileSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.mobile.trim()) {
      setError("Please enter your mobile number");
      setLoading(false);
      return;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.mobile)) {
      setError("Please enter a valid Bangladeshi mobile number (e.g., 017XXXXXXXX)");
      setLoading(false);
      return;
    }

    try {
      if (!otpSent) {
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.mobile }),
        });

        if (response.ok) {
          setOtpSent(true);
          setError("");
        } else {
          const data = await response.json();
          setError(data.message || "Failed to send OTP");
        }
      } else {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.mobile, otp: otpCode }),
        });

        if (response.ok) {
          const mobileUid = `mobile_${Date.now()}`;

          const role = await saveUserToDatabase({
            uid: mobileUid,
            name: formData.name || "Mobile User",
            email: "",
            mobile: formData.mobile,
            provider: "mobile",
          });

          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: mobileUid,
              name: formData.name || "Mobile User",
              mobile: formData.mobile,
              role: role,
            })
          );

          router.push(redirectUrl);
        } else {
          const data = await response.json();
          setError(data.message || "Invalid OTP code");
        }
      }
    } catch (err: unknown) {
      console.error("Mobile registration error:", err);
      setError("Mobile registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-blue/20 via-white to-primary-gold/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-primary-gold to-glow-gold" />

        <div className="text-center mb-5 md:mb-6">
          <div className="inline-block p-2 md:p-3 bg-linear-to-br from-primary-gold/20 to-glow-gold/20 rounded-full mb-2 md:mb-3">
            <Image
              src="/icon.png"
              alt="Logo"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Create Account
          </h1>
          <p className="text-xs md:text-sm text-gray-500">Join us today</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-3 md:mb-4 text-xs md:text-sm">
            {error}
          </div>
        )}

        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {regMethod === "email" ? (
            <button
              onClick={() => {
                setRegMethod("mobile");
                setError("");
                setOtpSent(false);
              }}
              className="w-full py-2.5 md:py-3 px-3 md:px-4 border border-primary-gold bg-primary-gold/10 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-gold/20 transition-all"
            >
              <FiPhone className="text-primary-gold" size={16} />
              <span className="text-primary-gold font-medium text-sm md:text-base">
                Register with Mobile Number
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                setRegMethod("email");
                setOtpSent(false);
                setError("");
              }}
              className="w-full py-2.5 md:py-3 px-3 md:px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <FiMail className="text-gray-700" size={16} />
              <span className="text-gray-700 font-medium text-sm md:text-base">
                Register with Email
              </span>
            </button>
          )}

          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50"
          >
            <FcGoogle size={18} />
            <span className="text-gray-700 font-medium text-sm md:text-base">
              Register with Google
            </span>
          </button>
        </div>

        <div className="relative my-4 md:my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-400 text-xs uppercase tracking-wider">
              OR
            </span>
          </div>
        </div>

        {regMethod === "email" ? (
          <form onSubmit={handleEmailSubmit} className="space-y-3 md:space-y-4">
            <div className="block">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                <FiUser className="text-gray-400" size={14} />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="block">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                <FiMail className="text-gray-400" size={14} />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="block">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                <FiPhone className="text-gray-400" size={14} />
                <span>Mobile Number (Optional)</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="e.g., 017XXXXXXXX"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none"
              />
            </div>

            <div className="block">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                <FiLock className="text-gray-400" size={14} />
                <span>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="block">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                <FiLock className="text-gray-400" size={14} />
                <span>Confirm Password</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff size={16} />
                  ) : (
                    <FiEye size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-semibold text-white bg-linear-to-r from-primary-gold to-glow-gold hover:shadow-lg transition-all disabled:opacity-50 text-sm md:text-base"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleMobileSubmit}
            className="space-y-3 md:space-y-4"
          >
            <div className="block">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                <FiUser className="text-gray-400" size={14} />
                <span>Full Name (Optional)</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none"
              />
            </div>

            <div className="block">
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                <FiPhone className="text-gray-400" size={14} />
                <span>Mobile Number</span>
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                disabled={otpSent}
                placeholder="e.g., 017XXXXXXXX"
                className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none disabled:bg-gray-100"
                required
              />
            </div>

            {otpSent && (
              <div className="block">
                <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
                  <FiCheckCircle className="text-green-500" size={14} />
                  <span>OTP Code</span>
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 md:px-4 py-2 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none text-center tracking-widest text-base md:text-lg font-bold"
                  required
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-semibold text-white bg-linear-to-r from-primary-gold to-glow-gold hover:shadow-lg transition-all disabled:opacity-50 text-sm md:text-base"
            >
              {loading ? "Processing..." : otpSent ? "Verify OTP" : "Send OTP"}
            </button>
          </form>
        )}

        <div className="text-center mt-4 md:mt-6">
          <p className="text-xs md:text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href={`/login?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-primary-gold font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}