"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FiFacebook,
  FiInstagram,
  FiTwitter,
  FiYoutube,
  FiArrowRight,
} from "react-icons/fi";
import { useState } from "react";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "About Us", href: "/about" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact" },
];

const customerServiceLinks = [
  { name: "My Account", href: "/profile" },
  { name: "Track Order", href: "/track-order" },
  { name: "Returns", href: "/return-policy" },
  { name: "FAQs", href: "/faq" },
  { name: "Support", href: "/contact" },
];

const socials = [
  { icon: FiFacebook, href: "https://facebook.com", label: "Facebook" },
  { icon: FiInstagram, href: "https://instagram.com", label: "Instagram" },
  { icon: FiTwitter, href: "https://twitter.com", label: "Twitter" },
  { icon: FiYoutube, href: "https://youtube.com", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-[#2e3a2c] text-white/90 font-sans border-t border-[#3a4739]/30">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Column 1: Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="relative w-12 h-12 bg-white rounded-full p-1 flex items-center justify-center">
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
                <span className="text-[7px] uppercase tracking-widest text-white/80">connecting dots</span>
              </div>
            </Link>
            
            <p className="text-sm text-white/70 leading-relaxed">
              We bring style, comfort, and quality to your home. Discover timeless furniture crafted with care.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-white/20 hover:border-white rounded-full flex items-center justify-center text-white/80 hover:text-white transition-all"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Customer Service
            </h4>
            <ul className="space-y-2">
              {customerServiceLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="space-y-4">
            <h4 className="text-white font-bold text-sm tracking-wider uppercase">
              Newsletter
            </h4>
            <p className="text-sm text-white/70">
              Get updates on new arrivals and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex h-11 rounded overflow-hidden shadow-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-white text-gray-800 px-4 py-2 text-sm focus:outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-[#d69a45] hover:bg-[#c0873a] text-white px-4 flex items-center justify-center transition-all cursor-pointer"
                aria-label="Subscribe"
              >
                <FiArrowRight size={18} />
              </button>
            </form>
            {isSubscribed && (
              <p className="text-[#d69a45] text-xs font-semibold animate-pulse mt-2">
                🎉 Subscribed successfully!
              </p>
            )}
          </div>

        </div>

        {/* Bottom Bar: Copyright and Payment methods */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            © 2026 Sea Connecting Dots. All Rights Reserved.
          </p>
          <div className="flex flex-wrap gap-2">
            {["bKash", "Nagad", "Rocket", "Visa", "MasterCard"].map((method) => (
              <span
                key={method}
                className="px-2.5 py-1 bg-white/10 rounded text-[10px] font-bold text-white/80 border border-white/5"
              >
                {method}
              </span>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}