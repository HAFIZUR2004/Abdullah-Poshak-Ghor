"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
  FiSend,
  FiArrowRight,
  FiHeart,
  FiTruck,
  FiCheckCircle,
  FiRefreshCw,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";
import { useState } from "react";

// ─── Data ──────────────────────────────────────────────────────────────────────

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Contact Us", href: "/contact" },
  { name: "Track Order", href: "/track-order" },
  { name: "FAQ", href: "/faq" },
];

const policyLinks = [
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Return Policy", href: "/return-policy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Shipping Info", href: "/shipping" },
];

const socials = [
  {
    icon: FiFacebook,
    href: "https://facebook.com",
    label: "Facebook",
    color: "hover:bg-blue-600",
  },
  {
    icon: FiInstagram,
    href: "https://instagram.com",
    label: "Instagram",
    color: "hover:bg-pink-600",
  },
  {
    icon: FiTwitter,
    href: "https://twitter.com",
    label: "Twitter",
    color: "hover:bg-sky-500",
  },
  {
    icon: FiYoutube,
    href: "https://youtube.com",
    label: "YouTube",
    color: "hover:bg-red-600",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubscribed(true);
    setEmail("");
    setIsLoading(false);
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <footer className="bg-gray-950 text-gray-300">

      {/* ── CTA Strip ─────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-white font-extrabold text-lg md:text-xl leading-tight">
                Get the Best Deals First 🎁
              </h3>
              <p className="text-white/80 text-xs md:text-sm">
                Join 10,000+ happy customers across Bangladesh
              </p>
            </div>
            {/* Newsletter inline form */}
            <form
              onSubmit={handleSubscribe}
              className="flex items-center gap-2 w-full sm:w-auto"
            >
              <div className="relative flex-1 sm:w-64">
                <FiMail
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full bg-white pl-9 pr-3 py-2.5 rounded-xl text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-1.5 shrink-0 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe
                    <FiSend size={13} />
                  </>
                )}
              </button>
            </form>
          </div>
          {isSubscribed && (
            <p className="text-center text-white/90 text-sm font-semibold mt-2 animate-pulse">
              🎉 You're subscribed! Check your inbox for exclusive deals.
            </p>
          )}
        </div>
      </div>

      {/* ── Main Footer Grid ───────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1 — Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-900/30 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.webp"
                  alt="Abdullah Poshak Ghor"
                  width={52}
                  height={52}
                  className="w-12 h-12 object-contain"
                />
              </div> */}
              <div>
                <span className="text-lg font-black text-white block leading-none">
                  Abdullah {" "} <span className="text-orange-400">Poshak Ghor</span>
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-widest uppercase">
                 Poshak Ghor
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-400 leading-relaxed">
              Bangladesh's trusted destination for premium fashion, beauty &
              lifestyle products at unbeatable prices. Fast delivery, genuine
              products.
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-9 h-9 bg-gray-800 ${color} border border-gray-700 hover:border-transparent rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200`}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links ── */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    <FiArrowRight
                      size={12}
                      className="text-gray-600 group-hover:text-orange-400 transition-colors -translate-x-1 group-hover:translate-x-0 duration-200"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Policies ── */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">
              Policies
            </h4>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    <FiArrowRight
                      size={12}
                      className="text-gray-600 group-hover:text-orange-400 transition-colors -translate-x-1 group-hover:translate-x-0 duration-200"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact snippet */}
            <div className="pt-2 space-y-2.5">
              <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                Contact
              </h4>
              <a
                href="tel:+8801797312699"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                <FiPhone size={13} className="text-orange-500 shrink-0" />
                +880 1797 312699
              </a>
              <a
                href="mailto:support@solidbazzar.com"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors"
              >
                <FiMail size={13} className="text-orange-500 shrink-0" />
                support@solidbazzar.com
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <FiMapPin size={13} className="text-orange-500 shrink-0 mt-0.5" />
                <span>Gangni, Mollarhat, Bagerhat, Khulna-9384</span>
              </div>
            </div>
          </div>

          {/* Col 4 — App / Trust ── */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">
              Why Us
            </h4>
            <div className="space-y-3">
              {[
                { icon: FiTruck, text: "Fast delivery across Bangladesh" },
                { icon: FiCheckCircle, text: "100% genuine products" },
                { icon: FiRefreshCw, text: "7-day easy returns" },
                { icon: FiDollarSign, text: "Cash on Delivery available" },
                { icon: FiShield, text: "Secure payment gateway" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5 text-sm text-gray-400">
                  <Icon size={16} className="shrink-0 text-orange-400 mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div>
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">
                Payment Methods
              </p>
              <div className="flex flex-wrap gap-2">
                {["bKash", "Nagad", "Rocket", "Visa", "MasterCard"].map(
                  (method) => (
                    <span
                      key={method}
                      className="px-2.5 py-1 bg-gray-800 border border-gray-700 rounded-lg text-[11px] font-bold text-gray-300"
                    >
                      {method}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bar ─────────────────────────────────────────── */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <p>
              © {new Date().getFullYear()} Solid Bazzar. All rights reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with{" "}
              <FiHeart size={11} className="text-orange-500 fill-orange-500" />{" "}
              in Bangladesh
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}