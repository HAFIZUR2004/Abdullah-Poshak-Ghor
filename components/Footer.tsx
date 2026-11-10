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
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FiYoutube, href: "https://youtube.com", label: "YouTube" },
];

// ─── Payment Method SVG Logos (Paypal removed) ─────────────────────────

function BkashLogo() {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-auto drop-shadow-sm transition-transform hover:scale-105" aria-label="bKash">
      <rect width="60" height="24" rx="5" fill="#E2136E"/>
      <text x="7" y="16.5" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="white">bKash</text>
    </svg>
  );
}

function NagadLogo() {
  return (
    <svg viewBox="0 0 60 24" className="h-6 w-auto drop-shadow-sm transition-transform hover:scale-105" aria-label="Nagad">
      <rect width="60" height="24" rx="5" fill="#F6A21E"/>
      <text x="6" y="16.5" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="white">Nagad</text>
    </svg>
  );
}

function RocketLogo() {
  return (
    <svg viewBox="0 0 64 24" className="h-6 w-auto drop-shadow-sm transition-transform hover:scale-105" aria-label="Rocket">
      <rect width="64" height="24" rx="5" fill="#8B2FC9"/>
      <text x="5" y="16.5" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="12" fill="white">Rocket</text>
    </svg>
  );
}

function VisaLogo() {
  return (
    <svg viewBox="0 0 48 24" className="h-6 w-auto drop-shadow-sm transition-transform hover:scale-105" aria-label="Visa">
      <rect width="48" height="24" rx="5" fill="#1434CB"/>
      <text x="5.5" y="16.5" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="13" fill="white" letterSpacing="1">VISA</text>
    </svg>
  );
}

