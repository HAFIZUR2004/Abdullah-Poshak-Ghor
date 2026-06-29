"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
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
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
} from "firebase/auth";

interface FormData {
  emailOrMobile: string;
  password: string;
}

interface FirebaseError {
  code: string;
  message: string;
}

interface FirebaseUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  phoneNumber: string | null;
  photoURL: string | null;
}

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const [loginMethod, setLoginMethod] = useState<"email" | "mobile">("email");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [formData, setFormData] = useState<FormData>({
    emailOrMobile: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 Redirect Result Handle করার জন্য useEffect
  useEffect(() => {
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          console.log("✅ Redirect login successful:", result.user.uid);
          
          // ইউজার তৈরি/আপডেট করুন
          const role = await createOrUpdateUser(result.user, "google");

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
        console.error("Redirect login error:", error);
        setError("Google login failed. Please try again.");
      }
    };

    handleRedirectResult();
  }, [router, redirectUrl]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  // 🔥 ইউজার তৈরি/আপডেট করার ফাংশন (MongoDB এ সেভ)
  const createOrUpdateUser = async (
    user: FirebaseUser,
    provider: string,
  ): Promise<string> => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          name: user.displayName || user.email?.split("@")[0] || "",
          email: user.email || "",
          mobile: user.phoneNumber || "",
          photoURL: user.photoURL || "",
          provider: provider,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.user?.role || "user";
      }
      return "user";
    } catch (error) {
      console.error("Error creating/updating user:", error);
      return "user";
    }
  };

  // Email/Password Login
  const handleEmailLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.emailOrMobile || !formData.password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.emailOrMobile,
        formData.password,
      );

      const role = await createOrUpdateUser(userCredential.user, "email");

      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          name: userCredential.user.displayName,
          role: role,
        }),
      );

      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push(redirectUrl);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);
      const firebaseError = err as FirebaseError;

      if (firebaseError.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (firebaseError.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (firebaseError.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later");
      } else {
        setError(firebaseError.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Google Login - Popup + Redirect Fallback
  const handleGoogleLogin = async (): Promise<void> => {
    setLoading(true);
    setError("");

    try {
      const provider = new GoogleAuthProvider();
      
      // প্রথমে Popup চেষ্টা করুন
      try {
        const result = await signInWithPopup(auth, provider);
        console.log("✅ Popup login successful:", result.user.uid);
        
        const role = await createOrUpdateUser(result.user, "google");

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
      console.error("Google login error:", err);
      const firebaseError = err as FirebaseError;
      setError(firebaseError.message || "Google login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Mobile Login with OTP
  const handleMobileLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.emailOrMobile.trim()) {
      setError("Please enter your mobile number");
      setLoading(false);
      return;
    }

    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(formData.emailOrMobile)) {
      setError("Please enter a valid Bangladeshi mobile number");
      setLoading(false);
      return;
    }

    try {
      if (!otpSent) {
        const response = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: formData.emailOrMobile }),
        });

        if (response.ok) {
          setOtpSent(true);
        } else {
          const data = await response.json();
          setError(data.message || "Failed to send OTP");
        }
      } else {
        const response = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: formData.emailOrMobile,
            otp: otpCode,
          }),
        });

        if (response.ok) {
          const mobileUid = `mobile_${Date.now()}`;

          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              uid: mobileUid,
              name: "Mobile User",
              mobile: formData.emailOrMobile,
              provider: "mobile",
            }),
          });

          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: mobileUid,
              mobile: formData.emailOrMobile,
              role: "user",
            }),
          );
          router.push(redirectUrl);
        } else {
          const data = await response.json();
          setError(data.message || "Invalid OTP code");
        }
      }
    } catch (err) {
      console.error("Mobile login error:", err);
      setError("Mobile login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    if (loginMethod === "email") {
      handleEmailLogin(e);
    } else {
      handleMobileLogin(e);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-primary-blue/20 via-white to-primary-gold/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 " />

        <div className="text-center mb-5 md:mb-6">
          <div className="inline-block  bg-linear-to-br from-primary-gold/20 to-glow-gold/20 rounded-full mb-2 md:mb-3">
            <Link href={"/"}>
              <Image
                src="/images/logo.webp"
                alt="Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
            </Link>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-xs md:text-sm text-gray-500">
            Login to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-3 md:px-4 py-2 md:py-3 rounded-lg mb-3 md:mb-4 text-xs md:text-sm">
            {error}
          </div>
        )}

        {/* Login Method Buttons */}
        <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
          {loginMethod === "email" ? (
            <button
              onClick={() => {
                setLoginMethod("mobile");
                setError("");
                setOtpSent(false);
              }}
              className="w-full py-2.5 md:py-3 px-3 md:px-4 border border-primary-gold bg-primary-gold/10 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-gold/20 transition-all"
            >
              <FiPhone className="text-primary-gold" size={16} />
              <span className="text-primary-gold font-medium text-sm md:text-base">
                Login with Mobile Number
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                setLoginMethod("email");
                setOtpSent(false);
                setError("");
              }}
              className="w-full py-2.5 md:py-3 px-3 md:px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
            >
              <FiMail className="text-gray-700" size={16} />
              <span className="text-gray-700 font-medium text-sm md:text-base">
                Login with Email & Password
              </span>
            </button>
          )}

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 border border-gray-300 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-400 transition-all shadow-sm disabled:opacity-50"
          >
            <FcGoogle size={18} />
            <span className="text-gray-700 font-medium text-sm md:text-base">
              Login with Google
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          <div>
            <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-gray-700 mb-1">
              {loginMethod === "email" ? (
                <FiMail className="text-gray-400" size={14} />
              ) : (
                <FiPhone className="text-gray-400" size={14} />
              )}
              <span>
                {loginMethod === "email" ? "Email Address" : "Mobile Number"}
              </span>
            </label>
            <input
              type={loginMethod === "email" ? "email" : "tel"}
              name="emailOrMobile"
              value={formData.emailOrMobile}
              onChange={handleChange}
              disabled={loginMethod === "mobile" && otpSent}
              placeholder={
                loginMethod === "email"
                  ? "Enter your email"
                  : "e.g., 017XXXXXXXX"
              }
              className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none disabled:bg-gray-100"
              required
            />
          </div>

          {loginMethod === "email" ? (
            <div>
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
                  placeholder="Enter your password"
                  className="w-full px-3 md:px-4 py-2 md:py-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-gold focus:border-transparent outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              <div className="text-right mt-2">
                {/* <Link
                  href="/forgot-password"
                  className="text-xs text-primary-gold font-medium hover:underline"
                >
                  Forgot password?
                </Link> */}
              </div>
            </div>
          ) : (
            otpSent && (
              <div>
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
            )
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 md:py-3 px-3 md:px-4 rounded-lg font-semibold text-white bg-linear-to-r from-primary-gold to-glow-gold hover:shadow-lg transition-all disabled:opacity-50 text-sm md:text-base"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Processing...</span>
              </div>
            ) : loginMethod === "email" ? (
              "Login"
            ) : otpSent ? (
              "Verify OTP"
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="text-center mt-4 md:mt-6">
          <p className="text-xs md:text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href={`/register?redirect=${encodeURIComponent(redirectUrl)}`}
              className="text-primary-gold font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}