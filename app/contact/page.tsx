"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMessageCircle,
  FiFacebook,
  FiClock,
  FiShield,
  FiRefreshCw,
  FiCreditCard,
  FiTruck,
  FiHelpCircle,
  FiArrowUpRight,
} from "react-icons/fi";
import { BiHeadphone } from "react-icons/bi";
import { IoIosPin } from "react-icons/io";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Showroom {
  _id: string;
  city: string;
  name: string;
  address: string;
  phone: string;
  location?: string;
}

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────
const GOLD = "#d69a45";
const DARK = "#2e3a2c";

const FACEBOOK_URL = "https://www.facebook.com/";

// ─────────────────────────────────────────────────────────────
// STATIC SHOWROOMS (Fashion Brand Outlets)
// ─────────────────────────────────────────────────────────────
const SHOWROOMS: Showroom[] = [
  {
    _id: "rupatoli",
    city: "Barishal · Rupatoli",
    name: "Rupatoli Housing Showroom",
    address:
      "Rupatoli Housing Estate, Road # 7, Bangladesh Open University Area Office, Barishal 8200",
    phone: "01761-758729",
    location: "",
  },
  {
    _id: "banglabazar",
    city: "Barishal · Banglabazar",
    name: "Banglabazar More Showroom",
    address: "Banglabazar More, Police Line, Barishal",
    phone: "01767-473504",
    location: "",
  },
];

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function getWhatsAppNumber(phone: string) {
  let number = phone.replace(/\D/g, "");

  // Bangladesh local: 017XXXXXXXX (11 digits) -> 88017XXXXXXXX
  if (number.startsWith("01") && number.length === 11) {
    number = "88" + number;
  }

  // Already 88017... -> keep
  if (number.startsWith("880")) {
    return number;
  }

  return number;
}

