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

const customerServiceLinks = [
  { name: "My Account", href: "/profile" },
  { name: "Track Order", href: "/track-order" },
  { name: "Return Policy", href: "/return-policy" },
  { name: "FAQs", href: "/faq" },
  { name: "Support", href: "/contact" },
];

const socials = [
  { icon: FiFacebook,  href: "https://facebook.com",  label: "Facebook",  color: "hover:bg-blue-600 hover:border-blue-600" },
  { icon: FiInstagram, href: "https://instagram.com", label: "Instagram", color: "hover:bg-pink-600 hover:border-pink-600" },
  { icon: FiTwitter,   href: "https://twitter.com",   label: "Twitter",   color: "hover:bg-sky-500 hover:border-sky-500" },
  { icon: FiYoutube,   href: "https://youtube.com",   label: "YouTube",   color: "hover:bg-red-600 hover:border-red-600" },
];

// ─── Payment Method SVG Logos ──────────────────────────────────────────────────

function BkashLogo() {
  return (
    <svg viewBox="0 0 60 24" className="h-5 w-auto" aria-label="bKash">
      <rect width="60" height="24" rx="4" fill="#E2136E"/>
      <text x="8" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="white">bKash</text>
    </svg>
  );
}

function NagadLogo() {
  return (
    <svg viewBox="0 0 60 24" className="h-5 w-auto" aria-label="Nagad">
      <rect width="60" height="24" rx="4" fill="#F6A21E"/>
      <text x="6" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="white">Nagad</text>
    </svg>
  );
}

function RocketLogo() {
  return (
    <svg viewBox="0 0 64 24" className="h-5 w-auto" aria-label="Rocket">
      <rect width="64" height="24" rx="4" fill="#8B2FC9"/>
      <text x="5" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="white">Rocket</text>
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 48 24" className="h-5 w-auto" aria-label="Visa">
      <rect width="48" height="24" rx="4" fill="#1434CB"/>
      <text x="6" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="14" fill="white" letterSpacing="1">VISA</text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 42 24" className="h-5 w-auto" aria-label="Mastercard">
      <rect width="42" height="24" rx="4" fill="#252525"/>
      <circle cx="16" cy="12" r="8" fill="#EB001B"/>
      <circle cx="26" cy="12" r="8" fill="#F79E1B"/>
      <path d="M21 6.8a8 8 0 0 1 0 10.4A8 8 0 0 1 21 6.8z" fill="#FF5F00"/>
    </svg>
  );
}

function PaypalLogo() {
  return (
    <svg viewBox="0 0 56 24" className="h-5 w-auto" aria-label="PayPal">
      <rect width="56" height="24" rx="4" fill="#003087"/>
      <text x="5" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="white">Pay</text>
      <text x="26" y="17" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="#009CDE">Pal</text>
    </svg>
  );
}

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
    setIsLoading(false);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  return (
    <footer className="bg-[#2e3a2c] text-white/90 font-sans">

      {/* ── Main Footer Grid ─────────────────────────────────── */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-5">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative w-11 h-11 bg-white rounded-full p-1 flex items-center justify-center shrink-0 overflow-hidden">
                <Image
                  src="/images/logo.webp"
                  alt="Sareng Furniture"
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-wider leading-none text-white uppercase">Sareng</span>
                <span className="text-[9px] uppercase tracking-widest text-[#d69a45]">Furniture</span>
              </div>
            </Link>

            <p className="text-xs text-white/55 leading-relaxed">
              We bring style, comfort, and quality to your home. Discover
              timeless furniture crafted with care and delivered fast.
            </p>

            <div className="flex gap-2">
              {socials.map(({ icon: Icon, href, label, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={`w-8 h-8 bg-white/5 ${color} border border-white/10 rounded-lg flex items-center justify-center text-white/50 hover:text-white transition-all`}
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs tracking-widest uppercase">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-white/55 hover:text-[#d69a45] transition-colors"
                  >
                    <FiArrowRight size={11} className="text-white/20 group-hover:text-[#d69a45] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Customer Service + Contact */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs tracking-widest uppercase">Customer Service</h4>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-white/55 hover:text-[#d69a45] transition-colors"
                  >
                    <FiArrowRight size={11} className="text-white/20 group-hover:text-[#d69a45] transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact snippet */}
            <div className="pt-3 space-y-2 border-t border-white/10">
              <a href="tel:+8801797312699" className="flex items-center gap-2 text-xs text-white/55 hover:text-[#d69a45] transition-colors">
                <FiPhone size={12} className="text-[#d69a45] shrink-0" />
                +880 1797 312699
              </a>
              <a href="mailto:support@solidbazzar.com" className="flex items-center gap-2 text-xs text-white/55 hover:text-[#d69a45] transition-colors">
                <FiMail size={12} className="text-[#d69a45] shrink-0" />
                support@solidbazzar.com
              </a>
              <div className="flex items-start gap-2 text-xs text-white/55">
                <FiMapPin size={12} className="text-[#d69a45] shrink-0 mt-0.5" />
                <span>Gangni, Mollarhat, Bagerhat, Khulna-9384</span>
              </div>
            </div>
          </div>

          {/* Col 4 — Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-xs tracking-widest uppercase">Newsletter</h4>
            <p className="text-xs text-white/55 leading-relaxed">
              Get updates on new arrivals and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex h-10 rounded overflow-hidden shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white text-gray-800 px-3 py-2 text-xs focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#d69a45] hover:bg-[#c0873a] text-white px-3 flex items-center justify-center transition-all cursor-pointer disabled:opacity-60"
                aria-label="Subscribe"
              >
                {isLoading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <FiSend size={14} />
                )}
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[#d69a45] text-xs font-semibold animate-pulse">
                🎉 Subscribed! Check your inbox.
              </p>
            )}

            {/* Payment Methods — real logos */}
            <div className="pt-2">
              <p className="text-[10px] text-white/35 font-semibold uppercase tracking-wider mb-3">
                Payment Methods
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <BkashLogo />
                <NagadLogo />
                <RocketLogo />
                <VisaLogo />
                <MastercardLogo />
                <PaypalLogo />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ────────────────────────────────────────── */}
      <div className="border-t border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white/35">
            <p>© {new Date().getFullYear()} Sareng Furniture. All Rights Reserved.</p>
            <p className="flex items-center gap-1">
              Made with <FiHeart size={10} className="text-[#d69a45] fill-[#d69a45]" /> in Bangladesh
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
}