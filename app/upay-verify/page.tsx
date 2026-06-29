"use client";

import Image from "next/image";
import { ArrowLeft, X } from "lucide-react";
import { useState } from "react";

export default function UpayVerifyPage() {
  const [trxId, setTrxId] = useState("");

  const copyText = async (text: string) => {
    await navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl border border-gray-200 p-6">
        
        {/* Top Header */}
        <div className="border border-purple-100 rounded-xl px-4 py-5 flex items-center justify-between">
          <button className="text-[#6f88ac]">
            <ArrowLeft size={24} />
          </button>

          <button className="text-[#6f88ac]">
            <X size={26} />
          </button>
        </div>

        {/* Upay Logo */}
        <div className="flex justify-center mt-10">
          <Image
            src="/upay.png"
            alt="upay"
            width={160}
            height={70}
            className="object-contain"
          />
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-2 gap-5 mt-10">
          
          <div className="border border-purple-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center">
              <Image
                src="/store-logo.png"
                alt="store"
                width={40}
                height={40}
              />
            </div>

            <div>
              <h2 className="text-[#5d7598] text-2xl font-semibold">
                Choice2you
              </h2>
            </div>
          </div>

          <div className="border border-purple-100 rounded-xl flex items-center justify-center">
            <h2 className="text-[#5d7598] text-4xl font-bold">
              655 BDT
            </h2>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-5 border border-gray-200 rounded-xl overflow-hidden">
          
          <div className="p-5 border-b border-gray-200 flex gap-3">
            <span className="text-purple-500 text-xl">•</span>
            <p className="text-lg">
              আপনার Upay মোবাইল অ্যাপে যান।
            </p>
          </div>

          <div className="p-5 border-b border-gray-200 flex gap-3">
            <span className="text-purple-500 text-xl">•</span>
            <p className="text-lg">
              <span className="font-bold">Send Money</span> -এ ক্লিক করুন।
            </p>
          </div>

          <div className="p-5 border-b border-gray-200 flex gap-3 items-center justify-between flex-wrap">
            <div className="flex gap-3">
              <span className="text-purple-500 text-xl">•</span>

              <p className="text-lg">
                প্রাপক নম্বর হিসেবে এই নম্বরটি লিখুনঃ{" "}
                <span className="font-bold">01797312699</span>
              </p>
            </div>

            <button
              onClick={() => copyText("01797312699")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              কপি করুন
            </button>
          </div>

          <div className="p-5 border-b border-gray-200 flex gap-3 items-center justify-between flex-wrap">
            <div className="flex gap-3">
              <span className="text-purple-500 text-xl">•</span>

              <p className="text-lg">
                টাকার পরিমাণঃ{" "}
                <span className="font-bold">655 BDT</span>
              </p>
            </div>

            <button
              onClick={() => copyText("655")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              কপি করুন
            </button>
          </div>

          <div className="p-5 border-b border-gray-200 flex gap-3">
            <span className="text-purple-500 text-xl">•</span>

            <p className="text-lg">
              নিশ্চিত করে এখন আপনার Upay পিন লিখুন।
            </p>
          </div>

          <div className="p-5">
            <div className="flex gap-3 mb-4">
              <span className="text-purple-500 text-xl">•</span>

              <p className="text-lg">
                এখন নিচের বক্সে আপনার Transaction ID দিন এবং নিচের Verify বাটনে ক্লিক করুন।
              </p>
            </div>

            <label className="block text-lg font-medium mb-3">
              Transaction ID
            </label>

            <input
              type="text"
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="ট্রানজেকশন আইডি লিখুন"
              className="w-full border border-gray-300 rounded-xl px-4 py-4 text-lg outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Verify Button */}
        <button className="w-full mt-8 bg-purple-500 hover:bg-purple-600 text-white text-2xl font-bold py-5 rounded-xl transition">
          VERIFY
        </button>
      </div>
    </div>
  );
}