function getGoogleMapsUrl(showroom: Showroom) {
  if (showroom.location?.trim()) {
    return showroom.location.trim();
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    showroom.address
  )}`;
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function ContactPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#faf8f5]">
        {/* HERO */}
        <section
          style={{ backgroundColor: DARK }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 70% 30%, ${GOLD}, transparent 60%)`,
              }}
            />
          </div>

          <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#d69a45] to-transparent" />

          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 relative z-10">
            <nav className="flex items-center gap-2 text-white/40 text-xs mb-6 tracking-wide">
              <a href="/" className="hover:text-[#d69a45] transition-colors">
                Home
              </a>
              <span className="text-white/20">/</span>
              <span className="text-[#d69a45] font-semibold">Contact</span>
            </nav>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
              <div className="space-y-4 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
                  <span className="w-1.5 h-1.5 bg-[#d69a45] rounded-full" />
                  <span className="text-[10px] font-bold text-[#d69a45] uppercase tracking-[0.2em]">
                    We&apos;re Here To Help
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                  Let&apos;s Find Your{" "}
                  <span className="text-[#d69a45]">Perfect Style.</span>
                </h1>

                <p className="text-white/60 text-sm leading-relaxed font-light">
                  Whether you need a Panjabi for Eid, uniforms for your school,
                  or everyday wear for the family — Abdullah Poshak Ghor is
                  just a call away from our Barishal outlets.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#d69a45]/10 border border-[#d69a45]/30 flex items-center justify-center">
                  <BiHeadphone size={24} className="text-[#d69a45]" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* MAIN */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="space-y-5">
            {/* BUSINESS HOURS */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#d69a45]/10 flex items-center justify-center">
                  <FiClock className="text-[#d69a45]" size={18} />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-[#2e3a2c] tracking-tight">
                    Business Hours
                  </h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    Visit Us Anytime
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 pb-3 border-b border-gray-100">
                  <div>
                    <p className="font-semibold text-[#2e3a2c] text-sm">
                      Saturday — Thursday
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Regular Working Days
                    </p>
                  </div>
                  <p className="text-[#d69a45] font-bold text-xs tracking-wide">
                    9:00 AM — 10:30 PM
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <p className="font-semibold text-[#2e3a2c] text-sm">
                      Friday
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Open after Jummah
                    </p>
                  </div>
                  <p className="text-[#d69a45] font-bold text-xs tracking-wide">
                    2:30 PM — 10:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* SHOWROOMS */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#d69a45]/10 flex items-center justify-center">
                  <FiMapPin className="text-[#d69a45]" size={18} />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-[#2e3a2c] tracking-tight">
                    Our Showrooms
                  </h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    2 Outlets in Barishal
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {SHOWROOMS.map((showroom) => {
                  const whatsappNumber = getWhatsAppNumber(showroom.phone);
                  const whatsappUrl = `https://wa.me/${whatsappNumber}`;
                  const mapsUrl = getGoogleMapsUrl(showroom);

                  return (
                    <div
                      key={showroom._id}
                      className="group border border-gray-100 rounded-xl p-4 hover:border-[#d69a45]/30 hover:shadow-md hover:shadow-gray-100 transition-all duration-300"
                    >
                      {/* CITY + LOCATION ICON */}
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs font-extrabold text-[#d69a45] uppercase tracking-widest">
                          {showroom.city}
                        </span>

                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-8 h-8 rounded-lg bg-[#d69a45]/10 flex items-center justify-center text-[#d69a45] hover:bg-[#d69a45] hover:text-white transition-all"
                          title="Open showroom location"
                        >
                          <IoIosPin size={17} />
                        </a>
                      </div>

                      {/* NAME */}
                      <h3 className="text-sm font-bold text-[#2e3a2c] mb-1">
                        {showroom.name}
                      </h3>

                      {/* ADDRESS */}
                      <p className="text-xs text-gray-600 leading-relaxed font-light mb-4">
                        {showroom.address}
                      </p>

                      {/* PHONE + WHATSAPP */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          {/* CALL */}
                          <a
                            href={`tel:${showroom.phone.replace(
                              /[^\d+]/g,
                              ""
                            )}`}
                            className="text-[11px] text-gray-500 hover:text-[#d69a45] transition-colors flex items-center gap-1.5 font-medium"
                            title="Call showroom"
                          >
                            <FiPhone size={12} className="text-[#d69a45]" />
                            {showroom.phone}
                          </a>

                          {/* WHATSAPP */}
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all text-[10px] font-bold"
                            title={`WhatsApp ${showroom.name}`}
                          >
                            <FiMessageCircle size={12} />
                            WhatsApp
                          </a>
                        </div>

                        {/* DIRECTIONS */}
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#d69a45] hover:text-[#c0873a] font-bold uppercase tracking-wider flex items-center gap-0.5"
                        >
                          Directions
                          <FiArrowUpRight size={11} />
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK CONTACT */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* CALL */}
              <a
                href="tel:01761758729"
                className="group bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-9 h-9 bg-[#d69a45]/10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-[#d69a45] transition-colors">
                  <FiPhone
                    className="text-[#d69a45] group-hover:text-white transition-colors"
                    size={15}
                  />
                </div>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
                  Call Us
                </p>

                <p className="text-[11px] font-bold text-[#2e3a2c] truncate">
                  01761-758729
                </p>
              </a>

              {/* WHATSAPP */}
              <a
                href="https://wa.me/8801761758729"
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-green-600 transition-colors">
                  <FiMessageCircle
                    className="text-green-600 group-hover:text-white transition-colors"
                    size={15}
                  />
                </div>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
                  WhatsApp
                </p>

                <p className="text-[11px] font-bold text-[#2e3a2c]">
                  Chat Now
                </p>
              </a>

              {/* FACEBOOK */}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-700 transition-colors">
                  <FiFacebook
                    className="text-blue-700 group-hover:text-white transition-colors"
                    size={15}
                  />
                </div>

                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mb-1">
                  Facebook
                </p>

                <p className="text-[11px] font-bold text-[#2e3a2c]">
                  Visit Page
                </p>
              </a>
            </div>

            {/* WHY SHOP WITH US */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#d69a45]/10 flex items-center justify-center">
                  <FiShield className="text-[#d69a45]" size={18} />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-[#2e3a2c] tracking-tight">
                    Why Shop With Us
                  </h2>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    Trusted Since 2018
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: FiTruck,
                    title: "Fast Local Delivery",
                    desc: "Quick delivery across Barishal — order via WhatsApp for home delivery.",
                  },
                  {
                    icon: FiRefreshCw,
                    title: "Easy Exchange",
                    desc: "Not the right fit? Exchange within 3 days with original tags.",
                  },
                  {
                    icon: FiCreditCard,
                    title: "Cash & bKash Accepted",
                    desc: "Pay your way — cash on delivery or instant bKash at the outlet.",
                  },
                  {
                    icon: FiHelpCircle,
                    title: "Friendly Support",
                    desc: "Call or WhatsApp us anytime — we're happy to help you choose.",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:border-[#d69a45]/30 transition"
                    >
                      <div className="w-9 h-9 rounded-lg bg-[#d69a45]/10 flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-[#d69a45]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2e3a2c] mb-0.5">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-gray-500 leading-relaxed font-light">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}