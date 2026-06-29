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

// ─── Data (original arrays restored) ───────────────────────────────────────────

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
    color: "hover:bg-blue-600 hover:border-blue-600",
  },
  {
    icon: FiInstagram,
    href: "https://instagram.com",
    label: "Instagram",
    color: "hover:bg-pink-600 hover:border-pink-600",
  },
  {
    icon: FiTwitter,
    href: "https://twitter.com",
    label: "Twitter",
    color: "hover:bg-sky-500 hover:border-sky-500",
  },
  {
    icon: FiYoutube,
    href: "https://youtube.com",
    label: "YouTube",
    color: "hover:bg-red-600 hover:border-red-600",
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Original async subscribe handler with loading state
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#2e3a2c] text-white/90 font-sans border-t border-[#3a4739]/30">

      {/* ── Newsletter Banner ──────────────────────────────── */}
      <div className="bg-[#3a4739] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-extrabold text-white">
                Subscribe & Save <span className="text-[#d69a45]">10%</span> on Your First Order
              </h3>
              <p className="text-xs text-white/60 mt-1">
                Get exclusive deals, new arrivals, and style tips directly in your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex h-12 rounded-lg overflow-hidden shadow-lg w-full md:w-auto md:min-w-[380px]">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 bg-white text-gray-800 px-4 py-2 text-sm focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#d69a45] hover:bg-[#c0873a] disabled:opacity-60 text-white px-5 flex items-center justify-center gap-2 transition-all cursor-pointer font-semibold text-sm whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Subscribe <FiSend size={13} />
                  </>
                )}
              </button>
            </form>
          </div>
          {isSubscribed && (
            <p className="text-center text-[#d69a45] text-sm font-semibold mt-3 animate-pulse">
              🎉 You&apos;re subscribed! Check your inbox for exclusive deals.
            </p>
          )}
        </div>
      </div>

      {/* ── Main Footer Grid ───────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1 — Brand ── */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center shrink-0 shadow-md">
                <Image
                  src="/images/image.png"
                  alt="Sea Connecting Dots"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col justify-center text-left">
                <span className="text-xl font-bold tracking-wider leading-none text-white uppercase">sea</span>
                <span className="text-[7px] uppercase tracking-widest text-white/70">connecting dots</span>
              </div>
            </Link>

            <p className="text-sm text-white/60 leading-relaxed">
              Bangladesh&apos;s trusted destination for premium furniture, comfort &amp; lifestyle
              products at unbeatable prices. Fast delivery, genuine products.
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
                  className={`w-9 h-9 bg-white/5 ${color} border border-white/10 rounded-xl flex items-center justify-center text-white/60 hover:text-white transition-all duration-200`}
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
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-[#d69a45] transition-colors"
                  >
                    <FiArrowRight
                      size={12}
                      className="text-white/30 group-hover:text-[#d69a45] transition-colors -translate-x-1 group-hover:translate-x-0 duration-200"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Policies + Contact ── */}
          <div className="space-y-5">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">
              Policies
            </h4>
            <ul className="space-y-2.5">
              {policyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-white/60 hover:text-[#d69a45] transition-colors"
                  >
                    <FiArrowRight
                      size={12}
                      className="text-white/30 group-hover:text-[#d69a45] transition-colors -translate-x-1 group-hover:translate-x-0 duration-200"
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact snippet (original contact info restored) */}
            <div className="pt-2 space-y-2.5">
              <h4 className="text-white font-bold text-sm tracking-wide uppercase">
                Contact
              </h4>
              <a
                href="tel:+8801797312699"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#d69a45] transition-colors"
              >
                <FiPhone size={13} className="text-[#d69a45] shrink-0" />
                +880 1797 312699
              </a>
              <a
                href="mailto:support@solidbazzar.com"
                className="flex items-center gap-2 text-sm text-white/60 hover:text-[#d69a45] transition-colors"
              >
                <FiMail size={13} className="text-[#d69a45] shrink-0" />
                support@solidbazzar.com
              </a>
              <div className="flex items-start gap-2 text-sm text-white/60">
                <FiMapPin size={13} className="text-[#d69a45] shrink-0 mt-0.5" />
                <span>Gangni, Mollarhat, Bagerhat, Khulna-9384</span>
              </div>
            </div>
          </div>

          {/* Col 4 — Why Us + Payment ── */}
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
                <div key={text} className="flex items-start gap-2.5 text-sm text-white/60">
                  <Icon size={16} className="shrink-0 text-[#d69a45] mt-0.5" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Payment methods */}
            <div>
              <p className="text-xs text-white/40 font-semibold uppercase tracking-wider mb-3">
                Payment Methods
              </p>
              <div className="flex flex-wrap gap-2">
                {["bKash", "Nagad", "Rocket", "Visa", "MasterCard"].map((method) => (
                  <span
                    key={method}
                    className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-[11px] font-bold text-white/70"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ──────────────────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
            <p>
              © {new Date().getFullYear()} Sea Connecting Dots. All Rights Reserved.
            </p>
            <p className="flex items-center gap-1">
              Made with{" "}
              <FiHeart size={11} className="text-[#d69a45] fill-[#d69a45]" />{" "}
              in Bangladesh
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}