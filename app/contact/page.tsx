"use client";

import { useState, useEffect } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMessageCircle,
  FiFacebook,
  FiClock,
  FiChevronDown,
  FiShield,
  FiRefreshCw,
  FiCreditCard,
  FiSearch,
  FiHelpCircle,
  FiTruck,
  FiArrowUpRight,
} from "react-icons/fi";
import { BiHeadphone } from "react-icons/bi";
import { IoIosPin } from "react-icons/io";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Showroom {
  _id: string;
  city: string;
  address: string;
  phone: string;
  location?: string;
  createdAt?: string;
}

const GOLD = "#d69a45";
const DARK = "#2e3a2c";

const FACEBOOK_URL =
  "https://www.facebook.com/profile.php?id=100057440410400";

function getWhatsAppNumber(phone: string) {
  let number = phone.replace(/\D/g, "");

  // Bangladesh local number: 017XXXXXXXX -> 88017XXXXXXXX
  if (number.startsWith("01") && number.length === 11) {
    number = "88" + number;
  }

  // +88017... -> 88017...
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

export default function ContactPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [showrooms, setShowrooms] = useState<Showroom[]>([]);
  const [loadingShowrooms, setLoadingShowrooms] = useState<boolean>(true);

  useEffect(() => {
    const fetchShowrooms = async () => {
      try {
        const res = await fetch("/api/showrooms", {
          cache: "no-store",
        });

        const json = await res.json();

        if (json.success) {
          setShowrooms(json.data || []);
        }
      } catch (err) {
        console.error("Failed to load showrooms", err);
      } finally {
        setLoadingShowrooms(false);
      }
    };

    fetchShowrooms();
  }, []);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };



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
              <a
                href="/"
                className="hover:text-[#d69a45] transition-colors"
              >
                Home
              </a>

              <span className="text-white/20">/</span>

              <span className="text-[#d69a45] font-semibold">
                Contact
              </span>
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
                  Let&apos;s Build Something{" "}
                  <span className="text-[#d69a45]">
                    kjhkhkhkjhkhkhk.
                  </span>
                </h1>

                <p className="text-white/60 text-sm leading-relaxed font-light">
                  Whether you&apos;re furnishing a home, planning a
                  commercial space, or commissioning bespoke woodwork —
                  our team in Barishal is ready to help.
                </p>
              </div>

              <div className="hidden sm:flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#d69a45]/10 border border-[#d69a45]/30 flex items-center justify-center">
                  <BiHeadphone
                    size={24}
                    className="text-[#d69a45]"
                  />
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
                  <FiClock
                    className="text-[#d69a45]"
                    size={18}
                  />
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
                      Saturday - Thursday
                    </p>

                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Working Days
                    </p>
                  </div>

                  <p className="text-[#d69a45] font-bold text-xs tracking-wide">
                    9:00 AM — 10:00 PM
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <p className="font-semibold text-[#2e3a2c] text-sm">
                      Friday
                    </p>

                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Weekend
                    </p>
                  </div>

                  <p className="text-red-500 font-bold text-xs uppercase tracking-wide">
                    Closed
                  </p>
                </div>
              </div>
            </div>

            {/* SHOWROOMS */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-100/50 p-6 sm:p-7">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#d69a45]/10 flex items-center justify-center">
                  <FiMapPin
                    className="text-[#d69a45]"
                    size={18}
                  />
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-[#2e3a2c] tracking-tight">
                    Our Showrooms
                  </h2>

                  <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                    Nationwide Outlets
                  </p>
                </div>
              </div>

              {loadingShowrooms ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((n) => (
                    <div
                      key={n}
                      className="border border-gray-100 rounded-xl p-4 animate-pulse"
                    >
                      <div className="h-3 w-20 bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-full bg-gray-200 rounded mb-2" />
                      <div className="h-3 w-2/3 bg-gray-200 rounded" />
                    </div>
                  ))}
                </div>
              ) : showrooms.length === 0 ? (
                <div className="text-center py-6">
                  <FiMapPin
                    size={24}
                    className="text-gray-300 mx-auto mb-2"
                  />

                  <p className="text-xs text-gray-500">
                    No showrooms available at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {showrooms.map((showroom) => {
                    const whatsappNumber = getWhatsAppNumber(
                      showroom.phone
                    );

                    const whatsappUrl = `https://wa.me/${whatsappNumber}`;

                    const mapsUrl = getGoogleMapsUrl(showroom);

                    return (
                      <div
                        key={showroom._id}
                        className="group border border-gray-100 rounded-xl p-4 hover:border-[#d69a45]/30 hover:shadow-md hover:shadow-gray-100 transition-all duration-300"
                      >
                        {/* CITY + LOCATION */}
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
                                /\s+/g,
                                ""
                              )}`}
                              className="text-[11px] text-gray-500 hover:text-[#d69a45] transition-colors flex items-center gap-1.5 font-medium"
                              title="Call showroom"
                            >
                              <FiPhone
                                size={12}
                                className="text-[#d69a45]"
                              />

                              {showroom.phone}
                            </a>

                            {/* WHATSAPP */}
                            <a
                              href={whatsappUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all text-[10px] font-bold"
                              title={`WhatsApp ${showroom.city} Showroom`}
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
              )}
            </div>

            {/* QUICK CONTACT */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href="tel:+8801806971390"
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
                  +880 1806971390
                </p>
              </a>

              <a
                href="https://wa.me/8801806971390"
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

            {/* FAQ */}
            
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}