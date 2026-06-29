"use client";

import { useState } from "react";
import {
  FiMapPin,
  FiPhone,
  FiMessageCircle,
  FiFacebook,
  FiSend,
  FiCheckCircle,
  FiClock,
  FiChevronDown,
  FiChevronUp,
  FiShield,
  FiRefreshCw,
  FiCreditCard,
  FiSearch,
  FiHelpCircle,
  FiTruck,
  FiNavigation,
} from "react-icons/fi";
import { BiHeadphone } from "react-icons/bi";
import { IoIosPin } from "react-icons/io";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", message: "" });
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "How long does delivery take?",
      answer:
        "Delivery takes 1-2 business days inside Dhaka and 2-4 business days outside Dhaka.",
      icon: FiTruck,
    },
    {
      question: "Are the products original?",
      answer: "Yes, we provide 100% original and premium quality products.",
      icon: FiShield,
    },
    {
      question: "What is the return/replacement policy?",
      answer: "We offer return or replacement within 7 days of delivery.",
      icon: FiRefreshCw,
    },
    {
      question: "What payment options are available?",
      answer: "We accept Cash on Delivery, bKash, Nagad, Rocket, and cards.",
      icon: FiCreditCard,
    },
    {
      question: "How can I track my order?",
      answer: "Track your order using order number on 'Track Order' page.",
      icon: FiSearch,
    },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mt-4 bg-linear-to-r from-primary-blue to-primary-gold text-white pt-10 pb-12 md:py-16 rounded-3xl ">
        <div className="flex flex-col gap-2 justify-center items-center">
          <div className="bg-white/20 rounded-full p-3">
            <BiHeadphone size={28} />
          </div>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-bold mb-2">Contact Us</h1>
            <p className="text-sm text-white/80 max-w-md mx-auto">
              We are always here for you. Reach out anytime!
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
          {/* Left Side - Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 h-fit">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-5">
              Send us a Message
            </h2>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiCheckCircle className="text-lg md:text-xl text-green-600" />
                </div>
                <h3 className="text-base font-semibold text-green-800 mb-1">
                  Message Sent!
                </h3>
                <p className="text-xs text-green-600">
                  Thanks! We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your Name"
                    className="w-full px-3 md:px-4 py-2 text-gray-500 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-gold text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="w-full px-3 text-gray-500 md:px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-gold text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Your Message"
                    className="w-full text-gray-500 px-3 md:px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-gold resize-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary-gold text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-highlight transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Side - Contact Info Cards */}
          <div className="space-y-4">
            {/* Business Hours Card */}
            <div className="bg-gradient-to-r from-primary-blue/10 to-primary-gold/10 rounded-2xl p-4 md:p-5 border border-primary-gold/30">
              <div className="flex items-center gap-2 md:gap-3 mb-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-gold rounded-lg flex items-center justify-center">
                  <FiClock className="text-white text-sm md:text-base" />
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-800">
                  Business Hours
                </h2>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      Saturday - Thursday
                    </p>
                    <p className="text-xs text-gray-500">Weekdays</p>
                  </div>
                  <p className="text-primary-gold font-semibold text-xs">
                    9:00 AM - 10:00 PM
                  </p>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      Friday
                    </p>
                    <p className="text-xs text-gray-500">Weekend</p>
                  </div>
                  <p className="text-primary-gold font-semibold text-xs">
                    3:00 PM - 10:00 PM
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-xs text-gray-600">
                    <span className="font-semibold text-green-600">
                      Online now
                    </span>{" "}
                    — Quick response
                  </p>
                </div>
              </div>
            </div>

            {/* Call Card */}
            <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 flex items-center justify-between hover:shadow-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                  <FiPhone className="text-primary-gold text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Call Us</p>
                  <p className="text-sm font-semibold text-gray-800">
                    +880 1797312699
                  </p>
                </div>
              </div>
              <a
                href="tel:+8801797312699"
                className="bg-primary-gold text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-highlight transition"
              >
                Call Now
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 flex items-center justify-between hover:shadow-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FiMessageCircle className="text-green-600 text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                  <p className="text-sm font-semibold text-gray-800">
                    Chat with us
                  </p>
                </div>
              </div>
              <a
                href="https://wa.me/8801797312699"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700 transition"
              >
                Chat Now
              </a>
            </div>

            {/* Facebook Card */}
            <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 flex items-center justify-between hover:shadow-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FiFacebook className="text-blue-700 text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Facebook</p>
                  <p className="text-sm font-semibold text-gray-800">
                    Visit our page
                  </p>
                </div>
              </div>
              <a
                href="#"
                className="bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-800 transition"
              >
                Visit
              </a>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 flex items-center justify-between hover:shadow-xl transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                  <FiMapPin className="text-primary-gold text-lg" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Our Address</p>
                  <p className="text-sm font-semibold text-gray-800">
                    Jirantola, Gangni, Mollarhat
                  </p>
                </div>
              </div>
            </div>

            {/* Map Card */}
            <a
              href="https://maps.google.com/?q=Jirantola+Gangni+Mollarhat+Bagerhat+Khulna+9384"
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-2xl shadow-lg p-4 md:p-5 hover:shadow-xl transition-all hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-center justify-center gap-2 text-center">
                <IoIosPin className="text-primary-gold text-2xl" />
                <p className="text-sm font-semibold text-gray-800">
                  View on Google Maps
                </p>
              </div>
            </a>

            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg p-4 md:p-5">
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-primary-gold rounded-lg flex items-center justify-center">
                  <FiHelpCircle className="text-white text-sm md:text-base" />
                </div>
                <h2 className="text-base md:text-lg font-bold text-gray-800">
                  FAQs
                </h2>
              </div>

              <div className="space-y-2">
                {faqs.map((faq, index) => {
                  const Icon = faq.icon;
                  const isOpen = openFaq === index;
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-center justify-between p-2.5 md:p-3 text-left hover:bg-gray-50 transition"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary-gold/10 rounded-lg flex items-center justify-center">
                            <Icon className="text-primary-gold text-xs" />
                          </div>
                          <span className="font-medium text-gray-800 text-xs md:text-sm">
                            {faq.question}
                          </span>
                        </div>
                        {isOpen ? (
                          <FiChevronUp className="text-gray-400 text-sm" />
                        ) : (
                          <FiChevronDown className="text-gray-400 text-sm" />
                        )}
                      </button>
                      {isOpen && (
                        <div className="px-3 pb-3">
                          <p className="text-gray-600 text-xs pl-8">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
      <Footer/>
    </>
  );
}
