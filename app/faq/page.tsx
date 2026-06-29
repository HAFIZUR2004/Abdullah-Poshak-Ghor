"use client";

import { useState } from "react";
import {
  FiChevronDown,
  FiChevronUp,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCreditCard,
  FiSearch,
  FiPackage,
  FiClock,
  FiUser,
  FiPhone,
  FiHelpCircle,
} from "react-icons/fi";
import Link from "next/link";
import { IconType } from "react-icons";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  icon: IconType;
}

const faqs: FAQItem[] = [
  // Order & Delivery
  {
    question: "How long does delivery take?",
    answer:
      "Delivery takes 1-2 business days inside Dhaka and 2-4 business days outside Dhaka. You will receive a tracking number once your order is shipped.",
    category: "Order & Delivery",
    icon: FiTruck,
  },
  {
    question: "How can I track my order?",
    answer:
      "You can track your order using your order number on our 'Track Order' page. You'll also receive SMS/Email updates about your order status.",
    category: "Order & Delivery",
    icon: FiSearch,
  },
  {
    question: "What are the delivery charges?",
    answer:
      "Inside Dhaka: ৳60 (1-2 days). Outside Dhaka: ৳120 (2-4 days). Free delivery on orders over ৳2000.",
    category: "Order & Delivery",
    icon: FiPackage,
  },
  {
    question: "Do you deliver outside Bangladesh?",
    answer:
      "Currently we only deliver within Bangladesh. International shipping will be available soon.",
    category: "Order & Delivery",
    icon: FiPackage,
  },

  // Product & Quality
  {
    question: "Are the products original?",
    answer:
      "Yes, we provide 100% original and premium quality products sourced from authentic suppliers and authorized distributors.",
    category: "Product & Quality",
    icon: FiShield,
  },
  {
    question: "How can I be sure about product quality?",
    answer:
      "All products go through quality checks before shipping. We have a 7-day replacement policy if you're not satisfied.",
    category: "Product & Quality",
    icon: FiShield,
  },
  {
    question: "Are there any warranty on products?",
    answer:
      "Yes, all products come with manufacturer warranty. Please check the product box for specific warranty details.",
    category: "Product & Quality",
    icon: FiShield,
  },

  // Payment
  {
    question: "What payment options are available?",
    answer:
      "We accept Cash on Delivery (COD), bKash, Nagad, Rocket, and Credit/Debit cards (Visa, Mastercard, Amex).",
    category: "Payment",
    icon: FiCreditCard,
  },
  {
    question: "Is Cash on Delivery available?",
    answer:
      "Yes, Cash on Delivery is available for all orders across Bangladesh. You only pay when you receive the product.",
    category: "Payment",
    icon: FiCreditCard,
  },
  {
    question: "Is it safe to pay online?",
    answer:
      "Yes, our payment gateway is fully secure and encrypted. Your payment information is completely safe.",
    category: "Payment",
    icon: FiCreditCard,
  },

  // Return & Refund
  {
    question: "What is the return/replacement policy?",
    answer:
      "We offer return or replacement within 7 days of delivery if there's any issue with the product (defective, damaged, or wrong item).",
    category: "Return & Refund",
    icon: FiRefreshCw,
  },
  {
    question: "How do I request a return?",
    answer:
      "Contact our customer support within 7 days of delivery with your order number and product photos. We'll guide you through the process.",
    category: "Return & Refund",
    icon: FiRefreshCw,
  },
  {
    question: "How long does refund take?",
    answer:
      "Refunds are processed within 5-7 business days after we receive and inspect the returned product.",
    category: "Return & Refund",
    icon: FiRefreshCw,
  },

  // Account & Support
  {
    question: "How do I create an account?",
    answer:
      "Click on the 'Login' button on the top right corner and select 'Create Account'. Fill in your details to register.",
    category: "Account & Support",
    icon: FiUser,
  },
  {
    question: "How can I contact customer support?",
    answer:
      "You can call us at +880 1797 312699, email at support@solidbazzar.com, or use the contact form on our Contact page.",
    category: "Account & Support",
    icon: FiPhone,
  },
  {
    question: "What are your business hours?",
    answer:
      "Saturday - Thursday: 9:00 AM - 10:00 PM. Friday: 3:00 PM - 10:00 PM.",
    category: "Account & Support",
    icon: FiClock,
  },
];

const categories = [
  "All",
  "Order & Delivery",
  "Product & Quality",
  "Payment",
  "Return & Refund",
  "Account & Support",
];

export default function FAQPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFAQs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto mt-4 rounded-3xl bg-linear-to-r from-primary-blue to-primary-gold text-white pt-12 pb-16 md:py-20">
        <div className=" flex flex-col gap-2 justify-center items-center text-center">
          <div className="bg-white/20 rounded-full p-3">
            <FiHelpCircle size={28} />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-sm md:text-base text-white/80 max-w-2xl mx-auto">
            Find answers to common questions about orders, payments, delivery,
            and more.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-gold text-sm"
            />
            <FiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-primary-gold text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-primary-gold/20 border border-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-sm text-gray-500">
            Found {filteredFAQs.length}{" "}
            {filteredFAQs.length === 1 ? "question" : "questions"}
          </p>
        </div>

        {/* FAQs List */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No questions found
            </h3>
            <p className="text-gray-500 text-sm">
              Try adjusting your search or filter
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredFAQs.map((faq, index) => {
              const Icon = faq.icon;
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-8 h-8 bg-primary-gold/10 rounded-lg flex items-center justify-center shrink-0">
                        {Icon && (
                          <Icon size={16} className="text-primary-gold" />
                        )}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm md:text-base">
                        {faq.question}
                      </span>
                    </div>
                    {isOpen ? (
                      <FiChevronUp
                        className="text-gray-400 shrink-0"
                        size={20}
                      />
                    ) : (
                      <FiChevronDown
                        className="text-gray-400 shrink-0"
                        size={20}
                      />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 md:px-5 md:pb-5">
                      <div className="pl-11">
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            Category:
                          </span>
                          <span className="text-xs bg-primary-gold/20 px-2 py-1 rounded-md text-gray-600">
                            {faq.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions */}
        <div className="mt-12 p-6 bg-linear-to-r from-primary-blue/5 to-primary-gold/5 rounded-2xl text-center border border-primary-gold/20">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Still have questions?
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Can&apos;t find the answer you&apos;re looking for? Please contact
            our support team.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-primary-gold text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-highlight transition"
            >
              Contact Us
            </Link>
            <a
              href="tel:+8801797312699"
              className="inline-flex items-center gap-2 border border-primary-gold text-primary-gold px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary-gold hover:text-white transition"
            >
              <FiPhone size={14} />
              Call Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