function MastercardLogo() {
  return (
    <svg viewBox="0 0 42 24" className="h-6 w-auto drop-shadow-sm transition-transform hover:scale-105" aria-label="Mastercard">
      <rect width="42" height="24" rx="5" fill="#252525"/>
      <circle cx="16" cy="12" r="7.5" fill="#EB001B"/>
      <circle cx="26" cy="12" r="7.5" fill="#F79E1B"/>
      <path d="M21 7.2a7.5 7.5 0 0 1 0 9.6 7.5 7.5 0 0 1 0-9.6z" fill="#FF5F00"/>
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
    <footer className="relative bg-gradient-to-b from-[#FAF4EC] to-[#F5ECE0] text-[#0B2523] font-sans border-t border-[#E5D3B3]/40 overflow-hidden">

      {/* ── Background Logo Watermark (Center) ───────────────── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
        <div className="w-[380px] h-[380px] lg:w-[650px] lg:h-[650px] opacity-[0.04] select-none transform translate-y-6">
          <Image
            src="https://i.ibb.co.com/chYMQcpM/Whats-App-Image-2026-11-06-at-9-40-51-PM.jpg"
            alt="Abdullah Poshak Ghor"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* ── Main Footer Grid ─────────────────────────────────── */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

          {/* Col 1 — Brand */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative flex items-center justify-center shrink-0 p-1 bg-white/60 rounded-xl border border-[#E5D3B3]/40 shadow-sm transition-transform group-hover:scale-105">
                <Image
                  src="https://i.ibb.co.com/chYMQcpM/Whats-App-Image-2026-11-06-at-9-40-51-PM.jpghttps://i.ibb.co.com/chYMQcpM/Whats-App-Image-2026-11-06-at-9-40-51-PM.jpg"
                  alt="Abdullah Poshak Ghor"
                  width={40}
                  height={40}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider leading-none text-[#0B2523] uppercase font-sans">
                  Abdullah
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#0F3D39] font-bold mt-0.5">
                  Poshak Ghor
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#0B2523]/75 leading-relaxed font-medium max-w-sm">
              We bring style, comfort, and quality to your home. Discover
              timeless furniture crafted with care and delivered fast across Bangladesh.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 bg-white/80 hover:bg-[#0F3D39] border border-[#E5D3B3]/60 hover:border-[#0F3D39] rounded-xl flex items-center justify-center text-[#0B2523]/80 hover:text-[#E5D3B3] shadow-sm transition-all duration-300 hover:-translate-y-1"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[#0B2523] font-black text-xs tracking-widest uppercase relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-6 after:h-[2px] after:bg-[#FF7A00]">
              Quick Links
            </h4>
            <ul className="space-y-2.5 pt-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-[#0B2523]/75 hover:text-[#0F3D39] transition-all duration-200 font-medium hover:translate-x-1"
                  >
                    <FiArrowRight size={12} className="text-[#FF7A00] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Customer Service + Contact */}
          <div className="space-y-4">
            <h4 className="text-[#0B2523] font-black text-xs tracking-widest uppercase relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-6 after:h-[2px] after:bg-[#FF7A00]">
              Customer Service
            </h4>
            <ul className="space-y-2.5 pt-2">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-xs text-[#0B2523]/75 hover:text-[#0F3D39] transition-all duration-200 font-medium hover:translate-x-1"
                  >
                    <FiArrowRight size={12} className="text-[#FF7A00] opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Contact snippet */}
            <div className="pt-4 space-y-2.5 border-t border-[#E5D3B3]/40">
              <a href="tel:+8801806971390" className="flex items-center gap-2.5 text-xs text-[#0B2523]/80 hover:text-[#FF7A00] transition-colors font-medium">
                <div className="w-6 h-6 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                  <FiPhone size={12} className="text-[#FF7A00]" />
                </div>
                +880 1806 971390
              </a>
              <a href="mailto:Abdullah Poshak Ghor.com" className="flex items-center gap-2.5 text-xs text-[#0B2523]/80 hover:text-[#FF7A00] transition-colors font-medium">
                <div className="w-6 h-6 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center shrink-0">
                  <FiMail size={12} className="text-[#FF7A00]" />
                </div>
                AbdullahPoshakGhor.com
              </a>
              <div className="flex items-start gap-2.5 text-xs text-[#0B2523]/80 font-medium">
                <div className="w-6 h-6 rounded-lg bg-[#FF7A00]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <FiMapPin size={12} className="text-[#FF7A00]" />
                </div>
                <span>BSCIC Industrial Estate, Dhapar, Jhalakathi</span>
              </div>
            </div>
          </div>

          {/* Col 4 — Newsletter */}
          <div className="space-y-4">
            <h4 className="text-[#0B2523] font-black text-xs tracking-widest uppercase relative inline-block after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-6 after:h-[2px] after:bg-[#FF7A00]">
              Newsletter
            </h4>
            <p className="text-xs text-[#0B2523]/75 leading-relaxed font-medium">
              Subscribe to get special discounts and latest design updates.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="flex h-11 rounded-xl overflow-hidden bg-white shadow-sm border border-[#E5D3B3]/60 focus-within:border-[#0F3D39] transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 bg-transparent text-[#0B2523] px-3.5 text-xs focus:outline-none placeholder:text-[#0B2523]/40 font-medium"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#FF7A00] hover:bg-[#E56E00] text-white px-4 flex items-center justify-center transition-all cursor-pointer disabled:opacity-60 active:scale-95 font-medium"
                  aria-label="Subscribe"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <FiSend size={14} />
                  )}
                </button>
              </div>
              {isSubscribed && (
                <p className="text-[#0F3D39] text-xs font-bold animate-fade-in flex items-center gap-1.5 pt-1">
                  🎉 Subscribed! Check your inbox soon.
                </p>
              )}
            </form>

            {/* Payment Methods — bKash, Nagad, Rocket, Visa, Mastercard */}
            <div className="pt-3">
              <p className="text-[10px] text-[#0B2523]/60 font-black uppercase tracking-wider mb-2.5">
                We Accept
              </p>
              <div className="flex flex-wrap gap-2 items-center">
                <BkashLogo />
                <NagadLogo />
                <RocketLogo />
                <VisaLogo />
                <MastercardLogo />
              </div>
            </div>
          </div>

        </div>

        {/* ── Bottom Bar ────────────────────────────────────────── */}
        <div className="mt-14 pt-6 border-t border-[#0B2523]/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <p className="text-xs text-[#0B2523]/70 font-medium">
              © {new Date().getFullYear()} <span className="font-bold text-[#0B2523]">Abdullah Poshak Ghor</span>. All rights reserved.
            </p>

            <p className="text-xs text-[#0B2523]/70 font-medium flex items-center gap-1">
              <span>Designed & Developed by</span>
              <a
                href="https://growbusinessbd.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0F3D39] hover:text-[#FF7A00] transition-colors duration-200 underline decoration-[#0F3D39]/30 underline-offset-4 hover:decoration-[#FF7A00]"
              >
                Grow Business Solutions BD
              </a>
            </p>
          </div>
        </div>

      </div>

    </footer>
  );
}