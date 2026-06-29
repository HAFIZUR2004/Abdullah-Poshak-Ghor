"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { FiChevronDown, FiTag, FiTrash2 } from "react-icons/fi";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, removeFromCart, updateQuantity, clearCart } =
    useCart();
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const deliveryCharge = cart.length > 0 ? 80 : 0;
  const subtotal = getCartTotal();
  const finalTotal = subtotal + deliveryCharge - discount;

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      alert("আপনার কার্ট খালি। দয়া করে পণ্য যোগ করুন।");
      return;
    }
    // Process order here
    alert("অর্ডার সম্পন্ন হয়েছে! ধন্যবাদ।");
    clearCart();
    router.push("/");
  };

  const applyPromoCode = () => {
    if (promoCode === "SAVE10") {
      setDiscount(subtotal * 0.1);
      alert("প্রোমো কোড প্রয়োগ করা হয়েছে! ১০% ছাড় পেলে।");
    } else if (promoCode === "FREESHIP") {
      setDiscount(deliveryCharge);
      alert("ফ্রি ডেলিভারি প্রয়োগ করা হয়েছে!");
    } else if (promoCode) {
      alert("ভুল প্রোমো কোড।");
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#fafafa] py-8">
        <div className="max-w-[1500px] mx-auto px-5 text-center">
          <div className="bg-white rounded-2xl p-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              আপনার কার্ট খালি
            </h2>
            <p className="text-gray-500 mb-6">
              দয়া করে পণ্য যোগ করুন এবং তারপর চেকআউট করুন।
            </p>
            <button
              onClick={() => router.push("/")}
              className="bg-pink-500 text-white px-6 py-3 rounded-full hover:bg-pink-600 transition"
            >
              শপিং শুরু করুন
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] py-8">
      <div className="max-w-[1500px] mx-auto px-5">
        <h1 className="text-[42px] font-bold text-[#1f2937] mb-6">চেকআউট</h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-5">
          {/* LEFT SIDE - Customer Info */}
          <div className="border border-[#f1d8df] rounded-2xl bg-white p-6">
            <h2 className="text-[28px] font-bold text-[#1f2937] mb-7">
              আপনার তথ্য
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[18px] font-medium mb-2">
                  নাম
                </label>
                <input
                  type="text"
                  placeholder="আপনার পুরো নাম"
                  className="w-full h-[58px] rounded-2xl border border-[#edd7de] px-5 outline-none focus:border-pink-500 text-[18px]"
                />
              </div>
              <div>
                <label className="block text-[18px] font-medium mb-2">
                  ফোন নম্বর
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  className="w-full h-[58px] rounded-2xl border border-[#edd7de] px-5 outline-none focus:border-pink-500 text-[18px]"
                />
              </div>
            </div>

            <div className="border-t border-[#f3dfe5] my-8"></div>

            <h2 className="text-[28px] font-bold text-[#1f2937] mb-6">
              ডেলিভারি ঠিকানা 📍
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[18px] font-medium mb-2">
                  বিভাগ
                </label>
                <div className="relative">
                  <select className="w-full h-[58px] rounded-2xl border border-[#edd7de] px-5 appearance-none outline-none text-[18px] text-gray-500">
                    <option>বিভাগ নির্বাচন করুন</option>
                    <option>ঢাকা</option>
                    <option>চট্টগ্রাম</option>
                    <option>রাজশাহী</option>
                    <option>খুলনা</option>
                    <option>বরিশাল</option>
                    <option>সিলেট</option>
                    <option>রংপুর</option>
                    <option>ময়মনসিংহ</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-[18px] font-medium mb-2">
                  জেলা
                </label>
                <div className="relative">
                  <select className="w-full h-[58px] rounded-2xl border border-[#edd7de] px-5 appearance-none outline-none text-[18px] text-gray-500">
                    <option>জেলা নির্বাচন করুন</option>
                    <option>ঢাকা জেলা</option>
                    <option>গাজীপুর</option>
                    <option>নারায়ণগঞ্জ</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mt-5">
              <div>
                <label className="block text-[18px] font-medium mb-2">
                  থানা / উপজেলা
                </label>
                <div className="relative">
                  <select className="w-full h-[58px] rounded-2xl border border-[#edd7de] px-5 appearance-none outline-none text-[18px] text-gray-500">
                    <option>থানা নির্বাচন করুন</option>
                  </select>
                  <FiChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              <div>
                <label className="block text-[18px] font-medium mb-2">
                  বিস্তারিত ঠিকানা
                </label>
                <input
                  type="text"
                  placeholder="গ্রাম / পোস্ট অফিস / বাড়ি নং / রোড"
                  className="w-full h-[58px] rounded-2xl border border-[#edd7de] px-5 outline-none focus:border-pink-500 text-[18px]"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-[18px] font-medium mb-2">
                📝 অর্ডার নোট (ঐচ্ছিক)
              </label>
              <textarea
                rows={4}
                placeholder="বিশেষ নির্দেশনা, ডেলিভারি সময়, গিফট র‍্যাপ ইত্যাদি..."
                className="w-full rounded-2xl border border-[#edd7de] p-5 outline-none resize-none focus:border-pink-500 text-[18px]"
              />
            </div>

            <div className="border-t border-[#f3dfe5] my-8"></div>

            <h2 className="text-[28px] font-bold text-[#1f2937] mb-6">
              পেমেন্ট পদ্ধতি
            </h2>

            <div className="grid md:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("cod")}
                className={`h-[74px] rounded-2xl border flex items-center px-5 gap-4 transition ${
                  paymentMethod === "cod"
                    ? "border-pink-500 bg-pink-50"
                    : "border-[#edd7de]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "cod"
                      ? "border-pink-500"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "cod" && (
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  )}
                </div>
                <span className="text-[20px] font-medium">
                  💵 ক্যাশ অন ডেলিভারি
                </span>
              </button>

              <button
                onClick={() => setPaymentMethod("online")}
                className={`h-[74px] rounded-2xl border flex items-center px-5 gap-4 transition ${
                  paymentMethod === "online"
                    ? "border-pink-500 bg-pink-50"
                    : "border-[#edd7de]"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    paymentMethod === "online"
                      ? "border-pink-500"
                      : "border-gray-300"
                  }`}
                >
                  {paymentMethod === "online" && (
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[20px] font-medium">
                    🏦 অনলাইন পেমেন্ট
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE - Order Summary */}
          <div className="border border-[#f1d8df] rounded-2xl bg-white p-6 h-fit sticky top-5">
            <h2 className="text-[28px] font-bold text-[#1f2937] mb-6">
              অর্ডার সামারি
            </h2>

            {/* Cart Items */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {cart.map((item) => {
                const productId = (item._id ?? item.id) as string | number;
                return (
                  <div
                    key={productId}
                    className="flex items-start justify-between"
                  >
                    <div className="flex gap-3">
                      <div className="w-[70px] h-[70px] rounded-xl bg-[#fff1f5] flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-[50px]"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-[18px] leading-6">
                          {item.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(productId, item.quantity - 1)
                            }
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            -
                          </button>
                          <span className="font-medium">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateQuantity(productId, item.quantity + 1)
                            }
                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="font-bold text-[20px]">
                      ৳{item.price * item.quantity}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#f3dfe5] my-6"></div>

            {/* Promo Code */}
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="প্রোমো কোড (SAVE10 অথবা FREESHIP)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="flex-1 h-[56px] rounded-2xl border border-[#edd7de] px-5 outline-none text-[16px]"
              />
              <button
                onClick={applyPromoCode}
                className="h-[56px] px-5 rounded-2xl border border-[#edd7de] flex items-center gap-2 text-gray-500 hover:bg-gray-50 transition"
              >
                <FiTag /> Apply
              </button>
            </div>

            {/* Pricing */}
            <div className="mt-7 space-y-4">
              <div className="flex items-center justify-between text-[18px]">
                <span className="text-gray-600">সাবটোটাল</span>
                <span className="font-semibold">৳{subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-[18px]">
                <span className="text-gray-600">ডেলিভারি চার্জ</span>
                <span className="font-semibold">৳{deliveryCharge}</span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-[18px] text-green-600">
                  <span>ডিসকাউন্ট</span>
                  <span>-৳{discount}</span>
                </div>
              )}
            </div>

            <div className="border-t border-[#f3dfe5] my-5"></div>

            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-[30px] font-bold">মোট</span>
              <span className="text-[34px] font-bold text-[#ef4b88]">
                ৳{finalTotal}
              </span>
            </div>

            {/* Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full h-[62px] rounded-2xl bg-[#ef4b88] hover:bg-[#e33f7d] text-white font-bold text-[22px] mt-6 transition transform hover:scale-105"
            >
              অর্ডার করুন
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              অর্ডার করার পর কনফার্মেশনের জন্য কল দেওয়া হবে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
